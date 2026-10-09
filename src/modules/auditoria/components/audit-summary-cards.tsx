"use client";

import * as React from "react";
import { InteractiveCard } from "@/components/ui/data-display";
import { CheckCircle2 } from "lucide-react";
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
    activeBg: "bg-primary-100/90 dark:bg-muted/30",
  },
  secondary: {
    iconContainer: "bg-secondary/15 text-secondary",
    activeBg: "bg-secondary/10 dark:bg-secondary/20",
  },
  success: {
    iconContainer: "bg-success/15 text-success-700 dark:text-success-300",
    activeBg: "bg-success-100/90 dark:bg-success-900/50",
  },
  warning: {
    iconContainer: "bg-warning/15 text-warning-700 dark:text-warning-300",
    activeBg: "bg-warning-100/90 dark:bg-warning-900/50",
  },
  danger: {
    iconContainer: "bg-danger/15 text-danger",
    activeBg: "bg-danger/10 dark:bg-danger/20",
  },
  neutral: {
    iconContainer: "bg-muted-foreground/25 dark:bg-muted-foreground/35 text-foreground dark:text-neutral-200",
    activeBg: "bg-muted/80 dark:bg-muted/60",
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
            description={c.subtitle}
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
            className={cn(
              "cursor-pointer select-none transition-all duration-200 border-none shadow-none hover:shadow-none hover:brightness-95 dark:hover:brightness-110",
              isCurrentActive ? "bg-primary/5" : "bg-surface hover:bg-muted/40"
            )}
            rightElement={
              <div className="flex flex-col items-end justify-center gap-1 py-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-heading tracking-tight text-foreground">
                    {typeof c.value === "number" ? c.value.toLocaleString("es-EC") : c.value}
                  </span>
                </div>
                {isCurrentActive ? (
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
