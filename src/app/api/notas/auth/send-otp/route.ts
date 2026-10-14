import { NextResponse } from "next/server";
import {
  verifyAuthToken,
  hasUserApplicationAccess,
  AuthorizationError,
} from "@/lib/auth/server-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import { createAndSaveNotasOTP } from "@/modules/notas/services/server-notas-otp";
import { sendNotasOTPEmail } from "@/lib/email/email-service";

export interface SendNotasOTPResponse {
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

    // 2. Validar que posea asignaciones activas para el sistema de Notas
    const hasNotasAccess = hasUserApplicationAccess(usuario, "notas");
    if (!hasNotasAccess) {
      return NextResponse.json(
        {
          error: "No tienes permisos para acceder a la aplicación Notas.",
          code: "NOTAS_NO_ACTIVE_ASSIGNMENTS",
        },
        { status: 403 }
      );
    }

    // 3. Generar y guardar el OTP en la colección notas_otps
    const { otp } = await createAndSaveNotasOTP(normalizedEmail);

    // 4. Enviar correo transaccional con la plantilla de Notas
    await sendNotasOTPEmail(normalizedEmail, otp);

    return NextResponse.json({
      success: true,
      message: "Código de verificación enviado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al enviar OTP de Notas:", error);
    return NextResponse.json(
      { error: "Error al generar o enviar el código de verificación de Notas.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
