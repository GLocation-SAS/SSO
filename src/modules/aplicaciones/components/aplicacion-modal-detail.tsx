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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveCard } from "@/components/ui/data-display";
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
  Plus,
} from "lucide-react";
import { Link } from "@/routing";
import { AplicacionItem } from "../data/aplicaciones-data";
import { TabResumen } from "./tabs/tab-resumen";
import { TabUsuarios } from "./tabs/tab-usuarios";
import { TabRoles } from "./tabs/tab-roles";
import { TabRecursos } from "./tabs/tab-recursos";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const [activeTab, setActiveTab] = React.useState("resumen");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="3xl"
        className="p-0 gap-0 max-h-[88vh] flex flex-col overflow-hidden bg-white dark:bg-zinc-950"
      >
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-white dark:bg-zinc-950 shrink-0 items-start text-left">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <IconComponent className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-bold text-primary dark:text-white">
                Detalle de la aplicación
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Consulta los datos institucionales, roles, recursos y usuarios
                asociados.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* CONTENT WITH INNER SCROLL */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-white dark:bg-zinc-950">
          {/* Header de resumen */}
          <InteractiveCard
            hideChevron
            color="primary"
            className="cursor-default"
            borderless={true}
            shadowless={true}
            decorativeIcon={<IconComponent className="size-full" />}
            rightElement={
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="neutral"
                      size="default"
                      rightIcon={<ExternalLink className="size-3.5" />}
                      onClick={() =>
                        window.open(
                          aplicacion.urlAcceso,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      Acceder al portal
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    variant="info"
                    side="top"
                    className="max-w-xs text-center"
                  >
                    <p>
                      Esta acción te llevará fuera del SSO hacia el portal de{" "}
                      {aplicacion.nombre}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
          >
            <div className="flex flex-col gap-1.5 mt-0.5 w-full">
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
                  className="font-semibold text-[10px] px-2 py-0"
                >
                  {aplicacion.estado}
                </Badge>
              </div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-help group w-fit mt-1">
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                        {aplicacion.descripcion}
                      </p>
                      {aplicacion.descripcion && (
                        <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 text-primary transition-colors">
                          <Plus className="size-3" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs"
                    variant="info"
                  >
                    <p className="text-sm">{aplicacion.descripcion}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-wrap items-center gap-3 pt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5 text-primary" />
                  <strong className="text-foreground">
                    {aplicacion.usuariosCount}
                  </strong>{" "}
                  usuarios
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-info" />
                  <strong className="text-foreground">
                    {aplicacion.rolesCount}
                  </strong>{" "}
                  roles
                </span>
                <span className="flex items-center gap-1">
                  <FolderTree className="size-3.5 text-warning-600" />
                  <strong className="text-foreground">
                    {aplicacion.recursosCount}
                  </strong>{" "}
                  recursos
                </span>
              </div>
            </div>
          </InteractiveCard>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex flex-col"
          >
            <TabsList
              variant="line"
              className="w-full justify-start border-b border-border mb-4"
            >
              <TabsTrigger
                value="resumen"
                className="px-6 py-2.5 text-xs font-semibold"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger
                value="usuarios"
                className="px-6 py-2.5 text-xs font-semibold"
              >
                Usuarios ({aplicacion.usuariosCount})
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="px-6 py-2.5 text-xs font-semibold"
              >
                Roles ({aplicacion.rolesCount})
              </TabsTrigger>
              <TabsTrigger
                value="recursos"
                className="px-6 py-2.5 text-xs font-semibold"
              >
                Recursos ({aplicacion.recursosCount})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: RESUMEN */}
            <TabsContent value="resumen" className="mt-0 outline-none">
              <TabResumen
                aplicacion={aplicacion}
                onNavigateTab={setActiveTab}
              />
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
        <DialogFooter className="px-6 py-4 border-t border-border bg-white dark:bg-zinc-950 shrink-0 flex items-center justify-between sm:justify-between">
          <Button
            variant="neutral"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cerrar
          </Button>

          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Button
                variant={aplicacion.estado === "Activa" ? "warning" : "success"}
                size="default"
                onClick={() => {
                  onOpenChange(false);
                  onToggleStatus(aplicacion);
                }}
                className="gap-2 text-xs"
              >
                {aplicacion.estado === "Activa" ? (
                  <>
                    <PowerOff className="size-3.5" />
                    <span>Desactivar aplicación</span>
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
                size="default"
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
