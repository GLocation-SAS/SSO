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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, getAvatarInitials } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Key,
  Edit,
  AppWindow,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { UsuarioItem } from "../data/usuarios-data";

interface UsuarioDetalleDrawerProps {
  usuario: UsuarioItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (usuario: UsuarioItem) => void;
  onChangePassword: (usuario: UsuarioItem) => void;
}

export function UsuarioDetalleDrawer({
  usuario,
  open,
  onOpenChange,
  onEdit,
  onChangePassword,
}: UsuarioDetalleDrawerProps) {
  if (!usuario) return null;

  const initials = getAvatarInitials(`${usuario.nombre} ${usuario.apellidos}`);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-0 gap-0 overflow-hidden"
      >
        {/* Cabecera del Drawer */}
        <SheetHeader className="p-6 pb-5 border-b border-border bg-muted/20">
          <div className="flex items-start gap-4">
            <Avatar size="lg" className="border-2 border-primary/20 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <SheetTitle className="text-xl font-heading font-bold text-foreground">
                  {usuario.nombre} {usuario.apellidos}
                </SheetTitle>
                <Badge
                  tone={
                    usuario.estado === "Activo"
                      ? "success"
                      : usuario.estado === "Inactivo"
                        ? "neutral"
                        : "warning"
                  }
                  appearance="soft"
                  size="sm"
                >
                  {usuario.estado}
                </Badge>
              </div>
              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <span>C.I. {usuario.identificacion}</span>
                <span>•</span>
                <span className="font-medium text-foreground/80">{usuario.cargo}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* 1. Información General */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-muted-foreground">
              Información Institucional
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface border border-border/60 rounded-xl p-4 text-xs">
              <div className="flex items-center gap-2.5 text-foreground">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">{usuario.correo}</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground">
                <Phone className="size-4 text-muted-foreground shrink-0" />
                <span>{usuario.telefono}</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground sm:col-span-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <span className="font-medium">{usuario.sede}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground pt-2 border-t border-border/40">
                <Calendar className="size-3.5 shrink-0" />
                <span>Creado: {usuario.fechaCreacion}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground pt-2 border-t border-border/40">
                <Clock className="size-3.5 shrink-0" />
                <span>Último acceso: {usuario.ultimoAcceso}</span>
              </div>
            </div>
          </div>

          {/* 2. Jerarquía: Sede -> Aplicaciones -> Rol -> Recursos */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-muted-foreground">
                Aplicaciones y Control de Acceso
              </h3>
              <Badge tone="info" appearance="soft" size="sm">
                {usuario.rolesAplicaciones.length} autorizaciones
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              {usuario.rolesAplicaciones.map((appRol, idx) => (
                <div
                  key={`${appRol.aplicacionId}-${idx}`}
                  className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 transition-colors hover:border-primary/40 shadow-2xs"
                >
                  {/* Header de la Aplicación y Rol */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                        <AppWindow className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-heading text-foreground">
                          {appRol.aplicacionNombre}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Shield className="size-3 text-info" />
                          <span className="font-medium text-foreground/90">
                            Rol: {appRol.rolNombre}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-[10px]">
                      {appRol.aplicacionId.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Recursos autorizados para este Rol */}
                  <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Lock className="size-3 text-muted-foreground" />
                      Recursos y permisos asignados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {appRol.recursos.map((rec) => (
                        <span
                          key={rec}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-foreground/80 font-mono text-[10px] border border-border/60"
                        >
                          <CheckCircle2 className="size-2.5 text-success" />
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <SheetFooter className="p-4 border-t border-border bg-surface flex flex-col-reverse sm:flex-row gap-2 justify-end">
          <Button
            variant="outline"
            className="gap-2 text-xs"
            onClick={() => {
              onOpenChange(false);
              onChangePassword(usuario);
            }}
          >
            <Key className="size-3.5" />
            Cambiar clave
          </Button>
          <Button
            variant="primary"
            className="gap-2 text-xs"
            onClick={() => {
              onOpenChange(false);
              onEdit(usuario);
            }}
          >
            <Edit className="size-3.5" />
            Editar usuario
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

