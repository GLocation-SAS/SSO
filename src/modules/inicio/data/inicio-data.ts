export type CursoEstado = "Pendiente" | "En progreso" | "Completado";

export interface CursoDocente {
  id: string;
  asignatura: string;
  nivel: string;
  paralelo: string;
  estudiantes: number;
  progreso: number; // 0 a 100
  estado: CursoEstado;
  ultimaModificacion: string;
  aula: string;
  especialidad?: string;
  notasPendientes: number;
}

export interface AlertaItem {
  id: string;
  tipo: "cierre" | "incompleto" | "rectificacion" | "sistema";
  titulo: string;
  descripcion: string;
  fechaLimite?: string;
  urgencia: "alta" | "media" | "baja";
  accionLabel?: string;
  cursoId?: string;
  badge: string;
}

export interface ActividadItem {
  id: string;
  tipo: "calificacion" | "completado" | "rectificacion" | "carga_masiva";
  titulo: string;
  descripcion: string;
  curso: string;
  fecha: string;
  hora: string;
}

export interface EstudianteNota {
  id: string;
  numeroLista: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  aporte1: number;
  aporte2: number;
  examen: number;
  promedio: number;
  estado: "Aprobado" | "Supletorio" | "Remedial" | "Pendiente";
}

export interface RectificacionSolicitud {
  id: string;
  codigo: string;
  estudiante: string;
  cedula: string;
  curso: string;
  asignatura: string;
  quimestre: string;
  parcial: string;
  notaActual: number;
  notaPropuesta: number;
  motivo: string;
  fechaSolicitud: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
  solicitante: string;
}

export const DOCENTE_PROFILE = {
  nombre: "Juan Carlos Pérez Morales",
  titulo: "Lic. en Ciencias de la Educación",
  rol: "Docente",
  institucion: "Unidad Educativa Manuela Cañizares",
  codigoAmie: "17H00010",
  sede: "Quito Norte · Distrito 17D05",
  periodoActivo: "2025 - 2026",
  quimestreActivo: "Quimestre II · Régimen Sierra",
  fechaCierrePeriodo: "28 de Octubre, 2026",
  diasRestantes: 15,
};

export const INICIO_KPIS_DATA = [
  {
    id: "cursos",
    label: "Cursos asignados",
    value: 6,
    comparison: "Período activo 2025 - 2026",
    description: "Cursos del período académico",
    color: "primary" as const,
  },
  {
    id: "estudiantes",
    label: "Estudiantes",
    value: 184,
    comparison: "100% matriculados en sistema",
    description: "Total de estudiantes en los cursos asignados",
    color: "neutral" as const,
  },
  {
    id: "por-completar",
    label: "Cursos por completar",
    value: 2,
    comparison: "2 registros pendientes de 6",
    description: "Calificaciones pendientes de registrar",
    color: "warning" as const,
  },
  {
    id: "rectificaciones",
    label: "Rectificación pendiente",
    value: 1,
    comparison: "Requiere atención prioritaria",
    description: "Solicitud que requiere atención",
    color: "secondary-300" as const,
  },
];

export const CURSOS_DOCENTE_MOCK: CursoDocente[] = [
  {
    id: "mat-10a",
    asignatura: "Matemática",
    nivel: "10° EGB",
    paralelo: "A",
    estudiantes: 32,
    progreso: 100,
    estado: "Completado",
    ultimaModificacion: "Hoy a las 08:30 AM",
    aula: "Aula 204",
    especialidad: "Educación General Básica Superior",
    notasPendientes: 0,
  },
  {
    id: "len-10a",
    asignatura: "Lengua y Literatura",
    nivel: "10° EGB",
    paralelo: "A",
    estudiantes: 32,
    progreso: 100,
    estado: "Completado",
    ultimaModificacion: "Ayer a las 17:15 PM",
    aula: "Aula 204",
    especialidad: "Educación General Básica Superior",
    notasPendientes: 0,
  },
  {
    id: "mat-9b",
    asignatura: "Matemática",
    nivel: "9° EGB",
    paralelo: "B",
    estudiantes: 30,
    progreso: 100,
    estado: "Completado",
    ultimaModificacion: "11 de Octubre, 2026",
    aula: "Aula 108",
    especialidad: "Educación General Básica Superior",
    notasPendientes: 0,
  },
  {
    id: "fis-1a",
    asignatura: "Física",
    nivel: "1° BGU",
    paralelo: "A",
    estudiantes: 28,
    progreso: 100,
    estado: "Completado",
    ultimaModificacion: "09 de Octubre, 2026",
    aula: "Laboratorio de Ciencias 1",
    especialidad: "Bachillerato General Unificado",
    notasPendientes: 0,
  },
  {
    id: "mat-1c",
    asignatura: "Matemática",
    nivel: "1° BGU",
    paralelo: "C",
    estudiantes: 31,
    progreso: 65,
    estado: "En progreso",
    ultimaModificacion: "Hace 2 días",
    aula: "Aula 302",
    especialidad: "Bachillerato General Unificado",
    notasPendientes: 11,
  },
  {
    id: "fis-2b",
    asignatura: "Física",
    nivel: "2° BGU",
    paralelo: "B",
    estudiantes: 31,
    progreso: 20,
    estado: "Pendiente",
    ultimaModificacion: "05 de Octubre, 2026",
    aula: "Laboratorio de Ciencias 2",
    especialidad: "Bachillerato General Unificado",
    notasPendientes: 25,
  },
];

export const ALERTAS_DOCENTE_MOCK: AlertaItem[] = [
  {
    id: "alt-cierre",
    tipo: "cierre",
    titulo: "Cierre de período de calificaciones",
    descripcion: "Faltan 15 días para el cierre del Quimestre II en la plataforma oficial de MINEDUC.",
    fechaLimite: "28 Oct 2026 · 23:59",
    urgencia: "alta",
    badge: "Fecha límite",
    accionLabel: "Ver cronograma",
  },
  {
    id: "alt-fis2b",
    tipo: "incompleto",
    titulo: "Física 2° BGU 'B' pendiente",
    descripcion: "Se han registrado notas para solo 6 de 31 estudiantes (20% de avance).",
    fechaLimite: "Cierre en 15 días",
    urgencia: "alta",
    badge: "Incompleto",
    cursoId: "fis-2b",
    accionLabel: "Registrar notas",
  },
  {
    id: "alt-mat1c",
    tipo: "incompleto",
    titulo: "Matemática 1° BGU 'C' en progreso",
    descripcion: "Faltan las calificaciones del examen quimestral de 11 estudiantes.",
    fechaLimite: "Cierre en 15 días",
    urgencia: "media",
    badge: "En progreso",
    cursoId: "mat-1c",
    accionLabel: "Continuar registro",
  },
  {
    id: "alt-rect-1",
    tipo: "rectificacion",
    titulo: "1 Solicitud de rectificación pendiente",
    descripcion: "Estudiante Mateo Morales (10° EGB A) solicita revisión de nota en Quimestre I.",
    urgencia: "alta",
    badge: "Requiere atención",
    accionLabel: "Gestionar solicitud",
  },
  {
    id: "alt-excel",
    tipo: "sistema",
    titulo: "Carga masiva habilitada",
    descripcion: "Puedes subir plantillas Excel oficiales generadas por el sistema SIGE para ingreso rápido.",
    urgencia: "baja",
    badge: "Informativo",
    accionLabel: "Subir Excel",
  },
];

export const ACTIVIDAD_RECIENTE_MOCK: ActividadItem[] = [
  {
    id: "act-1",
    tipo: "calificacion",
    titulo: "Calificaciones de examen actualizadas",
    descripcion: "Se registraron notas finales del quimestre para 32 estudiantes.",
    curso: "Matemática · 10° EGB 'A'",
    fecha: "Hoy",
    hora: "08:30 AM",
  },
  {
    id: "act-2",
    tipo: "completado",
    titulo: "Curso completado al 100%",
    descripcion: "Acta de calificaciones consolidada y validada sin observaciones.",
    curso: "Lengua y Literatura · 10° EGB 'A'",
    fecha: "Ayer",
    hora: "17:15 PM",
  },
  {
    id: "act-3",
    tipo: "rectificacion",
    titulo: "Rectificación aprobada por Secretaría",
    descripcion: "Se regularizó la calificación quimestral de la estudiante Sofía Carrera.",
    curso: "Matemática · 9° EGB 'B'",
    fecha: "11 Oct 2026",
    hora: "11:20 AM",
  },
  {
    id: "act-4",
    tipo: "carga_masiva",
    titulo: "Carga masiva procesada con éxito",
    descripcion: "28 registros importados desde plantilla Excel sin inconsistencias.",
    curso: "Física · 1° BGU 'A'",
    fecha: "09 Oct 2026",
    hora: "14:05 PM",
  },
];

export const ESTUDIANTES_EJEMPLO_MOCK: EstudianteNota[] = [
  {
    id: "est-1",
    numeroLista: 1,
    nombres: "Mateo Alejandro",
    apellidos: "Morales Cando",
    cedula: "1724598120",
    aporte1: 8.5,
    aporte2: 9.0,
    examen: 8.75,
    promedio: 8.75,
    estado: "Aprobado",
  },
  {
    id: "est-2",
    numeroLista: 2,
    nombres: "Camila Valentina",
    apellidos: "Andrade Vaca",
    cedula: "1723489115",
    aporte1: 9.5,
    aporte2: 10.0,
    examen: 9.5,
    promedio: 9.67,
    estado: "Aprobado",
  },
  {
    id: "est-3",
    numeroLista: 3,
    nombres: "Kevin Daniel",
    apellidos: "Barahona Loor",
    cedula: "1725918234",
    aporte1: 7.0,
    aporte2: 6.5,
    examen: 7.25,
    promedio: 6.92,
    estado: "Supletorio",
  },
  {
    id: "est-4",
    numeroLista: 4,
    nombres: "Valeria Nicole",
    apellidos: "Castillo Jaramillo",
    cedula: "1726019482",
    aporte1: 9.0,
    aporte2: 8.5,
    examen: 9.0,
    promedio: 8.83,
    estado: "Aprobado",
  },
  {
    id: "est-5",
    numeroLista: 5,
    nombres: "Joaquín Sebastián",
    apellidos: "Espinoza Flores",
    cedula: "1724498177",
    aporte1: 8.0,
    aporte2: 8.0,
    examen: 8.0,
    promedio: 8.0,
    estado: "Aprobado",
  },
  {
    id: "est-6",
    numeroLista: 6,
    nombres: "Luciana Belén",
    apellidos: "Guamán Paredes",
    cedula: "1727782390",
    aporte1: 6.0,
    aporte2: 6.5,
    examen: 6.0,
    promedio: 6.17,
    estado: "Supletorio",
  },
];

export const RECTIFICACION_PENDIENTE_MOCK: RectificacionSolicitud = {
  id: "rect-001",
  codigo: "REC-2026-042",
  estudiante: "Mateo Alejandro Morales Cando",
  cedula: "1724598120",
  curso: "10° EGB 'A'",
  asignatura: "Matemática",
  quimestre: "Quimestre I",
  parcial: "Parcial 2",
  notaActual: 6.5,
  notaPropuesta: 8.5,
  motivo: "Error de digitación en la calificación de la prueba sumativa del segundo parcial; adjunta prueba física calificada con 8.50/10.",
  fechaSolicitud: "12 de Octubre, 2026 · 10:15 AM",
  estado: "Pendiente",
  solicitante: "Docente / Secretaría Académica",
};
