"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RoleSummaryFilterType = "total" | "activos" | "inactivos" | "sin-recursos";

interface RolesSummaryCardsProps {
  total: number;
  activos: number;
  inactivos: number;
  sinRecursos: number;
  activeFilter: RoleSummaryFilterType | null;
  onSelectFilter: (filter: RoleSummaryFilterType) => void;
}

export function RolesSummaryCards({
  total,
  activos,
  inactivos,
  sinRecursos,
  activeFilter,
  onSelectFilter,
}: RolesSummaryCardsProps) {
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    const perc = (value / total) * 100;
    return Number.isInteger(perc) ? perc : Number(perc.toFixed(1));
  };

  const cards = [
    {
      id: "total" as const,
      label: "Total de roles",
      value: total,
      percentage: undefined,
      microText: "Roles en el sistema",
      icon: ShieldCheck,
      color: "primary" as const,
      iconContainer: "bg-primary/15 text-primary",
      activeBg: "bg-primary-100/90 dark:bg-muted/30",
    },
    {
      id: "activos" as const,
      label: "Roles activos",
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
      label: "Roles inactivos",
      value: inactivos,
      percentage: getPercentage(inactivos),
      microText: "Acceso suspendido",
      icon: XCircle,
      color: "neutral" as const,
      iconContainer: "bg-muted-foreground/25 dark:bg-muted-foreground/35 text-foreground dark:text-neutral-200",
      activeBg: "bg-muted/80 dark:bg-muted/60",
    },
    {
      id: "sin-recursos" as const,
      label: "Sin recursos configurados",
      value: sinRecursos,
      percentage: undefined,
      microText: "Requieren configuración",
      icon: AlertTriangle,
      color: "warning" as const,
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
                    <Badge
                      tone={c.color}
                      appearance="soft"
                      size="sm"
                      className="px-1.5 py-0 h-5"
                    >
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
