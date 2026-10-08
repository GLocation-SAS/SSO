"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { FolderTree, CheckCircle2, XCircle, AppWindow } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      color: "secondary" as const,
      iconContainer: "bg-secondary/15 text-secondary-700 dark:text-secondary-300",
      activeBg: "bg-secondary-100/90 dark:bg-secondary-900/50",
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
            icon={<Icon className="size-5" />}
            decorativeIcon={<Icon className="size-full opacity-10" />}
            className={
              "cursor-pointer select-none transition-all duration-200 border-none shadow-none hover:shadow-none hover:brightness-95 dark:hover:brightness-110" +
              (isActive ? " bg-primary/5" : " bg-surface hover:bg-muted/40")
            }
            rightElement={
              <div className="flex flex-col items-end justify-center gap-1 py-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-heading tracking-tight text-foreground">
                    {c.value.toLocaleString("es-EC")}
                  </span>
                  {c.percentage !== undefined && (
                    <Badge tone={c.color} appearance="soft" size="sm" className="px-1.5 py-0 h-5">
                      {c.percentage}%
                    </Badge>
                  )}
                </div>
                {isActive ? (
                  <CheckCircle2 className="size-4 text-primary shrink-0 animate-in fade-in zoom-in-95 duration-200" />
                ) : (
                  <div className="h-4" />
                )}
              </div>
            }
          />
        );
      })}
    </div>
  );
}

