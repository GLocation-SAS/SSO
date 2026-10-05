"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, getAvatarInitials } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  MoreVertical,
  Eye,
  Edit,
  Key,
  UserX,
  UserCheck,
  Trash2,
  MapPin,
  Mail,
  Users,
  ChevronDown,
} from "lucide-react";
import { UsuarioItem } from "../data/usuarios-data";

interface UsuariosTableProps {
  usuarios: UsuarioItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetail: (usuario: UsuarioItem) => void;
  onEdit: (usuario: UsuarioItem) => void;
  onChangePassword: (usuario: UsuarioItem) => void;
  onToggleStatus: (usuario: UsuarioItem) => void;
  onDelete: (usuario: UsuarioItem) => void;
}

export function UsuariosTable({
  usuarios,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onEdit,
  onChangePassword,
  onToggleStatus,
  onDelete,
}: UsuariosTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="border border-border shadow-xs rounded-xl overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <Table className="min-w-[980px]">
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="py-3.5 pl-6 font-bold text-xs uppercase tracking-wider text-muted-foreground w-[260px]">
                Usuario
              </TableHead>
              <TableHead className="py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground w-[130px]">
                Identificación
              </TableHead>
              <TableHead className="py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground w-[220px]">
                Correo institucional
              </TableHead>
              <TableHead className="py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground w-[180px]">
                Aplicaciones
              </TableHead>
              <TableHead className="py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Sede
              </TableHead>
              <TableHead className="py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground w-[110px]">
                Estado
              </TableHead>
              <TableHead className="py-3.5 pr-6 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground w-[80px]">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Users className="size-10 stroke-[1.2] opacity-40" />
                    <p className="text-sm font-medium">No se encontraron usuarios con los filtros seleccionados.</p>
                    <p className="text-xs text-muted-foreground/80">
                      Prueba modificando los términos de búsqueda o limpiando los filtros.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => {
                const initials = getAvatarInitials(`${usuario.nombre} ${usuario.apellidos}`);
                const apps = usuario.rolesAplicaciones.map((r) => r.aplicacionNombre);
                const visibleApps = apps.slice(0, 2);
                const extraAppsCount = apps.length - visibleApps.length;

                return (
                  <TableRow
                    key={usuario.id}
                    className="border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    {/* Usuario */}
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" className="shrink-0 border border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewDetail(usuario)}
                            className="font-bold text-xs text-foreground hover:text-primary transition-colors text-left truncate"
                          >
                            {usuario.nombre} {usuario.apellidos}
                          </button>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {usuario.cargo}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Identificación */}
                    <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                      {usuario.identificacion}
                    </TableCell>

                    {/* Correo institucional */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground/85">
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{usuario.correo}</span>
                      </div>
                    </TableCell>

                    {/* Aplicaciones */}
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        {visibleApps.map((app) => (
                          <Badge
                            key={app}
                            tone="neutral"
                            appearance="soft"
                            size="sm"
                            className="text-[10px] bg-muted/60"
                          >
                            {app}
                          </Badge>
                        ))}
                        {extraAppsCount > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  tone="info"
                                  appearance="soft"
                                  size="sm"
                                  className="text-[10px] cursor-help"
                                >
                                  +{extraAppsCount}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="flex flex-col gap-1 text-[11px]">
                                  <span className="font-semibold">Otras aplicaciones:</span>
                                  <span>{apps.slice(2).join(", ")}</span>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>

                    {/* Sede */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground/85">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[200px]" title={usuario.sede}>
                          {usuario.sede}
                        </span>
                      </div>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Badge
                        tone={
                          usuario.estado === "Activo"
                            ? "success"
                            : usuario.estado === "Inactivo"
                              ? "neutral"
                              : "warning"
                        }
                        appearance="soft"
                        size="sm"
                        className="text-[10px] tracking-wide"
                      >
                        {usuario.estado}
                      </Badge>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="size-8 text-muted-foreground hover:text-foreground"
                            aria-label={`Acciones para ${usuario.nombre}`}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="gap-2 text-xs cursor-pointer"
                            onClick={() => onViewDetail(usuario)}
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                            Ver detalle
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="gap-2 text-xs cursor-pointer"
                            onClick={() => onEdit(usuario)}
                          >
                            <Edit className="size-3.5 text-muted-foreground" />
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="gap-2 text-xs cursor-pointer"
                            onClick={() => onChangePassword(usuario)}
                          >
                            <Key className="size-3.5 text-muted-foreground" />
                            Cambiar clave
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="gap-2 text-xs cursor-pointer"
                            onClick={() => onToggleStatus(usuario)}
                          >
                            {usuario.estado === "Activo" ? (
                              <>
                                <UserX className="size-3.5 text-warning" />
                                <span className="text-warning">Inactivar usuario</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-3.5 text-success" />
                                <span className="text-success">Activar usuario</span>
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="gap-2 text-xs cursor-pointer text-danger focus:bg-danger/10 focus:text-danger"
                            onClick={() => onDelete(usuario)}
                          >
                            <Trash2 className="size-3.5" />
                            Eliminar usuario
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Rows Info Footer */}
      <div className="p-4 border-t border-border/60 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Summary and Page Size */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Mostrando <strong>{startItem}</strong> - <strong>{endItem}</strong> de{" "}
            <strong>{totalItems.toLocaleString()}</strong> usuarios
          </span>

          <div className="hidden sm:flex items-center gap-1.5 border-l border-border/60 pl-4">
            <span>Mostrar</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1">
                  <span>{pageSize}</span>
                  <ChevronDown className="size-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[60px]">
                {[8, 12, 20, 50].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => onPageSizeChange(size)}
                    className="text-xs cursor-pointer justify-center"
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span>por pág.</span>
          </div>
        </div>

        {/* Right: Pagination Links */}
        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Simple logic for first, current, last
                if (
                  totalPages > 5 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - currentPage) > 1
                ) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={pageNum === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

