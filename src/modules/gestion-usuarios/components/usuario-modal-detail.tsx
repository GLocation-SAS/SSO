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
import { InteractiveCard } from "@/components/ui/data-display";
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
  Check,
  Clock,
  Edit,
  Mail,
  ShieldCheck,
  User,
  Grid,
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
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-surface"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 items-start text-left">
          <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
            Detalle del usuario
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-surface">
          {/* Header de resumen sin avatar */}
          <InteractiveCard
            hideChevron
            color="primary"
            className="cursor-default"
            borderless
            shadowless
            decorativeIcon={<User className="size-full" />}
          >
            <div className="flex flex-col gap-1.5 mt-0.5">
              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    usuario.estado === "Activo"
                      ? "success"
                      : usuario.estado === "Inactivo"
                        ? "neutral"
                        : "warning"
                  }
                  appearance="solid"
                  className="font-semibold text-[10px] px-2 py-0"
                >
                  {usuario.estado}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-0.5">
                {usuario.nombre} {usuario.apellidos}
              </h2>
              <p className="text-xs text-muted-foreground">
                {usuario.email || usuario.correo || "—"}
              </p>
            </div>
          </InteractiveCard>

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

                <div className="rounded-xl border border-border bg-surface p-4 divide-y divide-border/60 text-sm">
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
                  <div className="rounded-xl border border-border bg-surface p-4 divide-y divide-border/60 text-sm">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InteractiveCard
                  color="primary"
                  hideChevron
                  className="cursor-default"
                  borderless
                  shadowless
                  icon={<Building2 className="size-5" />}
                >
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Sedes
                    </span>
                    <span className="text-2xl font-heading font-bold text-foreground">
                      {usuario.sedes.length}
                    </span>
                  </div>
                </InteractiveCard>

                <InteractiveCard
                  color="success"
                  hideChevron
                  className="cursor-default"
                  borderless
                  shadowless
                  icon={<Grid className="size-5" />}
                >
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Aplicaciones
                    </span>
                    <span className="text-2xl font-heading font-bold text-foreground">
                      {aplicacionesUnicas.length}
                    </span>
                  </div>
                </InteractiveCard>

                <InteractiveCard
                  color="warning"
                  hideChevron
                  className="cursor-default"
                  borderless
                  shadowless
                  icon={<ShieldCheck className="size-5" />}
                >
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Roles asignados
                    </span>
                    <span className="text-2xl font-heading font-bold text-foreground">
                      {totalAsignaciones}
                    </span>
                  </div>
                </InteractiveCard>
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
                      className="rounded-xl border border-border overflow-hidden bg-surface"
                    >
                      {/* Cabecera Sede */}
                      <div className="bg-surface px-4 py-3 border-b border-border flex items-center justify-between">
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
                      <div className="px-4 pb-4 pt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Aplicación</TableHead>
                              <TableHead>Rol</TableHead>
                              <TableHead className="text-right">Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sede.asignaciones.map((asig) => (
                              <TableRow key={asig.id}>
                                <TableCell className="font-semibold text-foreground">
                                  {asig.aplicacionNombre}
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                  {asig.rolNombre}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge
                                    tone={asig.estado === "Activo" ? "success" : "neutral"}
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
                  </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* TAB 3: ACTIVIDAD */}
            <TabsContent value="actividad" className="mt-0 space-y-4 outline-none">
              <div className="p-6 rounded-xl border border-border bg-surface">
                <div className="relative pl-12 space-y-8 before:absolute before:left-[11.5px] before:top-3 before:bottom-3 before:w-px before:bg-border/60">
                  
                  {/* Item 1 */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute -left-[48px] top-0.5 size-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-background z-10">
                      <Check className="size-3.5 text-white" />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-muted-foreground/80 font-medium">Hoy a las 08:42 AM</span>
                      <h4 className="text-[13px] font-bold text-foreground leading-none">Último inicio de sesión exitoso</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">Inicio de sesión validado en el portal central</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute -left-[48px] top-0.5 size-6 rounded-full border-[1.5px] border-primary/70 bg-surface flex items-center justify-center ring-4 ring-background z-10">
                      <Clock className="size-3 text-primary" />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-muted-foreground/80 font-medium">{usuario.fechaCreacion}</span>
                      <h4 className="text-[13px] font-bold text-foreground leading-none">Sincronización de accesos</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">Roles y aplicaciones sincronizadas correctamente</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute -left-[48px] top-0.5 size-6 rounded-full border-[1.5px] border-muted-foreground/40 bg-surface flex items-center justify-center ring-4 ring-background z-10">
                      <Clock className="size-3 text-muted-foreground/60" />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-muted-foreground/80 font-medium">{usuario.fechaCreacion}</span>
                      <h4 className="text-[13px] font-bold text-foreground leading-none">Creación del registro</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">Registro inicial del usuario en el sistema SSO</p>
                    </div>
                  </div>

                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-surface shrink-0 flex flex-row items-center justify-end w-full">
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
