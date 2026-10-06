"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserMinus } from "lucide-react";
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
  const cards: Array<{
    id: SummaryFilterType;
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
      {
        id: "total",
        label: "Total de usuarios",
        value: total,
        icon: Users,
        accentColor: "text-muted-foreground",
      },
      {
        id: "activos",
        label: "Usuarios activos",
        value: activos,
        icon: UserCheck,
        accentColor: "text-success-600 dark:text-success-400",
      },
      {
        id: "inactivos",
        label: "Usuarios inactivos",
        value: inactivos,
        icon: UserX,
        accentColor: "text-muted-foreground",
      },
      {
        id: "sin-accesos",
        label: "Usuarios sin accesos",
        value: sinAccesos,
        icon: UserMinus,
        accentColor: "text-warning-600 dark:text-warning-400",
      },
    ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {cards.map((c) => {
        const isActive = activeFilter === c.id;
        const Icon = c.icon;

        return (
          <Card
            key={c.id}
            size="sm"
            variant="panel"
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onClick={() => onSelectFilter(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectFilter(c.id);
              }
            }}
            className={cn(
              "cursor-pointer select-none transition-all duration-200 border rounded-xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              isActive
                ? "border-primary ring-2 ring-primary bg-primary/5 dark:bg-primary-950/20 shadow-xs"
                : "border-border/80 hover:border-border hover:bg-muted/30 bg-surface shadow-2xs"
            )}
            innerClassName="p-4 flex flex-col justify-between h-full gap-2 text-left items-stretch"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-xs font-semibold truncate",
                  isActive
                    ? "text-primary dark:text-primary-300 font-bold"
                    : "text-muted-foreground"
                )}
                title={c.label}
              >
                {c.label}
              </span>
              <div
                className={cn(
                  "size-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                  isActive
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-muted/40 border-border/60 text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5",
                    isActive ? "text-primary" : c.accentColor
                  )}
                />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span
                className={cn(
                  "text-2xl font-bold font-heading tracking-tight",
                  isActive ? "text-primary dark:text-white" : "text-foreground"
                )}
              >
                {c.value.toLocaleString("es-EC")}
              </span>

              {isActive && (
                <span className="text-[11px] font-medium text-primary dark:text-primary-300 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  Filtrado
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

