export interface UserAppUsageBreakdown {
  aplicacion: string;
  accesos: number;
  porcentaje: number;
  color?: string;
}

export interface UserActivityDailyPoint {
  fecha: string;
  diaSemana: string;
  accesos: number;
}

export interface UsuarioActividadItem {
  id: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    cedula: string;
    cargo: string;
  };
  rolPrincipal: string;
  sede: string;
  aplicacionesUtilizadas: string[];
  totalAccesos: number;
  ultimaActividad: string;
  ultimaActividadRelativa: string;
  nivelActividad: "Alta" | "Media" | "Baja" | "Sin actividad";
  desglosePorApp: UserAppUsageBreakdown[];
  evolucionSemanal: UserActivityDailyPoint[];
}

export const mockActividadUsuarios: UsuarioActividadItem[] = [
  {
    id: "ACT-001",
    usuario: {
      id: "usr-01",
      nombre: "María Belén Solís",
      email: "maria.solis@educacion.gob.ec",
      cedula: "1718293849",
      cargo: "Docente Titular",
    },
    rolPrincipal: "Docente Titular",
    sede: "Coordinación Zonal 9",
    aplicacionesUtilizadas: ["Gestión Docente", "SIGE", "SSO Conecta"],
    totalAccesos: 142,
    ultimaActividad: "06/10/2026 14:48",
    ultimaActividadRelativa: "Hace 12 min",
    nivelActividad: "Alta",
    desglosePorApp: [
      { aplicacion: "Gestión Docente", accesos: 86, porcentaje: 60, color: "var(--chart-1)" },
      { aplicacion: "SIGE", accesos: 44, porcentaje: 31, color: "var(--chart-2)" },
      { aplicacion: "SSO Conecta", accesos: 12, porcentaje: 9, color: "var(--chart-3)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 18 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 26 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 22 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 30 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 28 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 8 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 10 },
    ],
  },
  {
    id: "ACT-002",
    usuario: {
      id: "usr-02",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cedula: "1709283741",
      cargo: "Administrador General SSO",
    },
    rolPrincipal: "Administrador General",
    sede: "Planta Central",
    aplicacionesUtilizadas: ["SSO Conecta", "Gestión Docente", "Talento Humano", "SIGE"],
    totalAccesos: 215,
    ultimaActividad: "06/10/2026 14:35",
    ultimaActividadRelativa: "Hace 25 min",
    nivelActividad: "Alta",
    desglosePorApp: [
      { aplicacion: "SSO Conecta", accesos: 110, porcentaje: 51, color: "var(--chart-3)" },
      { aplicacion: "Gestión Docente", accesos: 48, porcentaje: 22, color: "var(--chart-1)" },
      { aplicacion: "Talento Humano", accesos: 35, porcentaje: 16, color: "var(--chart-4)" },
      { aplicacion: "SIGE", accesos: 22, porcentaje: 11, color: "var(--chart-2)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 32 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 38 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 35 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 41 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 39 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 12 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 18 },
    ],
  },
  {
    id: "ACT-003",
    usuario: {
      id: "usr-03",
      nombre: "Paola Andrea Paredes",
      email: "paola.paredes@educacion.gob.ec",
      cedula: "0921884729",
      cargo: "Operadora de Distrito",
    },
    rolPrincipal: "Operador de Distrito",
    sede: "Distrito 09D03",
    aplicacionesUtilizadas: ["SIGE", "Gestión Docente"],
    totalAccesos: 94,
    ultimaActividad: "06/10/2026 14:22",
    ultimaActividadRelativa: "Hace 38 min",
    nivelActividad: "Media",
    desglosePorApp: [
      { aplicacion: "SIGE", accesos: 62, porcentaje: 66, color: "var(--chart-2)" },
      { aplicacion: "Gestión Docente", accesos: 32, porcentaje: 34, color: "var(--chart-1)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 12 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 15 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 18 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 20 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 19 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 4 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 6 },
    ],
  },
  {
    id: "ACT-004",
    usuario: {
      id: "usr-05",
      nombre: "Diana Marisol Vega",
      email: "diana.vega@educacion.gob.ec",
      cedula: "0915678234",
      cargo: "Administradora Zonal",
    },
    rolPrincipal: "Administradora Zonal",
    sede: "Coordinación Zonal 8",
    aplicacionesUtilizadas: ["Geoportal", "SIGE", "Talento Humano"],
    totalAccesos: 128,
    ultimaActividad: "06/10/2026 12:40",
    ultimaActividadRelativa: "Hoy, 12:40",
    nivelActividad: "Alta",
    desglosePorApp: [
      { aplicacion: "Geoportal", accesos: 70, porcentaje: 55, color: "var(--chart-5)" },
      { aplicacion: "SIGE", accesos: 38, porcentaje: 30, color: "var(--chart-2)" },
      { aplicacion: "Talento Humano", accesos: 20, porcentaje: 15, color: "var(--chart-4)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 16 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 22 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 24 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 25 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 23 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 8 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 10 },
    ],
  },
  {
    id: "ACT-005",
    usuario: {
      id: "usr-06",
      nombre: "Roberto Daniel Cárdenas",
      email: "roberto.cardenas@educacion.gob.ec",
      cedula: "1709482710",
      cargo: "Docente de Básica",
    },
    rolPrincipal: "Docente",
    sede: "Planta Central",
    aplicacionesUtilizadas: ["Gestión Docente"],
    totalAccesos: 41,
    ultimaActividad: "06/10/2026 11:15",
    ultimaActividadRelativa: "Hoy, 11:15",
    nivelActividad: "Media",
    desglosePorApp: [
      { aplicacion: "Gestión Docente", accesos: 41, porcentaje: 100, color: "var(--chart-1)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 5 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 8 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 7 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 9 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 8 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 2 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 2 },
    ],
  },
  {
    id: "ACT-006",
    usuario: {
      id: "usr-07",
      nombre: "Fernando Vinicio Castro",
      email: "fernando.castro@educacion.gob.ec",
      cedula: "1103948271",
      cargo: "Analista Administrativo",
    },
    rolPrincipal: "Consulta Personal",
    sede: "Distrito 11D01",
    aplicacionesUtilizadas: ["Talento Humano"],
    totalAccesos: 32,
    ultimaActividad: "06/10/2026 10:05",
    ultimaActividadRelativa: "Hoy, 10:05",
    nivelActividad: "Media",
    desglosePorApp: [
      { aplicacion: "Talento Humano", accesos: 32, porcentaje: 100, color: "var(--chart-4)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 4 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 6 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 5 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 7 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 6 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 1 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 3 },
    ],
  },
  {
    id: "ACT-007",
    usuario: {
      id: "usr-08",
      nombre: "Silvia Mariana Guamán",
      email: "silvia.guaman@educacion.gob.ec",
      cedula: "1714938201",
      cargo: "Rectora de Unidad Educativa",
    },
    rolPrincipal: "Rector",
    sede: "Distrito 17D01",
    aplicacionesUtilizadas: ["SIGE", "Gestión Docente"],
    totalAccesos: 88,
    ultimaActividad: "06/10/2026 09:20",
    ultimaActividadRelativa: "Hoy, 09:20",
    nivelActividad: "Media",
    desglosePorApp: [
      { aplicacion: "SIGE", accesos: 55, porcentaje: 62, color: "var(--chart-2)" },
      { aplicacion: "Gestión Docente", accesos: 33, porcentaje: 38, color: "var(--chart-1)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 14 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 16 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 15 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 18 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 16 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 4 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 5 },
    ],
  },
  {
    id: "ACT-008",
    usuario: {
      id: "usr-10",
      nombre: "Gonzalo Javier Ortiz",
      email: "gonzalo.ortiz@educacion.gob.ec",
      cedula: "0912445892",
      cargo: "Especialista Territorial",
    },
    rolPrincipal: "Visualizador Zonal",
    sede: "Coordinación Zonal 8",
    aplicacionesUtilizadas: ["Geoportal"],
    totalAccesos: 27,
    ultimaActividad: "05/10/2026 16:10",
    ultimaActividadRelativa: "Ayer, 16:10",
    nivelActividad: "Baja",
    desglosePorApp: [
      { aplicacion: "Geoportal", accesos: 27, porcentaje: 100, color: "var(--chart-5)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 3 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 5 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 6 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 4 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 7 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 1 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 1 },
    ],
  },
  {
    id: "ACT-009",
    usuario: {
      id: "usr-04",
      nombre: "Jorge Luis Zambrano",
      email: "jorge.zambrano@educacion.gob.ec",
      cedula: "0918237412",
      cargo: "Analista de Talento Humano",
    },
    rolPrincipal: "Analista de Nómina",
    sede: "Planta Central",
    aplicacionesUtilizadas: [],
    totalAccesos: 0,
    ultimaActividad: "Sin actividad en el periodo",
    ultimaActividadRelativa: "Inactivo",
    nivelActividad: "Sin actividad",
    desglosePorApp: [],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 0 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 0 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 0 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 0 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 0 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 0 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 0 },
    ],
  },
  {
    id: "ACT-010",
    usuario: {
      id: "usr-09",
      nombre: "Luis Alberto Guanoluisa",
      email: "luis.guanoluisa@educacion.gob.ec",
      cedula: "0104928374",
      cargo: "Operador de Soporte Cuenca",
    },
    rolPrincipal: "Operador de Soporte",
    sede: "Coordinación Zonal 6",
    aplicacionesUtilizadas: ["Gestión Docente"],
    totalAccesos: 19,
    ultimaActividad: "05/10/2026 18:30",
    ultimaActividadRelativa: "Ayer, 18:30",
    nivelActividad: "Baja",
    desglosePorApp: [
      { aplicacion: "Gestión Docente", accesos: 19, porcentaje: 100, color: "var(--chart-1)" },
    ],
    evolucionSemanal: [
      { fecha: "30/09", diaSemana: "Lun", accesos: 2 },
      { fecha: "01/10", diaSemana: "Mar", accesos: 3 },
      { fecha: "02/10", diaSemana: "Mié", accesos: 4 },
      { fecha: "03/10", diaSemana: "Jue", accesos: 5 },
      { fecha: "04/10", diaSemana: "Vie", accesos: 3 },
      { fecha: "05/10", diaSemana: "Sáb", accesos: 1 },
      { fecha: "06/10", diaSemana: "Dom", accesos: 1 },
    ],
  },
];
