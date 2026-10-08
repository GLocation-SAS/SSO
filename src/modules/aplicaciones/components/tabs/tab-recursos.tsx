"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getRoleBadgeStyle } from "@/lib/role-badge";
import { Search as SearchInput } from "@/components/ui/search";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FolderTree,
  Folder,
  FileCode,
  Plus,
  CornerDownRight,
  ShieldCheck,
  Search,
  Eye,
  Unlink,
  ChevronRight,
} from "lucide-react";
import {
  AplicacionItem,
  AplicacionRecurso,
  mockRecursosPorApp,
} from "../../data/aplicaciones-data";
import { Link } from "@/routing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TabRecursosProps {
  aplicacion: AplicacionItem;
}

// Recursos de ejemplo globales
const RECURSOS_SISTEMA = [
  {
    id: "rs1",
    nombre: "Registro Docente",
    descripcion: "Administración docente",
    recursoPadreNombre: null,
    rolesConAcceso: ["Administrador"],
    estado: "Activo",
  },
  {
    id: "rs2",
    nombre: "Datos generales",
    descripcion: "Datos personales",
    recursoPadreNombre: "Registro Docente",
    rolesConAcceso: ["Administrador", "Analista"],
    estado: "Activo",
  },
  {
    id: "rs3",
    nombre: "Contratos",
    descripcion: "Gestión de contratos",
    recursoPadreNombre: "Registro Docente",
    rolesConAcceso: ["Administrador"],
    estado: "Activo",
  },
  {
    id: "rs4",
    nombre: "Reportes",
    descripcion: "Estadísticas y reportes",
    recursoPadreNombre: null,
    rolesConAcceso: ["Administrador", "Consulta"],
    estado: "Activo",
  },
];

export function TabRecursos({ aplicacion }: TabRecursosProps) {
  const initialRecursos = mockRecursosPorApp[aplicacion.id] || [];

  const [recursos, setRecursos] =
    React.useState<AplicacionRecurso[]>(initialRecursos);
  const [isAsociarOpen, setIsAsociarOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRecursosToAsociar, setSelectedRecursosToAsociar] =
    React.useState<string[]>([]);

  // Desasociar state
  const [recursoToDesasociar, setRecursoToDesasociar] =
    React.useState<AplicacionRecurso | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const [expandedPadres, setExpandedPadres] = React.useState<string[]>([]);
  const toggleExpand = (id: string) => {
    setExpandedPadres((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const rootRecursos = React.useMemo(
    () => recursos.filter((r) => !r.recursoPadreNombre),
    [recursos],
  );
  const childRecursosByPadreNombre = React.useMemo(() => {
    return recursos
      .filter((r) => r.recursoPadreNombre)
      .reduce(
        (acc, r) => {
          const pName = r.recursoPadreNombre!;
          if (!acc[pName]) acc[pName] = [];
          acc[pName].push(r);
          return acc;
        },
        {} as Record<string, AplicacionRecurso[]>,
      );
  }, [recursos]);

  const unassociatedRecursos = React.useMemo(() => {
    return RECURSOS_SISTEMA.filter(
      (rs) =>
        !recursos.some((r) => r.nombre === rs.nombre) &&
        (searchTerm === "" ||
          rs.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [recursos, searchTerm]);

  const handleToggleRecursoSelection = (id: string) => {
    setSelectedRecursosToAsociar((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleAsociarRecursos = () => {
    if (selectedRecursosToAsociar.length === 0) return;

    const newRecursos = selectedRecursosToAsociar.map((id) => {
      const globalRec = RECURSOS_SISTEMA.find((r) => r.id === id)!;
      return {
        id: `rec-app-${globalRec.id}`,
        aplicacionId: aplicacion.id,
        nombre: globalRec.nombre,
        descripcion: globalRec.descripcion,
        recursoPadreId: globalRec.recursoPadreNombre
          ? `padre-${globalRec.recursoPadreNombre}`
          : null,
        recursoPadreNombre: globalRec.recursoPadreNombre,
        rolesConAcceso: globalRec.rolesConAcceso,
        estado: globalRec.estado,
      } as AplicacionRecurso;
    });

    setRecursos((prev) => [...prev, ...newRecursos]);
    toast.success(
      `${selectedRecursosToAsociar.length} recurso(s) asociado(s) correctamente.`,
    );
    setIsAsociarOpen(false);
    setSelectedRecursosToAsociar([]);
  };

  const handleDesasociar = () => {
    if (!recursoToDesasociar) return;
    setRecursos((prev) => prev.filter((r) => r.id !== recursoToDesasociar.id));
    toast.success(
      `Recurso "${recursoToDesasociar.nombre}" desasociado de la aplicación.`,
    );
    setIsConfirmOpen(false);
    setRecursoToDesasociar(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header del Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-warning/10 text-warning-700 dark:text-warning-300 flex items-center justify-center shrink-0">
            <FolderTree className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Recursos asociados
            </h3>
            <p className="text-xs text-muted-foreground">
              Funcionalidades y módulos disponibles dentro de{" "}
              {aplicacion.nombre}.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5 text-xs shrink-0"
          onClick={() => {
            setSearchTerm("");
            setSelectedRecursosToAsociar([]);
            setIsAsociarOpen(true);
          }}
        >
          <Plus className="size-4" />
          <span>Asociar recurso</span>
        </Button>
      </div>

      {/* Tabla Jerárquica */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[320px] pl-6 dark:text-white">
              Recurso institucional
            </TableHead>
            <TableHead className="w-[180px] dark:text-white">
              Recurso padre
            </TableHead>
            <TableHead className="w-[280px] dark:text-white">
              Roles con acceso
            </TableHead>
            <TableHead className="w-[110px] text-center dark:text-white">
              Estado
            </TableHead>
            <TableHead className="w-[180px] text-right dark:text-white pr-6">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rootRecursos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground dark:text-neutral-300"
              >
                No hay recursos asociados a esta aplicación.
              </TableCell>
            </TableRow>
          ) : (
            rootRecursos.map((rootRec) => {
              const children = childRecursosByPadreNombre[rootRec.nombre] || [];
              const hasChildren = children.length > 0;
              const isExpanded = expandedPadres.includes(rootRec.id);

              return (
                <React.Fragment key={rootRec.id}>
                  <TableRow
                    className={cn(
                      "border-l-4 border-l-primary dark:bg-muted/65 hover:bg-muted/50 dark:hover:bg-muted/80 transition-colors",
                      isExpanded && "bg-muted/30 dark:bg-muted/80",
                    )}
                  >
                    {/* 1. Recurso Padre */}
                    <TableCell className="pl-6">
                      <div className="flex items-start gap-2.5 py-1">
                        <div className="flex items-center gap-1.5">
                          {hasChildren ? (
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => toggleExpand(rootRec.id)}
                                    className="size-6 p-0 rounded-md hover:bg-primary/20 text-primary transition-transform duration-300 shrink-0 mt-0.5"
                                  >
                                    <ChevronRight
                                      className={cn(
                                        "size-4 transition-transform duration-300",
                                        isExpanded && "rotate-90",
                                      )}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="text-xs">
                                    Desplegar submódulos
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div className="size-6 shrink-0 mt-0.5"></div>
                          )}
                          <div className="size-7 rounded-md bg-primary/10 dark:bg-primary-900/40 text-primary dark:text-primary-300 flex items-center justify-center shrink-0 mt-0.5">
                            <Folder className="size-4" />
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm truncate font-bold font-heading text-foreground dark:text-white">
                            {rootRec.nombre}
                          </span>
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help group w-fit mt-0.5">
                                  <span className="text-xs text-muted-foreground dark:text-neutral-300 line-clamp-1">
                                    {rootRec.descripcion}
                                  </span>
                                  {rootRec.descripcion && (
                                    <div className="size-4 rounded-full bg-muted dark:bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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
                                <p className="text-sm">{rootRec.descripcion}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground dark:text-neutral-400 italic">
                        Raíz (Principal)
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                        {rootRec.rolesConAcceso.map((rol) => {
                          const style = getRoleBadgeStyle(rol);
                          return (
                            <Badge
                              key={rol}
                              tone={style.tone}
                              appearance={style.appearance}
                              size="sm"
                              className={cn("text-[10px]", style.className)}
                            >
                              <ShieldCheck className="size-3" />
                              {rol}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        tone={
                          rootRec.estado === "Activo" ? "success" : "neutral"
                        }
                        appearance="soft"
                        size="sm"
                      >
                        {rootRec.estado}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Link href="/gestion-recursos/recursos">
                                  <Eye className="size-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" variant="info">
                              <p>Ver recurso</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-danger hover:text-danger-700 hover:bg-danger/10"
                                onClick={() => {
                                  setRecursoToDesasociar(rootRec);
                                  setIsConfirmOpen(true);
                                }}
                              >
                                <Unlink className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" variant="danger">
                              <p>Desasociar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Hijos */}
                  {isExpanded &&
                    children.map((childRec) => (
                      <TableRow
                        key={childRec.id}
                        className="bg-muted/10 dark:bg-muted/25 hover:bg-muted/20 dark:hover:bg-muted/45"
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-start gap-2.5 py-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground dark:text-neutral-300 pl-4 shrink-0 mt-0.5">
                              <CornerDownRight className="size-4 text-primary dark:text-primary-300" />
                              <FileCode className="size-4 text-muted-foreground dark:text-neutral-300" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm truncate font-medium text-foreground dark:text-neutral-100">
                                {childRec.nombre}
                              </span>
                              <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1.5 cursor-help group w-fit mt-0.5">
                                      <span className="text-xs text-muted-foreground dark:text-neutral-300 line-clamp-1">
                                        {childRec.descripcion}
                                      </span>
                                      {childRec.descripcion && (
                                        <div className="size-4 rounded-full bg-muted dark:bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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
                                    <p className="text-sm">
                                      {childRec.descripcion}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-foreground dark:text-neutral-200 font-medium">
                            <Folder className="size-3.5 text-muted-foreground dark:text-neutral-400 shrink-0" />
                            <span>{childRec.recursoPadreNombre}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                            {childRec.rolesConAcceso.map((rol) => {
                              const style = getRoleBadgeStyle(rol);
                              return (
                                <Badge
                                  key={rol}
                                  tone={style.tone}
                                  appearance={style.appearance}
                                  size="sm"
                                  className={cn("text-[10px]", style.className)}
                                >
                                  <ShieldCheck className="size-3" />
                                  {rol}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            tone={
                              childRec.estado === "Activo"
                                ? "success"
                                : "neutral"
                            }
                            appearance="soft"
                            size="sm"
                          >
                            {childRec.estado}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  >
                                    <Link href="/gestion-recursos/recursos">
                                      <Eye className="size-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" variant="info">
                                  <p>Ver recurso</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-danger hover:text-danger-700 hover:bg-danger/10"
                                    onClick={() => {
                                      setRecursoToDesasociar(childRec);
                                      setIsConfirmOpen(true);
                                    }}
                                  >
                                    <Unlink className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" variant="danger">
                                  <p>Desasociar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Dialog para Asociar Recurso */}
      <Dialog open={isAsociarOpen} onOpenChange={setIsAsociarOpen}>
        <DialogContent size="2xl" className="p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-border bg-surface shrink-0 text-left">
            <DialogTitle className="text-xl font-heading font-bold text-primary">
              Asociar recursos a {aplicacion.nombre}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Selecciona los recursos existentes que deseas hacer disponibles en
              esta aplicación.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 flex flex-col h-[500px]">
            <SearchInput
              placeholder="Buscar recurso por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[50px] text-center"></TableHead>
                    <TableHead>Nombre / Jerarquía</TableHead>
                    <TableHead>Padre</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Estado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unassociatedRecursos.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground text-sm"
                      >
                        No se encontraron recursos disponibles.
                      </TableCell>
                    </TableRow>
                  ) : (
                    unassociatedRecursos.map((rs) => (
                      <TableRow
                        key={rs.id}
                        className="cursor-pointer hover:bg-muted/20"
                        onClick={() => handleToggleRecursoSelection(rs.id)}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedRecursosToAsociar.includes(rs.id)}
                            onCheckedChange={() =>
                              handleToggleRecursoSelection(rs.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-foreground">
                              {rs.nombre}
                            </span>
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1.5 cursor-help group w-fit mt-0.5">
                                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                                      {rs.descripcion}
                                    </span>
                                    {rs.descripcion && (
                                      <div className="size-4 rounded-full bg-muted dark:bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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
                                  <p className="text-sm">{rs.descripcion}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {rs.recursoPadreNombre || "Raíz"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge tone="success" appearance="soft" size="sm">
                            Activo
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/10">
            <Button
              type="button"
              variant="neutral"
              onClick={() => setIsAsociarOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              className="text-xs"
              onClick={handleAsociarRecursos}
              disabled={selectedRecursosToAsociar.length === 0}
            >
              Asociar seleccionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación Desasociar */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Desasociar recurso"
        description={
          recursoToDesasociar && recursoToDesasociar.rolesConAcceso.length > 0
            ? `Este recurso está asociado a ${recursoToDesasociar.rolesConAcceso.length} roles. Al desasociarlo, estos roles dejarán de tener acceso al recurso dentro de ${aplicacion.nombre}. ¿Continuar?`
            : `¿Estás seguro que deseas desasociar el recurso "${recursoToDesasociar?.nombre}" de esta aplicación?`
        }
        confirmText="Desasociar"
        variant="danger"
        onConfirm={handleDesasociar}
      />
    </div>
  );
}
