import { NextResponse } from "next/server";
import {
  verifyActiveUser,
  isUserSuperAdmin,
  extractActiveApplications,
  validateExactApplicationAssignment,
  AuthorizationError,
} from "@/lib/auth/server-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetApp = searchParams.get("app") || undefined;

    const { decodedToken, usuario } = await verifyActiveUser(request, { targetApp });

    const debeCambiarPassword =
      usuario.debeCambiarPassword !== undefined
        ? Boolean(usuario.debeCambiarPassword)
        : Boolean(decodedToken.debeCambiarPassword);

    const isSuperAdmin = isUserSuperAdmin(usuario);
    const isAdmin = isSuperAdmin;
    const assignedApplications = extractActiveApplications(usuario);
    const notasValidation = validateExactApplicationAssignment(usuario, "notas");
    const isNotasUser = notasValidation.isValid;
    const signInProvider =
      decodedToken.firebase?.sign_in_provider || (decodedToken as any).signInProvider;
    const hasNotasSession =
      Boolean(decodedToken.notasTwoFactorVerified) ||
      (signInProvider === "google.com" && isNotasUser);

    return NextResponse.json(
      {
        uid: decodedToken.uid,
        email: decodedToken.email,
        debeCambiarPassword,
        isAdmin,
        isSuperAdmin,
        isNotasUser,
        hasNotasSession,
        assignedApplications,
        usuario,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error("Error al obtener perfil del usuario:", error);
    return NextResponse.json(
      { error: "Error interno al verificar la sesión del usuario." },
      { status: 500 }
    );
  }
}
