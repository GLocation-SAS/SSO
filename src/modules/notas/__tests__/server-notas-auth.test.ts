import { verifyNotasAccess } from "../services/server-notas-auth";
import { verifyActiveUser, AuthorizationError } from "@/lib/auth/server-auth";

jest.mock("@/lib/firebase/admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
  getAdminAuthForProject: jest.fn(),
}));

jest.mock("@/lib/auth/server-auth", () => {
  const actual = jest.requireActual("@/lib/auth/server-auth");
  return {
    ...actual,
    verifyActiveUser: jest.fn(),
  };
});

describe("server-notas-auth", () => {
  const mockRequest = new Request("http://localhost:3000/api/notas/session", {
    headers: { Authorization: "Bearer valid-token" },
  });

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

  it("should pass skipTwoFactorCheck: true to verifyActiveUser", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: {
        uid: "user-123",
        email: "profesor@mineduc.edu",
        firebase: { sign_in_provider: "google.com" },
      },
      usuario: baseActiveUser,
    });

    await verifyNotasAccess(mockRequest);

    expect(verifyActiveUser).toHaveBeenCalledWith(mockRequest, {
      targetApp: "notas",
      skipTwoFactorCheck: true,
    });
  });

  it("should throw AuthorizationError (403, NOTAS_MFA_REQUIRED) when password user lacks notasTwoFactorVerified", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: {
        uid: "user-pwd-1",
        email: "profesor@mineduc.edu",
        firebase: { sign_in_provider: "password" },
        notasTwoFactorVerified: false,
      },
      usuario: baseActiveUser,
    });

    await expect(verifyNotasAccess(mockRequest)).rejects.toMatchObject({
      statusCode: 403,
      code: "NOTAS_MFA_REQUIRED",
      message: "Se requiere completar la verificación en dos pasos de Notas.",
    });
  });

  it("should succeed when password user has notasTwoFactorVerified: true", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: {
        uid: "user-pwd-1",
        email: "profesor@mineduc.edu",
        firebase: { sign_in_provider: "password" },
        notasTwoFactorVerified: true,
      },
      usuario: baseActiveUser,
    });

    const result = await verifyNotasAccess(mockRequest);

    expect(result.uid).toBe("user-pwd-1");
    expect(result.email).toBe("profesor@mineduc.edu");
    expect(result.nombre).toBe("Juan");
    expect(result.asignacionesNotas).toHaveLength(1);
    expect(result.asignacionesNotas[0].rol).toBe("DOCENTE");
  });

  it("should succeed for Google OAuth user without requiring notasTwoFactorVerified", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: {
        uid: "user-google-1",
        email: "profesor@mineduc.edu",
        firebase: { sign_in_provider: "google.com" },
      },
      usuario: baseActiveUser,
    });

    const result = await verifyNotasAccess(mockRequest);

    expect(result.uid).toBe("user-google-1");
    expect(result.asignacionesNotas).toHaveLength(1);
  });

  it("should throw AuthorizationError when user has no active Notas assignments", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: {
        uid: "user-123",
        email: "otro@mineduc.edu",
        firebase: { sign_in_provider: "google.com" },
      },
      usuario: {
        ...baseActiveUser,
        sedes: [
          {
            sedeId: "sede-1",
            sedeNombre: "Sede Central",
            asignaciones: [
              {
                id: "asig-2",
                usuarioId: "doc-2",
                sedeId: "sede-1",
                sedeNombre: "Sede Central",
                rolAplicacionId: "ra-2",
                aplicacionNombre: "Biblioteca",
                rolNombre: "LECTOR",
                estado: "Activo",
                permisos: [],
              },
            ],
          },
        ],
      },
    });

    await expect(verifyNotasAccess(mockRequest)).rejects.toMatchObject({
      statusCode: 403,
      code: "NOTAS_NO_ACTIVE_ASSIGNMENTS",
    });
  });

  it("should propagate AuthorizationError when user is inactive in verifyActiveUser", async () => {
    (verifyActiveUser as jest.Mock).mockRejectedValue(
      new AuthorizationError("Tu usuario está inactivo. Contacta con el administrador.", 403, "USER_INACTIVE")
    );

    await expect(verifyNotasAccess(mockRequest)).rejects.toMatchObject({
      statusCode: 403,
      code: "USER_INACTIVE",
    });
  });
});
