"use client";

import * as React from "react";
import {
  FileEdit,
  GraduationCap,
  FileSpreadsheet,
  FileCheck,
  Zap,
  ChevronRight,
} from "lucide-react";
import { InteractiveCard } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InicioAccionesRapidasProps {
  onRegistrarCalificaciones: () => void;
  onConsultarCursos: () => void;
  onCargaMasiva: () => void;
  onGestionarRectificaciones: () => void;
}

export function InicioAccionesRapidas({
  onRegistrarCalificaciones,
  onConsultarCursos,
  onCargaMasiva,
  onGestionarRectificaciones,
}: InicioAccionesRapidasProps) {
  const acciones = [
    {
      id: "registrar",
      titulo: "Registrar calificaciones",
      descripcion: "Ingreso manual por estudiante y aporte quimestral",
      icon: FileEdit,
      onClick: onRegistrarCalificaciones,
      color: "primary" as const,
      iconContainer: "bg-primary/15 text-primary",
      activeBg: "bg-primary-100/90 dark:bg-muted/30",
    },
    {
      id: "consultar",
      titulo: "Consultar mis cursos",
      descripcion: "Lista consolidada, paralelos y nóminas de alumnos",
      icon: GraduationCap,
      onClick: onConsultarCursos,
      color: "neutral" as const,
      iconContainer: "bg-muted-foreground/25 dark:bg-muted-foreground/35 text-foreground dark:text-neutral-200",
      activeBg: "bg-muted/80 dark:bg-muted/60",
    },
    {
      id: "carga",
      titulo: "Realizar carga masiva",
      descripcion: "Importación directa de plantillas oficiales Excel / CSV",
      icon: FileSpreadsheet,
      onClick: onCargaMasiva,
      color: "success" as const,
      iconContainer: "bg-success/15 text-success-700 dark:text-success-300",
      activeBg: "bg-success-100/90 dark:bg-success-900/50",
    },
    {
      id: "rectificaciones",
      titulo: "Gestionar rectificaciones",
      descripcion: "Revisión y aprobación de solicitudes de recalificación",
      icon: FileCheck,
      onClick: onGestionarRectificaciones,
      color: "warning" as const,
      iconContainer: "bg-warning/15 text-warning-700 dark:text-warning-300",
      activeBg: "bg-warning-100/90 dark:bg-warning-900/50",
      badge: "1 pendiente",
    },
  ];

  return (
    <section aria-label="Acciones rápidas de gestión" className="flex flex-col gap-3.5 w-full">
      {/* Header de la sección */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Zap className="size-4" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-bold text-foreground">
              Acciones rápidas
            </h2>
            <p className="text-xs text-muted-foreground">
              Accesos directos a las operaciones académicas más frecuentes
            </p>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas interactivas como en /usuarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {acciones.map((acc) => {
          const Icon = acc.icon;

          return (
            <InteractiveCard
              key={acc.id}
              title={acc.titulo}
              description={acc.descripcion}
              color={acc.color}
              hideChevron
              borderless
              shadowless
              truncateTitle={false}
              iconContainerClassName={acc.iconContainer}
              activeInnerBgClassName={acc.activeBg}
              onClick={acc.onClick}
              icon={<Icon className="size-5" />}
              decorativeIcon={<Icon className="size-full" />}
              className={cn(
                "cursor-pointer select-none transition-all duration-200 border-none shadow-none hover:shadow-none hover:brightness-95 dark:hover:brightness-110",
                "bg-surface hover:bg-muted/40"
              )}
              rightElement={
                <div className="flex items-center gap-2 shrink-0 py-1">
                  {acc.badge && (
                    <Badge
                      tone={acc.color}
                      appearance="soft"
                      size="sm"
                      className="px-2 py-0.5 h-5 font-semibold"
                    >
                      {acc.badge}
                    </Badge>
                  )}
                  <ChevronRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground shrink-0" />
                </div>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
