import { verifyNotasAccess } from "../services/server-notas-auth";
import {
  createNotasServerSession,
  revokeNotasServerSession,
  getNotasSessionCookieHeader,
  getClearNotasSessionCookieHeader,
} from "../services/server-notas-session";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import { AuthorizationError } from "@/lib/auth/server-auth";

jest.mock("@/lib/firebase/admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({ exists: false }),
        update: jest.fn().mockResolvedValue(undefined),
      }),
    }),
  },
  getAdminAuthForProject: jest.fn(),
}));

jest.mock("@/modules/gestion-usuarios/services/server-usuarios", () => ({
  getUsuarioByEmail: jest.fn(),
}));

describe("Notas & SSO Session Isolation Architecture", () => {
  const paulaNotasUser = {
    id: "usr-paula",
    email: "paula.rozo@mineduc.gob.ec",
    nombre: "Paula",
    apellidos: "Rozo",
    documentoIdentificacion: "1720394851",
    active: true,
    sedes: [
      {
        sedeId: "sede-cz9",
        sedeNombre: "Coordinación Zonal 9",
        asignaciones: [
          {
            id: "usra-paula-notas",
            usuarioId: "usr-paula",
            sedeId: "sede-cz9",
            sedeNombre: "Coordinación Zonal 9",
            rolAplicacionId: "ra-notas-doc",
            aplicacionNombre: "Notas",
            rolNombre: "Docente",
            estado: "Activo",
            permisos: ["VER_NOTAS", "REGISTRAR_NOTAS"],
          },
        ],
      },
    ],
  };

  const userWithoutNotas = {
    id: "usr-sin-notas",
    email: "otro@mineduc.gob.ec",
    nombre: "Usuario",
    apellidos: "Sin Notas",
    active: true,
    sedes: [
      {
        sedeId: "sede-cz9",
        asignaciones: [
          {
            id: "asig-other",
            aplicacionNombre: "Geoportal",
            rolNombre: "Consulta",
            estado: "Activo",
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1. Paula with an active SSO Firebase session but NO Notas session is rejected from protected Notas APIs", async () => {
    // Paula envía su token de SSO en Authorization, pero no posee la cookie notas_session
    const requestWithSsoOnly = new Request("http://localhost:3000/api/notas/session", {
      method: "GET",
      headers: {
        Authorization: "Bearer sso-firebase-id-token-for-paula",
      },
    });

    await expect(verifyNotasAccess(requestWithSsoOnly)).rejects.toMatchObject({
      statusCode: 401,
      code: "NOTAS_SESSION_MISSING",
    });
  });

  it("2. Paula completes credentials and 2FA: receives a valid notas_session cookie and enters Notas", async () => {
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(paulaNotasUser);

    const session = await createNotasServerSession({
      uid: "firebase-uid-paula",
      email: "paula.rozo@mineduc.gob.ec",
      usuarioId: "usr-paula",
    });

    const cookieHeader = getNotasSessionCookieHeader(session.token);
    expect(cookieHeader).toContain("notas_session=");
    expect(cookieHeader).toContain("HttpOnly");

    const authenticatedRequest = new Request("http://localhost:3000/api/notas/session", {
      method: "GET",
      headers: {
        Cookie: `notas_session=${session.token}`,
      },
    });

    const context = await verifyNotasAccess(authenticatedRequest);
    expect(context.email).toBe("paula.rozo@mineduc.gob.ec");
    expect(context.nombre).toBe("Paula");
    expect(context.asignacionesNotas).toHaveLength(1);
    expect(context.asignacionesNotas[0].rol).toBe("Docente");
  });

  it("3. Paula logs out of Notas: session is revoked and protected Notas APIs reject subsequent requests", async () => {
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(paulaNotasUser);

    const session = await createNotasServerSession({
      uid: "firebase-uid-paula",
      email: "paula.rozo@mineduc.gob.ec",
      usuarioId: "usr-paula",
    });

    // Revocar sesión en logout de Notas
    await revokeNotasServerSession(session.sessionId);

    const clearHeader = getClearNotasSessionCookieHeader();
    expect(clearHeader).toContain("Max-Age=0");

    const requestAfterLogout = new Request("http://localhost:3000/api/notas/session", {
      method: "GET",
      headers: {
        Cookie: `notas_session=${session.token}`,
      },
    });

    await expect(verifyNotasAccess(requestAfterLogout)).rejects.toMatchObject({
      statusCode: 401,
      code: "NOTAS_SESSION_INVALID",
    });
  });

  it("4. A user with valid credentials but without active Notas assignment is denied access", async () => {
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(userWithoutNotas);

    const session = await createNotasServerSession({
      uid: "uid-sin-notas",
      email: "otro@mineduc.gob.ec",
      usuarioId: "usr-sin-notas",
    });

    const request = new Request("http://localhost:3000/api/notas/session", {
      method: "GET",
      headers: {
        Cookie: `notas_session=${session.token}`,
      },
    });

    await expect(verifyNotasAccess(request)).rejects.toMatchObject({
      statusCode: 403,
      code: "NOTAS_NO_ACTIVE_ASSIGNMENTS",
    });
  });
});
