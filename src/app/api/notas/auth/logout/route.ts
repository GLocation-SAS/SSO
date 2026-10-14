import { NextResponse } from "next/server";
import {
  extractNotasSessionToken,
  revokeNotasServerSession,
  getClearNotasSessionCookieHeader,
} from "@/modules/notas/services/server-notas-session";

export async function POST(request: Request) {
  const token = extractNotasSessionToken(request);
  if (token) {
    await revokeNotasServerSession(token);
  }

  const response = NextResponse.json({
    success: true,
    message: "Sesión de Notas cerrada correctamente.",
  });

  response.headers.set("Set-Cookie", getClearNotasSessionCookieHeader());
  return response;
}
