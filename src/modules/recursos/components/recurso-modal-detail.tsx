"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FolderTree,
  ShieldCheck,
  Edit,
  Check,
  X,
  Users,
  Calendar,
  Layers,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  AppWindow,
  Info,
  ShieldAlert,
} from "lucide-react";
import {
  RecursoItem,
  mockRolesPorRecurso,
  RolAsociadoRecurso,
} from "../data/recursos-data";
import { cn } from "@/lib/utils";

interface RecursoModalDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recurso: RecursoItem | null;
  onEdit: (recurso: RecursoItem) => void;
}

function getAppIcon(appIdOrIcon?: string) {
  switch (appIdOrIcon?.toLowerCase()) {
    case "gestion-docente":
    case "graduationcap":
      return GraduationCap;
    case "talento-humano":
    case "briefcase":
      return Briefcase;
    case "sige":
    case "bookopen":
      return BookOpen;
    case "sso-conecta":
    case "keyround":
      return KeyRound;
    case "geoportal":
    case "mappin":
      return MapPin;
    case "sae":
    case "layers":
      return Layers;
    default:
      return AppWindow;
  }
}

export function RecursoModalDetail({
  open,
  onOpenChange,
  recurso,
  onEdit,
}: RecursoModalDetailProps) {
  if (!recurso) return null;

  const rolesAsociados: RolAsociadoRecurso[] = mockRolesPorRecurso[recurso.id] || [];
  const isActivo = recurso.estado === "Activo";
  const AppIcon = getAppIcon(recurso.aplicacionIcono || recurso.aplicacionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-zinc-950"
      >
        <TooltipProvider delayDuration={150}>
          {/* HEADER */}
          <DialogHeader className="px-6 py-5 border-b border-border bg-white dark:bg-zinc-950 shrink-0 text-left">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning-700 dark:text-warning-300 shrink-0">
                  <FolderTree className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
                    Detalle del recurso
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Información técnica, aplicación contenedora y roles con permisos asignados.
                  </DialogDescription>
                </div>
              </div>

              <Badge
                tone={isActivo ? "success" : "neutral"}
                appearance="soft"
                size="md"
                className="text-xs font-semibold px-2.5 py-0.5"
              >
                {recurso.estado}
              </Badge>
            </div>
          </DialogHeader>

          {/* BODY */}
          <div className="px-6 py-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-zinc-950">
            {/* Panel de Metadatos del Recurso */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Nombre */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Nombre del recurso
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {recurso.nombre}
                  </p>
                </div>

                {/* Código */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Código / Identificador
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold bg-warning/10 text-warning-800 dark:text-warning-300 px-2 py-0.5 rounded border border-warning/20">
                      {recurso.codigo}
                    </span>
                  </div>
                </div>

                {/* Aplicación Asociada */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Aplicación asociada
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="size-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <AppIcon className="size-3" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {recurso.aplicacionNombre}
                    </span>
                    <Badge
                      tone="primary"
                      appearance="soft"
                      size="sm"
                      className="font-mono text-[10px] px-1 py-0"
                    >
                      {recurso.aplicacionCodigo}
                    </Badge>
                  </div>
                </div>

                {/* Roles con acceso */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Roles con acceso
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {rolesAsociados.length}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      {rolesAsociados.length === 1 ? "rol configurado" : "roles configurados"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <div className="pt-3 border-t border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Descripción
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {recurso.descripcion || "No se ha registrado una descripción detallada para este recurso."}
                </p>
              </div>

              {/* Fechas */}
              <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-muted-foreground/70" />
                  <span>Fecha de creación: <strong>{recurso.fechaCreacion}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-muted-foreground/70" />
                  <span>Última actualización: <strong>{recurso.ultimaActualizacion}</strong></span>
                </div>
              </div>
            </div>

            {/* SECCIÓN: Roles Asociados */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-heading font-semibold text-foreground">
                    Roles asociados y matriz de permisos
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permisos granulares configurados en la arquitectura para este recurso
                </p>
              </div>

              {rolesAsociados.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center flex flex-col items-center justify-center gap-2.5 bg-muted/10">
                  <div className="size-10 rounded-full bg-warning/10 text-warning-700 dark:text-warning-400 flex items-center justify-center">
                    <ShieldAlert className="size-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Sin roles asociados todavía
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Este recurso está creado en el catálogo pero ningún rol tiene permisos asignados sobre él. Puedes asignar permisos a roles desde el módulo de <strong>Gestión de Roles</strong>.
                  </p>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden bg-surface">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="min-w-[200px] text-xs font-semibold pl-4">
                          Rol asociado
                        </TableHead>
                        <TableHead className="w-[140px] text-xs font-semibold text-left">
                          Usuarios
                        </TableHead>
                        <TableHead className="w-[85px] text-center text-xs font-semibold">
                          Ver
                        </TableHead>
                        <TableHead className="w-[85px] text-center text-xs font-semibold">
                          Crear
                        </TableHead>
                        <TableHead className="w-[85px] text-center text-xs font-semibold">
                          Editar
                        </TableHead>
                        <TableHead className="w-[85px] text-center text-xs font-semibold pr-4">
                          Eliminar
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rolesAsociados.map((rol) => {
                        const { ver, crear, editar, eliminar } = rol.permisos;

                        return (
                          <TableRow key={rol.rolId} className="hover:bg-muted/30 transition-colors">
                            {/* Rol */}
                            <TableCell className="pl-4 py-3">
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-xs text-foreground">
                                  {rol.rolNombre}
                                </span>
                                {rol.rolDescripcion && (
                                  <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[280px]">
                                    {rol.rolDescripcion}
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            {/* Usuarios */}
                            <TableCell className="py-3 text-left">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Users className="size-3 text-muted-foreground/70" />
                                <span>{rol.usuariosCount} usuarios</span>
                              </div>
                            </TableCell>

                            {/* Permiso: Ver */}
                            <TableCell className="py-3 text-center">
                              {ver ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-success/15 text-success-700 dark:text-success-300">
                                      <Check className="size-3.5 stroke-[2.5]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Ver: Habilitado</TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-muted-foreground">
                                      <X className="size-3 stroke-[2]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Ver: Denegado</TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>

                            {/* Permiso: Crear */}
                            <TableCell className="py-3 text-center">
                              {crear ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-success/15 text-success-700 dark:text-success-300">
                                      <Check className="size-3.5 stroke-[2.5]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Crear: Habilitado</TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-muted-foreground">
                                      <X className="size-3 stroke-[2]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Crear: Denegado</TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>

                            {/* Permiso: Editar */}
                            <TableCell className="py-3 text-center">
                              {editar ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-success/15 text-success-700 dark:text-success-300">
                                      <Check className="size-3.5 stroke-[2.5]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Editar: Habilitado</TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-muted-foreground">
                                      <X className="size-3 stroke-[2]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Editar: Denegado</TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>

                            {/* Permiso: Eliminar */}
                            <TableCell className="py-3 text-center pr-4">
                              {eliminar ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-success/15 text-success-700 dark:text-success-300">
                                      <Check className="size-3.5 stroke-[2.5]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Eliminar: Habilitado</TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-muted-foreground">
                                      <X className="size-3 stroke-[2]" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Permiso Eliminar: Denegado</TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Banner de ayuda arquitectónica */}
            <div className="rounded-lg border border-border bg-muted/15 p-3 flex items-start gap-2.5">
              <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Para asociar este recurso a un nuevo rol o modificar sus permisos (ver, crear, editar, eliminar), ingrese al módulo de <strong>Roles</strong> y edite el rol correspondiente seleccionando este recurso dentro de su matriz de accesos.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-white dark:bg-zinc-950 shrink-0 flex items-center justify-between">
            <Button
              type="button"
              variant="neutral"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cerrar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onOpenChange(false);
                onEdit(recurso);
              }}
              className="gap-2 text-xs"
            >
              <Edit className="size-3.5" />
              <span>Editar recurso</span>
            </Button>
          </DialogFooter>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

