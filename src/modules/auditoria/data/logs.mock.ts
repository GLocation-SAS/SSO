export type TipoAccionLog =
  | "Creación"
  | "Modificación"
  | "Eliminación"
  | "Asignación de rol"
  | "Revocación de rol"
  | "Cambio de estado"
  | "Reinicio de contraseña"
  | "Asignación de recurso";

export type TipoElementoLog =
  | "Usuario"
  | "Aplicación"
  | "Rol"
  | "Recurso"
  | "Permiso";

export type EstadoLog = "Exitoso" | "Requiere revisión" | "Fallido";

export interface LogCambioDetalle {
  campo: string;
  etiqueta: string;
  valorAnterior: string;
  valorNuevo: string;
}

export interface LogGestionItem {
  id: string;
  codigoEvento: string;
  fecha: string;
  fechaRelativa: string;
  fechaISO: string;
  responsable: {
    id: string;
    nombre: string;
    email: string;
    cargo: string;
    sede: string;
    ip: string;
  };
  accion: TipoAccionLog;
  tipoElemento: TipoElementoLog;
  elementoNombre: string;
  elementoIdentificador: string;
  aplicacion: string;
  detalleBreve: string;
  estado: EstadoLog;
  motivoEstado?: string;
  cambios: LogCambioDetalle[];
  observaciones?: string;
}

export const mockLogsGestion: LogGestionItem[] = [
  {
    id: "LOG-2026-001",
    codigoEvento: "EVT-89211",
    fecha: "06/10/2026 14:32:15",
    fechaRelativa: "Hoy, 14:32",
    fechaISO: "2026-10-06T14:32:15",
    responsable: {
      id: "usr-admin-01",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cargo: "Administrador General SSO",
      sede: "Planta Central",
      ip: "10.20.14.88",
    },
    accion: "Asignación de rol",
    tipoElemento: "Permiso",
    elementoNombre: "María Belén Solís",
    elementoIdentificador: "1718293849",
    aplicacion: "Gestión Docente",
    detalleBreve: "Asignado rol 'Docente Titular' en Sede Coordinación Zonal 9",
    estado: "Exitoso",
    cambios: [
      {
        campo: "rol",
        etiqueta: "Rol Asignado",
        valorAnterior: "Sin rol activo",
        valorNuevo: "Docente Titular",
      },
      {
        campo: "sede",
        etiqueta: "Sede de Aplicación",
        valorAnterior: "-",
        valorNuevo: "Coordinación Zonal 9",
      },
      {
        campo: "vigencia",
        etiqueta: "Periodo Lectivo",
        valorAnterior: "Inactivo",
        valorNuevo: "2026 - 2027",
      },
    ],
    observaciones: "Acreditación formal por memorando MINEDUC-CZ9-2026-0412.",
  },
  {
    id: "LOG-2026-002",
    codigoEvento: "EVT-89210",
    fecha: "06/10/2026 13:15:40",
    fechaRelativa: "Hoy, 13:15",
    fechaISO: "2026-10-06T13:15:40",
    responsable: {
      id: "usr-admin-02",
      nombre: "Estefanía Patricia Morales",
      email: "estefania.morales@educacion.gob.ec",
      cargo: "Especialista de Seguridad SSO",
      sede: "Planta Central",
      ip: "10.20.14.92",
    },
    accion: "Cambio de estado",
    tipoElemento: "Usuario",
    elementoNombre: "Jorge Luis Zambrano",
    elementoIdentificador: "0918237412",
    aplicacion: "SSO Conecta",
    detalleBreve: "Inactivación temporal de cuenta por reporte de traslado",
    estado: "Requiere revisión",
    motivoEstado: "Pendiente validación de acta de entrega-recepción con Talento Humano",
    cambios: [
      {
        campo: "estado",
        etiqueta: "Estado de Cuenta",
        valorAnterior: "Activo",
        valorNuevo: "Inactivo (Bloqueo preventivo)",
      },
      {
        campo: "sesionesActivas",
        etiqueta: "Sesiones Abiertas",
        valorAnterior: "2 activas",
        valorNuevo: "0 (Sesiones revocadas)",
      },
    ],
    observaciones: "Inactivación solicitada vía ticket GLPI #54219.",
  },
  {
    id: "LOG-2026-003",
    codigoEvento: "EVT-89209",
    fecha: "06/10/2026 11:45:02",
    fechaRelativa: "Hoy, 11:45",
    fechaISO: "2026-10-06T11:45:02",
    responsable: {
      id: "usr-admin-01",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cargo: "Administrador General SSO",
      sede: "Planta Central",
      ip: "10.20.14.88",
    },
    accion: "Modificación",
    tipoElemento: "Aplicación",
    elementoNombre: "Talento Humano",
    elementoIdentificador: "TH-002",
    aplicacion: "Talento Humano",
    detalleBreve: "Actualización de URL de callback de autenticación SAML/OIDC",
    estado: "Exitoso",
    cambios: [
      {
        campo: "urlAcceso",
        etiqueta: "URL de Retorno",
        valorAnterior: "https://rrhh.mineduc.gob.ec/auth/legacy",
        valorNuevo: "https://rrhh.mineduc.gob.ec/auth/sso/v2",
      },
      {
        campo: "timeoutSesion",
        etiqueta: "Tiempo de Expiración",
        valorAnterior: "120 minutos",
        valorNuevo: "60 minutos (Política de seguridad)",
      },
    ],
    observaciones: "Migración a protocolo OIDC estándar del Gobierno Central.",
  },
  {
    id: "LOG-2026-004",
    codigoEvento: "EVT-89208",
    fecha: "06/10/2026 09:30:18",
    fechaRelativa: "Hoy, 09:30",
    fechaISO: "2026-10-06T09:30:18",
    responsable: {
      id: "usr-admin-03",
      nombre: "Diana Marisol Vega",
      email: "diana.vega@educacion.gob.ec",
      cargo: "Administradora Zonal Guayaquil",
      sede: "Coordinación Zonal 8",
      ip: "10.80.3.15",
    },
    accion: "Creación",
    tipoElemento: "Usuario",
    elementoNombre: "Paola Andrea Paredes",
    elementoIdentificador: "0921884729",
    aplicacion: "SIGE",
    detalleBreve: "Alta de nuevo usuario administrativo de distrito",
    estado: "Exitoso",
    cambios: [
      {
        campo: "usuario",
        etiqueta: "Identificador",
        valorAnterior: "No registrado",
        valorNuevo: "paola.paredes@educacion.gob.ec",
      },
      {
        campo: "tipoDocumento",
        etiqueta: "Documento",
        valorAnterior: "-",
        valorNuevo: "Cédula: 0921884729",
      },
      {
        campo: "sede",
        etiqueta: "Sede Principal",
        valorAnterior: "-",
        valorNuevo: "Distrito 09D03",
      },
    ],
  },
  {
    id: "LOG-2026-005",
    codigoEvento: "EVT-89207",
    fecha: "05/10/2026 16:50:22",
    fechaRelativa: "Ayer, 16:50",
    fechaISO: "2026-10-05T16:50:22",
    responsable: {
      id: "usr-admin-02",
      nombre: "Estefanía Patricia Morales",
      email: "estefania.morales@educacion.gob.ec",
      cargo: "Especialista de Seguridad SSO",
      sede: "Planta Central",
      ip: "10.20.14.92",
    },
    accion: "Reinicio de contraseña",
    tipoElemento: "Usuario",
    elementoNombre: "Roberto Daniel Cárdenas",
    elementoIdentificador: "1709482710",
    aplicacion: "SSO Conecta",
    detalleBreve: "Envío de token temporal de restablecimiento por olvido de credenciales",
    estado: "Exitoso",
    cambios: [
      {
        campo: "claveTemporal",
        etiqueta: "Estado de Clave",
        valorAnterior: "Bloqueada por intentos",
        valorNuevo: "Requiere cambio en próximo inicio",
      },
    ],
    observaciones: "Validación de identidad realizada por llamada institucional.",
  },
  {
    id: "LOG-2026-006",
    codigoEvento: "EVT-89206",
    fecha: "05/10/2026 14:10:05",
    fechaRelativa: "Ayer, 14:10",
    fechaISO: "2026-10-05T14:10:05",
    responsable: {
      id: "usr-admin-01",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cargo: "Administrador General SSO",
      sede: "Planta Central",
      ip: "10.20.14.88",
    },
    accion: "Modificación",
    tipoElemento: "Rol",
    elementoNombre: "Rector de Unidad Educativa",
    elementoIdentificador: "ROL-RECT-01",
    aplicacion: "SIGE",
    detalleBreve: "Ampliación de permisos para emisión de actas de grado extraordinarias",
    estado: "Exitoso",
    cambios: [
      {
        campo: "permisos",
        etiqueta: "Módulo Actas",
        valorAnterior: "Solo lectura",
        valorNuevo: "Lectura, Aprobación y Firma",
      },
    ],
  },
  {
    id: "LOG-2026-007",
    codigoEvento: "EVT-89205",
    fecha: "05/10/2026 11:20:33",
    fechaRelativa: "Ayer, 11:20",
    fechaISO: "2026-10-05T11:20:33",
    responsable: {
      id: "usr-admin-04",
      nombre: "Luis Alberto Guanoluisa",
      email: "luis.guanoluisa@educacion.gob.ec",
      cargo: "Operador de Soporte Cuenca",
      sede: "Coordinación Zonal 6",
      ip: "10.60.2.44",
    },
    accion: "Asignación de recurso",
    tipoElemento: "Recurso",
    elementoNombre: "Módulo Auditoría Curricular",
    elementoIdentificador: "REC-CURR-09",
    aplicacion: "Gestión Docente",
    detalleBreve: "Intento de asignación de recurso sin visto bueno de Auditoría",
    estado: "Fallido",
    motivoEstado: "Rechazado automáticamente: la política de segregación de funciones prohíbe asociar auditoría a operadores zonales",
    cambios: [
      {
        campo: "recurso",
        etiqueta: "Acceso Solicitado",
        valorAnterior: "Denegado",
        valorNuevo: "Rechazado por regla SOD-04",
      },
    ],
    observaciones: "Alerta de cumplimiento notificada al Oficial de Seguridad de la Información.",
  },
  {
    id: "LOG-2026-008",
    codigoEvento: "EVT-89204",
    fecha: "04/10/2026 17:05:11",
    fechaRelativa: "04/10/2026",
    fechaISO: "2026-10-04T17:05:11",
    responsable: {
      id: "usr-admin-01",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cargo: "Administrador General SSO",
      sede: "Planta Central",
      ip: "10.20.14.88",
    },
    accion: "Revocación de rol",
    tipoElemento: "Permiso",
    elementoNombre: "Fernando Vinicio Castro",
    elementoIdentificador: "1103948271",
    aplicacion: "Talento Humano",
    detalleBreve: "Revocación de rol 'Analista de Nómina' por cambio de funciones",
    estado: "Exitoso",
    cambios: [
      {
        campo: "rol",
        etiqueta: "Rol Retirado",
        valorAnterior: "Analista de Nómina",
        valorNuevo: "Sin asignación",
      },
    ],
  },
  {
    id: "LOG-2026-009",
    codigoEvento: "EVT-89203",
    fecha: "04/10/2026 15:30:00",
    fechaRelativa: "04/10/2026",
    fechaISO: "2026-10-04T15:30:00",
    responsable: {
      id: "usr-admin-02",
      nombre: "Estefanía Patricia Morales",
      email: "estefania.morales@educacion.gob.ec",
      cargo: "Especialista de Seguridad SSO",
      sede: "Planta Central",
      ip: "10.20.14.92",
    },
    accion: "Eliminación",
    tipoElemento: "Recurso",
    elementoNombre: "Endpoint Deprecado v1-Calificaciones",
    elementoIdentificador: "REC-API-V1-CALIF",
    aplicacion: "SIGE",
    detalleBreve: "Desincorporación de recurso legado descontinuado",
    estado: "Exitoso",
    cambios: [
      {
        campo: "estadoRecurso",
        etiqueta: "Registro en Catálogo",
        valorAnterior: "Publicado (Deprecado)",
        valorNuevo: "Eliminado",
      },
    ],
  },
  {
    id: "LOG-2026-010",
    codigoEvento: "EVT-89202",
    fecha: "03/10/2026 10:14:50",
    fechaRelativa: "03/10/2026",
    fechaISO: "2026-10-03T10:14:50",
    responsable: {
      id: "usr-admin-01",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cargo: "Administrador General SSO",
      sede: "Planta Central",
      ip: "10.20.14.88",
    },
    accion: "Modificación",
    tipoElemento: "Usuario",
    elementoNombre: "Silvia Mariana Guamán",
    elementoIdentificador: "1714938201",
    aplicacion: "Gestión Docente",
    detalleBreve: "Actualización de correo institucional y teléfono de recuperación 2FA",
    estado: "Requiere revisión",
    motivoEstado: "El número telefónico ingresado coincide con un usuario previamente bloqueado",
    cambios: [
      {
        campo: "telefono2FA",
        etiqueta: "Número de Respaldo",
        valorAnterior: "+593 99 123 4567",
        valorNuevo: "+593 98 765 4321",
      },
    ],
  },
  {
    id: "LOG-2026-011",
    codigoEvento: "EVT-89201",
    fecha: "02/10/2026 16:40:19",
    fechaRelativa: "02/10/2026",
    fechaISO: "2026-10-02T16:40:19",
    responsable: {
      id: "usr-admin-03",
      nombre: "Diana Marisol Vega",
      email: "diana.vega@educacion.gob.ec",
      cargo: "Administradora Zonal Guayaquil",
      sede: "Coordinación Zonal 8",
      ip: "10.80.3.15",
    },
    accion: "Asignación de rol",
    tipoElemento: "Permiso",
    elementoNombre: "Gonzalo Javier Ortiz",
    elementoIdentificador: "0912445892",
    aplicacion: "Geoportal",
    detalleBreve: "Asignación de rol 'Visualizador de Infraestructura Zonal'",
    estado: "Exitoso",
    cambios: [
      {
        campo: "rol",
        etiqueta: "Rol Geográfico",
        valorAnterior: "Sin acceso",
        valorNuevo: "Visualizador Zonal",
      },
    ],
  },
  {
    id: "LOG-2026-012",
    codigoEvento: "EVT-89200",
    fecha: "01/10/2026 09:05:00",
    fechaRelativa: "01/10/2026",
    fechaISO: "2026-10-01T09:05:00",
    responsable: {
      id: "usr-admin-01",
      nombre: "Carlos Xavier Andrade",
      email: "carlos.andrade@educacion.gob.ec",
      cargo: "Administrador General SSO",
      sede: "Planta Central",
      ip: "10.20.14.88",
    },
    accion: "Creación",
    tipoElemento: "Rol",
    elementoNombre: "Auditor Pedagógico Nacional",
    elementoIdentificador: "ROL-AUD-PED",
    aplicacion: "Gestión Docente",
    detalleBreve: "Creación de nuevo perfil de auditoría para supervisión escolar 2026",
    estado: "Exitoso",
    cambios: [
      {
        campo: "rolNombre",
        etiqueta: "Nuevo Rol",
        valorAnterior: "-",
        valorNuevo: "Auditor Pedagógico Nacional",
      },
      {
        campo: "recursosPermitidos",
        etiqueta: "Permisos Base",
        valorAnterior: "-",
        valorNuevo: "Consulta integral de reportes docentes",
      },
    ],
  },
];
