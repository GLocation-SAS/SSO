import "server-only";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";

export const NOTAS_SESSION_COOKIE_NAME = "notas_session";
export const NOTAS_SESSION_TTL_SECONDS = 7200; // 2 horas de duración

const NOTAS_SESSION_SECRET =
  process.env.NOTAS_SESSION_SECRET ||
  "mineduc-notas-session-secret-key-2026-prod-isolated";

export interface NotasServerSessionRecord {
  sessionId: string;
  uid: string;
  email: string;
  usuarioId: string;
  active: boolean;
  createdAt: number;
  expiresAt: number;
}

// Caché en memoria para soporte local, pruebas unitarias y resiliencia
const inMemorySessions = new Map<string, NotasServerSessionRecord>();

export function signNotasSessionToken(sessionId: string, expiresAt: number): string {
  const data = `${sessionId}.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", NOTAS_SESSION_SECRET)
    .update(data)
    .digest("hex");
  return `${data}.${signature}`;
}

export function parseAndVerifyNotasSessionToken(
  token: string
): { sessionId: string; expiresAt: number } | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [sessionId, expiresAtStr, signature] = parts;
  const expiresAt = Number(expiresAtStr);
  if (isNaN(expiresAt) || expiresAt <= Date.now()) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", NOTAS_SESSION_SECRET)
    .update(`${sessionId}.${expiresAtStr}`)
    .digest("hex");

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  return { sessionId, expiresAt };
}

export async function createNotasServerSession(params: {
  uid: string;
  email: string;
  usuarioId: string;
}): Promise<{ token: string; sessionId: string; expiresAt: number }> {
  const sessionId = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = now + NOTAS_SESSION_TTL_SECONDS * 1000;

  const record: NotasServerSessionRecord = {
    sessionId,
    uid: params.uid,
    email: params.email.trim().toLowerCase(),
    usuarioId: params.usuarioId,
    active: true,
    createdAt: now,
    expiresAt,
  };

  inMemorySessions.set(sessionId, record);

  try {
    if (adminDb && typeof adminDb.collection === "function") {
      await adminDb.collection("notas_sessions").doc(sessionId).set(record);
    }
  } catch (err) {
    console.warn("[Notas Session] Warning: could not persist to Firestore, relying on signed token:", err);
  }

  const token = signNotasSessionToken(sessionId, expiresAt);
  return { token, sessionId, expiresAt };
}

export async function verifyNotasSessionToken(
  token: string
): Promise<NotasServerSessionRecord | null> {
  const parsed = parseAndVerifyNotasSessionToken(token);
  if (!parsed) return null;

  try {
    if (adminDb && typeof adminDb.collection === "function") {
      const docSnap = await adminDb.collection("notas_sessions").doc(parsed.sessionId).get();
      if (docSnap && typeof docSnap.data === "function" && docSnap.exists) {
        const data = docSnap.data() as NotasServerSessionRecord;
        if (data.active === false || data.expiresAt <= Date.now()) {
          return null;
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("[Notas Session] Warning checking Firestore session, fallback to memory:", err);
  }

  const mem = inMemorySessions.get(parsed.sessionId);
  if (mem && mem.active !== false && mem.expiresAt > Date.now()) {
    return mem;
  }

  return null;
}

export async function revokeNotasServerSession(tokenOrSessionId: string): Promise<boolean> {
  const parsed = parseAndVerifyNotasSessionToken(tokenOrSessionId);
  const sessionId = parsed ? parsed.sessionId : tokenOrSessionId;

  const mem = inMemorySessions.get(sessionId);
  if (mem) {
    mem.active = false;
  }

  try {
    if (adminDb && typeof adminDb.collection === "function") {
      await adminDb.collection("notas_sessions").doc(sessionId).update({ active: false });
    }
    return true;
  } catch (err) {
    console.error("[Notas Session] Error revoking session:", err);
    return false;
  }
}

export function extractNotasSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${NOTAS_SESSION_COOKIE_NAME}=`)) {
        return decodeURIComponent(cookie.substring(NOTAS_SESSION_COOKIE_NAME.length + 1));
      }
    }
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const candidate = authHeader.substring(7).trim();
    if (candidate.split(".").length === 3) {
      return candidate;
    }
  }

  return null;
}

export function getNotasSessionCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${NOTAS_SESSION_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${NOTAS_SESSION_TTL_SECONDS}${
    isProd ? "; Secure" : ""
  }`;
}

export function getClearNotasSessionCookieHeader(): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${NOTAS_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
    isProd ? "; Secure" : ""
  }`;
}

export async function verifyNotasSessionFromCookies(
  token?: string
): Promise<NotasServerSessionRecord | null> {
  if (!token) return null;
  return verifyNotasSessionToken(token);
}
