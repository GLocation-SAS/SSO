"use client";

import * as React from "react";
import {
  FileEdit,
  GraduationCap,
  FileSpreadsheet,
  FileCheck,
  Zap,
} from "lucide-react";
import { InteractiveCard } from "@/components/ui/data-display";

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
    },
    {
      id: "consultar",
      titulo: "Consultar mis cursos",
      descripcion: "Lista consolidada, paralelos y nóminas de alumnos",
      icon: GraduationCap,
      onClick: onConsultarCursos,
      color: "neutral" as const,
    },
    {
      id: "carga",
      titulo: "Realizar carga masiva",
      descripcion: "Importación directa de plantillas oficiales Excel / CSV",
      icon: FileSpreadsheet,
      onClick: onCargaMasiva,
      color: "success" as const,
    },
    {
      id: "rectificaciones",
      titulo: "Gestionar rectificaciones",
      descripcion: "Revisión y aprobación de solicitudes de recalificación",
      icon: FileCheck,
      onClick: onGestionarRectificaciones,
      color: "warning" as const,
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

      {/* Grid de tarjetas interactivas del UI Kit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {acciones.map((acc) => {
          const Icon = acc.icon;

          return (
            <InteractiveCard
              key={acc.id}
              title={acc.titulo}
              description={acc.descripcion}
              icon={<Icon className="size-4.5" />}
              color={acc.color}
              onClick={acc.onClick}
              rightElement={
                acc.badge ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/25">
                    {acc.badge}
                  </span>
                ) : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}
