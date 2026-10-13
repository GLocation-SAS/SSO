import {
  generateNotasOTP,
  hashNotasOTP,
  createAndSaveNotasOTP,
  verifyNotasOTP,
  NOTAS_OTP_COLLECTION,
  NOTAS_OTP_TTL_MINUTES,
  NOTAS_MAX_ATTEMPTS,
} from "../services/server-notas-otp";
import { adminDb } from "@/lib/firebase/admin";

jest.mock("@/lib/firebase/admin", () => ({
  adminDb: {
    collection: jest.fn(),
  },
}));

describe("Server Notas OTP Service", () => {
  describe("generateNotasOTP", () => {
    it("should generate a 6-digit numeric string", () => {
      const otp = generateNotasOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it("should generate different codes on subsequent calls", () => {
      const otp1 = generateNotasOTP();
      const otp2 = generateNotasOTP();
      expect(otp1).not.toEqual(otp2);
    });
  });

  describe("hashNotasOTP", () => {
    it("should return consistent 64-char SHA-256 hash", () => {
      const hash1 = hashNotasOTP("123456");
      const hash2 = hashNotasOTP("123456");
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it("should trim code before hashing", () => {
      const hash1 = hashNotasOTP(" 123456 ");
      const hash2 = hashNotasOTP("123456");
      expect(hash1).toBe(hash2);
    });
  });

  describe("createAndSaveNotasOTP", () => {
    let mockDocSet: jest.Mock;
    let mockDoc: jest.Mock;
    let mockCollection: jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
      mockDocSet = jest.fn().mockResolvedValue(undefined);
      mockDoc = jest.fn().mockReturnValue({
        set: mockDocSet,
      });
      mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });
      (adminDb.collection as jest.Mock) = mockCollection;
    });

    it("should save OTP targeting strictly 'notas_otps' collection with docId as normalized email", async () => {
      const email = " DOCENTE.Notas@Mineduc.gob.cl ";
      const result = await createAndSaveNotasOTP(email);

      expect(mockCollection).toHaveBeenCalledWith(NOTAS_OTP_COLLECTION);
      expect(NOTAS_OTP_COLLECTION).toBe("notas_otps");
      expect(mockDoc).toHaveBeenCalledWith("docente.notas@mineduc.gob.cl");

      expect(result.otp).toHaveLength(6);
      expect(/^\d{6}$/.test(result.otp)).toBe(true);

      const expectedHash = hashNotasOTP(result.otp);
      const nowMs = Date.now();
      const fiveMinutesMs = NOTAS_OTP_TTL_MINUTES * 60 * 1000;

      expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(nowMs + fiveMinutesMs - 5000);
      expect(result.expiresAt.getTime()).toBeLessThanOrEqual(nowMs + fiveMinutesMs + 5000);

      expect(mockDocSet).toHaveBeenCalledWith({
        email: "docente.notas@mineduc.gob.cl",
        codeHash: expectedHash,
        attempts: 0,
        maxAttempts: NOTAS_MAX_ATTEMPTS,
        createdAt: expect.any(Date),
        expiresAt: result.expiresAt,
        verified: false,
      });
      expect(NOTAS_MAX_ATTEMPTS).toBe(5);
    });
  });

  describe("verifyNotasOTP", () => {
    let mockDocGet: jest.Mock;
    let mockDocUpdate: jest.Mock;
    let mockDoc: jest.Mock;
    let mockCollection: jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
      mockDocGet = jest.fn();
      mockDocUpdate = jest.fn().mockResolvedValue(undefined);
      mockDoc = jest.fn().mockReturnValue({
        get: mockDocGet,
        update: mockDocUpdate,
      });
      mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });
      (adminDb.collection as jest.Mock) = mockCollection;
    });

    it("should target 'notas_otps' collection with normalized email", async () => {
      mockDocGet.mockResolvedValue({ exists: false });

      await verifyNotasOTP(" DOCENTE@Mineduc.gob.cl ", "123456");

      expect(mockCollection).toHaveBeenCalledWith("notas_otps");
      expect(mockDoc).toHaveBeenCalledWith("docente@mineduc.gob.cl");
    });

    it("should reject when no active OTP record exists", async () => {
      mockDocGet.mockResolvedValue({ exists: false });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "123456");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/no se encontró ningún código/i);
      expect(result.statusCode).toBe(400);
      expect(mockDocUpdate).not.toHaveBeenCalled();
    });

    it("should reject when OTP is already verified / used", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("123456"),
          expiresAt: new Date(Date.now() + 60000),
          attempts: 0,
          maxAttempts: 5,
          verified: true,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "123456");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/ya ha sido utilizado/i);
      expect(result.statusCode).toBe(400);
      expect(mockDocUpdate).not.toHaveBeenCalled();
    });

    it("should reject when OTP has expired", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("123456"),
          expiresAt: new Date(Date.now() - 10000), // 10s expired
          attempts: 0,
          maxAttempts: 5,
          verified: false,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "123456");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/ha expirado/i);
      expect(result.statusCode).toBe(400);
      expect(mockDocUpdate).not.toHaveBeenCalled();
    });

    it("should handle Firestore Timestamp object for expiration", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("123456"),
          expiresAt: { toMillis: () => Date.now() - 5000 },
          attempts: 0,
          maxAttempts: 5,
          verified: false,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "123456");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/ha expirado/i);
    });

    it("should reject and lock out when max attempts (5) already reached", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("123456"),
          expiresAt: new Date(Date.now() + 60000),
          attempts: 5,
          maxAttempts: 5,
          verified: false,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "123456");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/demasiados intentos fallidos/i);
      expect(result.statusCode).toBe(423);
      expect(mockDocUpdate).not.toHaveBeenCalled();
    });

    it("should increment attempts counter on wrong code and return remaining attempts", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("123456"),
          expiresAt: new Date(Date.now() + 60000),
          attempts: 2,
          maxAttempts: 5,
          verified: false,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "999999");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/código incorrecto/i);
      expect(result.remainingAttempts).toBe(2);
      expect(result.statusCode).toBe(400);
      expect(mockDocUpdate).toHaveBeenCalledWith({ attempts: 3 });
    });

    it("should lock out when wrong code reaches 5 attempts", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("123456"),
          expiresAt: new Date(Date.now() + 60000),
          attempts: 4,
          maxAttempts: 5,
          verified: false,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "000000");
      expect(result.success).toBe(false);
      expect(result.remainingAttempts).toBe(0);
      expect(result.statusCode).toBe(423);
      expect(mockDocUpdate).toHaveBeenCalledWith({ attempts: 5 });
    });

    it("should succeed and mark verified: true when valid code is provided", async () => {
      mockDocGet.mockResolvedValue({
        exists: true,
        data: () => ({
          email: "docente@mineduc.gob.cl",
          codeHash: hashNotasOTP("654321"),
          expiresAt: new Date(Date.now() + 60000),
          attempts: 1,
          maxAttempts: 5,
          verified: false,
        }),
      });

      const result = await verifyNotasOTP("docente@mineduc.gob.cl", "654321");
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(mockDocUpdate).toHaveBeenCalledWith({ verified: true });
    });
  });
});
