/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DobleFactorForm } from "../components/doble-factor-form";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/client";
import { fetchCurrentAuthProfile } from "@/modules/gestion-usuarios/services/client-usuarios";

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

jest.mock("@/modules/gestion-usuarios/services/client-usuarios", () => ({
  fetchCurrentAuthProfile: jest.fn(),
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

describe("DobleFactorForm Redirection", () => {
  const originalFetch = global.fetch;
  const mockUser = {
    uid: "user-test-1",
    email: "user@sso.gov",
    getIdToken: jest.fn().mockResolvedValue("mock-id-token"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });
    (auth as any).currentUser = mockUser;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as any);
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const fillOtpAndSubmit = () => {
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i + 1) } });
    });
    fireEvent.click(screen.getByRole("button", { name: /verificar código/i }));
  };

  it("should redirect non-superadmin user to /mis-aplicaciones after OTP verification", async () => {
    (fetchCurrentAuthProfile as jest.Mock).mockResolvedValue({
      uid: "user-test-1",
      email: "user@sso.gov",
      debeCambiarPassword: false,
      isAdmin: false,
      isSuperAdmin: false,
    });

    render(<DobleFactorForm />);

    fillOtpAndSubmit();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/mis-aplicaciones");
    });
  });

  it("should redirect superadmin user to /dashboard after OTP verification", async () => {
    (fetchCurrentAuthProfile as jest.Mock).mockResolvedValue({
      uid: "admin-test-1",
      email: "admin@sso.gov",
      debeCambiarPassword: false,
      isAdmin: true,
      isSuperAdmin: true,
    });

    render(<DobleFactorForm />);

    fillOtpAndSubmit();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });
});
