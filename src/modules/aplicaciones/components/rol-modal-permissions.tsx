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
        size="xl"
        className="p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden bg-background"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-background shrink-0 items-start text-left">
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
        <div className="overflow-y-auto flex-1 p-6 space-y-5 bg-background">
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

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <SlidersHorizontal className="size-3" /> Ajuste rápido:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplyPreset("readOnly")}
                className="h-7 text-xs"
              >
                Solo Ver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplyPreset("fullAccess")}
                className="h-7 text-xs"
              >
                Control Total
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApplyPreset("clear")}
                className="h-7 text-xs text-muted-foreground hover:text-danger"
              >
                Limpiar
              </Button>
            </div>
          </div>

          {/* MATRIZ DE PERMISOS */}
          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary/30 dark:border-primary-800/60">
                  <TableHead className="font-semibold text-white dark:text-white py-3 pl-6 w-[45%]">
                    Recurso Institucional
                  </TableHead>
                  <TableHead className="text-center font-semibold text-white dark:text-white py-3 w-[13%]">
                    Ver
                  </TableHead>
                  <TableHead className="text-center font-semibold text-white dark:text-white py-3 w-[13%]">
                    Crear
                  </TableHead>
                  <TableHead className="text-center font-semibold text-white dark:text-white py-3 w-[13%]">
                    Editar
                  </TableHead>
                  <TableHead className="text-center font-semibold text-white dark:text-white py-3 w-[13%]">
                    Eliminar
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriz.map((item) => {
                  const isSubRecurso = Boolean(item.recursoPadre);

                  return (
                    <TableRow
                      key={item.recursoId}
                      className={cn(
                        "transition-colors border-b border-border/60",
                        isSubRecurso
                          ? "bg-muted/10 dark:bg-muted/20 hover:bg-muted/25 dark:hover:bg-muted/40"
                          : "hover:bg-primary/5 dark:hover:bg-muted/70"
                      )}
                    >
                      {/* Recurso */}
                      <TableCell className="pl-6 h-auto py-2.5">
                        <div className="flex items-center gap-2.5 py-1">
                          {isSubRecurso ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground pl-3 shrink-0">
                              <CornerDownRight className="size-3.5 text-primary dark:text-primary-300" />
                              <FileCode className="size-3.5 text-muted-foreground dark:text-neutral-400" />
                            </div>
                          ) : (
                            <div className="size-7 rounded-md bg-primary/10 dark:bg-primary-900/40 border border-transparent dark:border-primary-700/40 text-primary dark:text-primary-300 flex items-center justify-center shrink-0">
                              <Folder className="size-4" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-xs",
                                isSubRecurso
                                  ? "font-medium text-foreground dark:text-neutral-200"
                                  : "font-bold text-foreground dark:text-white"
                              )}
                            >
                              {item.recursoNombre}
                            </span>
                            {item.recursoPadre && (
                              <span className="text-[10px] text-muted-foreground dark:text-neutral-400">
                                Depende de: {item.recursoPadre}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Ver */}
                      <TableCell className="text-center h-auto py-2.5">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={item.permisos.ver}
                            className="dark:border-neutral-500"
                            onCheckedChange={(checked) =>
                              handleTogglePermiso(
                                item.recursoId,
                                "ver",
                                Boolean(checked)
                              )
                            }
                            aria-label={`Ver ${item.recursoNombre}`}
                          />
                        </div>
                      </TableCell>

                      {/* Crear */}
                      <TableCell className="text-center h-auto py-2.5">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={item.permisos.crear}
                            className="dark:border-neutral-500"
                            onCheckedChange={(checked) =>
                              handleTogglePermiso(
                                item.recursoId,
                                "crear",
                                Boolean(checked)
                              )
                            }
                            aria-label={`Crear ${item.recursoNombre}`}
                          />
                        </div>
                      </TableCell>

                      {/* Editar */}
                      <TableCell className="text-center h-auto py-2.5">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={item.permisos.editar}
                            className="dark:border-neutral-500"
                            onCheckedChange={(checked) =>
                              handleTogglePermiso(
                                item.recursoId,
                                "editar",
                                Boolean(checked)
                              )
                            }
                            aria-label={`Editar ${item.recursoNombre}`}
                          />
                        </div>
                      </TableCell>

                      {/* Eliminar */}
                      <TableCell className="text-center h-auto py-2.5">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={item.permisos.eliminar}
                            className="dark:border-neutral-500"
                            onCheckedChange={(checked) =>
                              handleTogglePermiso(
                                item.recursoId,
                                "eliminar",
                                Boolean(checked)
                              )
                            }
                            aria-label={`Eliminar ${item.recursoNombre}`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-background shrink-0 flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
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
