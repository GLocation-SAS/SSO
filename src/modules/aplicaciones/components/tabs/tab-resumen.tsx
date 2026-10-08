"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveCard } from "@/components/ui/data-display";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AplicacionItem,
} from "../../data/aplicaciones-data";
import { Link } from "@/routing";
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
  AlertTriangle,
  ArrowRight,
  Settings,
  ShieldAlert,
} from "lucide-react";

interface TabResumenProps {
  aplicacion: AplicacionItem;
  onNavigateTab: (tab: string) => void;
}

export function TabResumen({ aplicacion, onNavigateTab }: TabResumenProps) {
  // Datos dummy coherentes
  const historial = [
    {
      id: "h1",
      fecha: "05/10/2026 · 02:32 PM",
      usuario: "Paula",
      accion: "Permisos del rol Administrador actualizados",
      detalle: "Se habilitaron nuevos endpoints para Gestión de Contratos.",
    },
    {
      id: "h2",
      fecha: "04/10/2026 · 11:15 AM",
      usuario: "Administrador",
      accion: "Nuevo recurso asociado: Acciones de personal",
      detalle: "Recurso sincronizado desde el catálogo central.",
    },
    {
      id: "h3",
      fecha: "03/10/2026 · 09:40 AM",
      usuario: "Administrador",
      accion: "Rol Jefe de Talento Humano actualizado",
      detalle: "Cambios en los permisos de Registro Docente.",
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* SECCIÓN 1: Información general y Estado de configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Información general (modo consulta) */}
        <div className="xl:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Información general
          </h3>
          <div className="rounded-xl border border-border bg-white dark:bg-zinc-950 p-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Nombre</span>
                <span className="text-sm text-foreground font-medium">{aplicacion.nombre}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Código</span>
                <span className="text-sm font-mono text-foreground font-medium">{aplicacion.codigo}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estado</span>
                <div>
                  <Badge tone={aplicacion.estado === "Activa" ? "success" : "neutral"} appearance="soft" size="sm" className="font-semibold">
                    {aplicacion.estado}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">URL de acceso</span>
                <a href={aplicacion.urlAcceso} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                  <Globe className="size-3.5" />
                  {aplicacion.urlAcceso}
                  <ExternalLink className="size-3 text-muted-foreground" />
                </a>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descripción</span>
                <span className="text-sm text-foreground">{aplicacion.descripcion}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>Creación: <strong className="text-foreground font-medium">{aplicacion.fechaCreacion}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span>Actualización: <strong className="text-foreground font-medium">{aplicacion.ultimaActualizacion}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de configuración */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Estado de configuración
          </h3>
          <div className="rounded-xl border border-border bg-white dark:bg-zinc-950 p-6 flex flex-col items-center justify-center text-center gap-4 h-[calc(100%-28px)]">
            {aplicacion.requiereAtencion ? (
              <>
                <div className="size-12 rounded-full bg-warning/15 text-warning-600 flex items-center justify-center mb-1">
                  <ShieldAlert className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-heading font-bold text-foreground">Requiere atención</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Existen incidencias en la configuración de accesos y recursos.
                  </p>
                </div>
                <Button variant="warning" size="sm" className="mt-2" onClick={() => onNavigateTab("roles")}>
                  <Settings className="size-3.5 mr-1.5" />
                  Revisar configuración
                </Button>
              </>
            ) : (
              <>
                <div className="size-12 rounded-full bg-success/15 text-success-600 flex items-center justify-center mb-1">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-heading font-bold text-foreground">Configuración completa</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    La aplicación cuenta con todos los parámetros operativos y de seguridad.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Accesos rápidos contextuales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InteractiveCard
          title="Usuarios"
          description="Usuarios con acceso habilitado"
          icon={<Users className="size-5" />}
          color="primary"
          hideChevron
          borderless
          shadowless
          onClick={() => onNavigateTab("usuarios")}
          rightElement={<span className="text-2xl font-bold font-heading tracking-tight mr-1">{aplicacion.usuariosCount.toLocaleString("es-EC")}</span>}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-2 cursor-pointer w-fit">
                Ver usuarios <ArrowRight className="size-3.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
              <p className="font-semibold">Ver usuarios</p>
              <p className="text-[11px] opacity-90">Te redirigirá a la pestaña de usuarios para administrar accesos.</p>
            </TooltipContent>
          </Tooltip>
        </InteractiveCard>

        <InteractiveCard
          title="Roles"
          description="Roles configurados para la app"
          icon={<ShieldCheck className="size-5" />}
          color="info"
          hideChevron
          borderless
          shadowless
          onClick={() => onNavigateTab("roles")}
          rightElement={<span className="text-2xl font-bold font-heading tracking-tight mr-1">{aplicacion.rolesCount}</span>}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-info mt-2 cursor-pointer w-fit">
                Ver roles <ArrowRight className="size-3.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
              <p className="font-semibold">Ver roles</p>
              <p className="text-[11px] opacity-90">Te redirigirá a la pestaña de roles para ver su configuración.</p>
            </TooltipContent>
          </Tooltip>
        </InteractiveCard>

        <InteractiveCard
          title="Recursos"
          description="Recursos habilitados y mapeados"
          icon={<FolderTree className="size-5" />}
          color="warning"
          hideChevron
          borderless
          shadowless
          onClick={() => onNavigateTab("recursos")}
          rightElement={<span className="text-2xl font-bold font-heading tracking-tight mr-1">{aplicacion.recursosCount}</span>}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-warning-700 mt-2 cursor-pointer w-fit">
                Ver recursos <ArrowRight className="size-3.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
              <p className="font-semibold">Ver recursos</p>
              <p className="text-[11px] opacity-90">Te redirigirá a la pestaña de recursos para ver asociaciones.</p>
            </TooltipContent>
          </Tooltip>
        </InteractiveCard>
      </div>

      {/* SECCIÓN 3: Alertas de configuración (Si requiere atención) */}
      {aplicacion.requiereAtencion && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="size-5" />
            <h4 className="font-bold font-heading text-sm">Requieren atención</h4>
          </div>
          <div className="mt-1 pl-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <ul className="list-disc list-inside text-sm space-y-1 text-warning-800 dark:text-warning-200">
              <li>El rol <strong>Consulta</strong> no tiene recursos asignados.</li>
              <li>3 usuarios tienen una asignación sin rol vigente.</li>
            </ul>
            <Button variant="warning" size="sm" onClick={() => onNavigateTab("roles")} className="shrink-0">
              Revisar configuración
            </Button>
          </div>
        </div>
      )}

      {/* SECCIÓN 4: Últimos cambios */}
      <div className="space-y-3 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Últimos cambios
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/auditoria/logs-gestion"
                className="group/audit inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground outline-none bg-transparent hover:bg-transparent cursor-pointer w-fit"
              >
                <span>Ver en Auditoría</span>
                <ArrowRight className="size-3 transition-transform duration-200 group-hover/audit:translate-x-1" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
              <p className="font-semibold">Ver en Auditoría</p>
              <p className="text-[11px] opacity-90">Te redirigirá al módulo de auditoría general del sistema.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="rounded-xl border border-border bg-white dark:bg-zinc-950 p-6">
          <div className="relative pl-12 space-y-8 before:absolute before:left-[11.5px] before:top-3 before:bottom-3 before:w-px before:bg-border/60">
            {historial.map((item, index) => (
              <div key={item.id} className="relative">
                {/* Icon */}
                {index === 0 ? (
                  <div className="absolute -left-[48px] top-0.5 size-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 z-10">
                    <CheckCircle2 className="size-3.5 text-white" />
                  </div>
                ) : (
                  <div className="absolute -left-[48px] top-0.5 size-6 rounded-full border-[1.5px] border-muted-foreground/40 bg-surface flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 z-10">
                    <Clock className="size-3 text-muted-foreground/60" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground/80 font-medium">
                      {item.fecha}
                    </span>
                    <span className="text-muted-foreground/60 text-[10px]">·</span>
                    <span className="text-[11px] text-primary font-medium">
                      {item.usuario}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-bold text-foreground leading-none">
                    {item.accion}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.detalle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
    </TooltipProvider>
  );
}

