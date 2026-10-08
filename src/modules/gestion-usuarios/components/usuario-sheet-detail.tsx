"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetadataList } from "@/components/ui/data-display";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, ShieldCheck, Mail, AppWindow, FileText, Calendar } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { UsuarioItem, UsuarioSedeRolAplicacion } from "../data/usuarios-data";
import { cn } from "@/lib/utils";

interface UsuarioSheetDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UsuarioItem | null;
}

export function UsuarioSheetDetail({
  open,
  onOpenChange,
  usuario,
}: UsuarioSheetDetailProps) {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0 overflow-hidden">
        {/* Cabecera con Nombre + Estado General */}
        <SheetHeader className="px-6 py-4 border-b border-border bg-surface shrink-0">
          <div>
            <SheetTitle className="text-lg">
              {usuario.nombre} {usuario.apellidos}
            </SheetTitle>
            <SheetDescription className="flex items-center gap-2 mt-0.5">
              <Badge
                tone={
                  usuario.estado === "Activo"
                    ? "success"
                    : usuario.estado === "Inactivo"
                      ? "neutral"
                      : "warning"
                }
                appearance="solid"
                className={cn(
                  "font-semibold shadow-xs",
                  usuario.estado === "Inactivo" && "bg-neutral-600 text-white dark:bg-neutral-700 dark:text-white"
                )}
              >
                {usuario.estado}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {usuario.email || usuario.correo}
              </span>
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto bg-background">
          <Tabs defaultValue="info" className="w-full flex flex-col h-full">
            <div className="px-6 pt-4 border-b border-border bg-surface shrink-0">
              <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 gap-4">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2 bg-transparent"
                >
                  Información
                </TabsTrigger>
                <TabsTrigger
                  value="accesos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2 bg-transparent"
                >
                  Asignaciones
                </TabsTrigger>
                <TabsTrigger
                  value="permisos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none pb-2 bg-transparent"
                >
                  Permisos
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Tab 1: Información */}
              <TabsContent value="info" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <FileText className="size-4 text-primary" /> Datos generales del usuario
                  </h3>
                  <Card variant="panel">
                    <CardContent className="p-4">
                      <MetadataList
                        items={[
                          { label: "Nombre", value: `${usuario.nombre || ""} ${usuario.apellidos || ""}`.trim() },
                          { label: "Tipo de documento", value: usuario.tipoDocumento || "Cédula" },
                          { label: "N.º documento", value: usuario.documentoIdentificacion || usuario.identificacion || "-" },
                          { label: "Correo", value: usuario.email || usuario.correo || "-" },
                          { label: "Estado", value: usuario.estado },
                          { label: "Fecha de creación", value: usuario.fechaCreacion },
                        ]}
                        variant="compact"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab 2: Asignaciones jerárquicas */}
              <TabsContent value="accesos" className="mt-0 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Sede &rarr; Aplicación &rarr; Rol &rarr; Estado & Fechas
                  </h3>
                </div>

                {usuario.sedes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tiene asignaciones registradas.
                  </p>
                ) : (
                  usuario.sedes.map((sede) => (
                    <div
                      key={sede.sedeId}
                      className="border border-border rounded-xl overflow-hidden bg-surface mb-4"
                    >
                      {/* Sede */}
                      <div className="bg-muted/40 px-4 py-3 border-b border-border font-semibold text-sm text-foreground flex items-center gap-2">
                        <MapPin className="size-4 text-primary shrink-0" />
                        <span>{sede.sedeNombre}</span>
                      </div>

                      <div className="p-4 space-y-4">
                        {sede.asignaciones.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic pl-2">
                            Sin aplicaciones asignadas en esta sede.
                          </p>
                        ) : (
                          sede.asignaciones.map((asig) => (
                            <div
                              key={asig.id}
                              className="pl-3 border-l-2 border-primary/30 space-y-2.5"
                            >
                              {/* Aplicación */}
                              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <AppWindow className="size-4 text-primary shrink-0" />
                                <span>{asig.aplicacionNombre}</span>
                              </div>

                              {/* Rol, Estado y Fechas */}
                              <div className="pl-4 border-l-2 border-border/60 py-2.5 px-3 bg-background/50 rounded-r-lg space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-xs font-semibold text-foreground">
                                      {asig.rolNombre}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-muted-foreground">Estado asignación:</span>
                                    <Badge
                                      tone={asig.estado === "Activo" ? "success" : "neutral"}
                                      appearance="solid"
                                      className={cn(
                                        "py-0 text-[10px] font-semibold shadow-xs",
                                        asig.estado === "Inactivo" && "bg-neutral-600 text-white dark:bg-neutral-700 dark:text-white"
                                      )}
                                    >
                                      {asig.estado}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1.5 border-t border-border/40">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="size-3 text-muted-foreground shrink-0" />
                                    <span>Fecha asignación:</span>
                                    <span className="font-medium text-foreground">{asig.fechaAsignacion || "15/09/2026"}</span>
                                  </div>
                                  {asig.fechaFinalizacion && (
                                    <div className="flex items-center gap-1 text-warning-foreground">
                                      <span>Fecha finalización:</span>
                                      <span className="font-medium text-foreground">{asig.fechaFinalizacion}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* Tab 3: Permisos contextuales */}
              <TabsContent value="permisos" className="mt-0 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-foreground">
                    Contexto de asignación: Sede + Aplicación + Rol
                  </label>
                  <Combobox
                    value={selectedAsignacionId}
                    onValueChange={(val) => {
                      if (val) setSelectedAsignacionId(val);
                    }}
                  >
                    <ComboboxInput placeholder="Seleccionar asignación..." showClear={false} />
                    <ComboboxContent>
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <ShieldCheck className="size-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Recursos vinculados a {selectedAsig.rolNombre}
                      </h3>
                    </div>
                    {selectedAsig.permisos.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No hay matriz de permisos detallada registrada para este rol.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {selectedAsig.permisos.map((perm) => (
                          <Card key={perm.recursoCodigo} variant="panel">
                            <CardContent className="p-4">
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-foreground">
                                  {perm.recursoNombre}
                                </p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {perm.recursoCodigo}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-border/40">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`ver-${perm.recursoCodigo}`} checked={perm.puedeVer} disabled />
                                  <label htmlFor={`ver-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                    Puede ver
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`crear-${perm.recursoCodigo}`} checked={perm.puedeCrear} disabled />
                                  <label htmlFor={`crear-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                    Puede crear
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`edit-${perm.recursoCodigo}`} checked={perm.puedeEditar} disabled />
                                  <label htmlFor={`edit-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                    Puede editar
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`del-${perm.recursoCodigo}`} checked={perm.puedeEliminar} disabled />
                                  <label htmlFor={`del-${perm.recursoCodigo}`} className="text-xs text-muted-foreground cursor-not-allowed">
                                    Puede eliminar
                                  </label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Seleccione una asignación para visualizar sus permisos.
                  </p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
