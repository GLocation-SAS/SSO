import { POST } from "../route";
import { verifyAuthToken, hasUserApplicationAccess, AuthorizationError } from "@/lib/auth/server-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import { verifyNotasOTP } from "@/modules/notas/services/server-notas-otp";
import { adminAuth } from "@/lib/firebase/admin";

jest.mock("@/lib/firebase/admin", () => {
  const mockAuth = {
    getUser: jest.fn(),
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
    updateUser: jest.fn().mockResolvedValue(undefined),
  };
  return {
    adminAuth: mockAuth,
    getAdminAuthForProject: jest.fn().mockReturnValue(mockAuth),
    adminDb: {
      collection: jest.fn(),
    },
  };
});

jest.mock("@/lib/auth/server-auth", () => {
  const actual = jest.requireActual("@/lib/auth/server-auth");
  return {
    ...actual,
    verifyAuthToken: jest.fn(),
    hasUserApplicationAccess: jest.fn(),
  };
});

jest.mock("@/modules/gestion-usuarios/services/server-usuarios", () => ({
  getUsuarioByEmail: jest.fn(),
}));

jest.mock("@/modules/notas/services/server-notas-otp", () => ({
  verifyNotasOTP: jest.fn(),
}));

describe("POST /api/notas/auth/verify-otp", () => {
  const activeNotasUser = {
    id: "u-profesor",
    email: "docente@mineduc.gob.gt",
    active: true,
    sedes: [
      {
        sedeId: "s1",
        asignaciones: [
          { aplicacionNombre: "Sistema de Notas", estado: "Activo" },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if token is missing or invalid", async () => {
    (verifyAuthToken as jest.Mock).mockRejectedValue(
      new AuthorizationError("No autorizado. Token inválido o ausente.", 401, "MISSING_TOKEN")
    );

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ code: "123456" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toContain("No autorizado");
  });

  it("should return 400 if token has no email", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: undefined,
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "123456" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("correo");
  });

  it("should return 400 if request body is invalid or JSON malformed", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "docente@mineduc.gob.gt",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: "not-json",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/cuerpo de solicitud/i);
  });

  it("should return 400 if code is missing or not 6 digits", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "docente@mineduc.gob.gt",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/6 dígitos/i);
  });

  it("should return 403 if user is not registered in the system", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "desconocido@mineduc.edu",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "123456" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toMatch(/no está registrado/i);
    expect(verifyNotasOTP).not.toHaveBeenCalled();
  });

  it("should return 403 if user is inactive", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "inactivo@mineduc.edu",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      id: "u-inactivo",
      email: "inactivo@mineduc.edu",
      active: false,
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "123456" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toMatch(/inactivo/i);
    expect(verifyNotasOTP).not.toHaveBeenCalled();
  });

  it("should return 403 if user has no active Notas assignment", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "sinnotas@mineduc.edu",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      id: "u-sinnotas",
      email: "sinnotas@mineduc.edu",
      active: true,
      sedes: [],
    });
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(false);

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "123456" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toMatch(/permisos|Notas/i);
    expect(verifyNotasOTP).not.toHaveBeenCalled();
  });

  it("should return 400 with remaining attempts if verifyNotasOTP returns failure", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "docente@mineduc.gob.gt",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(activeNotasUser);
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(true);
    (verifyNotasOTP as jest.Mock).mockResolvedValue({
      success: false,
      statusCode: 400,
      remainingAttempts: 4,
      error: "Código incorrecto. Te quedan 4 intento(s).",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "654321" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Código incorrecto");
    expect(body.remainingAttempts).toBe(4);
    expect(adminAuth.setCustomUserClaims).not.toHaveBeenCalled();
  });

  it("should return 423 when max attempts exceeded (lockout)", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "docente@mineduc.gob.gt",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(activeNotasUser);
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(true);
    (verifyNotasOTP as jest.Mock).mockResolvedValue({
      success: false,
      statusCode: 423,
      remainingAttempts: 0,
      error: "Demasiados intentos fallidos. Has alcanzado el límite de 5 intentos. Solicita un nuevo código.",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "000000" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(423);
    expect(body.error).toContain("Demasiados intentos fallidos");
    expect(adminAuth.setCustomUserClaims).not.toHaveBeenCalled();
  });

  it("should elevate custom claim notasTwoFactorVerified: true while preserving existing claims and not setting SSO twoFactorVerified", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "docente@mineduc.gob.gt",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(activeNotasUser);
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(true);
    (verifyNotasOTP as jest.Mock).mockResolvedValue({
      success: true,
      statusCode: 200,
    });
    (adminAuth.getUser as jest.Mock).mockResolvedValue({
      customClaims: {
        role: "docente",
        debeCambiarPassword: false,
      },
    });

    const request = new Request("http://localhost:3000/api/notas/auth/verify-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
      body: JSON.stringify({ code: "123456" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toMatch(/verificado correctamente/i);

    expect(adminAuth.setCustomUserClaims).toHaveBeenCalledWith("user-123", {
      role: "docente",
      debeCambiarPassword: false,
      notasTwoFactorVerified: true,
    });

    const calledClaims = (adminAuth.setCustomUserClaims as jest.Mock).mock.calls[0][1];
    expect(calledClaims.notasTwoFactorVerified).toBe(true);
    expect(calledClaims.twoFactorVerified).toBeUndefined();
  });
});
