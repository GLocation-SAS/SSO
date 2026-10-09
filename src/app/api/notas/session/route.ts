import { NextResponse } from "next/server";
import { verifyNotasAccess } from "@/modules/notas/services/server-notas-auth";
import { AuthorizationError } from "@/lib/auth/server-auth";
import type { NotasSessionResponse } from "@/modules/notas/types/notas";

export async function GET(request: Request) {
  try {
    const notasUser = await verifyNotasAccess(request);

    const response: NotasSessionResponse = {
      authenticated: true,
      user: notasUser,
      system: "notas",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error("Error al validar sesión en BFF de Notas:", error);
    return NextResponse.json(
      { error: "Error interno al verificar la sesión en el sistema de Notas." },
      { status: 500 }
    );
  }
}
