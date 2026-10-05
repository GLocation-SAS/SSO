"use client";

import React from "react";
import { SubSection } from "./sub-section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/ui/data-display";
import { ShieldAlert, AlertTriangle, TrendingUp, TrendingDown, Minus, Sparkles, Lightbulb, CheckCircle2, BarChart3, PieChart, LineChart as LineChartIcon, HelpCircle, Clock, Building2, FileText, AlertOctagon, BarChart2, Info, ArrowUpRight } from "lucide-react";




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
        <SubSection icon={PieChart} id="charts-group" title="Bar, Donut, Line Chart & Chart Tooltip" description="Representación visual de gráficos analíticos con leyendas e interacción." registerSection={registerSection}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bar Chart Mock */}
            <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" /> Bar Chart (Por Zona)
                </span>
                <Badge variant="neutral" appearance="soft">2026</Badge>
              </div>
              <div className="h-40 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-border/60">
                <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all h-[40%] relative group">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</span>
                </div>
                <div className="flex-1 bg-primary/40 hover:bg-primary/60 rounded-t-lg transition-all h-[75%] relative group">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">75%</span>
                </div>
                <div className="flex-1 bg-primary hover:bg-primary-600 rounded-t-lg transition-all h-[90%] relative group">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</span>
                </div>
                <div className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t-lg transition-all h-[55%] relative group">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">55%</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                <span>Zona 1</span><span>Zona 2</span><span>Zona 3</span><span>Zona 4</span>
              </div>
            </div>

            {/* Donut Chart Mock */}
            <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <PieChart className="size-4 text-secondary" /> Donut Chart
                </span>
                <Badge variant="neutral" appearance="soft">Porcentaje</Badge>
              </div>
              <div className="h-40 flex items-center justify-center relative">
                <div className="size-28 rounded-full border-[12px] border-primary border-t-warning border-r-danger flex items-center justify-center">
                  <span className="text-xs font-black text-foreground">100%</span>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> Bajo (50%)</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-warning" /> Medio (30%)</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-danger" /> Alto (20%)</span>
              </div>
            </div>

            {/* Line Chart Mock */}
            <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <LineChartIcon className="size-4 text-info" /> Line Chart (Evolución)
                </span>
                <Badge variant="neutral" appearance="soft">Trimestral</Badge>
              </div>
              <div className="h-40 flex items-end justify-between relative border-b border-l border-border/80 p-2">
                <div className="absolute inset-x-2 bottom-6 top-6 flex items-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-info/30 via-info to-primary rounded-full relative">
                    <span className="size-3 rounded-full bg-info absolute left-1/4 -top-1 border-2 border-background" />
                    <span className="size-3 rounded-full bg-info absolute left-2/4 -top-3 border-2 border-background" />
                    <span className="size-3 rounded-full bg-primary absolute left-3/4 top-1 border-2 border-background" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span>
              </div>
            </div>
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
