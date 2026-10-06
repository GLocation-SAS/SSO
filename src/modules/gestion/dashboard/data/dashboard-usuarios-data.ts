export interface ExecutiveKpi {
  id: string;
  label: string;
  value: string;
  porcentaje?: string;
  subtexto: string;
  color: "primary" | "success-400" | "warning";
  iconName: "Users" | "UserCheck" | "AlertTriangle";
  badgeTone?: "primary" | "success" | "warning";
}

export interface EstadoUsuarioAccesoItem {
  id: string;
  titulo: string;
  descripcion: string;
  cantidad: number;
  porcentaje: number;
  tipo: "optimo" | "atencion" | "riesgo" | "regular";
  colorBar: string;
  badgeText: string;
  badgeTone: "success" | "warning" | "danger" | "neutral";
  filterHref: string;
}

export interface CoberturaItem {
  id: string;
  rango: string;
  descripcion: string;
  usuarios: number;
  porcentaje: number;
  color: string;
  filterHref: string;
}

export interface RolItem {
  id: string;
  nombre: string;
  usuarios: number;
  porcentaje: number;
  recursos: number;
  estado: "Activo" | "Inactivo";
}

export interface SedeUsersDistribution {
  id: string;
  codigo: string;
  nombre: string;
  tipo: "Planta Central" | "Coordinación Zonal" | "Distrito";
  usuarios: number;
  porcentaje: number;
}

export interface AppContextData {
  id: string;
  nombre: string;
  codigo: string;
  usuarios: number;
  porcentaje: number;
  rolesCount: number;
  sedesCount: number;
  roles: RolItem[];
  sedes: SedeUsersDistribution[];
}

export interface AtencionCase {
  id: string;
  titulo: string;
  cantidad: number;
  descripcion: string;
  tipo: "danger" | "warning" | "info";
  href: string;
}

// ── 1. RESUMEN EJECUTIVO (3 KPIs de decisión rápida) ────────────────────────
export const USUARIOS_RESUMEN_KPIS: ExecutiveKpi[] = [
  {
    id: "total-usuarios",
    label: "Total de usuarios",
    value: "1.245",
    subtexto: "Usuarios registrados",
    color: "primary",
    iconName: "Users",
  },
  {
    id: "acceso-vigente",
    label: "Usuarios con acceso vigente",
    value: "1.012",
    porcentaje: "81.3%",
    subtexto: "Activos con al menos un acceso válido",
    color: "success-400",
    iconName: "UserCheck",
    badgeTone: "success",
  },
  {
    id: "requieren-revision",
    label: "Requieren revisión",
    value: "43",
    porcentaje: "3.5%",
    subtexto: "Casos pendientes de regularizar",
    color: "warning",
    iconName: "AlertTriangle",
    badgeTone: "warning",
  },
];

// ── 2. ESTADO DE USUARIOS Y ACCESOS ─────────────────────────────────────────
export const ESTADO_USUARIOS_ACCESOS: EstadoUsuarioAccesoItem[] = [
  {
    id: "activos-con-acceso",
    titulo: "Activos con acceso",
    descripcion: "Usuarios habilitados con al menos un rol y acceso válido activo.",
    cantidad: 1012,
    porcentaje: 81.3,
    tipo: "optimo",
    colorBar: "var(--success)",
    badgeText: "Operación normal",
    badgeTone: "success",
    filterHref: "/gestion-usuarios/usuarios?filter=activos-vigentes",
  },
  {
    id: "activos-sin-acceso",
    titulo: "Activos sin acceso",
    descripcion: "Cuentas dadas de alta pero sin aplicaciones ni roles asignados.",
    cantidad: 46,
    porcentaje: 3.7,
    tipo: "atencion",
    colorBar: "var(--warning)",
    badgeText: "Pendiente configuración",
    badgeTone: "warning",
    filterHref: "/gestion-usuarios/usuarios?filter=sin-acceso",
  },
  {
    id: "inactivos-con-asignacion",
    titulo: "Inactivos con acceso",
    descripcion: "Cuentas suspendidas que aún conservan permisos en aplicaciones.",
    cantidad: 18,
    porcentaje: 1.4,
    tipo: "riesgo",
    colorBar: "var(--danger)",
    badgeText: "Riesgo de seguridad",
    badgeTone: "danger",
    filterHref: "/gestion-usuarios/usuarios?filter=inactivos-asignados",
  },
  {
    id: "inactivos-sin-asignacion",
    titulo: "Inactivos sin acceso",
    descripcion: "Cuentas suspendidas con desvinculación completa de perfiles.",
    cantidad: 169,
    porcentaje: 13.6,
    tipo: "regular",
    colorBar: "var(--muted-foreground)",
    badgeText: "Regularizado",
    badgeTone: "neutral",
    filterHref: "/gestion-usuarios/usuarios?filter=inactivos-limpios",
  },
];

// ── 3. APLICACIONES POR USUARIO ─────────────────────────────────────────────
export const COBERTURA_APLICACIONES: CoberturaItem[] = [
  {
    id: "sin-app",
    rango: "Sin aplicación",
    descripcion: "Usuarios registrados sin aplicaciones asignadas",
    usuarios: 46,
    porcentaje: 3.7,
    color: "var(--warning)",
    filterHref: "/gestion-usuarios/usuarios?apps=0",
  },
  {
    id: "app-1",
    rango: "1 aplicación",
    descripcion: "Usuarios con acceso a una sola aplicación",
    usuarios: 685,
    porcentaje: 55.0,
    color: "var(--primary)",
    filterHref: "/gestion-usuarios/usuarios?apps=1",
  },
  {
    id: "app-2",
    rango: "2 aplicaciones",
    descripcion: "Usuarios con acceso a dos aplicaciones",
    usuarios: 342,
    porcentaje: 27.5,
    color: "var(--info)",
    filterHref: "/gestion-usuarios/usuarios?apps=2",
  },
  {
    id: "app-3-plus",
    rango: "3 o más",
    descripcion: "Usuarios con tres o más aplicaciones",
    usuarios: 172,
    porcentaje: 13.8,
    color: "var(--secondary)",
    filterHref: "/gestion-usuarios/usuarios?apps=3plus",
  },
];

// ── 4. APLICACIONES Y SU CONTEXTO (Usuarios -> Roles -> Sedes) ───────────────
export const APLICACIONES_DATA: AppContextData[] = [
  {
    id: "app-gd",
    nombre: "Gestión Docente",
    codigo: "SGD",
    usuarios: 520,
    porcentaje: 42,
    rolesCount: 5,
    sedesCount: 5,
    roles: [
      { id: "r-gd-doc", nombre: "Docente", usuarios: 326, porcentaje: 63, recursos: 14, estado: "Activo" },
      { id: "r-gd-ana", nombre: "Analista", usuarios: 64, porcentaje: 12, recursos: 22, estado: "Activo" },
      { id: "r-gd-reg", nombre: "Registro y control", usuarios: 58, porcentaje: 11, recursos: 18, estado: "Activo" },
      { id: "r-gd-con", nombre: "Contratos Planificación", usuarios: 40, porcentaje: 8, recursos: 12, estado: "Activo" },
      { id: "r-gd-adm", nombre: "Administrador", usuarios: 32, porcentaje: 6, recursos: 45, estado: "Activo" },
    ],
    sedes: [
      { id: "s-gd-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 182, porcentaje: 35 },
      { id: "s-gd-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 94, porcentaje: 18 },
      { id: "s-gd-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 78, porcentaje: 15 },
      { id: "s-gd-cz8", codigo: "CZ-08", nombre: "Coordinación Zonal 8", tipo: "Coordinación Zonal", usuarios: 62, porcentaje: 12 },
      { id: "s-gd-dis", codigo: "DIS-01", nombre: "Distritos Educativos", tipo: "Distrito", usuarios: 104, porcentaje: 20 },
    ],
  },
  {
    id: "app-th",
    nombre: "Talento Humano",
    codigo: "STH",
    usuarios: 410,
    porcentaje: 33,
    rolesCount: 4,
    sedesCount: 5,
    roles: [
      { id: "r-th-ana", nombre: "Analista de Talento Humano", usuarios: 215, porcentaje: 52, recursos: 16, estado: "Activo" },
      { id: "r-th-jfe", nombre: "Jefe de Talento Humano", usuarios: 85, porcentaje: 21, recursos: 28, estado: "Activo" },
      { id: "r-th-nom", nombre: "Especialista Nómina", usuarios: 68, porcentaje: 17, recursos: 20, estado: "Activo" },
      { id: "r-th-adm", nombre: "Administrador", usuarios: 42, porcentaje: 10, recursos: 38, estado: "Activo" },
    ],
    sedes: [
      { id: "s-th-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 165, porcentaje: 40 },
      { id: "s-th-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 95, porcentaje: 23 },
      { id: "s-th-cz8", codigo: "CZ-08", nombre: "Coordinación Zonal 8", tipo: "Coordinación Zonal", usuarios: 68, porcentaje: 17 },
      { id: "s-th-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 52, porcentaje: 13 },
      { id: "s-th-dis", codigo: "DIS-01", nombre: "Distritos Educativos", tipo: "Distrito", usuarios: 30, porcentaje: 7 },
    ],
  },
  {
    id: "app-sige",
    nombre: "SIGE",
    codigo: "SIGE",
    usuarios: 315,
    porcentaje: 25,
    rolesCount: 3,
    sedesCount: 5,
    roles: [
      { id: "r-sige-mat", nombre: "Operador Matriculación", usuarios: 180, porcentaje: 57, recursos: 12, estado: "Activo" },
      { id: "r-sige-sop", nombre: "Técnico de Soporte", usuarios: 85, porcentaje: 27, recursos: 19, estado: "Activo" },
      { id: "r-sige-aud", nombre: "Auditor Nacional", usuarios: 50, porcentaje: 16, recursos: 26, estado: "Activo" },
    ],
    sedes: [
      { id: "s-sige-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 110, porcentaje: 35 },
      { id: "s-sige-cz8", codigo: "CZ-08", nombre: "Coordinación Zonal 8", tipo: "Coordinación Zonal", usuarios: 85, porcentaje: 27 },
      { id: "s-sige-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 60, porcentaje: 19 },
      { id: "s-sige-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 40, porcentaje: 13 },
      { id: "s-sige-dis", codigo: "DIS-01", nombre: "Distritos Educativos", tipo: "Distrito", usuarios: 20, porcentaje: 6 },
    ],
  },
  {
    id: "app-sso",
    nombre: "SSO Conecta",
    codigo: "SSO",
    usuarios: 210,
    porcentaje: 17,
    rolesCount: 4,
    sedesCount: 5,
    roles: [
      { id: "r-sso-ma", nombre: "Operador Mesa de Ayuda", usuarios: 120, porcentaje: 57, recursos: 8, estado: "Activo" },
      { id: "r-sso-gz", nombre: "Gestor Zonal de Usuarios", usuarios: 62, porcentaje: 30, recursos: 18, estado: "Activo" },
      { id: "r-sso-aud", nombre: "Auditor de Seguridad", usuarios: 18, porcentaje: 9, recursos: 24, estado: "Activo" },
      { id: "r-sso-sa", nombre: "Super Administrador", usuarios: 10, porcentaje: 4, recursos: 50, estado: "Activo" },
    ],
    sedes: [
      { id: "s-sso-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 115, porcentaje: 55 },
      { id: "s-sso-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 35, porcentaje: 17 },
      { id: "s-sso-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 25, porcentaje: 12 },
      { id: "s-sso-cz8", codigo: "CZ-08", nombre: "Coordinación Zonal 8", tipo: "Coordinación Zonal", usuarios: 20, porcentaje: 9 },
      { id: "s-sso-dis", codigo: "DIS-01", nombre: "Distritos Educativos", tipo: "Distrito", usuarios: 15, porcentaje: 7 },
    ],
  },
  {
    id: "app-geo",
    nombre: "Geoportal",
    codigo: "GEO",
    usuarios: 145,
    porcentaje: 12,
    rolesCount: 3,
    sedesCount: 4,
    roles: [
      { id: "r-geo-con", nombre: "Consultor Territorial", usuarios: 72, porcentaje: 50, recursos: 10, estado: "Activo" },
      { id: "r-geo-sig", nombre: "Especialista SIG", usuarios: 48, porcentaje: 33, recursos: 22, estado: "Activo" },
      { id: "r-geo-cap", nombre: "Administrador de Capas", usuarios: 25, porcentaje: 17, recursos: 34, estado: "Activo" },
    ],
    sedes: [
      { id: "s-geo-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 85, porcentaje: 59 },
      { id: "s-geo-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 28, porcentaje: 19 },
      { id: "s-geo-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 18, porcentaje: 12 },
      { id: "s-geo-cz8", codigo: "CZ-08", nombre: "Coordinación Zonal 8", tipo: "Coordinación Zonal", usuarios: 14, porcentaje: 10 },
    ],
  },
  {
    id: "app-sae",
    nombre: "SAE",
    codigo: "SAE",
    usuarios: 98,
    porcentaje: 8,
    rolesCount: 3,
    sedesCount: 4,
    roles: [
      { id: "r-sae-doc", nombre: "Docente Evaluador", usuarios: 52, porcentaje: 53, recursos: 8, estado: "Activo" },
      { id: "r-sae-coo", nombre: "Coordinador Académico", usuarios: 32, porcentaje: 33, recursos: 14, estado: "Activo" },
      { id: "r-sae-adm", nombre: "Administrador SAE", usuarios: 14, porcentaje: 14, recursos: 26, estado: "Activo" },
    ],
    sedes: [
      { id: "s-sae-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 45, porcentaje: 46 },
      { id: "s-sae-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 25, porcentaje: 26 },
      { id: "s-sae-cz8", codigo: "CZ-08", nombre: "Coordinación Zonal 8", tipo: "Coordinación Zonal", usuarios: 16, porcentaje: 16 },
      { id: "s-sae-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 12, porcentaje: 12 },
    ],
  },
  {
    id: "app-bib",
    nombre: "Biblioteca Digital",
    codigo: "PBD",
    usuarios: 78,
    porcentaje: 6,
    rolesCount: 2,
    sedesCount: 3,
    roles: [
      { id: "r-bib-ges", nombre: "Gestor Bibliotecario", usuarios: 54, porcentaje: 69, recursos: 10, estado: "Activo" },
      { id: "r-bib-adm", nombre: "Administrador Catálogo", usuarios: 24, porcentaje: 31, recursos: 20, estado: "Activo" },
    ],
    sedes: [
      { id: "s-bib-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 48, porcentaje: 62 },
      { id: "s-bib-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 20, porcentaje: 26 },
      { id: "s-bib-cz6", codigo: "CZ-06", nombre: "Coordinación Zonal 6", tipo: "Coordinación Zonal", usuarios: 10, porcentaje: 12 },
    ],
  },
  {
    id: "app-tram",
    nombre: "Portal de Trámites",
    codigo: "PNT",
    usuarios: 64,
    porcentaje: 5,
    rolesCount: 2,
    sedesCount: 2,
    roles: [
      { id: "r-tram-ate", nombre: "Operador de Trámites", usuarios: 46, porcentaje: 72, recursos: 8, estado: "Activo" },
      { id: "r-tram-sup", nombre: "Supervisor de Ventanilla", usuarios: 18, porcentaje: 28, recursos: 16, estado: "Activo" },
    ],
    sedes: [
      { id: "s-tram-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 42, porcentaje: 66 },
      { id: "s-tram-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 22, porcentaje: 34 },
    ],
  },
  {
    id: "app-ciud",
    nombre: "Atención Ciudadana",
    codigo: "PAC",
    usuarios: 52,
    porcentaje: 4,
    rolesCount: 2,
    sedesCount: 2,
    roles: [
      { id: "r-ciud-con", nombre: "Asesor Ciudadano", usuarios: 38, porcentaje: 73, recursos: 6, estado: "Activo" },
      { id: "r-ciud-coo", nombre: "Coordinador de Servicios", usuarios: 14, porcentaje: 27, recursos: 14, estado: "Activo" },
    ],
    sedes: [
      { id: "s-ciud-pc", codigo: "PC-01", nombre: "Planta Central", tipo: "Planta Central", usuarios: 34, porcentaje: 65 },
      { id: "s-ciud-cz9", codigo: "CZ-09", nombre: "Coordinación Zonal 9", tipo: "Coordinación Zonal", usuarios: 18, porcentaje: 35 },
    ],
  },
];

// ── 5. CASOS QUE REQUIEREN ATENCIÓN (Accionables y prioritarios) ─────────────
export const CASOS_REQUIEREN_ATENCION: AtencionCase[] = [
  {
    id: "sin-rol",
    titulo: "Sin rol",
    cantidad: 12,
    descripcion: "Tienen aplicación asignada pero ningún perfil ni nivel de permiso configurado.",
    tipo: "warning",
    href: "/gestion-usuarios/usuarios?filter=sin-rol",
  },
  {
    id: "activos-sin-acceso",
    titulo: "Activos sin acceso",
    cantidad: 46,
    descripcion: "Cuentas habilitadas en el SSO pero sin vinculación a ninguna aplicación.",
    tipo: "warning",
    href: "/gestion-usuarios/usuarios?filter=sin-acceso",
  },
  {
    id: "inactivos-vigentes",
    titulo: "Inactivos con acceso",
    cantidad: 18,
    descripcion: "Cuentas desactivadas que aún mantienen roles y accesos vigentes a revocar.",
    tipo: "danger",
    href: "/gestion-usuarios/usuarios?filter=inactivos-asignados",
  },
  {
    id: "sin-sede",
    titulo: "Sin sede",
    cantidad: 7,
    descripcion: "Cuentas registradas sin jurisdicción territorial o unidad institucional asignada.",
    tipo: "info",
    href: "/gestion-usuarios/usuarios?filter=sin-sede",
  },
];

// ── 6. ÚLTIMOS CAMBIOS EN GESTIÓN DE USUARIOS (Compacto) ────────────────────
export const ULTIMOS_CAMBIOS_RESUMEN = {
  accesosModificados: 18,
  rolesActualizados: 7,
  usuariosCreados: 5,
  cambiosEstado: 4,
  ultimoRegistro: "Hace 12 min",
  hrefHistorial: "/gestion-usuarios/usuarios",
};
