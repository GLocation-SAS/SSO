jest.mock("@/lib/firebase/admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
  getAdminAuthForProject: jest.fn(),
}));

import {
  validateExactApplicationAssignment,
  extractActiveApplications,
  isUserSuperAdmin,
} from "../server-auth";
import type { UsuarioItem } from "@/modules/gestion-usuarios/types/usuario";

describe("validateExactApplicationAssignment & extractActiveApplications", () => {
  const activeUserWithNotas: UsuarioItem = {
    id: "usr-1",
    nombre: "Paula",
    apellidos: "Rozo",
    email: "paula.rozo@mineduc.gob.ec",
    tipoDocumento: "Cédula",
    documentoIdentificacion: "1720394851",
    estado: "Activo",
    active: true,
    fechaCreacion: "2026-01-01",
    sedes: [
      {
        sedeId: "sede-central-1",
        sedeNombre: "Sede Central Quito",
        asignaciones: [
          {
            id: "asig-1",
            usuarioId: "usr-1",
            sedeId: "sede-central-1",
            sedeNombre: "Sede Central Quito",
            rolAplicacionId: "ra-notas-doc",
            aplicacionNombre: "Sistema de Notas",
            rolNombre: "Docente",
            estado: "Activo",
            permisos: [],
          },
        ],
      },
    ],
  };

  it("should validate active user with valid Notas assignment, sede and role", () => {
    const result = validateExactApplicationAssignment(activeUserWithNotas, "notas");
    expect(result.isValid).toBe(true);
    expect(result.matchedAssignment?.rolNombre).toBe("Docente");
    expect(result.matchedAssignment?.sedeNombre).toBe("Sede Central Quito");
  });

  it("should reject user if active flag is false", () => {
    const inactiveUser = { ...activeUserWithNotas, active: false };
    const result = validateExactApplicationAssignment(inactiveUser, "notas");
    expect(result.isValid).toBe(false);
  });

  it("should reject user if sede has no valid sedeId", () => {
    const invalidSedeUser: UsuarioItem = {
      ...activeUserWithNotas,
      sedes: [
        {
          sedeId: "",
          sedeNombre: "Sede Vacía",
          asignaciones: activeUserWithNotas.sedes[0].asignaciones,
        },
      ],
    };
    const result = validateExactApplicationAssignment(invalidSedeUser, "notas");
    expect(result.isValid).toBe(false);
  });

  it("should reject user if assignment has no role", () => {
    const noRoleUser: UsuarioItem = {
      ...activeUserWithNotas,
      sedes: [
        {
          sedeId: "sede-1",
          sedeNombre: "Sede 1",
          asignaciones: [
            {
              ...activeUserWithNotas.sedes[0].asignaciones[0],
              rolNombre: "",
              rolAplicacionId: "",
            },
          ],
        },
      ],
    };
    const result = validateExactApplicationAssignment(noRoleUser, "notas");
    expect(result.isValid).toBe(false);
  });

  it("should reject user if assignment estado is Inactivo", () => {
    const inactiveAsigUser: UsuarioItem = {
      ...activeUserWithNotas,
      sedes: [
        {
          sedeId: "sede-1",
          sedeNombre: "Sede 1",
          asignaciones: [
            {
              ...activeUserWithNotas.sedes[0].asignaciones[0],
              estado: "Inactivo",
            },
          ],
        },
      ],
    };
    const result = validateExactApplicationAssignment(inactiveAsigUser, "notas");
    expect(result.isValid).toBe(false);
  });

  it("should correctly extract active applications for standard user", () => {
    const apps = extractActiveApplications(activeUserWithNotas);
    expect(apps).toHaveLength(1);
    expect(apps[0].aplicacionNombre).toBe("Sistema de Notas");
    expect(apps[0].rolNombre).toBe("Docente");
    expect(apps[0].sedeId).toBe("sede-central-1");
  });

  describe("isUserSuperAdmin", () => {
    it("should return true for user with ra-sso-sa assignment in SSO", () => {
      const superAdminUser: UsuarioItem = {
        ...activeUserWithNotas,
        sedes: [
          {
            sedeId: "sede-pc",
            sedeNombre: "Planta Central",
            asignaciones: [
              {
                id: "asig-sa",
                usuarioId: "usr-sa",
                sedeId: "sede-pc",
                sedeNombre: "Planta Central",
                rolAplicacionId: "ra-sso-sa",
                aplicacionNombre: "SSO",
                rolNombre: "Super Administrador",
                estado: "Activo",
                permisos: [],
              },
            ],
          },
        ],
      };
      expect(isUserSuperAdmin(superAdminUser)).toBe(true);
    });

    it("should return false for user with ra-sso-gz (Gestor Zonal de Usuarios)", () => {
      const gestorUser: UsuarioItem = {
        ...activeUserWithNotas,
        sedes: [
          {
            sedeId: "sede-cz",
            sedeNombre: "Coordinación Zonal",
            asignaciones: [
              {
                id: "asig-gz",
                usuarioId: "usr-gz",
                sedeId: "sede-cz",
                sedeNombre: "Coordinación Zonal",
                rolAplicacionId: "ra-sso-gz",
                aplicacionNombre: "SSO",
                rolNombre: "Gestor Zonal de Usuarios",
                estado: "Activo",
                permisos: [],
              },
            ],
          },
        ],
      };
      expect(isUserSuperAdmin(gestorUser)).toBe(false);
    });

    it("should return false for user with only Notas assignment", () => {
      expect(isUserSuperAdmin(activeUserWithNotas)).toBe(false);
    });
  });
});
