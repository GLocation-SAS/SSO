import { NextResponse } from "next/server";
import { verifyAuthToken, AuthorizationError } from "@/lib/auth/server-auth";
import { createAndSaveOTP } from "@/lib/auth/otp-service";
import { sendOTPEmail } from "@/lib/email/email-service";
import { adminAuth, getAdminAuthForProject } from "@/lib/firebase/admin";

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
      { error: "No autorizado. Token inválido o ausente." },
      { status: 401 }
    );
  }

  const email = decodedToken.email;
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json(
      { error: "No se encontró un correo electrónico válido en la sesión." },
      { status: 400 }
    );
  }

  try {
    // 1. Invalidar cualquier sesión 2FA previa en Firebase Auth para requerir el nuevo código
    try {
      const authInstance = decodedToken.aud
        ? getAdminAuthForProject(decodedToken.aud)
        : adminAuth;
      await authInstance.setCustomUserClaims(decodedToken.uid, {
        twoFactorVerified: false,
        twoFactorVerifiedAt: 0,
      });
    } catch (claimErr) {
      console.warn("No se pudieron reiniciar los custom claims en send-otp:", claimErr);
    }

    // 2. Generar y guardar el OTP en Firestore
    const { otp } = await createAndSaveOTP(email);

    // 3. Enviar el correo con la plantilla institucional
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "Código de verificación enviado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al enviar OTP:", error);
    return NextResponse.json(
      { error: "Error al generar o enviar el código de verificación." },
      { status: 500 }
    );
  }
}
