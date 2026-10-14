import { POST } from "../route";
import {
  verifyAuthToken,
  hasUserApplicationAccess,
  isUserSuperAdmin,
  AuthorizationError,
} from "@/lib/auth/server-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";

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
    isUserSuperAdmin: jest.fn(),
  };
});

jest.mock("@/modules/gestion-usuarios/services/server-usuarios", () => ({
  getUsuarioByEmail: jest.fn(),
}));

describe("POST /api/notas/auth/session (Direct Federated OAuth Session)", () => {
  const activeNotasUser = {
    id: "usr-paula",
    email: "paula.rozo@mineduc.gob.ec",
    active: true,
    sedes: [
      {
        sedeId: "sede-cz9",
        asignaciones: [
          { aplicacionNombre: "Notas", estado: "Activo" },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (isUserSuperAdmin as jest.Mock).mockReturnValue(false);
  });

  it("should return 401 if token is missing or invalid", async () => {
    (verifyAuthToken as jest.Mock).mockRejectedValue(
      new AuthorizationError("No autorizado. Token inválido o ausente.", 401, "MISSING_TOKEN")
    );

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe("MISSING_TOKEN");
  });

  it("should return 400 if token has no email", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "user-no-email",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe("NO_EMAIL");
  });

  it("should return 403 USER_NOT_REGISTERED if user does not exist in Firestore", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "usr-unregistered",
      email: "unknown@mineduc.gob.ec",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.code).toBe("USER_NOT_REGISTERED");
  });

  it("should return 403 USER_INACTIVE if user exists but is inactive", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "usr-inactive",
      email: "inactive@mineduc.gob.ec",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      ...activeNotasUser,
      active: false,
      estado: "Inactivo",
    });

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.code).toBe("USER_INACTIVE");
  });

  it("should return 403 NOTAS_NO_ACTIVE_ASSIGNMENTS if user does not have Notas application assigned", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "usr-no-notas",
      email: "no-notas@mineduc.gob.ec",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      ...activeNotasUser,
      sedes: [],
    });
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(false);

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.code).toBe("NOTAS_NO_ACTIVE_ASSIGNMENTS");
  });

  it("should return 200 and Set-Cookie with notas_session if user is active and assigned to Notas", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "usr-paula",
      email: "paula.rozo@mineduc.gob.ec",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue(activeNotasUser);
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(true);

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("notas_session=");
    expect(setCookie).toContain("HttpOnly");
  });

  it("should return 200 and Set-Cookie for Super Administrator even without explicit Notas assignment", async () => {
    (verifyAuthToken as jest.Mock).mockResolvedValue({
      uid: "usr-superadmin",
      email: "jeimy.mateus@glocation.com.co",
    });
    (getUsuarioByEmail as jest.Mock).mockResolvedValue({
      id: "usr-superadmin",
      email: "jeimy.mateus@glocation.com.co",
      active: true,
      cargo: "Super Administrador",
    });
    (hasUserApplicationAccess as jest.Mock).mockReturnValue(false);
    (isUserSuperAdmin as jest.Mock).mockReturnValue(true);

    const request = new Request("http://localhost:3000/api/notas/auth/session", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(response.headers.get("Set-Cookie")).toContain("notas_session=");
  });
});
