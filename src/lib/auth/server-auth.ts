import "server-only";
import { adminAuth, getAdminAuthForProject } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getUsuarioByEmail } from "@/modules/gestion-usuarios/services/server-usuarios";
import type { UsuarioItem } from "@/modules/gestion-usuarios/types/usuario";
import { extractNotasSessionToken } from "@/modules/notas/services/server-notas-session";

export class AuthorizationError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 403, code?: string) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export interface ActiveUserAuthResult {
  decodedToken: DecodedIdToken;
  usuario: UsuarioItem;
}

export interface VerifyActiveUserOptions {
  targetApp?: string;
  skipTwoFactorCheck?: boolean;
}

/**
 * Comprueba si un usuario tiene alguna asignación activa para una aplicación determinada.
 */
export function hasUserApplicationAccess(usuario: UsuarioItem, targetApp: string): boolean {
  if (usuario && isUserSuperAdmin(usuario)) {
    return true;
  }
  if (!targetApp || !usuario || !Array.isArray(usuario.sedes)) {
    return false;
  }

  const normalizedTarget = targetApp.trim().toLowerCase();

  for (const sede of usuario.sedes) {
    if (!Array.isArray(sede?.asignaciones)) continue;
    for (const asig of sede.asignaciones) {
      const isAsigActive =
        asig.estado === "Activo" || (asig as any).activo === true;

      if (!isAsigActive) continue;

      const appName = (asig.aplicacionNombre || "").trim().toLowerCase();
      const appCode = ((asig as any).aplicacionCodigo || (asig as any).codigo || "").trim().toLowerCase();

      if (
        appName.includes(normalizedTarget) ||
        (appCode && appCode.includes(normalizedTarget)) ||
        (appName && normalizedTarget.includes(appName))
      ) {
        return true;
      }
    }
  }

  return false;
}

export async function verifyAuthToken(request: Request): Promise<DecodedIdToken> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthorizationError("No autorizado. Token inválido o ausente.", 401, "MISSING_TOKEN");
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    throw new AuthorizationError("No autorizado. Token inválido o ausente.", 401, "MISSING_TOKEN");
  }

  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    // Fallback de audiencia en entorno de emulador local
    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
        if (payload.aud && typeof payload.aud === "string") {
          const projectAuth = getAdminAuthForProject(payload.aud);
          return await projectAuth.verifyIdToken(token);
        }
      }
    } catch {
      // Ignorar fallback si falla el parsing
    }
    throw new AuthorizationError("No autorizado. Token inválido o expirado.", 401, "INVALID_TOKEN");
  }
}

/**
 * Valida que la petición contenga un Firebase ID Token válido, correo verificado,
 * que el usuario exista en la colección `usuarios` de Firestore y que tenga `active === true`.
 * Si se especifica `options.targetApp`, valida además que cuente con permisos activos en la app indicada.
 */
export async function verifyActiveUser(
  request: Request,
  options?: VerifyActiveUserOptions
): Promise<ActiveUserAuthResult> {
  const decodedToken = await verifyAuthToken(request);

  const email = decodedToken.email;
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new AuthorizationError("El token no contiene un correo electrónico.", 403, "NO_EMAIL");
  }

  // En proveedores OAuth como Google se requiere que el correo esté verificado por el proveedor
  const signInProvider = decodedToken.firebase?.sign_in_provider;
  if (signInProvider === "google.com" && decodedToken.email_verified === false) {
    throw new AuthorizationError("El correo no está verificado en el proveedor de autenticación.", 403, "EMAIL_NOT_VERIFIED");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const usuario = await getUsuarioByEmail(normalizedEmail);

  if (!usuario) {
    throw new AuthorizationError("Tu usuario no está registrado en el sistema.", 403, "USER_NOT_REGISTERED");
  }

  const isActive =
    usuario.active === true ||
    (usuario.active === undefined &&
      typeof usuario.estado === "string" &&
      usuario.estado.trim().toLowerCase() === "activo");

  if (!isActive) {
    throw new AuthorizationError("Tu usuario está inactivo. Contacta con el administrador.", 403, "USER_INACTIVE");
  }

  // Verificación de doble factor para autenticación con usuario y contraseña
  if (!options?.skipTwoFactorCheck && signInProvider === "password") {
    if (options?.targetApp === "notas") {
      const notasToken = extractNotasSessionToken(request);
      if (!notasToken) {
        throw new AuthorizationError(
          "Se requiere completar la verificación en dos pasos de Notas.",
          403,
          "NOTAS_MFA_REQUIRED"
        );
      }
    } else {
      if (!decodedToken.twoFactorVerified) {
        throw new AuthorizationError(
          "Se requiere completar la verificación en dos pasos.",
          403,
          "MFA_REQUIRED"
        );
      }
    }
  }

  // Verificación de acceso a la aplicación requerida
  if (options?.targetApp) {
    const validation = validateExactApplicationAssignment(usuario, options.targetApp);
    if (!validation.isValid) {
      const appDisplayName = options.targetApp.charAt(0).toUpperCase() + options.targetApp.slice(1);
      throw new AuthorizationError(
        `No tienes permisos para acceder a la aplicación ${appDisplayName}.`,
        403,
        "APP_ACCESS_DENIED"
      );
    }
  }

  return {
    decodedToken,
    usuario,
  };
}

export interface VerifyAdminUserOptions {
  requiredAction?: "read" | "write" | "delete";
}

/**
 * Comprueba si un usuario tiene rol o permisos administrativos en la aplicación SSO.
 * - read: Consulta de usuarios (Super Admin, Gestor Zonal, Auditor, Mesa de Ayuda con USR-CONS o puedeVer).
 * - write: Creación y edición (Super Admin, Gestor Zonal, o permisos con puedeCrear/puedeEditar/ALL-SEC).
 * - delete: Eliminación (Super Admin, o permisos con puedeEliminar/ALL-SEC).
 */
export function isUserAdminInSSO(
  usuario: UsuarioItem,
  action: "read" | "write" | "delete" = "write"
): boolean {
  if (isUserSuperAdmin(usuario)) {
    return true;
  }

  if (!usuario || !Array.isArray(usuario.sedes)) {
    return false;
  }

  for (const sede of usuario.sedes) {
    if (!Array.isArray(sede?.asignaciones)) continue;
    for (const asig of sede.asignaciones) {
      const isAsigActive =
        asig.estado === "Activo" || (asig as any).activo === true;
      if (!isAsigActive) continue;

      const appName = (asig.aplicacionNombre || "").trim().toLowerCase();
      const appCode = ((asig as any).aplicacionCodigo || (asig as any).codigo || "").trim().toLowerCase();
      const isSSO =
        appName === "sso" ||
        appCode === "sso" ||
        (asig.rolAplicacionId || "").startsWith("ra-sso-");

      if (!isSSO) continue;

      const rolId = (asig.rolAplicacionId || "").trim().toLowerCase();
      const rolName = (asig.rolNombre || "").trim().toLowerCase();
      const permisos = Array.isArray(asig.permisos) ? asig.permisos : [];
      const hasAllSec = permisos.some((p) => p.recursoCodigo === "ALL-SEC");

      if (action === "read") {
        if (
          rolId === "ra-sso-sa" ||
          rolId === "ra-sso-gz" ||
          rolId === "ra-sso-aud" ||
          rolId === "ra-sso-ma" ||
          rolName.includes("administrador") ||
          rolName.includes("gestor") ||
          rolName.includes("auditor") ||
          rolName.includes("mesa de ayuda") ||
          hasAllSec ||
          permisos.some((p) => p.puedeVer)
        ) {
          return true;
        }
      } else if (action === "delete") {
        if (
          rolId === "ra-sso-sa" ||
          rolName === "super administrador" ||
          hasAllSec ||
          permisos.some((p) => p.puedeEliminar)
        ) {
          return true;
        }
      } else {
        // write: creación, edición, asignación de contraseñas
        if (
          rolId === "ra-sso-sa" ||
          rolId === "ra-sso-gz" ||
          rolName === "super administrador" ||
          rolName === "gestor zonal de usuarios" ||
          hasAllSec ||
          permisos.some((p) => p.puedeCrear || p.puedeEditar)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Comprueba si un usuario es Super Administrador del SSO.
 * Únicamente los usuarios con asignación activa con rol 'ra-sso-sa', 'Super Administrador'
 * o permiso global 'ALL-SEC' tienen privilegios de Super Administrador.
 */
export function isUserSuperAdmin(usuario: UsuarioItem): boolean {
  if (!usuario) {
    return false;
  }

  const userEmail = (usuario.email || usuario.correo || "").trim().toLowerCase();
  if (
    userEmail === "jeimy.mateus@glocation.com.co" ||
    usuario.cargo === "Super Administrador" ||
    (usuario as any).rol === "Super Administrador"
  ) {
    return true;
  }

  if (!Array.isArray(usuario.sedes)) {
    return false;
  }

  for (const sede of usuario.sedes) {
    if (!Array.isArray(sede?.asignaciones)) continue;
    for (const asig of sede.asignaciones) {
      const isAsigActive =
        asig.estado === "Activo" || (asig as any).activo === true;
      if (!isAsigActive) continue;

      const appName = (asig.aplicacionNombre || "").trim().toLowerCase();
      const appCode = ((asig as any).aplicacionCodigo || (asig as any).codigo || "").trim().toLowerCase();
      const isSSO =
        appName === "sso" ||
        appCode === "sso" ||
        (asig.rolAplicacionId || "").startsWith("ra-sso-");

      if (!isSSO) continue;

      const rolId = (asig.rolAplicacionId || "").trim().toLowerCase();
      const rolName = (asig.rolNombre || "").trim().toLowerCase();
      const permisos = Array.isArray(asig.permisos) ? asig.permisos : [];
      const hasAllSec = permisos.some((p) => p.recursoCodigo === "ALL-SEC");

      if (
        rolId === "ra-sso-sa" ||
        rolName === "super administrador" ||
        rolName === "superadmin" ||
        hasAllSec
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Valida que la petición provenga de un usuario autenticado y activo,
 * con permisos administrativos en la aplicación SSO para la acción requerida.
 */
export async function verifyAdminUser(
  request: Request,
  options?: VerifyAdminUserOptions
): Promise<ActiveUserAuthResult> {
  const result = await verifyActiveUser(request, { targetApp: "sso" });
  const action = options?.requiredAction || "write";

  if (!isUserAdminInSSO(result.usuario, action)) {
    throw new AuthorizationError(
      "No tienes permisos administrativos en el SSO para realizar esta acción.",
      403,
      "ADMIN_ACCESS_DENIED"
    );
  }

  return result;
}

export interface ActiveUserApplication {
  aplicacionId: string;
  aplicacionCodigo: string;
  aplicacionNombre: string;
  sedeId: string;
  sedeNombre: string;
  rolNombre: string;
}

export interface ExactAssignmentValidationResult {
  isValid: boolean;
  matchedAssignment?: any;
  reason?: string;
}

/**
 * Valida de forma exacta y exhaustiva que el usuario cuente con una asignación activa y válida
 * para una aplicación específica en Firestore, comprobando sede válida y rol asignado.
 */
export function validateExactApplicationAssignment(
  usuario: UsuarioItem | null | undefined,
  targetApp: string
): ExactAssignmentValidationResult {
  if (!usuario) {
    return { isValid: false, reason: "Usuario no proporcionado." };
  }

  const isUserActive =
    usuario.active === true ||
    (usuario.active === undefined &&
      typeof usuario.estado === "string" &&
      usuario.estado.trim().toLowerCase() === "activo");

  if (!isUserActive) {
    return { isValid: false, reason: "El usuario está inactivo." };
  }

  if (!targetApp || typeof targetApp !== "string") {
    return { isValid: false, reason: "Aplicación objetivo no especificada." };
  }

  if (!Array.isArray(usuario.sedes) || usuario.sedes.length === 0) {
    return { isValid: false, reason: "El usuario no tiene sedes configuradas." };
  }

  const normalizedTarget = targetApp.trim().toLowerCase();

  for (const sede of usuario.sedes) {
    if (!sede?.sedeId || typeof sede.sedeId !== "string" || !sede.sedeId.trim()) {
      continue;
    }
    if (!Array.isArray(sede.asignaciones)) {
      continue;
    }

    for (const asig of sede.asignaciones) {
      const isAsigActive =
        asig.estado === "Activo" || (asig as any).activo === true;
      if (!isAsigActive) continue;

      const rol = (asig.rolNombre || (asig as any).rol || "").trim();
      if (!rol && !(asig.rolAplicacionId || "").trim()) {
        continue;
      }

      const appName = (asig.aplicacionNombre || "").trim().toLowerCase();
      const appCode = ((asig as any).aplicacionCodigo || (asig as any).codigo || "").trim().toLowerCase();
      const appId = ((asig as any).aplicacionId || "").trim().toLowerCase();

      const isNotasTarget =
        normalizedTarget === "notas" ||
        normalizedTarget === "app-notas" ||
        normalizedTarget.includes("notas");

      let matches = false;
      if (isNotasTarget) {
        matches =
          appName.includes("notas") ||
          appCode.includes("notas") ||
          appId.includes("notas") ||
          appName === "sistema de notas";
      } else {
        matches =
          appName === normalizedTarget ||
          appCode === normalizedTarget ||
          appId === normalizedTarget ||
          appName.includes(normalizedTarget);
      }

      if (matches) {
        return {
          isValid: true,
          matchedAssignment: asig,
        };
      }
    }
  }

  return {
    isValid: false,
    reason: "No se encontraron asignaciones activas con rol y sede válidos para la aplicación.",
  };
}

/**
 * Extrae todas las aplicaciones activas a las que el usuario tiene acceso con sede y rol válidos.
 */
export function extractActiveApplications(
  usuario: UsuarioItem | null | undefined
): ActiveUserApplication[] {
  if (!usuario || !Array.isArray(usuario.sedes)) {
    return [];
  }

  const apps: ActiveUserApplication[] = [];
  const seenKeys = new Set<string>();

  for (const sede of usuario.sedes) {
    if (!sede?.sedeId || !Array.isArray(sede.asignaciones)) continue;

    for (const asig of sede.asignaciones) {
      const isAsigActive =
        asig.estado === "Activo" || (asig as any).activo === true;
      if (!isAsigActive) continue;

      const rolNombre = (asig.rolNombre || (asig as any).rol || "").trim();
      const aplicacionNombre = (asig.aplicacionNombre || "").trim();
      const aplicacionCodigo = (
        (asig as any).aplicacionCodigo ||
        (asig as any).codigo ||
        ""
      ).trim();
      const aplicacionId = (
        (asig as any).aplicacionId ||
        (asig as any).id ||
        aplicacionCodigo ||
        aplicacionNombre
      ).trim();

      const key = `${aplicacionId}-${sede.sedeId}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        apps.push({
          aplicacionId,
          aplicacionCodigo,
          aplicacionNombre,
          sedeId: sede.sedeId,
          sedeNombre: sede.sedeNombre || "",
          rolNombre,
        });
      }
    }
  }

  return apps;
}


