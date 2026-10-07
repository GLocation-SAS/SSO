"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { cn } from "@/lib/utils";

export interface AuditSummaryCardItem {
  id: string;
  label: string;
  value: number | string;
  icon: React.ElementType;
  color?: "default" | "neutral" | "primary" | "info" | "warning" | "success" | "danger" | "purple";
  subtitle?: string;
  isActive?: boolean;
}

interface AuditSummaryCardsProps {
  cards: AuditSummaryCardItem[];
  activeId?: string | null;
  onSelectCard?: (id: string) => void;
  className?: string;
}

const colorMap = {
  primary: {
    iconContainer: "bg-primary/15 text-primary",
    activeBg: "bg-primary/10 dark:bg-primary/20",
    pill: "text-primary dark:text-primary-300",
  },
  secondary: {
    iconContainer: "bg-secondary/15 text-secondary",
    activeBg: "bg-secondary/10 dark:bg-secondary/20",
    pill: "text-secondary dark:text-secondary-300",
  },
  success: {
    iconContainer: "bg-success/15 text-success",
    activeBg: "bg-success/10 dark:bg-success/20",
    pill: "text-success",
  },
  warning: {
    iconContainer: "bg-warning/15 text-warning-700 dark:text-warning-300",
    activeBg: "bg-warning/10 dark:bg-warning/20",
    pill: "text-warning-700 dark:text-warning-400",
  },
  danger: {
    iconContainer: "bg-danger/15 text-danger",
    activeBg: "bg-danger/10 dark:bg-danger/20",
    pill: "text-danger",
  },
  neutral: {
    iconContainer: "bg-muted-foreground/20 text-foreground",
    activeBg: "bg-muted/70",
    pill: "text-muted-foreground",
  },
};

export function AuditSummaryCards({
  cards,
  activeId,
  onSelectCard,
  className,
}: AuditSummaryCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full",
        className
      )}
    >
      {cards.slice(0, 4).map((c) => {
        const isCurrentActive = activeId === c.id || c.isActive;
        const Icon = c.icon;
        const chosenColor = c.color || "neutral";
        const colorStyles = colorMap[chosenColor as keyof typeof colorMap] || colorMap.neutral;

        return (
          <InteractiveCard
            key={c.id}
            title={c.label}
            color={chosenColor}
            hideChevron
            borderless
            shadowless
            isActive={isCurrentActive}
            iconContainerClassName={colorStyles.iconContainer}
            activeInnerBgClassName={colorStyles.activeBg}
            onClick={() => onSelectCard?.(c.id)}
            icon={<Icon className="size-5" />}
            decorativeIcon={<Icon className="size-full" />}
            className="cursor-pointer select-none transition-all duration-200 border-none shadow-none hover:shadow-none hover:brightness-95 dark:hover:brightness-110"
            meta={
              <div className="flex flex-col gap-0.5 pt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold font-heading tracking-tight text-foreground">
                    {typeof c.value === "number" ? c.value.toLocaleString("es-EC") : c.value}
                  </span>
                  {isCurrentActive && (
                    <span className={cn("text-[11px] font-semibold", colorStyles.pill)}>
                      Filtro activo
                    </span>
                  )}
                </div>
                {c.subtitle && (
                  <span className="text-[11px] text-muted-foreground truncate">
                    {c.subtitle}
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
