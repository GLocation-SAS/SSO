"use client";

import React from "react";
import { Link } from "@/routing";
import {
  AppWindow,
  LogIn,
  Clock,
  FileText,
  TrendingUp,
  ArrowRight,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DashboardMetricSummary } from "../data/mi-dashboard-data";

interface KpiSummarySectionProps {
  metrics: DashboardMetricSummary;
  onOpenReports: () => void;
}

export function KpiSummarySection({
  metrics,
  onOpenReports,
}: KpiSummarySectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ── 1. Aplicaciones asignadas ── */}
      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-start justify-between">
          <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <AppWindow className="size-5" />
          </div>
          <Badge appearance="soft" tone="primary" className="text-[11px] font-semibold">
            Activas
          </Badge>
        </div>

        <div className="space-y-1 mt-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Aplicaciones asignadas
          </span>
          <div className="text-3xl font-heading font-bold text-foreground">
            {metrics.aplicacionesAsignadas.total}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {metrics.aplicacionesAsignadas.detalle}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-primary/15">
          <Link
            href="/mis-aplicaciones"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group"
          >
            <span>Ver mis aplicaciones</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ── 2. Accesos realizados ── */}
      <div className="p-5 rounded-2xl border border-border bg-card hover:border-border/80 transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-start justify-between">
          <div className="size-11 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center text-info">
            <LogIn className="size-5" />
          </div>
          <Badge appearance="soft" tone="success" className="text-[11px] font-semibold flex items-center gap-1">
            <TrendingUp className="size-3" />
            {metrics.accesos.cambio}
          </Badge>
        </div>

        <div className="space-y-1 mt-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Accesos realizados
          </span>
          <div className="text-3xl font-heading font-bold text-foreground">
            {metrics.accesos.total}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {metrics.accesos.detalle}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            Registro de logins federados SSO
          </span>
        </div>
      </div>

      {/* ── 3. Tiempo de uso activo ── */}
      <div className="p-5 rounded-2xl border border-border bg-card hover:border-border/80 transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-start justify-between">
          <div className="size-11 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
            <Clock className="size-5" />
          </div>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Badge appearance="outline" tone="neutral" className="text-[10px] gap-1">
                    <Info className="size-3" />
                    Uso activo
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {metrics.tiempoUsoActivo.notaMetrica}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-1 mt-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tiempo de uso activo
          </span>
          <div className="text-3xl font-heading font-bold text-foreground">
            {metrics.tiempoUsoActivo.totalHoras}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            Promedio: {metrics.tiempoUsoActivo.promedioDiario}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground/80 line-clamp-1" title={metrics.tiempoUsoActivo.notaMetrica}>
            Excluye tiempos de sesión inactiva
          </span>
        </div>
      </div>

      {/* ── 4. Reportes personales ── */}
      <div className="p-5 rounded-2xl border border-border bg-card hover:border-border/80 transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-start justify-between">
          <div className="size-11 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center text-secondary-600 dark:text-secondary-400">
            <FileText className="size-5" />
          </div>
          <Badge appearance="soft" tone="neutral" className="text-[11px] font-semibold">
            Exportables
          </Badge>
        </div>

        <div className="space-y-1 mt-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Reportes personales
          </span>
          <div className="text-3xl font-heading font-bold text-foreground">
            {metrics.reportesPersonales.totalDisponibles}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            Último: {metrics.reportesPersonales.ultimoGenerado}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onOpenReports}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group outline-none"
          >
            <span>Ver y descargar reportes</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
