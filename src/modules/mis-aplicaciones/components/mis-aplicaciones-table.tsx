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
import { InteractiveCard } from "@/components/ui/data-display";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  School,
  Users,
  Headphones,
  FileText,
  ShieldCheck,
  Building2,
  Clock,
  FolderTree,
  ExternalLink,
  Plus,
  Eye,
  ChevronDown,
} from "lucide-react";
import { MisAplicacionItem } from "../data/mis-aplicaciones-data";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  GraduationCap,
  School,
  Users,
  Headphones,
  FileText,
  Shield: ShieldCheck,
  ShieldCheck,
};

const COLOR_MAP = {
  primary: "bg-primary/10 text-primary border-primary/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
  purple: "bg-primary-300/15 text-primary-600 dark:text-primary-300 border-primary-300/30",
};

interface MisAplicacionesTableProps {
  apps: MisAplicacionItem[];
  onOpenApp: (app: MisAplicacionItem) => void;
  onViewRecursos: (app: MisAplicacionItem) => void;
}

export function MisAplicacionesTable({
  apps,
  onOpenApp,
  onViewRecursos,
}: MisAplicacionesTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(6);

  const totalPages = Math.ceil(apps.length / itemsPerPage) || 1;

  // Reset to page 1 if apps array shrinks
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [apps.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = apps.slice(startIndex, startIndex + itemsPerPage);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col gap-4 w-full">
        {/* Vista Desktop (lg y superior) */}
        <div className="hidden lg:block overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] min-w-[280px] pl-6 font-bold text-white">
                Aplicación
              </TableHead>
              <TableHead className="w-[120px] min-w-[110px] text-left font-bold text-white">
                Estado
              </TableHead>
              <TableHead className="w-[180px] min-w-[160px] text-left font-bold text-white">
                Sede
              </TableHead>
              <TableHead className="w-[170px] min-w-[150px] text-left font-bold text-white">
                Roles
              </TableHead>
              <TableHead className="w-[130px] min-w-[120px] text-left font-bold text-white">
                Recursos
              </TableHead>
              <TableHead className="w-[160px] min-w-[150px] text-left font-bold text-white">
                Último acceso
              </TableHead>
              <TableHead className="w-[110px] min-w-[100px] text-right pr-6 font-bold text-white">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                  No se encontraron aplicaciones con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedApps.map((app) => {
                const IconComponent = ICON_MAP[app.icono as keyof typeof ICON_MAP] || GraduationCap;
                const colorClass = COLOR_MAP[app.colorTone] || COLOR_MAP.primary;

                return (
                  <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                    {/* 1. Aplicación: Icono + Nombre + Código + Descripción */}
                    <TableCell className="pl-6 py-3.5">
                      <div className="flex items-start gap-3 py-0.5">
                        <div
                          className={cn(
                            "size-9 rounded-lg flex items-center justify-center shrink-0 border mt-0.5",
                            colorClass
                          )}
                        >
                          <IconComponent className="size-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onViewRecursos(app)}
                              className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate max-w-[210px] text-left cursor-pointer"
                            >
                              {app.nombre}
                            </button>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              {app.codigo}
                            </span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 cursor-help group w-fit mt-0.5">
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
                                  {app.descripcion}
                                </p>
                                <div className="size-4 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  <Plus className="size-3" />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="flex flex-col items-start gap-1 max-w-xs text-left p-2.5 text-white"
                            >
                              <p className="font-bold text-white text-xs leading-tight">
                                {app.categoria}
                              </p>
                              <p className="text-white/95 text-xs leading-normal">
                                {app.descripcion}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Estado */}
                    <TableCell className="text-left py-3.5 whitespace-nowrap">
                      <Badge
                        appearance="soft"
                        tone={app.estado === "Activa" ? "success" : "neutral"}
                        className={cn(
                          "font-semibold border text-xs px-2.5 py-0.5",
                          app.estado === "Activa"
                            ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                            : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                        )}
                      >
                        {app.estado}
                      </Badge>
                    </TableCell>

                    {/* 3. Sede */}
                    <TableCell className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-md bg-primary/10 dark:bg-primary-950/40 border border-primary/20 dark:border-primary-800/50 flex items-center justify-center text-primary dark:text-primary-300 shrink-0">
                          <Building2 className="size-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-foreground truncate max-w-[160px]">
                            {app.sede.nombre}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {app.sede.tipo}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 4. Roles */}
                    <TableCell className="text-left py-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 border border-border/60 dark:border-border text-xs font-semibold text-foreground">
                        <ShieldCheck className="size-3.5 text-secondary-600 dark:text-secondary-300 shrink-0" />
                        <span className="truncate max-w-[150px]">{app.rol.nombre}</span>
                      </div>
                    </TableCell>

                    {/* 5. Recursos */}
                    <TableCell className="text-left py-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewRecursos(app)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 dark:bg-muted/80 hover:bg-warning/10 hover:border-warning/30 hover:text-warning-700 dark:hover:text-warning-300 transition-all border border-border/60 dark:border-border text-xs font-semibold text-foreground cursor-pointer"
                        title="Ver recursos asignados"
                      >
                        <FolderTree className="size-3.5 text-warning-600 dark:text-warning-400 shrink-0" />
                        <span>{app.recursos.length} recursos</span>
                      </button>
                    </TableCell>

                    {/* 6. Último acceso */}
                    <TableCell className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <Clock className="size-3 text-muted-foreground/70 shrink-0" />
                        <span>{app.ultimoAcceso}</span>
                      </div>
                    </TableCell>

                    {/* 7. Acciones */}
                    <TableCell className="pr-6 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewRecursos(app)}
                              aria-label="Ver detalle y permisos"
                              className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Ver detalle y permisos
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onOpenApp(app)}
                              aria-label="Ingresar a la aplicación"
                              className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <ExternalLink className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Ingresar a la aplicación
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
      </div>

      {/* Mobile Card Row (Responsive: pantallas < lg) */}
      <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {paginatedApps.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground border border-border rounded-xl bg-surface">
            No se encontraron aplicaciones con los filtros aplicados.
          </div>
        ) : (
          paginatedApps.map((app) => {
            const IconComponent = ICON_MAP[app.icono as keyof typeof ICON_MAP] || GraduationCap;
            const colorClass = COLOR_MAP[app.colorTone] || COLOR_MAP.primary;

            return (
              <InteractiveCard
                key={app.id}
                className="flex flex-col gap-3 text-left"
                color="default"
                hideChevron
              >
                {/* Cabecera: Icono, Nombre, Código y Badge de estado */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center shrink-0 border",
                        colorClass
                      )}
                    >
                      <IconComponent className="size-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onViewRecursos(app)}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate max-w-[170px] text-left cursor-pointer"
                        >
                          {app.nombre}
                        </button>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
                          {app.codigo}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {app.descripcion}
                      </span>
                    </div>
                  </div>
                  <Badge
                    appearance="soft"
                    tone={app.estado === "Activa" ? "success" : "neutral"}
                    className={cn(
                      "shrink-0 px-2 py-0.5 text-[11px] font-semibold border",
                      app.estado === "Activa"
                        ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                        : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                    )}
                  >
                    {app.estado}
                  </Badge>
                </div>

                {/* Sede y Rol */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Building2 className="size-3 text-primary shrink-0" />
                      Sede
                    </span>
                    <span className="text-foreground font-medium truncate" title={app.sede.nombre}>
                      {app.sede.nombre}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {app.sede.tipo}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                      <ShieldCheck className="size-3 text-secondary-600 dark:text-secondary-400 shrink-0" />
                      Rol
                    </span>
                    <span className="text-foreground font-medium truncate" title={app.rol.nombre}>
                      {app.rol.nombre}
                    </span>
                  </div>
                </div>

                {/* Recursos y Último acceso */}
                <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => onViewRecursos(app)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 hover:bg-warning/10 text-muted-foreground hover:text-warning-700 dark:hover:text-warning-300 border border-border/60 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <FolderTree className="size-3 text-warning-600 dark:text-warning-400 shrink-0" />
                    <span>{app.recursos.length} recursos</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                    <Clock className="size-3 shrink-0" />
                    <span className="truncate">{app.ultimoAcceso}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewRecursos(app)}
                    className="text-xs h-8 gap-1.5"
                  >
                    <Eye className="size-3.5" />
                    <span>Detalles</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenApp(app)}
                    className="text-xs h-8 gap-1.5"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Ingresar</span>
                  </Button>
                </div>
              </InteractiveCard>
            );
          })
        )}
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Mostrando{" "}
            {apps.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}
            –{Math.min(currentPage * itemsPerPage, apps.length)} de{" "}
            {apps.length}
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
