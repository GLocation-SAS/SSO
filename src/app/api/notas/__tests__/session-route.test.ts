import { GET } from "../session/route";
import { verifyNotasAccess } from "@/modules/notas/services/server-notas-auth";
import { AuthorizationError } from "@/lib/auth/server-auth";

jest.mock("@/lib/firebase/admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
  getAdminAuthForProject: jest.fn(),
}));

jest.mock("@/modules/notas/services/server-notas-auth", () => ({
  verifyNotasAccess: jest.fn(),
}));

describe("GET /api/notas/session", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with session payload when authorized", async () => {
    const mockContext = {
      uid: "user-abc",
      email: "docente@mineduc.edu",
      nombres: "Docente",
      apellidos: "Prueba",
      identificacion: "98765432",
      asignacionesNotas: [
        {
          sedeId: "sede-1",
          sedeNombre: "Sede Norte",
          rol: "DOCENTE",
          estado: "Activo" as const,
          permisos: ["VER_NOTAS"],
        },
      ],
      debeCambiarPassword: false,
    };

    (verifyNotasAccess as jest.Mock).mockResolvedValue(mockContext);

    const request = new Request("http://localhost:3000/api/notas/session", {
      headers: { Authorization: "Bearer test-token" },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(true);
    expect(data.system).toBe("notas");
    expect(data.user.email).toBe("docente@mineduc.edu");
    expect(data.user.asignacionesNotas).toHaveLength(1);
  });

  it("should return 403 when user is not authorized for Notas", async () => {
    (verifyNotasAccess as jest.Mock).mockRejectedValue(
      new AuthorizationError("No tienes permisos para acceder a la aplicación Notas.", 403, "APP_ACCESS_DENIED")
    );

    const request = new Request("http://localhost:3000/api/notas/session");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.code).toBe("APP_ACCESS_DENIED");
  });
});
