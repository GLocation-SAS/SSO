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
import { MoreHorizontal, Eye, Edit, ShieldCheck, Key, Power, PowerOff, ChevronDown, MapPin, AppWindow, Calendar } from "lucide-react";
import { UsuarioItem } from "../data/usuarios-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface UsuariosTableProps {
  usuarios: UsuarioItem[];
  onViewDetail: (usuario: UsuarioItem) => void;
  onEdit: (usuario: UsuarioItem) => void;
  onManageAccess: (usuario: UsuarioItem) => void;
  onChangePassword: (usuario: UsuarioItem) => void;
  onToggleStatus: (usuario: UsuarioItem) => void;
}

function AsignacionesCell({ usr }: { usr: UsuarioItem }) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const allAsignaciones = React.useMemo(() => {
    return usr.sedes.flatMap((s) =>
      s.asignaciones.map((a) => ({ ...a, sedeNombre: s.sedeNombre }))
    );
  }, [usr.sedes]);

  if (allAsignaciones.length === 0) {
    return <span className="text-xs text-muted-foreground italic">Sin asignaciones</span>;
  }

  const firstAsig = allAsignaciones[0];
  const remaining = allAsignaciones.length - 1;

  return (
    <div className="flex flex-col gap-1 py-1 min-w-[210px]">
      {/* Sede Principal (Nivel 1) */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <MapPin className="size-3.5 text-primary shrink-0" />
        <span className="truncate max-w-[200px]" title={firstAsig.sedeNombre}>
          {firstAsig.sedeNombre}
        </span>
      </div>

      {/* Aplicación · Rol (Nivel 2 y 3) */}
      <div
        className="text-xs text-muted-foreground truncate max-w-[220px] flex items-center gap-1 pl-4"
        title={`${firstAsig.aplicacionNombre} · ${firstAsig.rolNombre}`}
      >
        <span className="font-medium text-foreground/90">{firstAsig.aplicacionNombre}</span>
        <span className="text-muted-foreground/60">·</span>
        <span className="text-muted-foreground">{firstAsig.rolNombre}</span>
      </div>

      {/* Badge +N asignaciones con Popover Jerárquico accesible */}
      {remaining > 0 && (
        <div
          className="mt-1 inline-flex"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <span>+{remaining} asignaci{remaining === 1 ? "ón" : "ones"}</span>
                <ChevronDown className={cn("size-3 transition-transform duration-200", open && "rotate-180")} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={6}
              collisionPadding={16}
              className="w-96 p-0 border border-border bg-popover text-popover-foreground shadow-2xl rounded-xl z-50 overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Encabezado del Popover */}
              <div className="bg-muted/40 px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground leading-none">
                      Jerarquía de Asignaciones
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Sede → Aplicación → Rol institucional
                    </p>
                  </div>
                </div>
                <Badge tone="primary" appearance="soft" size="sm" className="font-semibold text-[10px]">
                  {allAsignaciones.length} en total
                </Badge>
              </div>

              {/* Lista Jerárquica */}
              <div className="p-3 max-h-72 overflow-y-auto space-y-3 divide-y divide-border/40">
                {usr.sedes.map((sede) => (
                  <div key={sede.sedeId || sede.sedeNombre} className="pt-2.5 first:pt-0 space-y-2">
                    {/* Nivel 1: Sede */}
                    <div className="flex items-center justify-between gap-2 bg-muted/50 px-2.5 py-1.5 rounded-md border border-border/60">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span>{sede.sedeNombre}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {sede.asignaciones.length} rol{sede.asignaciones.length === 1 ? "" : "es"}
                      </span>
                    </div>

                    {/* Nivel 2 y 3: Aplicaciones y Roles dentro de la Sede */}
                    <div className="ml-2 pl-3 border-l-2 border-primary/25 space-y-2">
                      {sede.asignaciones.map((asig) => (
                        <div
                          key={asig.id}
                          className="bg-card/70 hover:bg-card p-2 rounded-md border border-border/60 space-y-1.5 transition-colors"
                        >
                          {/* Nivel 2: Aplicación */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                              <AppWindow className="size-3.5 text-primary/80 shrink-0" />
                              <span>{asig.aplicacionNombre}</span>
                            </div>
                            <Badge
                              tone={asig.estado === "Activo" ? "success" : "neutral"}
                              appearance="soft"
                              size="sm"
                              className={cn(
                                "text-[9px] px-1.5 py-0 h-4 font-semibold border",
                                asig.estado === "Activo"
                                  ? "bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                                  : "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                              )}
                            >
                              {asig.estado}
                            </Badge>
                          </div>

                          {/* Nivel 3: Rol Institucional */}
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pl-5">
                            <ShieldCheck className="size-3 text-muted-foreground/70 shrink-0" />
                            <span className="text-foreground/90 font-medium">{asig.rolNombre}</span>
                          </div>

                          {/* Nivel 4: Fecha de Asignación */}
                          {asig.fechaAsignacion && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground pl-5">
                              <Calendar className="size-2.5 shrink-0" />
                              <span>Asignado el {asig.fechaAsignacion}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie informativo */}
              <div className="bg-muted/30 px-3.5 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Relación contextual SGD / SSO</span>
                <span className="font-medium text-foreground/80">{usr.nombre} {usr.apellidos}</span>
              </div>
            </PopoverContent>
          </Popover>
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
            <TableHead className="dark:text-white">Correo institucional</TableHead>
            <TableHead className="dark:text-white">Asignaciones</TableHead>
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

                  {/* 4. Correo institucional */}
                  <TableCell>
                    <span className="text-sm text-foreground">
                      {usr.email || usr.correo || "—"}
                    </span>
                  </TableCell>

                  {/* 5. Asignaciones (Sede -> Aplicación -> Rol) */}
                  <TableCell>
                    <AsignacionesCell usr={usr} />
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
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => onViewDetail(usr)} className="gap-2.5 cursor-pointer">
                          <Eye className="size-4 text-muted-foreground" />
                          <span>Ver detalle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(usr)} className="gap-2.5 cursor-pointer">
                          <Edit className="size-4 text-muted-foreground" />
                          <span>Editar datos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onManageAccess(usr)} className="gap-2.5 cursor-pointer">
                          <ShieldCheck className="size-4 text-muted-foreground" />
                          <span>Gestionar accesos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChangePassword(usr)} className="gap-2.5 cursor-pointer">
                          <Key className="size-4 text-muted-foreground" />
                          <span>Cambiar/restablecer clave</span>
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
