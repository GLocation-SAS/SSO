import * as React from "react";
import { BadgeTone, BadgeAppearance } from "@/components/ui/badge";

export interface RoleBadgeStyle {
  tone: BadgeTone;
  appearance: BadgeAppearance;
  className?: string;
}

/**
 * Mapeo semántico de roles a estilos y variantes de Badge para diferenciarlos visualmente.
 */
export function getRoleBadgeStyle(rol: string): RoleBadgeStyle {
  const r = rol.toLowerCase();

  // Super Administrador / Administrador: Tono primario o secundario con estilo destacado
  if (r.includes("super admin")) {
    return {
      tone: "primary",
      appearance: "solid",
      className: "shadow-xs tracking-wide",
    };
  }
  if (r.includes("admin")) {
    return {
      tone: "primary",
      appearance: "soft",
      className: "border border-primary/30 font-semibold",
    };
  }

  // Jefatura / Directores / Coordinadores: Tono secondary / violeta institucional
  if (r.includes("jefe") || r.includes("director") || r.includes("coordinador")) {
    return {
      tone: "secondary",
      appearance: "soft",
      className: "border border-secondary/30 font-semibold",
    };
  }

  // Auditoría / Seguridad / Control / Revisor: Tono warning o amber
  if (r.includes("auditor") || r.includes("seguridad") || r.includes("control") || r.includes("revisor")) {
    return {
      tone: "warning",
      appearance: "soft",
      className: "border border-warning/30 font-semibold",
    };
  }

  // Analistas / Especialistas / Planificación / SIG: Tono info / cyan-azul
  if (r.includes("analista") || r.includes("especialista") || r.includes("planificaci") || r.includes("sig")) {
    return {
      tone: "info",
      appearance: "soft",
      className: "border border-info/30 font-semibold",
    };
  }

  // Docentes / Pedagógicos / Evaluadores: Tono success / esmeralda
  if (r.includes("docente") || r.includes("pedag") || r.includes("evaluador")) {
    return {
      tone: "success",
      appearance: "soft",
      className: "border border-success/30 font-semibold",
    };
  }

  // Financiero / Contratos: Tono neutral solid o outline sobrio
  if (r.includes("financier") || r.includes("contrato")) {
    return {
      tone: "neutral",
      appearance: "outline",
      className: "border-border/80 text-foreground font-semibold bg-muted/20",
    };
  }

  // Operadores / Mesa de ayuda / Soporte / Trámites / Técnico: Tono neutral soft o info outline
  if (r.includes("soporte") || r.includes("mesa") || r.includes("operador") || r.includes("trámite") || r.includes("tramite")) {
    return {
      tone: "neutral",
      appearance: "soft",
      className: "font-semibold",
    };
  }

  // Fallback default
  return {
    tone: "neutral",
    appearance: "soft",
    className: "font-medium",
  };
}
