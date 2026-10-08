"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { FolderTree, CheckCircle2, XCircle, AppWindow } from "lucide-react";

export type RecursoSummaryFilterType = "total" | "activos" | "inactivos" | "apps";

interface RecursosSummaryCardsProps {
  total: number;
  activos: number;
  inactivos: number;
  appsCount: number;
  activeFilter: RecursoSummaryFilterType | null;
  onSelectFilter: (filter: RecursoSummaryFilterType) => void;
}

export function RecursosSummaryCards({
  total,
  activos,
  inactivos,
  appsCount,
  activeFilter,
  onSelectFilter,
}: RecursosSummaryCardsProps) {
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    const perc = (value / total) * 100;
    return Number.isInteger(perc) ? perc : Number(perc.toFixed(1));
  };

  const cards = [
    {
      id: "total" as const,
      label: "Total de recursos",
      value: total,
      percentage: undefined,
      microText: "Recursos registrados",
      icon: FolderTree,
      color: "primary" as const,
      iconContainer: "bg-primary/15 text-primary",
      activeBg: "bg-primary-100/90 dark:bg-muted/30",
    },
    {
      id: "activos" as const,
      label: "Recursos activos",
      value: activos,
      percentage: getPercentage(activos),
      microText: "Disponibles para asignación",
      icon: CheckCircle2,
      color: "success" as const,
      iconContainer: "bg-success/15 text-success-700 dark:text-success-300",
      activeBg: "bg-success-100/90 dark:bg-success-900/50",
    },
    {
      id: "inactivos" as const,
      label: "Recursos inactivos",
      value: inactivos,
      percentage: getPercentage(inactivos),
      microText: "Sin asignación operativa",
      icon: XCircle,
      color: "neutral" as const,
      iconContainer: "bg-muted-foreground/25 dark:bg-muted-foreground/35 text-foreground dark:text-neutral-200",
      activeBg: "bg-muted/80 dark:bg-muted/60",
    },
    {
      id: "apps" as const,
      label: "Aplicaciones con recursos",
      value: appsCount,
      percentage: undefined,
      microText: "Sistemas con catálogo activo",
      icon: AppWindow,
      color: "info" as const,
      iconContainer: "bg-info/15 text-info-700 dark:text-info-300",
      activeBg: "bg-info-100/90 dark:bg-info-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {cards.map((c) => {
        const isActive = activeFilter === c.id;
        const Icon = c.icon;

        return (
          <InteractiveCard
            key={c.id}
            title={c.label}
            description={c.microText}
            color={c.color}
            hideChevron
            borderless
            shadowless
            isActive={isActive}
            iconContainerClassName={c.iconContainer}
            activeInnerBgClassName={c.activeBg}
            onClick={() => onSelectFilter(c.id)}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
          >
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-heading text-foreground">
                  {c.value}
                </span>
                {c.percentage !== undefined && (
                  <span className="text-xs font-medium text-muted-foreground">
                    ({c.percentage}%)
                  </span>
                )}
              </div>
              <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="size-4 opacity-80" />
              </div>
            </div>
          </InteractiveCard>
        );
      })}
    </div>
  );
}

