"use client";

import React from "react";
import { SubSection } from "./sub-section";
import { Badge, BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, Check, AlertTriangle, Info, X, CheckCircle2, Clock, Globe, Building2, Activity } from "lucide-react";




export function BadgeShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const tones: BadgeTone[] = ["primary", "secondary", "success", "warning", "danger", "info", "neutral"];

  return (
    <Card innerClassName="items-start text-left" className="p-8 rounded-xl shadow-lg border-border overflow-hidden space-y-10">
      {/* Header de Sección */}
      <div className="flex items-start gap-3.5 text-left pb-6">
        <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-h2 font-heading font-black text-foreground">Componentes de Estado: Badges</h2>
          <p className="text-muted-foreground text-sm mt-2">Indicadores visuales compactos para estados, categorías y etiquetas con soporte para variantes semánticas y estilos de contorno.</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Filled */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Relleno (Filled)</h3>
          <div className="flex flex-wrap gap-4 items-end">
            {tones.map((t) => (
              <Badge key={`filled-${t}`} tone={t} appearance="solid">
                {t === "danger" ? "Error" : t.charAt(0).toUpperCase() + t.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Outline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contorno (Outline)</h3>
          <div className="flex flex-wrap gap-4 items-end">
            {tones.map((t) => (
              <Badge key={`outline-${t}`} tone={t} appearance="outline">
                {t === "danger" ? "Error" : t.charAt(0).toUpperCase() + t.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* With icon */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Con Ícono</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <Badge tone="success" icon={<Check />}>Activo</Badge>
            <Badge tone="info" icon={<Info />}>Información</Badge>
            <Badge tone="warning" icon={<AlertTriangle />}>Advertencia</Badge>
            <Badge tone="danger" icon={<X />}>Error</Badge>
            <Badge tone="primary" icon={<CheckCircle2 />}>Completado</Badge>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tamaños</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <Badge tone="primary" size="sm">Pequeño</Badge>
            <Badge tone="primary" size="md">Mediano</Badge>
            <Badge tone="primary" size="lg">Grande</Badge>
          </div>
        </div>

        <div className="border-t border-border/60 pt-10" />

        {/* Ejemplos de uso */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ejemplos de uso</h3>
            <p className="text-xs text-muted-foreground italic mt-1">Casos reales de aplicación en el Geoportal MINEDEC.</p>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <Badge tone="success" appearance="soft" icon={<Check />}>Activo</Badge>
            <Badge tone="neutral" appearance="soft" icon={<X />}>Inactivo</Badge>
            
            <Badge tone="danger" appearance="solid" icon={<AlertTriangle />}>Riesgo alto</Badge>
            <Badge tone="warning" appearance="solid" icon={<AlertTriangle />}>Riesgo medio</Badge>
            <Badge tone="info" appearance="solid" icon={<Activity />}>Riesgo bajo</Badge>
            
            <Badge tone="warning" appearance="soft" icon={<Clock />}>Pendiente información oficial</Badge>
            <Badge tone="primary" appearance="outline" icon={<Activity />}>Procesando</Badge>
            <Badge tone="success" appearance="outline" icon={<CheckCircle2 />}>Completado</Badge>
            
            <Badge tone="secondary" appearance="soft" icon={<Globe />}>Público</Badge>
            <Badge tone="primary" appearance="solid" icon={<Building2 />}>Institucional</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

