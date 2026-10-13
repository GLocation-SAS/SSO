"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { DataChip } from "@/components/ui/data-display";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CursoDocente, CursoEstado } from "../data/inicio-data";

export type FiltroCursoEstado = "Todos" | "Por completar" | CursoEstado;

interface InicioCursosListProps {
  cursos: CursoDocente[];
  onOpenCurso: (curso: CursoDocente) => void;
  onVerTodos: () => void;
  filtroEstadoInicial?: FiltroCursoEstado;
}

export function InicioCursosList({
  cursos,
  onOpenCurso,
  onVerTodos,
  filtroEstadoInicial = "Todos",
}: InicioCursosListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEstado, setSelectedEstado] = React.useState<FiltroCursoEstado>(filtroEstadoInicial);

  React.useEffect(() => {
    setSelectedEstado(filtroEstadoInicial);
  }, [filtroEstadoInicial]);

  // Filtrado reactivo
  const filteredCursos = React.useMemo(() => {
    return cursos.filter((c) => {
      const matchEstado =
        selectedEstado === "Todos"
          ? true
          : selectedEstado === "Por completar"
          ? c.estado !== "Completado"
          : c.estado === selectedEstado;
      const term = searchQuery.toLowerCase().trim();
      const matchSearch =
        term === "" ||
        c.asignatura.toLowerCase().includes(term) ||
        c.nivel.toLowerCase().includes(term) ||
        c.paralelo.toLowerCase().includes(term) ||
        `${c.nivel} ${c.paralelo}`.toLowerCase().includes(term);

      return matchEstado && matchSearch;
    });
  }, [cursos, selectedEstado, searchQuery]);

  const estadoCounts = React.useMemo(() => {
    return {
      Todos: cursos.length,
      "Por completar": cursos.filter((c) => c.estado !== "Completado").length,
      "En progreso": cursos.filter((c) => c.estado === "En progreso").length,
      Pendiente: cursos.filter((c) => c.estado === "Pendiente").length,
      Completado: cursos.filter((c) => c.estado === "Completado").length,
    };
  }, [cursos]);

  const getStatusBadge = (estado: CursoEstado) => {
    switch (estado) {
      case "Completado":
        return (
          <Badge tone="success" appearance="soft" size="sm" className="font-semibold">
            <CheckCircle2 className="size-3 mr-1" />
            Completado
          </Badge>
        );
      case "En progreso":
        return (
          <Badge tone="primary" appearance="soft" size="sm" className="font-semibold">
            <Clock className="size-3 mr-1" />
            En progreso
          </Badge>
        );
      case "Pendiente":
        return (
          <Badge tone="warning" appearance="soft" size="sm" className="font-semibold">
            <Clock className="size-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  const getProgressBarColor = (progreso: number, estado: CursoEstado) => {
    if (estado === "Completado" || progreso === 100) return "bg-success";
    if (progreso >= 50) return "bg-primary";
    return "bg-warning";
  };

  return (
    <section id="mis-cursos" className="flex flex-col gap-3.5 w-full">
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-bold text-foreground">
              Mis cursos asignados
            </h2>
            <p className="text-xs text-muted-foreground">
              Período académico activo · 6 cursos registrados
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          rightIcon={<ChevronRight className="size-3.5" />}
          onClick={onVerTodos}
          className="self-start sm:self-auto shrink-0"
        >
          Ver todos los cursos
        </Button>
      </div>

      {/* Controles de Búsqueda y Filtros de Estado */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Chips de filtro oficiales del UI Kit */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(["Todos", "Por completar", "En progreso", "Pendiente", "Completado"] as const).map((est) => {
            const count = estadoCounts[est];
            const isActive = selectedEstado === est;
            return (
              <DataChip
                key={est}
                label={`${est} (${count})`}
                selected={isActive}
                onClick={() => setSelectedEstado(est)}
                className="shrink-0 cursor-pointer text-xs"
              />
            );
          })}
        </div>

        {/* Componente Search del UI Kit */}
        <div className="w-full sm:w-72">
          <Search
            size="sm"
            placeholder="Buscar por asignatura o nivel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="w-full bg-surface"
          />
        </div>
      </div>

      {/* Lista / Grid de Cursos */}
      {filteredCursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCursos.map((curso) => {
            const isCompleted = curso.estado === "Completado";
            const isPendiente = curso.estado === "Pendiente";

            return (
              <div
                key={curso.id}
                className={cn(
                  "group relative rounded-xl border p-4 bg-surface transition-all duration-200 flex flex-col justify-between gap-3",
                  isPendiente
                    ? "border-warning/40 bg-warning-50/15 dark:bg-warning-900/10 hover:border-warning/60 hover:shadow-xs"
                    : isCompleted
                    ? "border-border/70 hover:border-border hover:shadow-xs"
                    : "border-primary/25 bg-primary/2 hover:border-primary/50 hover:shadow-sm"
                )}
              >
                {/* Cabecera del Curso */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-primary dark:text-primary-300 uppercase tracking-wide">
                      {curso.nivel} · Paralelo &ldquo;{curso.paralelo}&rdquo;
                    </span>
                    <h3 className="text-base font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {curso.asignatura}
                    </h3>
                  </div>
                  {getStatusBadge(curso.estado)}
                </div>

                {/* Metadata del Curso */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>
                      <strong className="text-foreground">{curso.estudiantes}</strong> estudiantes
                    </span>
                  </div>
                  <span className="text-border">•</span>
                  <div className="truncate">
                    <span>{curso.aula}</span>
                  </div>
                </div>

                {/* Barra de Progreso Visual */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Progreso de calificaciones
                    </span>
                    <span className="text-xs font-bold text-foreground tabular-nums">
                      {curso.progreso}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        getProgressBarColor(curso.progreso, curso.estado)
                      )}
                      style={{ width: `${curso.progreso}%` }}
                    />
                  </div>
                </div>

                {/* Footer de la tarjeta con Button del UI Kit */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[11px] text-muted-foreground truncate">
                    {curso.notasPendientes > 0
                      ? `${curso.notasPendientes} notas pendientes`
                      : "Todas registradas"}
                  </span>

                  <Button
                    type="button"
                    variant={
                      isCompleted
                        ? "secondary"
                        : isPendiente
                        ? "warning"
                        : "primary"
                    }
                    size="sm"
                    leftIcon={isCompleted ? <Eye className="size-3.5" /> : undefined}
                    rightIcon={!isCompleted ? <ArrowRight className="size-3.5" /> : undefined}
                    onClick={() => onOpenCurso(curso)}
                    className="shrink-0"
                  >
                    {isCompleted
                      ? "Ver calificaciones"
                      : isPendiente
                      ? "Calificar pendiente"
                      : "Continuar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-3 bg-surface/50">
          <div className="size-11 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
            <Users className="size-5" />
          </div>
          <div className="max-w-xs space-y-1">
            <p className="text-sm font-semibold text-foreground">
              No se encontraron cursos
            </p>
            <p className="text-xs text-muted-foreground">
              No hay cursos asignados que coincidan con los criterios de búsqueda o filtro aplicados.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="size-3.5" />}
            onClick={() => {
              setSearchQuery("");
              setSelectedEstado("Todos");
            }}
            className="mt-1"
          >
            Restablecer filtros
          </Button>
        </div>
      )}
    </section>
  );
}
