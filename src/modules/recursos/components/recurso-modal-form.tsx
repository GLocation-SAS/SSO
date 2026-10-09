"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  FolderTree,
  AlertCircle,
  HelpCircle,
  KeyRound,
  FileCode,
  Info,
  Check,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RecursoItem,
  AplicacionRef,
  mockAplicacionesParaRecursos,
} from "../data/recursos-data";
import { toast } from "sonner";

interface RecursoModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recursoToEdit: RecursoItem | null;
  existingRecursos: RecursoItem[];
  onSave: (recurso: RecursoItem) => void;
}

interface FormErrors {
  nombre?: string;
  codigo?: string;
  aplicacionId?: string;
}

export function RecursoModalForm({
  open,
  onOpenChange,
  recursoToEdit,
  existingRecursos,
  onSave,
}: RecursoModalFormProps) {
  const isEditing = Boolean(recursoToEdit);

  // Form State
  const [nombre, setNombre] = React.useState("");
  const [codigo, setCodigo] = React.useState("");
  const [selectedAppId, setSelectedAppId] = React.useState("gestion-docente");
  const [descripcion, setDescripcion] = React.useState("");
  const [estado, setEstado] = React.useState<"Activo" | "Inactivo">("Activo");
  const [errors, setErrors] = React.useState<FormErrors>({});

  // Reset or initialize on open / change
  React.useEffect(() => {
    if (open) {
      if (recursoToEdit) {
        setNombre(recursoToEdit.nombre);
        setCodigo(recursoToEdit.codigo);
        setSelectedAppId(recursoToEdit.aplicacionId);
        setDescripcion(recursoToEdit.descripcion || "");
        setEstado(recursoToEdit.estado);
      } else {
        setNombre("");
        setCodigo("");
        setSelectedAppId("gestion-docente");
        setDescripcion("");
        setEstado("Activo");
      }
      setErrors({});
    }
  }, [open, recursoToEdit]);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre) {
      newErrors.nombre = "El nombre del recurso es obligatorio.";
    } else if (trimmedNombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    const trimmedCodigo = codigo.trim();
    if (!trimmedCodigo) {
      newErrors.codigo = "El código o identificador es obligatorio.";
    } else if (trimmedCodigo.length < 3) {
      newErrors.codigo = "El código debe tener al menos 3 caracteres.";
    } else {
      // Check uniqueness of code
      const duplicateCode = existingRecursos.find(
        (r) =>
          r.codigo.toLowerCase() === trimmedCodigo.toLowerCase() &&
          r.id !== recursoToEdit?.id
      );
      if (duplicateCode) {
        newErrors.codigo = `El código "${trimmedCodigo}" ya está en uso por el recurso "${duplicateCode.nombre}".`;
      }
    }

    if (!selectedAppId) {
      newErrors.aplicacionId = "Debe asociar el recurso a una aplicación.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Por favor completa los campos obligatorios correctamente.");
      return;
    }

    const app = mockAplicacionesParaRecursos.find((a) => a.id === selectedAppId);

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()}, ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;

    const savedRecurso: RecursoItem = {
      id: recursoToEdit?.id || `rec-${Date.now()}`,
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      aplicacionId: selectedAppId,
      aplicacionNombre: app?.nombre || selectedAppId,
      aplicacionCodigo: app?.codigo || "APP",
      aplicacionIcono: app?.icono,
      estado,
      fechaCreacion: recursoToEdit?.fechaCreacion || formattedDate.split(",")[0],
      ultimaActualizacion: formattedDate,
    };

    onSave(savedRecurso);
    onOpenChange(false);
  };

  const selectedAppObj = mockAplicacionesParaRecursos.find(
    (a) => a.id === selectedAppId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-zinc-950"
      >
        <TooltipProvider delayDuration={150}>
          {/* HEADER */}
          <DialogHeader className="px-6 py-5 border-b border-border bg-white dark:bg-zinc-950 shrink-0 items-start text-left">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning-700 dark:text-warning-300 shrink-0">
                <FolderTree className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
                  {isEditing ? "Editar recurso" : "Nuevo recurso"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {isEditing
                    ? "Modifica la definición y metadatos del recurso en el catálogo institucional."
                    : "Registra un nuevo recurso en el catálogo global de una aplicación."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* BODY */}
          <div className="px-6 py-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-zinc-950">
            {/* Context Note */}
            <div className="rounded-lg border border-warning/20 bg-warning/5 p-3.5 flex items-start gap-3">
              <Sparkles className="size-4 text-warning-700 dark:text-warning-300 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Trazabilidad de recursos:</strong>{" "}
                Cada recurso pertenece exclusivamente a una aplicación. Una vez registrado, podrás asociarlo y configurar sus permisos granulares (ver, crear, editar, eliminar) desde la matriz en la{" "}
                <span className="text-primary font-medium">Gestión de Roles</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Campo 1: Nombre del recurso * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>
                    Nombre del recurso <span className="text-danger">*</span>
                  </span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {nombre.length}/100
                  </span>
                </label>
                <InputGroup
                  size="sm"
                  state={errors.nombre ? "error" : "default"}
                  leftIcon={<KeyRound className="size-4 text-muted-foreground" />}
                >
                  <InputGroupInput
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (errors.nombre) {
                        setErrors((prev) => ({ ...prev, nombre: undefined }));
                      }
                    }}
                    placeholder="Ej: Registro y Consulta de Calificaciones"
                    maxLength={100}
                    aria-invalid={Boolean(errors.nombre)}
                  />
                </InputGroup>
                {errors.nombre ? (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {errors.nombre}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Nombre descriptivo y funcional visible para los usuarios y administradores.
                  </p>
                )}
              </div>

              {/* Campo 2: Código / Identificador * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>
                    Código / identificador <span className="text-danger">*</span>
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Identificador alfanumérico único para control de permisos (API, JWT y base de datos).
                    </TooltipContent>
                  </Tooltip>
                </label>
                <InputGroup
                  size="sm"
                  state={errors.codigo ? "error" : "default"}
                  leftIcon={<FileCode className="size-4 text-muted-foreground" />}
                >
                  <InputGroupInput
                    value={codigo}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      setCodigo(upper);
                      if (errors.codigo) {
                        setErrors((prev) => ({ ...prev, codigo: undefined }));
                      }
                    }}
                    placeholder="Ej: REC-SIGE-CALIF"
                    maxLength={50}
                    className="font-mono uppercase"
                    aria-invalid={Boolean(errors.codigo)}
                  />
                </InputGroup>
                {errors.codigo ? (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {errors.codigo}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Identificador unívoco, se guardará en mayúsculas automáticamente.
                  </p>
                )}
              </div>

              {/* Campo 3: Aplicación * */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>
                    Aplicación <span className="text-danger">*</span>
                  </span>
                </label>
                <Combobox
                  value={selectedAppObj ? `${selectedAppObj.nombre} (${selectedAppObj.codigo})` : ""}
                  onValueChange={(val) => {
                    const found = mockAplicacionesParaRecursos.find(
                      (a) => `${a.nombre} (${a.codigo})` === val || a.id === val || a.nombre === val
                    );
                    if (found) {
                      setSelectedAppId(found.id);
                      if (errors.aplicacionId) {
                        setErrors((prev) => ({ ...prev, aplicacionId: undefined }));
                      }
                    }
                  }}
                >
                  <ComboboxInput
                    placeholder="Seleccione la aplicación..."
                    showClear={false}
                    size="sm"
                    className="w-full"
                    state={errors.aplicacionId ? "error" : "default"}
                    aria-invalid={Boolean(errors.aplicacionId)}
                  />
                  <ComboboxContent className="min-w-full">
                    <ComboboxList>
                      {mockAplicacionesParaRecursos.map((app) => (
                        <ComboboxItem
                          key={app.id}
                          value={`${app.nombre} (${app.codigo})`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{app.nombre}</span>
                            <Badge
                              tone="primary"
                              appearance="soft"
                              size="sm"
                              className="font-mono text-[10px]"
                            >
                              {app.codigo}
                            </Badge>
                          </div>
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {errors.aplicacionId ? (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {errors.aplicacionId}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Aplicación a la que pertenece funcionalmente el recurso.
                  </p>
                )}
              </div>

              {/* Campo 5: Estado: Activo / Inactivo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Estado operativo
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface h-9">
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={estado === "Activo" ? "success" : "neutral"}
                      appearance="soft"
                      size="sm"
                      className="text-xs font-medium"
                    >
                      {estado}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {estado === "Activo"
                        ? "Habilitado para asignación y consumo."
                        : "Temporalmente inhabilitado."}
                    </span>
                  </div>
                  <Switch
                    checked={estado === "Activo"}
                    onCheckedChange={(checked) =>
                      setEstado(checked ? "Activo" : "Inactivo")
                    }
                    aria-label="Cambiar estado del recurso"
                  />
                </div>
              </div>
            </div>

            {/* Campo 4: Descripción */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Descripción</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {descripcion.length}/100
                </span>
              </label>
              <InputGroup multiline size="sm">
                <InputGroupTextarea
                  maxLength={100}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Explica qué funciones o endpoints comprende este recurso..."
                  rows={3}
                />
              </InputGroup>
              <p className="text-[11px] text-muted-foreground">
                Información detallada para administradores que gestionarán la concesión de permisos.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-white dark:bg-zinc-950 shrink-0 flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground">
              <span className="text-danger">*</span> Campos obligatorios
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
                type="button"
                variant="primary"
                onClick={handleSave}
                className="gap-2 text-sm"
              >
                <Check className="size-4" />
                <span>{isEditing ? "Guardar cambios" : "Crear recurso"}</span>
              </Button>
            </div>
          </DialogFooter>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

