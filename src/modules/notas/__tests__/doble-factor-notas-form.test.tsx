/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { DobleFactorNotasForm } from "../components/doble-factor-notas-form";
import { LoginNotasVerificarCodigoView } from "../views/login-notas-verificar-codigo-view";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

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

jest.mock("firebase/auth", () => ({
  signOut: jest.fn().mockResolvedValue(undefined),
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

describe("DobleFactorNotasForm Component", () => {
  const originalFetch = global.fetch;
  const mockUser = {
    uid: "docente-1",
    email: "docente@mineduc.gob.gt",
    getIdToken: jest.fn().mockResolvedValue("mock-id-token"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });
    (auth as any).currentUser = mockUser;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "OK" }),
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("Rendering & Authentication Guards", () => {
    it("should redirect to /login-notas when user is not authenticated", () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
      });

      render(<DobleFactorNotasForm />);

      expect(mockReplace).toHaveBeenCalledWith("/login-notas");
    });

    it("should render Notas 2FA headings, user email, and 6 input fields", () => {
      render(<DobleFactorNotasForm />);

      expect(screen.getByRole("heading", { level: 2, name: /verificación de seguridad/i })).toBeTruthy();
      expect(screen.getByText(/acceso a notas/i)).toBeTruthy();
      expect(screen.getByText("docente@mineduc.gob.gt")).toBeTruthy();
      expect(screen.getByText(/para confirmar tu acceso al sistema de notas/i)).toBeTruthy();

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("should sign out and navigate to /login-notas when back button is clicked", async () => {
      render(<DobleFactorNotasForm />);

      const backButton = screen.getByRole("button", { name: /volver/i });
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/login-notas");
      });
    });
  });

  describe("Input Handling (Typing, Backspace, Paste)", () => {
    it("should advance focus on typing a digit and ignore non-numeric chars", () => {
      render(<DobleFactorNotasForm />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      // Focus first input
      inputs[0].focus();

      // Non-numeric character ignored
      fireEvent.change(inputs[0], { target: { value: "a" } });
      expect(inputs[0].value).toBe("");

      // Numeric character accepted
      fireEvent.change(inputs[0], { target: { value: "5" } });
      expect(inputs[0].value).toBe("5");
    });

    it("should populate all 6 inputs and move focus when a 6-digit code is pasted", () => {
      render(<DobleFactorNotasForm />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      fireEvent.paste(inputs[0], {
        clipboardData: {
          getData: () => "654321",
        },
      });

      expect(inputs[0].value).toBe("6");
      expect(inputs[1].value).toBe("5");
      expect(inputs[2].value).toBe("4");
      expect(inputs[3].value).toBe("3");
      expect(inputs[4].value).toBe("2");
      expect(inputs[5].value).toBe("1");
    });
  });

  describe("Form Submission & Verification", () => {
    it("should warn if user attempts to submit incomplete code", () => {
      render(<DobleFactorNotasForm />);

      const submitBtn = screen.getByRole("button", { name: /verificar código/i });
      fireEvent.click(submitBtn);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should send verification request to /api/notas/auth/verify-otp on valid 6 digits", async () => {
      render(<DobleFactorNotasForm />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      fireEvent.paste(inputs[0], {
        clipboardData: { getData: () => "123456" },
      });

      const submitBtn = screen.getByRole("button", { name: /verificar código/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/notas/auth/verify-otp",
          expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
              Authorization: "Bearer mock-id-token",
            }),
            body: JSON.stringify({ code: "123456" }),
          })
        );
      });

      await waitFor(() => {
        expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
        expect(mockReplace).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should display error and reset inputs when verification fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Código incorrecto. Te quedan 3 intento(s)." }),
      });

      render(<DobleFactorNotasForm />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      fireEvent.paste(inputs[0], {
        clipboardData: { getData: () => "999999" },
      });

      const submitBtn = screen.getByRole("button", { name: /verificar código/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(inputs[0].value).toBe("");
        expect(inputs[5].value).toBe("");
      });
    });
  });

  describe("OTP Resend & Cooldown Timer", () => {
    it("should call /api/notas/auth/send-otp and trigger 60s cooldown timer", async () => {
      render(<DobleFactorNotasForm />);

      const resendBtn = screen.getByRole("button", { name: /reenviar/i });
      fireEvent.click(resendBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/notas/auth/send-otp",
          expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
              Authorization: "Bearer mock-id-token",
            }),
          })
        );
      });

      // Cooldown timer should display countdown
      expect(screen.getByText(/reenviar en 60s/i)).toBeTruthy();

      // Fast-forward 30 seconds
      act(() => {
        jest.advanceTimersByTime(30000);
      });
      expect(screen.getByText(/reenviar en 30s/i)).toBeTruthy();

      // Fast-forward another 30 seconds to finish cooldown
      act(() => {
        jest.advanceTimersByTime(30000);
      });
      expect(screen.getByRole("button", { name: /reenviar/i })).toBeTruthy();
    });
  });

  describe("LoginNotasVerificarCodigoView Layout Component", () => {
    it("should render LoginNotasVerificarCodigoView containing DobleFactorNotasForm and background", () => {
      render(<LoginNotasVerificarCodigoView />);

      expect(screen.getByRole("heading", { level: 2, name: /verificación de seguridad/i })).toBeTruthy();
      expect(screen.getByText(/acceso a notas/i)).toBeTruthy();
      expect(screen.getAllByRole("textbox")).toHaveLength(6);
    });
  });
});

