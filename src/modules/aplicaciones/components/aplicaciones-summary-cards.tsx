"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { LayoutGrid, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppSummaryFilterType = "total" | "activas" | "inactivas" | "atencion";

interface AplicacionesSummaryCardsProps {
  total: number;
  activas: number;
  inactivas: number;
  atencion: number;
  activeFilter: AppSummaryFilterType | null;
  onSelectFilter: (filter: AppSummaryFilterType) => void;
}

export function AplicacionesSummaryCards({
  total,
  activas,
  inactivas,
  atencion,
  activeFilter,
  onSelectFilter,
}: AplicacionesSummaryCardsProps) {
  const cards = [
    {
      id: "total" as const,
      label: "Total de aplicaciones",
      value: total,
      icon: LayoutGrid,
      color: "primary" as const,
      activePill: "text-primary dark:text-primary-300",
      pulseColor: "bg-primary",
      iconContainer: "bg-primary/15 text-primary",
      activeBg: "bg-primary-100/90 dark:bg-primary-900/50",
    },
    {
      id: "activas" as const,
      label: "Aplicaciones activas",
      value: activas,
      icon: CheckCircle2,
      color: "success" as const,
      activePill: "text-success-700 dark:text-success-400",
      pulseColor: "bg-success-500",
      iconContainer: "bg-success/15 text-success-700 dark:text-success-300",
      activeBg: "bg-success-100/90 dark:bg-success-900/50",
    },
    {
      id: "inactivas" as const,
      label: "Aplicaciones inactivas",
      value: inactivas,
      icon: XCircle,
      color: "neutral" as const,
      activePill: "text-muted-foreground",
      pulseColor: "bg-muted-foreground",
      iconContainer: "bg-muted-foreground/25 dark:bg-muted-foreground/35 text-foreground dark:text-neutral-200",
      activeBg: "bg-muted/80 dark:bg-muted/60",
    },
    {
      id: "atencion" as const,
      label: "Requieren atención",
      value: atencion,
      icon: AlertTriangle,
      color: "warning" as const,
      activePill: "text-warning-700 dark:text-warning-400",
      pulseColor: "bg-warning-500",
      iconContainer: "bg-warning/15 text-warning-700 dark:text-warning-300",
      activeBg: "bg-warning-100/90 dark:bg-warning-900/50",
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
            color={c.color}
            hideChevron
            borderless
            shadowless
            isActive={isActive}
            iconContainerClassName={c.iconContainer}
            activeInnerBgClassName={c.activeBg}
            onClick={() => onSelectFilter(c.id)}
            icon={<Icon className="size-5" />}
            decorativeIcon={<Icon className="size-full" />}
            className="cursor-pointer select-none transition-all duration-200 border-none shadow-none hover:shadow-none hover:brightness-95 dark:hover:brightness-110"
            meta={
              <div className="flex items-baseline justify-between gap-2 pt-0.5">
                <span className="text-2xl font-bold font-heading tracking-tight text-foreground">
                  {c.value.toLocaleString("es-EC")}
                </span>

                {isActive && (
                  <span className={cn("text-[11px] font-semibold flex items-center gap-1", c.activePill)}>
                    <span className={cn("size-1.5 rounded-full animate-pulse", c.pulseColor)} />
                    Filtrado
                  </span>
                )}
              </div>
            }
          />
        );
      })}
    </div>
  );
}

