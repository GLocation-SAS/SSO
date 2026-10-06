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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { Multiselect } from "@/components/ui/multiselect";
import { Stepper, Step } from "@/components/ui/stepper";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  UsuarioItem,
  UsuarioSede,
  UsuarioSedeRolAplicacion,
  SEDES_CATALOGO,
  APLICACIONES_CATALOGO,
  ROLES_POR_APLICACION,
  ESTADOS_USUARIO,
  TIPOS_DOCUMENTO,
  FUNCIONES_INSTITUCIONALES,
} from "../data/usuarios-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UsuarioModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioToEdit?: UsuarioItem | null;
  onSave: (usuario: UsuarioItem) => void;
}

const createStepIcon = (num: number) => {
  const StepIcon = ({ className }: { className?: string }) => (
    <span className={cn("text-xs font-bold leading-none select-none", className)}>
      {num}
    </span>
  );
  StepIcon.displayName = `StepIcon${num}`;
  return StepIcon;
};

const stepperSteps: Step[] = [
  { id: "identificacion", title: "Identificación", icon: createStepIcon(1) },
  { id: "datos-basicos", title: "Datos básicos", icon: createStepIcon(2) },
  { id: "sedes", title: "Sedes", icon: createStepIcon(3) },
  { id: "accesos", title: "Accesos", icon: createStepIcon(4) },
  { id: "resumen", title: "Resumen", icon: createStepIcon(5) },
];

export function UsuarioModalForm({
  open,
  onOpenChange,
  usuarioToEdit,
  onSave,
}: UsuarioModalFormProps) {
  const isEditing = Boolean(usuarioToEdit);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  // Paso 1: Identificación
  const [tipoDocumento, setTipoDocumento] = React.useState<"Cédula">("Cédula");
  const [identificacion, setIdentificacion] = React.useState("");

  // Paso 2: Datos básicos
  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [estado, setEstado] = React.useState<"Activo" | "Inactivo" | "Pendiente">("Activo");
  const [telefono, setTelefono] = React.useState("");
  const [cargo, setCargo] = React.useState("");

  // Paso 3: Sedes
  const [selectedSedes, setSelectedSedes] = React.useState<string[]>([]);

  // Paso 4: Accesos temporales asignados
  const [asignaciones, setAsignaciones] = React.useState<
    { id: string; sede: string; app: string; rol: string }[]
  >([]);

  // Estado temporal de selectores para agregar acceso dentro del Paso 4
  const [sedeCurrentApp, setSedeCurrentApp] = React.useState<Record<string, string>>({});
  const [sedeCurrentRol, setSedeCurrentRol] = React.useState<Record<string, string>>({});

  // Errores de validación
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Sincronización inicial
  React.useEffect(() => {
    if (open) {
      if (usuarioToEdit) {
        setNombre(usuarioToEdit.nombre || "");
        setApellidos(usuarioToEdit.apellidos || "");
        setTipoDocumento(usuarioToEdit.tipoDocumento || "Cédula");
        setIdentificacion(
          usuarioToEdit.documentoIdentificacion || usuarioToEdit.identificacion || ""
        );
        setCorreo(usuarioToEdit.email || usuarioToEdit.correo || "");
        setTelefono(usuarioToEdit.telefono || "");
        setCargo(usuarioToEdit.cargo || "");
        setEstado(usuarioToEdit.estado || "Activo");

        const sedes = usuarioToEdit.sedes.map((s) => s.sedeNombre);
        setSelectedSedes(sedes);

        const asigs = usuarioToEdit.sedes.flatMap((s) =>
          s.asignaciones.map((a) => ({
            id: a.id || `asig-${Math.random()}`,
            sede: s.sedeNombre,
            app: a.aplicacionNombre,
            rol: a.rolNombre,
          }))
        );
        setAsignaciones(asigs);
      } else {
        resetForm();
      }
      setActiveStep(0);
      setCompletedSteps([]);
      setErrors({});
      setSedeCurrentApp({});
      setSedeCurrentRol({});
    }
  }, [open, usuarioToEdit]);

  const resetForm = () => {
    setNombre("");
    setApellidos("");
    setTipoDocumento("Cédula");
    setIdentificacion("");
    setCorreo("");
    setTelefono("");
    setCargo("");
    setEstado("Activo");
    setSelectedSedes([]);
    setAsignaciones([]);
  };

  // Validaciones por paso
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!tipoDocumento) newErrors.tipoDocumento = "Selecciona el tipo de documento.";
      if (!identificacion.trim()) {
        newErrors.identificacion = "El número de documento es obligatorio.";
      } else if (identificacion.trim().length < 8) {
        newErrors.identificacion = "El documento debe contener al menos 8 caracteres.";
      }
    } else if (stepIndex === 1) {
      if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
      if (!apellidos.trim()) newErrors.apellidos = "Los apellidos son obligatorios.";
      if (!correo.trim()) {
        newErrors.correo = "El correo electrónico es obligatorio.";
      } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo.trim())) {
        newErrors.correo = "Ingresa un correo electrónico válido.";
      }
      if (!estado) newErrors.estado = "El estado es obligatorio.";
    } else if (stepIndex === 2) {
      if (selectedSedes.length === 0) {
        newErrors.sedes = "Debes seleccionar al menos una sede.";
      }
    } else if (stepIndex === 3) {
      if (asignaciones.length === 0) {
        newErrors.asignaciones = "Debes asignar al menos un acceso al usuario.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;

    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps((prev) => [...prev, activeStep]);
    }
    setActiveStep((prev) => Math.min(prev + 1, stepperSteps.length - 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAddAccessToSede = (sedeNombre: string) => {
    const app = sedeCurrentApp[sedeNombre];
    const rol = sedeCurrentRol[sedeNombre];

    if (!app || !rol) {
      toast.error("Selecciona tanto la aplicación como el rol.");
      return;
    }

    const alreadyExists = asignaciones.some(
      (a) => a.sede === sedeNombre && a.app === app && a.rol === rol
    );

    if (alreadyExists) {
      toast.warning("Esta asignación ya ha sido agregada para esta sede.");
      return;
    }

    setAsignaciones((prev) => [
      ...prev,
      {
        id: `asig-temp-${Date.now()}-${Math.random()}`,
        sede: sedeNombre,
        app,
        rol,
      },
    ]);

    // Limpiar selectores para esta sede
    setSedeCurrentApp((prev) => ({ ...prev, [sedeNombre]: "" }));
    setSedeCurrentRol((prev) => ({ ...prev, [sedeNombre]: "" }));
    setErrors((prev) => ({ ...prev, asignaciones: "" }));
  };

  const handleRemoveAccess = (asigId: string) => {
    setAsignaciones((prev) => prev.filter((a) => a.id !== asigId));
  };

  const handleSave = () => {
    if (!validateStep(activeStep)) return;

    // Estructurar usuario con sedes y asignaciones
    const userSedes: UsuarioSede[] = selectedSedes.map((sedeName) => {
      const sedeInfo = SEDES_CATALOGO.find((s) => s.nombre === sedeName);
      const sedeId = sedeInfo?.id || `sede-${Date.now()}`;

      const sedeAsignaciones: UsuarioSedeRolAplicacion[] = asignaciones
        .filter((a) => a.sede === sedeName)
        .map((a) => ({
          id: a.id,
          usuarioId: usuarioToEdit ? usuarioToEdit.id : `usr-${Date.now()}`,
          sedeId,
          sedeNombre: sedeName,
          rolAplicacionId: `ra-${Date.now()}`,
          aplicacionNombre: a.app,
          rolNombre: a.rol,
          estado: "Activo",
          fechaAsignacion: new Date().toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          permisos: [],
        }));

      return {
        sedeId,
        sedeNombre: sedeName,
        asignaciones: sedeAsignaciones,
      };
    });

    const finalUser: UsuarioItem = {
      id: usuarioToEdit ? usuarioToEdit.id : `usr-${Date.now()}`,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      tipoDocumento,
      documentoIdentificacion: identificacion.trim(),
      identificacion: identificacion.trim(),
      email: correo.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      cargo: cargo.trim() || undefined,
      estado,
      fechaCreacion: usuarioToEdit
        ? usuarioToEdit.fechaCreacion
        : new Date().toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
      sedes: userSedes,
    };

    onSave(finalUser);
    toast.success(
      isEditing
        ? `Usuario ${finalUser.nombre} ${finalUser.apellidos} actualizado exitosamente.`
        : `Usuario ${finalUser.nombre} ${finalUser.apellidos} registrado exitosamente.`
    );
    onOpenChange(false);
  };

  // Opciones para Multiselect de Sedes
  const sedeOptions = React.useMemo(() => {
    return SEDES_CATALOGO.map((s) => ({
      value: s.nombre,
      label: s.nombre,
    }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left">
          <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
            {isEditing ? "Editar usuario" : "Crear usuario"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Completa la información en cada paso para registrar al usuario y asignarle accesos.
          </DialogDescription>
        </DialogHeader>

        {/* STEPPER TOP BAR */}
        <div className="px-6 py-4 border-b border-border bg-muted/20 shrink-0">
          <Stepper
            steps={stepperSteps}
            activeStep={activeStep}
            completedSteps={completedSteps}
            onStepClick={(index) => {
              // Permitir navegar hacia atrás o a pasos ya validados
              if (index < activeStep || completedSteps.includes(index - 1)) {
                setActiveStep(index);
              }
            }}
          />
        </div>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* PASO 1: IDENTIFICACIÓN */}
          {activeStep === 0 && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de documento */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tipo de documento <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={tipoDocumento}
                    onValueChange={(val) => {
                      if (val) setTipoDocumento(val as "Cédula");
                    }}
                  >
                    <ComboboxInput
                      placeholder="Seleccionar tipo..."
                      showClear={false}
                      className="w-full h-10 text-xs"
                    />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {TIPOS_DOCUMENTO.map((tipo) => (
                          <ComboboxItem key={tipo} value={tipo}>
                            {tipo}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors.tipoDocumento && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.tipoDocumento}
                    </p>
                  )}
                </div>

                {/* N.º de documento */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    N.º de documento <span className="text-danger">*</span>
                  </label>
                  <Input
                    placeholder="1719874563"
                    value={identificacion}
                    onChange={(e) => {
                      setIdentificacion(e.target.value);
                      if (errors.identificacion) {
                        setErrors((prev) => ({ ...prev, identificacion: "" }));
                      }
                    }}
                    className={cn(
                      "h-10 text-xs font-mono",
                      errors.identificacion && "border-danger focus-visible:ring-danger"
                    )}
                  />
                  {errors.identificacion && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.identificacion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: DATOS BÁSICOS */}
          {activeStep === 1 && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <Input
                    placeholder="Ej: María Fernanda"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: "" }));
                    }}
                    className={cn(
                      "h-10 text-xs",
                      errors.nombre && "border-danger focus-visible:ring-danger"
                    )}
                  />
                  {errors.nombre && (
                    <p className="text-[11px] text-danger font-medium">{errors.nombre}</p>
                  )}
                </div>

                {/* Apellidos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Apellidos <span className="text-danger">*</span>
                  </label>
                  <Input
                    placeholder="Ej: Gómez Andrade"
                    value={apellidos}
                    onChange={(e) => {
                      setApellidos(e.target.value);
                      if (errors.apellidos)
                        setErrors((prev) => ({ ...prev, apellidos: "" }));
                    }}
                    className={cn(
                      "h-10 text-xs",
                      errors.apellidos && "border-danger focus-visible:ring-danger"
                    )}
                  />
                  {errors.apellidos && (
                    <p className="text-[11px] text-danger font-medium">
                      {errors.apellidos}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Correo electrónico */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Correo electrónico <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="nombre.apellido@mineduc.gob.ec"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      if (errors.correo) setErrors((prev) => ({ ...prev, correo: "" }));
                    }}
                    className={cn(
                      "h-10 text-xs",
                      errors.correo && "border-danger focus-visible:ring-danger"
                    )}
                  />
                  {errors.correo && (
                    <p className="text-[11px] text-danger font-medium">{errors.correo}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Estado <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={estado}
                    onValueChange={(val) => {
                      if (val) setEstado(val as "Activo" | "Inactivo" | "Pendiente");
                    }}
                  >
                    <ComboboxInput
                      placeholder="Seleccionar estado..."
                      showClear={false}
                      className="w-full h-10 text-xs"
                    />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {ESTADOS_USUARIO.map((est) => (
                          <ComboboxItem key={est} value={est}>
                            {est}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>

              {/* Campos opcionales institucionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Cargo / Función institucional
                  </label>
                  <Combobox
                    value={cargo}
                    onValueChange={(val) => {
                      if (val) setCargo(val);
                    }}
                  >
                    <ComboboxInput
                      placeholder="Seleccionar función..."
                      showClear={false}
                      className="w-full h-10 text-xs"
                    />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {FUNCIONES_INSTITUCIONALES.map((f) => (
                          <ComboboxItem key={f} value={f}>
                            {f}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Teléfono de contacto
                  </label>
                  <Input
                    placeholder="+593 99 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: SEDES */}
          {activeStep === 2 && (
            <div className="space-y-5 max-w-2xl mx-auto py-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Sedes del usuario
                </h3>
                <p className="text-xs text-muted-foreground">
                  Selecciona las sedes donde el usuario prestará servicios o tendrá permisos.
                </p>
              </div>

              <div className="space-y-2">
                <Multiselect
                  options={sedeOptions}
                  selected={selectedSedes}
                  onChange={(newSelected) => {
                    setSelectedSedes(newSelected);
                    if (errors.sedes) setErrors((prev) => ({ ...prev, sedes: "" }));
                  }}
                  placeholder="Buscar y seleccionar sedes..."
                  searchPlaceholder="Buscar por nombre de sede..."
                  className="w-full"
                />
                {errors.sedes && (
                  <p className="text-[11px] text-danger font-medium">{errors.sedes}</p>
                )}
              </div>

              {/* Visualización de Badges / Chips seleccionados */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Sedes seleccionadas ({selectedSedes.length})
                </span>
                {selectedSedes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No has seleccionado ninguna sede aún.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSedes.map((sedeName) => (
                      <Badge
                        key={sedeName}
                        tone="primary"
                        appearance="soft"
                        className="text-xs px-3 py-1 flex items-center gap-1.5 font-medium"
                      >
                        <Building2 className="size-3.5" />
                        <span>{sedeName}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSedes((prev) => prev.filter((s) => s !== sedeName))
                          }
                          className="hover:opacity-75 cursor-pointer ml-1"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 4: ACCESOS */}
          {activeStep === 3 && (
            <div className="space-y-5 max-w-3xl mx-auto py-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Asignación de accesos
                </h3>
                <p className="text-xs text-muted-foreground">
                  Asigna las aplicaciones y roles correspondientes según las sedes seleccionadas.
                </p>
                {errors.asignaciones && (
                  <p className="text-xs text-danger font-medium pt-1">
                    {errors.asignaciones}
                  </p>
                )}
              </div>

              {selectedSedes.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  Regresa al paso anterior y selecciona al menos una sede.
                </div>
              ) : (
                <div className="space-y-5">
                  {selectedSedes.map((sedeNombre) => {
                    const sedeAsignaciones = asignaciones.filter(
                      (a) => a.sede === sedeNombre
                    );
                    const currentApp = sedeCurrentApp[sedeNombre] || "";
                    const currentRol = sedeCurrentRol[sedeNombre] || "";
                    const rolesForApp = currentApp ? ROLES_POR_APLICACION[currentApp] || [] : [];

                    return (
                      <div
                        key={sedeNombre}
                        className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs"
                      >
                        {/* Header de la Card de Sede */}
                        <div className="bg-muted/40 px-4 py-3 border-b border-border flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <Building2 className="size-4 text-primary shrink-0" />
                            <span>{sedeNombre}</span>
                          </div>
                          <Badge
                            tone="neutral"
                            appearance="soft"
                            className="text-xs font-semibold"
                          >
                            {sedeAsignaciones.length}{" "}
                            {sedeAsignaciones.length === 1
                              ? "asignación"
                              : "asignaciones"}
                          </Badge>
                        </div>

                        {/* Selectores de Aplicación y Rol */}
                        <div className="p-4 bg-background border-b border-border/60">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-5 space-y-1">
                              <label className="text-[11px] font-semibold text-foreground">
                                Aplicación
                              </label>
                              <Combobox
                                value={currentApp}
                                onValueChange={(val) => {
                                  if (val) {
                                    setSedeCurrentApp((prev) => ({
                                      ...prev,
                                      [sedeNombre]: val,
                                    }));
                                    setSedeCurrentRol((prev) => ({
                                      ...prev,
                                      [sedeNombre]: "",
                                    }));
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

                            <div className="md:col-span-5 space-y-1">
                              <label className="text-[11px] font-semibold text-foreground">
                                Rol
                              </label>
                              <Combobox
                                value={currentRol}
                                onValueChange={(val) => {
                                  if (val) {
                                    setSedeCurrentRol((prev) => ({
                                      ...prev,
                                      [sedeNombre]: val,
                                    }));
                                  }
                                }}
                                disabled={!currentApp}
                              >
                                <ComboboxInput
                                  placeholder={
                                    currentApp
                                      ? "Seleccionar rol..."
                                      : "Selecciona aplicación"
                                  }
                                  showClear={false}
                                  className="w-full h-9 text-xs"
                                />
                                <ComboboxContent className="min-w-full">
                                  <ComboboxList>
                                    {rolesForApp.map((rol) => (
                                      <ComboboxItem key={rol} value={rol}>
                                        {rol}
                                      </ComboboxItem>
                                    ))}
                                  </ComboboxList>
                                </ComboboxContent>
                              </Combobox>
                            </div>

                            <div className="md:col-span-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAddAccessToSede(sedeNombre)}
                                disabled={!currentApp || !currentRol}
                                className="w-full h-9 text-xs gap-1"
                              >
                                <Plus className="size-3.5" />
                                <span>Agregar</span>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Listado de asignaciones de la Sede */}
                        <div className="p-0">
                          {sedeAsignaciones.length === 0 ? (
                            <p className="p-4 text-xs text-muted-foreground text-center italic">
                              Sin accesos agregados en esta sede aún.
                            </p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b border-border/60 bg-muted/20">
                                  <TableHead className="text-xs font-semibold h-8 text-foreground pl-4">
                                    Aplicación
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold h-8 text-foreground">
                                    Rol
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold h-8 text-right pr-4 text-foreground w-20">
                                    Acciones
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sedeAsignaciones.map((asig) => (
                                  <TableRow
                                    key={asig.id}
                                    className="border-b border-border/40 hover:bg-muted/10 last:border-b-0"
                                  >
                                    <TableCell className="py-2 pl-4 text-xs font-semibold text-foreground">
                                      {asig.app}
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-muted-foreground">
                                      {asig.rol}
                                    </TableCell>
                                    <TableCell className="py-2 pr-4 text-right">
                                      <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => handleRemoveAccess(asig.id)}
                                        className="text-muted-foreground hover:text-danger"
                                      >
                                        <Trash2 className="size-3.5" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PASO 5: RESUMEN */}
          {activeStep === 4 && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Resumen del nuevo usuario
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verifica que los datos y accesos configurados sean correctos antes de guardar.
                </p>
              </div>

              {/* Sección 1: Datos del usuario */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Datos del usuario
                </h4>

                <div className="rounded-xl border border-border bg-surface p-4 divide-y divide-border/60 text-sm">
                  <div className="flex items-center justify-between py-2 first:pt-0">
                    <span className="text-xs text-muted-foreground">Nombre completo</span>
                    <span className="font-semibold text-foreground">
                      {nombre} {apellidos}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">Tipo de documento</span>
                    <span className="font-semibold text-foreground">{tipoDocumento}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">N.º de documento</span>
                    <span className="font-semibold text-foreground font-mono">
                      {identificacion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">Correo electrónico</span>
                    <span className="font-semibold text-foreground">{correo}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 last:pb-0">
                    <span className="text-xs text-muted-foreground">Estado</span>
                    <Badge
                      tone={
                        estado === "Activo"
                          ? "success"
                          : estado === "Inactivo"
                            ? "neutral"
                            : "warning"
                      }
                      appearance="soft"
                      className="text-xs font-semibold"
                    >
                      {estado}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Sección 2: Accesos a crear */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Accesos a registrar ({asignaciones.length})
                </h4>

                <div className="space-y-3">
                  {selectedSedes.map((sedeNombre) => {
                    const sedeAsigs = asignaciones.filter((a) => a.sede === sedeNombre);
                    if (sedeAsigs.length === 0) return null;

                    return (
                      <div
                        key={sedeNombre}
                        className="rounded-xl border border-border bg-surface p-4 space-y-2.5"
                      >
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <Building2 className="size-4 text-primary shrink-0" />
                          <span>{sedeNombre}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sedeAsigs.map((asig) => (
                            <div
                              key={asig.id}
                              className="px-3 py-2 rounded-lg bg-muted/40 border border-border/60 text-xs flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-foreground block">
                                  {asig.app}
                                </span>
                                <span className="text-muted-foreground text-[11px]">
                                  {asig.rol}
                                </span>
                              </div>
                              <Badge tone="success" appearance="soft" size="sm" className="text-[10px]">
                                Activo
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="neutral"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            {activeStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                <span>Anterior</span>
              </Button>
            )}
          </div>

          <div>
            {activeStep < stepperSteps.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="gap-1.5"
              >
                <span>Siguiente</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSave}
                className="gap-1.5"
              >
                <Check className="size-3.5" />
                <span>{isEditing ? "Guardar cambios" : "Crear usuario"}</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
