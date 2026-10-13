/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ProtectedRoute } from "../protected-route";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();
let currentMockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
  usePathname: () => currentMockPathname,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock("@/modules/gestion-usuarios/services/client-usuarios", () => ({
  fetchCurrentAuthProfile: jest.fn(),
}));

describe("ProtectedRoute Component", () => {
  const mockLogout = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    currentMockPathname = "/dashboard";
  });

  it("should show loading spinner while verifying or loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      loading: true,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Contenido Protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Verificando sesión...")).toBeTruthy();
    expect(screen.queryByText("Contenido Protegido")).toBeNull();
  });

  it("should redirect to /login-sso when there is no authenticated user", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Contenido Protegido</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login-sso");
    });
  });

  it("should allow superadmin on /gestion-usuarios route", async () => {
    currentMockPathname = "/gestion-usuarios/usuarios";
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "admin-1", email: "admin@mineduc.gob.ec" },
      profile: {
        uid: "admin-1",
        email: "admin@mineduc.gob.ec",
        isAdmin: true,
        usuario: { id: "usr-admin", active: true },
      },
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Módulo Administrativo de Usuarios</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText("Módulo Administrativo de Usuarios")).toBeTruthy();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should block standard non-admin user on /gestion-usuarios and redirect to /dashboard with toast", async () => {
    currentMockPathname = "/gestion-usuarios/usuarios";
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user-1", email: "docente@mineduc.gob.ec" },
      profile: {
        uid: "user-1",
        email: "docente@mineduc.gob.ec",
        isAdmin: false,
        usuario: { id: "usr-docente", active: true },
      },
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Módulo Administrativo de Usuarios</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Acceso denegado", {
        description: "No tienes permisos administrativos para acceder a este módulo.",
      });
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should allow standard user on authorized /dashboard route", async () => {
    currentMockPathname = "/dashboard";
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user-1", email: "docente@mineduc.gob.ec" },
      profile: {
        uid: "user-1",
        email: "docente@mineduc.gob.ec",
        isAdmin: false,
        usuario: { id: "usr-docente", active: true },
      },
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Dashboard de Usuario</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard de Usuario")).toBeTruthy();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should logout and redirect when user is inactive", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user-inactive", email: "inactive@mineduc.gob.ec" },
      profile: {
        uid: "user-inactive",
        email: "inactive@mineduc.gob.ec",
        isAdmin: false,
        usuario: { id: "usr-inactive", active: false },
      },
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Contenido Protegido</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Acceso denegado", {
        description: "Tu usuario está inactivo. Contacta con el administrador.",
      });
      expect(mockLogout).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/login-sso");
    });
  });

  it("should allow standard non-admin user on /aplicaciones route and trailing slash /aplicaciones/", async () => {
    currentMockPathname = "/aplicaciones/";
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user-standard", email: "user@mineduc.gob.ec" },
      profile: {
        uid: "user-standard",
        email: "user@mineduc.gob.ec",
        isAdmin: false,
        usuario: { id: "usr-docente", active: true },
      },
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Catálogo de Aplicaciones</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText("Catálogo de Aplicaciones")).toBeTruthy();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });


  it("should block standard non-admin user on administrative subroute /aplicaciones/gestion-docente", async () => {
    currentMockPathname = "/aplicaciones/gestion-docente";
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user-standard", email: "user@mineduc.gob.ec" },
      profile: {
        uid: "user-standard",
        email: "user@mineduc.gob.ec",
        isAdmin: false,
        usuario: { id: "usr-docente", active: true },
      },
      loading: false,
      logout: mockLogout,
      refreshProfile: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Detalle Administrativo</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Acceso denegado", {
        description: "No tienes permisos administrativos para acceder a este módulo.",
      });
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });
});


