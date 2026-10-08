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
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { AlertCircle, Check, Layers, Globe, FileText, Sparkles } from "lucide-react";
import { AplicacionItem } from "../data/aplicaciones-data";
import { toast } from "sonner";

interface AplicacionModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aplicacionToEdit?: AplicacionItem | null;
  onSave: (app: AplicacionItem) => void;
}

export function AplicacionModalForm({
  open,
  onOpenChange,
  aplicacionToEdit,
  onSave,
}: AplicacionModalFormProps) {
  const isEditing = Boolean(aplicacionToEdit);

  const [nombre, setNombre] = React.useState("");
  const [codigo, setCodigo] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [urlAcceso, setUrlAcceso] = React.useState("");
  const [estado, setEstado] = React.useState<"Activa" | "Inactiva">("Activa");

  const [errors, setErrors] = React.useState<{
    nombre?: string;
    descripcion?: string;
    urlAcceso?: string;
  }>({});

  // Reset or populate fields when modal opens/changes
  React.useEffect(() => {
    if (open) {
      if (aplicacionToEdit) {
        setNombre(aplicacionToEdit.nombre);
        setCodigo(aplicacionToEdit.codigo);
        setDescripcion(aplicacionToEdit.descripcion);
        setUrlAcceso(aplicacionToEdit.urlAcceso);
        setEstado(aplicacionToEdit.estado);
      } else {
        setNombre("");
        setCodigo("");
        setDescripcion("");
        setUrlAcceso("https://");
        setEstado("Activa");
      }
      setErrors({});
    }
  }, [open, aplicacionToEdit]);

  // Auto-generate code if empty
  const handleNombreChange = (val: string) => {
    setNombre(val);
    if (!isEditing && !codigo) {
      const generated = val
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);
      if (generated) setCodigo(generated);
    }
  };

  const validate = () => {
    const newErrors: {
      nombre?: string;
      descripcion?: string;
      urlAcceso?: string;
    } = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre de la aplicación es obligatorio.";
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres.";
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida.";
    } else if (descripcion.trim().length < 10) {
      newErrors.descripcion = "Ingresa una descripción clara de al menos 10 caracteres.";
    }

    if (!urlAcceso.trim() || urlAcceso === "https://") {
      newErrors.urlAcceso = "La URL de acceso institucional es obligatoria.";
    } else if (!/^https?:\/\/.+/i.test(urlAcceso.trim())) {
      newErrors.urlAcceso = "Ingresa una URL válida que empiece con https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    const payload: AplicacionItem = {
      id:
        aplicacionToEdit?.id ||
        nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      codigo: codigo.trim() || "APP",
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      urlAcceso: urlAcceso.trim(),
      estado,
      requiereAtencion: isEditing ? (aplicacionToEdit?.requiereAtencion || false) : true,
      fechaCreacion: aplicacionToEdit?.fechaCreacion || "Hoy, 10:00",
      ultimaActualizacion: "Hoy, ahora",
      usuariosCount: aplicacionToEdit?.usuariosCount || 0,
      rolesCount: aplicacionToEdit?.rolesCount || 0,
      recursosCount: aplicacionToEdit?.recursosCount || 0,
      icono: aplicacionToEdit?.icono || "Layers",
    };

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-white dark:bg-zinc-950"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border shrink-0 items-start text-left bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
                {isEditing ? "Editar aplicación" : "Nueva aplicación"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Actualiza los datos institucionales y el estado operativo de la aplicación."
                  : "Registra una aplicación para centralizar su autenticación, roles y control de accesos."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <form
          id="aplicacion-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 p-6 space-y-5 bg-white dark:bg-zinc-950"
        >
          {/* Banner de flujo arquitectónico */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">
                Flujo administrativo:
              </strong>{" "}
              Al registrar la aplicación podrás configurar sus{" "}
              <span className="text-primary font-medium">Roles</span>, asociar la jerarquía de{" "}
              <span className="text-primary font-medium">Recursos</span> y vincular usuarios por{" "}
              <span className="text-primary font-medium">Sede</span> desde la vista de detalle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Descripción institucional <span className="text-danger">*</span>
              </label>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Finalidad funcional del sistema
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {descripcion.length}/100
                </span>
              </div>
            </div>
            <InputGroup multiline state={errors.descripcion ? "error" : "default"}>
              <InputGroupTextarea
                placeholder="Describe el propósito del sistema, los procesos institucionales que atiende y el tipo de personal que interactúa con él..."
                rows={3}
                maxLength={100}
                  value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="text-sm bg-white dark:bg-zinc-950"
              />
            </InputGroup>
            {errors.descripcion && (
              <p className="text-[11px] text-danger flex items-center gap-1 mt-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.descripcion}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* URL de acceso */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="size-3.5 text-primary" />
                URL de acceso (Endpoint) <span className="text-danger">*</span>
              </label>
              <InputGroup size="sm" state={errors.urlAcceso ? "error" : "default"} leftIcon={<Globe className="size-4 text-muted-foreground" />}>
                <InputGroupInput
                  placeholder="https://sistema.mineduc.gob.ec"
                  value={urlAcceso}
                  onChange={(e) => setUrlAcceso(e.target.value)}
                  className="text-sm font-mono bg-white dark:bg-zinc-950"
                />
              </InputGroup>
              {errors.urlAcceso && (
                <p className="text-[11px] text-danger flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3 shrink-0" />
                  {errors.urlAcceso}
                </p>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Estado operativo <span className="text-danger">*</span>
              </label>
              <Combobox
                value={estado}
                onValueChange={(val) => {
                  if (val === "Activa" || val === "Inactiva") setEstado(val);
                }}
              >
                <ComboboxInput
                  placeholder="Seleccionar estado"
                  showClear={false}
                  size="sm"
                  className="w-full text-xs bg-white dark:bg-zinc-950"
                />
                <ComboboxContent className="min-w-full">
                  <ComboboxList>
                    <ComboboxItem value="Activa">Activa</ComboboxItem>
                    <ComboboxItem value="Inactiva">Inactiva</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-end gap-3 bg-white dark:bg-zinc-950">
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
            form="aplicacion-form"
            variant="primary"
            className="gap-2 text-sm"
          >
            <Check className="size-4" />
            <span>{isEditing ? "Guardar cambios" : "Crear aplicación"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

