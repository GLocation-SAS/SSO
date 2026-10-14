import { verifyNotasAccess } from "../services/server-notas-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import {
  createNotasServerSession,
  signNotasSessionToken,
} from "../services/server-notas-session";

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

describe("server-notas-auth", () => {
  const baseActiveUser = {
    id: "doc-1",
    email: "profesor@mineduc.edu",
    nombre: "Juan",
    apellidos: "Pérez",
    tipoDocumento: "Cédula",
    documentoIdentificacion: "12345678",
    fechaCreacion: "2026-01-01",
    active: true,
    debeCambiarPassword: false,
    sedes: [
      {
        sedeId: "sede-1",
        sedeNombre: "Sede Central",
        asignaciones: [
          {
            id: "asig-1",
            usuarioId: "doc-1",
            sedeId: "sede-1",
            sedeNombre: "Sede Central",
            rolAplicacionId: "ra-1",
            aplicacionNombre: "Sistema de Notas",
            rolNombre: "DOCENTE",
            estado: "Activo",
            permisos: [
              {
                recursoCodigo: "NOTAS",
                recursoNombre: "Notas",
                puedeVer: true,
                puedeCrear: true,
                puedeEditar: true,
                puedeEliminar: false,
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw AuthorizationError (401, NOTAS_SESSION_MISSING) when request lacks notas_session cookie", async () => {
    // Incluso si se envía un token Bearer de Firebase compartido por SSO, debe rechazarse
    const requestWithFirebaseOnly = new Request("http://localhost:3000/api/notas/session", {
      headers: { Authorization: "Bearer shared-sso-firebase-token" },
    });

    await expect(verifyNotasAccess(requestWithFirebaseOnly)).rejects.toMatchObject({
      statusCode: 401,
      code: "NOTAS_SESSION_MISSING",
      message: expect.stringMatching(/No existe una sesión activa en el sistema de Notas/i),
    });
  });

  it("should throw AuthorizationError (401, NOTAS_SESSION_INVALID) when session token is expired or tampered", async () => {
    const expiredToken = signNotasSessionToken("fake-id", Date.now() - 10000);
    const request = new Request("http://localhost:3000/api/notas/session", {
      headers: { Cookie: `notas_session=${expiredToken}` },
    });

    await expect(verifyNotasAccess(request)).rejects.toMatchObject({
      statusCode: 401,
      code: "NOTAS_SESSION_INVALID",
      message: expect.stringMatching(/ha expirado o es inválida/i),
    });
  });

  it("should succeed and return NotasUserContext when valid notas_session cookie is present", async () => {
    const session = await createNotasServerSession({
      uid: "user-123",
      email: "profesor@mineduc.edu",
      usuarioId: "doc-1",
    });

    (getUsuarioByEmail as jest.Mock).mockResolvedValue(baseActiveUser);

    const request = new Request("http://localhost:3000/api/notas/session", {
      headers: { Cookie: `notas_session=${session.token}` },
    });

    const result = await verifyNotasAccess(request);

    expect(result.email).toBe("profesor@mineduc.edu");
    expect(result.nombre).toBe("Juan");
    expect(result.asignacionesNotas).toHaveLength(1);
    expect(result.asignacionesNotas[0].rol).toBe("DOCENTE");
  });

  it("should throw AuthorizationError (403, USER_INACTIVE) when user is marked inactive in backend", async () => {
    const session = await createNotasServerSession({
      uid: "user-inactive",
      email: "inactivo@mineduc.edu",
      usuarioId: "doc-inactivo",
    });

    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      ...baseActiveUser,
      email: "inactivo@mineduc.edu",
      active: false,
    });

    const request = new Request("http://localhost:3000/api/notas/session", {
      headers: { Cookie: `notas_session=${session.token}` },
    });

    await expect(verifyNotasAccess(request)).rejects.toMatchObject({
      statusCode: 403,
      code: "USER_INACTIVE",
    });
  });

  it("should throw AuthorizationError (403, NOTAS_NO_ACTIVE_ASSIGNMENTS) when user lacks active Notas assignments", async () => {
    const session = await createNotasServerSession({
      uid: "user-no-notas",
      email: "sinnotas@mineduc.edu",
      usuarioId: "doc-no-notas",
    });

    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      ...baseActiveUser,
      email: "sinnotas@mineduc.edu",
      sedes: [
        {
          sedeId: "sede-1",
          sedeNombre: "Sede Central",
          asignaciones: [
            {
              id: "asig-other",
              usuarioId: "doc-no-notas",
              sedeId: "sede-1",
              sedeNombre: "Sede Central",
              rolAplicacionId: "ra-other",
              aplicacionNombre: "Biblioteca",
              rolNombre: "LECTOR",
              estado: "Activo",
              permisos: [],
            },
          ],
        },
      ],
    });

    const request = new Request("http://localhost:3000/api/notas/session", {
      headers: { Cookie: `notas_session=${session.token}` },
    });

    await expect(verifyNotasAccess(request)).rejects.toMatchObject({
      statusCode: 403,
      code: "NOTAS_NO_ACTIVE_ASSIGNMENTS",
    });
  });
});
