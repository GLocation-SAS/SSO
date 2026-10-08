"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ShieldCheck,
  Users,
  FolderTree,
  Plus,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  AplicacionItem,
  AplicacionRol,
  mockRolesPorApp,
} from "../../data/aplicaciones-data";
import { Link, useRouter } from "@/routing";
import { toast } from "sonner";
import { RolModalPermissions } from "../rol-modal-permissions";

interface TabRolesProps {
  aplicacion: AplicacionItem;
}

export function TabRoles({ aplicacion }: TabRolesProps) {
  const router = useRouter();
  const initialRoles = mockRolesPorApp[aplicacion.id] || [
    {
      id: "rol-admin-default",
      aplicacionId: aplicacion.id,
      nombre: "Administrador",
      descripcion: "Acceso total y configuración de la aplicación.",
      usuariosCount: 5,
      recursosCount: aplicacion.recursosCount || 4,
    },
    {
      id: "rol-consulta-default",
      aplicacionId: aplicacion.id,
      nombre: "Consulta",
      descripcion: "Visualización de reportes y datos institucionales.",
      usuariosCount: 18,
      recursosCount: 2,
    },
  ];

  const [roles, setRoles] = React.useState<AplicacionRol[]>(initialRoles);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedRolForModal, setSelectedRolForModal] =
    React.useState<AplicacionRol | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] =
    React.useState(false);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleCreateRol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setError("El nombre del rol es obligatorio.");
      return;
    }
    if (!nuevaDescripcion.trim()) {
      setError("La descripción del rol es requerida.");
      return;
    }

    const newRolId = `rol-${nuevoNombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")}`;

    const newRol: AplicacionRol = {
      id: newRolId,
      aplicacionId: aplicacion.id,
      nombre: nuevoNombre.trim(),
      descripcion: nuevaDescripcion.trim(),
      usuariosCount: 0,
      recursosCount: 0,
    };

    setRoles((prev) => [newRol, ...prev]);
    toast.success(`Rol "${newRol.nombre}" creado exitosamente.`);
    setIsCreateOpen(false);
    setNuevoNombre("");
    setNuevaDescripcion("");
    setError(null);

    // Navegar directamente al detalle del rol para configurar su matriz
    router.push(`/aplicaciones/${aplicacion.id}/roles/${newRol.id}`);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
      {/* Header del Tab con Botón de Creación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-info/10 text-info flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Roles específicos de {aplicacion.nombre}
            </h3>
            <p className="text-xs text-muted-foreground">
              Cada rol define los privilegios que un usuario adquiere al ingresar a los recursos del sistema.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="gap-1.5 text-xs shrink-0"
        >
          <Plus className="size-4" />
          <span>Crear rol</span>
        </Button>
      </div>

      {/* Grid de Cards de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((rol) => (
          <Card
            key={rol.id}
            variant="panel"
            className="border border-border bg-surface shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <CardHeader className="p-5 pb-3 border-b border-border/50">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-4.5" />
                </div>
                <div>
                  <CardTitle className="text-base font-heading font-bold text-foreground">
                    {rol.nombre}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {rol.descripcion}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-3 flex flex-col gap-3">
              {/* Indicadores */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <FolderTree className="size-3.5 text-warning-600" />
                  <span>{rol.recursosCount} recursos asociados</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  <span>{rol.usuariosCount} asignados</span>
                </div>
              </div>

              {/* Acciones de Rol: Modal por defecto + Link externo */}
              <div className="flex items-center gap-1.5 mt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedRolForModal(rol);
                    setIsPermissionsModalOpen(true);
                  }}
                  className="flex-1 justify-between text-xs group"
                >
                  <span>Ver matriz y permisos</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Link href={`/aplicaciones/${aplicacion.id}/roles/${rol.id}`}>
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" variant="info" className="flex-col items-start max-w-[220px] text-left">
                    <p className="font-semibold">Gestionar rol</p>
                    <p className="text-[11px] opacity-90">Te redirigirá a la vista detallada de configuración del rol.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para Crear Rol */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent size="lg" className="p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 text-left">
            <DialogTitle className="text-xl font-heading font-bold text-primary">
              Crear rol para {aplicacion.nombre}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Define el perfil institucional. A continuación podrás configurar su matriz de permisos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRol} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nombre del rol <span className="text-danger">*</span>
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="Ej. Gestor de Distrito, Auditor, Operador"
                  value={nuevoNombre}
                  onChange={(e) => {
                    setNuevoNombre(e.target.value);
                    setError(null);
                  }}
                  className="text-sm"
                />
              </InputGroup>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Descripción funcional <span className="text-danger">*</span>
              </label>
              <InputGroup className="h-auto">
                <InputGroupTextarea
                  placeholder="Describe qué funciones y facultades otorga este rol a los funcionarios..."
                  rows={3}
                  value={nuevaDescripcion}
                  onChange={(e) => {
                    setNuevaDescripcion(e.target.value);
                    setError(null);
                  }}
                  className="text-sm"
                />
              </InputGroup>
            </div>

            {error && (
              <p className="text-[11px] text-danger flex items-center gap-1.5">
                <AlertCircle className="size-3.5 shrink-0" />
                {error}
              </p>
            )}

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-normal">
                Al guardar se abrirá la <strong>Matriz de Permisos</strong> para que asignes las facultades de Ver, Crear, Editar y Eliminar en los recursos.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="neutral"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="gap-1.5 text-xs">
                <Check className="size-4" />
                <span>Crear y configurar permisos</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Matriz de Permisos del Rol */}
      <RolModalPermissions
        open={isPermissionsModalOpen}
        onOpenChange={setIsPermissionsModalOpen}
        rol={selectedRolForModal}
        aplicacion={aplicacion}
      />
      </div>
    </TooltipProvider>
  );
}

