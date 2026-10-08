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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  FolderTree,
  ShieldCheck,
  AlertTriangle,
  Layers,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  AppWindow,
  FolderCode,
  ChevronDown,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { RecursoItem, mockRolesPorRecurso } from "../data/recursos-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface RecursosTableProps {
  recursos: RecursoItem[];
  onViewDetail: (recurso: RecursoItem) => void;
  onEdit: (recurso: RecursoItem) => void;
  onToggleStatus?: (recurso: RecursoItem) => void;
  onDelete?: (recurso: RecursoItem) => void;
  onResetFilters?: () => void;
}

function getAppIcon(appIdOrIcon?: string) {
  switch (appIdOrIcon?.toLowerCase()) {
    case "gestion-docente":
    case "graduationcap":
      return GraduationCap;
    case "talento-humano":
    case "briefcase":
      return Briefcase;
    case "sige":
    case "bookopen":
      return BookOpen;
    case "sso-conecta":
    case "keyround":
      return KeyRound;
    case "geoportal":
    case "mappin":
      return MapPin;
    case "sae":
    case "layers":
      return Layers;
    default:
      return AppWindow;
  }
}

export function RecursosTable({
  recursos,
  onViewDetail,
  onEdit,
  onToggleStatus,
  onDelete,
  onResetFilters,
}: RecursosTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(7);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [recursos.length]);

  const totalPages = Math.ceil(recursos.length / itemsPerPage) || 1;
  const paginatedRecursos = recursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div id="recursos-table-container" className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px] min-w-[240px] pl-6">
                Recurso
              </TableHead>
              <TableHead className="w-[180px] min-w-[160px] text-left">
                Aplicación
              </TableHead>
              <TableHead className="min-w-[260px] text-left">
                Descripción
              </TableHead>
              <TableHead className="w-[150px] min-w-[140px] text-center">
                Roles asociados
              </TableHead>
              <TableHead className="w-[120px] min-w-[110px] text-center">
                Estado
              </TableHead>
              <TableHead className="w-[180px] min-w-[160px] text-right pr-6">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <FolderCode className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        No se encontraron recursos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No existen recursos que coincidan con los criterios de búsqueda o filtros seleccionados.
                      </p>
                    </div>
                    {onResetFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="text-xs mt-1"
                      >
                        Restablecer filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecursos.map((rec) => {
                const rolesAsociados = mockRolesPorRecurso[rec.id] || [];
                const rolesCount = rolesAsociados.length;
                const sinRoles = rolesCount === 0;
                const isActivo = rec.estado === "Activo";
                const AppIcon = getAppIcon(rec.aplicacionIcono || rec.aplicacionId);

                return (
                  <TableRow
                    key={rec.id}
                    className="group hover:bg-muted/40 transition-colors"
                  >
                    {/* 1. Recurso: Nombre + Código */}
                    <TableCell className="pl-6 py-3.5">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors",
                            isActivo
                              ? "bg-warning/10 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 border-warning/20"
                              : "bg-muted text-muted-foreground border-border/50"
                          )}
                        >
                          <FolderTree className="size-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-foreground truncate max-w-[210px]">
                            {rec.nombre}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {rec.codigo}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Aplicación */}
                    <TableCell className="py-3.5 text-left">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <AppIcon className="size-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
                            {rec.aplicacionNombre}
                          </span>
                          <Badge
                            tone="primary"
                            appearance="soft"
                            size="sm"
                            className="font-mono text-[10px] px-1.5 py-0 w-fit"
                          >
                            {rec.aplicacionCodigo}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* 3. Descripción */}
                    <TableCell className="py-3.5 text-left">
                      <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground line-clamp-2 max-w-[340px] cursor-help">
                                {rec.descripcion || "Sin descripción registrada."}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs" variant="info">
                              <p>{rec.descripcion || "Sin descripción registrada."}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    </TableCell>

                    {/* 4. Roles asociados */}
                    <TableCell className="py-3.5 text-center">
                      {sinRoles ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warning/10 dark:bg-warning/20 border border-warning/20 dark:border-warning/30 text-xs font-semibold text-warning-700 dark:text-warning-400 cursor-help">
                              <ShieldCheck className="size-3.5" />
                              <span>0</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent variant="warning" side="top">
                            Ningún rol tiene permisos asignados sobre este recurso
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 border border-border/60 dark:border-border text-xs font-semibold text-foreground">
                          <ShieldCheck className="size-3.5 text-secondary-600 dark:text-secondary-300" />
                          <span>{rolesCount}</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 5. Estado */}
                    <TableCell className="py-3.5 text-center">
                      <Badge
                        tone={isActivo ? "success" : "neutral"}
                        appearance="soft"
                        size="sm"
                        className="text-[11px] font-medium"
                      >
                        {rec.estado}
                      </Badge>
                    </TableCell>

                    {/* 6. Acciones VISIBLES */}
                    <TableCell className="py-3.5 text-right pr-6">
                      <div className="inline-flex items-center justify-end gap-1">
                        {/* Ver Detalle */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewDetail(rec)}
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                              aria-label={`Ver detalle de ${rec.nombre}`}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" variant="info">
                            Ver detalle
                          </TooltipContent>
                        </Tooltip>

                        {/* Editar */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(rec)}
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                              aria-label={`Editar recurso ${rec.nombre}`}
                            >
                              <Edit className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" variant="info">
                            Editar recurso
                          </TooltipContent>
                        </Tooltip>

                        {/* Activar / Desactivar */}
                        {onToggleStatus && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onToggleStatus(rec)}
                                aria-label={isActivo ? "Desactivar recurso" : "Activar recurso"}
                                className={cn(
                                  "size-8 transition-colors",
                                  isActivo
                                    ? "text-warning-600 hover:text-warning-700 hover:bg-warning/10"
                                    : "text-success-700 dark:text-success-400 hover:bg-success/10"
                                )}
                              >
                                {isActivo ? (
                                  <PowerOff className="size-4" />
                                ) : (
                                  <Power className="size-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              variant={isActivo ? "warning" : "info"}
                              side="top"
                            >
                              {isActivo ? "Desactivar recurso" : "Activar recurso"}
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Eliminar */}
                        {onDelete && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(rec)}
                                aria-label={`Eliminar recurso ${rec.nombre}`}
                                className="size-8 text-danger hover:text-danger-700 hover:bg-danger/10"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" variant="danger">
                              Eliminar recurso
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t border-border bg-surface">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Mostrando {recursos.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, recursos.length)} de {recursos.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">por pág:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1">
                    <span>{itemsPerPage}</span>
                    <ChevronDown className="size-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[60px]">
                  {[5, 7, 10, 15].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => {
                        setItemsPerPage(size);
                        setCurrentPage(1);
                      }}
                      className="text-xs cursor-pointer justify-center"
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={cn(currentPage === 1 && "pointer-events-none opacity-40")}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={cn(currentPage === totalPages && "pointer-events-none opacity-40")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </TooltipProvider>
  );
}

