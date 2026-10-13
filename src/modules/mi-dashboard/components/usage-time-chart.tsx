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
import { Clock, PieChart, Info } from "lucide-react";
import { TiempoPorAplicacionItem, PeriodoFiltro } from "../data/mi-dashboard-data";
import { cn } from "@/lib/utils";

interface UsageTimeChartProps {
  data: TiempoPorAplicacionItem[];
  periodo: PeriodoFiltro;
}

export function UsageTimeChart({ data, periodo }: UsageTimeChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalMinutos = data.reduce((acc, curr) => acc + curr.minutos, 0);
  const totalHorasFormatted = `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}m`;

  return (
    <Card className="rounded-2xl border-border bg-card flex flex-col h-full shadow-xs">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <Clock className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Tiempo de uso por aplicación
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Distribución de tiempo activo efectivo en los últimos {periodo} días
              </CardDescription>
            </div>
          </div>
          <Badge appearance="soft" tone="warning" className="text-xs font-semibold">
            {totalHorasFormatted} totales
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3 flex-1 flex flex-col justify-between space-y-4">
        {/* Barra segmentada horizontal combinada */}
        <div className="space-y-1.5">
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-muted p-0.5 border border-border/40">
            {data.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  width: `${item.porcentaje}%`,
                  backgroundColor: item.color,
                }}
                className={cn(
                  "h-full transition-all duration-200 cursor-pointer first:rounded-l-full last:rounded-r-full",
                  hoveredId && hoveredId !== item.id && "opacity-40",
                  hoveredId === item.id && "brightness-110 shadow-xs"
                )}
                title={`${item.nombre}: ${item.horas} (${item.porcentaje}%)`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span>0%</span>
            <span>100% de tiempo registrado</span>
          </div>
        </div>

        {/* Lista detallada de aplicaciones y horas */}
        <div className="space-y-3 pt-2">
          {data.map((item) => {
            const isHovered = hoveredId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "p-2.5 rounded-xl border border-border/60 transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer",
                  isHovered ? "bg-surface-subtle border-primary/40 shadow-xs" : "bg-card hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-foreground block truncate">
                      {item.nombre}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Código: {item.codigo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge appearance="outline" tone="neutral" className="font-mono text-xs font-semibold">
                    {item.horas}
                  </Badge>
                  <span className="text-xs font-bold text-foreground w-10 text-right">
                    {item.porcentaje}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Info className="size-3.5 text-primary shrink-0" />
          <span>Tiempo basado en interacciones registradas; no mide tiempo de inactividad.</span>
        </div>
      </CardContent>
    </Card>
  );
}
