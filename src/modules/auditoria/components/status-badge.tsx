"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert, Sparkles, User, Settings, Key, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  const norm = status.toLowerCase().trim();

  // Éxito / Exitoso / Activo
  if (norm === "exitoso" || norm === "éxito" || norm === "activo" || norm === "alta") {
    return (
      <Badge
        variant="success"
        appearance="soft"
        size={size}
        className={cn("gap-1 font-medium", className)}
      >
        <CheckCircle2 className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  // Fallido / Error / Bloqueado
  if (norm === "fallido" || norm === "error" || norm === "bloqueado" || norm === "eliminación") {
    return (
      <Badge
        variant="danger"
        appearance="soft"
        size={size}
        className={cn("gap-1 font-medium", className)}
      >
        <XCircle className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  // Requiere revisión / Advertencia / Media
  if (
    norm.includes("revisión") ||
    norm === "pendiente" ||
    norm === "advertencia" ||
    norm === "media"
  ) {
    return (
      <Badge
        variant="warning"
        appearance="soft"
        size={size}
        className={cn("gap-1 font-medium", className)}
      >
        <AlertTriangle className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  // Baja / Inactivo / Sin actividad
  if (norm === "inactivo" || norm === "baja" || norm === "sin actividad") {
    return (
      <Badge
        variant="neutral"
        appearance="soft"
        size={size}
        className={cn("gap-1 font-medium text-muted-foreground", className)}
      >
        <Clock className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  // Tipos de Acción
  if (norm === "creación") {
    return (
      <Badge
        variant="primary"
        appearance="soft"
        size={size}
        className={cn("gap-1 font-medium", className)}
      >
        <Sparkles className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  if (norm.includes("rol") || norm.includes("asignación")) {
    return (
      <Badge
        variant="secondary"
        appearance="soft"
        size={size}
        className={cn("gap-1 font-medium", className)}
      >
        <Key className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  if (norm === "modificación" || norm.includes("cambio")) {
    return (
      <Badge
        variant="neutral"
        appearance="outline"
        size={size}
        className={cn("gap-1 font-medium", className)}
      >
        <Settings className="size-3 shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="neutral"
      appearance="soft"
      size={size}
      className={cn("font-medium", className)}
    >
      <span>{status}</span>
    </Badge>
  );
}
