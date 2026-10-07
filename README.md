# MINEDEC SSO - Sistema Centralizado de Identidad y Accesos

Plataforma unificada de autenticación (SSO) y gestión de identidad para el Ministerio de Educación (MINEDEC). Construida con [Next.js](https://nextjs.org), esta aplicación centraliza el acceso a múltiples sistemas institucionales (GEOportal, SIGE, Gestión Docente, Talento Humano, entre otros) y proporciona herramientas avanzadas de administración, seguridad y auditoría.

## Características Principales

- **Gestión de Usuarios y Roles**: Administración centralizada de cuentas de usuario, asignación de perfiles, control de estados y configuración de autenticación de doble factor (MFA).
- **Gestión de Aplicaciones**: Registro, configuración y monitoreo en tiempo real de los sistemas integrados al SSO institucional. Dashboard analítico de uso.
- **Auditoría y Trazabilidad**: 
  - **Logs de gestión**: Historial detallado de cambios administrativos (creación, edición de usuarios, cambios de roles).
  - **Ingresos a aplicaciones**: Monitoreo de inicios de sesión exitosos, fallidos y bloqueados.
  - **Actividad de usuarios**: Análisis dinámico de interacciones, recurrencia y patrones de uso individuales y globales.
- **UI Kit y Design System**: Librería robusta de componentes reutilizables, visualización de mapas geoespaciales, tablas de datos avanzadas, y un sistema de diseño responsivo basado en tokens semánticos (Tailwind CSS v4).

## Stack Tecnológico

- **Framework**: Next.js 16+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4+
- **Componentes UI**: Radix UI, Framer Motion (Animaciones), Lucide Icons
- **Formularios y Validación**: React Hook Form + Zod
- **Infraestructura**: Despliegue en GCP (App Engine) con integración continua vía Cloud Build

## Inicio Rápido

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Estructura del Proyecto

```
├── src/
│   ├── app/              # Enrutador principal (App Router), páginas y layouts
│   ├── components/       # Componentes base, UI Kit (Design System), Layouts
│   ├── lib/              # Utilidades globales y configuración
│   └── modules/          # Funcionalidad agrupada por dominio de negocio:
│       ├── aplicaciones/ # Módulo de Gestión de Aplicaciones
│       ├── auditoria/    # Vistas de trazabilidad y logs
│       ├── auth/         # Flujos de autenticación y doble factor
│       ├── gestion-usuarios/
│       └── uikit/        # Módulo de showcase de los componentes visuales
├── public/               # Archivos estáticos e imágenes (escudos, logos)
├── app.yaml              # Configuración de App Engine
└── next.config.ts        # Configuración principal de Next.js
```

## Estrategia de Despliegue CI/CD

El despliegue se realiza automáticamente mediante **Cloud Build** hacia **App Engine** al hacer push a la rama correspondiente.

| Rama   | Entorno     | Proyecto GCP               | Pipeline                 |
|--------|-------------|----------------------------|--------------------------|
| `dev`  | Desarrollo  | `minedec-sso-dev`          | `cloudbuild-dev.yaml`  |
| `qa`   | QA          | `minedec-sso-qa`           | `cloudbuild-qa.yaml`   |
| `main` | Producción  | `minedec-sso-prod`         | `cloudbuild-prod.yaml` |

## Scripts Disponibles

| Comando         | Descripción                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Levantar servidor de desarrollo      |
| `npm run build` | Compilar la versión de producción    |
| `npm run start` | Iniciar servidor compilado           |
| `npm run lint`  | Ejecutar verificación de código      |
