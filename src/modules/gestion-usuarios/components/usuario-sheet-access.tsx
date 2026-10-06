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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheck,
  MapPin,
  AppWindow,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Users,
  Info,
  Layers,
  Check
} from "lucide-react";
import {
  UsuarioItem,
  UsuarioSede,
  UsuarioSedeRolAplicacion,
  SEDES_CATALOGO,
  SEDES_MINEDUC,
  APLICACIONES_CATALOGO,
  APLICACIONES_MINEDUC,
  ROLES_APLICACION,
  ROL_APLICACION_SEDE,
  ROLES_POR_APLICACION
} from "../data/usuarios-data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

interface UsuarioSheetAccessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UsuarioItem | null;
  allUsuarios?: UsuarioItem[];
  onSave: (usuario: UsuarioItem) => void;
}

export function UsuarioSheetAccess({
  open,
  onOpenChange,
  usuario,
  allUsuarios = [],
  onSave,
}: UsuarioSheetAccessProps) {
  const [workingUser, setWorkingUser] = React.useState<UsuarioItem | null>(null);
  const [selectedAsignacionId, setSelectedAsignacionId] = React.useState<string>("");

  // Estado para la asignación contextual (Flujo: Sede -> App -> Rol -> Capacidad -> Confirmar)
  const [newSede, setNewSede] = React.useState<string>("");
  const [newApp, setNewApp] = React.useState<string>("");
  const [newRol, setNewRol] = React.useState<string>("");

  React.useEffect(() => {
    if (open && usuario) {
      setWorkingUser(JSON.parse(JSON.stringify(usuario))); // Deep copy
      const firstAsig = usuario.sedes[0]?.asignaciones[0];
      setSelectedAsignacionId(firstAsig?.id || "");
      // Pre-seleccionar primera sede del usuario si existe
      setNewSede(usuario.sedes[0]?.sedeNombre || SEDES_MINEDUC[0] || "");
      setNewApp("");
      setNewRol("");
    }
  }, [open, usuario]);

  if (!workingUser) return null;

  // Sedes y aplicaciones disponibles
  const availableApps = APLICACIONES_CATALOGO.filter(a => a.activo);

  // Roles disponibles dependientes de la aplicación seleccionada y sede
  const availableRoles = React.useMemo(() => {
    if (!newApp) return [];
    const baseRoles = ROLES_POR_APLICACION[newApp] || [];

    // Si la sede tiene combinaciones habilitadas en ROL_APLICACION_SEDE, priorizarlas
    if (newSede) {
      const sedeRolesInCatalog = ROL_APLICACION_SEDE.filter(ras => ras.sedeNombre === newSede);
      if (sedeRolesInCatalog.length > 0) {
        const matchingRoleIds = new Set(sedeRolesInCatalog.map(r => r.rolAplicacionId));
        const filtered = ROLES_APLICACION.filter(
          ra => ra.aplicacionNombre === newApp && matchingRoleIds.has(ra.id)
        ).map(ra => ra.rolNombre);

        if (filtered.length > 0) return filtered;
      }
    }

    return baseRoles;
  }, [newApp, newSede]);

  // Cálculo de capacidad según ROL_APLICACION o ROL_APLICACION_SEDE
  const capacityInfo = React.useMemo(() => {
    if (!newSede || !newApp || !newRol) return null;

    const rolApp = ROLES_APLICACION.find(
      ra => ra.aplicacionNombre === newApp && ra.rolNombre === newRol
    );

    const rolAppSede = ROL_APLICACION_SEDE.find(
      ras => ras.sedeNombre === newSede && ras.rolAplicacionId === rolApp?.id
    );

    const maxPermitidos = rolAppSede?.usuariosMaxPermitidos ?? rolApp?.usuariosMaxPermitidos;

    // Conteo en todos los usuarios activos del sistema
    const currentActiveUsers = allUsuarios.filter(u =>
      u.estado === "Activo" &&
      u.sedes.some(s =>
        s.sedeNombre === newSede &&
        s.asignaciones.some(
          a => a.aplicacionNombre === newApp && a.rolNombre === newRol && a.estado === "Activo"
        )
      )
    ).length;

    const alreadyAssigned = workingUser.sedes.some(s =>
      s.sedeNombre === newSede &&
      s.asignaciones.some(a => a.aplicacionNombre === newApp && a.rolNombre === newRol)
    );

    const isFull = maxPermitidos !== undefined && currentActiveUsers >= maxPermitidos && !alreadyAssigned;
    const remaining = maxPermitidos !== undefined ? Math.max(0, maxPermitidos - currentActiveUsers) : null;

    const sedeObj = SEDES_CATALOGO.find(s => s.nombre === newSede);

    return {
      rolAplicacionId: rolApp?.id || `ra-${Date.now()}`,
      sedeId: sedeObj?.id || `sede-${Date.now()}`,
      maxPermitidos,
      currentActiveUsers,
      alreadyAssigned,
      isFull,
      remaining
    };
  }, [newSede, newApp, newRol, allUsuarios, workingUser]);

  // Lista aplanada de todas las asignaciones actuales del usuario
  const allAsignaciones = workingUser.sedes.flatMap(s =>
    s.asignaciones.map(a => ({ ...a, sedeNombre: s.sedeNombre, sedeId: s.sedeId }))
  );

  const selectedAsig = allAsignaciones.find(a => a.id === selectedAsignacionId);

  // Agregar nueva asignación
  const handleConfirmAssignment = () => {
    if (!capacityInfo || capacityInfo.isFull || capacityInfo.alreadyAssigned) return;

    const newAssignment: UsuarioSedeRolAplicacion = {
      id: `usra-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      usuarioId: workingUser.id,
      sedeId: capacityInfo.sedeId,
      sedeNombre: newSede,
      rolAplicacionId: capacityInfo.rolAplicacionId,
      aplicacionNombre: newApp,
      rolNombre: newRol,
      estado: "Activo",
      permisos: [
        { recursoCodigo: "RES-STD", recursoNombre: "Operación Estándar", puedeVer: true, puedeCrear: false, puedeEditar: false, puedeEliminar: false }
      ]
    };

    const newSedes = [...workingUser.sedes];
    const sedeIndex = newSedes.findIndex(s => s.sedeNombre === newSede);

    if (sedeIndex >= 0) {
      newSedes[sedeIndex].asignaciones.push(newAssignment);
    } else {
      newSedes.push({
        sedeId: capacityInfo.sedeId,
        sedeNombre: newSede,
        asignaciones: [newAssignment]
      });
    }

    setWorkingUser({ ...workingUser, sedes: newSedes });
    setSelectedAsignacionId(newAssignment.id);
    setNewRol("");
    toast.success("Asignación agregada exitosamente");
  };

  // Alternar estado de una asignación
  const handleToggleAsignacionEstado = (sedeNombre: string, asigId: string) => {
    const newSedes = [...workingUser.sedes];
    const sIndex = newSedes.findIndex(s => s.sedeNombre === sedeNombre);
    if (sIndex >= 0) {
      const aIndex = newSedes[sIndex].asignaciones.findIndex(a => a.id === asigId);
      if (aIndex >= 0) {
        const current = newSedes[sIndex].asignaciones[aIndex].estado;
        newSedes[sIndex].asignaciones[aIndex].estado = current === "Activo" ? "Inactivo" : "Activo";
        setWorkingUser({ ...workingUser, sedes: newSedes });
        toast.info("Estado de asignación actualizado");
      }
    }
  };

  // Eliminar asignación
  const handleRemoveAsignacion = (sedeNombre: string, asigId: string) => {
    const newSedes = workingUser.sedes.map(s => {
      if (s.sedeNombre !== sedeNombre) return s;
      return {
        ...s,
        asignaciones: s.asignaciones.filter(a => a.id !== asigId)
      };
    }).filter(s => s.asignaciones.length > 0);

    setWorkingUser({ ...workingUser, sedes: newSedes });
    if (selectedAsignacionId === asigId) {
      const first = newSedes[0]?.asignaciones[0];
      setSelectedAsignacionId(first?.id || "");
    }
    toast.info("Asignación removida");
  };

  // Alternar permisos granulares
  const togglePermiso = (recursoCodigo: string, accion: "puedeVer" | "puedeCrear" | "puedeEditar" | "puedeEliminar") => {
    if (!selectedAsig) return;

    const newSedes = [...workingUser.sedes];
    const sedeIndex = newSedes.findIndex(s => s.sedeNombre === selectedAsig.sedeNombre);
    if (sedeIndex >= 0) {
      const asigIndex = newSedes[sedeIndex].asignaciones.findIndex(a => a.id === selectedAsig.id);
      if (asigIndex >= 0) {
        const asig = newSedes[sedeIndex].asignaciones[asigIndex];
        const permIndex = asig.permisos.findIndex(p => p.recursoCodigo === recursoCodigo);
        if (permIndex >= 0) {
          asig.permisos[permIndex][accion] = !asig.permisos[permIndex][accion];
          setWorkingUser({ ...workingUser, sedes: newSedes });
        }
      }
    }
  };

  const handleSave = () => {
    onSave(workingUser);
    toast.success("Accesos guardados correctamente");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0 overflow-hidden">
        <SheetHeader className="px-6 py-4 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="size-5" />
            <SheetTitle>Gestionar accesos</SheetTitle>
          </div>
          <SheetDescription>
            Asigna y configura accesos por sede y aplicación para {workingUser.nombre} {workingUser.apellidos}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto bg-background">
          <Tabs defaultValue="asignar" className="w-full flex flex-col h-full">
            <div className="px-6 pt-3 border-b border-border bg-surface shrink-0">
              <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 gap-2">
                <TabsTrigger
                  value="asignar"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2 bg-transparent text-xs"
                >
                  Asignar acceso
                </TabsTrigger>
                <TabsTrigger
                  value="vigentes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2 bg-transparent text-xs"
                >
                  Accesos ({allAsignaciones.length})
                </TabsTrigger>
                <TabsTrigger
                  value="permisos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2 bg-transparent text-xs"
                >
                  Permisos
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* TAB 1: FLUJO DE ASIGNACIÓN CONTEXTUAL Y CAPACIDAD */}
              <TabsContent value="asignar" className="mt-0 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Nueva asignación de acceso</h3>
                  <p className="text-xs text-muted-foreground">
                    Selecciona la Sede institucional, la Aplicación habilitada y el Rol disponible.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Paso 1: Seleccionar Sede */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <MapPin className="size-3.5 text-primary" /> 1. Sede institucional
                    </label>
                    <Combobox value={newSede} onValueChange={(val) => { if (val) { setNewSede(val); setNewRol(""); } }}>
                      <ComboboxInput placeholder="Seleccionar sede..." showClear={false} />
                      <ComboboxContent>
                        <ComboboxList>
                          {SEDES_MINEDUC.map(s => (
                            <ComboboxItem key={s} value={s}>{s}</ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>

                  {/* Paso 2: Seleccionar Aplicación */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <AppWindow className="size-3.5 text-primary" /> 2. Aplicación disponible
                    </label>
                    <Combobox
                      value={newApp}
                      onValueChange={(val) => { if (val) { setNewApp(val); setNewRol(""); } }}
                      disabled={!newSede}
                    >
                      <ComboboxInput placeholder={newSede ? "Seleccionar aplicación..." : "Primero selecciona una sede"} showClear={false} />
                      <ComboboxContent>
                        <ComboboxList>
                          {availableApps.map(a => (
                            <ComboboxItem key={a.id} value={a.nombre}>{a.nombre}</ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>

                  {/* Paso 3: Seleccionar Rol */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <ShieldCheck className="size-3.5 text-primary" /> 3. Rol disponible
                    </label>
                    <Combobox
                      value={newRol}
                      onValueChange={(val) => { if (val) setNewRol(val); }}
                      disabled={!newApp}
                    >
                      <ComboboxInput placeholder={newApp ? "Seleccionar rol..." : "Primero selecciona una aplicación"} showClear={false} />
                      <ComboboxContent>
                        <ComboboxList>
                          {availableRoles.map(r => (
                            <ComboboxItem key={r} value={r}>{r}</ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>

                {/* Validación de Capacidad */}
                {capacityInfo && (
                  <Card variant="panel" className="overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Users className="size-3.5 text-primary" /> Validación de capacidad
                        </span>
                        {capacityInfo.isFull ? (
                          <Badge tone="danger" appearance="soft" className="gap-1">
                            <AlertTriangle className="size-3" /> Sin cupo
                          </Badge>
                        ) : capacityInfo.alreadyAssigned ? (
                          <Badge tone="warning" appearance="soft" className="gap-1">
                            <Info className="size-3" /> Ya asignado
                          </Badge>
                        ) : (
                          <Badge tone="success" appearance="soft" className="gap-1">
                            <Check className="size-3" /> Cupo disponible
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        {capacityInfo.alreadyAssigned ? (
                          <p className="text-warning-700 dark:text-warning-400 font-medium">
                            El usuario ya tiene asignado el rol <strong>{newRol}</strong> en <strong>{newSede}</strong>.
                          </p>
                        ) : capacityInfo.isFull ? (
                          <p className="text-danger-700 dark:text-danger-400 font-medium">
                            Capacidad máxima alcanzada ({capacityInfo.currentActiveUsers}/{capacityInfo.maxPermitidos} usuarios ocupando la plaza).
                            No se permiten nuevas asignaciones de este rol en la sede.
                          </p>
                        ) : capacityInfo.maxPermitidos !== undefined ? (
                          <p>
                            Ocupación actual: <strong>{capacityInfo.currentActiveUsers}</strong> de{" "}
                            <strong>{capacityInfo.maxPermitidos}</strong> usuarios permitidos ({capacityInfo.remaining} plaza(s) restante(s)).
                          </p>
                        ) : (
                          <p>Esta asignación no tiene límite máximo de usuarios parametrizado.</p>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full gap-2 mt-2"
                        disabled={capacityInfo.isFull || capacityInfo.alreadyAssigned || !newRol}
                        onClick={handleConfirmAssignment}
                      >
                        <Plus className="size-4" /> Confirmar asignación
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Resumen rápido de accesos vigentes */}
                <div className="pt-4 border-t border-border space-y-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-primary" /> Accesos asignados ({allAsignaciones.length})
                  </h4>
                  {allAsignaciones.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Sin accesos configurados aún.</p>
                  ) : (
                    <div className="space-y-2">
                      {allAsignaciones.slice(0, 3).map(asig => (
                        <div key={asig.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-border bg-surface">
                          <div>
                            <p className="font-semibold text-foreground">{asig.aplicacionNombre} · {asig.rolNombre}</p>
                            <p className="text-[11px] text-muted-foreground">{asig.sedeNombre}</p>
                          </div>
                          <Badge
                            tone={asig.estado === "Activo" ? "success" : "neutral"}
                            appearance="soft"
                            className={cn(
                              "font-semibold border text-xs",
                              asig.estado === "Activo"
                                ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                                : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                            )}
                          >
                            {asig.estado}
                          </Badge>
                        </div>
                      ))}
                      {allAsignaciones.length > 3 && (
                        <p className="text-[11px] text-muted-foreground text-center">
                          +{allAsignaciones.length - 3} asignación(es) más en la pestaña &quot;Accesos&quot;.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 2: ACCESOS VIGENTES Y GESTIÓN */}
              <TabsContent value="vigentes" className="mt-0 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">Sedes, aplicaciones y roles del usuario</h3>
                </div>

                {allAsignaciones.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No tiene asignaciones de acceso.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {allAsignaciones.map((asig) => (
                      <Card key={asig.id} variant="panel" className="overflow-hidden">
                        <div className="bg-muted/30 px-3 py-2 border-b border-border/50 text-xs text-foreground flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-medium">
                            <MapPin className="size-3.5 text-primary" /> {asig.sedeNombre}
                          </div>
                          <Badge
                            tone={asig.estado === "Activo" ? "success" : "neutral"}
                            appearance="soft"
                            className={cn(
                              "py-0 text-[10px] font-semibold border",
                              asig.estado === "Activo"
                                ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                                : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                            )}
                          >
                            {asig.estado}
                          </Badge>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <AppWindow className="size-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{asig.aplicacionNombre}</p>
                              <p className="text-xs text-muted-foreground">{asig.rolNombre}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                              onClick={() => handleToggleAsignacionEstado(asig.sedeNombre, asig.id)}
                            >
                              {asig.estado === "Activo" ? "Inactivar" : "Activar"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-danger"
                              onClick={() => handleRemoveAsignacion(asig.sedeNombre, asig.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* TAB 3: RECURSOS Y PERMISOS GRANULARES */}
              <TabsContent value="permisos" className="mt-0 space-y-6">
                <div className="space-y-3 mb-6">
                  <label className="text-xs font-semibold text-foreground">Asignación seleccionada</label>
                  <Combobox value={selectedAsignacionId} onValueChange={(val) => { if (val) setSelectedAsignacionId(val); }}>
                    <ComboboxInput placeholder="Seleccionar asignación..." showClear={false} />
                    <ComboboxContent>
                      <ComboboxList>
                        {allAsignaciones.map(a => (
                          <ComboboxItem key={a.id} value={a.id}>
                            {a.sedeNombre} - {a.aplicacionNombre} ({a.rolNombre})
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {selectedAsig ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Permisos específicos por recurso</h3>
                      </div>
                    </div>
                    {selectedAsig.permisos.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        Esta asignación no tiene recursos con permisos detallados configurables.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {selectedAsig.permisos.map((perm) => (
                          <Card key={perm.recursoCodigo} variant="panel">
                            <CardContent className="p-4">
                              <div className="mb-3">
                                <p className="text-sm font-semibold">{perm.recursoNombre}</p>
                                <p className="text-xs text-muted-foreground font-mono">{perm.recursoCodigo}</p>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-ver-${perm.recursoCodigo}`}
                                    checked={perm.puedeVer}
                                    onCheckedChange={() => togglePermiso(perm.recursoCodigo, "puedeVer")}
                                  />
                                  <label htmlFor={`edit-ver-${perm.recursoCodigo}`} className="text-xs text-foreground cursor-pointer">Ver</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-crear-${perm.recursoCodigo}`}
                                    checked={perm.puedeCrear}
                                    onCheckedChange={() => togglePermiso(perm.recursoCodigo, "puedeCrear")}
                                  />
                                  <label htmlFor={`edit-crear-${perm.recursoCodigo}`} className="text-xs text-foreground cursor-pointer">Crear</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-edit-${perm.recursoCodigo}`}
                                    checked={perm.puedeEditar}
                                    onCheckedChange={() => togglePermiso(perm.recursoCodigo, "puedeEditar")}
                                  />
                                  <label htmlFor={`edit-edit-${perm.recursoCodigo}`} className="text-xs text-foreground cursor-pointer">Editar</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-del-${perm.recursoCodigo}`}
                                    checked={perm.puedeEliminar}
                                    onCheckedChange={() => togglePermiso(perm.recursoCodigo, "puedeEliminar")}
                                  />
                                  <label htmlFor={`edit-del-${perm.recursoCodigo}`} className="text-xs text-foreground cursor-pointer">Eliminar</label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Selecciona una asignación para editar sus permisos.</p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex-row items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
