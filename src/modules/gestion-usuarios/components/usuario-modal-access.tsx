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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getRoleBadgeStyle } from "@/lib/role-badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  Power,
  PowerOff,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  UsuarioItem,
  UsuarioSedeRolAplicacion,
  SEDES_CATALOGO,
  APLICACIONES_CATALOGO,
  ROLES_POR_APLICACION,
} from "../data/usuarios-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface UsuarioModalAccessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UsuarioItem | null;
  allUsuarios?: UsuarioItem[];
  onSave?: (usuario: UsuarioItem) => void;
}

export function UsuarioModalAccess({
  open,
  onOpenChange,
  usuario,
  onSave,
}: UsuarioModalAccessProps) {
  if (!usuario) return null;

  // Estado local para agregar asignaciones
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingAsigId, setEditingAsigId] = React.useState<string | null>(null);
  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedApp, setSelectedApp] = React.useState("");
  const [selectedRol, setSelectedRol] = React.useState("");

  // Estado de colapso de sedes (por defecto todas abiertas)
  const [expandedSedes, setExpandedSedes] = React.useState<Record<string, boolean>>({});

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "success" | "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "warning",
    onConfirm: () => { },
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setIsAdding(false);
      setEditingAsigId(null);
      setSelectedSede("");
      setSelectedApp("");
      setSelectedRol("");
      // Expandir todas
      const expanded: Record<string, boolean> = {};
      usuario.sedes.forEach((s) => {
        expanded[s.sedeId || s.sedeNombre] = true;
      });
      setExpandedSedes(expanded);
    }
  }, [open, usuario]);

  const toggleSedeExpand = (sedeKey: string) => {
    setExpandedSedes((prev) => ({
      ...prev,
      [sedeKey]: !prev[sedeKey],
    }));
  };

  const availableRoles = React.useMemo(() => {
    if (!selectedApp) return [];
    return ROLES_POR_APLICACION[selectedApp] || [];
  }, [selectedApp]);

  const handleSaveAssignment = () => {
    if (!selectedSede || !selectedApp || !selectedRol) {
      toast.error("Por favor selecciona Sede, Aplicación y Rol.");
      return;
    }

    const sedeInfo = SEDES_CATALOGO.find((s) => s.nombre === selectedSede);
    const sedeId = sedeInfo?.id || `sede-${Date.now()}`;
    let sedesCopy = JSON.parse(JSON.stringify(usuario.sedes)) as typeof usuario.sedes;

    if (editingAsigId) {
      // Remover de la sede antigua si cambió, o simplemente borrarlo para re-insertarlo
      sedesCopy = sedesCopy.map((s) => ({
        ...s,
        asignaciones: s.asignaciones.filter((a) => a.id !== editingAsigId)
      })).filter((s) => s.asignaciones.length > 0);

      const targetSedeIndex = sedesCopy.findIndex((s) => s.sedeNombre === selectedSede);
      
      const updatedAsig: UsuarioSedeRolAplicacion = {
        id: editingAsigId,
        usuarioId: usuario.id,
        sedeId,
        sedeNombre: selectedSede,
        rolAplicacionId: `ra-${Date.now()}`,
        aplicacionNombre: selectedApp,
        rolNombre: selectedRol,
        estado: "Activo",
        fechaAsignacion: new Date().toLocaleDateString("es-EC", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        permisos: [],
      };

      if (targetSedeIndex >= 0) {
        sedesCopy[targetSedeIndex].asignaciones.push(updatedAsig);
      } else {
        sedesCopy.push({
          sedeId,
          sedeNombre: selectedSede,
          asignaciones: [updatedAsig],
        });
      }

      toast.success(`Acceso a ${selectedApp} actualizado correctamente.`);
    } else {
      const newAssignment: UsuarioSedeRolAplicacion = {
        id: `asig-${Date.now()}`,
        usuarioId: usuario.id,
        sedeId,
        sedeNombre: selectedSede,
        rolAplicacionId: `ra-${Date.now()}`,
        aplicacionNombre: selectedApp,
        rolNombre: selectedRol,
        estado: "Activo",
        fechaAsignacion: new Date().toLocaleDateString("es-EC", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        permisos: [],
      };

      const existingSedeIndex = sedesCopy.findIndex((s) => s.sedeNombre === selectedSede);

      if (existingSedeIndex >= 0) {
        sedesCopy[existingSedeIndex].asignaciones.push(newAssignment);
      } else {
        sedesCopy.push({
          sedeId,
          sedeNombre: selectedSede,
          asignaciones: [newAssignment],
        });
      }
      toast.success(`Acceso a ${selectedApp} asignado en ${selectedSede}.`);
    }

    const updatedUser: UsuarioItem = {
      ...usuario,
      sedes: sedesCopy,
    };

    onSave?.(updatedUser);

    // Reset inline form
    setSelectedSede("");
    setSelectedApp("");
    setSelectedRol("");
    setEditingAsigId(null);
    setIsAdding(false);
  };

  const handleToggleAsigStatus = (asig: UsuarioSedeRolAplicacion) => {
    const isActivo = asig.estado === "Activo";
    const newStatus = isActivo ? "Inactivo" : "Activo";
    
    setConfirmDialog({
      open: true,
      title: isActivo ? "¿Desactivar acceso?" : "¿Activar acceso?",
      description: isActivo 
        ? `Estás a punto de desactivar el acceso a ${asig.aplicacionNombre}.` 
        : `Estás a punto de activar el acceso a ${asig.aplicacionNombre}.`,
      confirmText: isActivo ? "Desactivar" : "Activar",
      variant: isActivo ? "warning" : "success",
      onConfirm: () => {
        const sedesCopy = usuario.sedes.map((s) => ({
          ...s,
          asignaciones: s.asignaciones.map((a) =>
            a.id === asig.id ? { ...a, estado: newStatus as "Activo" | "Inactivo" } : a
          ),
        }));

        const updatedUser: UsuarioItem = {
          ...usuario,
          sedes: sedesCopy,
        };

        onSave?.(updatedUser);
        toast.success(`Acceso a ${asig.aplicacionNombre} marcado como ${newStatus}.`);
      }
    });
  };

  const handleRemoveAsig = (asig: UsuarioSedeRolAplicacion) => {
    setConfirmDialog({
      open: true,
      title: "Â¿Quitar acceso?",
      description: `Estás a punto de eliminar el acceso a ${asig.aplicacionNombre}. Esta acción no se puede deshacer.`,
      confirmText: "Quitar",
      variant: "danger",
      onConfirm: () => {
        const sedesCopy = usuario.sedes
          .map((s) => ({
            ...s,
            asignaciones: s.asignaciones.filter((a) => a.id !== asig.id),
          }))
          .filter((s) => s.asignaciones.length > 0);

        const updatedUser: UsuarioItem = {
          ...usuario,
          sedes: sedesCopy,
        };

        onSave?.(updatedUser);
        toast.info(`Acceso a ${asig.aplicacionNombre} removido.`);
      }
    });
  };

  const totalAsignaciones = usuario.sedes.reduce(
    (acc, s) => acc + s.asignaciones.length,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="2xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-surface"
        onInteractOutside={(e) => {
          if ((e.target as Element)?.closest?.('[data-slot="combobox-content"]')) {
            e.preventDefault();
          }
        }}
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left">
          <div className="space-y-0.5">
            <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
              Accesos del usuario
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Consulta las sedes, aplicaciones y roles asignados a este usuario.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5 bg-surface">
          {/* Barra de acción destacada para Agregar Acceso */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Gestión de accesos y roles</p>
                <p className="text-xs text-muted-foreground">
                  {usuario.sedes.length} {usuario.sedes.length === 1 ? "sede" : "sedes"} &bull; {totalAsignaciones} {totalAsignaciones === 1 ? "asignación registrada" : "asignaciones registradas"}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="default"
              onClick={() => {
                setEditingAsigId(null);
                setSelectedSede("");
                setSelectedApp("");
                setSelectedRol("");
                setIsAdding(true);
              }}
              className="gap-2 text-xs font-semibold shadow-sm shrink-0"
            >
              <Plus className="size-4" />
              <span>Agregar acceso</span>
            </Button>
          </div>

          {/* Formulario Inline para Agregar Acceso */}
          {isAdding && (
            <div className="p-4 rounded-xl border border-border bg-surface space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  {editingAsigId ? "Edición de acceso" : "Nueva asignación de acceso"}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingAsigId(null);
                  }}
                  className="rounded-full"
                >
                  <X className="size-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Sede */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Sede <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={selectedSede}
                    onValueChange={(val) => {
                      if (val) setSelectedSede(val);
                    }}
                  >
                    <ComboboxInput
                      placeholder="Seleccionar sede..."
                      showClear={false}
                      showSearchIcon={false}
                      size="sm"
                      className="w-full text-xs"
                    />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {SEDES_CATALOGO.map((sede) => (
                          <ComboboxItem key={sede.id} value={sede.nombre}>
                            {sede.nombre}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {/* 2. Aplicación */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Aplicación <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={selectedApp}
                    onValueChange={(val) => {
                      if (val) {
                        setSelectedApp(val);
                        setSelectedRol(""); // Reset rol al cambiar aplicación
                      }
                    }}
                  >
                    <ComboboxInput
                      placeholder="Seleccionar aplicación..."
                      showClear={false}
                      showSearchIcon={false}
                      size="sm"
                      className="w-full text-xs"
                    />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {APLICACIONES_CATALOGO.map((app) => (
                          <ComboboxItem key={app.id} value={app.nombre}>
                            {app.nombre}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {/* 3. Rol */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Rol <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={selectedRol}
                    onValueChange={(val) => {
                      if (val) setSelectedRol(val);
                    }}
                    disabled={!selectedApp}
                  >
                    <ComboboxInput
                      placeholder={selectedApp ? "Seleccionar rol..." : "Selecciona una app primero"}
                      showClear={false}
                      showSearchIcon={false}
                      size="sm"
                      className="w-full text-xs"
                    />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {availableRoles.map((r) => (
                          <ComboboxItem key={r} value={r}>
                            {r}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-2 border-t border-border/40">
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingAsigId(null);
                  }}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAssignment}
                  disabled={!selectedSede || !selectedApp || !selectedRol}
                  className="text-xs"
                >
                  {editingAsigId ? "Guardar Cambios" : "Agregar acceso"}
                </Button>
              </div>
            </div>
          )}

          {/* Listado de Accesos Agrupados por Sede */}
          <div className="space-y-4">
            {usuario.sedes.length === 0 || totalAsignaciones === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                El usuario no tiene aplicaciones ni roles asignados actualmente.
              </div>
            ) : (
              usuario.sedes.map((sede) => {
                const sedeKey = sede.sedeId || sede.sedeNombre;
                const isExpanded = expandedSedes[sedeKey] ?? true;

                return (
                  <div
                    key={sedeKey}
                    className="rounded-xl border border-primary/20 overflow-hidden bg-primary-50/20 dark:bg-primary-900/10"
                  >
                    {/* Header Sede sin Tooltip global */}
                      <button
                      type="button"
                      onClick={() => toggleSedeExpand(sedeKey)}
                      className="w-full bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors px-4 py-3 border-b border-primary/20 flex items-center justify-between text-left cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Building2 className="size-4 text-primary shrink-0" />
                        <span>{sede.sedeNombre}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          tone="neutral"
                          appearance="soft"
                          className="text-xs font-semibold"
                        >
                          {sede.asignaciones.length}{" "}
                          {sede.asignaciones.length === 1
                            ? "asignación"
                            : "asignaciones"}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-1 rounded-md hover:bg-muted/30 transition-colors">
                                {isExpanded ? (
                                  <ChevronUp className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent variant="info" side="top">
                              {isExpanded ? "Ocultar sede" : "Desplegar sede"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </button>

                    {/* Tabla de asignaciones de la sede */}
                    {isExpanded && (
                      <div className="pt-2 px-2 pb-4">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Aplicación</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="text-center w-28">Estado</TableHead>
                                <TableHead className="whitespace-nowrap">Fecha de asignación</TableHead>
                                <TableHead className="text-right w-32">Acciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sede.asignaciones.map((asig) => (
                                <TableRow key={asig.id}>
                                  <TableCell className="font-semibold text-foreground">
                                    {asig.aplicacionNombre}
                                  </TableCell>
                                  <TableCell>
                                    {(() => {
                                      const style = getRoleBadgeStyle(asig.rolNombre);
                                      return (
                                        <Badge
                                          tone={style.tone}
                                          appearance={style.appearance}
                                          size="sm"
                                          className={style.className}
                                        >
                                          <ShieldCheck className="size-3" />
                                          {asig.rolNombre}
                                        </Badge>
                                      );
                                    })()}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      tone={asig.estado === "Activo" ? "success" : "neutral"}
                                      appearance="soft"
                                      className={cn(
                                        "font-semibold text-xs",
                                        asig.estado === "Activo" && "bg-success/15 text-success-800 dark:text-success-300",
                                        asig.estado === "Inactivo" && "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300"
                                      )}
                                    >
                                      {asig.estado}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground whitespace-nowrap">
                                    {asig.fechaAsignacion || "—"}
                                  </TableCell>
                                  <TableCell className="text-right whitespace-nowrap">
                                    <div className="inline-flex items-center justify-end gap-1">
                                      <TooltipProvider delayDuration={150}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                setEditingAsigId(asig.id);
                                                setSelectedSede(asig.sedeNombre);
                                                setSelectedApp(asig.aplicacionNombre);
                                                setSelectedRol(asig.rolNombre);
                                                setIsAdding(true);
                                                
                                                // Scroll automatically to top
                                                const container = document.getElementById("dialog-content-scroll");
                                                if (container) {
                                                  container.scrollTo({ top: 0, behavior: "smooth" });
                                                }
                                              }}
                                              aria-label="Editar acceso"
                                              className="size-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            >
                                              <Edit className="size-3.5" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent variant="info" side="top">Editar acceso</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleToggleAsigStatus(asig)}
                                              aria-label={asig.estado === "Activo" ? "Desactivar acceso" : "Activar acceso"}
                                              className={cn(
                                                "size-7",
                                                asig.estado === "Activo"
                                                  ? "text-muted-foreground hover:text-warning hover:bg-warning/10"
                                                  : "text-muted-foreground hover:text-success hover:bg-success/10"
                                              )}
                                            >
                                              {asig.estado === "Activo" ? (
                                                <PowerOff className="size-3.5" />
                                              ) : (
                                                <Power className="size-3.5" />
                                              )}
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent variant="info" side="top">
                                            {asig.estado === "Activo" ? "Desactivar acceso" : "Activar acceso"}
                                          </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleRemoveAsig(asig)}
                                              aria-label="Quitar acceso"
                                              className="size-7 text-muted-foreground hover:text-danger hover:bg-danger/10"
                                            >
                                              <Trash2 className="size-3.5" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent variant="info" side="top">Quitar acceso</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex flex-row items-center justify-between sm:justify-between w-full">
          <Button
            variant="neutral"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <span className="text-xs text-muted-foreground">
            {usuario.sedes.length} {usuario.sedes.length === 1 ? "sede" : "sedes"} &bull; {totalAsignaciones} {totalAsignaciones === 1 ? "asignación total" : "asignaciones totales"}
          </span>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
      />
    </Dialog>
  );
}
