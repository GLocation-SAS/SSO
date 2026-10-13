import { POST } from "../route";
import { verifyAuthToken, hasUserApplicationAccess, AuthorizationError } from "@/lib/auth/server-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import { createAndSaveNotasOTP } from "@/modules/notas/services/server-notas-otp";
import { sendNotasOTPEmail } from "@/lib/email/email-service";

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
    verifyAuthToken: jest.fn(),
    hasUserApplicationAccess: jest.fn(),
  };
});

jest.mock("@/modules/gestion-usuarios/services/server-usuarios", () => ({
  getUsuarioByEmail: jest.fn(),
}));

jest.mock("@/modules/notas/services/server-notas-otp", () => ({
  createAndSaveNotasOTP: jest.fn(),
}));

jest.mock("@/lib/email/email-service", () => ({
  sendNotasOTPEmail: jest.fn(),
}));

describe("POST /api/notas/auth/send-otp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if token is missing or invalid", async () => {
    (verifyAuthToken as jest.Mock).mockRejectedValue(
      new AuthorizationError("No autorizado. Token inválido o ausente.", 401, "MISSING_TOKEN")
    );

    const request = new Request("http://localhost:3000/api/notas/auth/send-otp", {
      method: "POST",
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

    const request = new Request("http://localhost:3000/api/notas/auth/send-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("correo");
  });

  it("should return 403 if user is not registered in the system", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "desconocido@mineduc.edu",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/notas/auth/send-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toMatch(/no está registrado/i);
    expect(createAndSaveNotasOTP).not.toHaveBeenCalled();
    expect(sendNotasOTPEmail).not.toHaveBeenCalled();
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
      estado: "Inactivo",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/send-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toMatch(/inactivo/i);
    expect(createAndSaveNotasOTP).not.toHaveBeenCalled();
    expect(sendNotasOTPEmail).not.toHaveBeenCalled();
  });

  it("should return 403 if user has no active Notas assignments", async () => {
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

    const request = new Request("http://localhost:3000/api/notas/auth/send-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toMatch(/permisos|Notas/i);
    expect(hasUserApplicationAccess).toHaveBeenCalledWith(expect.anything(), "notas");
    expect(createAndSaveNotasOTP).not.toHaveBeenCalled();
    expect(sendNotasOTPEmail).not.toHaveBeenCalled();
  });

  it("should generate Notas OTP, dispatch email, and return 200 for active user with Notas access", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-123",
      email: "profesor@mineduc.edu",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      id: "u-profesor",
      email: "profesor@mineduc.edu",
      active: true,
      sedes: [{ sedeId: "s1", asignaciones: [{ aplicacionNombre: "Sistema de Notas", estado: "Activo" }] }],
    });
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(true);
    (createAndSaveNotasOTP as jest.Mock).mockResolvedValue({
      otp: "852963",
      expiresAt: new Date(Date.now() + 300000),
    });
    (sendNotasOTPEmail as jest.Mock).mockResolvedValue({
      messageId: "msg-notas-123",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/send-otp", {
      method: "POST",
      headers: { Authorization: "Bearer valid-token" },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toMatch(/código de verificación enviado/i);
    expect(createAndSaveNotasOTP).toHaveBeenCalledWith("profesor@mineduc.edu");
    expect(sendNotasOTPEmail).toHaveBeenCalledWith("profesor@mineduc.edu", "852963");
  });
});
