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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Edit,
  Power,
  PowerOff,
  ChevronDown,
  Users,
  ShieldCheck,
  Layers,
  MoreVertical,
  ExternalLink,
  GraduationCap,
  Briefcase,
  BookOpen,
  KeyRound,
  MapPin,
  FolderTree,
} from "lucide-react";
import { AplicacionItem } from "../data/aplicaciones-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@/routing";
import { cn } from "@/lib/utils";

interface AplicacionesTableProps {
  aplicaciones: AplicacionItem[];
  onViewDetail: (app: AplicacionItem) => void;
  onEdit: (app: AplicacionItem) => void;
  onToggleStatus: (app: AplicacionItem) => void;
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

export function AplicacionesTable({
  aplicaciones,
  onViewDetail,
  onEdit,
  onToggleStatus,
}: AplicacionesTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(6);
  const totalPages = Math.ceil(aplicaciones.length / itemsPerPage) || 1;

  const paginatedApps = aplicaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div id="aplicaciones-table-container" className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] min-w-[280px] dark:text-white pl-6">
                Aplicación
              </TableHead>
              <TableHead className="w-[120px] min-w-[110px] text-left dark:text-white">
                Estado
              </TableHead>
              <TableHead className="w-[130px] min-w-[120px] text-left dark:text-white">
                Usuarios
              </TableHead>
              <TableHead className="w-[120px] min-w-[110px] text-center dark:text-white">
                Roles
              </TableHead>
              <TableHead className="w-[120px] min-w-[110px] text-center dark:text-white">
                Recursos
              </TableHead>
              <TableHead className="w-[170px] min-w-[160px] dark:text-white">
                Última actualización
              </TableHead>
              <TableHead className="w-[160px] min-w-[150px] text-right dark:text-white pr-6">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron aplicaciones disponibles.
                </TableCell>
              </TableRow>
            ) : (
              paginatedApps.map((app) => {
                const IconComponent = getAppIcon(app.icono);

                return (
                  <TableRow key={app.id}>
                    {/* 1. Aplicación: Nombre + Descripción */}
                    <TableCell className="pl-6">
                      <div className="flex items-start gap-3 py-1">
                        <div className="size-9 rounded-lg bg-primary/10 dark:bg-primary-900/40 border border-primary/20 dark:border-primary-700/50 flex items-center justify-center shrink-0 mt-0.5 text-primary dark:text-primary-300">
                          <IconComponent className="size-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onViewDetail(app)}
                              className="font-semibold text-sm text-foreground hover:text-primary dark:hover:text-primary-300 transition-colors truncate max-w-[220px] text-left cursor-pointer"
                            >
                              {app.nombre}
                            </button>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted dark:bg-muted/80 text-muted-foreground dark:text-neutral-300 border border-border">
                              {app.codigo}
                            </span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground dark:text-neutral-300 line-clamp-1 max-w-[260px] cursor-default">
                                {app.descripcion}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs" variant="info">
                              <p>{app.descripcion}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Estado */}
                    <TableCell className="text-left">
                      <Badge
                        tone={app.estado === "Activa" ? "success" : "neutral"}
                        appearance="soft"
                        className={cn(
                          "font-semibold border text-xs px-2.5 py-0.5",
                          app.estado === "Activa" && "bg-success/15 text-success-800 dark:text-success-300 border-success/30",
                          app.estado === "Inactiva" && "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                        )}
                      >
                        {app.estado}
                      </Badge>
                    </TableCell>

                    {/* 3. Usuarios */}
                    <TableCell className="text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 border border-border/60 dark:border-border text-xs font-semibold text-foreground">
                        <Users className="size-3.5 text-primary dark:text-primary-300" />
                        <span>{app.usuariosCount.toLocaleString("es-EC")}</span>
                      </div>
                    </TableCell>

                    {/* 4. Roles */}
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 border border-border/60 dark:border-border text-xs font-semibold text-foreground">
                        <ShieldCheck className="size-3.5 text-secondary-600 dark:text-secondary-300" />
                        <span>{app.rolesCount}</span>
                      </div>
                    </TableCell>

                    {/* 5. Recursos */}
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 border border-border/60 dark:border-border text-xs font-semibold text-foreground">
                        <FolderTree className="size-3.5 text-warning-600 dark:text-warning-400" />
                        <span>{app.recursosCount}</span>
                      </div>
                    </TableCell>

                    {/* 6. Última actualización */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground dark:text-neutral-300 whitespace-nowrap">
                        {app.ultimaActualizacion}
                      </span>
                    </TableCell>

                    {/* 7. Acciones */}
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        {/* Ver Detalle Directo (Modal) */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewDetail(app)}
                              aria-label="Ver detalle"
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" variant="info">Ver detalle</TooltipContent>
                        </Tooltip>

                        {/* Editar Directo */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(app)}
                              aria-label="Editar aplicación"
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" variant="info">Editar</TooltipContent>
                        </Tooltip>

                        {/* Menú Contextual */}
                        {/* Abrir URL de acceso */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                            >
                              <a
                                href={app.urlAcceso}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Abrir URL de acceso"
                              >
                                <ExternalLink className="size-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" variant="info">Abrir URL</TooltipContent>
                        </Tooltip>

                        {/* Cambiar Estado */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onToggleStatus(app)}
                              aria-label={app.estado === "Activa" ? "Inactivar aplicación" : "Activar aplicación"}
                              className={cn(
                                "size-8",
                                app.estado === "Activa"
                                  ? "text-warning hover:text-warning hover:bg-warning/10"
                                  : "text-success hover:text-success hover:bg-success/10"
                              )}
                            >
                              {app.estado === "Activa" ? (
                                <PowerOff className="size-4" />
                              ) : (
                                <Power className="size-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" variant="info">
                            {app.estado === "Activa" ? "Inactivar" : "Activar"}
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

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Mostrando{" "}
              {aplicaciones.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}
              –
              {Math.min(currentPage * itemsPerPage, aplicaciones.length)} de{" "}
              {aplicaciones.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">por pág:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2 gap-1"
                  >
                    <span>{itemsPerPage}</span>
                    <ChevronDown className="size-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[60px]">
                  {[3, 6, 9, 12].map((size) => (
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
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
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
                  className={
                    currentPage === totalPages || totalPages === 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </TooltipProvider>
  );
}

