import { verifyActiveUser, AuthorizationError, hasUserApplicationAccess } from "../server-auth";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

// Mock Firebase Admin
jest.mock("@/lib/firebase/admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
  getAdminAuthForProject: jest.fn(),
}));

describe("verifyActiveUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw 401 AuthorizationError when Authorization header is missing", async () => {
    const request = new Request("http://localhost:3000/api/auth/me");

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 401,
      message: expect.stringContaining("Token inválido o ausente"),
    });
  });

  it("should throw 401 AuthorizationError when token is invalid in Firebase Auth", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer invalid-token" },
    });

    (adminAuth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("Invalid token signature"));

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it("should throw 403 AuthorizationError when email is not verified", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer valid-token" },
    });

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "unverified@example.com",
      email_verified: false,
      firebase: { sign_in_provider: "google.com" },
    });

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 403,
      message: expect.stringContaining("correo no está verificado"),
    });
  });

  it("should throw 403 AuthorizationError when user is not found in Firestore", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer valid-token" },
    });

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "notfound@example.com",
      email_verified: true,
    });

    const mockGet = jest.fn().mockResolvedValue({ empty: true, docs: [] });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 403,
      message: "Tu usuario no está registrado en el sistema.",
    });
  });

  it("should throw 403 AuthorizationError when user exists in Firestore but active is false", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer valid-token" },
    });

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "inactive@example.com",
      email_verified: true,
    });

    const mockUserData = {
      id: "usr-1",
      email: "inactive@example.com",
      nombre: "Juan",
      apellidos: "Perez",
      estado: "Inactivo",
      active: false,
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-1", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 403,
      message: "Tu usuario está inactivo. Contacta con el administrador.",
    });
  });

  it("should throw 403 AuthorizationError when user exists in Firestore but active field is missing or not true", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer valid-token" },
    });

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "missingactive@example.com",
      email_verified: true,
    });

    const mockUserData = {
      id: "usr-2",
      email: "missingactive@example.com",
      nombre: "Carlos",
      apellidos: "Gomez",
      estado: "Pendiente",
      // active field missing
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-2", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("should return decodedToken and usuario when user is registered and active === true", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer valid-token" },
    });

    const mockDecodedToken = {
      uid: "user-123",
      email: "active@example.com",
      email_verified: true,
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-3",
      email: "active@example.com",
      nombre: "Maria",
      apellidos: "Lopez",
      estado: "Activo",
      active: true,
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-3", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    const result = await verifyActiveUser(request);

    expect(result.decodedToken).toEqual(mockDecodedToken);
    expect(result.usuario).toEqual(mockUserData);
    expect(result.usuario.active).toBe(true);
  });

  it("should throw 403 MFA_REQUIRED when sign_in_provider is password and twoFactorVerified is false", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer password-token" },
    });

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: "user-pwd",
      email: "pwd@example.com",
      email_verified: true,
      firebase: { sign_in_provider: "password" },
      twoFactorVerified: false,
    });

    const mockUserData = {
      id: "usr-4",
      email: "pwd@example.com",
      active: true,
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-4", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    await expect(verifyActiveUser(request)).rejects.toThrow(AuthorizationError);
    await expect(verifyActiveUser(request)).rejects.toMatchObject({
      statusCode: 403,
      code: "MFA_REQUIRED",
    });
  });

  it("should succeed when sign_in_provider is password and twoFactorVerified is true", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer password-token" },
    });

    const mockDecodedToken = {
      uid: "user-pwd",
      email: "pwd@example.com",
      email_verified: true,
      firebase: { sign_in_provider: "password" },
      twoFactorVerified: true,
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-4",
      email: "pwd@example.com",
      active: true,
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-4", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    const result = await verifyActiveUser(request);
    expect(result.decodedToken).toEqual(mockDecodedToken);
    expect(result.usuario).toEqual(mockUserData);
  });

  it("should bypass 2FA when sign_in_provider is password but skipTwoFactorCheck is true", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer password-token" },
    });

    const mockDecodedToken = {
      uid: "user-pwd",
      email: "pwd@example.com",
      email_verified: true,
      firebase: { sign_in_provider: "password" },
      twoFactorVerified: false,
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-4",
      email: "pwd@example.com",
      active: true,
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-4", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    const result = await verifyActiveUser(request, { skipTwoFactorCheck: true });
    expect(result.decodedToken).toEqual(mockDecodedToken);
    expect(result.usuario).toEqual(mockUserData);
  });

  it("should succeed when sign_in_provider is password, twoFactorVerified is false, but valid notas_session cookie exists for undefined targetApp", async () => {
    const { signNotasSessionToken } = require("@/modules/notas/services/server-notas-session");
    const validNotasToken = signNotasSessionToken("session-abc", Date.now() + 60000);

    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: "Bearer password-token",
        Cookie: `notas_session=${validNotasToken}`,
      },
    });

    const mockDecodedToken = {
      uid: "user-notas-pwd",
      email: "docente@educacion.gob.ec",
      email_verified: true,
      firebase: { sign_in_provider: "password" },
      twoFactorVerified: false,
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-docente",
      email: "docente@educacion.gob.ec",
      active: true,
      sedes: [
        {
          sedeId: "sede-1",
          asignaciones: [{ estado: "Activo", aplicacionNombre: "notas", rolNombre: "Docente" }],
        },
      ],
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-docente", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({
      where: mockWhere,
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            sessionId: "session-abc",
            email: "docente@educacion.gob.ec",
            active: true,
            expiresAt: Date.now() + 60000,
          }),
        }),
      }),
    });

    const result = await verifyActiveUser(request);
    expect(result.decodedToken).toEqual(mockDecodedToken);
    expect(result.usuario).toEqual(mockUserData);
  });

  it("should succeed when targetApp is 'notas' and valid notas_session cookie exists", async () => {
    const { signNotasSessionToken } = require("@/modules/notas/services/server-notas-session");
    const validNotasToken = signNotasSessionToken("session-xyz", Date.now() + 60000);

    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: "Bearer password-token",
        Cookie: `notas_session=${validNotasToken}`,
      },
    });

    const mockDecodedToken = {
      uid: "user-notas-pwd-2",
      email: "docente@educacion.gob.ec",
      email_verified: true,
      firebase: { sign_in_provider: "password" },
      twoFactorVerified: false,
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-docente-2",
      email: "docente@educacion.gob.ec",
      active: true,
      sedes: [
        {
          sedeId: "sede-1",
          asignaciones: [{ estado: "Activo", aplicacionNombre: "notas", rolNombre: "Docente" }],
        },
      ],
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-docente-2", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({
      where: mockWhere,
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            sessionId: "session-xyz",
            email: "docente@educacion.gob.ec",
            active: true,
            expiresAt: Date.now() + 60000,
          }),
        }),
      }),
    });

    const result = await verifyActiveUser(request, { targetApp: "notas" });
    expect(result.decodedToken).toEqual(mockDecodedToken);
    expect(result.usuario).toEqual(mockUserData);
  });

  it("should throw NOTAS_MFA_REQUIRED when targetApp is 'notas' and notas_session cookie is missing", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer password-token" },
    });

    const mockDecodedToken = {
      uid: "user-notas-pwd-3",
      email: "docente@educacion.gob.ec",
      email_verified: true,
      firebase: { sign_in_provider: "password" },
      twoFactorVerified: false,
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-docente-3",
      email: "docente@educacion.gob.ec",
      active: true,
      sedes: [
        {
          sedeId: "sede-1",
          asignaciones: [{ estado: "Activo", aplicacionNombre: "notas", rolNombre: "Docente" }],
        },
      ],
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-docente-3", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    await expect(verifyActiveUser(request, { targetApp: "notas" })).rejects.toMatchObject({
      statusCode: 403,
      code: "NOTAS_MFA_REQUIRED",
    });
  });

  it("should bypass 2FA when sign_in_provider is google.com", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer google-token" },
    });

    const mockDecodedToken = {
      uid: "user-google",
      email: "google@example.com",
      email_verified: true,
      firebase: { sign_in_provider: "google.com" },
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-5",
      email: "google@example.com",
      active: true,
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-5", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    const result = await verifyActiveUser(request);
    expect(result.decodedToken).toEqual(mockDecodedToken);
  });

  it("should throw 403 APP_ACCESS_DENIED when targetApp is specified and user does not have access", async () => {
    const request = new Request("http://localhost:3000/api/auth/me?app=notas", {
      headers: { Authorization: "Bearer valid-token" },
    });

    const mockDecodedToken = {
      uid: "user-no-app",
      email: "noapp@example.com",
      email_verified: true,
      firebase: { sign_in_provider: "google.com" },
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-no-app",
      email: "noapp@example.com",
      active: true,
      sedes: [
        {
          sedeId: "sede-1",
          sedeNombre: "Planta Central",
          asignaciones: [
            {
              id: "asig-1",
              usuarioId: "usr-no-app",
              sedeId: "sede-1",
              sedeNombre: "Planta Central",
              rolAplicacionId: "ra-1",
              aplicacionNombre: "Portal Administrativo",
              rolNombre: "Operador",
              estado: "Activo",
              permisos: [],
            },
          ],
        },
      ],
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-no-app", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    await expect(
      verifyActiveUser(request, { targetApp: "notas" })
    ).rejects.toThrow(AuthorizationError);

    await expect(
      verifyActiveUser(request, { targetApp: "notas" })
    ).rejects.toMatchObject({
      statusCode: 403,
      code: "APP_ACCESS_DENIED",
      message: "No tienes permisos para acceder a la aplicación Notas.",
    });
  });

  it("should succeed when targetApp is specified and user has active assignment for that app", async () => {
    const request = new Request("http://localhost:3000/api/auth/me?app=notas", {
      headers: { Authorization: "Bearer valid-token" },
    });

    const mockDecodedToken = {
      uid: "user-notas",
      email: "notas@example.com",
      email_verified: true,
      firebase: { sign_in_provider: "google.com" },
    };

    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUserData = {
      id: "usr-notas",
      email: "notas@example.com",
      active: true,
      sedes: [
        {
          sedeId: "sede-1",
          sedeNombre: "Planta Central",
          asignaciones: [
            {
              id: "asig-2",
              usuarioId: "usr-notas",
              sedeId: "sede-1",
              sedeNombre: "Planta Central",
              rolAplicacionId: "ra-2",
              aplicacionNombre: "Sistema de Notas",
              rolNombre: "Docente",
              estado: "Activo",
              permisos: [],
            },
          ],
        },
      ],
    };

    const mockGet = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ id: "usr-notas", data: () => mockUserData }],
    });
    const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
    const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
    (adminDb.collection as jest.Mock).mockReturnValue({ where: mockWhere });

    const result = await verifyActiveUser(request, { targetApp: "notas" });
    expect(result.decodedToken).toEqual(mockDecodedToken);
    expect(result.usuario).toEqual(mockUserData);
  });
});

describe("hasUserApplicationAccess", () => {
  it("should return false when user has no sedes or asignaciones", () => {
    const userWithoutSedes: any = { id: "1", email: "test@test.com" };
    expect(hasUserApplicationAccess(userWithoutSedes, "notas")).toBe(false);
  });

  it("should return false when matching assignment is Inactivo", () => {
    const userInactiveApp: any = {
      id: "1",
      email: "test@test.com",
      sedes: [
        {
          sedeId: "s1",
          sedeNombre: "Central",
          asignaciones: [
            {
              aplicacionNombre: "Notas",
              estado: "Inactivo",
            },
          ],
        },
      ],
    };
    expect(hasUserApplicationAccess(userInactiveApp, "notas")).toBe(false);
  });

  it("should return true when matching assignment is Activo (case-insensitive substring/match)", () => {
    const userActiveApp: any = {
      id: "1",
      email: "test@test.com",
      sedes: [
        {
          sedeId: "s1",
          sedeNombre: "Central",
          asignaciones: [
            {
              aplicacionNombre: "Sistema de Calificaciones y Notas",
              estado: "Activo",
            },
          ],
        },
      ],
    };
    expect(hasUserApplicationAccess(userActiveApp, "notas")).toBe(true);
  });
});

