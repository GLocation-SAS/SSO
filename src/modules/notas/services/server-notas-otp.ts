import "server-only";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import type { Timestamp } from "firebase-admin/firestore";

export interface NotasOTPRecord {
  email: string;
  codeHash: string;
  expiresAt: Date | Timestamp;
  attempts: number;
  maxAttempts: number;
  createdAt: Date | Timestamp;
  verified: boolean;
}

export interface NotasOTPVerificationResult {
  success: boolean;
  error?: string;
  statusCode?: number;
  remainingAttempts?: number;
}

export const NOTAS_OTP_COLLECTION = "notas_otps";
export const NOTAS_OTP_TTL_MINUTES = 5;
export const NOTAS_MAX_ATTEMPTS = 5;

/**
 * Genera un código OTP numérico criptográficamente seguro de 6 dígitos.
 */
export function generateNotasOTP(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Calcula el hash SHA-256 de un código OTP para almacenamiento seguro.
 */
export function hashNotasOTP(otp: string): string {
  return crypto.createHash("sha256").update(otp.trim()).digest("hex");
}

/**
 * Genera, hashea y persiste un OTP con TTL de 5 minutos en la colección dedicada notas_otps.
 */
export async function createAndSaveNotasOTP(
  email: string
): Promise<{ otp: string; expiresAt: Date }> {
  const normalizedEmail = email.trim().toLowerCase();
  const otp = generateNotasOTP();
  const codeHash = hashNotasOTP(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + NOTAS_OTP_TTL_MINUTES * 60 * 1000);

  const otpRecord: NotasOTPRecord = {
    email: normalizedEmail,
    codeHash,
    expiresAt,
    attempts: 0,
    maxAttempts: NOTAS_MAX_ATTEMPTS,
    createdAt: now,
    verified: false,
  };

  await adminDb
    .collection(NOTAS_OTP_COLLECTION)
    .doc(normalizedEmail)
    .set(otpRecord);

  return { otp, expiresAt };
}

/**
 * Extrae la marca de tiempo en milisegundos a partir de distintos formatos admitidos (Date, Firestore Timestamp).
 */
function extractTimestampMs(rawDate: Date | Timestamp | any): number {
  if (!rawDate) return NaN;
  if (typeof rawDate.toMillis === "function") {
    return rawDate.toMillis();
  }
  if (typeof rawDate.toDate === "function") {
    return rawDate.toDate().getTime();
  }
  if (typeof rawDate._seconds === "number") {
    return rawDate._seconds * 1000;
  }
  if (rawDate instanceof Date) {
    return rawDate.getTime();
  }
  return new Date(rawDate).getTime();
}

/**
 * Valida un código OTP contra el registro aislado en la colección notas_otps.
 */
export async function verifyNotasOTP(
  email: string,
  candidateOtp: string
): Promise<NotasOTPVerificationResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const docRef = adminDb.collection(NOTAS_OTP_COLLECTION).doc(normalizedEmail);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return {
      success: false,
      error: "No se encontró ningún código de verificación activo para este correo.",
      statusCode: 400,
    };
  }

  const data = docSnap.data() as NotasOTPRecord;

  if (data.verified) {
    return {
      success: false,
      error: "Este código ya ha sido utilizado. Solicita uno nuevo.",
      statusCode: 400,
    };
  }

  // Comprobar expiración
  const expiresAtMs = extractTimestampMs(data.expiresAt);
  if (isNaN(expiresAtMs) || Date.now() > expiresAtMs) {
    return {
      success: false,
      error: "El código de verificación ha expirado. Solicita uno nuevo.",
      statusCode: 400,
    };
  }

  const maxAttempts = data.maxAttempts || NOTAS_MAX_ATTEMPTS;
  const currentAttempts = data.attempts || 0;

  // Comprobar si ya excedió los intentos máximos permitidos (bloqueo previo)
  if (currentAttempts >= maxAttempts) {
    return {
      success: false,
      error: "Demasiados intentos fallidos. Solicita un nuevo código.",
      statusCode: 423,
      remainingAttempts: 0,
    };
  }

  const candidateHash = hashNotasOTP(candidateOtp);
  if (candidateHash !== data.codeHash) {
    const updatedAttempts = currentAttempts + 1;
    await docRef.update({
      attempts: updatedAttempts,
    });

    const remainingAttempts = Math.max(0, maxAttempts - updatedAttempts);

    if (updatedAttempts >= maxAttempts) {
      return {
        success: false,
        error: "Demasiados intentos fallidos. Has alcanzado el límite de 5 intentos. Solicita un nuevo código.",
        statusCode: 423,
        remainingAttempts: 0,
      };
    }

    return {
      success: false,
      error: `Código incorrecto. Por favor, verifica el código ingresado. Te quedan ${remainingAttempts} intento(s).`,
      statusCode: 400,
      remainingAttempts,
    };
  }

  // Éxito: marcar como verificado inmediatamente
  await docRef.update({
    verified: true,
  });

  return {
    success: true,
    statusCode: 200,
  };
}
