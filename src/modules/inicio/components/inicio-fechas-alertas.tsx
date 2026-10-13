"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALERTAS_DOCENTE_MOCK, AlertaItem, DOCENTE_PROFILE } from "../data/inicio-data";

interface InicioFechasAlertasProps {
  onAlertaClick?: (alerta: AlertaItem) => void;
  onGestionarRectificacion?: () => void;
}

export function InicioFechasAlertas({
  onAlertaClick,
  onGestionarRectificacion,
}: InicioFechasAlertasProps) {
  return (
    <section aria-label="Fechas importantes y alertas" className="flex flex-col gap-3.5 w-full">
      {/* Header del Panel */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <AlertTriangle className="size-4" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-heading font-bold text-foreground">
              Fechas importantes y alertas
            </h2>
            <p className="text-xs text-muted-foreground">
              Prioridades académicas que requieren tu atención
            </p>
          </div>
        </div>
      </div>

      {/* 1. Tarjeta Destacada de Cierre de Período (Prioridad Alta) */}
      <div className="rounded-xl border border-warning/40 bg-warning-50/40 dark:bg-warning-900/10 p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-full bg-warning/15 text-warning flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="size-4.5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground">
                Cierre de calificaciones: {DOCENTE_PROFILE.fechaCierrePeriodo}
              </span>
              <Badge tone="warning" appearance="solid" size="sm" className="font-bold">
                Restan {DOCENTE_PROFILE.diasRestantes} días
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Período activo: <strong className="text-foreground">{DOCENTE_PROFILE.quimestreActivo}</strong>.
              Después de esta fecha, el sistema bloqueará la edición de notas sin autorización distrital.
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="warning"
          rightIcon={<ChevronRight className="size-3.5" />}
          onClick={() => onAlertaClick?.(ALERTAS_DOCENTE_MOCK[0])}
          className="self-start sm:self-auto shrink-0"
        >
          Ver cronograma
        </Button>
      </div>

      {/* 2. Lista de Alertas Priorizadas */}
      <div className="flex flex-col gap-2.5">
        {ALERTAS_DOCENTE_MOCK.slice(1).map((alerta) => {
          const isAlta = alerta.urgencia === "alta";
          const isRectificacion = alerta.tipo === "rectificacion";

          return (
            <div
              key={alerta.id}
              className={cn(
                "rounded-xl border p-3.5 transition-all duration-200 flex items-start justify-between gap-3 bg-surface",
                isAlta
                  ? "border-warning/30 hover:border-warning/60 hover:shadow-2xs"
                  : "border-border/70 hover:border-border hover:shadow-2xs"
              )}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    isRectificacion
                      ? "bg-secondary/15 text-secondary-600 dark:text-secondary-300"
                      : isAlta
                      ? "bg-warning/10 text-warning"
                      : "bg-info/10 text-info"
                  )}
                >
                  {isRectificacion ? (
                    <ShieldAlert className="size-4" />
                  ) : isAlta ? (
                    <Clock className="size-4" />
                  ) : (
                    <Info className="size-4" />
                  )}
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs md:text-sm font-semibold text-foreground truncate">
                      {alerta.titulo}
                    </h3>
                    <Badge
                      tone={
                        isRectificacion
                          ? "secondary"
                          : isAlta
                          ? "warning"
                          : "info"
                      }
                      appearance="soft"
                      size="sm"
                      className="text-[9px]"
                    >
                      {alerta.badge}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {alerta.descripcion}
                  </p>
                </div>
              </div>

              {alerta.accionLabel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  rightIcon={<ChevronRight className="size-3.5" />}
                  onClick={() => {
                    if (isRectificacion) {
                      onGestionarRectificacion?.();
                    } else {
                      onAlertaClick?.(alerta);
                    }
                  }}
                  className="shrink-0 text-primary self-center sm:self-auto"
                >
                  {alerta.accionLabel}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
