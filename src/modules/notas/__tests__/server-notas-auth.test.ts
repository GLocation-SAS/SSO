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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return typed NotasUserContext when user has active Notas assignment", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: { uid: "user-123", email: "profesor@mineduc.edu" },
      usuario: {
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
      },
    });

    const result = await verifyNotasAccess(mockRequest);

    expect(result.uid).toBe("user-123");
    expect(result.email).toBe("profesor@mineduc.edu");
    expect(result.nombre).toBe("Juan");
    expect(result.asignacionesNotas).toHaveLength(1);
    expect(result.asignacionesNotas[0].rol).toBe("DOCENTE");
  });

  it("should throw AuthorizationError when user has no active Notas assignments", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: { uid: "user-123", email: "otro@mineduc.edu" },
      usuario: {
        id: "doc-2",
        email: "otro@mineduc.edu",
        nombre: "Otro",
        apellidos: "Usuario",
        tipoDocumento: "Cédula",
        documentoIdentificacion: "87654321",
        fechaCreacion: "2026-01-01",
        active: true,
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

    await expect(verifyNotasAccess(mockRequest)).rejects.toThrow(AuthorizationError);
  });
});
