export interface PermisoItem {
  codigo: string;
  nombre: string;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface RecursoAsignado {
  id: string;
  codigo: string;
  nombre: string;
  tipo: "Módulo" | "Submódulo" | "Servicio";
  permisos: PermisoItem;
}

export interface MisAplicacionItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  urlAcceso: string;
  icono: "GraduationCap" | "School" | "Users" | "Headphones" | "FileText" | "Shield";
  colorTone: "primary" | "info" | "warning" | "success" | "purple";
  sede: {
    id: string;
    codigo: string;
    nombre: string;
    tipo: "Coordinación Zonal" | "Planta Central" | "Distrito";
  };
  rol: {
    id: string;
    nombre: string;
    descripcion: string;
  };
  ultimoAcceso: string;
  ultimoAccesoIso?: string;
  estado: "Activa" | "Mantenimiento";
  recursos: RecursoAsignado[];
  categoria: string;
}

export const MIS_APLICACIONES_USUARIO: MisAplicacionItem[] = [
  {
    id: "app-notas",
    codigo: "NOTAS",
    nombre: "Sistema de Notas",
    descripcion: "Registro de calificaciones, asistencia estudiantil y reportes pedagógicos de aula.",
    urlAcceso: "/login-notas",
    icono: "GraduationCap",
    colorTone: "primary",
    sede: {
      id: "sede-cz9",
      codigo: "CZ-09",
      nombre: "Coordinación Zonal 9",
      tipo: "Coordinación Zonal",
    },
    rol: {
      id: "rol-docente",
      nombre: "Docente de Aula",
      descripcion: "Ingreso de calificaciones parciales, quimestrales y control diario.",
    },
    ultimoAcceso: "Hoy, activo",
    ultimoAccesoIso: "2026-10-14T08:00:00",
    estado: "Activa",
    categoria: "Docencia y Academia",
    recursos: [
      {
        id: "rec-notas-calif",
        codigo: "NOT-ING",
        nombre: "Registro de Calificaciones",
        tipo: "Módulo",
        permisos: { codigo: "NOT-ING", nombre: "Registro de Calificaciones", ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        id: "rec-notas-asist",
        codigo: "NOT-ASIST",
        nombre: "Asistencia Escolar",
        tipo: "Módulo",
        permisos: { codigo: "NOT-ASIST", nombre: "Asistencia Escolar", ver: true, crear: true, editar: true, eliminar: false },
      },
    ],
  },
  {
    id: "gestion-docente",
    codigo: "SGD",
    nombre: "Gestión Docente",
    descripcion: "Administración integral de la planta docente, méritos, contratos y traslados distritales.",
    urlAcceso: "https://docentes.mineduc.gob.ec",
    icono: "GraduationCap",
    colorTone: "primary",
    sede: {
      id: "sede-cz9",
      codigo: "CZ-09",
      nombre: "Coordinación Zonal 9",
      tipo: "Coordinación Zonal",
    },
    rol: {
      id: "rol-doc-eval",
      nombre: "Docente / Evaluador",
      descripcion: "Acceso a expedientes de docentes asignados y registro de evaluaciones zonales.",
    },
    ultimoAcceso: "Hoy a las 08:15 AM",
    ultimoAccesoIso: "2026-10-13T08:15:00",
    estado: "Activa",
    categoria: "Docencia y Academia",
    recursos: [
      {
        id: "rec-exp",
        codigo: "EXP-DOC",
        nombre: "Expediente Docente",
        tipo: "Módulo",
        permisos: { codigo: "EXP-DOC", nombre: "Expediente Docente", ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        id: "rec-calif",
        codigo: "NOT-EVAL",
        nombre: "Registro de Evaluaciones",
        tipo: "Submódulo",
        permisos: { codigo: "NOT-EVAL", nombre: "Registro de Evaluaciones", ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        id: "rec-asist",
        codigo: "ASIST-DOC",
        nombre: "Control de Asistencia",
        tipo: "Servicio",
        permisos: { codigo: "ASIST-DOC", nombre: "Control de Asistencia", ver: true, crear: true, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "sige-escolar",
    codigo: "SIGE",
    nombre: "SIGE - Sistema Escolar",
    descripcion: "Sistema institucional para la gestión y seguimiento del proceso educativo, matrículas y registros escolares.",
    urlAcceso: "https://sige.mineduc.gob.ec",
    icono: "School",
    colorTone: "info",
    sede: {
      id: "sede-cz9",
      codigo: "CZ-09",
      nombre: "Coordinación Zonal 9",
      tipo: "Coordinación Zonal",
    },
    rol: {
      id: "rol-op-reg",
      nombre: "Operador de Registro",
      descripcion: "Registro de matrículas y control de asistencia estudiantil distrital.",
    },
    ultimoAcceso: "Ayer a las 16:42",
    ultimoAccesoIso: "2026-10-12T16:42:00",
    estado: "Activa",
    categoria: "Gestión Estudiantil",
    recursos: [
      {
        id: "rec-mat",
        codigo: "MAT-ALUM",
        nombre: "Matriculación de Alumnos",
        tipo: "Módulo",
        permisos: { codigo: "MAT-ALUM", nombre: "Matriculación de Alumnos", ver: true, crear: true, editar: false, eliminar: false },
      },
      {
        id: "rec-rep",
        codigo: "REP-ACAD",
        nombre: "Reportes Académicos",
        tipo: "Submódulo",
        permisos: { codigo: "REP-ACAD", nombre: "Reportes Académicos", ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "talento-humano",
    codigo: "TH",
    nombre: "Talento Humano",
    descripcion: "Gestión de expedientes de personal administrativo, roles de pago, vacaciones y acciones institucionales.",
    urlAcceso: "https://rrhh.mineduc.gob.ec",
    icono: "Users",
    colorTone: "success",
    sede: {
      id: "sede-pc",
      codigo: "PC-01",
      nombre: "Planta Central",
      tipo: "Planta Central",
    },
    rol: {
      id: "rol-func-adm",
      nombre: "Funcionario Administrativo",
      descripcion: "Consulta de comprobantes de pago, solicitudes de permisos y vacaciones.",
    },
    ultimoAcceso: "10/10/2026, 11:20",
    ultimoAccesoIso: "2026-10-10T11:20:00",
    estado: "Activa",
    categoria: "Administración y RRHH",
    recursos: [
      {
        id: "rec-rol-pago",
        codigo: "ROL-PAGO",
        nombre: "Comprobantes de Pago",
        tipo: "Servicio",
        permisos: { codigo: "ROL-PAGO", nombre: "Comprobantes de Pago", ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        id: "rec-vac",
        codigo: "SOL-VAC",
        nombre: "Solicitud de Vacaciones",
        tipo: "Módulo",
        permisos: { codigo: "SOL-VAC", nombre: "Solicitud de Vacaciones", ver: true, crear: true, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "mesa-ayuda-sso",
    codigo: "SSO-MA",
    nombre: "Mesa de Ayuda SSO",
    descripcion: "Centro de atención a usuarios, levantamiento de tickets de soporte técnico e incidencias de autenticación.",
    urlAcceso: "https://soporte.mineduc.gob.ec",
    icono: "Headphones",
    colorTone: "purple",
    sede: {
      id: "sede-pc",
      codigo: "PC-01",
      nombre: "Planta Central",
      tipo: "Planta Central",
    },
    rol: {
      id: "rol-usr-sol",
      nombre: "Usuario Solicitante",
      descripcion: "Creación y seguimiento de tickets de asistencia técnica y soporte de usuario.",
    },
    ultimoAcceso: "05/10/2026, 09:30",
    ultimoAccesoIso: "2026-10-05T09:30:00",
    estado: "Activa",
    categoria: "Soporte Institucional",
    recursos: [
      {
        id: "rec-ticket",
        codigo: "TICK-CREAR",
        nombre: "Gestión de Tickets",
        tipo: "Módulo",
        permisos: { codigo: "TICK-CREAR", nombre: "Gestión de Tickets", ver: true, crear: true, editar: false, eliminar: false },
      },
      {
        id: "rec-hist-sop",
        codigo: "HIST-SOP",
        nombre: "Historial de Incidencias",
        tipo: "Servicio",
        permisos: { codigo: "HIST-SOP", nombre: "Historial de Incidencias", ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "tramites-ciudadanos",
    codigo: "STC",
    nombre: "Sistema de Trámites Ciudadanos",
    descripcion: "Recepción, derivación y seguimiento a solicitudes y consultas docentes y ciudadanas.",
    urlAcceso: "https://tramites.mineduc.gob.ec",
    icono: "FileText",
    colorTone: "info",
    sede: {
      id: "sede-cz9",
      codigo: "CZ-09",
      nombre: "Coordinación Zonal 9",
      tipo: "Coordinación Zonal",
    },
    rol: {
      id: "rol-aten-doc",
      nombre: "Atención al Usuario Zonal",
      descripcion: "Revisión y respuesta a trámites asignados a la coordinación.",
    },
    ultimoAcceso: "28/09/2026, 15:10",
    ultimoAccesoIso: "2026-09-28T15:10:00",
    estado: "Activa",
    categoria: "Atención Ciudadana",
    recursos: [
      {
        id: "rec-tram",
        codigo: "TRAM-CONS",
        nombre: "Bandeja de Trámites",
        tipo: "Módulo",
        permisos: { codigo: "TRAM-CONS", nombre: "Bandeja de Trámites", ver: true, crear: false, editar: true, eliminar: false },
      },
      {
        id: "rec-notif",
        codigo: "NOTIF-RES",
        nombre: "Notificaciones y Resoluciones",
        tipo: "Servicio",
        permisos: { codigo: "NOTIF-RES", nombre: "Notificaciones y Resoluciones", ver: true, crear: true, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "biblioteca-digital",
    codigo: "BDM",
    nombre: "Biblioteca Digital Mineduc",
    descripcion: "Repositorio institucional de textos curriculares, guías pedagógicas y recursos multimedia.",
    urlAcceso: "https://biblioteca.mineduc.gob.ec",
    icono: "School",
    colorTone: "primary",
    sede: {
      id: "sede-pc",
      codigo: "PC-01",
      nombre: "Planta Central",
      tipo: "Planta Central",
    },
    rol: {
      id: "rol-cons-ped",
      nombre: "Consultor Pedagógico",
      descripcion: "Descarga y revisión de textos escolares y material curricular abierto.",
    },
    ultimoAcceso: "20/09/2026, 10:45",
    ultimoAccesoIso: "2026-09-20T10:45:00",
    estado: "Activa",
    categoria: "Recursos Educativos",
    recursos: [
      {
        id: "rec-biblio",
        codigo: "BIB-CAT",
        nombre: "Catálogo Curricular Digital",
        tipo: "Módulo",
        permisos: { codigo: "BIB-CAT", nombre: "Catálogo Curricular Digital", ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "geoportal-educativo",
    codigo: "GEO",
    nombre: "Geoportal de Infraestructura Educativa",
    descripcion: "Visualización geoespacial de instituciones educativas, distritos, zonas y riesgo de infraestructura.",
    urlAcceso: "https://geoportal.mineduc.gob.ec",
    icono: "Shield",
    colorTone: "warning",
    sede: {
      id: "sede-cz9",
      codigo: "CZ-09",
      nombre: "Coordinación Zonal 9",
      tipo: "Coordinación Zonal",
    },
    rol: {
      id: "rol-vis-geo",
      nombre: "Visor Territorial",
      descripcion: "Exploración de capas geográficas y fichas de unidades educativas de la zona.",
    },
    ultimoAcceso: "14/09/2026, 17:00",
    ultimoAccesoIso: "2026-09-14T17:00:00",
    estado: "Activa",
    categoria: "Planificación y Georreferencia",
    recursos: [
      {
        id: "rec-map",
        codigo: "MAP-TERR",
        nombre: "Visor de Capas Territoriales",
        tipo: "Módulo",
        permisos: { codigo: "MAP-TERR", nombre: "Visor de Capas Territoriales", ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        id: "rec-rep-infra",
        codigo: "REP-INFRA",
        nombre: "Fichas de Infraestructura",
        tipo: "Submódulo",
        permisos: { codigo: "REP-INFRA", nombre: "Fichas de Infraestructura", ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
];
