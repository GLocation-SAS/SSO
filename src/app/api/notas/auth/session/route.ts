import { NextResponse } from "next/server";
import {
  verifyAuthToken,
  hasUserApplicationAccess,
  isUserSuperAdmin,
  AuthorizationError,
} from "@/lib/auth/server-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import {
  createNotasServerSession,
  getNotasSessionCookieHeader,
} from "@/modules/notas/services/server-notas-session";

export interface CreateNotasSessionResponse {
  success?: boolean;
  message?: string;
  error?: string;
  code?: string;
}

export async function POST(request: Request) {
  let decodedToken;
  try {
    decodedToken = await verifyAuthToken(request);
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "No autorizado. Token inválido o ausente.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const email = decodedToken.email;
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json(
      { error: "No se encontró un correo electrónico válido en la sesión.", code: "NO_EMAIL" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // 1. Validar existencia y estado activo del usuario en Firestore
    const usuario = await getUsuarioByEmail(normalizedEmail);
    if (!usuario) {
      return NextResponse.json(
        { error: "Tu usuario no está registrado en el sistema.", code: "USER_NOT_REGISTERED" },
        { status: 403 }
      );
    }

    const isActive =
      usuario.active === true ||
      (usuario.active === undefined &&
        typeof usuario.estado === "string" &&
        usuario.estado.trim().toLowerCase() === "activo");

    if (!isActive) {
      return NextResponse.json(
        { error: "Tu usuario está inactivo. Contacta con el administrador.", code: "USER_INACTIVE" },
        { status: 403 }
      );
    }

    // 2. Validar que posea asignaciones activas para el sistema de Notas o sea Super Admin
    const hasNotasAccess = hasUserApplicationAccess(usuario, "notas") || isUserSuperAdmin(usuario);
    if (!hasNotasAccess) {
      return NextResponse.json(
        {
          error: "No tienes permisos para acceder a la aplicación Notas.",
          code: "NOTAS_NO_ACTIVE_ASSIGNMENTS",
        },
        { status: 403 }
      );
    }

    // 3. Crear sesión aislada de servidor para Notas
    const session = await createNotasServerSession({
      uid: decodedToken.uid,
      email: normalizedEmail,
      usuarioId: usuario.id,
    });

    const response = NextResponse.json({
      success: true,
      message: "Sesión de Notas iniciada correctamente.",
    });

    response.headers.set("Set-Cookie", getNotasSessionCookieHeader(session.token));
    return response;
  } catch (error: any) {
    console.error("Error al crear sesión directa de Notas:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al iniciar sesión en Notas.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
