"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { LayoutGrid, CheckCircle2, Building2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MisAppSummaryFilterType = "total" | "activas" | "sedes" | "roles";

interface MisAplicacionesSummaryCardsProps {
  total: number;
  activas: number;
  sedesCount: number;
  rolesCount: number;
  activeFilter: MisAppSummaryFilterType | null;
  onSelectFilter: (filter: MisAppSummaryFilterType) => void;
}

export function MisAplicacionesSummaryCards({
  total,
  activas,
  sedesCount,
  rolesCount,
  activeFilter,
  onSelectFilter,
}: MisAplicacionesSummaryCardsProps) {
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    const perc = (value / total) * 100;
    return Number.isInteger(perc) ? perc : Number(perc.toFixed(1));
  };

  const cards = [
    {
      id: "total" as const,
      label: "Total de aplicaciones",
      value: total,
      percentage: undefined,
      microText: "En tu catálogo personal",
      icon: LayoutGrid,
      color: "primary" as const,
      iconContainer: "bg-primary/15 text-primary",
      activeBg: "bg-primary-100/90 dark:bg-muted/30",
    },
    {
      id: "activas" as const,
      label: "Aplicaciones activas",
      value: activas,
      percentage: getPercentage(activas),
      microText: "Disponibles para ingreso",
      icon: CheckCircle2,
      color: "success" as const,
      iconContainer: "bg-success/15 text-success-700 dark:text-success-300",
      activeBg: "bg-success-100/90 dark:bg-success-900/50",
    },
    {
      id: "sedes" as const,
      label: "Sedes",
      value: sedesCount,
      percentage: undefined,
      microText: "Sedes asignadas",
      icon: Building2,
      color: "info" as const,
      iconContainer: "bg-info/15 text-info-700 dark:text-info-300",
      activeBg: "bg-info-100/90 dark:bg-info-900/50",
    },
    {
      id: "roles" as const,
      label: "Roles",
      value: rolesCount,
      percentage: undefined,
      microText: "Roles asignados",
      icon: ShieldCheck,
      color: "purple" as const,
      iconContainer: "bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 dark:text-secondary-300",
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
            titleLines={2}
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
            decorativeIcon={<Icon className="size-full" />}
            className={cn(
              "cursor-pointer select-none transition-all duration-200 border-none shadow-none hover:shadow-none hover:brightness-95 dark:hover:brightness-110",
              isActive ? "bg-primary/5" : "bg-surface hover:bg-muted/40"
            )}
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
