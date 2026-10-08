"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Folder,
  FileCode,
  CornerDownRight,
  ChevronRight,
  Eye,
  CheckCheck,
  Eraser,
  Save,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import {
  AplicacionItem,
  AplicacionRol,
  mockMatrizPermisosPorRol,
  RolRecursoPermiso,
} from "../data/aplicaciones-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RolModalPermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rol: AplicacionRol | null;
  aplicacion: AplicacionItem | null;
}

export function RolModalPermissions({
  open,
  onOpenChange,
  rol,
  aplicacion,
}: RolModalPermissionsProps) {
  const [matriz, setMatriz] = React.useState<RolRecursoPermiso[]>([]);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [expandedPadres, setExpandedPadres] = React.useState<string[]>([]);

  const rootPermisos = matriz.filter((p) => !p.recursoPadre);
  const childPermisosByPadre = matriz.filter((p) => p.recursoPadre).reduce((acc, p) => {
    if (!acc[p.recursoPadre!]) acc[p.recursoPadre!] = [];
    acc[p.recursoPadre!].push(p);
    return acc;
  }, {} as Record<string, typeof matriz>);

  const toggleExpand = (nombre: string) => {
    setExpandedPadres((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre]
    );
  };

  React.useEffect(() => {
    if (rol) {
      const initialMatriz = mockMatrizPermisosPorRol[rol.id] || [
        {
          recursoId: "rec-1",
          recursoNombre: "Módulo Principal",
          permisos: { ver: true, crear: false, editar: false, eliminar: false },
        },
      ];
      setMatriz(JSON.parse(JSON.stringify(initialMatriz)));
      setHasChanges(false);
    }
  }, [rol, open]);

  if (!rol || !aplicacion) return null;

  const handleTogglePermiso = (
    recursoId: string,
    accion: keyof RolRecursoPermiso["permisos"],
    val: boolean
  ) => {
    setMatriz((prev) =>
      prev.map((item) =>
        item.recursoId === recursoId
          ? {
              ...item,
              permisos: {
                ...item.permisos,
                [accion]: val,
                ...(accion !== "ver" && val ? { ver: true } : {}),
                ...(accion === "ver" && !val
                  ? { crear: false, editar: false, eliminar: false }
                  : {}),
              },
            }
          : item
      )
    );
    setHasChanges(true);
  };

  const handleApplyPreset = (preset: "readOnly" | "fullAccess" | "clear") => {
    setMatriz((prev) =>
      prev.map((item) => ({
        ...item,
        permisos: {
          ver: preset === "readOnly" || preset === "fullAccess",
          crear: preset === "fullAccess",
          editar: preset === "fullAccess",
          eliminar: preset === "fullAccess",
        },
      }))
    );
    setHasChanges(true);
    toast.info("Configuración predefinida aplicada temporalmente");
  };

  const handleSave = () => {
    mockMatrizPermisosPorRol[rol.id] = matriz;
    setHasChanges(false);
    toast.success("Matriz de permisos guardada correctamente", {
      description: `Se actualizaron las facultades para el rol "${rol.nombre}".`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="2xl"
        className="p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden bg-surface"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-info/15 text-info flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-heading font-bold text-foreground">
                  Permisos del Rol: {rol.nombre}
                </DialogTitle>
                <Badge tone="primary" appearance="soft" size="sm">
                  {aplicacion.nombre}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {rol.descripcion}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5 bg-surface">
          {/* Métricas y Acciones Rápidas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface shadow-2xs">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-primary" />
                <span>
                  <strong className="text-foreground">{rol.usuariosCount}</strong> usuarios
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FolderTree className="size-4 text-warning-600" />
                <span>
                  <strong className="text-foreground">{matriz.length}</strong> recursos
                </span>
              </div>
            </div>

            <TooltipProvider delayDuration={150}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <SlidersHorizontal className="size-3" /> Ajuste rápido:
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => handleApplyPreset("readOnly")}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
                    <p className="font-semibold">Solo Ver</p>
                    <p className="text-[11px] opacity-90">Otorga únicamente permisos de lectura a todos los recursos.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => handleApplyPreset("fullAccess")}
                    >
                      <CheckCheck className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
                    <p className="font-semibold">Control Total</p>
                    <p className="text-[11px] opacity-90">Otorga todos los permisos (ver, crear, editar, eliminar) a todos los recursos.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleApplyPreset("clear")}
                      className="text-muted-foreground hover:text-danger hover:bg-danger/10"
                    >
                      <Eraser className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" variant="danger" className="flex-col items-start max-w-[220px] text-left">
                    <p className="font-semibold">Limpiar</p>
                    <p className="text-[11px] opacity-90">Revoca todos los permisos asignados actualmente.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* MATRIZ DE PERMISOS */}
          <div className="overflow-x-auto pt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">Recurso Institucional</TableHead>
                  <TableHead className="text-center w-[13%]">Ver</TableHead>
                  <TableHead className="text-center w-[13%]">Crear</TableHead>
                  <TableHead className="text-center w-[13%]">Editar</TableHead>
                  <TableHead className="text-center w-[13%]">Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rootPermisos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground dark:text-neutral-300">
                      No hay permisos configurados.
                    </TableCell>
                  </TableRow>
                ) : (
                  rootPermisos.map((rootItem) => {
                    const children = childPermisosByPadre[rootItem.recursoNombre] || [];
                    const hasChildren = children.length > 0;
                    const isExpanded = expandedPadres.includes(rootItem.recursoNombre);

                    return (
                      <React.Fragment key={rootItem.recursoId}>
                        <TableRow
                          className={cn(
                            "border-l-4 border-l-primary dark:bg-muted/65 hover:bg-muted/50 dark:hover:bg-muted/80 transition-colors",
                            isExpanded && "bg-muted/30 dark:bg-muted/80"
                          )}
                        >
                          {/* Recurso */}
                          <TableCell className="h-auto pl-6">
                            <div className="flex items-start gap-2.5 py-1">
                              <div className="flex items-center gap-1.5">
                                {hasChildren ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => toggleExpand(rootItem.recursoNombre)}
                                    className="size-6 p-0 rounded-md hover:bg-primary/20 text-primary transition-transform duration-300 shrink-0 mt-0.5"
                                  >
                                    <ChevronRight className={cn("size-4 transition-transform duration-300", isExpanded && "rotate-90")} />
                                  </Button>
                                ) : (
                                  <div className="size-6 shrink-0 mt-0.5"></div>
                                )}
                                <div className="size-7 rounded-md bg-primary/10 dark:bg-primary-900/40 text-primary dark:text-primary-300 flex items-center justify-center shrink-0 mt-0.5">
                                  <Folder className="size-4" />
                                </div>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm truncate font-bold font-heading text-foreground dark:text-white">
                                  {rootItem.recursoNombre}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Checkboxes for root */}
                          {["ver", "crear", "editar", "eliminar"].map((accion) => (
                            <TableCell key={accion} className="text-center h-auto py-2.5">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={rootItem.permisos[accion as keyof typeof rootItem.permisos]}
                                  className="dark:border-neutral-500"
                                  onCheckedChange={(checked) =>
                                    handleTogglePermiso(rootItem.recursoId, accion as keyof typeof rootItem.permisos, Boolean(checked))
                                  }
                                  aria-label={`${accion} ${rootItem.recursoNombre}`}
                                />
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>

                        {/* Children Rows */}
                        {children.map((childItem) => (
                          <TableRow
                            key={childItem.recursoId}
                            className={cn(
                              "border-l-4 border-l-transparent transition-all duration-300 overflow-hidden dark:bg-transparent hover:bg-muted/30",
                              !isExpanded && "hidden"
                            )}
                          >
                            <TableCell className="h-auto pl-6 py-0">
                              <div
                                className={cn(
                                  "grid transition-all duration-300 ease-in-out",
                                  isExpanded ? "grid-rows-[1fr] opacity-100 py-2.5" : "grid-rows-[0fr] opacity-0 py-0"
                                )}
                              >
                                <div className="overflow-hidden">
                                  <div className="flex items-center gap-2.5 ml-10">
                                    <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                                      <CornerDownRight className="size-3.5 text-primary dark:text-primary-300" />
                                      <FileCode className="size-3.5 text-muted-foreground dark:text-neutral-400" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-foreground dark:text-neutral-200">
                                        {childItem.recursoNombre}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground dark:text-neutral-400">
                                        Depende de: {childItem.recursoPadre}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Checkboxes for child */}
                            {["ver", "crear", "editar", "eliminar"].map((accion) => (
                              <TableCell key={accion} className="text-center h-auto py-0">
                                <div
                                  className={cn(
                                    "grid transition-all duration-300 ease-in-out",
                                    isExpanded ? "grid-rows-[1fr] opacity-100 py-2.5" : "grid-rows-[0fr] opacity-0 py-0"
                                  )}
                                >
                                  <div className="overflow-hidden flex justify-center">
                                    <Checkbox
                                      checked={childItem.permisos[accion as keyof typeof childItem.permisos]}
                                      className="dark:border-neutral-500"
                                      onCheckedChange={(checked) =>
                                        handleTogglePermiso(childItem.recursoId, accion as keyof typeof childItem.permisos, Boolean(checked))
                                      }
                                      aria-label={`${accion} ${childItem.recursoNombre}`}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-end gap-3">
          <Button
            variant="neutral"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cerrar
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges}
            className="gap-2 text-xs"
          >
            <Save className="size-3.5" />
            <span>Guardar matriz</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
