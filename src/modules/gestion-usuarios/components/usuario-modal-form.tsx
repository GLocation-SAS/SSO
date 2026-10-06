"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { Multiselect } from "@/components/ui/multiselect";
import { MetadataList } from "@/components/ui/data-display";
import { Stepper, Step } from "@/components/ui/stepper";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  UserCheck,
  User,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Layers,
} from "lucide-react";
import {
  UsuarioItem,
  UsuarioSede,
  SEDES_CATALOGO,
  SEDES_MINEDUC,
  APLICACIONES_MINEDUC,
  ROLES_APLICACION,
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

const creationSteps: Step[] = [
  { id: "basicos", title: "Datos básicos", icon: User },
  { id: "sedes", title: "Sedes", icon: MapPin },
  { id: "accesos", title: "Accesos", icon: ShieldCheck },
  { id: "resumen", title: "Resumen", icon: CheckCircle2 },
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

  // Datos Básicos
  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [tipoDocumento, setTipoDocumento] = React.useState<"Cédula">("Cédula");
  const [identificacion, setIdentificacion] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [estado, setEstado] = React.useState<"Activo" | "Inactivo" | "Pendiente">("Activo");

  // Sedes
  const [selectedSedes, setSelectedSedes] = React.useState<string[]>([]);

  // Accesos (Asignaciones temporales en el formulario)
  const [asignaciones, setAsignaciones] = React.useState<{ sede: string; app: string; rol: string }[]>([]);

  // Errores
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      if (usuarioToEdit) {
        setNombre(usuarioToEdit.nombre);
        setApellidos(usuarioToEdit.apellidos);
        setTipoDocumento(usuarioToEdit.tipoDocumento || "Cédula");
        setIdentificacion(usuarioToEdit.documentoIdentificacion || usuarioToEdit.identificacion || "");
        setCorreo(usuarioToEdit.email || usuarioToEdit.correo || "");
        setTelefono(usuarioToEdit.telefono || "");
        setCargo(usuarioToEdit.cargo || "");
        setEstado(usuarioToEdit.estado);
        const sedes = usuarioToEdit.sedes.map((s) => s.sedeNombre);
        setSelectedSedes(sedes);
        const asigs = usuarioToEdit.sedes.flatMap((s) =>
          s.asignaciones.map((a) => ({ sede: s.sedeNombre, app: a.aplicacionNombre, rol: a.rolNombre }))
        );
        setAsignaciones(asigs);
      } else {
        resetForm();
      }
      setActiveStep(0);
      setCompletedSteps([]);
      setErrors({});
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

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = "El nombre es obligatorio.";
    if (!apellidos.trim()) errs.apellidos = "Los apellidos son obligatorios.";
    if (!identificacion.trim()) errs.identificacion = "La identificación es obligatoria.";
    if (!correo.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) errs.correo = "Correo institucional inválido.";
    if (!cargo.trim()) errs.cargo = "La función/cargo es obligatoria.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (selectedSedes.length === 0) errs.sedes = "Debe asignar al menos una sede institucional.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (activeStep === 0) isValid = validateStep1();
    else if (activeStep === 1) isValid = validateStep2();
    else if (activeStep === 2) isValid = validateStep3();

    if (isValid) {
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
      setActiveStep((prev) => Math.min(creationSteps.length - 1, prev + 1));
      setErrors({});
    } else {
      toast.error("Campos obligatorios incompletos", {
        description: "Revisa los campos requeridos señalados en rojo.",
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    // Validar datos básicos y sedes antes de guardar
    if (!validateStep1()) {
      setActiveStep(0);
      toast.error("Datos básicos incompletos");
      return;
    }
    if (!validateStep2()) {
      setActiveStep(1);
      toast.error("Debe seleccionar al menos una sede");
      return;
    }

    const userId = usuarioToEdit?.id || `usr-${Date.now()}`;
    const newSedes: UsuarioSede[] = selectedSedes.map((sedeName) => {
      const sedeObj = SEDES_CATALOGO.find((s) => s.nombre === sedeName);
      const sId = sedeObj?.id || `sede-${Date.now()}`;
      const asignacionesParaSede = asignaciones.filter((a) => a.sede === sedeName);
      return {
        sedeId: sId,
        sedeNombre: sedeName,
        asignaciones: asignacionesParaSede.map((a) => {
          const rolApp = ROLES_APLICACION.find(
            (ra) => ra.aplicacionNombre === a.app && ra.rolNombre === a.rol
          );
          return {
            id: `usra-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            usuarioId: userId,
            sedeId: sId,
            sedeNombre: sedeName,
            rolAplicacionId: rolApp?.id || `ra-${Date.now()}`,
            aplicacionNombre: a.app,
            rolNombre: a.rol,
            estado: "Activo" as const,
            permisos: [],
          };
        }),
      };
    });

    const savedUser: UsuarioItem = {
      id: userId,
      nombre,
      apellidos,
      tipoDocumento: "Cédula",
      documentoIdentificacion: identificacion,
      email: correo,
      identificacion,
      correo,
      telefono,
      cargo,
      estado,
      fechaCreacion: usuarioToEdit?.fechaCreacion || new Date().toLocaleDateString("es-ES"),
      sedes: newSedes,
    };

    onSave(savedUser);
    toast.success(isEditing ? "Usuario actualizado correctamente" : "Usuario creado exitosamente");
    onOpenChange(false);
  };

  const addAsignacion = () => {
    if (selectedSedes.length > 0) {
      setAsignaciones([...asignaciones, { sede: selectedSedes[0], app: "", rol: "" }]);
    } else {
      toast.warning("Primero asigna sedes", {
        description: "Debes seleccionar al menos una sede en el paso previo.",
      });
    }
  };

  const updateAsignacion = (index: number, field: keyof typeof asignaciones[0], value: string) => {
    const newAsigs = [...asignaciones];
    newAsigs[index] = { ...newAsigs[index], [field]: value };
    if (field === "app") newAsigs[index].rol = "";
    setAsignaciones(newAsigs);
  };

  const removeAsignacion = (index: number) => {
    setAsignaciones(asignaciones.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col [&>div.relative]:w-full [&>div.relative]:items-stretch [&>div.relative]:text-left [&>div.relative]:gap-0"
        showCloseButton={true}
      >
        {/* Cabecera del Modal */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left pr-14">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              {isEditing ? <UserCheck className="size-6" /> : <UserPlus className="size-6" />}
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-left text-xl font-heading font-bold text-foreground">
                {isEditing ? `Editar usuario: ${usuarioToEdit?.nombre} ${usuarioToEdit?.apellidos}` : "Crear nuevo usuario"}
              </DialogTitle>
              <DialogDescription className="text-left text-xs text-muted-foreground max-w-none">
                {isEditing
                  ? "Actualiza la información institucional, sedes y asignaciones de rol."
                  : "Completa el formulario para registrar el usuario institucional y sus accesos."}
              </DialogDescription>
            </div>
          </div>

          {/* Stepper para creación o Tabs para edición */}
          <div className="w-full mt-4">
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2 bg-muted/40 p-1 rounded-lg border border-border">
                {[
                  { id: 0, label: "1. Datos básicos", icon: User },
                  { id: 1, label: "2. Sedes", icon: MapPin },
                  { id: 2, label: "3. Accesos", icon: ShieldCheck },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStep(tab.id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer",
                      activeStep === tab.id
                        ? "bg-surface text-primary shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <Stepper
                steps={creationSteps}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={(step) => {
                  if (completedSteps.includes(step) || step < activeStep) {
                    setActiveStep(step);
                  }
                }}
              />
            )}
          </div>
        </DialogHeader>

        {/* Cuerpo del Modal con Contenido por Paso */}
        <div className="flex-1 overflow-y-auto p-6 bg-background min-h-0">
          {/* PASO 1: Datos Básicos */}
          {activeStep === 0 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tipo de Documento <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={tipoDocumento}
                    onValueChange={(val) => {
                      if (val === "Cédula") setTipoDocumento("Cédula");
                    }}
                  >
                    <ComboboxInput placeholder="Tipo" showClear={false} className="w-full h-9 text-xs" />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {TIPOS_DOCUMENTO.map((t) => (
                          <ComboboxItem key={t} value={t}>
                            {t}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Número de identificación <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    placeholder="Ej. 1719874563"
                    className="h-9 text-xs"
                    aria-invalid={!!errors.identificacion}
                  />
                  {errors.identificacion && (
                    <p className="text-[11px] text-danger">{errors.identificacion}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nombres <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María Fernanda"
                    className="h-9 text-xs"
                    aria-invalid={!!errors.nombre}
                  />
                  {errors.nombre && <p className="text-[11px] text-danger">{errors.nombre}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Apellidos <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej. Gómez Andrade"
                    className="h-9 text-xs"
                    aria-invalid={!!errors.apellidos}
                  />
                  {errors.apellidos && <p className="text-[11px] text-danger">{errors.apellidos}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Correo institucional <span className="text-danger">*</span>
                  </label>
                  <InputGroup state={errors.correo ? "error" : "default"} className="h-9">
                    <InputGroupAddon>
                      <InputGroupText>
                        <Mail className="size-3.5" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="usuario@mineduc.gob.ec"
                      className="text-xs"
                    />
                  </InputGroup>
                  {errors.correo && <p className="text-[11px] text-danger">{errors.correo}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Teléfono institucional / móvil</label>
                  <InputGroup className="h-9">
                    <InputGroupAddon>
                      <InputGroupText>
                        <Phone className="size-3.5" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+593 99..."
                      className="text-xs"
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Función institucional / Cargo <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={cargo}
                    onValueChange={(val) => {
                      if (val) setCargo(val);
                    }}
                  >
                    <ComboboxInput placeholder="Seleccionar función..." showClear={false} className="w-full h-9 text-xs" />
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
                  {errors.cargo && <p className="text-[11px] text-danger">{errors.cargo}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Estado general <span className="text-danger">*</span>
                  </label>
                  <Combobox
                    value={estado}
                    onValueChange={(val) => {
                      if (val) setEstado(val as "Activo" | "Inactivo" | "Pendiente");
                    }}
                  >
                    <ComboboxInput placeholder="Estado" showClear={false} className="w-full h-9 text-xs" />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {ESTADOS_USUARIO.map((e) => (
                          <ComboboxItem key={e} value={e}>
                            {e}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Sedes Institucionales */}
          {activeStep === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="bg-muted/30 p-3.5 rounded-xl border border-border flex items-start gap-3">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-foreground">Arquitectura de Asignación por Sede</span>
                  <p className="text-muted-foreground">
                    Un usuario puede pertenecer a una o múltiples sedes institucionales simultáneamente (Planta Central, Zonas o Distritos).
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Multiselect
                  label="Sedes institucionales asignadas"
                  required
                  options={SEDES_MINEDUC.map((s) => ({ value: s, label: s }))}
                  selected={selectedSedes}
                  onChange={setSelectedSedes}
                  placeholder="Seleccionar una o más sedes..."
                  searchPlaceholder="Buscar sede..."
                  emptyText="No se encontraron sedes coincidentes."
                  state={errors.sedes ? "error" : "default"}
                  helpText={errors.sedes || "Selecciona las sedes donde el usuario prestará servicios."}
                  maxCount={10}
                />
              </div>
            </div>
          )}

          {/* PASO 3: Asignaciones de Acceso */}
          {activeStep === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    Asignaciones de Acceso
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Relación: Sede &rarr; Aplicación &rarr; Rol de acceso institucional
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addAsignacion} className="gap-2 h-8 text-xs">
                  <Plus className="size-3.5" /> Agregar acceso
                </Button>
              </div>

              {asignaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-xl bg-surface/50 text-center px-4">
                  <ShieldCheck className="size-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm font-semibold text-foreground">Sin asignaciones de acceso</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                    El usuario podrá iniciar sesión en el portal pero no tendrá roles activos en las aplicaciones.
                  </p>
                  <Button variant="outline" size="sm" onClick={addAsignacion} className="gap-1.5 mt-3 text-xs">
                    <Plus className="size-3.5" /> Agregar primera asignación
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {asignaciones.map((asig, index) => (
                    <Card key={index} variant="panel" className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                          {/* Sede */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Sede
                            </label>
                            <Combobox
                              value={asig.sede}
                              onValueChange={(val) => {
                                if (val) updateAsignacion(index, "sede", val);
                              }}
                            >
                              <ComboboxInput placeholder="Sede" showClear={false} className="w-full h-8 text-xs" />
                              <ComboboxContent className="min-w-full">
                                <ComboboxList>
                                  {selectedSedes.map((s) => (
                                    <ComboboxItem key={s} value={s}>
                                      {s}
                                    </ComboboxItem>
                                  ))}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          </div>

                          {/* Aplicación */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Aplicación
                            </label>
                            <Combobox
                              value={asig.app}
                              onValueChange={(val) => {
                                if (val) updateAsignacion(index, "app", val);
                              }}
                            >
                              <ComboboxInput placeholder="Aplicación" showClear={false} className="w-full h-8 text-xs" />
                              <ComboboxContent className="min-w-full">
                                <ComboboxList>
                                  {APLICACIONES_MINEDUC.map((a) => (
                                    <ComboboxItem key={a} value={a}>
                                      {a}
                                    </ComboboxItem>
                                  ))}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          </div>

                          {/* Rol */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Rol Institucional
                            </label>
                            <Combobox
                              value={asig.rol}
                              onValueChange={(val) => {
                                if (val) updateAsignacion(index, "rol", val);
                              }}
                              disabled={!asig.app}
                            >
                              <ComboboxInput
                                placeholder={asig.app ? "Seleccionar rol..." : "Primero elija app"}
                                showClear={false}
                                className="w-full h-8 text-xs"
                              />
                              <ComboboxContent className="min-w-full">
                                <ComboboxList>
                                  {(asig.app && ROLES_POR_APLICACION[asig.app]
                                    ? ROLES_POR_APLICACION[asig.app]
                                    : []
                                  ).map((r) => (
                                    <ComboboxItem key={r} value={r}>
                                      {r}
                                    </ComboboxItem>
                                  ))}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeAsignacion(index)}
                          className="text-muted-foreground hover:text-danger mt-4 shrink-0"
                          title="Eliminar asignación"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASO 4: Resumen Final (modo creación) */}
          {activeStep === 3 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              <Card variant="panel" className="overflow-hidden">
                <CardHeader className="bg-surface/50 py-2.5 px-4 border-b border-border/50">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <User className="size-3.5 text-primary" /> Datos del usuario a registrar
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <MetadataList
                    items={[
                      { label: "Nombre completo", value: `${nombre} ${apellidos}` },
                      { label: "Documento", value: `${tipoDocumento} &bull; ${identificacion}` },
                      { label: "Correo", value: correo },
                      { label: "Cargo", value: cargo },
                      { label: "Estado", value: estado },
                    ]}
                    variant="compact"
                  />
                </CardContent>
              </Card>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Layers className="size-3.5 text-primary" /> Sedes y Accesos configurados
                </h4>
                {selectedSedes.map((sede) => {
                  const asigs = asignaciones.filter((a) => a.sede === sede);
                  return (
                    <div key={sede} className="border border-border rounded-xl overflow-hidden bg-surface">
                      <div className="bg-muted/40 px-3 py-2 border-b border-border font-semibold text-xs text-foreground flex items-center gap-2">
                        <MapPin className="size-3.5 text-primary" /> {sede}
                      </div>
                      <div className="p-3 flex flex-col gap-1.5">
                        {asigs.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">Sin roles asignados en esta sede.</p>
                        ) : (
                          asigs.map((asig, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="font-semibold">{asig.app}</span>
                              <span className="text-muted-foreground">&rarr;</span>
                              <span className="text-muted-foreground">{asig.rol || "Sin rol"}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={activeStep === 0 ? () => onOpenChange(false) : handleBack}
            className="text-xs h-9 px-3"
          >
            {activeStep === 0 ? "Cancelar" : "Atrás"}
          </Button>

          {isEditing ? (
            <Button variant="primary" onClick={handleSubmit} className="text-xs h-9 px-4">
              Guardar cambios
            </Button>
          ) : activeStep < creationSteps.length - 1 ? (
            <Button variant="primary" onClick={handleNext} className="text-xs h-9 px-4">
              Siguiente paso
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} className="text-xs h-9 px-4">
              Guardar usuario
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
