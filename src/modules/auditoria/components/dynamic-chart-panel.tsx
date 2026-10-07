"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Activity,
  Layers,
  Users,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS Y TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export interface DistributionItem {
  id: string;
  label: string;
  value: number;
  pct: number;
  color?: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface DynamicChartPanelProps {
  title?: string;
  contextTitle: string;
  contextSubtitle?: string;
  hasSelection?: boolean;
  onClearSelection?: () => void;
  // Chart 1: Donut de estado o composición
  donutData?: {
    title: string;
    items: DistributionItem[];
    totalLabel?: string;
  };
  // Chart 2: Barras de distribución (categorías, apps o roles)
  barsData?: {
    title: string;
    items: DistributionItem[];
    valueSuffix?: string;
  };
  // Chart 3: Evolución temporal
  trendData?: {
    title: string;
    points: TrendPoint[];
    unit?: string;
  };
  // Indicador destacado adicional
  extraStat?: {
    label: string;
    value: string | number;
    subtext?: string;
  };
  className?: string;
}

export function DynamicChartPanel({
  title = "Interpretación visual",
  contextTitle,
  contextSubtitle,
  hasSelection = false,
  onClearSelection,
  donutData,
  barsData,
  trendData,
  extraStat,
  className,
}: DynamicChartPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-5 w-full transition-all duration-300",
        className
      )}
    >
      {/* 1. HEADER DE CONTEXTO DINÁMICO */}
      <div className="flex flex-col gap-2 border-b border-border/60 pb-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
          </div>

          {hasSelection && onClearSelection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-7 px-2 text-[11px] text-primary hover:text-primary hover:bg-primary/10 gap-1 font-semibold"
            >
              <RotateCcw className="size-3" />
              <span>Ver general</span>
            </Button>
          )}
        </div>

        {/* Indicador de Contexto Activo (lo que pidió Julián) */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 line-clamp-1">
              <span className="text-muted-foreground font-normal">Contexto:</span>
              <span className="text-primary font-bold">{contextTitle}</span>
            </h3>
            {contextSubtitle && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {contextSubtitle}
              </p>
            )}
          </div>

          <Badge
            variant={hasSelection ? "primary" : "neutral"}
            appearance="soft"
            size="sm"
            className="shrink-0 text-[10px] font-semibold"
          >
            {hasSelection ? "Filtrado" : "Panorámica"}
          </Badge>
        </div>
      </div>

      {/* 2. STAT ADICIONAL / HIGHLIGHT SI EXISTE */}
      {extraStat && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground font-medium">
              {extraStat.label}
            </span>
            {extraStat.subtext && (
              <p className="text-[10px] text-muted-foreground">{extraStat.subtext}</p>
            )}
          </div>
          <span className="text-lg font-bold font-heading text-foreground tabular-nums">
            {extraStat.value}
          </span>
        </div>
      )}

      {/* 3. DONUT CHART (SI TIENE DATOS) */}
      {donutData && donutData.items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <PieChart className="size-3.5 text-secondary" />
              {donutData.title}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Total: {donutData.items.reduce((acc, i) => acc + i.value, 0)}
            </span>
          </div>

          <DonutChartWidget items={donutData.items} />
        </div>
      )}

      {/* 4. HORIZONTAL BARS CHART (SI TIENE DATOS) */}
      {barsData && barsData.items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <BarChart3 className="size-3.5 text-primary" />
              {barsData.title}
            </span>
          </div>

          <div className="space-y-2.5">
            {barsData.items.slice(0, 5).map((item, idx) => (
              <div key={item.id || idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground line-clamp-1 max-w-[70%]">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground tabular-nums font-mono text-[11px]">
                    {item.value} {barsData.valueSuffix || ""} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(4, Math.min(100, item.pct))}%`,
                      backgroundColor: item.color || "var(--color-primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EVOLUCIÓN TEMPORAL / TREND BARS */}
      {trendData && trendData.points.length > 0 && (
        <div className="space-y-3 pt-1 border-t border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <LineChartIcon className="size-3.5 text-success" />
              {trendData.title}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {trendData.unit || "Eventos"}
            </span>
          </div>

          <TrendBarWidget points={trendData.points} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE DONUT CHART (SVG NATIVO ACCESIBLE)
// ─────────────────────────────────────────────────────────────────────────────
function DonutChartWidget({ items }: { items: DistributionItem[] }) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const total = items.reduce((acc, i) => acc + i.value, 0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;
  const segments = items.map((item) => {
    const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPct / 100) * circumference);
    accumulatedPct += item.pct;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  const activeSegment = items.find((d) => d.id === hoveredId);

  return (
    <div className="flex items-center justify-between gap-4 p-2">
      {/* SVG Donut */}
      <div className="relative size-28 shrink-0 flex items-center justify-center">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            className="opacity-30"
          />
          {segments.map((seg) => {
            const isHovered = hoveredId === seg.id;
            const isDimmed = hoveredId !== null && !isHovered;
            return (
              <circle
                key={seg.id}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={seg.color || "var(--color-primary)"}
                strokeWidth={isHovered ? 14 : 12}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  isHovered ? "filter drop-shadow-md" : "",
                  isDimmed ? "opacity-35" : "opacity-100"
                )}
                onMouseEnter={() => setHoveredId(seg.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>

        {/* Métrica Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
          {activeSegment ? (
            <>
              <span className="text-sm font-black text-foreground tabular-nums leading-tight">
                {activeSegment.value}
              </span>
              <span
                className="text-[9px] font-bold line-clamp-1 max-w-[60px]"
                style={{ color: activeSegment.color }}
              >
                {activeSegment.pct}%
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-black text-foreground tabular-nums leading-tight">
                {total}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">
                Total
              </span>
            </>
          )}
        </div>
      </div>

      {/* Leyenda interactiva */}
      <div className="flex-1 space-y-1.5 text-xs">
        {items.map((item) => {
          const isHovered = hoveredId === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors",
                isHovered ? "bg-muted/70 font-semibold" : "hover:bg-muted/30"
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || "var(--color-primary)" }}
                />
                <span className="truncate text-foreground text-[11px]">{item.label}</span>
              </div>
              <span className="text-muted-foreground font-mono text-[11px] tabular-nums shrink-0">
                {item.value} ({item.pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE TREND BARS (BARRAS DE EVOLUCIÓN TEMPORAL)
// ─────────────────────────────────────────────────────────────────────────────
function TrendBarWidget({ points }: { points: TrendPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const maxValue = Math.max(...points.map((p) => p.value), 1);

  return (
    <div className="space-y-2">
      <div className="h-24 flex items-end justify-between gap-1.5 pt-4 px-1 border-b border-border/60">
        {points.map((pt, idx) => {
          const heightPct = (pt.value / maxValue) * 100;
          const isHovered = hoveredIdx === idx;
          const isDimmed = hoveredIdx !== null && !isHovered;

          return (
            <div
              key={pt.label}
              className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              tabIndex={0}
              role="button"
              aria-label={`${pt.label}: ${pt.value}`}
            >
              {/* Tooltip flotante */}
              {isHovered && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 bg-foreground text-background px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap shadow-md">
                  {pt.value}
                </div>
              )}

              {/* Barra */}
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all duration-300 ease-out",
                  isHovered
                    ? "bg-primary brightness-110"
                    : "bg-primary/70 dark:bg-primary/80",
                  isDimmed && "opacity-40"
                )}
                style={{
                  height: `${Math.max(6, heightPct)}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Etiquetas X */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono px-0.5">
        {points.map((pt) => (
          <span key={pt.label} className="truncate text-center flex-1">
            {pt.label}
          </span>
        ))}
      </div>
    </div>
  );
}
