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
  Users,
  ShieldCheck,
  FolderTree,
  ExternalLink,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  Layers,
} from "lucide-react";
import { Link } from "@/routing";

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
    codigo: "APP",
    nombre: "Aplicación Institucional",
    descripcion: "Sistema de gestión y administración de procesos del MINEDUC.",
    urlAcceso: "https://mineduc.gob.ec",
    estado: "Activa" as const,
    requiereAtencion: false,
    fechaCreacion: "01/01/2024",
    ultimaActualizacion: "Hoy, 10:00",
    usuariosCount: 120,
    rolesCount: 4,
    recursosCount: 6,
    icono: "Layers",
  };

  const [aplicacion, setAplicacion] = React.useState<AplicacionItem>(foundApp);
  const [activeTab, setActiveTab] = React.useState("resumen");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const IconComponent = getAppIcon(aplicacion.icono);

  const handleSaveApp = (updated: AplicacionItem) => {
    setAplicacion(updated);
    toast.success(`Datos de "${updated.nombre}" guardados exitosamente.`);
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

              {/* Badges de Conteos Arquitectónicos */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Users className="size-3.5 text-primary" />
                  <span>
                    <strong className="text-foreground">
                      {aplicacion.usuariosCount.toLocaleString("es-EC")}
                    </strong>{" "}
                    usuarios
                  </span>
                </div>
                <span className="text-muted-foreground/40">•</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <ShieldCheck className="size-3.5 text-info" />
                  <span>
                    <strong className="text-foreground">
                      {aplicacion.rolesCount}
                    </strong>{" "}
                    roles
                  </span>
                </div>
                <span className="text-muted-foreground/40">•</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <FolderTree className="size-3.5 text-warning-600" />
                  <span>
                    <strong className="text-foreground">
                      {aplicacion.recursosCount}
                    </strong>{" "}
                    recursos
                  </span>
                </div>
              </div>
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
                <span>Abrir aplicación</span>
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
          </div>
        </div>

        {/* 3. TABS: Resumen | Usuarios | Roles | Recursos */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-auto gap-2 sm:gap-6">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
          </TabsList>

          {/* TAB 1: RESUMEN */}
          <TabsContent value="resumen" className="pt-6 outline-none">
            <TabResumen aplicacion={aplicacion} />
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
    </div>
  );
}

