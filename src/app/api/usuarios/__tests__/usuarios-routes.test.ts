import { POST as postUsuarios, GET as getUsuariosRoute } from "../route";
import { PUT as putUsuarioRoute, DELETE as deleteUsuarioRoute } from "../[id]/route";
import * as serverAuthModule from "@/lib/auth/server-auth";
import * as serverUsuariosModule from "@/modules/gestion-usuarios/services/server-usuarios";
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

jest.mock("@/lib/auth/server-auth", () => {
  class MockAuthorizationError extends Error {
    statusCode: number;
    code?: string;
    constructor(message: string, statusCode = 403, code?: string) {
      super(message);
      this.name = "AuthorizationError";
      this.statusCode = statusCode;
      this.code = code;
    }
  }

  return {
    AuthorizationError: MockAuthorizationError,
    verifyAdminUser: jest.fn(),
    verifyActiveUser: jest.fn(),
    isUserAdminInSSO: jest.fn(),
  };
});

jest.mock("@/modules/gestion-usuarios/services/server-usuarios", () => ({
  getUsuarios: jest.fn(),
  createUsuario: jest.fn(),
  updateUsuario: jest.fn(),
  deleteUsuario: jest.fn(),
}));

describe("API Routes /api/usuarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validAdminPayload = {
    nombre: "Juan Carlos",
    apellidos: "Pérez Gómez",
    tipoDocumento: "Cédula",
    documentoIdentificacion: "1719874563",
    email: "juan.perez@mineduc.gob.ec",
    telefono: "+593991234567",
    cargo: "Docente",
    estado: "Activo",
    sedes: [
      {
        sedeId: "sede-pc",
        sedeNombre: "Planta Central",
        asignaciones: [
          {
            aplicacionNombre: "SSO",
            rolNombre: "Super Administrador",
            estado: "Activo",
          },
        ],
      },
    ],
  };

  describe("POST /api/usuarios", () => {
    it("should return 401/403 when authorization fails", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockRejectedValue(
        new AuthorizationError("No autorizado", 403, "ADMIN_ACCESS_DENIED")
      );

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify(validAdminPayload),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.code).toBe("ADMIN_ACCESS_DENIED");
    });

    it("should return 400 when required fields are missing", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          nombre: "",
          apellidos: "Perez",
          email: "perez@test.com",
          documentoIdentificacion: "1719874563",
        }),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Faltan campos obligatorios");
    });

    it("should return 400 when email format is invalid", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          ...validAdminPayload,
          email: "invalid-email-format",
        }),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("formato del correo electrónico es inválido");
    });

    it("should return 400 when document identification format is invalid", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          ...validAdminPayload,
          documentoIdentificacion: "123", // less than 5 digits
        }),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("entre 5 y 20 dígitos numéricos");
    });

    it("should return 400 when sedes array is empty", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          ...validAdminPayload,
          sedes: [],
        }),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("al menos una sede");
    });

    it("should return 400 when sede does not exist in catalog", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          ...validAdminPayload,
          sedes: [
            {
              sedeId: "inexistente",
              sedeNombre: "Sede Inventada",
              asignaciones: [],
            },
          ],
        }),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("no existe en el catálogo");
    });

    it("should return 400 when application or role does not match catalog", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify({
          ...validAdminPayload,
          sedes: [
            {
              sedeId: "sede-pc",
              sedeNombre: "Planta Central",
              asignaciones: [
                {
                  aplicacionNombre: "SSO",
                  rolNombre: "Rol Falso",
                },
              ],
            },
          ],
        }),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("no es válido para la aplicación");
    });

    it("should return 409 when email already exists", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const error: any = new Error("El correo electrónico ya se encuentra registrado.");
      error.statusCode = 409;
      error.code = "EMAIL_ALREADY_EXISTS";
      (serverUsuariosModule.createUsuario as jest.Mock).mockRejectedValue(error);

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify(validAdminPayload),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.code).toBe("EMAIL_ALREADY_EXISTS");
    });

    it("should return 201 on valid submission and persist user", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const createdUser = {
        id: "usr-new-123",
        ...validAdminPayload,
      };
      (serverUsuariosModule.createUsuario as jest.Mock).mockResolvedValue(createdUser);

      const request = new Request("http://localhost:3000/api/usuarios", {
        method: "POST",
        body: JSON.stringify(validAdminPayload),
      });

      const response = await postUsuarios(request);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBe("usr-new-123");
    });
  });

  describe("PUT /api/usuarios/[id]", () => {
    it("should return 409 when update produces a duplicate conflict", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const error: any = new Error("El documento de identificación ya se encuentra registrado.");
      error.statusCode = 409;
      error.code = "DOCUMENT_ALREADY_EXISTS";
      (serverUsuariosModule.updateUsuario as jest.Mock).mockRejectedValue(error);

      const request = new Request("http://localhost:3000/api/usuarios/usr-1", {
        method: "PUT",
        body: JSON.stringify({ documentoIdentificacion: "1719874563" }),
      });

      const response = await putUsuarioRoute(request, {
        params: Promise.resolve({ id: "usr-1" }),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.code).toBe("DOCUMENT_ALREADY_EXISTS");
    });

    it("should return 200 on successful update", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });

      const updatedUser = { id: "usr-1", nombre: "Nombre Actualizado" };
      (serverUsuariosModule.updateUsuario as jest.Mock).mockResolvedValue(updatedUser);

      const request = new Request("http://localhost:3000/api/usuarios/usr-1", {
        method: "PUT",
        body: JSON.stringify({ nombre: "Nombre Actualizado" }),
      });

      const response = await putUsuarioRoute(request, {
        params: Promise.resolve({ id: "usr-1" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.nombre).toBe("Nombre Actualizado");
    });
  });

  describe("DELETE /api/usuarios/[id]", () => {
    it("should return 403 when user is not authorized to delete", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockRejectedValue(
        new AuthorizationError("No tienes permisos de eliminación", 403, "ADMIN_ACCESS_DENIED")
      );

      const request = new Request("http://localhost:3000/api/usuarios/usr-1", {
        method: "DELETE",
      });

      const response = await deleteUsuarioRoute(request, {
        params: Promise.resolve({ id: "usr-1" }),
      });

      expect(response.status).toBe(403);
    });

    it("should return 200 on successful deletion", async () => {
      (serverAuthModule.verifyAdminUser as jest.Mock).mockResolvedValue({
        decodedToken: { uid: "admin-uid" },
        usuario: { id: "admin-id" },
      });
      (serverUsuariosModule.deleteUsuario as jest.Mock).mockResolvedValue(true);

      const request = new Request("http://localhost:3000/api/usuarios/usr-1", {
        method: "DELETE",
      });

      const response = await deleteUsuarioRoute(request, {
        params: Promise.resolve({ id: "usr-1" }),
      });

      expect(response.status).toBe(200);
    });
  });
});
