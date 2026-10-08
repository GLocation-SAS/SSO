"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { Users, UserCheck, UserX, UserMinus, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SummaryFilterType = "total" | "activos" | "inactivos" | "sin-accesos";

interface UsuariosSummaryCardsProps {
  total: number;
  activos: number;
  inactivos: number;
  sinAccesos: number;
  activeFilter: SummaryFilterType | null;
  onSelectFilter: (filter: SummaryFilterType) => void;
}

export function UsuariosSummaryCards({
  total,
  activos,
  inactivos,
  sinAccesos,
  activeFilter,
  onSelectFilter,
}: UsuariosSummaryCardsProps) {
  
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const cards = [
    {
      id: "total" as const,
      label: "Total de usuarios",
      value: total,
      percentage: undefined,
      microText: "Usuarios registrados",
      icon: Users,
      color: "primary" as const,
      iconContainer: "bg-primary/15 text-primary",
      activeBg: "bg-primary-100/90 dark:bg-muted/30",
    },
    {
      id: "activos" as const,
      label: "Usuarios activos",
      value: activos,
      percentage: getPercentage(activos),
      microText: "Con estado activo",
      icon: UserCheck,
      color: "success" as const,
      iconContainer: "bg-success/15 text-success-700 dark:text-success-300",
      activeBg: "bg-success-100/90 dark:bg-success-900/50",
    },
    {
      id: "inactivos" as const,
      label: "Usuarios inactivos",
      value: inactivos,
      percentage: getPercentage(inactivos),
      microText: "Con estado inactivo",
      icon: UserX,
      color: "neutral" as const,
      iconContainer: "bg-muted-foreground/25 dark:bg-muted-foreground/35 text-foreground dark:text-neutral-200",
      activeBg: "bg-muted/80 dark:bg-muted/60",
    },
    {
      id: "sin-accesos" as const,
      label: "Sin accesos asignados",
      value: sinAccesos,
      percentage: getPercentage(sinAccesos),
      microText: "Requieren asignación",
      icon: UserMinus,
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
                    <Badge tone={c.color} appearance="soft" size="sm" className="px-1.5 py-0 h-5">
                      {c.percentage}%
                    </Badge>
                  )}
                </div>
                {isActive && (
                  <CheckCircle2 className="size-4 text-primary shrink-0 animate-in fade-in zoom-in-95 duration-200" />
                )}
              </div>
            }
          />
        );
      })}
    </div>
  );
}
