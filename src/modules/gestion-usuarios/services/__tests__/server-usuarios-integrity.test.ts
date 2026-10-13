import {
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuarioByEmail,
  getUsuarioByDocumento,
} from "../server-usuarios";
import { adminDb, adminAuth } from "@/lib/firebase/admin";

jest.mock("@/lib/firebase/admin", () => {
  const mockBatch = {
    delete: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  };

  return {
    adminAuth: {
      deleteUser: jest.fn().mockResolvedValue(undefined),
    },
    adminDb: {
      collection: jest.fn(),
      runTransaction: jest.fn(),
      batch: jest.fn(() => mockBatch),
    },
    getAdminAuthForProject: jest.fn(),
  };
});

describe("server-usuarios Persistence & Relational Integrity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUserData = {
    nombre: "Carlos",
    apellidos: "Andrade",
    tipoDocumento: "Cédula" as const,
    documentoIdentificacion: "1719874563",
    email: "carlos.andrade@mineduc.gob.ec",
    telefono: "+593991234567",
    cargo: "Docente",
    estado: "Activo" as const,
    fechaCreacion: "01/01/2026",
    sedes: [
      {
        sedeId: "sede-pc",
        sedeNombre: "Planta Central",
        asignaciones: [
          {
            id: "asig-temp-1",
            usuarioId: "temp-fake-id",
            sedeId: "sede-pc",
            sedeNombre: "Planta Central",
            rolAplicacionId: "temp-ra-id",
            aplicacionNombre: "SSO",
            rolNombre: "Super Administrador",
            estado: "Activo" as const,
            permisos: [],
          },
        ],
      },
    ],
  };

  it("should generate real user ID and bind it to all embedded asignaciones", async () => {
    const mockUserDocRef = { id: "firestore-real-user-id" };
    const mockEmailIndexRef = { id: "email_carlos.andrade@mineduc.gob.ec" };
    const mockDocIndexRef = { id: "doc_1719874563" };

    (adminDb.collection as jest.Mock).mockImplementation((collectionName: string) => {
      if (collectionName === "usuarios") {
        return {
          doc: jest.fn().mockReturnValue(mockUserDocRef),
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({ empty: true }),
            }),
          }),
        };
      }
      if (collectionName === "usuarios_indices") {
        return {
          doc: jest.fn().mockImplementation((docId: string) => {
            if (docId.startsWith("email_")) return mockEmailIndexRef;
            return mockDocIndexRef;
          }),
        };
      }
      return {};
    });

    // Mock Firestore runTransaction
    (adminDb.runTransaction as jest.Mock).mockImplementation(async (callback) => {
      const transactionMock = {
        get: jest.fn().mockResolvedValue({ exists: false }),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      };
      await callback(transactionMock);
      return transactionMock;
    });

    const result = await createUsuario(validUserData);

    // Verificación 1: ID del usuario
    expect(result.id).toBe("firestore-real-user-id");

    // Verificación 2: Relación interna usuarioId en todas las asignaciones
    expect(result.sedes[0].asignaciones[0].usuarioId).toBe("firestore-real-user-id");

    // Verificación 3: rolAplicacionId canónico desde ROLES_APLICACION
    expect(result.sedes[0].asignaciones[0].rolAplicacionId).toBe("ra-sso-sa");
  });

  it("should throw 409 if email already exists in historical records", async () => {
    (adminDb.collection as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            empty: false,
            docs: [{ id: "existing-user", data: () => ({ email: validUserData.email }) }],
          }),
        }),
      }),
    });

    await expect(createUsuario(validUserData)).rejects.toMatchObject({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
    });
  });

  it("should throw 409 if document already exists in historical records", async () => {
    (adminDb.collection as jest.Mock).mockImplementation((collectionName: string) => ({
      where: jest.fn().mockImplementation((field: string) => {
        if (field === "email") {
          return {
            limit: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({ empty: true }),
            }),
          };
        }
        return {
          limit: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              empty: false,
              docs: [{ id: "existing-doc-user", data: () => ({ documentoIdentificacion: "1719874563" }) }],
            }),
          }),
        };
      }),
    }));

    await expect(createUsuario(validUserData)).rejects.toMatchObject({
      statusCode: 409,
      code: "DOCUMENT_ALREADY_EXISTS",
    });
  });

  it("should execute reads before writes in runTransaction and throw 409 on concurrent index collision", async () => {
    const mockUserDocRef = { id: "firestore-user-2" };
    (adminDb.collection as jest.Mock).mockImplementation((col: string) => {
      if (col === "usuarios") {
        return {
          doc: jest.fn().mockReturnValue(mockUserDocRef),
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({ empty: true }),
            }),
          }),
        };
      }
      return {
        doc: jest.fn().mockReturnValue({ id: "mock-index" }),
      };
    });

    // Simulate concurrent index collision
    (adminDb.runTransaction as jest.Mock).mockImplementation(async (callback) => {
      const transactionMock = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({ usuarioId: "another-competitor-user-id" }),
        }),
        set: jest.fn(),
      };
      await callback(transactionMock);
    });

    await expect(createUsuario(validUserData)).rejects.toMatchObject({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
    });
  });

  it("should delete user and clean up index documents atomically", async () => {
    const mockDocSnap = {
      exists: true,
      data: () => ({
        id: "usr-delete-1",
        email: "delete@mineduc.gob.ec",
        documentoIdentificacion: "1719874563",
        authUid: "auth-uid-1",
      }),
    };

    const mockDocRef = { id: "usr-delete-1" };
    (adminDb.collection as jest.Mock).mockImplementation((col: string) => ({
      doc: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockResolvedValue(mockDocSnap),
      })),
    }));

    const result = await deleteUsuario("usr-delete-1");
    expect(result).toBe(true);

    const batch = (adminDb.batch as jest.Mock)();
    expect(batch.delete).toHaveBeenCalled();
    expect(batch.commit).toHaveBeenCalled();
  });
});
