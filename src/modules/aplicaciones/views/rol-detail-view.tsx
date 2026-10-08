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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  FolderTree,
  Save,
  Check,
  Info,
  CornerDownRight,
  Folder,
  FileCode,
} from "lucide-react";
import { Link } from "@/routing";
import {
  mockAplicacionesData,
  mockRolesPorApp,
  mockMatrizPermisosPorRol,
  RolRecursoPermiso,
} from "../data/aplicaciones-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RolDetailViewProps {
  appId: string;
  rolId: string;
}

export function RolDetailView({ appId, rolId }: RolDetailViewProps) {
  const aplicacion =
    mockAplicacionesData.find((a) => a.id === appId) || {
      id: appId,
      codigo: "APP",
      nombre: "Aplicación",
      descripcion: "",
      urlAcceso: "",
      estado: "Activa" as const,
      requiereAtencion: false,
      fechaCreacion: "",
      ultimaActualizacion: "",
      usuariosCount: 0,
      rolesCount: 0,
      recursosCount: 0,
    };

  const appRoles = mockRolesPorApp[appId] || [];
  const foundRol = appRoles.find((r) => r.id === rolId) || {
    id: rolId,
    aplicacionId: appId,
    nombre: rolId.replace("rol-", "").replace("-", " ").toUpperCase(),
    descripcion: "Rol configurado para el acceso a recursos específicos.",
    usuariosCount: 15,
    recursosCount: 6,
  };

  const initialMatriz = mockMatrizPermisosPorRol[rolId] || [
    {
      recursoId: "rec-1",
      recursoNombre: "Módulo Principal",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-2",
      recursoNombre: "Consultas y Listados",
      recursoPadre: "Módulo Principal",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
    {
      recursoId: "rec-3",
      recursoNombre: "Reportes Institucionales",
      permisos: { ver: true, crear: false, editar: false, eliminar: false },
    },
  ];

  const [matriz, setMatriz] = React.useState<RolRecursoPermiso[]>(initialMatriz);
  const [hasChanges, setHasChanges] = React.useState(false);

  const handleTogglePermiso = (
    recursoId: string,
    tipo: "ver" | "crear" | "editar" | "eliminar",
    value: boolean
  ) => {
    setMatriz((prev) =>
      prev.map((item) =>
        item.recursoId === recursoId
          ? {
            ...item,
            permisos: {
              ...item.permisos,
              [tipo]: value,
            },
          }
          : item
      )
    );
    setHasChanges(true);
  };

  const handleToggleAllForRecurso = (recursoId: string) => {
    setMatriz((prev) =>
      prev.map((item) => {
        if (item.recursoId !== recursoId) return item;
        const allEnabled =
          item.permisos.ver &&
          item.permisos.crear &&
          item.permisos.editar &&
          item.permisos.eliminar;
        const nextVal = !allEnabled;
        return {
          ...item,
          permisos: {
            ver: nextVal,
            crear: nextVal,
            editar: nextVal,
            eliminar: nextVal,
          },
        };
      })
    );
    setHasChanges(true);
  };

  const handleSaveMatriz = () => {
    toast.success(
      `Matriz de permisos para "${foundRol.nombre}" guardada correctamente.`
    );
    setHasChanges(false);
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
              <BreadcrumbLink asChild>
                <Link href={`/aplicaciones/${aplicacion.id}`}>
                  {aplicacion.nombre}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{foundRol.nombre}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <Link href={`/aplicaciones/${aplicacion.id}`}>
            <ArrowLeft className="size-3.5" />
            <span>Volver a {aplicacion.nombre}</span>
          </Link>
        </Button>
      </div>

      {/* 2. ENCABEZADO DEL ROL */}
      <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-info/10 border border-info/20 text-info flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="size-6" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  {foundRol.nombre}
                </h1>
                <Badge tone="primary" appearance="soft" size="sm">
                  {aplicacion.nombre}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground max-w-2xl">
                {foundRol.descripcion}
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  <span>
                    <strong className="text-foreground">
                      {foundRol.usuariosCount}
                    </strong>{" "}
                    usuarios con este rol
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <FolderTree className="size-3.5 text-warning-600" />
                  <span>
                    <strong className="text-foreground">
                      {matriz.length}
                    </strong>{" "}
                    recursos evaluados
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveMatriz}
            disabled={!hasChanges}
            className="gap-2 text-xs w-full lg:w-auto"
          >
            <Save className="size-4" />
            <span>Guardar matriz de permisos</span>
          </Button>
        </div>

        {/* 3. EXPLICACIÓN DE ARQUITECTURA */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Info className="size-4.5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-foreground">
              Relación jerárquica: Rol → Recursos → Permisos
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Marca o desmarca los privilegios de cada recurso institucional. Las acciones definen si los usuarios vinculados a este rol pueden consultar (Ver), ingresar nuevos registros (Crear), modificar datos (Editar) o dar de baja registros (Eliminar).
            </p>
          </div>
        </div>

        {/* 4. MATRIZ DE PERMISOS */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[380px] pl-6 dark:text-white">
                  <TableRow className="border-b border-primary/30 dark:border-primary-800/60">
                    <TableHead className="w-[380px] pl-6 text-white dark:text-white font-semibold">
                      Recurso institucional
                    </TableHead>
                    <TableHead className="w-[110px] text-center dark:text-white">
                      <TableHead className="w-[110px] text-center text-white dark:text-white font-semibold">
                        Ver
                      </TableHead>
                      <TableHead className="w-[110px] text-center dark:text-white">
                        <TableHead className="w-[110px] text-center text-white dark:text-white font-semibold">
                          Crear
                        </TableHead>
                        <TableHead className="w-[110px] text-center dark:text-white">
                          <TableHead className="w-[110px] text-center text-white dark:text-white font-semibold">
                            Editar
                          </TableHead>
                          <TableHead className="w-[110px] text-center dark:text-white">
                            <TableHead className="w-[110px] text-center text-white dark:text-white font-semibold">
                              Eliminar
                            </TableHead>
                            <TableHead className="w-[140px] text-right dark:text-white pr-6">
                              <TableHead className="w-[140px] text-right text-white dark:text-white font-semibold pr-6">
                                Acción rápida
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {matriz.map((item) => {
                              const isSubRecurso = Boolean(item.recursoPadre);
                              const allSelected =
                                item.permisos.ver &&
                                item.permisos.crear &&
                                item.permisos.editar &&
                                item.permisos.eliminar;

                              return (
                                <TableRow
                                  key={item.recursoId}
                                  className={cn(
                                    isSubRecurso && "bg-muted/10 hover:bg-muted/20"
                      "transition-colors border-b border-border/60",
                                    isSubRecurso
                                      ? "bg-muted/10 dark:bg-muted/20 hover:bg-muted/25 dark:hover:bg-muted/40"
                                      : "hover:bg-primary/5 dark:hover:bg-muted/70"
                                  )}
                                >
                                  {/* Recurso */}
                                  <TableCell className="pl-6">
                                    <TableCell className="pl-6 h-auto py-3">
                                      <div className="flex items-center gap-2.5 py-1">
                                        {isSubRecurso ? (
                                          <div className="flex items-center gap-1.5 text-muted-foreground pl-4 shrink-0">
                                            <CornerDownRight className="size-4 text-primary" />
                                            <FileCode className="size-4 text-muted-foreground" />
                                            <CornerDownRight className="size-4 text-primary dark:text-primary-300" />
                                            <FileCode className="size-4 text-muted-foreground dark:text-neutral-400" />
                                          </div>
                                        ) : (
                                          <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <div className="size-7 rounded-md bg-primary/10 dark:bg-primary-900/40 border border-transparent dark:border-primary-700/40 text-primary dark:text-primary-300 flex items-center justify-center shrink-0">
                                              <Folder className="size-4" />
                                            </div>
                        )}
                                            <div className="flex flex-col">
                                              <span
                                                className={cn(
                                                  "text-sm",
                                                  isSubRecurso
                                                    ? "font-medium text-foreground"
                                                    : "font-bold font-heading text-foreground"
                                                      ? "font-medium text-foreground dark:text-neutral-200"
                                                      : "font-bold font-heading text-foreground dark:text-white"
                                                )}
                                              >
                                                {item.recursoNombre}
                                              </span>
                                              {item.recursoPadre && (
                                                <span className="text-[11px] text-muted-foreground">
                                                  <span className="text-[11px] text-muted-foreground dark:text-neutral-400">
                                                    Submódulo de {item.recursoPadre}
                                                  </span>
                          )}
                                                </div>
                      </div>
                                          </TableCell>

                    {/* Ver */}
                                        <TableCell className="text-center">
                                          <TableCell className="text-center h-auto py-3">
                                            <div className="flex justify-center">
                                              <Checkbox
                                                checked={item.permisos.ver}
                                                className="dark:border-neutral-500"
                                                onCheckedChange={(checked) =>
                                                  handleTogglePermiso(
                                                    item.recursoId,
                                                    "ver",
                                                    Boolean(checked)
                                                  )
                                                }
                                                aria-label={`Permiso Ver para ${item.recursoNombre}`}
                                              />
                                            </div>
                                          </TableCell>

                                          {/* Crear */}
                                          <TableCell className="text-center">
                                            <TableCell className="text-center h-auto py-3">
                                              <div className="flex justify-center">
                                                <Checkbox
                                                  checked={item.permisos.crear}
                                                  className="dark:border-neutral-500"
                                                  onCheckedChange={(checked) =>
                                                    handleTogglePermiso(
                                                      item.recursoId,
                                                      "crear",
                                                      Boolean(checked)
                                                    )
                                                  }
                                                  aria-label={`Permiso Crear para ${item.recursoNombre}`}
                                                />
                                              </div>
                                            </TableCell>

                                            {/* Editar */}
                                            <TableCell className="text-center">
                                              <TableCell className="text-center h-auto py-3">
                                                <div className="flex justify-center">
                                                  <Checkbox
                                                    checked={item.permisos.editar}
                                                    className="dark:border-neutral-500"
                                                    onCheckedChange={(checked) =>
                                                      handleTogglePermiso(
                                                        item.recursoId,
                                                        "editar",
                                                        Boolean(checked)
                                                      )
                                                    }
                                                    aria-label={`Permiso Editar para ${item.recursoNombre}`}
                                                  />
                                                </div>
                                              </TableCell>

                                              {/* Eliminar */}
                                              <TableCell className="text-center">
                                                <TableCell className="text-center h-auto py-3">
                                                  <div className="flex justify-center">
                                                    <Checkbox
                                                      checked={item.permisos.eliminar}
                                                      className="dark:border-neutral-500"
                                                      onCheckedChange={(checked) =>
                                                        handleTogglePermiso(
                                                          item.recursoId,
                                                          "eliminar",
                                                          Boolean(checked)
                                                        )
                                                      }
                                                      aria-label={`Permiso Eliminar para ${item.recursoNombre}`}
                                                    />
                                                  </div>
                                                </TableCell>

                                                {/* Acción rápida */}
                                                <TableCell className="text-right pr-6">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleAllForRecurso(item.recursoId)}
                                                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                                                  >
                                                    {allSelected ? "Desmarcar todo" : "Todos"}
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                              );
              })}
                                            </TableBody>
                                          </Table>
                                      </div>
                                    </div>
                                  </div>
                                  );
}

