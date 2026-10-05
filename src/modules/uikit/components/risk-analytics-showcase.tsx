"use client";

import React from "react";
import { SubSection } from "./sub-section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/ui/data-display";
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  HelpCircle,
  Clock,
  Building2,
  FileText,
  AlertOctagon,
  BarChart2,
  Info,
  ArrowUpRight,
  MousePointer,
  Check,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";

// ─────────────────────────────────────────────────────────────────────────────
// 1. BAR CHART SHOWCASE
// Caso de uso: Comparación de magnitudes cuantitativas entre categorías discretas
// ─────────────────────────────────────────────────────────────────────────────
function BarChartShowcase() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const data = [
    { label: "Andina", value: 380, pct: 38 },
    { label: "Caribe", value: 290, pct: 29 },
    { label: "Pacífica", value: 180, pct: 18 },
    { label: "Amazonía", value: 90, pct: 9 },
    { label: "Orinoquía", value: 60, pct: 6 },
  ];

  const maxValue = 400;

  return (
    <div className="p-5 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" /> Bar Chart: Sedes por Región
          </span>
          <Badge variant="neutral" appearance="soft" className="text-[10px] font-semibold">Comparativa Discreta</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          <strong className="text-foreground">Caso de uso:</strong> Comparar magnitudes exactas entre categorías o entidades independientes.
        </p>
      </div>

      <ChartContainer minHeight={170} className="relative flex flex-col justify-end pt-3">
        {/* Y-Axis Grid lines */}
        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>400</span>
          </div>
          <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>200</span>
          </div>
          <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
            <span>0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="h-32 flex items-end justify-between gap-2.5 z-10 px-1 border-b border-border/70">
          {data.map((item, idx) => {
            const heightPercent = (item.value / maxValue) * 100;
            const isHovered = hoveredIndex === idx;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${item.label}: ${item.value} sedes (${item.pct}%)`}
              >
                {/* Chart Tooltip */}
                <ChartTooltip
                  active={isHovered}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 min-w-[130px]"
                >
                  <ChartTooltipContent
                    title={`Región ${item.label}`}
                    label="Sedes"
                    value={item.value}
                    indicatorColor="var(--chart-1)"
                    subvalue={`${item.pct}% del total`}
                  />
                </ChartTooltip>

                {/* Bar */}
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-200",
                    isHovered ? "bg-primary scale-y-[1.03] shadow-xs" : "bg-primary/75 hover:bg-primary",
                    isDimmed && "opacity-45"
                  )}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 px-0.5">
          {data.map((d, i) => (
            <span
              key={d.label}
              className={cn(
                "transition-colors truncate max-w-[50px] text-center",
                hoveredIndex === i ? "text-primary font-bold" : ""
              )}
            >
              {d.label}
            </span>
          ))}
        </div>
      </ChartContainer>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-medium">Total auditado: 1,000 sedes</span>
        <span className="text-[10px] bg-muted/60 px-2 py-0.5 rounded-full font-mono">N=5 zonas</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DONUT CHART SHOWCASE
// Caso de uso: Composición porcentual de las partes respecto al todo (100%)
// ─────────────────────────────────────────────────────────────────────────────
function DonutChartShowcase() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const data = [
    { id: "bajo", label: "Bajo", count: 558, pct: 45, color: "var(--color-success)" },
    { id: "medio", label: "Medio", count: 372, pct: 30, color: "var(--color-warning)" },
    { id: "alto", label: "Alto", count: 223, pct: 18, color: "var(--color-danger)" },
    { id: "critico", label: "Crítico", count: 87, pct: 7, color: "var(--primitive-danger-700)" },
  ];

  const total = 1240;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;
  const segments = data.map((item) => {
    const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPct / 100) * circumference);
    accumulatedPct += item.pct;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  const activeSegment = data.find((d) => d.id === hoveredId);

  return (
    <div className="p-5 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-2">
            <PieChart className="size-4 text-secondary" /> Donut Chart: Riesgo Territorial
          </span>
          <Badge variant="neutral" appearance="soft" className="text-[10px] font-semibold">Proporción 100%</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          <strong className="text-foreground">Caso de uso:</strong> Composición de un todo cerrado (100%). 3-5 categorías con métrica central.
        </p>
      </div>

      <ChartContainer minHeight={170} className="relative flex flex-col items-center justify-center py-1">
        {/* SVG Donut */}
        <div className="relative size-36 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="hsl(var(--muted))"
              strokeWidth="11"
              className="opacity-25"
            />
            {/* Segments */}
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
                  stroke={seg.color}
                  strokeWidth={isHovered ? 13 : 11}
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

          {/* Central KPI Hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
            {activeSegment ? (
              <>
                <span className="text-base font-black text-foreground tabular-nums leading-tight">
                  {activeSegment.count}
                </span>
                <span className="text-[10px] font-bold" style={{ color: activeSegment.color }}>
                  {activeSegment.pct}% {activeSegment.label}
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-black text-foreground tabular-nums leading-none">
                  {total.toLocaleString()}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">Total Sedes</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <ChartLegend alignment="center" className="gap-2.5 pt-2">
          {data.map((item) => (
            <ChartLegendItem
              key={item.id}
              label={item.label}
              color={item.color}
              value={`${item.pct}%`}
              active={hoveredId === null || hoveredId === item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="text-[10px] py-0"
            />
          ))}
        </ChartLegend>
      </ChartContainer>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Suma de categorías: 100%</span>
        <span className="text-success font-semibold text-[10px]">Corte: Activo</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LINE CHART SHOWCASE
// Caso de uso: Tendencia continua y series temporales continuas
// ─────────────────────────────────────────────────────────────────────────────
function LineChartShowcase() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const data = [
    { month: "Ene", value: 45, change: null },
    { month: "Feb", value: 65, change: "+44%" },
    { month: "Mar", value: 58, change: "-10%" },
    { month: "Abr", value: 92, change: "+58%" },
    { month: "May", value: 115, change: "+25%" },
    { month: "Jun", value: 140, change: "+21%" },
  ];

  const maxValue = 160;
  const points = [
    { x: 15, y: 100 - (45 / maxValue) * 85 },
    { x: 58, y: 100 - (65 / maxValue) * 85 },
    { x: 102, y: 100 - (58 / maxValue) * 85 },
    { x: 148, y: 100 - (92 / maxValue) * 85 },
    { x: 192, y: 100 - (115 / maxValue) * 85 },
    { x: 235, y: 100 - (140 / maxValue) * 85 },
  ];

  const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p, i) => {
    const prev = points[i];
    const cx = (prev.x + p.x) / 2;
    return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }).join(" ");

  const areaData = `${pathData} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

  return (
    <div className="p-5 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-2">
            <LineChartIcon className="size-4 text-info" /> Line Chart: Tendencia Alertas
          </span>
          <Badge variant="neutral" appearance="soft" className="text-[10px] font-semibold">Serie Temporal</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          <strong className="text-foreground">Caso de uso:</strong> Evolución cronológica continua y aceleración/desaceleración temporal.
        </p>
      </div>

      <ChartContainer minHeight={170} className="relative flex flex-col justify-end pt-3">
        {/* Grid lines */}
        <div className="absolute inset-x-0 top-2 bottom-6 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-border/60 w-full" />
          <div className="border-b border-border/60 w-full" />
          <div className="border-b border-border/60 w-full" />
        </div>

        {/* SVG Curve */}
        <div className="relative w-full h-32">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 250 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path d={areaData} fill="url(#lineFillGradient)" />

            {/* Stroke Line */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--chart-1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Vertical crosshair line for hovered item */}
            {hoveredIndex !== null && (
              <line
                x1={points[hoveredIndex].x}
                y1={0}
                x2={points[hoveredIndex].x}
                y2={100}
                stroke="var(--chart-1)"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="opacity-70"
              />
            )}

            {/* Circles */}
            {points.map((p, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={isHovered ? "var(--chart-1)" : "hsl(var(--background))"}
                  stroke="var(--chart-1)"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Floating Chart Tooltip */}
          {hoveredIndex !== null && (
            <div
              className="absolute -top-14 -translate-x-1/2 pointer-events-none transition-all duration-150 z-20"
              style={{
                left: `${(points[hoveredIndex].x / 250) * 100}%`,
              }}
            >
              <ChartTooltip active={true}>
                <ChartTooltipContent
                  title={`${data[hoveredIndex].month} 2026`}
                  label="Alertas"
                  value={data[hoveredIndex].value}
                  indicatorColor="var(--chart-1)"
                  trend={data[hoveredIndex].change?.startsWith("+") ? "up" : data[hoveredIndex].change?.startsWith("-") ? "down" : "neutral"}
                  trendValue={data[hoveredIndex].change ? `${data[hoveredIndex].change} vs anterior` : "Base"}
                />
              </ChartTooltip>
            </div>
          )}
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 px-1 border-t border-border/70">
          {data.map((d, i) => (
            <span
              key={d.month}
              className={cn(
                "transition-colors",
                hoveredIndex === i ? "text-primary font-bold" : ""
              )}
            >
              {d.month}
            </span>
          ))}
        </div>
      </ChartContainer>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Crecimiento semestral</span>
        <span className="text-danger font-bold text-[10px] flex items-center gap-1">
          <TrendingUp className="size-3" /> +211%
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHART TOOLTIP & GOVERNANCE ANATOMY SPEC
// ─────────────────────────────────────────────────────────────────────────────
function ChartTooltipSpecCard() {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <MousePointer className="size-4" />
            </span>
            <h4 className="text-sm font-bold text-foreground">Chart Tooltip & Guía de Casos de Uso</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Estándar de interacción y reglas de selección obligatorias para analítica institucional.
          </p>
        </div>
        <Badge variant="neutral" appearance="soft" className="shrink-0 self-start sm:self-auto text-xs">
          MINEDEC Design Governance
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Bar Chart Rule */}
        <div className="p-4 rounded-xl border border-border bg-surface/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <BarChart3 className="size-4" /> Bar Chart
          </div>
          <p className="text-[11px] text-foreground font-semibold">Comparar entidades discretas</p>
          <ul className="text-[11px] text-muted-foreground space-y-1">
            <li className="flex items-start gap-1.5">
              <Check className="size-3 text-success shrink-0 mt-0.5" /> Sedes por departamento o zona
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="size-3 text-success shrink-0 mt-0.5" /> Rankings y volúmenes aislados
            </li>
            <li className="text-danger font-medium text-[10px] pt-1">
              ✕ No usar en series temporales continuas
            </li>
          </ul>
        </div>

        {/* 2. Donut Chart Rule */}
        <div className="p-4 rounded-xl border border-border bg-surface/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
            <PieChart className="size-4" /> Donut Chart
          </div>
          <p className="text-[11px] text-foreground font-semibold">Composición de un todo (100%)</p>
          <ul className="text-[11px] text-muted-foreground space-y-1">
            <li className="flex items-start gap-1.5">
              <Check className="size-3 text-success shrink-0 mt-0.5" /> Máximo 3 a 5 segmentos
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="size-3 text-success shrink-0 mt-0.5" /> Métrica agregada al centro
            </li>
            <li className="text-danger font-medium text-[10px] pt-1">
              ✕ No usar si no suma el 100%
            </li>
          </ul>
        </div>

        {/* 3. Line Chart Rule */}
        <div className="p-4 rounded-xl border border-border bg-surface/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-info">
            <LineChartIcon className="size-4" /> Line Chart
          </div>
          <p className="text-[11px] text-foreground font-semibold">Tendencia temporal continua</p>
          <ul className="text-[11px] text-muted-foreground space-y-1">
            <li className="flex items-start gap-1.5">
              <Check className="size-3 text-success shrink-0 mt-0.5" /> Eje horizontal cronológico
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="size-3 text-success shrink-0 mt-0.5" /> Aceleración y estacionalidad
            </li>
            <li className="text-danger font-medium text-[10px] pt-1">
              ✕ No usar para datos inconexos
            </li>
          </ul>
        </div>

        {/* 4. Chart Tooltip Anatomy */}
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span className="flex items-center gap-1.5">
              <Target className="size-4" /> Anatomía Tooltip
            </span>
            <span className="text-[10px] font-mono">Hover UI</span>
          </div>
          {/* Live sample tooltip */}
          <div className="p-2.5 rounded-xl border border-border bg-surface shadow-md space-y-1">
            <div className="text-[10px] text-muted-foreground font-semibold border-b border-border/50 pb-0.5">
              Región Andina • 2026
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="size-2 rounded-full bg-primary" /> Sedes evaluadas
              </div>
              <span className="font-black text-foreground">380</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
              <span>38% del total</span>
              <span className="text-success font-bold">+12% vs meta</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Flotante, no bloqueante (pointer-events-none), con contraste WCAG y datos exactos formateados.
          </p>
        </div>
      </div>
    </div>
  );
}

export function RiskAnalyticsShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
      {/* 1. RISK BADGE */}
      <SubSection icon={ShieldAlert} id="risk-badge" title="Risk Badge" description="Badge compacto para representar el nivel de riesgo con los tokens semánticos globales." registerSection={registerSection}>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold block">Alto</span>
            <Badge variant="error" appearance="filled" className="gap-1.5 px-3 py-1">
              <ShieldAlert className="size-3.5" /> Riesgo Alto
            </Badge>
          </div>
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold block">Medio</span>
            <Badge variant="warning" appearance="filled" className="gap-1.5 px-3 py-1">
              <AlertTriangle className="size-3.5" /> Riesgo Medio
            </Badge>
          </div>
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold block">Bajo</span>
            <Badge variant="success" appearance="filled" className="gap-1.5 px-3 py-1">
              <CheckCircle2 className="size-3.5" /> Riesgo Bajo
            </Badge>
          </div>
          <div className="space-y-1 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold block">Sin Información</span>
            <Badge variant="neutral" appearance="soft" className="gap-1.5 px-3 py-1">
              <HelpCircle className="size-3.5" /> Sin Datos
            </Badge>
          </div>
        </div>
      </SubSection>

      {/* 2. RISK SCALE */}
      <SubSection icon={BarChart2} id="risk-scale" title="Risk Scale" description="Escala visual completa para representar distribuciones y gradientes de niveles de riesgo." registerSection={registerSection}>
        <div className="space-y-6">
          {/* Bar Scale */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-foreground">
              <span>Distribución de Vulnerabilidad Escolar</span>
              <span>100% Cobertura</span>
            </div>
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-muted p-0.5">
              <div className="h-full bg-danger w-[15%] rounded-l-full" title="Riesgo Alto: 15%" />
              <div className="h-full bg-warning w-[35%]" title="Riesgo Medio: 35%" />
              <div className="h-full bg-success w-[40%]" title="Riesgo Bajo: 40%" />
              <div className="h-full bg-muted-foreground w-[10%] rounded-r-full" title="Sin Datos: 10%" />
            </div>
          </div>

          {/* Leyenda Horizontal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-surface/60">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-danger shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-foreground">Alto (15%)</p>
                <p className="text-[10px] text-muted-foreground">Atención Inmediata</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-warning shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-foreground">Medio (35%)</p>
                <p className="text-[10px] text-muted-foreground">Monitoreo Periódico</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-success shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-foreground">Bajo (40%)</p>
                <p className="text-[10px] text-muted-foreground">Estado Estabilizado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-muted-foreground shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-foreground">Sin Datos (10%)</p>
                <p className="text-[10px] text-muted-foreground">Pendiente Levantamiento</p>
              </div>
            </div>
          </div>
        </div>
      </SubSection>

      {/* 3. CRITICALITY BADGE */}
      <SubSection icon={AlertOctagon} id="criticality-badge" title="Criticality Badge" description="Insignia para categorización de prioridad y atención institucional urgente." registerSection={registerSection}>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge variant="error" appearance="filled" className="px-3 py-1 font-black">Urgente</Badge>
          <Badge variant="error" appearance="soft" className="px-3 py-1 font-bold">Alta</Badge>
          <Badge variant="warning" appearance="soft" className="px-3 py-1 font-bold">Media</Badge>
          <Badge variant="info" appearance="soft" className="px-3 py-1 font-bold">Baja</Badge>
        </div>
      </SubSection>

      {/* 4. KPI CARD */}
      <SubSection icon={TrendingUp} id="kpi-card" title="KPI Card" description="Reutilización del componente de indicadores principales con variación y tendencias." registerSection={registerSection}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            label="Escuelas en Zona de Riesgo"
            value="1,240"
            trend="up"
            change="+12%"
            comparison="vs año anterior"
            updatedAt="Actualizado hoy"
            icon={<Building2 className="size-5 text-primary" />}
          />
          <KpiCard
            label="Infraestructura Evaluada"
            value="94.2%"
            trend="neutral"
            change="0%"
            comparison="meta cumplida"
            updatedAt="Corte Marzo 2026"
            icon={<CheckCircle2 className="size-5 text-success" />}
          />
          <KpiCard
            label="Intervenciones Pendientes"
            value="86"
            trend="down"
            change="-8%"
            comparison="reducción mensual"
            updatedAt="Hace 2 horas"
            icon={<Clock className="size-5 text-warning" />}
          />
        </div>
      </SubSection>

      {/* 5. CHARTS (BAR, DONUT, LINE, LEGEND, TOOLTIP) */}
      <SubSection icon={PieChart} id="charts-group" title="Bar, Donut, Line Chart & Chart Tooltip" description="Representación visual de gráficos analíticos con casos de uso formales, leyendas e interacción flotante de tooltip." registerSection={registerSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BarChartShowcase />
          <DonutChartShowcase />
          <LineChartShowcase />
          <ChartTooltipSpecCard />
        </div>
      </SubSection>

      {/* 6. TREND INDICATOR */}
      <SubSection icon={ArrowUpRight} id="trend-indicator" title="Trend Indicator" description="Indicador compacto para incrementos, disminuciones o estabilidad de métricas." registerSection={registerSection}>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-xl border border-success/20">
            <TrendingUp className="size-4" /> Incremento (+14%)
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-danger bg-danger/10 px-3 py-1.5 rounded-xl border border-danger/20">
            <TrendingDown className="size-4" /> Disminución (-8%)
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
            <Minus className="size-4" /> Sin Variación (0%)
          </div>
        </div>
      </SubSection>

      {/* 7. INTERPRETATION CARD */}
      <SubSection icon={Info} id="interpretation-card" title="Interpretation Card" description="Tarjeta analítica para resumir hallazgos clave en lenguaje natural." registerSection={registerSection}>
        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-3 text-left relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Sparkles className="size-4" /> Diagnóstico Territorial IA
            </span>
            <span className="text-[10px] text-muted-foreground">Fuente: MINEDEC GeoAnalytics • 10 Mar 2026</span>
          </div>
          <h4 className="text-sm font-bold text-foreground">Incremento de vulnerabilidad por lluvias en Zona 3</h4>
          <p className="text-xs text-foreground/80 leading-relaxed font-sans">
            El análisis cruzado entre precipitaciones intensas y pendientes del terreno identifica 24 instituciones educativas con riesgo moderado de escorrentía superficial. Se sugiere revisión técnica preventiva.
          </p>
        </div>
      </SubSection>

    </div>
  );
}
