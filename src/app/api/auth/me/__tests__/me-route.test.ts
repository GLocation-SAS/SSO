import { GET } from "../route";
import { verifyActiveUser, AuthorizationError } from "@/lib/auth/server-auth";

jest.mock("@/lib/auth/server-auth", () => ({
  verifyActiveUser: jest.fn(),
  isUserSuperAdmin: jest.fn(),
  extractActiveApplications: jest.fn().mockReturnValue([]),
  validateExactApplicationAssignment: jest.fn().mockReturnValue({ isValid: false }),
  AuthorizationError: class AuthorizationError extends Error {
    statusCode: number;
    code?: string;
    constructor(message: string, statusCode = 403, code?: string) {
      super(message);
      this.name = "AuthorizationError";
      this.statusCode = statusCode;
      this.code = code;
    }
  },
}));

jest.mock("@/modules/notas/services/server-notas-session", () => ({
  extractNotasSessionToken: jest.fn().mockReturnValue(null),
  verifyNotasSessionToken: jest.fn().mockResolvedValue(null),
}));

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should NOT skip 2FA check and should return 403 MFA_REQUIRED when user has not completed 2FA", async () => {
    (verifyActiveUser as jest.Mock).mockRejectedValue(
      new AuthorizationError("Se requiere completar la verificación en dos pasos.", 403, "MFA_REQUIRED")
    );

    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer token-unverified" },
    });

    const response = await GET(request);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.code).toBe("MFA_REQUIRED");
    expect(data.error).toBe("Se requiere completar la verificación en dos pasos.");

    expect(verifyActiveUser).toHaveBeenCalledWith(request, {
      targetApp: undefined,
    });
  });

  it("should return 200 with profile when user has completed 2FA or is verified", async () => {
    (verifyActiveUser as jest.Mock).mockResolvedValue({
      decodedToken: {
        uid: "user-123",
        email: "docente@educacion.gob.ec",
        twoFactorVerified: true,
      },
      usuario: {
        id: "user-123",
        email: "docente@educacion.gob.ec",
        active: true,
      },
    });

    const request = new Request("http://localhost:3000/api/auth/me", {
      headers: { Authorization: "Bearer token-verified" },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.email).toBe("docente@educacion.gob.ec");
    expect(verifyActiveUser).toHaveBeenCalledWith(request, {
      targetApp: undefined,
    });
  });
});
