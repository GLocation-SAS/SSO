export interface PermisoMatriz {
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export interface RecursoPermisoItem {
  recursoId: string;
  acceso: boolean;
  permisos: PermisoMatriz;
}

export interface RecursoAppItem {
  id: string;
  aplicacionId: string;
  nombre: string;
  descripcion: string;
  padreId?: string | null;
  padreNombre?: string | null;
  nivel: number;
}

export interface RolItem {
  id: string;
  nombre: string;
  descripcion: string;
  aplicacionId: string;
  aplicacionNombre: string;
  aplicacionCodigo: string;
  aplicacionIcono?: string;
  estado: "Activo" | "Inactivo";
  usuariosCount: number;
  recursosAsignados: RecursoPermisoItem[];
  fechaCreacion: string;
  ultimaActualizacion: string;
}

export interface AplicacionRef {
  id: string;
  codigo: string;
  nombre: string;
  icono?: string;
}

// ── Lista de Aplicaciones Disponibles ──────────────────────────────────────────
export const mockAplicacionesParaRoles: AplicacionRef[] = [
  {
    id: "gestion-docente",
    codigo: "SGD",
    nombre: "Gestión Docente",
    icono: "GraduationCap",
  },
  {
    id: "talento-humano",
    codigo: "TH",
    nombre: "Talento Humano",
    icono: "Briefcase",
  },
  {
    id: "sige",
    codigo: "SIGE",
    nombre: "SIGE",
    icono: "BookOpen",
  },
  {
    id: "sso-conecta",
    codigo: "SSO",
    nombre: "SSO Conecta",
    icono: "KeyRound",
  },
  {
    id: "geoportal",
    codigo: "GEO",
    nombre: "Geoportal",
    icono: "MapPin",
  },
  {
    id: "sae",
    codigo: "SAE",
    nombre: "SAE",
    icono: "Layers",
  },
];

// ── Recursos Jerárquicos por Aplicación ───────────────────────────────────────
export const mockRecursosPorAppParaRoles: Record<string, RecursoAppItem[]> = {
  "gestion-docente": [
    {
      id: "sgd-docentes",
      aplicacionId: "gestion-docente",
      nombre: "Docentes",
      descripcion: "Padrón central y catálogo de personal docente institucional.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sgd-doc-info",
      aplicacionId: "gestion-docente",
      nombre: "Información y Ficha Personal",
      descripcion: "Datos demográficos, títulos registrados y contacto.",
      padreId: "sgd-docentes",
      padreNombre: "Docentes",
      nivel: 1,
    },
    {
      id: "sgd-doc-trayectoria",
      aplicacionId: "gestion-docente",
      nombre: "Trayectoria y Méritos",
      descripcion: "Historial de cargos, calificaciones docentes y ascensos.",
      padreId: "sgd-docentes",
      padreNombre: "Docentes",
      nivel: 1,
    },
    {
      id: "sgd-doc-acciones",
      aplicacionId: "gestion-docente",
      nombre: "Acciones de Personal",
      descripcion: "Nombramientos, licencias, traslados y cesaciones.",
      padreId: "sgd-docentes",
      padreNombre: "Docentes",
      nivel: 1,
    },
    {
      id: "sgd-contratos",
      aplicacionId: "gestion-docente",
      nombre: "Contratos y Nombramientos",
      descripcion: "Gestión contractual y convenios pedagógicos.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sgd-contratos-partidas",
      aplicacionId: "gestion-docente",
      nombre: "Partidas Presupuestarias",
      descripcion: "Certificación financiera y asignación de códigos de vacante.",
      padreId: "sgd-contratos",
      padreNombre: "Contratos y Nombramientos",
      nivel: 1,
    },
    {
      id: "sgd-reportes",
      aplicacionId: "gestion-docente",
      nombre: "Reportes y Estadísticas",
      descripcion: "Consolidados distritales y distribución zonal docente.",
      padreId: null,
      nivel: 0,
    },
  ],
  "talento-humano": [
    {
      id: "th-personal",
      aplicacionId: "talento-humano",
      nombre: "Personal Administrativo",
      descripcion: "Expedientes de planta técnica y servidores públicos.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "th-personal-expedientes",
      aplicacionId: "talento-humano",
      nombre: "Expedientes Digitales",
      descripcion: "Documentación legal y contratos laborales.",
      padreId: "th-personal",
      padreNombre: "Personal Administrativo",
      nivel: 1,
    },
    {
      id: "th-personal-asistencia",
      aplicacionId: "talento-humano",
      nombre: "Control de Asistencia",
      descripcion: "Marcaciones biométricas, justificaciones y vacaciones.",
      padreId: "th-personal",
      padreNombre: "Personal Administrativo",
      nivel: 1,
    },
    {
      id: "th-nomina",
      aplicacionId: "talento-humano",
      nombre: "Nómina y Remuneraciones",
      descripcion: "Roles de pago, beneficios legales y descuentos de ley.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "th-nomina-roles",
      aplicacionId: "talento-humano",
      nombre: "Emisión de Roles de Pago",
      descripcion: "Cálculo y dispersión de nómina quincenal y mensual.",
      padreId: "th-nomina",
      padreNombre: "Nómina y Remuneraciones",
      nivel: 1,
    },
    {
      id: "th-evaluaciones",
      aplicacionId: "talento-humano",
      nombre: "Evaluación del Desempeño",
      descripcion: "Metas semestrales y planes de mejora individual.",
      padreId: null,
      nivel: 0,
    },
  ],
  "sige": [
    {
      id: "sige-matriculas",
      aplicacionId: "sige",
      nombre: "Matrículas y Estudiantes",
      descripcion: "Padrón estudiantil nacional y registros de ingreso.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sige-matriculas-cupos",
      aplicacionId: "sige",
      nombre: "Asignación de Cupos",
      descripcion: "Distribución automática por circuito y zonificación.",
      padreId: "sige-matriculas",
      padreNombre: "Matrículas y Estudiantes",
      nivel: 1,
    },
    {
      id: "sige-matriculas-traslados",
      aplicacionId: "sige",
      nombre: "Traslados Interinstitucionales",
      descripcion: "Cambios de institución fiscal o particular.",
      padreId: "sige-matriculas",
      padreNombre: "Matrículas y Estudiantes",
      nivel: 1,
    },
    {
      id: "sige-calificaciones",
      aplicacionId: "sige",
      nombre: "Calificaciones y Asistencia",
      descripcion: "Quimestres, trimestres y actas de grado.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sige-sedes",
      aplicacionId: "sige",
      nombre: "Sedes e Infraestructura",
      descripcion: "Catálogo de planteles educativos a nivel nacional.",
      padreId: null,
      nivel: 0,
    },
  ],
  "sso-conecta": [
    {
      id: "sso-usuarios",
      aplicacionId: "sso-conecta",
      nombre: "Directorio de Identidades",
      descripcion: "Gestión de cuentas globales, correos institucionales y claves.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sso-federacion",
      aplicacionId: "sso-conecta",
      nombre: "Federación y Proveedores de Identidad",
      descripcion: "Configuración SAML 2.0 y OpenID Connect.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sso-politicas",
      aplicacionId: "sso-conecta",
      nombre: "Políticas de Seguridad y 2FA",
      descripcion: "Parámetros de contraseñas y doble factor obligatorio.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sso-auditoria",
      aplicacionId: "sso-conecta",
      nombre: "Logs de Sesión y Auditoría",
      descripcion: "Registro inmutable de autenticaciones y denegaciones.",
      padreId: null,
      nivel: 0,
    },
  ],
  "geoportal": [
    {
      id: "geo-capas",
      aplicacionId: "geoportal",
      nombre: "Capas Cartográficas",
      descripcion: "Capas vectoriales de zonas y predios educativos.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "geo-capas-distritos",
      aplicacionId: "geoportal",
      nombre: "Límites Distritales y Circuitos",
      descripcion: "Polígonos oficiales de división territorial.",
      padreId: "geo-capas",
      padreNombre: "Capas Cartográficas",
      nivel: 1,
    },
    {
      id: "geo-analisis",
      aplicacionId: "geoportal",
      nombre: "Análisis Espacial y Riesgos",
      descripcion: "Mapas de calor de demanda y vulnerabilidad ambiental.",
      padreId: null,
      nivel: 0,
    },
  ],
  "sae": [
    {
      id: "sae-convocatorias",
      aplicacionId: "sae",
      nombre: "Convocatorias y Cronogramas",
      descripcion: "Períodos de postulación régimen Costa y Sierra.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sae-postulaciones",
      aplicacionId: "sae",
      nombre: "Bandeja de Postulaciones",
      descripcion: "Recepción de solicitudes de representantes legales.",
      padreId: null,
      nivel: 0,
    },
    {
      id: "sae-auditoria",
      aplicacionId: "sae",
      nombre: "Auditoría de Algoritmo",
      descripcion: "Trazabilidad de asignaciones y criterios de prioridad.",
      padreId: null,
      nivel: 0,
    },
  ],
};

// ── Mock Data: Roles Iniciales ────────────────────────────────────────────────
export const mockRolesData: RolItem[] = [
  {
    id: "rol-sgd-admin",
    nombre: "Administrador General",
    descripcion: "Control total sobre la gestión docente, catálogo de méritos y auditoría integral.",
    aplicacionId: "gestion-docente",
    aplicacionNombre: "Gestión Docente",
    aplicacionCodigo: "SGD",
    estado: "Activo",
    usuariosCount: 12,
    fechaCreacion: "12/01/2024",
    ultimaActualizacion: "05/10/2026, 14:32",
    recursosAsignados: [
      {
        recursoId: "sgd-docentes",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sgd-doc-info",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sgd-doc-trayectoria",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sgd-doc-acciones",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sgd-contratos",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sgd-contratos-partidas",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sgd-reportes",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
    ],
  },
  {
    id: "rol-sgd-jefe-th",
    nombre: "Jefe de Talento Humano",
    descripcion: "Validación de convocatorias docentes, méritos y emisión de resoluciones zonales.",
    aplicacionId: "gestion-docente",
    aplicacionNombre: "Gestión Docente",
    aplicacionCodigo: "SGD",
    estado: "Activo",
    usuariosCount: 28,
    fechaCreacion: "18/01/2024",
    ultimaActualizacion: "04/10/2026, 11:20",
    recursosAsignados: [
      {
        recursoId: "sgd-docentes",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "sgd-doc-info",
        acceso: true,
        permisos: { ver: true, crear: false, editar: true, eliminar: false },
      },
      {
        recursoId: "sgd-doc-trayectoria",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "sgd-doc-acciones",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "sgd-reportes",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sgd-th-distrital",
    nombre: "Talento Humano Distrital",
    descripcion: "Registro de novedades de planta, control biométrico y asistencia en distrito escolar.",
    aplicacionId: "gestion-docente",
    aplicacionNombre: "Gestión Docente",
    aplicacionCodigo: "SGD",
    estado: "Activo",
    usuariosCount: 185,
    fechaCreacion: "02/02/2024",
    ultimaActualizacion: "02/10/2026, 09:15",
    recursosAsignados: [
      {
        recursoId: "sgd-docentes",
        acceso: true,
        permisos: { ver: true, crear: false, editar: true, eliminar: false },
      },
      {
        recursoId: "sgd-doc-info",
        acceso: true,
        permisos: { ver: true, crear: false, editar: true, eliminar: false },
      },
      {
        recursoId: "sgd-doc-trayectoria",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sgd-docente",
    nombre: "Docente",
    descripcion: "Consulta personal de asignación horaria, distributivo y descarga de certificados.",
    aplicacionId: "gestion-docente",
    aplicacionNombre: "Gestión Docente",
    aplicacionCodigo: "SGD",
    estado: "Activo",
    usuariosCount: 1140,
    fechaCreacion: "05/02/2024",
    ultimaActualizacion: "01/10/2026, 17:00",
    recursosAsignados: [
      {
        recursoId: "sgd-docentes",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        recursoId: "sgd-doc-info",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-th-adm-nomina",
    nombre: "Administrador de Nómina",
    descripcion: "Consolidación de rubros remunerativos y emisión de roles de pago.",
    aplicacionId: "talento-humano",
    aplicacionNombre: "Talento Humano",
    aplicacionCodigo: "TH",
    estado: "Activo",
    usuariosCount: 18,
    fechaCreacion: "20/02/2024",
    ultimaActualizacion: "04/10/2026, 11:15",
    recursosAsignados: [
      {
        recursoId: "th-personal",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        recursoId: "th-nomina",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "th-nomina-roles",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
    ],
  },
  {
    id: "rol-th-analista",
    nombre: "Analista de Acciones",
    descripcion: "Emisión de resoluciones administrativas de ascensos, comisiones y licencias.",
    aplicacionId: "talento-humano",
    aplicacionNombre: "Talento Humano",
    aplicacionCodigo: "TH",
    estado: "Activo",
    usuariosCount: 64,
    fechaCreacion: "24/02/2024",
    ultimaActualizacion: "03/10/2026, 15:30",
    recursosAsignados: [
      {
        recursoId: "th-personal",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "th-personal-expedientes",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "th-personal-asistencia",
        acceso: true,
        permisos: { ver: true, crear: false, editar: true, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sige-auditor",
    nombre: "Auditor Nacional",
    descripcion: "Supervisión analítica de matrículas, actas de grado e indicadores de deserción.",
    aplicacionId: "sige",
    aplicacionNombre: "SIGE",
    aplicacionCodigo: "SIGE",
    estado: "Activo",
    usuariosCount: 14,
    fechaCreacion: "15/03/2023",
    ultimaActualizacion: "06/10/2026, 09:10",
    recursosAsignados: [
      {
        recursoId: "sige-matriculas",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        recursoId: "sige-calificaciones",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        recursoId: "sige-sedes",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sige-operador",
    nombre: "Operador de Matriculación",
    descripcion: "Registro de inscripciones escolares ordinarias y extraordinarias en planteles.",
    aplicacionId: "sige",
    aplicacionNombre: "SIGE",
    aplicacionCodigo: "SIGE",
    estado: "Activo",
    usuariosCount: 520,
    fechaCreacion: "10/04/2023",
    ultimaActualizacion: "05/10/2026, 16:40",
    recursosAsignados: [
      {
        recursoId: "sige-matriculas",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "sige-matriculas-cupos",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "sige-matriculas-traslados",
        acceso: true,
        permisos: { ver: true, crear: true, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sso-admin-seg",
    nombre: "Administrador de Seguridad",
    descripcion: "Configuración de políticas de doble factor, revocación de tokens y auditoría.",
    aplicacionId: "sso-conecta",
    aplicacionNombre: "SSO Conecta",
    aplicacionCodigo: "SSO",
    estado: "Activo",
    usuariosCount: 5,
    fechaCreacion: "15/11/2023",
    ultimaActualizacion: "06/10/2026, 16:45",
    recursosAsignados: [
      {
        recursoId: "sso-usuarios",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sso-federacion",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "sso-politicas",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: true },
      },
      {
        recursoId: "sso-auditoria",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-geo-planificador",
    nombre: "Planificador Territorial",
    descripcion: "Edición de polígonos de circuitos y asignación cartográfica de nuevas unidades.",
    aplicacionId: "geoportal",
    aplicacionNombre: "Geoportal",
    aplicacionCodigo: "GEO",
    estado: "Inactivo",
    usuariosCount: 0,
    fechaCreacion: "18/06/2024",
    ultimaActualizacion: "02/10/2026, 17:00",
    recursosAsignados: [
      {
        recursoId: "geo-capas",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
      {
        recursoId: "geo-capas-distritos",
        acceso: true,
        permisos: { ver: true, crear: false, editar: true, eliminar: false },
      },
      {
        recursoId: "geo-analisis",
        acceso: true,
        permisos: { ver: true, crear: true, editar: true, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sae-auditor",
    nombre: "Auditor de Asignaciones",
    descripcion: "Revisión independiente de asignaciones de cupos y verificación de reglas de prioridad.",
    aplicacionId: "sae",
    aplicacionNombre: "SAE",
    aplicacionCodigo: "SAE",
    estado: "Activo",
    usuariosCount: 8,
    fechaCreacion: "10/08/2024",
    ultimaActualizacion: "01/10/2026, 13:20",
    recursosAsignados: [
      {
        recursoId: "sae-convocatorias",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        recursoId: "sae-postulaciones",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
      {
        recursoId: "sae-auditoria",
        acceso: true,
        permisos: { ver: true, crear: false, editar: false, eliminar: false },
      },
    ],
  },
  {
    id: "rol-sgd-temporal",
    nombre: "Revisor Temporal de Partidas",
    descripcion: "Rol transitorio para fiscalización externa de vacantes presupuestarias.",
    aplicacionId: "gestion-docente",
    aplicacionNombre: "Gestión Docente",
    aplicacionCodigo: "SGD",
    estado: "Inactivo",
    usuariosCount: 0,
    fechaCreacion: "15/09/2026",
    ultimaActualizacion: "28/09/2026, 10:00",
    recursosAsignados: [], // Sin recursos configurados
  },
  {
    id: "rol-th-sin-recursos",
    nombre: "Operador de Bienestar Social",
    descripcion: "Gestión de subsidios de guardería y seguros de vida complementarios.",
    aplicacionId: "talento-humano",
    aplicacionNombre: "Talento Humano",
    aplicacionCodigo: "TH",
    estado: "Activo",
    usuariosCount: 3,
    fechaCreacion: "22/09/2026",
    ultimaActualizacion: "04/10/2026, 09:30",
    recursosAsignados: [], // Sin recursos configurados
  },
];
