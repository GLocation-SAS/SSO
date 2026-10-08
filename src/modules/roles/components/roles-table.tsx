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
  Power,
  PowerOff,
  ShieldCheck,
  FolderTree,
  Users,
  AlertTriangle,
  FolderCode,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  Layers,
  AppWindow,
  ChevronDown,
} from "lucide-react";
import { RolItem } from "../data/roles-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface RolesTableProps {
  roles: RolItem[];
  onViewDetail: (rol: RolItem) => void;
  onEdit: (rol: RolItem) => void;
  onToggleStatus: (rol: RolItem) => void;
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

export function RolesTable({
  roles,
  onViewDetail,
  onEdit,
  onToggleStatus,
  onResetFilters,
}: RolesTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(7);

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [roles.length]);

  const totalPages = Math.ceil(roles.length / itemsPerPage) || 1;
  const paginatedRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div id="roles-table-container" className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[320px] min-w-[280px] pl-6">
                Nombre del rol
              </TableHead>
              <TableHead className="w-[180px] min-w-[160px] text-left">
                Aplicación
              </TableHead>
              <TableHead className="w-[160px] min-w-[140px] text-center">
                Recursos asociados
              </TableHead>
              <TableHead className="w-[130px] min-w-[110px] text-center">
                Estado
              </TableHead>
              <TableHead className="w-[160px] min-w-[140px] text-right pr-6">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <FolderCode className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        No se encontraron roles
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No existen roles que coincidan con los criterios de búsqueda o filtros seleccionados.
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
              paginatedRoles.map((rol) => {
                const recursosCount = rol.recursosAsignados.length;
                const sinRecursos = recursosCount === 0;
                const isActivo = rol.estado === "Activo";

                return (
                  <TableRow
                    key={rol.id}
                    className="group hover:bg-muted/40 transition-colors"
                  >
                    {/* 1. Nombre del rol + descripción + usuarios */}
                    <TableCell className="pl-6 py-3.5">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                            isActivo
                              ? "bg-primary/10 text-primary dark:bg-primary/20"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <ShieldCheck className="size-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground truncate max-w-[220px]">
                              {rol.nombre}
                            </span>
                            {sinRecursos && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center text-warning-600 dark:text-warning-400">
                                    <AlertTriangle className="size-3.5" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent variant="warning" side="top">
                                  Sin recursos ni permisos configurados
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-[280px] cursor-help">
                                    {rol.descripcion || "Sin descripción"}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs" variant="info">
                                  <p>{rol.descripcion || "Sin descripción"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                            <Users className="size-3 text-muted-foreground/70" />
                            <span>
                              {rol.usuariosCount}{" "}
                              {rol.usuariosCount === 1 ? "usuario" : "usuarios"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Aplicación */}
                    <TableCell className="py-3.5 text-left">
                      {(() => {
                        const AppIcon = getAppIcon(rol.aplicacionIcono || rol.aplicacionId);
                        return (
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-primary/10 dark:bg-primary-900/40 border border-primary/20 dark:border-primary-700/50 flex items-center justify-center shrink-0 text-primary dark:text-primary-300">
                              <AppIcon className="size-4" />
                            </div>
                            <div className="flex flex-col items-start gap-0.5 min-w-0">
                              <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                                {rol.aplicacionNombre}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted dark:bg-muted/80 text-muted-foreground dark:text-neutral-300 border border-border">
                                {rol.aplicacionCodigo}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </TableCell>

                    {/* 3. Recursos asociados */}
                    <TableCell className="py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 border border-border/60 dark:border-border text-xs font-semibold text-foreground">
                        <FolderTree className="size-3.5 text-warning-600 dark:text-warning-400" />
                        <span>{recursosCount}</span>
                      </div>
                    </TableCell>

                    {/* 4. Estado */}
                    <TableCell className="py-3.5 text-center">
                      <Badge
                        tone={isActivo ? "success" : "neutral"}
                        appearance="soft"
                        size="sm"
                        className="font-semibold text-[11px] px-2.5 py-0.5"
                      >
                        {rol.estado}
                      </Badge>
                    </TableCell>

                    {/* 5. Acciones VISIBLES: Ver detalle, Editar, Activar/Desactivar (NUNCA menú 3 puntos) */}
                    <TableCell className="py-3.5 text-right pr-6">
                      <div className="inline-flex items-center justify-end gap-1">
                        {/* Ver detalle */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewDetail(rol)}
                              aria-label="Ver detalle del rol"
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent variant="info" side="top">
                            Ver detalle
                          </TooltipContent>
                        </Tooltip>

                        {/* Editar */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(rol)}
                              aria-label="Editar rol"
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent variant="info" side="top">
                            Editar rol
                          </TooltipContent>
                        </Tooltip>

                        {/* Activar / Desactivar */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onToggleStatus(rol)}
                              aria-label={isActivo ? "Desactivar rol" : "Activar rol"}
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
                            {isActivo ? "Desactivar rol" : "Activar rol"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Paginación y Contador */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t border-border bg-surface">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Mostrando {roles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, roles.length)} de {roles.length}
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
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </TooltipProvider>
  );
}
