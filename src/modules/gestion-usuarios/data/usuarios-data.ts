export interface Recurso {
  codigo: string;
  nombre: string;
  tipo: "lectura" | "escritura" | "administracion" | "exportacion";
}

export interface RolAplicacion {
  aplicacionId: string;
  aplicacionNombre: string;
  rolId: string;
  rolNombre: string;
  recursos: string[];
}

export interface UsuarioItem {
  id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  correo: string;
  telefono: string;
  cargo: string;
  sede: string;
  estado: "Activo" | "Inactivo" | "Pendiente";
  ultimoAcceso: string;
  fechaCreacion: string;
  rolesAplicaciones: RolAplicacion[];
}

export const SEDES_MINEDUC = [
  "Planta Central (Quito)",
  "Coordinación Zonal 9 (DMQ)",
  "Coordinación Zonal 8 (Guayaquil - Samborondón)",
  "Coordinación Zonal 2 (Pichincha - Napo - Orellana)",
  "Coordinación Zonal 6 (Azuay - Cañar - Morona Santiago)",
  "Distrito 17D01 - Noroccidente",
  "Distrito 17D04 - Centro",
] as const;

export const APLICACIONES_MINEDUC = [
  "SIGE",
  "Geoportal",
  "SAE",
  "SSO",
  "SGC",
  "Trámites",
  "Innovación",
] as const;

export const ESTADOS_USUARIO = ["Activo", "Inactivo", "Pendiente"] as const;

export const mockUsuariosData: UsuarioItem[] = [
  {
    id: "usr-01",
    nombre: "Paula Andrea",
    apellidos: "Rozo Salazar",
    identificacion: "1724589632",
    correo: "paula.rozo@minedec.gov.co",
    telefono: "+593 99 874 5210",
    cargo: "Administradora de Identidades y Accesos",
    sede: "Planta Central (Quito)",
    estado: "Activo",
    ultimoAcceso: "Hoy, 14:32",
    fechaCreacion: "12/01/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "sso",
        aplicacionNombre: "SSO",
        rolId: "superadmin",
        rolNombre: "Super Administrador",
        recursos: [
          "sso:usuarios:full",
          "sso:roles:administrar",
          "sso:auditoria:consultar",
          "sso:seguridad:politicas",
        ],
      },
      {
        aplicacionId: "geoportal",
        aplicacionNombre: "Geoportal",
        rolId: "admin_geoportal",
        rolNombre: "Administrador de Capas",
        recursos: [
          "geoportal:capas:publicar",
          "geoportal:metadatos:editar",
          "geoportal:servidores:configurar",
        ],
      },
      {
        aplicacionId: "sige",
        aplicacionNombre: "SIGE",
        rolId: "auditor_sige",
        rolNombre: "Auditor Nacional",
        recursos: ["sige:instituciones:lectura", "sige:auditoria:reportes"],
      },
    ],
  },
  {
    id: "usr-02",
    nombre: "Carlos Eduardo",
    apellidos: "Mendoza Viteri",
    identificacion: "1715896324",
    correo: "carlos.mendoza@minedec.gov.co",
    telefono: "+593 98 456 1234",
    cargo: "Especialista de Sistemas de Información",
    sede: "Planta Central (Quito)",
    estado: "Activo",
    ultimoAcceso: "Hoy, 11:15",
    fechaCreacion: "05/03/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "geoportal",
        aplicacionNombre: "Geoportal",
        rolId: "especialista_sig",
        rolNombre: "Especialista SIG",
        recursos: [
          "geoportal:capas:lectura",
          "geoportal:analisis:ejecutar",
          "geoportal:mapas:exportar",
        ],
      },
      {
        aplicacionId: "sige",
        aplicacionNombre: "SIGE",
        rolId: "tecnico_soporte",
        rolNombre: "Técnico de Integración",
        recursos: ["sige:matriculas:lectura", "sige:sedes:sincronizar"],
      },
    ],
  },
  {
    id: "usr-03",
    nombre: "María Fernanda",
    apellidos: "Gómez Andrade",
    identificacion: "1719874563",
    correo: "maria.gomez@minedec.gov.co",
    telefono: "+593 97 123 7890",
    cargo: "Directora Zonal de Talento Humano",
    sede: "Coordinación Zonal 9 (DMQ)",
    estado: "Activo",
    ultimoAcceso: "Ayer, 16:45",
    fechaCreacion: "18/02/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "sso",
        aplicacionNombre: "SSO",
        rolId: "gestor_accesos",
        rolNombre: "Gestor Zonal de Usuarios",
        recursos: ["sso:usuarios:crear", "sso:usuarios:inactivar"],
      },
      {
        aplicacionId: "sgc",
        aplicacionNombre: "SGC",
        rolId: "director_th",
        rolNombre: "Director de Gestión Calidad",
        recursos: ["sgc:auditorias:aprobar", "sgc:planes:gestionar"],
      },
    ],
  },
  {
    id: "usr-04",
    nombre: "Juan Pablo",
    apellidos: "Ortiz Noboa",
    identificacion: "0923456781",
    correo: "juan.ortiz@minedec.gov.co",
    telefono: "+593 96 321 4567",
    cargo: "Analista de Admisión y Matrícula",
    sede: "Coordinación Zonal 8 (Guayaquil - Samborondón)",
    estado: "Activo",
    ultimoAcceso: "Hoy, 09:20",
    fechaCreacion: "22/04/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "sae",
        aplicacionNombre: "SAE",
        rolId: "analista_cupos",
        rolNombre: "Analista de Cupos",
        recursos: ["sae:asignaciones:procesar", "sae:reportes:exportar"],
      },
      {
        aplicacionId: "sige",
        aplicacionNombre: "SIGE",
        rolId: "operador_matricula",
        rolNombre: "Operador Matriculación",
        recursos: ["sige:estudiantes:editar", "sige:matriculas:crear"],
      },
    ],
  },
  {
    id: "usr-05",
    nombre: "Diana Carolina",
    apellidos: "Villacís Mora",
    identificacion: "1720145896",
    correo: "diana.villacis@minedec.gov.co",
    telefono: "+593 95 654 3218",
    cargo: "Responsable de Ventanilla y Atención Ciudadana",
    sede: "Distrito 17D01 - Noroccidente",
    estado: "Activo",
    ultimoAcceso: "Hace 2 días",
    fechaCreacion: "10/05/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "tramites",
        aplicacionNombre: "Trámites",
        rolId: "gestor_tramites",
        rolNombre: "Gestor de Trámites",
        recursos: [
          "tramites:solicitudes:revisar",
          "tramites:documentos:validar",
          "tramites:notificaciones:enviar",
        ],
      },
    ],
  },
  {
    id: "usr-06",
    nombre: "Roberto Javier",
    apellidos: "Cárdenas Silva",
    identificacion: "1803214569",
    correo: "roberto.cardenas@minedec.gov.co",
    telefono: "+593 99 112 3344",
    cargo: "Auditor de Seguridad de la Información",
    sede: "Planta Central (Quito)",
    estado: "Inactivo",
    ultimoAcceso: "14/09/2026",
    fechaCreacion: "14/01/2023",
    rolesAplicaciones: [
      {
        aplicacionId: "sso",
        aplicacionNombre: "SSO",
        rolId: "auditor_sec",
        rolNombre: "Auditor de Seguridad",
        recursos: ["sso:auditoria:consultar", "sso:logs:exportar"],
      },
    ],
  },
  {
    id: "usr-07",
    nombre: "Lucía Gabriela",
    apellidos: "Paredes Roldán",
    identificacion: "0104567892",
    correo: "lucia.paredes@minedec.gov.co",
    telefono: "+593 98 776 5544",
    cargo: "Coordinadora Zonal de Planificación Educativa",
    sede: "Coordinación Zonal 6 (Azuay - Cañar - Morona Santiago)",
    estado: "Activo",
    ultimoAcceso: "Hoy, 12:05",
    fechaCreacion: "30/06/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "geoportal",
        aplicacionNombre: "Geoportal",
        rolId: "consultor_territorio",
        rolNombre: "Consultor Territorial",
        recursos: ["geoportal:capas:lectura", "geoportal:indicadores:analisis"],
      },
      {
        aplicacionId: "sae",
        aplicacionNombre: "SAE",
        rolId: "coord_admision",
        rolNombre: "Coordinador de Admisión",
        recursos: ["sae:oferta:planificar", "sae:reportes:consolidados"],
      },
      {
        aplicacionId: "innovacion",
        aplicacionNombre: "Innovación",
        rolId: "evaluador_proy",
        rolNombre: "Evaluador de Proyectos",
        recursos: ["innovacion:propuestas:calificar"],
      },
    ],
  },
  {
    id: "usr-08",
    nombre: "Esteban Andrés",
    apellidos: "Vega Benítez",
    identificacion: "1500234567",
    correo: "esteban.vega@minedec.gov.co",
    telefono: "+593 97 998 8776",
    cargo: "Técnico Zonal de Infraestructura",
    sede: "Coordinación Zonal 2 (Pichincha - Napo - Orellana)",
    estado: "Pendiente",
    ultimoAcceso: "Sin registro",
    fechaCreacion: "02/10/2026",
    rolesAplicaciones: [
      {
        aplicacionId: "geoportal",
        aplicacionNombre: "Geoportal",
        rolId: "levantamiento_campo",
        rolNombre: "Técnico de Campo",
        recursos: ["geoportal:puntos:capturar"],
      },
    ],
  },
  {
    id: "usr-09",
    nombre: "Verónica Patricia",
    apellidos: "Almeida Carrera",
    identificacion: "1714523698",
    correo: "veronica.almeida@minedec.gov.co",
    telefono: "+593 96 554 4332",
    cargo: "Especialista de Calidad Educativa",
    sede: "Distrito 17D04 - Centro",
    estado: "Activo",
    ultimoAcceso: "Hoy, 08:40",
    fechaCreacion: "19/07/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "sgc",
        aplicacionNombre: "SGC",
        rolId: "tecnico_calidad",
        rolNombre: "Técnico de Soporte Calidad",
        recursos: ["sgc:documental:control", "sgc:evidencias:cargar"],
      },
      {
        aplicacionId: "innovacion",
        aplicacionNombre: "Innovación",
        rolId: "gestor_pedagogico",
        rolNombre: "Gestor Pedagógico",
        recursos: ["innovacion:guias:publicar"],
      },
    ],
  },
  {
    id: "usr-10",
    nombre: "Hugo Francisco",
    apellidos: "Pazmiño Terán",
    identificacion: "0918765432",
    correo: "hugo.pazmino@minedec.gov.co",
    telefono: "+593 95 112 2334",
    cargo: "Analista de Mesa de Servicios SSO",
    sede: "Coordinación Zonal 8 (Guayaquil - Samborondón)",
    estado: "Activo",
    ultimoAcceso: "Ayer, 18:10",
    fechaCreacion: "11/08/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "sso",
        aplicacionNombre: "SSO",
        rolId: "operador_helpdesk",
        rolNombre: "Operador de Mesa de Ayuda",
        recursos: [
          "sso:claves:reestablecer",
          "sso:cuentas:desbloquear",
          "sso:usuarios:consulta",
        ],
      },
    ],
  },
  {
    id: "usr-11",
    nombre: "Silvia Elena",
    apellidos: "Guamán Yánez",
    identificacion: "0602345678",
    correo: "silvia.guaman@minedec.gov.co",
    telefono: "+593 99 334 5566",
    cargo: "Directora Distrital de Educación",
    sede: "Distrito 17D01 - Noroccidente",
    estado: "Activo",
    ultimoAcceso: "Hoy, 10:30",
    fechaCreacion: "03/01/2024",
    rolesAplicaciones: [
      {
        aplicacionId: "sige",
        aplicacionNombre: "SIGE",
        rolId: "director_distrital",
        rolNombre: "Director Distrital",
        recursos: ["sige:instituciones:aprobar", "sige:docentes:consultar"],
      },
      {
        aplicacionId: "tramites",
        aplicacionNombre: "Trámites",
        rolId: "revisor_documental",
        rolNombre: "Revisor Documental",
        recursos: ["tramites:firmas:autorizar"],
      },
    ],
  },
  {
    id: "usr-12",
    nombre: "Fernando Javier",
    apellidos: "Montenegro Lara",
    identificacion: "1002345671",
    correo: "fernando.montenegro@minedec.gov.co",
    telefono: "+593 98 223 3445",
    cargo: "Técnico Informático Zonal",
    sede: "Coordinación Zonal 2 (Pichincha - Napo - Orellana)",
    estado: "Inactivo",
    ultimoAcceso: "01/08/2026",
    fechaCreacion: "15/09/2023",
    rolesAplicaciones: [
      {
        aplicacionId: "sige",
        aplicacionNombre: "SIGE",
        rolId: "tecnico_soporte",
        rolNombre: "Técnico de Soporte",
        recursos: ["sige:usuarios:soporte"],
      },
    ],
  },
];

