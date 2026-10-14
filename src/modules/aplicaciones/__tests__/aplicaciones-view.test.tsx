/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AplicacionesView } from "../views/aplicaciones-view";
import { useAuth } from "@/hooks/useAuth";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/routing", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("AplicacionesView Container", () => {
  const mockLogout = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when auth is loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      profile: null,
      loading: true,
      logout: mockLogout,
    });

    const { container } = render(<AplicacionesView />);
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders AdminAplicacionesView for superadmin users", () => {
    (useAuth as jest.Mock).mockReturnValue({
      profile: {
        uid: "admin-1",
        isAdmin: true,
        usuario: { id: "usr-admin", active: true },
      },
      loading: false,
      logout: mockLogout,
    });

    render(<AplicacionesView />);

    // Superadmin header and buttons
    expect(screen.getByText("Gestión de aplicaciones")).toBeTruthy();
    expect(screen.getByText("Nueva aplicación")).toBeTruthy();
  });

  it("renders UserAplicacionesCatalogView for standard non-admin users with assigned apps", () => {
    (useAuth as jest.Mock).mockReturnValue({
      profile: {
        uid: "user-1",
        isAdmin: false,
        usuario: { id: "usr-docente", nombre: "Carlos", apellidos: "Mendoza", active: true },
        assignedApplications: [
          {
            aplicacionId: "notas",
            aplicacionCodigo: "SGN",
            aplicacionNombre: "Sistema de Gestión de Notas",
            sedeId: "sede-central",
            sedeNombre: "Sede Central - Quito",
            rolNombre: "Docente Titular",
          },
        ],
      },
      loading: false,
      logout: mockLogout,
    });

    render(<AplicacionesView />);

    // Standard user view header
    expect(screen.getByText("Mis aplicaciones")).toBeTruthy();
    // Admin button must NOT exist
    expect(screen.queryByText("Nueva aplicación")).toBeNull();

    // Table must show assigned app, venue and role
    expect(screen.getByText("Sistema de Gestión de Notas")).toBeTruthy();
    expect(screen.getByText("Sede Central - Quito")).toBeTruthy();
    expect(screen.getByText("Docente Titular")).toBeTruthy();
    expect(screen.getByText("Ingresar a la aplicación")).toBeTruthy();
  });
});
