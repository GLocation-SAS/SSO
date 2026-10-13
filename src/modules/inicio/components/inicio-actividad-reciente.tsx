"use client";

import * as React from "react";
import {
  History,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIVIDAD_RECIENTE_MOCK, ActividadItem } from "../data/inicio-data";

interface InicioActividadRecienteProps {
  onVerActividad?: (item: ActividadItem) => void;
}

export function InicioActividadReciente({
  onVerActividad,
}: InicioActividadRecienteProps) {
  const getActividadIcon = (tipo: ActividadItem["tipo"]) => {
    switch (tipo) {
      case "calificacion":
        return <FileCheck2 className="size-4 text-primary" />;
      case "completado":
        return <CheckCircle2 className="size-4 text-success" />;
      case "rectificacion":
        return <ShieldCheck className="size-4 text-info" />;
      case "carga_masiva":
        return <FileSpreadsheet className="size-4 text-secondary-600 dark:text-secondary-300" />;
    }
  };

  const getActividadBg = (tipo: ActividadItem["tipo"]) => {
    switch (tipo) {
      case "calificacion":
        return "bg-primary/10 border-primary/20";
      case "completado":
        return "bg-success/10 border-success/20";
      case "rectificacion":
        return "bg-info/10 border-info/20";
      case "carga_masiva":
        return "bg-secondary/10 border-secondary/20";
    }
  };

  return (
    <section aria-label="Actividad reciente del docente" className="flex flex-col gap-3.5 w-full">
      {/* Header de la sección */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-info/10 text-info flex items-center justify-center shrink-0">
            <History className="size-4" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-bold text-foreground">
              Actividad reciente
            </h2>
            <p className="text-xs text-muted-foreground">
              Historial de movimientos y transacciones en tus cursos
            </p>
          </div>
        </div>
      </div>

      {/* Lista cronológica */}
      <div className="space-y-3">
        {ACTIVIDAD_RECIENTE_MOCK.map((actividad) => {
          return (
            <div
              key={actividad.id}
              onClick={() => onVerActividad?.(actividad)}
              className="group p-3.5 rounded-xl border border-border/70 bg-surface hover:border-border hover:shadow-2xs transition-all cursor-pointer flex items-start gap-3 relative"
            >
              {/* Icono con fondo según tipo */}
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border",
                  getActividadBg(actividad.tipo)
                )}
              >
                {getActividadIcon(actividad.tipo)}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {actividad.titulo}
                  </h3>
                  <span className="text-[11px] font-medium text-muted-foreground shrink-0 tabular-nums">
                    {actividad.fecha} · {actividad.hora}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {actividad.descripcion}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                  <span className="text-primary font-bold">•</span>
                  <span className="truncate">{actividad.curso}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
