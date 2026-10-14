import {
  isUserAdminInSSO,
  verifyAdminUser,
  AuthorizationError,
} from "../server-auth";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UsuarioItem } from "@/modules/gestion-usuarios/types/usuario";

jest.mock("@/lib/firebase/admin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
  getAdminAuthForProject: jest.fn(),
}));

describe("server-auth RBAC & Administrative Controls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const superAdminUser: UsuarioItem = {
    id: "usr-admin",
    nombre: "Admin",
    apellidos: "SSO",
    email: "superadmin@mineduc.gob.ec",
    documentoIdentificacion: "1719874563",
    tipoDocumento: "Cédula",
    estado: "Activo",
    active: true,
    fechaCreacion: "01/01/2026",
    sedes: [
      {
        sedeId: "sede-pc",
        sedeNombre: "Planta Central",
        asignaciones: [
          {
            id: "asig-1",
            usuarioId: "usr-admin",
            sedeId: "sede-pc",
            sedeNombre: "Planta Central",
            rolAplicacionId: "ra-sso-sa",
            aplicacionNombre: "SSO",
            rolNombre: "Super Administrador",
            estado: "Activo",
            permisos: [
              {
                recursoCodigo: "ALL-SEC",
                recursoNombre: "Seguridad Global",
                puedeVer: true,
                puedeCrear: true,
                puedeEditar: true,
                puedeEliminar: true,
              },
            ],
          },
        ],
      },
    ],
  };

  const gestorZonalUser: UsuarioItem = {
    id: "usr-gestor",
    nombre: "Gestor",
    apellidos: "Zonal",
    email: "gestor@mineduc.gob.ec",
    documentoIdentificacion: "1719874564",
    tipoDocumento: "Cédula",
    estado: "Activo",
    active: true,
    fechaCreacion: "01/01/2026",
    sedes: [
      {
        sedeId: "sede-cz9",
        sedeNombre: "Coordinación Zonal 9",
        asignaciones: [
          {
            id: "asig-2",
            usuarioId: "usr-gestor",
            sedeId: "sede-cz9",
            sedeNombre: "Coordinación Zonal 9",
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

  const mesaAyudaUser: UsuarioItem = {
    id: "usr-mesa",
    nombre: "Operador",
    apellidos: "Mesa",
    email: "mesa@mineduc.gob.ec",
    documentoIdentificacion: "1719874565",
    tipoDocumento: "Cédula",
    estado: "Activo",
    active: true,
    fechaCreacion: "01/01/2026",
    sedes: [
      {
        sedeId: "sede-pc",
        sedeNombre: "Planta Central",
        asignaciones: [
          {
            id: "asig-3",
            usuarioId: "usr-mesa",
            sedeId: "sede-pc",
            sedeNombre: "Planta Central",
            rolAplicacionId: "ra-sso-ma",
            aplicacionNombre: "SSO",
            rolNombre: "Operador de Mesa de Ayuda",
            estado: "Activo",
            permisos: [
              {
                recursoCodigo: "USR-CONS",
                recursoNombre: "Consulta de Usuarios",
                puedeVer: true,
                puedeCrear: false,
                puedeEditar: false,
                puedeEliminar: false,
              },
            ],
          },
        ],
      },
    ],
  };

  const docenteUser: UsuarioItem = {
    id: "usr-docente",
    nombre: "Docente",
    apellidos: "Prueba",
    email: "docente@mineduc.gob.ec",
    documentoIdentificacion: "1719874566",
    tipoDocumento: "Cédula",
    estado: "Activo",
    active: true,
    fechaCreacion: "01/01/2026",
    sedes: [
      {
        sedeId: "sede-d1701",
        sedeNombre: "Distrito 17D01",
        asignaciones: [
          {
            id: "asig-4",
            usuarioId: "usr-docente",
            sedeId: "sede-d1701",
            sedeNombre: "Distrito 17D01",
            rolAplicacionId: "ra-gd-doc",
            aplicacionNombre: "Gestión Docente",
            rolNombre: "Docente",
            estado: "Activo",
            permisos: [],
          },
        ],
      },
    ],
  };

  describe("isUserAdminInSSO", () => {
    it("should allow Super Administrador to read, write, and delete", () => {
      expect(isUserAdminInSSO(superAdminUser, "read")).toBe(true);
      expect(isUserAdminInSSO(superAdminUser, "write")).toBe(true);
      expect(isUserAdminInSSO(superAdminUser, "delete")).toBe(true);
    });

    it("should allow Gestor Zonal to read and write, but NOT delete", () => {
      expect(isUserAdminInSSO(gestorZonalUser, "read")).toBe(true);
      expect(isUserAdminInSSO(gestorZonalUser, "write")).toBe(true);
      expect(isUserAdminInSSO(gestorZonalUser, "delete")).toBe(false);
    });

    it("should allow Operador de Mesa de Ayuda to read, but NOT write or delete", () => {
      expect(isUserAdminInSSO(mesaAyudaUser, "read")).toBe(true);
      expect(isUserAdminInSSO(mesaAyudaUser, "write")).toBe(false);
      expect(isUserAdminInSSO(mesaAyudaUser, "delete")).toBe(false);
    });

    it("should reject users without SSO assignments for all actions", () => {
      expect(isUserAdminInSSO(docenteUser, "read")).toBe(false);
      expect(isUserAdminInSSO(docenteUser, "write")).toBe(false);
      expect(isUserAdminInSSO(docenteUser, "delete")).toBe(false);
    });

    it("should reject SSO users if their assignment is Inactivo", () => {
      const inactiveAdminUser: UsuarioItem = {
        ...superAdminUser,
        sedes: [
          {
            ...superAdminUser.sedes[0],
            asignaciones: [
              {
                ...superAdminUser.sedes[0].asignaciones[0],
                estado: "Inactivo",
              },
            ],
          },
        ],
      };
      expect(isUserAdminInSSO(inactiveAdminUser, "write")).toBe(false);
    });
  });

  describe("verifyAdminUser", () => {
    it("should authorize requests from active Super Administrador", async () => {
      const request = new Request("http://localhost:3000/api/usuarios", {
        headers: { Authorization: "Bearer valid-token" },
      });

      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: "uid-admin",
        email: superAdminUser.email,
        email_verified: true,
      });

      // Mock Firestore lookup
      const mockQuerySnap = {
        empty: false,
        docs: [{ id: superAdminUser.id, data: () => superAdminUser }],
      };
      (adminDb.collection as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockQuerySnap),
      });

      const authResult = await verifyAdminUser(request, { requiredAction: "write" });
      expect(authResult.usuario.id).toBe(superAdminUser.id);
    });

    it("should reject requests from Mesa de Ayuda when action is write with 403", async () => {
      const request = new Request("http://localhost:3000/api/usuarios", {
        headers: { Authorization: "Bearer valid-token" },
      });

      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: "uid-mesa",
        email: mesaAyudaUser.email,
        email_verified: true,
      });

      const mockQuerySnap = {
        empty: false,
        docs: [{ id: mesaAyudaUser.id, data: () => mesaAyudaUser }],
      };
      (adminDb.collection as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockQuerySnap),
      });

      await expect(
        verifyAdminUser(request, { requiredAction: "write" })
      ).rejects.toMatchObject({
        statusCode: 403,
        code: "ADMIN_ACCESS_DENIED",
      });
    });

    it("should reject requests from users without SSO assignment with 403", async () => {
      const request = new Request("http://localhost:3000/api/usuarios", {
        headers: { Authorization: "Bearer valid-token" },
      });

      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: "uid-docente",
        email: docenteUser.email,
        email_verified: true,
      });

      const mockQuerySnap = {
        empty: false,
        docs: [{ id: docenteUser.id, data: () => docenteUser }],
      };
      (adminDb.collection as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockQuerySnap),
      });

      await expect(
        verifyAdminUser(request, { requiredAction: "read" })
      ).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });
});
