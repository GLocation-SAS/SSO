"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  UserCheck,
  User,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import {
  UsuarioItem,
  UsuarioSede,
  UsuarioAsignacion,
  SEDES_CATALOGO,
  SEDES_MINEDUC,
  APLICACIONES_MINEDUC,
  ROLES_APLICACION,
  ROLES_POR_APLICACION,
  ESTADOS_USUARIO,
  TIPOS_DOCUMENTO,
  FUNCIONES_INSTITUCIONALES
} from "../data/usuarios-data";
import { toast } from "sonner";

interface UsuarioSheetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioToEdit?: UsuarioItem | null;
  onSave: (usuario: UsuarioItem) => void;
}

const steps: Step[] = [
  { id: "basicos", title: "Datos básicos", icon: User },
  { id: "sedes", title: "Sedes", icon: MapPin },
  { id: "accesos", title: "Accesos", icon: ShieldCheck },
  { id: "resumen", title: "Resumen", icon: CheckCircle2 },
];

export function UsuarioSheetForm({
  open,
  onOpenChange,
  usuarioToEdit,
  onSave,
}: UsuarioSheetFormProps) {
  const isEditing = Boolean(usuarioToEdit);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  // Datos Básicos
  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [tipoDocumento, setTipoDocumento] = React.useState("Cédula");
  const [identificacion, setIdentificacion] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [estado, setEstado] = React.useState<"Activo" | "Inactivo" | "Pendiente">("Activo");

  // Sedes
  const [selectedSedes, setSelectedSedes] = React.useState<string[]>([]);

  // Accesos (Asignaciones temporales durante la creación)
  const [asignaciones, setAsignaciones] = React.useState<{ sede: string; app: string; rol: string }[]>([]);

  // Errores
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const resetForm = React.useCallback(() => {
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
  }, []);

  React.useEffect(() => {
    if (open) {
      if (usuarioToEdit) {
        setNombre(usuarioToEdit.nombre);
        setApellidos(usuarioToEdit.apellidos);
        setTipoDocumento("Cédula");
        setIdentificacion(usuarioToEdit.documentoIdentificacion || usuarioToEdit.identificacion || "");
        setCorreo(usuarioToEdit.email || usuarioToEdit.correo || "");
        setTelefono(usuarioToEdit.telefono || "");
        setCargo(usuarioToEdit.cargo || "");
        setEstado(usuarioToEdit.estado);
        const sedes = usuarioToEdit.sedes.map(s => s.sedeNombre);
        setSelectedSedes(sedes);
        const asigs = usuarioToEdit.sedes.flatMap(s =>
          s.asignaciones.map(a => ({ sede: s.sedeNombre, app: a.aplicacionNombre, rol: a.rolNombre }))
        );
        setAsignaciones(asigs);
      } else {
        resetForm();
      }
      setActiveStep(0);
      setCompletedSteps([]);
      setErrors({});
    }
  }, [open, usuarioToEdit, resetForm]);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = "El nombre es obligatorio.";
    if (!apellidos.trim()) errs.apellidos = "Los apellidos son obligatorios.";
    if (!identificacion.trim()) errs.identificacion = "La identificación es obligatoria.";
    if (!correo.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) errs.correo = "Correo inválido.";
    if (!cargo.trim()) errs.cargo = "El cargo es obligatorio.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (selectedSedes.length === 0) errs.sedes = "Debe seleccionar al menos una sede.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    // Si queremos obligar a tener al menos una asignación
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
      setActiveStep(prev => Math.min(steps.length - 1, prev + 1));
      setErrors({});
    } else {
      toast.error("Hay errores en el formulario", { description: "Por favor, revisa los campos resaltados." });
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    const userId = usuarioToEdit?.id || `usr-${Date.now()}`;
    // Construir el objeto de guardado según la arquitectura relacional
    const newSedes: UsuarioSede[] = selectedSedes.map(sedeName => {
      const sedeObj = SEDES_CATALOGO.find(s => s.nombre === sedeName);
      const sId = sedeObj?.id || `sede-${Date.now()}`;
      const asignacionesParaSede = asignaciones.filter(a => a.sede === sedeName);
      return {
        sedeId: sId,
        sedeNombre: sedeName,
        asignaciones: asignacionesParaSede.map(a => {
          const rolApp = ROLES_APLICACION.find(ra => ra.aplicacionNombre === a.app && ra.rolNombre === a.rol);
          return {
            id: `usra-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            usuarioId: userId,
            sedeId: sId,
            sedeNombre: sedeName,
            rolAplicacionId: rolApp?.id || `ra-${Date.now()}`,
            aplicacionNombre: a.app,
            rolNombre: a.rol,
            estado: "Activo" as const,
            permisos: []
          };
        })
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
      fechaCreacion: usuarioToEdit?.fechaCreacion || new Date().toLocaleDateString('es-ES'),
      sedes: newSedes
    };

    onSave(savedUser);
    toast.success(isEditing ? "Usuario actualizado correctamente" : "Usuario creado exitosamente");
    onOpenChange(false);
  };

  const addAsignacion = () => {
    if (selectedSedes.length > 0) {
      setAsignaciones([...asignaciones, { sede: selectedSedes[0], app: "", rol: "" }]);
    }
  };

  const updateAsignacion = (index: number, field: keyof typeof asignaciones[0], value: string) => {
    const newAsigs = [...asignaciones];
    newAsigs[index] = { ...newAsigs[index], [field]: value };
    // Si cambia app, resetear rol
    if (field === "app") newAsigs[index].rol = "";
    setAsignaciones(newAsigs);
  };

  const removeAsignacion = (index: number) => {
    setAsignaciones(asignaciones.filter((_, i) => i !== index));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0 overflow-hidden">
        <SheetHeader className="px-6 py-4 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2 text-primary">
            {isEditing ? <UserCheck className="size-5" /> : <UserPlus className="size-5" />}
            <SheetTitle>{isEditing ? "Editar usuario" : "Crear nuevo usuario"}</SheetTitle>
          </div>
          <SheetDescription>
            {isEditing ? "Actualiza la información y accesos del usuario." : "Sigue los pasos para registrar un usuario y asignarle accesos."}
          </SheetDescription>
          <div className="mt-4">
            <Stepper steps={steps} activeStep={activeStep} completedSteps={completedSteps} onStepClick={(step) => {
              if (completedSteps.includes(step) || step < activeStep) setActiveStep(step);
            }} />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {activeStep === 0 && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Tipo de Documento</label>
                  <Combobox value={tipoDocumento} onValueChange={(val) => { if (val) setTipoDocumento(val) }}>
                    <ComboboxInput placeholder="Tipo" showClear={false} />
                    <ComboboxContent>
                      <ComboboxList>
                        {TIPOS_DOCUMENTO.map(t => <ComboboxItem key={t} value={t}>{t}</ComboboxItem>)}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Número de identificación <span className="text-danger">*</span></label>
                  <Input
                    value={identificacion}
                    onChange={e => setIdentificacion(e.target.value)}
                    placeholder="Ej. 1724589632"
                    aria-invalid={!!errors.identificacion}
                  />
                  {errors.identificacion && <p className="text-xs text-danger">{errors.identificacion}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Nombres <span className="text-danger">*</span></label>
                  <Input
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. María"
                    aria-invalid={!!errors.nombre}
                  />
                  {errors.nombre && <p className="text-xs text-danger">{errors.nombre}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Apellidos <span className="text-danger">*</span></label>
                  <Input
                    value={apellidos}
                    onChange={e => setApellidos(e.target.value)}
                    placeholder="Ej. Gómez"
                    aria-invalid={!!errors.apellidos}
                  />
                  {errors.apellidos && <p className="text-xs text-danger">{errors.apellidos}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Correo institucional <span className="text-danger">*</span></label>
                  <InputGroup state={errors.correo ? "error" : "default"}>
                    <InputGroupAddon><InputGroupText><Mail className="size-4" /></InputGroupText></InputGroupAddon>
                    <InputGroupInput
                      type="email"
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="usuario@mineduc.gob.ec"
                    />
                  </InputGroup>
                  {errors.correo && <p className="text-xs text-danger">{errors.correo}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Teléfono</label>
                  <InputGroup>
                    <InputGroupAddon><InputGroupText><Phone className="size-4" /></InputGroupText></InputGroupAddon>
                    <InputGroupInput
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      placeholder="+593 99..."
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Función institucional / Cargo <span className="text-danger">*</span></label>
                  <Combobox value={cargo} onValueChange={(val) => { if (val) setCargo(val) }}>
                    <ComboboxInput placeholder="Seleccionar función..." showClear={false} />
                    <ComboboxContent>
                      <ComboboxList>
                        {FUNCIONES_INSTITUCIONALES.map(f => (
                          <ComboboxItem key={f} value={f}>{f}</ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors.cargo && <p className="text-xs text-danger">{errors.cargo}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Estado <span className="text-danger">*</span></label>
                  <Combobox value={estado} onValueChange={(val) => { if (val) setEstado(val as "Activo" | "Inactivo" | "Pendiente") }}>
                    <ComboboxInput placeholder="Estado" showClear={false} />
                    <ComboboxContent>
                      <ComboboxList>
                        {ESTADOS_USUARIO.map(e => <ComboboxItem key={e} value={e}>{e}</ComboboxItem>)}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <Multiselect
                  label="Sedes institucionales asignadas"
                  required
                  options={SEDES_MINEDUC.map(s => ({ value: s, label: s }))}
                  selected={selectedSedes}
                  onChange={setSelectedSedes}
                  placeholder="Seleccionar sedes..."
                  searchPlaceholder="Buscar sede..."
                  emptyText="No se encontraron sedes."
                  state={errors.sedes ? "error" : "default"}
                  helpText={errors.sedes || "Un usuario puede pertenecer a múltiples sedes simultáneamente."}
                  maxCount={10}
                />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Asignaciones de Acceso</h3>
                <Button variant="outline" size="sm" onClick={addAsignacion} className="gap-2 h-8 text-xs">
                  <Plus className="size-3.5" /> Agregar acceso
                </Button>
              </div>

              {asignaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-xl bg-surface/50 text-center px-4">
                  <ShieldCheck className="size-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm font-medium text-foreground">Sin accesos configurados</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                    El usuario podrá iniciar sesión pero no tendrá acceso a ninguna aplicación.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {asignaciones.map((asig, index) => (
                    <Card key={index} variant="panel" className="p-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid grid-cols-3 gap-3 flex-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sede</label>
                            <Combobox value={asig.sede} onValueChange={(val) => { if (val) updateAsignacion(index, "sede", val) }}>
                              <ComboboxInput placeholder="Sede" showClear={false} />
                              <ComboboxContent>
                                <ComboboxList>
                                  {selectedSedes.map(s => <ComboboxItem key={s} value={s}>{s}</ComboboxItem>)}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Aplicación</label>
                            <Combobox value={asig.app} onValueChange={(val) => { if (val) updateAsignacion(index, "app", val) }}>
                              <ComboboxInput placeholder="Aplicación" showClear={false} />
                              <ComboboxContent>
                                <ComboboxList>
                                  {APLICACIONES_MINEDUC.map(a => <ComboboxItem key={a} value={a}>{a}</ComboboxItem>)}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rol</label>
                            <Combobox value={asig.rol} onValueChange={(val) => { if (val) updateAsignacion(index, "rol", val) }}>
                              <ComboboxInput placeholder="Rol" showClear={false} disabled={!asig.app} />
                              <ComboboxContent>
                                <ComboboxList>
                                  {(asig.app && ROLES_POR_APLICACION[asig.app] ? ROLES_POR_APLICACION[asig.app] : []).map(r =>
                                    <ComboboxItem key={r} value={r}>{r}</ComboboxItem>
                                  )}
                                </ComboboxList>
                              </ComboboxContent>
                            </Combobox>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeAsignacion(index)} className="text-muted-foreground hover:text-danger mt-4 shrink-0">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeStep === 3 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
              <Card variant="panel" className="overflow-hidden">
                <CardHeader className="bg-surface/50 pb-3 border-b border-border/50">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="size-4 text-primary" /> Datos del usuario
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <MetadataList items={[
                    { label: "Nombre", value: `${nombre} ${apellidos}` },
                    { label: "Documento", value: `${tipoDocumento} - ${identificacion}` },
                    { label: "Correo", value: correo },
                    { label: "Cargo", value: cargo },
                  ]} variant="compact" />
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <ShieldCheck className="size-4 text-primary" /> Resumen de Accesos
                </h3>
                {selectedSedes.map(sede => {
                  const asigs = asignaciones.filter(a => a.sede === sede);
                  return (
                    <div key={sede} className="border border-border rounded-xl overflow-hidden bg-surface">
                      <div className="bg-muted/30 px-3 py-2 border-b border-border font-medium text-xs text-foreground flex items-center gap-2">
                        <MapPin className="size-3.5" /> {sede}
                      </div>
                      <div className="p-3 flex flex-col gap-2">
                        {asigs.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">Sin accesos en esta sede.</p>
                        ) : (
                          asigs.map((asig, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                              <span className="font-semibold">{asig.app}</span>
                              <span className="text-muted-foreground">&rarr;</span>
                              <span className="text-muted-foreground">{asig.rol || "Sin rol definido"}</span>
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

        <SheetFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex-row items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={activeStep === 0}>
            Atrás
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              Siguiente paso
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Guardar usuario
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
