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
import { InteractiveCard } from "@/components/ui/data-display";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, ShieldCheck, Key, Power, PowerOff, ChevronDown, Building2, LayoutGrid } from "lucide-react";
import { getRoleBadgeStyle } from "@/lib/role-badge";
import { UsuarioItem } from "../data/usuarios-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface UsuariosTableProps {
  usuarios: UsuarioItem[];
  onViewDetail: (usuario: UsuarioItem) => void;
  onEdit: (usuario: UsuarioItem) => void;
  onManageAccess: (usuario: UsuarioItem) => void;
  onChangePassword: (usuario: UsuarioItem) => void;
  onToggleStatus: (usuario: UsuarioItem) => void;
}

function AccesosCell({
  usr,
}: {
  usr: UsuarioItem;
}) {
  const allAsignaciones = React.useMemo(() => {
    return usr.sedes.flatMap((s) => s.asignaciones);
  }, [usr.sedes]);

  if (usr.sedes.length === 0 || allAsignaciones.length === 0) {
    return (
      <div className="flex items-center py-1 min-w-[180px]">
        <Badge
          tone="warning"
          appearance="soft"
          size="sm"
          className="w-fit text-[11px] font-medium"
        >
          Sin accesos
        </Badge>
      </div>
    );
  }

  const primaryAsig = allAsignaciones[0];
  const primarySede = primaryAsig.sedeNombre || usr.sedes[0]?.sedeNombre || "Sin sede";
  const primaryApp = primaryAsig.aplicacionNombre || "Sin aplicación";
  const primaryRol = primaryAsig.rolNombre || "Sin rol";
  const remainingCount = allAsignaciones.length - 1;

  return (
    <div className="flex flex-col gap-1.5 py-1 min-w-[200px]">
      {/* 1. Sede */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-xs cursor-default">
            <Building2 className="size-3.5 text-primary shrink-0" />
            <span className="font-semibold text-xs text-foreground truncate max-w-[210px]">
              {primarySede}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top" className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 opacity-80">
            <Building2 className="size-3.5 shrink-0" />
            <span className="font-semibold text-[11px]">Sede</span>
          </div>
          <p className="text-xs font-medium">{primarySede}</p>
        </TooltipContent>
      </Tooltip>

      {/* 2. Aplicación */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-xs cursor-default">
            <LayoutGrid className="size-3.5 text-primary shrink-0" />
            <span className="font-semibold text-xs text-foreground truncate max-w-[210px]">
              {primaryApp}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top" className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 opacity-80">
            <LayoutGrid className="size-3.5 shrink-0" />
            <span className="font-semibold text-[11px]">Aplicación</span>
          </div>
          <p className="text-xs font-medium">{primaryApp}</p>
        </TooltipContent>
      </Tooltip>

      {/* 3. Rol */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-default">
            {(() => {
              const style = getRoleBadgeStyle(primaryRol);
              return (
                <Badge
                  tone={style.tone}
                  appearance={style.appearance}
                  size="sm"
                  className={cn("max-w-[210px] truncate text-[10px] tracking-normal", style.className)}
                >
                  <ShieldCheck className="size-3" />
                  <span className="truncate">{primaryRol}</span>
                </Badge>
              );
            })()}
          </div>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top" className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 opacity-80">
            <ShieldCheck className="size-3.5 shrink-0" />
            <span className="font-semibold text-[11px]">Rol</span>
          </div>
          <p className="text-xs font-medium">{primaryRol}</p>
        </TooltipContent>
      </Tooltip>

      {/* Debajo: Badge asignaciones restantes */}
      {remainingCount > 0 && (
        <div className="pt-1 border-t border-border/40 mt-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                tone="neutral"
                appearance="soft"
                size="sm"
                className="text-[10px] px-2 py-0.5 font-semibold cursor-help hover:bg-muted/80 transition-colors w-fit"
              >
                +{remainingCount} {remainingCount === 1 ? "asignación" : "asignaciones"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent variant="info" side="top" className="max-w-xs p-2.5 flex flex-col items-start gap-1.5">
              <p className="font-semibold text-[11px] text-white">Asignaciones adicionales:</p>
              <div className="space-y-1.5 w-full">
                {allAsignaciones.slice(1).map((asig, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 text-[11px] leading-tight text-white pb-1.5 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Building2 className="size-3 text-white/80 shrink-0" />
                      <span>{asig.sedeNombre || primarySede}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 pl-4">
                      <span className="inline-flex items-center gap-1">
                        <LayoutGrid className="size-2.5 text-white/70 shrink-0" />
                        {asig.aplicacionNombre}
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="inline-flex items-center gap-1 text-white/80">
                        <ShieldCheck className="size-2.5 text-white/70 shrink-0" />
                        {asig.rolNombre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export function UsuariosTable({
  usuarios,
  onViewDetail,
  onEdit,
  onManageAccess,
  onChangePassword,
  onToggleStatus,
}: UsuariosTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(6);
  const totalPages = Math.ceil(usuarios.length / itemsPerPage) || 1;

  const paginatedUsuarios = usuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderActions = (usr: UsuarioItem) => (
    <div className="inline-flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetail(usr)}
            aria-label="Ver detalle"
            className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Eye className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top">Ver detalle</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(usr)}
            aria-label="Editar usuario"
            className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Edit className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top">Editar usuario</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onManageAccess(usr)}
            aria-label="Gestionar accesos"
            className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ShieldCheck className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top">Gestionar accesos</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangePassword(usr)}
            aria-label="Cambiar clave"
            className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Key className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="info" side="top">Cambiar clave</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStatus(usr)}
            aria-label={usr.estado === "Activo" ? "Desactivar usuario" : "Activar usuario"}
            className={cn(
              "size-8",
              usr.estado === "Activo"
                ? "text-muted-foreground hover:text-warning hover:bg-warning/10"
                : "text-muted-foreground hover:text-success hover:bg-success/10"
            )}
          >
            {usr.estado === "Activo" ? (
              <PowerOff className="size-4" />
            ) : (
              <Power className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          variant={usr.estado === "Activo" ? "warning" : "success"}
          side="top"
        >
          {usr.estado === "Activo" ? "Desactivar usuario" : "Activar usuario"}
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div id="usuarios-table-container" className="flex flex-col gap-4">
        <div className="hidden lg:block overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%] min-w-[180px] dark:text-white pl-6">Usuario</TableHead>
                <TableHead className="w-[15%] min-w-[130px] dark:text-white">Documento</TableHead>
                <TableHead className="w-[22%] min-w-[200px] dark:text-white">Correo</TableHead>
                <TableHead className="w-[18%] min-w-[160px] dark:text-white">Accesos</TableHead>
                <TableHead className="w-[10%] min-w-[100px] text-center dark:text-white">Estado</TableHead>
                <TableHead className="w-[10%] min-w-[130px] dark:text-white">Fecha de creación</TableHead>
                <TableHead className="w-[5%] min-w-[90px] text-right dark:text-white pr-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsuarios.map((usr) => {
                  return (
                    <TableRow key={usr.id}>
                      {/* 1. Usuario */}
                      <TableCell className="pl-6">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-semibold text-sm text-foreground truncate block w-full cursor-default">
                              {usr.nombre} {usr.apellidos}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent variant="info" side="top">
                            <p>{usr.nombre} {usr.apellidos}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* 2. Documento (Tipo + Número) */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {usr.documentoIdentificacion || usr.identificacion || "—"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {usr.tipoDocumento || "Cédula"}
                          </span>
                        </div>
                      </TableCell>

                      {/* 4. Correo */}
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-foreground truncate block w-full cursor-default">
                              {usr.email || usr.correo || "—"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent variant="info" side="top">
                            <p>{usr.email || usr.correo || "—"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* 5. Accesos (Sede · Aplicación · Rol) */}
                      <TableCell>
                        <AccesosCell usr={usr} />
                      </TableCell>

                      {/* 6. Estado */}
                      <TableCell className="text-center">
                        <Badge
                          tone={
                            usr.estado === "Activo"
                              ? "success"
                              : usr.estado === "Inactivo"
                                ? "neutral"
                                : "warning"
                          }
                          appearance="soft"
                          className={cn(
                            "font-semibold border text-xs",
                            usr.estado === "Activo" && "bg-success/15 text-success-800 dark:text-success-300 border-success/30",
                            usr.estado === "Inactivo" && "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700",
                            usr.estado === "Pendiente" && "bg-warning/15 text-warning-800 dark:text-warning-300 border-warning/30"
                          )}
                        >
                          {usr.estado}
                        </Badge>
                      </TableCell>

                      {/* 7. Fecha de creación */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {usr.fechaCreacion}
                        </span>
                      </TableCell>

                      {/* 8. Acciones visibles */}
                      <TableCell className="text-right pr-6 whitespace-nowrap">
                        {renderActions(usr)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card Row (Responsive) */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {paginatedUsuarios.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-border rounded-xl bg-surface">
              No se encontraron usuarios.
            </div>
          ) : (
            paginatedUsuarios.map((usr) => (
              <InteractiveCard
                key={usr.id}
                className="flex flex-col gap-3 text-left"
                color="default"
                hideChevron
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">{usr.nombre} {usr.apellidos}</span>
                    <span className="text-xs text-muted-foreground">{usr.email || usr.correo || "-"}</span>
                  </div>
                  <Badge
                    appearance="soft"
                    tone={usr.estado === "Activo" ? "success" : "neutral"}
                    className="shrink-0"
                  >
                    {usr.estado}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-semibold">Documento</span>
                    <span className="text-foreground">{usr.documentoIdentificacion || usr.identificacion || "-"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground font-semibold">Registro</span>
                    <span className="text-foreground">{usr.fechaCreacion}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-semibold">Sedes y Accesos</span>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <AccesosCell usr={usr} />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-end">
                  {renderActions(usr)}
                </div>
              </InteractiveCard>
            ))
          )}
        </div>

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Mostrando {usuarios.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, usuarios.length)} de {usuarios.length}
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
