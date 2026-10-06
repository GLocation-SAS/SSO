"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  MapPin,
  ShieldCheck,
  Mail,
  AppWindow,
  FileText,
  Calendar,
  Edit,
  Phone,
  Briefcase,
  Layers,
} from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { UsuarioItem, UsuarioSedeRolAplicacion } from "../data/usuarios-data";
import { cn } from "@/lib/utils";

interface UsuarioModalDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UsuarioItem | null;
  onEdit?: (usuario: UsuarioItem) => void;
}

export function UsuarioModalDetail({
  open,
  onOpenChange,
  usuario,
  onEdit,
}: UsuarioModalDetailProps) {
  const [selectedAsignacionId, setSelectedAsignacionId] = React.useState<string>("");

  React.useEffect(() => {
    if (open && usuario) {
      const firstAsig = usuario.sedes[0]?.asignaciones[0];
      setSelectedAsignacionId(firstAsig?.id || "");
    }
  }, [open, usuario]);

  if (!usuario) return null;

  const allAsignaciones: UsuarioSedeRolAplicacion[] = usuario.sedes.flatMap(
    (s) => s.asignaciones
  );

  const selectedAsig = allAsignaciones.find((a) => a.id === selectedAsignacionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col [&>div.relative]:w-full [&>div.relative]:items-stretch [&>div.relative]:text-left [&>div.relative]:gap-0"
        showCloseButton={true}
      >
        {/* Cabecera del Modal */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left pr-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <User className="size-6" />
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="text-left text-xl font-heading font-bold text-foreground">
                  {usuario.nombre} {usuario.apellidos}
                </DialogTitle>
                <DialogDescription className="text-left text-xs text-muted-foreground max-w-none flex flex-wrap items-center gap-2">
                  <span>{usuario.tipoDocumento || "Cédula"}: <strong>{usuario.documentoIdentificacion || usuario.identificacion || "—"}</strong></span>
                  <span>&bull;</span>
                  <span>{usuario.email || usuario.correo || "—"}</span>
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                tone={
                  usuario.estado === "Activo"
                    ? "success"
                    : usuario.estado === "Inactivo"
                      ? "neutral"
                      : "warning"
                }
                appearance="soft"
                className={cn(
                  "font-semibold text-xs px-2.5 py-0.5 border",
                  usuario.estado === "Activo" && "bg-success/15 text-success-800 dark:text-success-300 border-success/30",
                  usuario.estado === "Inactivo" && "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700",
                  usuario.estado === "Pendiente" && "bg-warning/15 text-warning-800 dark:text-warning-300 border-warning/30"
                )}
              >
                {usuario.estado}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Cuerpo del Modal con Pestañas */}
        <div className="flex-1 overflow-y-auto bg-background min-h-0">
          <Tabs defaultValue="info" className="w-full flex flex-col h-full">
            {/* Barra de pestañas */}
            <div className="px-6 pt-3 border-b border-border bg-surface shrink-0">
              <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 gap-3">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2.5 bg-transparent text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="size-3.5" />
                  <span>Información</span>
                </TabsTrigger>
                <TabsTrigger
                  value="accesos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2.5 bg-transparent text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="size-3.5" />
                  <span>Asignaciones ({allAsignaciones.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="permisos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2.5 bg-transparent text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>Matriz de Permisos</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* TAB 1: Información General */}
              <TabsContent value="info" className="mt-0 space-y-5">
                {/* Bloque Identificación y Contacto */}
                <Card variant="panel" className="overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b border-border/60 flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Datos de Identificación y Contacto
                    </h3>
                  </div>
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Nombre completo</span>
                      <p className="text-sm font-medium text-foreground">{usuario.nombre} {usuario.apellidos}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Documento de identidad</span>
                      <p className="text-sm font-medium text-foreground">{usuario.tipoDocumento || "Cédula"} &bull; {usuario.documentoIdentificacion || usuario.identificacion || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Correo institucional</span>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Mail className="size-3.5 text-muted-foreground" />
                        <span>{usuario.email || usuario.correo || "—"}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Teléfono de contacto</span>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Phone className="size-3.5 text-muted-foreground" />
                        <span>{usuario.telefono || "No registrado"}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bloque Institucional */}
                <Card variant="panel" className="overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b border-border/60 flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Adscripción Institucional
                    </h3>
                  </div>
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Función institucional / Cargo</span>
                      <p className="text-sm font-medium text-foreground">{usuario.cargo || "Funcionario institucional"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Estado general en el SSO</span>
                      <div>
                        <Badge
                          tone={
                            usuario.estado === "Activo"
                              ? "success"
                              : usuario.estado === "Inactivo"
                                ? "neutral"
                                : "warning"
                          }
                          appearance="soft"
                          className={cn(
                            "font-semibold text-xs border",
                            usuario.estado === "Activo" && "bg-success/15 text-success-800 dark:text-success-300 border-success/30",
                            usuario.estado === "Inactivo" && "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700",
                            usuario.estado === "Pendiente" && "bg-warning/15 text-warning-800 dark:text-warning-300 border-warning/30"
                          )}
                        >
                          {usuario.estado}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Fecha de registro en el sistema</span>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>{usuario.fechaCreacion || "15/09/2026"}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Sedes asignadas</span>
                      <p className="text-sm font-medium text-foreground">
                        {usuario.sedes.length > 0
                          ? usuario.sedes.map((s) => s.sedeNombre).join(", ")
                          : "Sin sedes asignadas"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 2: Asignaciones Jerárquicas */}
              <TabsContent value="accesos" className="mt-0 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Layers className="size-4 text-primary" />
                      Jerarquía de Asignaciones
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Sede institucional &rarr; Aplicación habilitada &rarr; Rol de acceso institucional
                    </p>
                  </div>
                  <Badge tone="primary" appearance="soft" size="sm" className="font-semibold text-[11px]">
                    {allAsignaciones.length} asignaci{allAsignaciones.length === 1 ? "ón" : "ones"}
                  </Badge>
                </div>

                {usuario.sedes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tiene asignaciones registradas.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {usuario.sedes.map((sede) => (
                      <Card key={sede.sedeId || sede.sedeNombre} variant="panel" className="overflow-hidden">
                        {/* Nivel 1: Sede */}
                        <div className="bg-muted/50 px-4 py-2.5 border-b border-border flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <MapPin className="size-4 text-primary shrink-0" />
                            <span>{sede.sedeNombre}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {sede.asignaciones.length} rol{sede.asignaciones.length === 1 ? "" : "es"}
                          </span>
                        </div>

                        {/* Nivel 2 y 3: Aplicaciones y Roles dentro de la Sede */}
                        <div className="p-4 space-y-3">
                          {sede.asignaciones.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">
                              Sin aplicaciones vinculadas a esta sede.
                            </p>
                          ) : (
                            sede.asignaciones.map((asig) => (
                              <div
                                key={asig.id}
                                className="bg-surface border border-border/80 rounded-xl p-3.5 space-y-2.5 shadow-xs"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  {/* Aplicación */}
                                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <AppWindow className="size-4 text-primary/80 shrink-0" />
                                    <span>{asig.aplicacionNombre}</span>
                                  </div>

                                  {/* Estado del Acceso */}
                                  <Badge
                                    tone={asig.estado === "Activo" ? "success" : "neutral"}
                                    appearance="soft"
                                    className={cn(
                                      "py-0.5 text-[10px] font-semibold border",
                                      asig.estado === "Activo"
                                        ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                                        : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                                    )}
                                  >
                                    {asig.estado}
                                  </Badge>
                                </div>

                                {/* Rol y Fechas */}
                                <div className="pl-6 border-l-2 border-primary/30 space-y-1">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                    <ShieldCheck className="size-3.5 text-primary shrink-0" />
                                    <span>Rol: {asig.rolNombre}</span>
                                  </div>
                                  {asig.fechaAsignacion && (
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pl-5">
                                      <Calendar className="size-3 shrink-0" />
                                      <span>Asignado el: {asig.fechaAsignacion}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* TAB 3: Permisos Contextuales */}
              <TabsContent value="permisos" className="mt-0 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    Seleccionar asignación para ver permisos
                  </label>
                  <Combobox
                    value={selectedAsignacionId}
                    onValueChange={(val) => {
                      if (val) setSelectedAsignacionId(val);
                    }}
                  >
                    <ComboboxInput placeholder="Seleccionar asignación..." showClear={false} className="w-full text-xs" />
                    <ComboboxContent className="min-w-full">
                      <ComboboxList>
                        {allAsignaciones.map((a) => (
                          <ComboboxItem key={a.id} value={a.id}>
                            {a.sedeNombre} &bull; {a.aplicacionNombre} ({a.rolNombre})
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                {selectedAsig ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-foreground">
                          Recursos y permisos asignados a: {selectedAsig.rolNombre}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedAsig.sedeNombre} &bull; {selectedAsig.aplicacionNombre}
                        </p>
                      </div>
                    </div>

                    {selectedAsig.permisos.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No hay matriz de permisos granulares detallada para este rol.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedAsig.permisos.map((perm) => (
                          <Card key={perm.recursoCodigo} variant="panel" className="p-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-border/40">
                              <span className="text-xs font-bold text-foreground">{perm.recursoNombre}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{perm.recursoCodigo}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div className="flex items-center space-x-1.5">
                                <Checkbox id={`modal-ver-${perm.recursoCodigo}`} checked={perm.puedeVer} disabled />
                                <label htmlFor={`modal-ver-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                  Ver
                                </label>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Checkbox id={`modal-crear-${perm.recursoCodigo}`} checked={perm.puedeCrear} disabled />
                                <label htmlFor={`modal-crear-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                  Crear
                                </label>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Checkbox id={`modal-edit-${perm.recursoCodigo}`} checked={perm.puedeEditar} disabled />
                                <label htmlFor={`modal-edit-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                  Editar
                                </label>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Checkbox id={`modal-del-${perm.recursoCodigo}`} checked={perm.puedeEliminar} disabled />
                                <label htmlFor={`modal-del-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                  Eliminar
                                </label>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    Seleccione una asignación en el selector superior para ver sus permisos.
                  </p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t border-border bg-surface shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Gestión de Identidades y Accesos &bull; MINEDUC
          </span>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(usuario);
                }}
                className="gap-2 text-xs h-9"
              >
                <Edit className="size-3.5" />
                <span>Editar datos</span>
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 px-4"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

