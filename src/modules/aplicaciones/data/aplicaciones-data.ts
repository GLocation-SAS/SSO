export interface AplicacionItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  urlAcceso: string;
  estado: "Activa" | "Inactiva";
  requiereAtencion: boolean;
  motivoAtencion?: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
  usuariosCount: number;
  rolesCount: number;
  recursosCount: number;
  icono?: string;
}

export interface AplicacionUsuarioAccess {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  cedula: string;
  sede: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  ultimoAcceso: string;
}

export interface AplicacionRol {
  id: string;
  aplicacionId: string;
  nombre: string;
  descripcion: string;
  usuariosCount: number;
  recursosCount: number;
}

export interface PermisoMatriz {
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface RolRecursoPermiso {
  recursoId: string;
  recursoNombre: string;
  recursoPadre?: string;
  permisos: PermisoMatriz;
}

export interface AplicacionRecurso {
  id: string;
  aplicacionId: string;
  nombre: string;
  descripcion: string;
  recursoPadreId?: string | null;
  recursoPadreNombre?: string | null;
  rolesConAcceso: string[];
  estado: "Activo" | "Inactivo";
}

export interface HistorialCambio {
  id: string;
  fecha: string;
  usuario: string;
  accion: string;
  detalle: string;
}

// ── Mock Data: Aplicaciones Principales ──────────────────────────────────────
export const mockAplicacionesData: AplicacionItem[] = [
  {
    id: "gestion-docente",
    codigo: "SGD",
    nombre: "Gestión Docente",
    descripcion: "Administración integral de la planta docente, méritos, contratos y traslados distritales.",
    urlAcceso: "https://docentes.mineduc.gob.ec",
    estado: "Activa",
    requiereAtencion: false,
    fechaCreacion: "12/01/2024",
    ultimaActualizacion: "05/10/2026, 14:32",
    usuariosCount: 1420,
    rolesCount: 8,
    recursosCount: 14,
    icono: "GraduationCap",
  },
  {
    id: "talento-humano",
    codigo: "TH",
    nombre: "Talento Humano",
    descripcion: "Gestión de expedientes de personal administrativo, nómina, vacaciones y acciones de personal.",
    urlAcceso: "https://rrhh.mineduc.gob.ec",
    estado: "Activa",
    requiereAtencion: true,
    motivoAtencion: "2 roles sin recursos de consulta asignados.",
    fechaCreacion: "20/02/2024",
    ultimaActualizacion: "04/10/2026, 11:15",
    usuariosCount: 860,
    rolesCount: 5,
    recursosCount: 9,
    icono: "Briefcase",
  },
  {
    id: "sige",
    codigo: "SIGE",
    nombre: "SIGE",
    descripcion: "Sistema de Información y Gestión Educativa nacional para matrículas, calificaciones y sedes.",
    urlAcceso: "https://sige.mineduc.gob.ec",
    estado: "Activa",
    requiereAtencion: false,
    fechaCreacion: "05/03/2023",
    ultimaActualizacion: "06/10/2026, 09:10",
    usuariosCount: 3120,
    rolesCount: 6,
    recursosCount: 18,
    icono: "BookOpen",
  },
  {
    id: "sso-conecta",
    codigo: "SSO",
    nombre: "SSO Conecta",
    descripcion: "Servicio de autenticación centralizada, federación de identidades y doble factor de seguridad.",
    urlAcceso: "https://conecta.mineduc.gob.ec",
    estado: "Activa",
    requiereAtencion: false,
    fechaCreacion: "15/11/2023",
    ultimaActualizacion: "06/10/2026, 16:45",
    usuariosCount: 520,
    rolesCount: 4,
    recursosCount: 8,
    icono: "KeyRound",
  },
  {
    id: "geoportal",
    codigo: "GEO",
    nombre: "Geoportal",
    descripcion: "Visor geoespacial de infraestructura educativa, distritos, circuitos y proyectos de inversión.",
    urlAcceso: "https://geoportal.mineduc.gob.ec",
    estado: "Inactiva",
    requiereAtencion: true,
    motivoAtencion: "Aplicación en mantenimiento programado. Accesos deshabilitados.",
    fechaCreacion: "18/06/2024",
    ultimaActualizacion: "02/10/2026, 17:00",
    usuariosCount: 230,
    rolesCount: 3,
    recursosCount: 6,
    icono: "MapPin",
  },
  {
    id: "sae",
    codigo: "SAE",
    nombre: "SAE",
    descripcion: "Sistema de Asignación y Admisión Escolar para postulaciones de régimen Costa y Sierra.",
    urlAcceso: "https://sae.mineduc.gob.ec",
    estado: "Activa",
    requiereAtencion: false,
    fechaCreacion: "10/08/2024",
    ultimaActualizacion: "01/10/2026, 13:20",
    usuariosCount: 940,
    rolesCount: 4,
    recursosCount: 7,
    icono: "Layers",
  },
];

// ── Mock Data: Usuarios con acceso contextual (Usuario + Sede + Rol + Estado) ──
export const mockUsuariosAccesoPorApp: Record<string, AplicacionUsuarioAccess[]> = {
  "gestion-docente": [
    {
      id: "acc-1",
      usuarioId: "usr-1",
      usuarioNombre: "Lcda. Andrea Morales",
      usuarioEmail: "andrea.morales@educacion.gob.ec",
      cedula: "1718293841",
      sede: "Planta Central",
      rol: "Administrador",
      estado: "Activo",
      ultimoAcceso: "Hoy, 10:45",
    },
    {
      id: "acc-2",
      usuarioId: "usr-2",
      usuarioNombre: "Dr. Carlos Andrade",
      usuarioEmail: "carlos.andrade@educacion.gob.ec",
      cedula: "0912837465",
      sede: "Coordinación Zonal 9",
      rol: "Jefe de Talento Humano",
      estado: "Activo",
      ultimoAcceso: "Ayer, 16:30",
    },
    {
      id: "acc-3",
      usuarioId: "usr-3",
      usuarioNombre: "Ing. Mariela Torres",
      usuarioEmail: "mariela.torres@educacion.gob.ec",
      cedula: "1102938475",
      sede: "Distrito 17D01",
      rol: "Talento Humano Distrital",
      estado: "Activo",
      ultimoAcceso: "04/10/2026",
    },
    {
      id: "acc-4",
      usuarioId: "usr-4",
      usuarioNombre: "Prof. Jorge Luis Pinos",
      usuarioEmail: "jorge.pinos@educacion.gob.ec",
      cedula: "0102938472",
      sede: "Coordinación Zonal 6",
      rol: "Docente",
      estado: "Activo",
      ultimoAcceso: "05/10/2026",
    },
    {
      id: "acc-5",
      usuarioId: "usr-5",
      usuarioNombre: "Mgs. Fernando Castro",
      usuarioEmail: "fernando.castro@educacion.gob.ec",
      cedula: "1720394851",
      sede: "Planta Central",
      rol: "Administración financiera",
      estado: "Activo",
      ultimoAcceso: "03/10/2026",
    },
    {
      id: "acc-6",
      usuarioId: "usr-6",
      usuarioNombre: "Econ. Patricia Viteri",
      usuarioEmail: "patricia.viteri@educacion.gob.ec",
      cedula: "0928374615",
      sede: "Coordinación Zonal 8",
      rol: "Registro y control",
      estado: "Inactivo",
      ultimoAcceso: "15/09/2026",
    },
    {
      id: "acc-7",
      usuarioId: "usr-7",
      usuarioNombre: "Lic. Roberto Zambrano",
      usuarioEmail: "roberto.zambrano@educacion.gob.ec",
      cedula: "1309876543",
      sede: "Distrito 09D03",
      rol: "Contratos Planificación",
      estado: "Activo",
      ultimoAcceso: "02/10/2026",
    },
  ],
  "talento-humano": [
    {
      id: "acc-th-1",
      usuarioId: "usr-th-1",
      usuarioNombre: "Dra. Sofía Benítez",
      usuarioEmail: "sofia.benitez@educacion.gob.ec",
      cedula: "1719283746",
      sede: "Planta Central",
      rol: "Administrador de Nómina",
      estado: "Activo",
      ultimoAcceso: "Hoy, 08:30",
    },
    {
      id: "acc-th-2",
      usuarioId: "usr-th-2",
      usuarioNombre: "Lic. Manuel Ortiz",
      usuarioEmail: "manuel.ortiz@educacion.gob.ec",
      cedula: "0921827364",
      sede: "Coordinación Zonal 9",
      rol: "Analista de Acciones",
      estado: "Activo",
      ultimoAcceso: "Ayer, 15:10",
    },
  ],
  "sige": [
    {
      id: "acc-sige-1",
      usuarioId: "usr-sg-1",
      usuarioNombre: "Ing. Danilo Vega",
      usuarioEmail: "danilo.vega@educacion.gob.ec",
      cedula: "1716253442",
      sede: "Planta Central",
      rol: "Auditor Nacional",
      estado: "Activo",
      ultimoAcceso: "Hoy, 11:20",
    },
    {
      id: "acc-sige-2",
      usuarioId: "usr-sg-2",
      usuarioNombre: "Lcda. Carmen Loor",
      usuarioEmail: "carmen.loor@educacion.gob.ec",
      cedula: "1308271635",
      sede: "Distrito 17D04",
      rol: "Operador Matriculación",
      estado: "Activo",
      ultimoAcceso: "Ayer, 14:05",
    },
  ],
};

// ── Mock Data: Roles por Aplicación ──────────────────────────────────────────
export const mockRolesPorApp: Record<string, AplicacionRol[]> = {
  "gestion-docente": [
    {
      id: "rol-administrador",
      aplicacionId: "gestion-docente",
      nombre: "Administrador",
      descripcion: "Acceso global de configuración, asignación de facultades y auditoría del módulo docente.",
      usuariosCount: 12,
      recursosCount: 14,
    },
    {
      id: "rol-jefe-th",
      aplicacionId: "gestion-docente",
      nombre: "Jefe de Talento Humano",
      descripcion: "Aprobación de convocatorias, nombramientos provisionales y validación de méritos.",
      usuariosCount: 28,
      recursosCount: 11,
    },
    {
      id: "rol-th-distrital",
      aplicacionId: "gestion-docente",
      nombre: "Talento Humano Distrital",
      descripcion: "Registro de expedientes docentes, novedades de asistencia y traslados dentro del distrito.",
      usuariosCount: 185,
      recursosCount: 8,
    },
    {
      id: "rol-docente",
      aplicacionId: "gestion-docente",
      nombre: "Docente",
      descripcion: "Consulta de distributivo, postulación a méritos y descarga de certificados institucionales.",
      usuariosCount: 1140,
      recursosCount: 4,
    },
    {
      id: "rol-admin-financiera",
      aplicacionId: "gestion-docente",
      nombre: "Administración financiera",
      descripcion: "Control presupuestario de partidas docentes y certificación de disponibilidad salarial.",
      usuariosCount: 15,
      recursosCount: 6,
    },
    {
      id: "rol-registro-control",
      aplicacionId: "gestion-docente",
      nombre: "Registro y control",
      descripcion: "Supervisión de títulos registrados en SENESCYT y verificación documental física.",
      usuariosCount: 40,
      recursosCount: 7,
    },
  ],
  "talento-humano": [
    {
      id: "rol-adm-nomina",
      aplicacionId: "talento-humano",
      nombre: "Administrador de Nómina",
      descripcion: "Consolidación de rubros salariales y emisión de roles de pago mensuales.",
      usuariosCount: 18,
      recursosCount: 9,
    },
    {
      id: "rol-analista-acciones",
      aplicacionId: "talento-humano",
      nombre: "Analista de Acciones",
      descripcion: "Emisión de resoluciones administrativas de ascensos, comisiones y licencias.",
      usuariosCount: 64,
      recursosCount: 7,
    },
    {
      id: "rol-consulta-rrhh",
      aplicacionId: "talento-humano",
      nombre: "Consulta",
      descripcion: "Visualización de hojas de vida e historial de desempeño sin privilegios de edición.",
      usuariosCount: 778,
      recursosCount: 3,
    },
  ],
};

// ── Mock Data: Recursos Jerárquicos por Aplicación ───────────────────────────
export const mockRecursosPorApp: Record<string, AplicacionRecurso[]> = {
  "gestion-docente": [
    // Jerarquía Docentes
    {
      id: "rec-docentes",
      aplicacionId: "gestion-docente",
      nombre: "Docentes",
      descripcion: "Módulo principal del padrón de profesionales de la educación.",
      recursoPadreId: null,
      recursoPadreNombre: null,
      rolesConAcceso: ["Administrador", "Jefe de Talento Humano", "Talento Humano Distrital", "Docente"],
      estado: "Activo",
    },
    {
      id: "rec-doc-info",
      aplicacionId: "gestion-docente",
      nombre: "Información",
      descripcion: "Datos personales, títulos académicos, especialidad y contacto.",
      recursoPadreId: "rec-docentes",
      recursoPadreNombre: "Docentes",
      rolesConAcceso: ["Administrador", "Jefe de Talento Humano", "Talento Humano Distrital", "Docente"],
      estado: "Activo",
    },
    {
      id: "rec-doc-trayectoria",
      aplicacionId: "gestion-docente",
      nombre: "Trayectoria",
      descripcion: "Historial de instituciones educativas asignadas, años de servicio y evaluaciones.",
      recursoPadreId: "rec-docentes",
      recursoPadreNombre: "Docentes",
      rolesConAcceso: ["Administrador", "Jefe de Talento Humano", "Talento Humano Distrital"],
      estado: "Activo",
    },
    {
      id: "rec-doc-acciones",
      aplicacionId: "gestion-docente",
      nombre: "Acciones de personal",
      descripcion: "Nombramientos provisionales, definitivos, traslados y comisiones de servicio.",
      recursoPadreId: "rec-docentes",
      recursoPadreNombre: "Docentes",
      rolesConAcceso: ["Administrador", "Jefe de Talento Humano"],
      estado: "Activo",
    },

    // Jerarquía Contratos
    {
      id: "rec-contratos",
      aplicacionId: "gestion-docente",
      nombre: "Contratos",
      descripcion: "Gestión de contratos ocasionales y convenios de docencia.",
      recursoPadreId: null,
      recursoPadreNombre: null,
      rolesConAcceso: ["Administrador", "Contratos Planificación", "Administración financiera"],
      estado: "Activo",
    },
    {
      id: "rec-contratos-partidas",
      aplicacionId: "gestion-docente",
      nombre: "Partidas presupuestarias",
      descripcion: "Verificación de partida asignada por el Ministerio de Finanzas.",
      recursoPadreId: "rec-contratos",
      recursoPadreNombre: "Contratos",
      rolesConAcceso: ["Administrador", "Administración financiera"],
      estado: "Activo",
    },

    // Jerarquía Reportes
    {
      id: "rec-reportes",
      aplicacionId: "gestion-docente",
      nombre: "Reportes",
      descripcion: "Módulo analítico de distribución territorial y cobertura docente.",
      recursoPadreId: null,
      recursoPadreNombre: null,
      rolesConAcceso: ["Administrador", "Jefe de Talento Humano", "Registro y control"],
      estado: "Activo",
    },
  ],
};

// ── Mock Data: Matriz de Permisos (Rol -> Recurso -> Permisos) ───────────────
export const mockMatrizPermisosPorRol: Record<string, RolRecursoPermiso[]> = {
  "rol-administrador": [
    {
      recursoId: "rec-docentes",
      recursoNombre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: true },
    },
    {
      recursoId: "rec-doc-info",
      recursoNombre: "Información",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: true },
    },
    {
      recursoId: "rec-doc-trayectoria",
      recursoNombre: "Trayectoria",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: true },
    },
    {
      recursoId: "rec-doc-acciones",
      recursoNombre: "Acciones de personal",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: true },
    },
    {
      recursoId: "rec-contratos",
      recursoNombre: "Contratos",
      permisos: { ver: true, crear: true, editar: true, eliminar: true },
    },
    {
      recursoId: "rec-reportes",
      recursoNombre: "Reportes",
      permisos: { ver: true, crear: true, editar: true, eliminar: true },
    },
  ],
  "rol-jefe-th": [
    {
      recursoId: "rec-docentes",
      recursoNombre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-doc-info",
      recursoNombre: "Información",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-doc-trayectoria",
      recursoNombre: "Trayectoria",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-doc-acciones",
      recursoNombre: "Acciones de personal",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-contratos",
      recursoNombre: "Contratos",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-reportes",
      recursoNombre: "Reportes",
      permisos: { ver: true, crear: true, editar: false, eliminar: false },
    },
  ],
  "rol-th-distrital": [
    {
      recursoId: "rec-docentes",
      recursoNombre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-doc-info",
      recursoNombre: "Información",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: true, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-doc-trayectoria",
      recursoNombre: "Trayectoria",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-doc-acciones",
      recursoNombre: "Acciones de personal",
      recursoPadre: "Docentes",
      permisos: { ver: false, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-contratos",
      recursoNombre: "Contratos",
      permisos: { ver: false, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-reportes",
      recursoNombre: "Reportes",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
  ],
  "rol-docente": [
    {
      recursoId: "rec-docentes",
      recursoNombre: "Docentes",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-doc-info",
      recursoNombre: "Información",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: false, editar: true, eliminar: false },
    },
    {
      recursoId: "rec-doc-trayectoria",
      recursoNombre: "Trayectoria",
      recursoPadre: "Docentes",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-doc-acciones",
      recursoNombre: "Acciones de personal",
      recursoPadre: "Docentes",
      permisos: { ver: false, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-contratos",
      recursoNombre: "Contratos",
      permisos: { ver: false, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-reportes",
      recursoNombre: "Reportes",
      permisos: { ver: false, crear: false, editar: false, eliminar: false },
    },
  ],
};

// ── Mock Data: Historial de Cambios / Actividad ──────────────────────────────
export const mockHistorialCambios: Record<string, HistorialCambio[]> = {
  "gestion-docente": [
    {
      id: "act-1",
      fecha: "05/10/2026, 14:32",
      usuario: "Dr. Carlos Andrade",
      accion: "Actualización de matriz de permisos",
      detalle: "Se habilitó permiso de 'Editar' en Trayectoria para el rol Talento Humano Distrital.",
    },
    {
      id: "act-2",
      fecha: "04/10/2026, 17:15",
      usuario: "Lcda. Andrea Morales",
      accion: "Nuevo recurso registrado",
      detalle: "Se incorporó el sub-recurso 'Partidas presupuestarias' bajo la rama 'Contratos'.",
    },
    {
      id: "act-3",
      fecha: "02/10/2026, 11:00",
      usuario: "Mgs. Fernando Castro",
      accion: "Vinculación de sede",
      detalle: "Se autorizó acceso al rol 'Administración financiera' en la sede Coordinación Zonal 6.",
    },
    {
      id: "act-4",
      fecha: "28/09/2026, 09:40",
      usuario: "Ing. Mariela Torres",
      accion: "Actualización de endpoint institucional",
      detalle: "Modificación de la URL de redirección SSO hacia docentes.mineduc.gob.ec/auth/callback.",
    },
  ],
};

// ── Catálogos Auxiliares ─────────────────────────────────────────────────────
export const SEDES_CATALOGO_APPS = [
  "Planta Central",
  "Coordinación Zonal 9",
  "Coordinación Zonal 6",
  "Coordinación Zonal 8",
  "Distrito 17D01",
  "Distrito 09D03",
  "Distrito 11D01",
  "Distrito 17D04",
];

