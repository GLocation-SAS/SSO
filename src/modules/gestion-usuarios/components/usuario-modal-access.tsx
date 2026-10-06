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
  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedApp, setSelectedApp] = React.useState("");
  const [selectedRol, setSelectedRol] = React.useState("");

  // Estado de colapso de sedes (por defecto todas abiertas)
  const [expandedSedes, setExpandedSedes] = React.useState<Record<string, boolean>>({});

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setIsAdding(false);
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

  const handleAddAssignment = () => {
    if (!selectedSede || !selectedApp || !selectedRol) {
      toast.error("Por favor selecciona Sede, Aplicación y Rol.");
      return;
    }

    const sedeInfo = SEDES_CATALOGO.find((s) => s.nombre === selectedSede);
    const sedeId = sedeInfo?.id || `sede-${Date.now()}`;

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

    const sedesCopy = [...usuario.sedes];
    const existingSedeIndex = sedesCopy.findIndex((s) => s.sedeNombre === selectedSede);

    if (existingSedeIndex >= 0) {
      sedesCopy[existingSedeIndex] = {
        ...sedesCopy[existingSedeIndex],
        asignaciones: [...sedesCopy[existingSedeIndex].asignaciones, newAssignment],
      };
    } else {
      sedesCopy.push({
        sedeId,
        sedeNombre: selectedSede,
        asignaciones: [newAssignment],
      });
    }

    const updatedUser: UsuarioItem = {
      ...usuario,
      sedes: sedesCopy,
    };

    onSave?.(updatedUser);
    toast.success(`Acceso a ${selectedApp} asignado en ${selectedSede}.`);

    // Reset inline form
    setSelectedSede("");
    setSelectedApp("");
    setSelectedRol("");
    setIsAdding(false);
  };

  const handleToggleAsigStatus = (asig: UsuarioSedeRolAplicacion) => {
    const newStatus = asig.estado === "Activo" ? "Inactivo" : "Activo";
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
  };

  const handleRemoveAsig = (asig: UsuarioSedeRolAplicacion) => {
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
  };

  const totalAsignaciones = usuario.sedes.reduce(
    (acc, s) => acc + s.asignaciones.length,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-background"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-background shrink-0 items-start text-left">
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
        <div className="overflow-y-auto flex-1 p-6 space-y-5 bg-background">
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
              onClick={() => setIsAdding((prev) => !prev)}
              className="gap-2 text-xs font-semibold shadow-sm shrink-0"
            >
              <Plus className="size-4" />
              <span>Agregar acceso</span>
            </Button>
          </div>

          {/* Formulario Inline para Agregar Acceso */}
          {isAdding && (
            <div className="p-4 rounded-xl border border-border bg-background space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  Nueva asignación de acceso
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsAdding(false)}
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
                  onClick={() => setIsAdding(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddAssignment}
                  disabled={!selectedSede || !selectedApp || !selectedRol}
                  className="text-xs"
                >
                  Agregar acceso
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
                    className="rounded-xl border border-border overflow-hidden bg-background"
                  >
                    {/* Header Sede con Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => toggleSedeExpand(sedeKey)}
                            className="w-full bg-background hover:bg-muted/15 transition-colors px-4 py-3 border-b border-border flex items-center justify-between text-left cursor-pointer"
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
                              <div className="p-1 rounded-md hover:bg-muted/30 transition-colors">
                                {isExpanded ? (
                                  <ChevronUp className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {isExpanded ? "Ocultar información" : "Expandir información"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Tabla de asignaciones de la sede */}
                    {isExpanded && (
                      <div className="p-4 bg-background border-t border-border/50">
                        <div className="overflow-x-auto rounded-lg border border-border/60">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-primary/30 bg-primary">
                                <TableHead className="text-xs font-semibold h-9 text-white pl-4">
                                  Aplicación
                                </TableHead>
                                <TableHead className="text-xs font-semibold h-9 text-white">
                                  Rol
                                </TableHead>
                                <TableHead className="text-xs font-semibold h-9 text-center text-white w-28">
                                  Estado
                                </TableHead>
                                <TableHead className="text-xs font-semibold h-9 text-white whitespace-nowrap">
                                  Fecha de asignación
                                </TableHead>
                                <TableHead className="text-xs font-semibold h-9 text-right pr-4 text-white w-32">
                                  Acciones
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                              {sede.asignaciones.map((asig) => (
                                <TableRow
                                  key={asig.id}
                                  className="bg-background border-b border-border/40 hover:bg-muted/15 last:border-b-0"
                                >
                                  <TableCell className="py-2.5 pl-4 text-xs font-semibold text-foreground">
                                    {asig.aplicacionNombre}
                                  </TableCell>
                                  <TableCell className="py-2.5 text-xs text-muted-foreground font-medium">
                                    {asig.rolNombre}
                                  </TableCell>
                                  <TableCell className="py-2.5 text-center">
                                    <Badge
                                      tone={
                                        asig.estado === "Activo"
                                          ? "success"
                                          : "neutral"
                                      }
                                      appearance="soft"
                                      className={cn(
                                        "font-semibold border text-xs",
                                        asig.estado === "Activo" && "bg-success/15 text-success-800 dark:text-success-300 border-success/30",
                                        asig.estado === "Inactivo" && "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                                      )}
                                    >
                                      {asig.estado}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                    {asig.fechaAsignacion || "—"}
                                  </TableCell>
                                  <TableCell className="py-2.5 pr-4 text-right whitespace-nowrap">
                                    <div className="inline-flex items-center justify-end gap-1">
                                      <TooltipProvider delayDuration={150}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                toast.info(`Editar asignación de ${asig.aplicacionNombre}`);
                                              }}
                                              aria-label="Editar acceso"
                                              className="size-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            >
                                              <Edit className="size-3.5" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">Editar acceso</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleToggleAsigStatus(asig)}
                                              aria-label={asig.estado === "Activo" ? "Inactivar acceso" : "Activar acceso"}
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
                                          <TooltipContent side="top">
                                            {asig.estado === "Activo" ? "Inactivar acceso" : "Activar acceso"}
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
                                          <TooltipContent side="top">Quitar acceso</TooltipContent>
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
        <DialogFooter className="px-6 py-4 border-t border-border bg-background shrink-0 flex items-center justify-between sm:justify-between">
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
    </Dialog>
  );
}
