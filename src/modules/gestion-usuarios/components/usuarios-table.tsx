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
import { MoreHorizontal, Eye, Edit, ShieldCheck, Key, Power, PowerOff, ChevronDown, MapPin } from "lucide-react";
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
  onManageAccess,
}: {
  usr: UsuarioItem;
  onManageAccess: () => void;
}) {
  const allAsignaciones = React.useMemo(() => {
    return usr.sedes.flatMap((s) => s.asignaciones);
  }, [usr.sedes]);

  if (usr.sedes.length === 0 || allAsignaciones.length === 0) {
    return (
      <div className="flex flex-col gap-0.5 py-1">
        <span className="text-xs text-muted-foreground italic">Sin accesos</span>
        <button
          type="button"
          onClick={onManageAccess}
          className="text-xs text-primary font-medium hover:underline text-left inline-flex items-center cursor-pointer focus:outline-none"
        >
          Asignar accesos
        </button>
      </div>
    );
  }

  const primaryAsig = allAsignaciones[0];
  const primarySede = primaryAsig.sedeNombre || usr.sedes[0]?.sedeNombre;
  const primaryApp = primaryAsig.aplicacionNombre;
  const primaryRol = primaryAsig.rolNombre;
  const remainingCount = allAsignaciones.length - 1;

  return (
    <div className="flex flex-col gap-0.5 py-1 min-w-[200px]">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <MapPin className="size-3.5 text-primary shrink-0" />
        <span className="truncate max-w-[190px]" title={primarySede}>
          {primarySede}
        </span>
      </div>
      <div className="text-xs text-muted-foreground pl-5 truncate max-w-[220px]" title={`${primaryApp} · ${primaryRol}`}>
        <span className="text-foreground/90 font-medium">{primaryApp}</span>
        <span className="mx-1 text-muted-foreground/60">&middot;</span>
        <span>{primaryRol}</span>
      </div>
      {remainingCount > 0 && (
        <div className="text-[11px] text-muted-foreground pl-5 font-medium">
          +{remainingCount} {remainingCount === 1 ? "asignación" : "asignaciones"}
        </div>
      )}
      <button
        type="button"
        onClick={onManageAccess}
        className="text-xs text-primary font-medium hover:underline text-left pl-5 mt-0.5 inline-flex items-center cursor-pointer focus:outline-none"
      >
        Gestionar accesos
      </button>
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
  const [itemsPerPage, setItemsPerPage] = React.useState(8);
  const totalPages = Math.ceil(usuarios.length / itemsPerPage) || 1;

  const paginatedUsuarios = usuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] dark:text-white pl-6">Usuario</TableHead>
            <TableHead className="dark:text-white">Tipo de documento</TableHead>
            <TableHead className="dark:text-white">N.º de documento</TableHead>
            <TableHead className="dark:text-white">Correo</TableHead>
            <TableHead className="dark:text-white">Accesos</TableHead>
            <TableHead className="dark:text-white">Estado</TableHead>
            <TableHead className="dark:text-white">Fecha de creación</TableHead>
            <TableHead className="text-right dark:text-white pr-6">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron usuarios.
              </TableCell>
            </TableRow>
          ) : (
            paginatedUsuarios.map((usr) => {
              return (
                <TableRow key={usr.id}>
                  {/* 1. Usuario */}
                  <TableCell className="pl-6">
                    <span className="font-semibold text-sm text-foreground whitespace-nowrap">
                      {usr.nombre} {usr.apellidos}
                    </span>
                  </TableCell>

                  {/* 2. Tipo de documento */}
                  <TableCell>
                    <span className="text-sm text-foreground">{usr.tipoDocumento || "Cédula"}</span>
                  </TableCell>

                  {/* 3. N.º de documento */}
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">
                      {usr.documentoIdentificacion || usr.identificacion || "—"}
                    </span>
                  </TableCell>

                  {/* 4. Correo */}
                  <TableCell>
                    <span className="text-sm text-foreground">
                      {usr.email || usr.correo || "—"}
                    </span>
                  </TableCell>

                  {/* 5. Accesos (Sede · Aplicación · Rol) */}
                  <TableCell>
                    <AccesosCell usr={usr} onManageAccess={() => onManageAccess(usr)} />
                  </TableCell>

                  {/* 6. Estado */}
                  <TableCell>
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

                  {/* 8. Acciones: DropdownMenu */}
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Abrir menú de acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => onViewDetail(usr)} className="gap-2.5 cursor-pointer">
                          <Eye className="size-4 text-muted-foreground" />
                          <span>Ver detalle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(usr)} className="gap-2.5 cursor-pointer">
                          <Edit className="size-4 text-muted-foreground" />
                          <span>Editar usuario</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onManageAccess(usr)} className="gap-2.5 cursor-pointer">
                          <ShieldCheck className="size-4 text-muted-foreground" />
                          <span>Gestionar accesos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChangePassword(usr)} className="gap-2.5 cursor-pointer">
                          <Key className="size-4 text-muted-foreground" />
                          <span>Cambiar / restablecer clave</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(usr)}
                          className={cn(
                            "gap-2.5 cursor-pointer",
                            usr.estado === "Activo"
                              ? "text-danger focus:text-danger"
                              : "text-success focus:text-success"
                          )}
                        >
                          {usr.estado === "Activo" ? (
                            <PowerOff className="size-4" />
                          ) : (
                            <Power className="size-4" />
                          )}
                          <span>{usr.estado === "Activo" ? "Inactivar" : "Activar"}</span>
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
                {[4, 8, 12, 16].map((size) => (
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
  );
}
