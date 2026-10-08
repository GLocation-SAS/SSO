"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveCard } from "@/components/ui/data-display";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  ShieldCheck,
  Users,
  FolderTree,
  Edit,
  Check,
  X,
  CornerDownRight,
  Folder,
  Layers,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  Calendar,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  RolItem,
  RecursoAppItem,
  mockRecursosPorAppParaRoles,
} from "../data/roles-data";
import { cn } from "@/lib/utils";

interface RolModalDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rol: RolItem | null;
  onEdit: (rol: RolItem) => void;
}

const getAppIcon = (code?: string) => {
  switch (code) {
    case "SGD":
      return GraduationCap;
    case "TH":
      return Briefcase;
    case "SIGE":
      return BookOpen;
    case "SSO":
      return KeyRound;
    case "GEO":
      return MapPin;
    default:
      return Layers;
  }
};

export function RolModalDetail({
  open,
  onOpenChange,
  rol,
  onEdit,
}: RolModalDetailProps) {
  const [expandedPadres, setExpandedPadres] = React.useState<string[]>([]);

  if (!rol) return null;

  const isActivo = rol.estado === "Activo";
  const appResources = mockRecursosPorAppParaRoles[rol.aplicacionId] || [];

  const toggleExpand = (id: string) => {
    setExpandedPadres((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Mapear recursos que tienen acceso
  const activeResourcesWithPermissions = rol.recursosAsignados
    .filter((r) => r.acceso)
    .map((assigned) => {
      const def = appResources.find((r) => r.id === assigned.recursoId);
      return {
        id: assigned.recursoId,
        nombre: def?.nombre || assigned.recursoId,
        descripcion: def?.descripcion || "",
        nivel: def?.nivel || 0,
        padreNombre: def?.padreNombre || null,
        permisos: assigned.permisos,
      };
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="3xl"
        className="p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden bg-surface"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 text-left">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-heading font-bold text-primary">
                    Detalle del rol
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Consulta de configuración institucional, alcance y matriz de permisos por recurso.
                  </p>
                </div>
              </div>
            </div>

            {/* Acción visible para editar el rol */}
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                onOpenChange(false);
                onEdit(rol);
              }}
              className="text-xs gap-1.5 h-8 font-medium"
            >
              <Edit className="size-3.5 text-primary" />
              <span>Editar rol</span>
            </Button>
          </div>
        </DialogHeader>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Card Resumen del Rol */}
          <InteractiveCard
            hideChevron
            color="primary"
            className="cursor-default border-border/70"
            borderless={false}
            shadowless={true}
            decorativeIcon={React.createElement(getAppIcon(rol.aplicacionCodigo), { className: "size-full" })}
            rightElement={
              <div className="flex flex-col items-end gap-1.5">
                <Badge
                  tone={isActivo ? "success" : "neutral"}
                  appearance="soft"
                  size="sm"
                  className="font-semibold text-xs px-2.5 py-0.5"
                >
                  {rol.estado}
                </Badge>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  Actualizado: {rol.ultimaActualizacion}
                </span>
              </div>
            }
          >
            <div className="flex flex-col gap-1.5 mt-0.5 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  {rol.nombre}
                </h3>
                <Badge
                  tone="primary"
                  appearance="soft"
                  size="sm"
                  className="font-mono text-[10px] px-2 py-0"
                >
                  {rol.aplicacionCodigo} · {rol.aplicacionNombre}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground max-w-2xl">
                {rol.descripcion || "Sin descripción proporcionada para este rol."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  <strong className="text-foreground">{rol.usuariosCount}</strong> usuarios asignados
                </span>
                <span className="flex items-center gap-1.5">
                  <FolderTree className="size-3.5 text-info" />
                  <strong className="text-foreground">
                    {activeResourcesWithPermissions.length}
                  </strong>{" "}
                  recursos vinculados
                </span>
              </div>
            </div>
          </InteractiveCard>

          {/* Matriz de Permisos Configurados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Recursos vinculados y permisos configurados
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permisos efectivos asignados a este rol dentro de{" "}
                  <strong className="text-foreground">{rol.aplicacionNombre}</strong>.
                </p>
              </div>
              <Badge tone="info" appearance="soft" size="sm">
                {activeResourcesWithPermissions.length} de {appResources.length} recursos
              </Badge>
            </div>

            {activeResourcesWithPermissions.length === 0 ? (
              <div className="border border-border/80 rounded-xl p-8 bg-muted/20 flex flex-col items-center justify-center gap-2 text-center">
                <div className="size-10 rounded-full bg-warning/15 text-warning-700 flex items-center justify-center">
                  <AlertTriangle className="size-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Sin recursos ni permisos configurados
                </p>
                <p className="text-xs text-muted-foreground max-w-md">
                  Este rol aún no tiene acceso asignado a ningún módulo o recurso de{" "}
                  {rol.aplicacionNombre}. Haz clic en «Editar rol» para configurar su matriz de permisos.
                </p>
                <Button
                  variant="primary"
                  size="default"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(rol);
                  }}
                  className="mt-2 text-xs gap-1.5"
                >
                  <Edit className="size-3.5" />
                  <span>Editar rol</span>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[340px] text-xs font-bold pl-4">
                      Recurso
                    </TableHead>
                    <TableHead className="w-[100px] text-center text-xs font-bold">
                      Acceso
                    </TableHead>
                    <TableHead className="w-[90px] text-center text-xs font-bold">
                      Ver
                    </TableHead>
                    <TableHead className="w-[90px] text-center text-xs font-bold">
                      Crear
                    </TableHead>
                    <TableHead className="w-[90px] text-center text-xs font-bold">
                      Editar
                    </TableHead>
                    <TableHead className="w-[90px] text-center text-xs font-bold pr-4">
                      Eliminar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const rootResources = activeResourcesWithPermissions.filter(r => r.nivel === 0);
                    const childResourcesByPadreNombre = activeResourcesWithPermissions.filter(r => r.nivel > 0).reduce((acc, r) => {
                      const pName = r.padreNombre || "Desconocido";
                      if (!acc[pName]) acc[pName] = [];
                      acc[pName].push(r);
                      return acc;
                    }, {} as Record<string, typeof activeResourcesWithPermissions>);

                    return rootResources.map((rootItem) => {
                      const children = childResourcesByPadreNombre[rootItem.nombre] || [];
                      const hasChildren = children.length > 0;
                      const isExpanded = expandedPadres.includes(rootItem.id);

                      return (
                        <React.Fragment key={rootItem.id}>
                          <TableRow
                            className={cn(
                              "border-l-4 border-l-primary hover:bg-muted/40 transition-colors",
                              isExpanded ? "bg-muted/30" : "bg-muted/10"
                            )}
                          >
                            <TableCell className="pl-4 py-2.5">
                              <div className="flex items-start gap-2.5">
                                <div className="flex items-center gap-1.5">
                                  {hasChildren ? (
                                    <TooltipProvider delayDuration={150}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => toggleExpand(rootItem.id)}
                                            className="size-6 p-0 rounded-md hover:bg-primary/20 text-primary transition-transform duration-300 shrink-0 mt-0.5"
                                          >
                                            <ChevronRight className={cn("size-4 transition-transform duration-300", isExpanded && "rotate-90")} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          <p className="text-xs">Desplegar acciones y submódulos</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ) : (
                                    <div className="size-6 shrink-0 mt-0.5"></div>
                                  )}
                                  <Folder className="size-4 text-primary shrink-0 mt-0.5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-foreground">
                                    {rootItem.nombre}
                                  </span>
                                  {rootItem.descripcion && (
                                    <TooltipProvider delayDuration={150}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="text-[11px] text-muted-foreground line-clamp-1 cursor-help">
                                            {rootItem.descripcion}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs" variant="info">
                                          <p>{rootItem.descripcion}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-center py-2.5">
                              <Badge
                                tone="success"
                                appearance="soft"
                                size="sm"
                                className="font-medium text-[10px] px-1.5 py-0"
                              >
                                Habilitado
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center py-2.5">
                              <div className="flex justify-center items-center">
                                {rootItem.permisos.ver ? (
                                  <span className="size-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                                    <Check className="size-3" />
                                  </span>
                                ) : (
                                  <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                    <X className="size-3" />
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-center py-2.5">
                              <div className="flex justify-center items-center">
                                {rootItem.permisos.crear ? (
                                  <span className="size-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                                    <Check className="size-3" />
                                  </span>
                                ) : (
                                  <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                    <X className="size-3" />
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-center py-2.5">
                              <div className="flex justify-center items-center">
                                {rootItem.permisos.editar ? (
                                  <span className="size-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                                    <Check className="size-3" />
                                  </span>
                                ) : (
                                  <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                    <X className="size-3" />
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="text-center py-2.5 pr-4">
                              <div className="flex justify-center items-center">
                                {rootItem.permisos.eliminar ? (
                                  <span className="size-5 rounded-full bg-danger/15 text-danger flex items-center justify-center">
                                    <Check className="size-3" />
                                  </span>
                                ) : (
                                  <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                    <X className="size-3" />
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>

                          {isExpanded && children.map(childItem => (
                            <TableRow
                              key={childItem.id}
                              className="hover:bg-muted/40 transition-colors bg-surface"
                            >
                              <TableCell className="pl-4 py-2.5">
                                <div className="flex items-start gap-2 pl-6">
                                  <CornerDownRight className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-foreground">
                                      {childItem.nombre}
                                    </span>
                                    {childItem.descripcion && (
                                      <TooltipProvider delayDuration={150}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="text-[11px] text-muted-foreground line-clamp-1 cursor-help">
                                              {childItem.descripcion}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="max-w-xs" variant="info">
                                            <p>{childItem.descripcion}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="text-center py-2.5">
                                <Badge
                                  tone="success"
                                  appearance="soft"
                                  size="sm"
                                  className="font-medium text-[10px] px-1.5 py-0"
                                >
                                  Habilitado
                                </Badge>
                              </TableCell>

                              <TableCell className="text-center py-2.5">
                                <div className="flex justify-center items-center">
                                  {childItem.permisos.ver ? (
                                    <span className="size-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                                      <Check className="size-3" />
                                    </span>
                                  ) : (
                                    <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                      <X className="size-3" />
                                    </span>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="text-center py-2.5">
                                <div className="flex justify-center items-center">
                                  {childItem.permisos.crear ? (
                                    <span className="size-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                                      <Check className="size-3" />
                                    </span>
                                  ) : (
                                    <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                      <X className="size-3" />
                                    </span>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="text-center py-2.5">
                                <div className="flex justify-center items-center">
                                  {childItem.permisos.editar ? (
                                    <span className="size-5 rounded-full bg-success/15 text-success flex items-center justify-center">
                                      <Check className="size-3" />
                                    </span>
                                  ) : (
                                    <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                      <X className="size-3" />
                                    </span>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="text-center py-2.5 pr-4">
                                <div className="flex justify-center items-center">
                                  {childItem.permisos.eliminar ? (
                                    <span className="size-5 rounded-full bg-danger/15 text-danger flex items-center justify-center">
                                      <Check className="size-3" />
                                    </span>
                                  ) : (
                                    <span className="size-5 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center">
                                      <X className="size-3" />
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-end w-full">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="neutral"
              size="default"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cerrar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={() => {
                onEdit(rol);
              }}
              className="text-xs gap-1.5"
            >
              <Edit className="size-3.5" />
              <span>Editar rol</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
