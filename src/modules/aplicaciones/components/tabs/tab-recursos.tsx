"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  FolderTree,
  Folder,
  FileCode,
  Plus,
  CornerDownRight,
  ShieldCheck,
  Check,
  AlertCircle,
  MoreVertical,
  Power,
  PowerOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AplicacionItem,
  AplicacionRecurso,
  mockRecursosPorApp,
} from "../../data/aplicaciones-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TabRecursosProps {
  aplicacion: AplicacionItem;
}

export function TabRecursos({ aplicacion }: TabRecursosProps) {
  const initialRecursos = mockRecursosPorApp[aplicacion.id] || [
    {
      id: "rec-principal",
      aplicacionId: aplicacion.id,
      nombre: "Módulo Principal",
      descripcion: "Acceso general y consultas básicas de la aplicación.",
      recursoPadreId: null,
      recursoPadreNombre: null,
      rolesConAcceso: ["Administrador", "Consulta"],
      estado: "Activo",
    },
    {
      id: "rec-reportes",
      aplicacionId: aplicacion.id,
      nombre: "Reportes",
      descripcion: "Estadísticas y reportes de gestión.",
      recursoPadreId: "rec-principal",
      recursoPadreNombre: "Módulo Principal",
      rolesConAcceso: ["Administrador"],
      estado: "Activo",
    },
  ];

  const [recursos, setRecursos] = React.useState<AplicacionRecurso[]>(initialRecursos);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = React.useState("");
  const [padreSeleccionado, setPadreSeleccionado] = React.useState("Ninguno (Raíz)");
  const [error, setError] = React.useState<string | null>(null);

  // Lista de posibles padres (recursos que son raíz o no tienen padre)
  const posiblesPadres = React.useMemo(() => {
    return recursos.filter((r) => !r.recursoPadreId);
  }, [recursos]);

  const handleCreateRecurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setError("El nombre del recurso es obligatorio.");
      return;
    }
    if (!nuevaDescripcion.trim()) {
      setError("La descripción es requerida.");
      return;
    }

    const padreObj =
      padreSeleccionado === "Ninguno (Raíz)"
        ? null
        : recursos.find((r) => r.nombre === padreSeleccionado);

    const newId = `rec-${nuevoNombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")}`;

    const newRecurso: AplicacionRecurso = {
      id: newId,
      aplicacionId: aplicacion.id,
      nombre: nuevoNombre.trim(),
      descripcion: nuevaDescripcion.trim(),
      recursoPadreId: padreObj ? padreObj.id : null,
      recursoPadreNombre: padreObj ? padreObj.nombre : null,
      rolesConAcceso: ["Administrador"],
      estado: "Activo",
    };

    setRecursos((prev) => [...prev, newRecurso]);
    toast.success(`Recurso "${newRecurso.nombre}" registrado correctamente.`);
    setIsCreateOpen(false);
    setNuevoNombre("");
    setNuevaDescripcion("");
    setPadreSeleccionado("Ninguno (Raíz)");
    setError(null);
  };

  const handleToggleRecurso = (rec: AplicacionRecurso) => {
    const nuevoEstado = rec.estado === "Activo" ? "Inactivo" : "Activo";
    setRecursos((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, estado: nuevoEstado } : r))
    );
    toast.success(`Recurso "${rec.nombre}" marcado como ${nuevoEstado}.`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header del Tab con Botón Nuevo Recurso */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-warning/10 text-warning-700 dark:text-warning-300 flex items-center justify-center shrink-0">
            <FolderTree className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Jerarquía de recursos de {aplicacion.nombre}
            </h3>
            <p className="text-xs text-muted-foreground">
              Define los módulos, vistas y submódulos sobre los cuales se aplicarán permisos de acceso.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="gap-1.5 text-xs shrink-0"
        >
          <Plus className="size-4" />
          <span>Nuevo recurso</span>
        </Button>
      </div>

      {/* Tabla Jerárquica */}
      <div className="border border-border rounded-xl overflow-hidden bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[320px] pl-6 dark:text-white">
                Recurso institucional
              </TableHead>
              <TableHead className="w-[180px] dark:text-white">
                Recurso padre
              </TableHead>
              <TableHead className="w-[280px] dark:text-white">
                Roles con acceso
              </TableHead>
              <TableHead className="w-[110px] text-center dark:text-white">
                Estado
              </TableHead>
              <TableHead className="w-[100px] text-right dark:text-white pr-6">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground dark:text-neutral-300">
                  No hay recursos configurados para esta aplicación.
                </TableCell>
              </TableRow>
            ) : (
              recursos.map((rec) => {
                const isSubRecurso = Boolean(rec.recursoPadreId);

                return (
                  <TableRow
                    key={rec.id}
                    className={cn(
                      isSubRecurso
                        ? "bg-muted/10 dark:bg-muted/25 hover:bg-muted/20 dark:hover:bg-muted/45"
                        : "border-l-4 border-l-primary/60 dark:border-l-primary dark:bg-muted/65"
                    )}
                  >
                    {/* 1. Recurso con Indentación Jerárquica */}
                    <TableCell className="pl-6">
                      <div className="flex items-start gap-2.5 py-1">
                        {isSubRecurso ? (
                          <div className="flex items-center gap-1.5 text-muted-foreground dark:text-neutral-300 pl-4 shrink-0 mt-0.5">
                            <CornerDownRight className="size-4 text-primary dark:text-primary-300" />
                            <FileCode className="size-4 text-muted-foreground dark:text-neutral-300" />
                          </div>
                        ) : (
                          <div className="size-7 rounded-md bg-primary/10 dark:bg-primary-900/40 text-primary dark:text-primary-300 flex items-center justify-center shrink-0 mt-0.5">
                            <Folder className="size-4" />
                          </div>
                        )}
                              <div className="flex flex-col min-w-0">
                                <span
                                  className={cn(
                                    "text-sm truncate",
                                    isSubRecurso
                                      ? "font-medium text-foreground dark:text-neutral-100"
                                      : "font-bold font-heading text-foreground dark:text-white"
                                  )}
                                >
                                  {rec.nombre}
                                </span>
                                <span className="text-xs text-muted-foreground dark:text-neutral-300 line-clamp-1">
                                  {rec.descripcion}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                    {/* 2. Recurso Padre */}
                        <TableCell>
                          {rec.recursoPadreNombre ? (
                            <div className="flex items-center gap-1.5 text-xs text-foreground dark:text-neutral-200 font-medium">
                              <Folder className="size-3.5 text-muted-foreground dark:text-neutral-400 shrink-0" />
                              <span>{rec.recursoPadreNombre}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground dark:text-neutral-400 italic">
                              Raíz (Principal)
                            </span>
                          )}
                        </TableCell>

                              {/* 3. Roles con Acceso */}
                              <TableCell>
                                <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                                  {rec.rolesConAcceso.map((rol) => (
                                    <Badge
                                      key={rol}
                                      tone="primary"
                                      appearance="soft"
                                      size="sm"
                                      className="text-[10px] font-medium dark:bg-primary-900/40 dark:text-primary-200"
                                    >
                                      <ShieldCheck className="size-3" />
                                      {rol}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>

                              {/* 4. Estado */}
                              <TableCell className="text-center">
                                <Badge
                                  tone={rec.estado === "Activo" ? "success" : "neutral"}
                                  appearance="soft"
                                  size="sm"
                                >
                                  {rec.estado}
                                </Badge>
                              </TableCell>

                              {/* 5. Acciones */}
                              <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-8 text-muted-foreground hover:text-foreground"
                                      className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-foreground dark:hover:text-white"
                                    >
                                      <MoreVertical className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem
                                      onClick={() => handleToggleRecurso(rec)}
                                      className={cn(
                                        "cursor-pointer flex items-center gap-2",
                                        rec.estado === "Activo"
                                          ? "text-danger"
                                          : "text-success"
                                      )}
                                    >
                                      {rec.estado === "Activo" ? (
                                        <>
                                          <PowerOff className="size-4" />
                                          <span>Inactivar</span>
                                        </>
                                      ) : (
                                        <>
                                          <Power className="size-4" />
                                          <span>Activar</span>
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
              })
            )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Modal para Crear Recurso */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                      <DialogContent size="lg" className="p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 text-left">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <FolderTree className="size-5" />
                            </div>
                            <div>
                              <DialogTitle className="text-lg font-heading font-bold text-foreground">
                                Registrar recurso en {aplicacion.nombre}
                              </DialogTitle>
                              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Agrega una vista, submódulo o servicio dentro del árbol jerárquico.
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>

                        <form onSubmit={handleCreateRecurso} className="p-6 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                              Nombre del recurso <span className="text-danger">*</span>
                            </label>
                            <Input
                              placeholder="Ej. Docentes, Trayectoria, Acciones de personal"
                              value={nuevoNombre}
                              onChange={(e) => {
                                setNuevoNombre(e.target.value);
                                setError(null);
                              }}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                              Recurso padre (Jerarquía)
                            </label>
                            <Combobox
                              value={padreSeleccionado}
                              onValueChange={(val) => {
                                if (val) setPadreSeleccionado(val);
                              }}
                            >
                              <ComboboxInput
                                placeholder="Seleccionar padre o raíz"
                                showClear={false}
                                size="sm"
                                className="w-full text-xs"
                              />
                              <ComboboxContent className="min-w-full">
                                <ComboboxList>
                                  <ComboboxItem value="Ninguno (Raíz)">
                                    Ninguno (Es un recurso Raíz)
                                  </ComboboxItem>
                                  {posiblesPadres.map((p) => (
                                    <ComboboxItem key={p.id} value={p.nombre}>
                                      {p.nombre}
                                    </ComboboxItem>
                                  ))}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                            <p className="text-[11px] text-muted-foreground">
                              Si seleccionas un padre, este recurso se agrupará como un submódulo.
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                              Descripción funcional <span className="text-danger">*</span>
                            </label>
                            <Textarea
                              placeholder="Describe la información que gestiona o contiene este recurso..."
                              rows={3}
                              value={nuevaDescripcion}
                              onChange={(e) => {
                                setNuevaDescripcion(e.target.value);
                                setError(null);
                              }}
                              className="text-sm"
                            />
                          </div>

                          {error && (
                            <p className="text-[11px] text-danger flex items-center gap-1.5">
                              <AlertCircle className="size-3.5 shrink-0" />
                              {error}
                            </p>
                          )}

                          <DialogFooter className="pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsCreateOpen(false)}
                              className="text-xs"
                            >
                              Cancelar
                            </Button>
                            <Button type="submit" variant="primary" className="gap-1.5 text-xs">
                              <Check className="size-4" />
                              <span>Registrar recurso</span>
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              }

