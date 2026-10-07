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
import {
  Users,
  ShieldCheck,
  FolderTree,
  ExternalLink,
  Edit,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  Layers,
  Power,
  PowerOff,
} from "lucide-react";
import { Link } from "@/routing";
import { AplicacionItem } from "../data/aplicaciones-data";
import { TabResumen } from "./tabs/tab-resumen";
import { TabUsuarios } from "./tabs/tab-usuarios";
import { TabRoles } from "./tabs/tab-roles";
import { TabRecursos } from "./tabs/tab-recursos";

interface AplicacionModalDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aplicacion: AplicacionItem | null;
  onEdit?: (app: AplicacionItem) => void;
  onToggleStatus?: (app: AplicacionItem) => void;
}

const getAppIcon = (iconName?: string) => {
  switch (iconName) {
    case "GraduationCap":
      return GraduationCap;
    case "Briefcase":
      return Briefcase;
    case "BookOpen":
      return BookOpen;
    case "KeyRound":
      return KeyRound;
    case "MapPin":
      return MapPin;
    default:
      return Layers;
  }
};

export function AplicacionModalDetail({
  open,
  onOpenChange,
  aplicacion,
  onEdit,
  onToggleStatus,
}: AplicacionModalDetailProps) {
  if (!aplicacion) return null;

  const IconComponent = getAppIcon(aplicacion.icono);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-background"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-background shrink-0 items-start text-left">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
              Detalle de la aplicación
            </DialogTitle>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Link href={`/aplicaciones/${aplicacion.id}`}>
                <ExternalLink className="size-3.5" />
                <span>Página completa</span>
              </Link>
            </Button>
          </div>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-background">
          {/* Header de resumen */}
          <div className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <IconComponent className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">
                    {aplicacion.nombre}
                  </h2>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {aplicacion.codigo}
                  </span>
                  <Badge
                    tone={aplicacion.estado === "Activa" ? "success" : "neutral"}
                    appearance="soft"
                    size="sm"
                    className="font-semibold text-xs"
                  >
                    {aplicacion.estado}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-xl">
                  {aplicacion.descripcion}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5 text-primary" />
                    <strong className="text-foreground">{aplicacion.usuariosCount}</strong> usuarios
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-info" />
                    <strong className="text-foreground">{aplicacion.rolesCount}</strong> roles
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderTree className="size-3.5 text-warning-600" />
                    <strong className="text-foreground">{aplicacion.recursosCount}</strong> recursos
                  </span>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs shrink-0 gap-1.5 h-8"
            >
              <a
                href={aplicacion.urlAcceso}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Acceder al portal</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="resumen" className="w-full flex flex-col">
            <TabsList variant="line" className="w-full justify-start border-b border-border mb-4">
              <TabsTrigger value="resumen" className="px-6 py-2.5 text-xs font-semibold">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="px-6 py-2.5 text-xs font-semibold">
                Usuarios ({aplicacion.usuariosCount})
              </TabsTrigger>
              <TabsTrigger value="roles" className="px-6 py-2.5 text-xs font-semibold">
                Roles ({aplicacion.rolesCount})
              </TabsTrigger>
              <TabsTrigger value="recursos" className="px-6 py-2.5 text-xs font-semibold">
                Recursos ({aplicacion.recursosCount})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: RESUMEN */}
            <TabsContent value="resumen" className="mt-0 outline-none">
              <TabResumen aplicacion={aplicacion} />
            </TabsContent>

            {/* TAB 2: USUARIOS */}
            <TabsContent value="usuarios" className="mt-0 outline-none">
              <TabUsuarios aplicacion={aplicacion} />
            </TabsContent>

            {/* TAB 3: ROLES */}
            <TabsContent value="roles" className="mt-0 outline-none">
              <TabRoles aplicacion={aplicacion} />
            </TabsContent>

            {/* TAB 4: RECURSOS */}
            <TabsContent value="recursos" className="mt-0 outline-none">
              <TabRecursos aplicacion={aplicacion} />
            </TabsContent>
          </Tabs>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-background shrink-0 flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cerrar
          </Button>

          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onToggleStatus(aplicacion);
                }}
                className={
                  aplicacion.estado === "Activa"
                    ? "text-danger hover:text-danger hover:bg-danger/10 border-danger/30 text-xs"
                    : "text-success hover:text-success hover:bg-success/10 border-success/30 text-xs"
                }
              >
                {aplicacion.estado === "Activa" ? (
                  <>
                    <PowerOff className="size-3.5" />
                    <span>Inactivar aplicación</span>
                  </>
                ) : (
                  <>
                    <Power className="size-3.5" />
                    <span>Activar aplicación</span>
                  </>
                )}
              </Button>
            )}

            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(aplicacion);
                }}
                className="gap-2 text-xs"
              >
                <Edit className="size-3.5" />
                <span>Editar aplicación</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
