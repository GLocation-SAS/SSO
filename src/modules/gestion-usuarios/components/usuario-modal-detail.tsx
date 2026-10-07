"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
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
  Calendar,
  Clock,
  Edit,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { UsuarioItem } from "../data/usuarios-data";

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
  if (!usuario) return null;

  const totalAsignaciones = usuario.sedes.reduce(
    (acc, s) => acc + s.asignaciones.length,
    0
  );

  const aplicacionesUnicas = Array.from(
    new Set(
      usuario.sedes.flatMap((s) => s.asignaciones.map((a) => a.aplicacionNombre))
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-background"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-background shrink-0 items-start text-left">
          <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
            Detalle del usuario
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-background">
          {/* Header de resumen sin avatar */}
          <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                tone={
                  usuario.estado === "Activo"
                    ? "success"
                    : usuario.estado === "Inactivo"
                      ? "neutral"
                      : "warning"
                }
                appearance="soft"
                className="font-semibold text-xs px-2.5 py-0.5"
              >
                {usuario.estado}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {usuario.nombre} {usuario.apellidos}
            </h2>
            <p className="text-xs text-muted-foreground">
              {usuario.email || usuario.correo || "—"}
            </p>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="info" className="w-full flex flex-col">
            <TabsList variant="line" className="w-full justify-start border-b border-border mb-4">
              <TabsTrigger value="info" className="px-6 py-2.5">
                Información
              </TabsTrigger>
              <TabsTrigger value="accesos" className="px-6 py-2.5">
                Accesos
              </TabsTrigger>
              <TabsTrigger value="actividad" className="px-6 py-2.5">
                Actividad
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: INFORMACIÓN */}
            <TabsContent value="info" className="mt-0 space-y-4 outline-none">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Información general
                </h3>

                <div className="rounded-xl border border-border bg-background p-4 divide-y divide-border/60 text-sm">
                  <div className="flex items-center justify-between py-2.5 first:pt-0">
                    <span className="text-xs text-muted-foreground">Tipo de documento</span>
                    <span className="font-semibold text-foreground">
                      {usuario.tipoDocumento || "Cédula"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-muted-foreground">N.º de documento</span>
                    <span className="font-semibold text-foreground font-mono">
                      {usuario.documentoIdentificacion ||
                        usuario.identificacion ||
                        "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-muted-foreground">Correo</span>
                    <span className="font-semibold text-foreground">
                      {usuario.email || usuario.correo || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-muted-foreground">Estado</span>
                    <Badge
                      tone={
                        usuario.estado === "Activo"
                          ? "success"
                          : usuario.estado === "Inactivo"
                            ? "neutral"
                            : "warning"
                      }
                      appearance="soft"
                      className="font-semibold text-xs"
                    >
                      {usuario.estado}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-2.5 last:pb-0">
                    <span className="text-xs text-muted-foreground">Fecha de creación</span>
                    <span className="font-semibold text-foreground">
                      {usuario.fechaCreacion || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información complementaria */}
              {(usuario.cargo || usuario.telefono) && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Datos institucionales
                  </h3>
                  <div className="rounded-xl border border-border bg-background p-4 divide-y divide-border/60 text-sm">
                    {usuario.cargo && (
                      <div className="flex items-center justify-between py-2 first:pt-0">
                        <span className="text-xs text-muted-foreground">Cargo / Función</span>
                        <span className="font-medium text-foreground">{usuario.cargo}</span>
                      </div>
                    )}
                    {usuario.telefono && (
                      <div className="flex items-center justify-between py-2 last:pb-0">
                        <span className="text-xs text-muted-foreground">Teléfono</span>
                        <span className="font-medium text-foreground">{usuario.telefono}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: ACCESOS */}
            <TabsContent value="accesos" className="mt-0 space-y-4 outline-none">
              {/* Resumen de contadores */}
              <div className="grid grid-cols-3 gap-3">
                <Card variant="panel" className="p-3.5 text-center">
                  <span className="text-xs text-muted-foreground block mb-0.5">Sedes</span>
                  <span className="text-xl font-heading font-bold text-foreground">
                    {usuario.sedes.length}
                  </span>
                </Card>
                <Card variant="panel" className="p-3.5 text-center">
                  <span className="text-xs text-muted-foreground block mb-0.5">Aplicaciones</span>
                  <span className="text-xl font-heading font-bold text-foreground">
                    {aplicacionesUnicas.length}
                  </span>
                </Card>
                <Card variant="panel" className="p-3.5 text-center">
                  <span className="text-xs text-muted-foreground block mb-0.5">Roles asignados</span>
                  <span className="text-xl font-heading font-bold text-foreground">
                    {totalAsignaciones}
                  </span>
                </Card>
              </div>

              {/* Lista por Sedes */}
              <div className="space-y-4 pt-1">
                {usuario.sedes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    No tiene accesos registrados actualmente.
                  </div>
                ) : (
                  usuario.sedes.map((sede) => (
                    <div
                      key={sede.sedeId || sede.sedeNombre}
                      className="rounded-xl border border-border overflow-hidden bg-background"
                    >
                      {/* Cabecera Sede */}
                      <div className="bg-background px-4 py-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <Building2 className="size-4 text-primary shrink-0" />
                          <span>{sede.sedeNombre}</span>
                        </div>
                        <Badge tone="neutral" appearance="soft" className="text-xs font-semibold">
                          {sede.asignaciones.length}{" "}
                          {sede.asignaciones.length === 1
                            ? "asignación"
                            : "asignaciones"}
                        </Badge>
                      </div>

                      {/* Tabla Aplicación | Rol | Estado */}
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-primary/30 bg-primary">
                            <TableHead className="text-xs font-semibold h-9 text-white pl-4">
                              Aplicación
                            </TableHead>
                            <TableHead className="text-xs font-semibold h-9 text-white">
                              Rol
                            </TableHead>
                            <TableHead className="text-xs font-semibold h-9 text-right pr-4 text-white">
                              Estado
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-background">
                          {sede.asignaciones.map((asig) => (
                            <TableRow
                              key={asig.id}
                              className="bg-background border-b border-border/40 hover:bg-muted/15 last:border-b-0"
                            >
                              <TableCell className="py-2.5 pl-4 text-xs font-semibold text-foreground">
                                {asig.aplicacionNombre}
                              </TableCell>
                              <TableCell className="py-2.5 text-xs text-muted-foreground font-medium">
                                {asig.rolNombre}
                              </TableCell>
                              <TableCell className="py-2.5 pr-4 text-right">
                                <Badge
                                  tone={
                                    asig.estado === "Activo"
                                      ? "success"
                                      : "neutral"
                                  }
                                  appearance="soft"
                                  className="text-xs font-semibold"
                                >
                                  {asig.estado}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* TAB 3: ACTIVIDAD */}
            <TabsContent value="actividad" className="mt-0 space-y-4 outline-none">
              <div className="rounded-xl border border-border bg-background p-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Registro reciente de actividad
                </h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 size-2 rounded-full bg-primary" />
                    <p className="text-xs font-semibold text-foreground">
                      Último inicio de sesión exitoso
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" /> Hoy a las 08:42
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 size-2 rounded-full bg-success" />
                    <p className="text-xs font-semibold text-foreground">
                      Sincronización de accesos completada
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="size-3" /> {usuario.fechaCreacion}
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 size-2 rounded-full bg-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">
                      Creación del registro de usuario en SSO
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="size-3" /> {usuario.fechaCreacion}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-background shrink-0 flex flex-row items-center justify-end w-full">
          <Button
            variant="neutral"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
