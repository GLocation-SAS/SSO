"use client";

import * as React from "react";
import { KpiCard } from "@/components/ui/data-display";
import { GraduationCap, Users, Clock, AlertTriangle } from "lucide-react";
import { INICIO_KPIS_DATA } from "../data/inicio-data";

interface InicioKpisProps {
  onSelectKpi?: (kpiId: string) => void;
}

export function InicioKpis({ onSelectKpi }: InicioKpisProps) {
  return (
    <section aria-label="Indicadores principales del docente" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* 1. Cursos asignados */}
        <KpiCard
          label={INICIO_KPIS_DATA[0].label}
          value={INICIO_KPIS_DATA[0].value}
          color={INICIO_KPIS_DATA[0].color}
          comparison={INICIO_KPIS_DATA[0].comparison}
          description={INICIO_KPIS_DATA[0].description}
          icon={<GraduationCap className="size-5" />}
          className="cursor-pointer"
          onAction={() => onSelectKpi?.("cursos")}
        />

        {/* 2. Estudiantes */}
        <KpiCard
          label={INICIO_KPIS_DATA[1].label}
          value={INICIO_KPIS_DATA[1].value}
          color={INICIO_KPIS_DATA[1].color}
          comparison={INICIO_KPIS_DATA[1].comparison}
          description={INICIO_KPIS_DATA[1].description}
          icon={<Users className="size-5" />}
          className="cursor-pointer"
          onAction={() => onSelectKpi?.("estudiantes")}
        />

        {/* 3. Cursos por completar */}
        <KpiCard
          label={INICIO_KPIS_DATA[2].label}
          value={INICIO_KPIS_DATA[2].value}
          color={INICIO_KPIS_DATA[2].color}
          comparison={INICIO_KPIS_DATA[2].comparison}
          description={INICIO_KPIS_DATA[2].description}
          icon={<Clock className="size-5" />}
          className="cursor-pointer"
          onAction={() => onSelectKpi?.("por-completar")}
        />

        {/* 4. Rectificación pendiente */}
        <KpiCard
          label={INICIO_KPIS_DATA[3].label}
          value={INICIO_KPIS_DATA[3].value}
          color={INICIO_KPIS_DATA[3].color}
          comparison={INICIO_KPIS_DATA[3].comparison}
          description={INICIO_KPIS_DATA[3].description}
          icon={<AlertTriangle className="size-5 text-warning" />}
          className="cursor-pointer border-warning/30 hover:border-warning/60"
          onAction={() => onSelectKpi?.("rectificaciones")}
        />
      </div>
    </section>
  );
}
