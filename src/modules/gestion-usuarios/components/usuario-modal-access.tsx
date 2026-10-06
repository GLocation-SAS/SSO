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
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full pr-8">
            <div className="space-y-0.5">
              <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
                Accesos del usuario
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Consulta las sedes, aplicaciones y roles asignados a este usuario.
              </DialogDescription>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAdding((prev) => !prev)}
              className="gap-1.5 text-xs shrink-0"
            >
              <Plus className="size-3.5" />
              <span>Agregar acceso</span>
            </Button>
          </div>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Formulario Inline para Agregar Acceso */}
          {isAdding && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-in fade-in-50 duration-200">
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
                      className="w-full h-9 text-xs"
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
                      className="w-full h-9 text-xs"
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
                      className="w-full h-9 text-xs"
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
                    className="rounded-xl border border-border overflow-hidden bg-surface shadow-xs"
                  >
                    {/* Header Sede */}
                    <button
                      type="button"
                      onClick={() => toggleSedeExpand(sedeKey)}
                      className="w-full bg-muted/40 hover:bg-muted/60 transition-colors px-4 py-3 border-b border-border flex items-center justify-between text-left cursor-pointer"
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
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Tabla de asignaciones de la sede */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-border/60 bg-muted/20">
                              <TableHead className="text-xs font-semibold h-9 text-foreground pl-4">
                                Aplicación
                              </TableHead>
                              <TableHead className="text-xs font-semibold h-9 text-foreground">
                                Rol
                              </TableHead>
                              <TableHead className="text-xs font-semibold h-9 text-foreground">
                                Estado
                              </TableHead>
                              <TableHead className="text-xs font-semibold h-9 text-foreground">
                                Fecha de asignación
                              </TableHead>
                              <TableHead className="text-xs font-semibold h-9 text-right pr-4 text-foreground">
                                Acciones
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sede.asignaciones.map((asig) => (
                              <TableRow
                                key={asig.id}
                                className="border-b border-border/40 hover:bg-muted/10 last:border-b-0"
                              >
                                <TableCell className="py-2.5 pl-4 text-xs font-semibold text-foreground">
                                  {asig.aplicacionNombre}
                                </TableCell>
                                <TableCell className="py-2.5 text-xs text-muted-foreground font-medium">
                                  {asig.rolNombre}
                                </TableCell>
                                <TableCell className="py-2.5">
                                  <Badge
                                    tone={
                                      asig.estado === "Activo"
                                        ? "success"
                                        : "neutral"
                                    }
                                    appearance="soft"
                                    className="text-xs font-semibold"
                                  >
                                    {asig.estado}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-2.5 text-xs text-muted-foreground">
                                  {asig.fechaAsignacion || "—"}
                                </TableCell>
                                <TableCell className="py-2.5 pr-4 text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        className="size-7 rounded-lg"
                                      >
                                        <MoreHorizontal className="size-3.5" />
                                        <span className="sr-only">Acciones</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          toast.info(`Editar asignación de ${asig.aplicacionNombre}`);
                                        }}
                                        className="gap-2 text-xs"
                                      >
                                        <Edit className="size-3.5" />
                                        <span>Editar acceso</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleToggleAsigStatus(asig)}
                                        className="gap-2 text-xs"
                                      >
                                        {asig.estado === "Activo" ? (
                                          <>
                                            <PowerOff className="size-3.5 text-warning" />
                                            <span>Inactivar acceso</span>
                                          </>
                                        ) : (
                                          <>
                                            <Power className="size-3.5 text-success" />
                                            <span>Activar acceso</span>
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleRemoveAsig(asig)}
                                        className="gap-2 text-xs text-danger focus:text-danger"
                                      >
                                        <Trash2 className="size-3.5" />
                                        <span>Quitar acceso</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {usuario.sedes.length} {usuario.sedes.length === 1 ? "sede" : "sedes"} &bull; {totalAsignaciones} {totalAsignaciones === 1 ? "asignación total" : "asignaciones totales"}
          </span>
          <Button
            variant="neutral"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
