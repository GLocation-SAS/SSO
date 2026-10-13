"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  Layers,
  MoreVertical,
  PowerOff
} from "lucide-react";
import { Link } from "@/routing";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AplicacionItem,
  mockAplicacionesData,
} from "../data/aplicaciones-data";
import { TabResumen } from "../components/tabs/tab-resumen";
import { TabUsuarios } from "../components/tabs/tab-usuarios";
import { TabRoles } from "../components/tabs/tab-roles";
import { TabRecursos } from "../components/tabs/tab-recursos";
import { AplicacionModalForm } from "../components/aplicacion-modal-form";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface AplicacionDetailViewProps {
  id: string;
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

export function AplicacionDetailView({ id }: AplicacionDetailViewProps) {
  const foundApp = mockAplicacionesData.find((a) => a.id === id) || {
    id,
    codigo: "SGD",
    nombre: "Gestión Docente",
    descripcion: "Sistema central para administración, escalafón y contratos del personal docente a nivel nacional.",
    urlAcceso: "https://mineduc.gob.ec/sgd",
    estado: "Activa" as const,
    requiereAtencion: true,
    fechaCreacion: "01/01/2024",
    ultimaActualizacion: "Hoy, 10:00",
    usuariosCount: 1420,
    rolesCount: 8,
    recursosCount: 14,
    icono: "GraduationCap",
  };

  const [aplicacion, setAplicacion] = React.useState<AplicacionItem>(foundApp);
  const [activeTab, setActiveTab] = React.useState("resumen");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isConfirmToggleOpen, setIsConfirmToggleOpen] = React.useState(false);

  const IconComponent = getAppIcon(aplicacion.icono);

  const handleSaveApp = (updated: AplicacionItem) => {
    setAplicacion(updated);
    toast.success(`Datos de "${updated.nombre}" guardados exitosamente.`);
  };

  const handleToggleStatus = () => {
    const isCurrentlyActive = aplicacion.estado === "Activa";
    const newStatus: "Activa" | "Inactiva" = isCurrentlyActive ? "Inactiva" : "Activa";

    setAplicacion((prev) => ({ ...prev, estado: newStatus }));

    if (isCurrentlyActive) {
      toast.warning(`La aplicación "${aplicacion.nombre}" fue desactivada.`);
    } else {
      toast.success(`La aplicación "${aplicacion.nombre}" ha sido activada.`);
    }

    setIsConfirmToggleOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 w-full h-full pb-6">
      {/* 1. BREADCRUMB */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/aplicaciones">Aplicaciones</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{aplicacion.nombre}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <Link href="/aplicaciones">
            <ArrowLeft className="size-3.5" />
            <span>Volver a aplicaciones</span>
          </Link>
        </Button>
      </div>

      {/* 2. MAIN CONTAINER & CABECERA DEL DETALLE */}
      <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          {/* Info Principal */}
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <IconComponent className="size-7" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  {aplicacion.nombre}
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                  {aplicacion.codigo}
                </span>
                <Badge
                  tone={aplicacion.estado === "Activa" ? "success" : "neutral"}
                  appearance="soft"
                  size="sm"
                  className="font-semibold"
                >
                  {aplicacion.estado}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground max-w-2xl">
                {aplicacion.descripcion}
              </p>
            </div>
          </div>

          {/* Botones Superiores */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs flex-1 lg:flex-none"
            >
              <a
                href={aplicacion.urlAcceso}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Acceder a la aplicación</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-1.5 text-xs flex-1 lg:flex-none"
            >
              <Edit className="size-3.5" />
              <span>Editar aplicación</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setIsConfirmToggleOpen(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <PowerOff className="size-4 mr-2" />
                  {aplicacion.estado === "Activa" ? "Desactivar aplicación" : "Activar aplicación"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. TABS: Resumen | Usuarios | Roles | Recursos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-auto gap-2 sm:gap-6">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios ({aplicacion.usuariosCount.toLocaleString("es-EC")})</TabsTrigger>
            <TabsTrigger value="roles">Roles ({aplicacion.rolesCount})</TabsTrigger>
            <TabsTrigger value="recursos">Recursos ({aplicacion.recursosCount})</TabsTrigger>
          </TabsList>

          {/* TAB 1: RESUMEN */}
          <TabsContent value="resumen" className="pt-6 outline-none">
            <TabResumen aplicacion={aplicacion} onNavigateTab={setActiveTab} />
          </TabsContent>

          {/* TAB 2: USUARIOS */}
          <TabsContent value="usuarios" className="pt-6 outline-none">
            <TabUsuarios aplicacion={aplicacion} />
          </TabsContent>

          {/* TAB 3: ROLES */}
          <TabsContent value="roles" className="pt-6 outline-none">
            <TabRoles aplicacion={aplicacion} />
          </TabsContent>

          {/* TAB 4: RECURSOS */}
          <TabsContent value="recursos" className="pt-6 outline-none">
            <TabRecursos aplicacion={aplicacion} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Dialog XL de Edición */}
      <AplicacionModalForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        aplicacionToEdit={aplicacion}
        onSave={handleSaveApp}
      />
      
      {/* Confirmación Desactivar */}
      <ConfirmDialog
        open={isConfirmToggleOpen}
        onOpenChange={setIsConfirmToggleOpen}
        title={
          aplicacion.estado === "Activa"
            ? "Desactivar aplicación"
            : "Activar aplicación"
        }
        description={
          aplicacion.estado === "Activa"
            ? "Los usuarios dejarán de tener acceso a esta aplicación. La configuración de roles y recursos se conservará."
            : `¿Deseas reactivar el acceso a "${aplicacion.nombre}"? Los funcionarios con roles activos podrán autenticarse nuevamente.`
        }
        confirmText={
          aplicacion.estado === "Activa"
            ? "Desactivar aplicación"
            : "Activar aplicación"
        }
        variant={aplicacion.estado === "Activa" ? "warning" : "success"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}

