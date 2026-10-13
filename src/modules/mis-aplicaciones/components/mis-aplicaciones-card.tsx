"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDecorativeIcon,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  School,
  Users,
  Headphones,
  FileText,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
  FolderTree,
} from "lucide-react";
import { MisAplicacionItem } from "../data/mis-aplicaciones-data";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  GraduationCap,
  School,
  Users,
  Headphones,
  FileText,
  Shield: ShieldCheck,
  ShieldCheck,
};

const COLOR_MAP = {
  primary: "bg-primary/10 text-primary border-primary/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
  purple: "bg-primary-300/15 text-primary-600 dark:text-primary-300 border-primary-300/30",
};

interface MisAplicacionesCardProps {
  app: MisAplicacionItem;
  onOpenApp: (app: MisAplicacionItem) => void;
  onViewRecursos: (app: MisAplicacionItem) => void;
}

export function MisAplicacionesCard({
  app,
  onOpenApp,
  onViewRecursos,
}: MisAplicacionesCardProps) {
  const IconComponent = ICON_MAP[app.icono as keyof typeof ICON_MAP] || GraduationCap;
  const colorClass = COLOR_MAP[app.colorTone] || COLOR_MAP.primary;

  return (
    <Card variant="panel" className="flex flex-col h-full rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 group overflow-hidden text-left">
      <CardHeader className="p-5 pb-3 items-start text-left w-full space-y-2">
        {/* Cabecera: Icono a la izquierda, Título y Badges juntos a la derecha del icono */}
        <div className="flex items-center gap-3 w-full">
          <div
            className={cn(
              "size-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
              colorClass
            )}
          >
            <IconComponent className="size-4.5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1 text-left">
            <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors text-left leading-snug">
              {app.nombre}
            </CardTitle>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge appearance="outline" tone="neutral" className="font-mono text-[10px] px-1.5 py-0 h-5">
                {app.codigo}
              </Badge>
              <Badge
                appearance="soft"
                tone={app.estado === "Activa" ? "success" : "neutral"}
                className={cn(
                  "text-[10px] font-semibold border px-1.5 py-0 h-5",
                  app.estado === "Activa"
                    ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                    : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                )}
              >
                {app.estado}
              </Badge>
            </div>
          </div>
        </div>

        {/* Descripción completa abajo alineada a la izquierda */}
        <CardDescription className="text-xs text-muted-foreground text-left leading-relaxed">
          {app.descripcion}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 pb-4 space-y-3 flex-1 flex flex-col justify-end text-left">
        {/* Jerarquía: Sede & Rol */}
        <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary dark:text-primary-300 shrink-0" />
              Sede:
            </span>
            <span className="font-semibold text-foreground truncate max-w-[170px]" title={app.sede.nombre}>
              {app.sede.nombre}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-secondary-600 dark:text-secondary-300 shrink-0" />
              Rol:
            </span>
            <span className="font-semibold text-foreground truncate max-w-[170px]" title={app.rol.nombre}>
              {app.rol.nombre}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground/70 shrink-0" />
              Último acceso:
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {app.ultimoAcceso}
            </span>
          </div>
        </div>

        {/* Recursos autorizados (información secundaria) */}
        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => onViewRecursos(app)}
            className="flex items-center gap-1.5 text-warning-700 hover:text-warning-800 dark:text-warning-400 dark:hover:text-warning-300 font-medium hover:underline outline-none transition-colors"
          >
            <FolderTree className="size-3.5 text-warning-600 dark:text-warning-400 shrink-0" />
            <span>{app.recursos.length} recursos asignados</span>
          </button>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-3 border-t border-border/60 bg-surface-subtle/30 flex flex-col gap-2 w-full">
        <Button
          type="button"
          variant="primary"
          size="default"
          className="w-full font-semibold shadow-xs"
          leftIcon={<ExternalLink className="size-4" />}
          onClick={() => onOpenApp(app)}
        >
          Abrir aplicación
        </Button>

        <Button
          type="button"
          variant="neutral"
          size="default"
          className="w-full font-semibold shadow-xs"
          onClick={() => onViewRecursos(app)}
        >
          Detalles
        </Button>
      </CardFooter>

      {/* Marca de agua decorativa sutil en esquina */}
      <CardDecorativeIcon className="opacity-[0.03] dark:opacity-[0.06] text-foreground right-2 -bottom-2 pointer-events-none z-0 group-hover:scale-105 transition-transform duration-300">
        <IconComponent className="size-28" />
      </CardDecorativeIcon>
    </Card>
  );
}
