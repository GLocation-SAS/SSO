export type PeriodoFiltro = "7" | "30" | "90";

export interface DashboardMetricSummary {
  aplicacionesAsignadas: {
    total: number;
    sedesCount: number;
    detalle: string;
  };
  accesos: {
    total: number;
    cambio: string;
    tendencia: "up" | "neutral";
    detalle: string;
  };
  tiempoUsoActivo: {
    totalHoras: string;
    promedioDiario: string;
    detalle: string;
    notaMetrica: string;
  };
  reportesPersonales: {
    totalDisponibles: number;
    ultimoGenerado: string;
    detalle: string;
  };
}

export interface AccesoPorFechaItem {
  fecha: string;
  etiqueta: string;
  accesos: number;
  appsPrincipales: string;
}

export interface TiempoPorAplicacionItem {
  id: string;
  nombre: string;
  horas: string;
  minutos: number;
  porcentaje: number;
  color: string;
  codigo: string;
}

export interface ActividadPersonalItem {
  id: string;
  fechaHora: string;
  fechaIso: string;
  aplicacion: string;
  sede: string;
  rol: string;
  accion: string;
  dispositivo: string;
  ip: string;
  estado: "Exitoso" | "Advertencia";
}

export interface ReportePersonalDescarga {
  id: string;
  titulo: string;
  descripcion: string;
  formato: "CSV" | "JSON" | "PDF";
  tamanio: string;
  fechaGeneracion: string;
}

export const MI_DASHBOARD_METRICS: Record<PeriodoFiltro, DashboardMetricSummary> = {
  "7": {
    aplicacionesAsignadas: {
      total: 4,
      sedesCount: 2,
      detalle: "En Coordinación Zonal 9 y Planta Central",
    },
    accesos: {
      total: 18,
      cambio: "+12.5%",
      tendencia: "up",
      detalle: "Frente a los 7 días anteriores",
    },
    tiempoUsoActivo: {
      totalHoras: "11h 40m",
      promedioDiario: "1h 40m / día",
      detalle: "Interacción activa registrada",
      notaMetrica: "Calculado a partir de acciones activas (no sesión inactiva)",
    },
    reportesPersonales: {
      totalDisponibles: 6,
      ultimoGenerado: "Hoy, 08:30 AM",
      detalle: "Historial de ingresos y actividad personal",
    },
  },
  "30": {
    aplicacionesAsignadas: {
      total: 4,
      sedesCount: 2,
      detalle: "En Coordinación Zonal 9 y Planta Central",
    },
    accesos: {
      total: 54,
      cambio: "+8.2%",
      tendencia: "up",
      detalle: "Frente al mes anterior",
    },
    tiempoUsoActivo: {
      totalHoras: "42h 15m",
      promedioDiario: "1h 25m / día",
      detalle: "Interacción activa registrada",
      notaMetrica: "Calculado a partir de acciones activas (no sesión inactiva)",
    },
    reportesPersonales: {
      totalDisponibles: 6,
      ultimoGenerado: "10/10/2026",
      detalle: "Historial de ingresos y actividad personal",
    },
  },
  "90": {
    aplicacionesAsignadas: {
      total: 4,
      sedesCount: 2,
      detalle: "En Coordinación Zonal 9 y Planta Central",
    },
    accesos: {
      total: 142,
      cambio: "+15.0%",
      tendencia: "up",
      detalle: "Frente al trimestre anterior",
    },
    tiempoUsoActivo: {
      totalHoras: "128h 30m",
      promedioDiario: "1h 28m / día",
      detalle: "Interacción activa registrada",
      notaMetrica: "Calculado a partir de acciones activas (no sesión inactiva)",
    },
    reportesPersonales: {
      totalDisponibles: 6,
      ultimoGenerado: "01/10/2026",
      detalle: "Historial de ingresos y actividad personal",
    },
  },
};

export const ACCESOS_POR_FECHA: Record<PeriodoFiltro, AccesoPorFechaItem[]> = {
  "7": [
    { fecha: "07/10", etiqueta: "Lun 07", accesos: 2, appsPrincipales: "Gestión Docente" },
    { fecha: "08/10", etiqueta: "Mar 08", accesos: 3, appsPrincipales: "Gestión Docente, SIGE" },
    { fecha: "09/10", etiqueta: "Mié 09", accesos: 4, appsPrincipales: "SIGE, Talento Humano" },
    { fecha: "10/10", etiqueta: "Jue 10", accesos: 2, appsPrincipales: "Talento Humano" },
    { fecha: "11/10", etiqueta: "Vie 11", accesos: 3, appsPrincipales: "Gestión Docente, SIGE" },
    { fecha: "12/10", etiqueta: "Sáb 12", accesos: 1, appsPrincipales: "Mesa de Ayuda" },
    { fecha: "13/10", etiqueta: "Dom 13", accesos: 3, appsPrincipales: "Gestión Docente, SSO" },
  ],
  "30": [
    { fecha: "Sem 1", etiqueta: "15-21 Sep", accesos: 12, appsPrincipales: "Gestión Docente, SIGE" },
    { fecha: "Sem 2", etiqueta: "22-28 Sep", accesos: 15, appsPrincipales: "Gestión Docente, TH" },
    { fecha: "Sem 3", etiqueta: "29 Sep-05 Oct", accesos: 11, appsPrincipales: "SIGE, Mesa Ayuda" },
    { fecha: "Sem 4", etiqueta: "06-13 Oct", accesos: 16, appsPrincipales: "Gestión Docente, SIGE" },
  ],
  "90": [
    { fecha: "Mes 1", etiqueta: "Agosto", accesos: 44, appsPrincipales: "Gestión Docente, SIGE" },
    { fecha: "Mes 2", etiqueta: "Septiembre", accesos: 52, appsPrincipales: "Gestión Docente, TH, SIGE" },
    { fecha: "Mes 3", etiqueta: "Octubre", accesos: 46, appsPrincipales: "Gestión Docente, Mesa Ayuda" },
  ],
};

export const TIEMPO_POR_APLICACION: Record<PeriodoFiltro, TiempoPorAplicacionItem[]> = {
  "7": [
    { id: "gd", nombre: "Gestión Docente", codigo: "SGD", horas: "5h 15m", minutos: 315, porcentaje: 45, color: "#1b3a6b", },
    { id: "sige", nombre: "SIGE - Sistema Escolar", codigo: "SIGE", horas: "3h 30m", minutos: 210, porcentaje: 30, color: "#0090e7", },
    { id: "th", nombre: "Talento Humano", codigo: "TH", horas: "1h 45m", minutos: 105, porcentaje: 15, color: "#00d25b", },
    { id: "ma", nombre: "Mesa de Ayuda SSO", codigo: "SSO-MA", horas: "1h 10m", minutos: 70, porcentaje: 10, color: "#a855f7", },
  ],
  "30": [
    { id: "gd", nombre: "Gestión Docente", codigo: "SGD", horas: "19h 00m", minutos: 1140, porcentaje: 45, color: "#1b3a6b", },
    { id: "sige", nombre: "SIGE - Sistema Escolar", codigo: "SIGE", horas: "12h 40m", minutos: 760, porcentaje: 30, color: "#0090e7", },
    { id: "th", nombre: "Talento Humano", codigo: "TH", horas: "6h 20m", minutos: 380, porcentaje: 15, color: "#00d25b", },
    { id: "ma", nombre: "Mesa de Ayuda SSO", codigo: "SSO-MA", horas: "4h 15m", minutos: 255, porcentaje: 10, color: "#a855f7", },
  ],
  "90": [
    { id: "gd", nombre: "Gestión Docente", codigo: "SGD", horas: "57h 50m", minutos: 3470, porcentaje: 45, color: "#1b3a6b", },
    { id: "sige", nombre: "SIGE - Sistema Escolar", codigo: "SIGE", horas: "38h 30m", minutos: 2310, porcentaje: 30, color: "#0090e7", },
    { id: "th", nombre: "Talento Humano", codigo: "TH", horas: "19h 15m", minutos: 1155, porcentaje: 15, color: "#00d25b", },
    { id: "ma", nombre: "Mesa de Ayuda SSO", codigo: "SSO-MA", horas: "12h 55m", minutos: 775, porcentaje: 10, color: "#a855f7", },
  ],
};

export const ACTIVIDAD_RECIENTE_USUARIO: ActividadPersonalItem[] = [
  {
    id: "act-01",
    fechaHora: "13/10/2026, 08:15 AM",
    fechaIso: "2026-10-13T08:15:00",
    aplicacion: "Gestión Docente",
    sede: "Coordinación Zonal 9",
    rol: "Docente / Evaluador",
    accion: "Ingreso SSO a plataforma",
    dispositivo: "Chrome 128 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
  {
    id: "act-02",
    fechaHora: "13/10/2026, 08:22 AM",
    fechaIso: "2026-10-13T08:22:00",
    aplicacion: "Gestión Docente",
    sede: "Coordinación Zonal 9",
    rol: "Docente / Evaluador",
    accion: "Consulta de expediente docente #2026-084",
    dispositivo: "Chrome 128 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
  {
    id: "act-03",
    fechaHora: "12/10/2026, 16:42 PM",
    fechaIso: "2026-10-12T16:42:00",
    aplicacion: "SIGE - Sistema Escolar",
    sede: "Coordinación Zonal 9",
    rol: "Operador de Registro",
    accion: "Ingreso SSO a plataforma",
    dispositivo: "Chrome 128 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
  {
    id: "act-04",
    fechaHora: "11/10/2026, 14:10 PM",
    fechaIso: "2026-10-11T14:10:00",
    aplicacion: "Talento Humano",
    sede: "Planta Central",
    rol: "Funcionario Administrativo",
    accion: "Descarga de comprobante de pago Septiembre 2026",
    dispositivo: "Firefox 130 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
  {
    id: "act-05",
    fechaHora: "10/10/2026, 11:20 AM",
    fechaIso: "2026-10-10T11:20:00",
    aplicacion: "Talento Humano",
    sede: "Planta Central",
    rol: "Funcionario Administrativo",
    accion: "Ingreso SSO a plataforma",
    dispositivo: "Chrome 128 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
  {
    id: "act-06",
    fechaHora: "09/10/2026, 15:35 PM",
    fechaIso: "2026-10-09T15:35:00",
    aplicacion: "SIGE - Sistema Escolar",
    sede: "Coordinación Zonal 9",
    rol: "Operador de Registro",
    accion: "Verificación de registro de matrícula #17D01-992",
    dispositivo: "Chrome 128 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
  {
    id: "act-07",
    fechaHora: "08/10/2026, 09:12 AM",
    fechaIso: "2026-10-08T09:12:00",
    aplicacion: "Gestión Docente",
    sede: "Coordinación Zonal 9",
    rol: "Docente / Evaluador",
    accion: "Cierre de sesión seguro",
    dispositivo: "Chrome 128 / Windows 11",
    ip: "186.101.42.15",
    estado: "Exitoso",
  },
];

export const REPORTES_PERSONALES_DISPONIBLES: ReportePersonalDescarga[] = [
  {
    id: "rep-01",
    titulo: "Historial de Accesos SSO",
    descripcion: "Detalle completo de inicios de sesión y autenticación federada en sistemas MINEDUC.",
    formato: "CSV",
    tamanio: "18 KB",
    fechaGeneracion: "13/10/2026",
  },
  {
    id: "rep-02",
    titulo: "Resumen de Tiempo de Actividad",
    descripcion: "Métricas de uso activo efectivo por aplicación institucional y sede.",
    formato: "JSON",
    tamanio: "12 KB",
    fechaGeneracion: "13/10/2026",
  },
  {
    id: "rep-03",
    titulo: "Certificado de Permisos y Roles Asignados",
    descripcion: "Documento oficial con las sedes, roles y recursos vigentes del usuario.",
    formato: "PDF",
    tamanio: "142 KB",
    fechaGeneracion: "10/10/2026",
  },
];
