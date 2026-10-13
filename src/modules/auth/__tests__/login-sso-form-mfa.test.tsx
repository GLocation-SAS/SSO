/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginSSOForm } from "../components/login-sso-form";
import { useAuth } from "@/hooks/useAuth";
import { fetchAuthProfile } from "../services/auth-client";
import { signInWithEmailAndPassword } from "firebase/auth";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../services/auth-client", () => ({
  fetchAuthProfile: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("@/lib/firebase/client", () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

describe("LoginSSOForm MFA Routing & TargetApp Wiring", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as any);
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("Pending MFA session catch block", () => {
    it("should redirect to /doble-factor by default when MFA is required", async () => {
      const mockUser = { uid: "user-1", email: "test@sso.gov" };
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
      });
      (fetchAuthProfile as jest.Mock).mockRejectedValue(new Error("MFA_REQUIRED: verificación en dos pasos"));

      render(<LoginSSOForm />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/doble-factor");
      });
    });

    it("should redirect to /login-notas/verificar-codigo when targetApp is 'notas'", async () => {
      const mockUser = { uid: "user-notas-1", email: "profesor@notas.gov" };
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
      });
      (fetchAuthProfile as jest.Mock).mockRejectedValue(new Error("MFA_REQUIRED"));

      render(<LoginSSOForm targetApp="notas" />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/login-notas/verificar-codigo");
      });
    });

    it("should respect custom mfaRedirectTo override if provided", async () => {
      const mockUser = { uid: "user-custom-1", email: "custom@sso.gov" };
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
      });
      (fetchAuthProfile as jest.Mock).mockRejectedValue(new Error("MFA_REQUIRED"));

      render(<LoginSSOForm targetApp="notas" mfaRedirectTo="/custom-verify" />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/custom-verify");
      });
    });
  });

  describe("Credentials login OTP dispatch and redirection", () => {
    const mockUserCredential = {
      user: {
        uid: "user-sub-1",
        email: "docente@educacion.gob.ec",
        getIdToken: jest.fn().mockResolvedValue("mock-token-123"),
      },
    };

    it("should dispatch to /api/auth/send-otp and redirect to /doble-factor for standard SSO", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      render(<LoginSSOForm />);

      fireEvent.change(screen.getByLabelText(/correo institucional/i), {
        target: { value: "docente@educacion.gob.ec" },
      });
      fireEvent.change(screen.getByLabelText(/^contraseña/i), {
        target: { value: "Password123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /^iniciar sesión$/i }));

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          "docente@educacion.gob.ec",
          "Password123!"
        );
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/auth/send-otp",
          expect.objectContaining({
            method: "POST",
            headers: { Authorization: "Bearer mock-token-123" },
          })
        );
        expect(mockReplace).toHaveBeenCalledWith("/doble-factor");
      });
    });

    it("should dispatch to /api/notas/auth/send-otp and redirect to /login-notas/verificar-codigo when targetApp is 'notas'", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      render(<LoginSSOForm targetApp="notas" />);

      fireEvent.change(screen.getByLabelText(/correo institucional/i), {
        target: { value: "docente@educacion.gob.ec" },
      });
      fireEvent.change(screen.getByLabelText(/^contraseña/i), {
        target: { value: "Password123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /^iniciar sesión$/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/notas/auth/send-otp",
          expect.objectContaining({
            method: "POST",
            headers: { Authorization: "Bearer mock-token-123" },
          })
        );
        expect(mockReplace).toHaveBeenCalledWith("/login-notas/verificar-codigo");
      });
    });

    it("should use custom mfaSendOtpUrl and mfaRedirectTo when specified", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      render(
        <LoginSSOForm
          targetApp="notas"
          mfaSendOtpUrl="/api/custom/send-otp"
          mfaRedirectTo="/custom/verify"
        />
      );

      fireEvent.change(screen.getByLabelText(/correo institucional/i), {
        target: { value: "docente@educacion.gob.ec" },
      });
      fireEvent.change(screen.getByLabelText(/^contraseña/i), {
        target: { value: "Password123!" },
      });

      fireEvent.click(screen.getByRole("button", { name: /^iniciar sesión$/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/custom/send-otp",
          expect.objectContaining({
            method: "POST",
            headers: { Authorization: "Bearer mock-token-123" },
          })
        );
        expect(mockReplace).toHaveBeenCalledWith("/custom/verify");
      });
    });
  });
});
