"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AccesoPorFechaItem, PeriodoFiltro } from "../data/mi-dashboard-data";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessChartProps {
  data: AccesoPorFechaItem[];
  periodo: PeriodoFiltro;
}

export function AccessChart({ data, periodo }: AccessChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.accesos), 1);
  const totalAccesos = data.reduce((acc, curr) => acc + curr.accesos, 0);

  return (
    <Card className="rounded-2xl border-border bg-card flex flex-col h-full shadow-xs">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Accesos por fecha
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Frecuencia de ingresos federados en los últimos {periodo} días
              </CardDescription>
            </div>
          </div>
          <Badge appearance="soft" tone="primary" className="text-xs font-semibold">
            {totalAccesos} ingresos totales
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4 flex-1 flex flex-col justify-end">
        <ChartContainer minHeight={200} className="w-full relative flex flex-col justify-end">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            <div className="border-b border-border/40 w-full flex text-[10px] text-muted-foreground/60 font-mono -translate-y-1/2">
              <span className="w-6 text-right pr-1 bg-card">{maxVal}</span>
            </div>
            <div className="border-b border-border/40 w-full flex text-[10px] text-muted-foreground/60 font-mono -translate-y-1/2">
              <span className="w-6 text-right pr-1 bg-card">{Math.round(maxVal / 2)}</span>
            </div>
            <div className="border-b border-border/40 w-full flex text-[10px] text-muted-foreground/60 font-mono -translate-y-1/2">
              <span className="w-6 text-right pr-1 bg-card">0</span>
            </div>
          </div>

          {/* Barras interactivas */}
          <div className="relative h-44 w-full flex items-end justify-between gap-2 pl-8 pr-2 pb-6 z-10">
            {data.map((item, idx) => {
              const heightPct = Math.max((item.accesos / maxVal) * 100, 8);
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.fecha}
                  className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {isHovered && (
                    <ChartTooltip
                      active={true}
                      className="absolute -top-16 left-1/2 -translate-x-1/2 min-w-[160px] z-30"
                    >
                      <ChartTooltipContent
                        title={item.etiqueta}
                        label="Accesos registrados"
                        value={item.accesos}
                        subvalue={`Apps: ${item.appsPrincipales}`}
                      />
                    </ChartTooltip>
                  )}

                  <div className="w-full flex justify-center h-full items-end">
                    <div
                      className={cn(
                        "w-full max-w-[28px] rounded-t-md transition-all duration-200",
                        isHovered
                          ? "bg-primary scale-y-[1.03] shadow-md shadow-primary/20"
                          : "bg-primary/80 group-hover:bg-primary"
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-medium text-muted-foreground mt-2 truncate w-full text-center">
                    {item.fecha}
                  </span>
                </div>
              );
            })}
          </div>
        </ChartContainer>

        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="size-3.5 text-success" /> Mayor actividad en días laborables
          </span>
          <span className="font-mono text-[11px]">Sincronizado vía SSO</span>
        </div>
      </CardContent>
    </Card>
  );
}
