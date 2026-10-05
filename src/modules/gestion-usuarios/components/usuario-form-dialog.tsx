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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxTrigger
} from "@/components/ui/combobox";
import {
  UserPlus,
  UserCheck,
  ChevronDown,
  Building2,
  AppWindow,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  UsuarioItem,
  SEDES_MINEDUC,
  APLICACIONES_MINEDUC,
  ESTADOS_USUARIO,
  RolAplicacion,
} from "../data/usuarios-data";

interface UsuarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioToEdit?: UsuarioItem | null;
  onSave: (usuario: UsuarioItem) => void;
}

export function UsuarioFormDialog({
  open,
  onOpenChange,
  usuarioToEdit,
  onSave,
}: UsuarioFormDialogProps) {
  const isEditing = Boolean(usuarioToEdit);

  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [identificacion, setIdentificacion] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [cargo, setCargo] = React.useState("");
  const [sede, setSede] = React.useState<string>(SEDES_MINEDUC[0]);
  const [estado, setEstado] = React.useState<"Activo" | "Inactivo" | "Pendiente">("Activo");
  const [selectedApps, setSelectedApps] = React.useState<string[]>(["SIGE"]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      if (usuarioToEdit) {
        setNombre(usuarioToEdit.nombre);
        setApellidos(usuarioToEdit.apellidos);
        setIdentificacion(usuarioToEdit.identificacion);
        setCorreo(usuarioToEdit.correo);
        setTelefono(usuarioToEdit.telefono);
        setCargo(usuarioToEdit.cargo);
        setSede(usuarioToEdit.sede);
        setEstado(usuarioToEdit.estado);
        setSelectedApps(usuarioToEdit.rolesAplicaciones.map((r) => r.aplicacionNombre));
      } else {
        setNombre("");
        setApellidos("");
        setIdentificacion("");
        setCorreo("");
        setTelefono("+593 9");
        setCargo("");
        setSede(SEDES_MINEDUC[0]);
        setEstado("Activo");
        setSelectedApps(["SIGE"]);
      }
      setError(null);
    }
  }, [open, usuarioToEdit]);

  const toggleApp = (appName: string) => {
    if (selectedApps.includes(appName)) {
      if (selectedApps.length === 1) {
        setError("El usuario debe pertenecer al menos a una aplicación.");
        return;
      }
      setSelectedApps(selectedApps.filter((a) => a !== appName));
    } else {
      setSelectedApps([...selectedApps, appName]);
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificacion || identificacion.length < 10) {
      setError("La cédula debe tener al menos 10 dígitos numéricos.");
      return;
    }
    if (!nombre.trim() || !apellidos.trim()) {
      setError("Los nombres y apellidos son obligatorios.");
      return;
    }
    if (!correo.includes("@")) {
      setError("Ingresa un correo institucional válido.");
      return;
    }
    if (selectedApps.length === 0) {
      setError("Selecciona al menos una aplicación para el usuario.");
      return;
    }

    // Build rolesAplicaciones mapping
    const rolesAplicaciones: RolAplicacion[] = selectedApps.map((appName) => {
      // Find existing if editing
      const existing = usuarioToEdit?.rolesAplicaciones.find(
        (r) => r.aplicacionNombre.toLowerCase() === appName.toLowerCase()
      );
      if (existing) return existing;

      return {
        aplicacionId: appName.toLowerCase(),
        aplicacionNombre: appName,
        rolId: "operador_estandar",
        rolNombre: `Operador ${appName}`,
        recursos: [`${appName.toLowerCase()}:consultar`, `${appName.toLowerCase()}:operar`],
      };
    });

    const savedUser: UsuarioItem = {
      id: usuarioToEdit?.id || `usr-${Date.now().toString().slice(-4)}`,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      identificacion: identificacion.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      cargo: cargo.trim() || "Funcionario Institucional",
      sede,
      estado,
      ultimoAcceso: usuarioToEdit?.ultimoAcceso || "Sin registro",
      fechaCreacion: usuarioToEdit?.fechaCreacion || "Hoy",
      rolesAplicaciones,
    };

    onSave(savedUser);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="default" className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary dark:text-primary-400 mb-1">
            {isEditing ? <UserCheck className="size-5" /> : <UserPlus className="size-5" />}
            <DialogTitle className="text-lg font-heading font-bold text-foreground">
              {isEditing ? "Editar usuario" : "Crear nuevo usuario"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Actualiza la información institucional, sede y asignación de aplicaciones."
              : "Registra un nuevo usuario en Conecta MINEDUC y asigna sus credenciales de acceso inicial."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cédula y Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Cédula / Identificación *
              </label>
              <Input
                placeholder="Ej. 1724589632"
                value={identificacion}
                maxLength={10}
                onChange={(e) => setIdentificacion(e.target.value.replace(/\D/g, ""))}
                className="text-xs font-mono"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Cargo institucional *
              </label>
              <Input
                placeholder="Ej. Especialista de Admisión"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="text-xs"
                required
              />
            </div>
          </div>

          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nombres *
              </label>
              <Input
                placeholder="Ej. María Elena"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="text-xs"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Apellidos *
              </label>
              <Input
                placeholder="Ej. Gómez Andrade"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="text-xs"
                required
              />
            </div>
          </div>

          {/* Correo y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Correo institucional *
              </label>
              <Input
                type="email"
                placeholder="usuario@minedec.gov.co"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="text-xs"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Teléfono de contacto
              </label>
              <Input
                placeholder="+593 9..."
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Sede y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sede */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Sede institucional *
              </label>
              <Combobox
                value={sede}
                onValueChange={(val) => { if(val) setSede(val) }}
              >
                <ComboboxInput placeholder="Selecciona una sede" showClear={false} />
                <ComboboxContent>
                  <ComboboxList>
                    {SEDES_MINEDUC.map((s) => (
                      <ComboboxItem key={s} value={s}>{s}</ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Estado */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Estado de la cuenta *
              </label>
              <Combobox
                value={estado}
                onValueChange={(val) => { if (val) setEstado(val) }}
              >
                <ComboboxInput placeholder="Selecciona estado" showClear={false} />
                <ComboboxContent>
                  <ComboboxList>
                    {ESTADOS_USUARIO.map((est) => (
                      <ComboboxItem key={est} value={est}>{est}</ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          {/* Aplicaciones permitidas */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AppWindow className="size-3.5 text-primary" />
                Aplicaciones autorizadas *
              </label>
              <span className="text-[11px] text-muted-foreground">
                (El usuario puede pertenecer a múltiples aplicaciones)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-muted/30 border border-border/60 rounded-xl p-3">
              {APLICACIONES_MINEDUC.map((app) => {
                const isChecked = selectedApps.includes(app);
                return (
                  <label
                    key={app}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${isChecked
                        ? "bg-primary/5 border-primary/40 text-foreground font-semibold"
                        : "bg-surface border-border/60 text-muted-foreground hover:bg-muted/40"
                      }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleApp(app)}
                    />
                    <span>{app}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" className="gap-2">
              {isEditing ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
              {isEditing ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

