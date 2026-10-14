/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserApplicationsView } from "../views/user-applications-view";
import { useAuth } from "@/hooks/useAuth";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("UserApplicationsView", () => {
  const mockLogout = jest.fn().mockResolvedValue(undefined);
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "user-1", email: "docente@mineduc.edu" },
      profile: {
        usuario: { nombre: "Docente", apellidos: "Prueba" },
        assignedApplications: [
          {
            aplicacionId: "app-notas",
            aplicacionCodigo: "notas",
            aplicacionNombre: "Sistema de Notas",
            sedeId: "sede-1",
            sedeNombre: "Sede Principal",
            rolNombre: "Docente",
          },
        ],
      },
      logout: mockLogout,
    });
  });

  it("should render assigned applications and welcome card", () => {
    render(<UserApplicationsView onNavigate={mockNavigate} />);

    expect(screen.getByText("Bienvenido a Conecta MINEDUC")).toBeTruthy();
    expect(screen.getByText("Sistema de Notas")).toBeTruthy();
    expect(screen.getByText("1 disponibles")).toBeTruthy();
  });

  it("should call logout and navigate to /login-notas without keeping token on launch", async () => {
    render(<UserApplicationsView onNavigate={mockNavigate} />);

    const launchButton = screen.getByRole("button", {
      name: /Ingresar a la aplicación/i,
    });
    fireEvent.click(launchButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/login-notas");
    });
  });
});
