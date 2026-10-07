"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AplicacionItem,
  mockHistorialCambios,
} from "../../data/aplicaciones-data";
import {
  Globe,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  FolderTree,
  History,
  CheckCircle2,
  FileCode,
  Layers,
} from "lucide-react";

interface TabResumenProps {
  aplicacion: AplicacionItem;
}

export function TabResumen({ aplicacion }: TabResumenProps) {
  const historial = mockHistorialCambios[aplicacion.id] || [
    {
      id: "hist-default",
      fecha: aplicacion.ultimaActualizacion,
      usuario: "Administrador del Sistema",
      accion: "Actualización de configuración",
      detalle: "Se sincronizaron los parámetros y credenciales de acceso institucional.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 2 Bloques Principales en Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BLOQUE 1: Información de la aplicación (2 columnas) */}
        <Card variant="panel" className="lg:col-span-2 border border-border bg-surface shadow-2xs">
          <CardHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2 text-primary">
              <Layers className="size-4.5" />
              <CardTitle className="text-base md:text-lg font-heading font-bold text-foreground">
                Información de la aplicación
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Metadatos institucionales y parámetros de conectividad.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-5">
            {/* Nombre y Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Nombre oficial
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {aplicacion.nombre}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Estado operativo
                </span>
                <div>
                  <Badge
                    tone={aplicacion.estado === "Activa" ? "success" : "neutral"}
                    appearance="soft"
                    size="sm"
                    className="font-semibold"
                  >
                    {aplicacion.estado}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Descripción
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3.5 rounded-lg border border-border/50">
                {aplicacion.descripcion}
              </p>
            </div>

            {/* URL de acceso */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                URL de acceso (Endpoint)
              </span>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="size-4 text-primary shrink-0" />
                  <span className="font-mono text-xs text-foreground truncate">
                    {aplicacion.urlAcceso}
                  </span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5 shrink-0"
                >
                  <a
                    href={aplicacion.urlAcceso}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Visitar</span>
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <span>
                  Creada:{" "}
                  <strong className="text-foreground font-medium">
                    {aplicacion.fechaCreacion}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Clock className="size-4 text-muted-foreground shrink-0" />
                <span>
                  Última sincronización:{" "}
                  <strong className="text-foreground font-medium">
                    {aplicacion.ultimaActualizacion}
                  </strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BLOQUE 2: Resumen de configuración (1 columna) */}
        <Card variant="panel" className="border border-border bg-surface shadow-2xs flex flex-col justify-between">
          <CardHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2 text-primary">
              <FileCode className="size-4.5" />
              <CardTitle className="text-base md:text-lg font-heading font-bold text-foreground">
                Resumen de configuración
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Estructura de accesos habilitados en esta aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            {/* Métrica 1: Usuarios con acceso */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Users className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Usuarios con acceso
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Vinculados por sede y rol activo
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold font-heading text-foreground">
                {aplicacion.usuariosCount.toLocaleString("es-EC")}
              </span>
            </div>

            {/* Métrica 2: Roles configurados */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-info/15 text-info flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Roles configurados
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Perfiles específicos de la app
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold font-heading text-foreground">
                {aplicacion.rolesCount}
              </span>
            </div>

            {/* Métrica 3: Recursos configurados */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-warning/15 text-warning-700 dark:text-warning-300 flex items-center justify-center shrink-0">
                  <FolderTree className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Recursos configurados
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Vistas, módulos y endpoints
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold font-heading text-foreground">
                {aplicacion.recursosCount}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN: Últimos cambios (Auditoría / Timeline) */}
      <Card variant="panel" className="border border-border bg-surface shadow-2xs">
        <CardHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <History className="size-4.5" />
              <CardTitle className="text-base font-heading font-bold text-foreground">
                Últimos cambios
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              Registro histórico de modificaciones de seguridad
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
            {historial.map((item) => (
              <div key={item.id} className="relative flex flex-col gap-1 text-sm">
                <div className="absolute -left-6 top-1 size-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground text-xs">
                    {item.accion}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-medium text-primary">
                    {item.usuario}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-[11px] text-muted-foreground">
                    {item.fecha}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.detalle}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

