import "server-only";
import {
  verifyActiveUser,
  validateExactApplicationAssignment,
  AuthorizationError,
} from "@/lib/auth/server-auth";
import type { NotasUserContext, NotasAssignment } from "../types/notas";

/**
 * Server-side authorization guard for Notas system.
 * Verifies that the request comes from an authenticated, active user with valid 'notas' assignments.
 */
export async function verifyNotasAccess(request: Request): Promise<NotasUserContext> {
  const { decodedToken, usuario } = await verifyActiveUser(request, {
    targetApp: "notas",
    skipTwoFactorCheck: true,
  });

  const signInProvider =
    decodedToken.firebase?.sign_in_provider || (decodedToken as any).signInProvider;
  if (signInProvider === "password" && !decodedToken.notasTwoFactorVerified) {
    throw new AuthorizationError(
      "Se requiere completar la verificación en dos pasos de Notas.",
      403,
      "NOTAS_MFA_REQUIRED"
    );
  }

  // Exact validation of application, active user status, sede, and role
  const validation = validateExactApplicationAssignment(usuario, "notas");
  if (!validation.isValid) {
    throw new AuthorizationError(
      validation.reason || "No tienes asignaciones activas para el sistema de Notas.",
      403,
      "NOTAS_NO_ACTIVE_ASSIGNMENTS"
    );
  }

  // Extract only assignments related to the Notas application
  const asignacionesNotas: NotasAssignment[] = [];

  if (Array.isArray(usuario.sedes)) {
    for (const sede of usuario.sedes) {
      if (!sede?.sedeId || !Array.isArray(sede?.asignaciones)) continue;
      for (const asig of sede.asignaciones) {
        const isAsigActive =
          asig.estado === "Activo" || (asig as any).activo === true;
        const appName = (asig.aplicacionNombre || "").trim().toLowerCase();
        const appCode = ((asig as any).aplicacionCodigo || (asig as any).codigo || "").trim().toLowerCase();
        const appId = ((asig as any).aplicacionId || "").trim().toLowerCase();

        if (
          isAsigActive &&
          (appName.includes("notas") || appCode.includes("notas") || appId.includes("notas"))
        ) {
          asignacionesNotas.push({
            sedeId: sede.sedeId,
            sedeNombre: sede.sedeNombre || "",
            rol: asig.rolNombre || (asig as any).rol || "DOCENTE",
            estado: "Activo",
            permisos: Array.isArray(asig.permisos) ? asig.permisos : [],
          });
        }
      }
    }
  }

  if (asignacionesNotas.length === 0) {
    throw new AuthorizationError(
      "No tienes asignaciones activas para el sistema de Notas.",
      403,
      "NOTAS_NO_ACTIVE_ASSIGNMENTS"
    );
  }

  const debeCambiarPassword =
    usuario.debeCambiarPassword !== undefined
      ? Boolean(usuario.debeCambiarPassword)
      : Boolean(decodedToken.debeCambiarPassword);

  return {
    uid: decodedToken.uid,
    email: decodedToken.email || "",
    nombre: usuario.nombre || "",
    apellidos: usuario.apellidos || "",
    identificacion: usuario.documentoIdentificacion || usuario.identificacion || "",
    asignacionesNotas,
    debeCambiarPassword,
  };
}
