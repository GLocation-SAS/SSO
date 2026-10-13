"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search } from "@/components/ui/search";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
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
  ShieldCheck,
  FolderTree,
  CornerDownRight,
  ChevronRight,
  Folder,
  CheckSquare2,
  Square,
  Eye,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  RolItem,
  AplicacionRef,
  RecursoAppItem,
  RecursoPermisoItem,
  mockAplicacionesParaRoles,
  mockRecursosPorAppParaRoles,
} from "../data/roles-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RolModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rolToEdit: RolItem | null;
  existingRoles: RolItem[];
  onSave: (rol: RolItem) => void;
}

interface PermisoRowState {
  recursoId: string;
  acceso: boolean;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

export function RolModalForm({
  open,
  onOpenChange,
  rolToEdit,
  existingRoles,
  onSave,
}: RolModalFormProps) {
  const isEditing = Boolean(rolToEdit);

  // Form State - Sección A: Información General
  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [selectedAppId, setSelectedAppId] = React.useState("gestion-docente");
  const [estado, setEstado] = React.useState<"Activo" | "Inactivo">("Activo");

  // Form State - Sección B: Matriz de Recursos y Permisos
  const [matrixState, setMatrixState] = React.useState<Record<string, PermisoRowState>>({});
  const [resourceSearch, setResourceSearch] = React.useState("");
  const [expandedPadres, setExpandedPadres] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<{ nombre?: string; general?: string }>({});

  // Recursos de la aplicación actualmente seleccionada
  const availableResources = React.useMemo<RecursoAppItem[]>(() => {
    return mockRecursosPorAppParaRoles[selectedAppId] || [];
  }, [selectedAppId]);

  // Inicializar o resetear formulario al abrir o cambiar de rol
  React.useEffect(() => {
    if (open) {
      setErrors({});
      setResourceSearch("");
      if (rolToEdit) {
        setNombre(rolToEdit.nombre);
        setDescripcion(rolToEdit.descripcion || "");
        setSelectedAppId(rolToEdit.aplicacionId);
        setEstado(rolToEdit.estado);

        // Mapear matriz desde rol existente
        const initialMatrix: Record<string, PermisoRowState> = {};
        const resourcesForApp = mockRecursosPorAppParaRoles[rolToEdit.aplicacionId] || [];

        resourcesForApp.forEach((rec) => {
          const assigned = rolToEdit.recursosAsignados.find((r) => r.recursoId === rec.id);
          if (assigned && assigned.acceso) {
            initialMatrix[rec.id] = {
              recursoId: rec.id,
              acceso: true,
              ver: assigned.permisos.ver,
              crear: assigned.permisos.crear,
              editar: assigned.permisos.editar,
              eliminar: assigned.permisos.eliminar,
            };
          } else {
            initialMatrix[rec.id] = {
              recursoId: rec.id,
              acceso: false,
              ver: false,
              crear: false,
              editar: false,
              eliminar: false,
            };
          }
        });
        setMatrixState(initialMatrix);
        const rootsWithChildren = resourcesForApp
          .filter((r) => !r.padreId && resourcesForApp.some((c) => c.padreId === r.id))
          .map((r) => r.id);
        setExpandedPadres(rootsWithChildren);
      } else {
        // Modo Creación
        setNombre("");
        setDescripcion("");
        const defaultApp = mockAplicacionesParaRoles[0]?.id || "gestion-docente";
        setSelectedAppId(defaultApp);
        setEstado("Activo");

        const resourcesForApp = mockRecursosPorAppParaRoles[defaultApp] || [];
        const initialMatrix: Record<string, PermisoRowState> = {};
        resourcesForApp.forEach((rec) => {
          initialMatrix[rec.id] = {
            recursoId: rec.id,
            acceso: false,
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
          };
        });
        setMatrixState(initialMatrix);
        const rootsWithChildren = resourcesForApp
          .filter((r) => !r.padreId && resourcesForApp.some((c) => c.padreId === r.id))
          .map((r) => r.id);
        setExpandedPadres(rootsWithChildren);
      }
    }
  }, [open, rolToEdit]);

  // Manejar cambio de aplicación
  const handleAppChange = (newAppId: string) => {
    if (newAppId === selectedAppId) return;

    setSelectedAppId(newAppId);
    setErrors((prev) => ({ ...prev, nombre: undefined }));

    // Regla funcional: Al cambiar de aplicación, actualizar los recursos disponibles
    // y limpiar asignaciones incompatibles
    const newResources = mockRecursosPorAppParaRoles[newAppId] || [];
    const newMatrix: Record<string, PermisoRowState> = {};
    newResources.forEach((rec) => {
      newMatrix[rec.id] = {
        recursoId: rec.id,
        acceso: false,
        ver: false,
        crear: false,
        editar: false,
        eliminar: false,
      };
    });
    setMatrixState(newMatrix);
    const rootsWithChildren = newResources
      .filter((r) => !r.padreId && newResources.some((c) => c.padreId === r.id))
      .map((r) => r.id);
    setExpandedPadres(rootsWithChildren);
    toast.info("Se actualizaron los recursos disponibles para la aplicación seleccionada.");
  };

  // Handler para checkbox de Acceso
  const handleToggleAcceso = (recursoId: string, checked: boolean) => {
    setMatrixState((prev) => {
      const current = prev[recursoId] || {
        recursoId,
        acceso: false,
        ver: false,
        crear: false,
        editar: false,
        eliminar: false,
      };

      if (!checked) {
        // Regla: Si se deshabilita el acceso a un recurso, deshabilitar sus permisos asociados
        return {
          ...prev,
          [recursoId]: {
            ...current,
            acceso: false,
            ver: false,
            crear: false,
            editar: false,
            eliminar: false,
          },
        };
      } else {
        // Al habilitar acceso, por defecto habilitar "Ver"
        return {
          ...prev,
          [recursoId]: {
            ...current,
            acceso: true,
            ver: true,
          },
        };
      }
    });
  };

  // Handler para checkbox de permiso individual
  const handleTogglePermiso = (
    recursoId: string,
    field: "ver" | "crear" | "editar" | "eliminar",
    checked: boolean
  ) => {
    setMatrixState((prev) => {
      const current = prev[recursoId];
      if (!current || !current.acceso) return prev;

      return {
        ...prev,
        [recursoId]: {
          ...current,
          [field]: checked,
        },
      };
    });
  };

  // Acciones rápidas para la matriz
  const handleSelectAll = (acceso: boolean, allPermissions = false) => {
    setMatrixState((prev) => {
      const updated: Record<string, PermisoRowState> = {};
      availableResources.forEach((rec) => {
        updated[rec.id] = {
          recursoId: rec.id,
          acceso,
          ver: acceso ? true : false,
          crear: acceso && allPermissions ? true : false,
          editar: acceso && allPermissions ? true : false,
          eliminar: acceso && allPermissions ? true : false,
        };
      });
      return updated;
    });
  };


  // Toggle expandir / colapsar padre
  const toggleExpandPadre = (padreId: string) => {
    setExpandedPadres((prev) =>
      prev.includes(padreId)
        ? prev.filter((id) => id !== padreId)
        : [...prev, padreId]
    );
  };

  // Filtrado de recursos en la matriz respetando colapsables
  const filteredResources = React.useMemo(() => {
    if (resourceSearch.trim()) {
      const term = resourceSearch.toLowerCase();
      return availableResources.filter(
        (r) =>
          r.nombre.toLowerCase().includes(term) ||
          r.descripcion.toLowerCase().includes(term) ||
          (r.padreNombre && r.padreNombre.toLowerCase().includes(term))
      );
    }

    return availableResources.filter((r) => {
      if (!r.padreId) return true;
      return expandedPadres.includes(r.padreId);
    });
  }, [availableResources, resourceSearch, expandedPadres]);

  // Total de recursos con acceso configurado
  const countConfigurados = React.useMemo(() => {
    return Object.values(matrixState).filter((r) => r.acceso).length;
  }, [matrixState]);

  // Envío y validación del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { nombre?: string; general?: string } = {};

    const cleanNombre = nombre.trim();
    if (!cleanNombre) {
      newErrors.nombre = "El nombre del rol es obligatorio.";
    } else {
      // Validar nombre duplicado dentro de la misma aplicación
      const duplicate = existingRoles.find(
        (r) =>
          r.aplicacionId === selectedAppId &&
          r.nombre.toLowerCase() === cleanNombre.toLowerCase() &&
          r.id !== rolToEdit?.id
      );
      if (duplicate) {
        newErrors.nombre = `Ya existe un rol con el nombre "${cleanNombre}" en esta aplicación.`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    // Armar lista de recursos asignados
    const recursosAsignados: RecursoPermisoItem[] = [];
    Object.values(matrixState).forEach((item) => {
      if (item.acceso) {
        recursosAsignados.push({
          recursoId: item.recursoId,
          acceso: true,
          permisos: {
            ver: item.ver,
            crear: item.crear,
            editar: item.editar,
            eliminar: item.eliminar,
          },
        });
      }
    });

    const targetApp = mockAplicacionesParaRoles.find((a) => a.id === selectedAppId);

    const savedRol: RolItem = {
      id: rolToEdit ? rolToEdit.id : `rol-${Date.now()}`,
      nombre: cleanNombre,
      descripcion: descripcion.trim(),
      aplicacionId: selectedAppId,
      aplicacionNombre: targetApp?.nombre || "Aplicación Institucional",
      aplicacionCodigo: targetApp?.codigo || "APP",
      estado,
      usuariosCount: rolToEdit ? rolToEdit.usuariosCount : 0,
      recursosAsignados,
      fechaCreacion: rolToEdit ? rolToEdit.fechaCreacion : new Date().toLocaleDateString("es-EC"),
      ultimaActualizacion: "Ahora",
    };

    onSave(savedRol);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden bg-surface"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 text-left">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-bold text-primary">
                {isEditing ? "Editar rol" : "Crear nuevo rol"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Modifica la información general, aplicación y matriz de permisos por recurso."
                  : "Registra un nuevo rol y configura los recursos y permisos asociados en la aplicación."}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <form
          id="rol-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 p-6 space-y-6"
        >
          {/* SECCIÓN A: INFORMACIÓN GENERAL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span>Sección A.</span> Información general
              </h3>
              <Badge tone="primary" appearance="soft" size="sm">
                Datos del rol
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del Rol */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nombre del rol <span className="text-danger">*</span>
                </label>
                <InputGroup size="sm" state={errors.nombre ? "error" : "default"}>
                  <InputGroupInput
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (errors.nombre) {
                        setErrors((prev) => ({ ...prev, nombre: undefined }));
                      }
                    }}
                    placeholder="Ej. Auditor de Procesos, Analista Distrital..."
                    className="text-xs"
                  />
                </InputGroup>
                {errors.nombre && (
                  <p className="text-[11px] text-danger">{errors.nombre}</p>
                )}
              </div>

              {/* Aplicación vinculada */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Aplicación <span className="text-danger">*</span>
                </label>
                <Combobox
                  value={selectedAppId}
                  onValueChange={(val) => {
                    if (val) handleAppChange(val);
                  }}
                >
                  <ComboboxInput
                    placeholder="Selecciona la aplicación"
                    showClear={false}
                    size="sm"
                    className="w-full text-xs"
                  />
                  <ComboboxContent className="min-w-full">
                    <ComboboxList>
                      {mockAplicacionesParaRoles.map((app) => (
                        <ComboboxItem key={app.id} value={app.id}>
                          {app.nombre} ({app.codigo})
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Descripción</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {descripcion.length}/100
                  </span>
                </label>
                <InputGroup multiline>
                  <InputGroupTextarea
                    maxLength={100}
                  value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe brevemente las facultades y el alcance de este rol institucional..."
                    rows={2}
                    className="text-xs"
                  />
                </InputGroup>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 md:col-span-2">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    Estado del rol
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {estado === "Activo"
                      ? "El rol estará activo y disponible para asignación a usuarios."
                      : "El rol estará inactivo. Los usuarios con este rol tendrán su acceso restringido."}
                  </span>
                </div>
                <Switch
                  checked={estado === "Activo"}
                  onCheckedChange={(checked) =>
                    setEstado(checked ? "Activo" : "Inactivo")
                  }
                  variant="primary"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN B: RECURSOS Y PERMISOS */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-warning/10 text-warning-700 dark:text-warning-300 flex items-center justify-center shrink-0">
                  <FolderTree className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Recursos y permisos
                    </h3>
                    <Badge tone="info" appearance="soft" size="sm" className="px-1.5 py-0 font-medium">
                      {countConfigurados} configurados
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Recursos disponibles para{" "}
                    <strong className="text-foreground">
                      {mockAplicacionesParaRoles.find((a) => a.id === selectedAppId)?.nombre}
                    </strong>
                    . Habilita acceso y privilegios.
                  </p>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSelectAll(true, false)}
                        className="size-8 text-muted-foreground hover:text-info hover:bg-info/10"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" variant="info">
                      <p>Habilitar solo lectura</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSelectAll(true, true)}
                        className="size-8 text-muted-foreground hover:text-success hover:bg-success/10"
                      >
                        <CheckSquare2 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" variant="success">
                      <p>Habilitar control total</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSelectAll(false, false)}
                        className="size-8 text-muted-foreground hover:text-danger hover:bg-danger/10"
                      >
                        <Square className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" variant="danger">
                      <p>Limpiar permisos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Buscador de Recursos en la matriz */}
            <Search
              value={resourceSearch}
              onChange={(e) => setResourceSearch(e.target.value)}
              onClear={() => setResourceSearch("")}
              placeholder="Filtrar recursos de esta aplicación..."
              size="sm"
              className="max-w-sm text-xs"
            />

            {/* TABLA DE MATRIZ DE PERMISOS */}
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[380px] text-xs font-bold pl-4">
                    Nombre del recurso
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-xs font-bold">
                    Acceso
                  </TableHead>
                  <TableHead className="w-[85px] text-center text-xs font-bold">
                    Ver
                  </TableHead>
                  <TableHead className="w-[85px] text-center text-xs font-bold">
                    Crear
                  </TableHead>
                  <TableHead className="w-[85px] text-center text-xs font-bold">
                    Editar
                  </TableHead>
                  <TableHead className="w-[85px] text-center text-xs font-bold pr-4">
                    Eliminar
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                      No se encontraron recursos que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResources.map((recurso) => {
                    const isChild = recurso.nivel > 0;
                    const state = matrixState[recurso.id] || {
                      recursoId: recurso.id,
                      acceso: false,
                      ver: false,
                      crear: false,
                      editar: false,
                      eliminar: false,
                    };

                    return (
                      <TableRow
                        key={recurso.id}
                        className={cn(
                          "hover:bg-muted/40 transition-colors",
                          !isChild && "bg-muted/10 font-medium"
                        )}
                      >
                        {/* 1. Nombre del Recurso (con expander jerárquico) */}
                        <TableCell className="pl-4 py-2.5">
                          {(() => {
                            const hasChildren = availableResources.some((c) => c.padreId === recurso.id);
                            const isExpanded = expandedPadres.includes(recurso.id);

                            return (
                              <div
                                className={cn(
                                  "flex items-start gap-2",
                                  isChild && "pl-7"
                                )}
                              >
                                {isChild ? (
                                  <CornerDownRight className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                ) : (
                                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                    {hasChildren ? (
                                      <TooltipProvider delayDuration={150}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => toggleExpandPadre(recurso.id)}
                                              className="size-5 p-0 rounded-md hover:bg-primary/20 text-primary transition-transform duration-300"
                                            >
                                              <ChevronRight
                                                className={cn(
                                                  "size-3.5 transition-transform duration-300",
                                                  isExpanded && "rotate-90"
                                                )}
                                              />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">
                                            <p className="text-xs">
                                              {isExpanded ? "Colapsar recursos secundarios" : "Desplegar recursos secundarios"}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ) : (
                                      <div className="size-5" />
                                    )}
                                    <Folder className="size-4 text-primary shrink-0" />
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "text-xs text-foreground",
                                        !isChild && "font-semibold"
                                      )}
                                    >
                                      {recurso.nombre}
                                    </span>
                                    {!isChild && hasChildren && (
                                      <Badge tone="neutral" appearance="soft" size="sm" className="text-[10px] px-1.5 py-0 font-normal">
                                        {availableResources.filter((c) => c.padreId === recurso.id).length} submódulos
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                                    {recurso.descripcion}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </TableCell>

                        {/* 2. Acceso Habilitado */}
                        <TableCell className="text-center py-2.5">
                          <div className="flex justify-center items-center">
                            <Checkbox
                              checked={state.acceso}
                              onCheckedChange={(checked) =>
                                handleToggleAcceso(recurso.id, Boolean(checked))
                              }
                              variant="primary"
                              size="md"
                              aria-label={`Acceso a ${recurso.nombre}`}
                            />
                          </div>
                        </TableCell>

                        {/* 3. Ver */}
                        <TableCell className="text-center py-2.5">
                          <div className="flex justify-center items-center">
                            <Checkbox
                              checked={state.ver}
                              disabled={!state.acceso}
                              onCheckedChange={(checked) =>
                                handleTogglePermiso(recurso.id, "ver", Boolean(checked))
                              }
                              variant="primary"
                              size="sm"
                              aria-label={`Ver ${recurso.nombre}`}
                            />
                          </div>
                        </TableCell>

                        {/* 4. Crear */}
                        <TableCell className="text-center py-2.5">
                          <div className="flex justify-center items-center">
                            <Checkbox
                              checked={state.crear}
                              disabled={!state.acceso}
                              onCheckedChange={(checked) =>
                                handleTogglePermiso(recurso.id, "crear", Boolean(checked))
                              }
                              variant="primary"
                              size="sm"
                              aria-label={`Crear en ${recurso.nombre}`}
                            />
                          </div>
                        </TableCell>

                        {/* 5. Editar */}
                        <TableCell className="text-center py-2.5">
                          <div className="flex justify-center items-center">
                            <Checkbox
                              checked={state.editar}
                              disabled={!state.acceso}
                              onCheckedChange={(checked) =>
                                handleTogglePermiso(recurso.id, "editar", Boolean(checked))
                              }
                              variant="primary"
                              size="sm"
                              aria-label={`Editar en ${recurso.nombre}`}
                            />
                          </div>
                        </TableCell>

                        {/* 6. Eliminar */}
                        <TableCell className="text-center py-2.5 pr-4">
                          <div className="flex justify-center items-center">
                            <Checkbox
                              checked={state.eliminar}
                              disabled={!state.acceso}
                              onCheckedChange={(checked) =>
                                handleTogglePermiso(recurso.id, "eliminar", Boolean(checked))
                              }
                              variant="error"
                              size="sm"
                              aria-label={`Eliminar en ${recurso.nombre}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </form >

        {/* FOOTER */}
        < DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-between sm:justify-between w-full" >
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5 text-muted-foreground" />
            <span>Al desmarcar «Acceso», se inhabilitan todos los permisos del recurso.</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="neutral"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="rol-form"
              variant="primary"
              className="text-sm gap-1.5"
            >
              <ShieldCheck className="size-4" />
              <span>{isEditing ? "Guardar cambios" : "Crear rol"}</span>
            </Button>
          </div>
        </DialogFooter >
      </DialogContent >
    </Dialog >
  );
}
