"use client";

import * as React from "react";
import { InicioWelcomeCard } from "../components/inicio-welcome-card";
import { InicioKpis } from "../components/inicio-kpis";
import { InicioCursosList, FiltroCursoEstado } from "../components/inicio-cursos-list";
import { InicioFechasAlertas } from "../components/inicio-fechas-alertas";
import { InicioActividadReciente } from "../components/inicio-actividad-reciente";
import { InicioAccionesRapidas } from "../components/inicio-acciones-rapidas";
import {
  CalificacionesModal,
  TodosCursosModal,
  CargaMasivaModal,
  RectificacionModal,
  CronogramaModal,
} from "../components/inicio-modals";
import {
  CURSOS_DOCENTE_MOCK,
  CursoDocente,
} from "../data/inicio-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InicioView() {
  // Estado de cursos local para permitir actualizaciones reactivas (ej: tras guardar notas)
  const [cursos, setCursos] = React.useState<CursoDocente[]>(CURSOS_DOCENTE_MOCK);
  const [filtroEstado, setFiltroEstado] = React.useState<FiltroCursoEstado>("Todos");

  // Estados de control de Modals
  const [selectedCurso, setSelectedCurso] = React.useState<CursoDocente | null>(null);
  const [calificacionesModalOpen, setCalificacionesModalOpen] = React.useState(false);
  const [todosCursosModalOpen, setTodosCursosModalOpen] = React.useState(false);
  const [cargaMasivaModalOpen, setCargaMasivaModalOpen] = React.useState(false);
  const [rectificacionModalOpen, setRectificacionModalOpen] = React.useState(false);
  const [cronogramaModalOpen, setCronogramaModalOpen] = React.useState(false);

  // Estados de carga y simulación de error
  const [isLoading, setIsLoading] = React.useState(false);
  const [simulatedError, setSimulatedError] = React.useState(false);

  // Abrir modal de notas para un curso
  const handleOpenCurso = (curso: CursoDocente) => {
    setSelectedCurso(curso);
    setCalificacionesModalOpen(true);
  };

  // CTA principal de bienvenida: continuar registrando notas del curso prioritario
  const handleContinuarRegistrando = () => {
    // Buscar el primer curso incompleto
    const cursoPendiente =
      cursos.find((c) => c.estado === "Pendiente") ||
      cursos.find((c) => c.estado === "En progreso") ||
      cursos[0];

    if (cursoPendiente) {
      handleOpenCurso(cursoPendiente);
    }
  };

  // Click en KPIs para filtrar o interactuar rápidamente
  const handleSelectKpi = (kpiId: string) => {
    switch (kpiId) {
      case "cursos":
        setFiltroEstado("Todos");
        break;
      case "por-completar":
        setFiltroEstado("Por completar");
        break;
      case "rectificaciones":
        setRectificacionModalOpen(true);
        break;
      case "estudiantes":
        setTodosCursosModalOpen(true);
        break;
    }
  };

  // Simular recarga de datos
  const handleRefresh = () => {
    setIsLoading(true);
    setSimulatedError(false);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Datos sincronizados", {
        description: "Se actualizaron las nóminas y estados de calificaciones de tus cursos.",
      });
    }, 600);
  };

  // Actualizar progreso de curso tras guardar
  const handleCursoSaved = (cursoId: string) => {
    setCursos((prev) =>
      prev.map((c) => {
        if (c.id !== cursoId) return c;
        return {
          ...c,
          progreso: 100,
          estado: "Completado",
          notasPendientes: 0,
          ultimaModificacion: "Hace un momento",
        };
      })
    );
  };

  if (simulatedError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4 bg-surface border border-border rounded-xl">
        <div className="size-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
          <AlertCircle className="size-7" />
        </div>
        <div className="max-w-md space-y-1">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Error al sincronizar cursos
          </h2>
          <p className="text-xs text-muted-foreground">
            No se pudo cargar la información de asignaturas asignadas desde el servicio central de SIGE.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          leftIcon={<RefreshCw className="size-3.5" />}
          onClick={handleRefresh}
        >
          Reintentar conexión
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full pb-6">
      {/* 0. Card destacada de bienvenida */}
      <InicioWelcomeCard onContinuarRegistrando={handleContinuarRegistrando} />

      {/* Contenedor principal con estilo institucional unificado a /dashboard */}
      <div className="bg-surface border border-border shadow-xs rounded-xl p-4 md:p-6 flex flex-col gap-6 w-full">
        {/* Encabezado contextual */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-primary-300">
                Panel de Calificaciones
              </h1>
              <Badge tone="primary" appearance="soft" size="sm" className="hidden sm:inline-flex">
                Régimen Sierra
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Supervisión de cursos asignados, avance de notas y registro académico docente.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={handleRefresh}
              leftIcon={<RefreshCw className={cn("size-3.5", isLoading && "animate-spin text-primary")} />}
              title="Sincronizar información"
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </div>

        {/* 1. Indicadores Principales (4 tarjetas KPI) */}
        <InicioKpis onSelectKpi={handleSelectKpi} />

        {/* 2. Distribución en Grid Desktop (Dos columnas balanceadas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* Columna Izquierda: Mis Cursos + Acciones Rápidas (7 columnas) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 w-full">
            {/* Sección de Cursos */}
            <InicioCursosList
              cursos={cursos}
              onOpenCurso={handleOpenCurso}
              onVerTodos={() => setTodosCursosModalOpen(true)}
              filtroEstadoInicial={filtroEstado}
            />

            {/* Acciones Rápidas */}
            <InicioAccionesRapidas
              onRegistrarCalificaciones={handleContinuarRegistrando}
              onConsultarCursos={() => setTodosCursosModalOpen(true)}
              onCargaMasiva={() => setCargaMasivaModalOpen(true)}
              onGestionarRectificaciones={() => setRectificacionModalOpen(true)}
            />
          </div>

          {/* Columna Derecha: Fechas importantes / Alertas + Actividad reciente (5 columnas) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 w-full">
            {/* Fechas importantes y alertas */}
            <InicioFechasAlertas
              onAlertaClick={(alerta) => {
                if (alerta.cursoId) {
                  const target = cursos.find((c) => c.id === alerta.cursoId);
                  if (target) handleOpenCurso(target);
                } else if (alerta.tipo === "cierre") {
                  setCronogramaModalOpen(true);
                } else if (alerta.tipo === "sistema") {
                  setCargaMasivaModalOpen(true);
                } else {
                  toast.info(alerta.titulo, { description: alerta.descripcion });
                }
              }}
              onGestionarRectificacion={() => setRectificacionModalOpen(true)}
            />

            {/* Actividad Reciente */}
            <InicioActividadReciente
              onVerActividad={(act) => {
                toast.info(act.titulo, {
                  description: `${act.descripcion} (${act.curso})`,
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Modals Operativos (Sin navegación falsa o rutas rotas) */}
      <CalificacionesModal
        open={calificacionesModalOpen}
        onOpenChange={setCalificacionesModalOpen}
        curso={selectedCurso}
        onSave={handleCursoSaved}
      />

      <TodosCursosModal
        open={todosCursosModalOpen}
        onOpenChange={setTodosCursosModalOpen}
        cursos={cursos}
        onSelectCurso={handleOpenCurso}
      />

      <CargaMasivaModal
        open={cargaMasivaModalOpen}
        onOpenChange={setCargaMasivaModalOpen}
        cursos={cursos}
      />

      <RectificacionModal
        open={rectificacionModalOpen}
        onOpenChange={setRectificacionModalOpen}
      />

      <CronogramaModal
        open={cronogramaModalOpen}
        onOpenChange={setCronogramaModalOpen}
      />
    </div>
  );
}
