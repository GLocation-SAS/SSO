/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { LoginNotasView } from "../views/login-notas-view";
import { LoginSSOView } from "../views/login-sso-view";
import { useAuth } from "@/hooks/useAuth";
import { fetchAuthProfile } from "../services/auth-client";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../services/auth-client", () => ({
  fetchAuthProfile: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn().mockResolvedValue(undefined),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock("@/lib/firebase/client", () => ({
  auth: {
    currentUser: null,
  },
}));

describe("LoginViews and Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });
  });

  it("should render LoginSSOView with default institutional branding and descriptions", () => {
    render(<LoginSSOView />);

    expect(screen.getByRole("heading", { level: 1, name: "Conecta MINEDUC" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Iniciar sesión" })).toBeTruthy();
    expect(
      screen.getByText(/Conecta MINEDUC centraliza la administración de accesos y permisos/i)
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Iniciar sesión con Google/i })).toBeTruthy();
  });

  it("should render LoginNotasView with Notas specific titles and description", () => {
    render(<LoginNotasView />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Conecta MINEDUC - Sistema de Notas" })
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Acceso a Notas" })).toBeTruthy();
    expect(
      screen.getByText(/Ingreso exclusivo para la consulta y registro de calificaciones/i)
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Iniciar sesión con Google/i })).toBeTruthy();
  });

  it("should allow custom overrides via config prop in LoginNotasView", () => {
    render(
      <LoginNotasView
        config={{
          title: "Custom Portal Title",
          subtitle: "Ingreso Docentes",
          description: "Portal especial para docentes de notas.",
        }}
      />
    );

    expect(screen.getByRole("heading", { level: 1, name: "Custom Portal Title" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Ingreso Docentes" })).toBeTruthy();
    expect(screen.getByText("Portal especial para docentes de notas.")).toBeTruthy();
  });

  it("should handle session verification for targetApp 'notas' and trigger signout on access denial", async () => {
    const mockUser = { uid: "user-123", email: "unauthorized@notas.com" };
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    (fetchAuthProfile as jest.Mock).mockRejectedValue(
      new Error("No tienes permisos para acceder a la aplicación Notas.")
    );

    render(<LoginNotasView />);

    await waitFor(() => {
      expect(fetchAuthProfile).toHaveBeenCalledWith({ targetApp: "notas" });
    });
  });
});
