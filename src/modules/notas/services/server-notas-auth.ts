import "server-only";
import {
  validateExactApplicationAssignment,
  AuthorizationError,
} from "@/lib/auth/server-auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import {
  extractNotasSessionToken,
  verifyNotasSessionToken,
} from "./server-notas-session";
import type { NotasUserContext, NotasAssignment } from "../types/notas";

/**
 * Server-side authorization guard for Notas system.
 * Verifies that the request comes with an active, cryptographically verified Notas server session
 * (notas_session cookie). A general Firebase Auth token from SSO is NOT accepted as proof of a Notas session.
 */
export async function verifyNotasAccess(request: Request): Promise<NotasUserContext> {
  const sessionToken = extractNotasSessionToken(request);
  if (!sessionToken) {
    throw new AuthorizationError(
      "No existe una sesión activa en el sistema de Notas. Se requiere autenticación en /login-notas.",
      401,
      "NOTAS_SESSION_MISSING"
    );
  }

  const session = await verifyNotasSessionToken(sessionToken);
  if (!session) {
    throw new AuthorizationError(
      "La sesión de Notas ha expirado o es inválida. Por favor, inicia sesión nuevamente.",
      401,
      "NOTAS_SESSION_INVALID"
    );
  }

  const usuario = await getUsuarioByEmail(session.email);
  if (!usuario) {
    throw new AuthorizationError(
      "El usuario de la sesión de Notas no está registrado en el sistema.",
      403,
      "USER_NOT_REGISTERED"
    );
  }

  const isActive =
    usuario.active === true ||
    (usuario.active === undefined &&
      typeof usuario.estado === "string" &&
      usuario.estado.trim().toLowerCase() === "activo");

  if (!isActive) {
    throw new AuthorizationError(
      "Tu usuario está inactivo. Contacta con el administrador.",
      403,
      "USER_INACTIVE"
    );
  }

  // Validación exacta de asignación activa a Notas
  const validation = validateExactApplicationAssignment(usuario, "notas");
  if (!validation.isValid) {
    throw new AuthorizationError(
      validation.reason || "No tienes asignaciones activas para el sistema de Notas.",
      403,
      "NOTAS_NO_ACTIVE_ASSIGNMENTS"
    );
  }

  // Extraer asignaciones de Notas
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

  return {
    uid: session.uid || usuario.authUid || usuario.id,
    email: usuario.email || usuario.correo || session.email,
    nombre: usuario.nombre || "",
    apellidos: usuario.apellidos || "",
    identificacion: usuario.documentoIdentificacion || usuario.identificacion || "",
    asignacionesNotas,
    debeCambiarPassword: Boolean(usuario.debeCambiarPassword),
  };
}
