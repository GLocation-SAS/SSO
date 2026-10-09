import type { PermisoRecurso } from "@/modules/gestion-usuarios/types/usuario";

export type NotasRole = "DOCENTE" | "ADMIN_NOTAS" | "ESTUDIANTE" | "DIRECTIVO" | "INVITADO";

export interface NotasAssignment {
  sedeId: string;
  sedeNombre: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  permisos: PermisoRecurso[] | string[];
}

export interface NotasUserContext {
  uid: string;
  email: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  asignacionesNotas: NotasAssignment[];
  debeCambiarPassword: boolean;
}

export interface NotasSessionResponse {
  authenticated: boolean;
  user: NotasUserContext;
  system: "notas";
}

export interface NotasModuleConfig {
  appName: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImageUrl?: string;
  baseApiPath: string;
}
