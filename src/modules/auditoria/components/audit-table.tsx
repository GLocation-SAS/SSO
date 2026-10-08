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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import { AuditEmptyState } from "./empty-state";
import { LogGestionItem } from "../data/logs.mock";
import { AccesoAplicacionItem } from "../data/accesos.mock";
import { UsuarioActividadItem } from "../data/actividad.mock";
import { Eye, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// 1. LOGS DE GESTIÓN TABLE
// ─────────────────────────────────────────────────────────────────────────────
interface LogsTableProps {
  logs: LogGestionItem[];
  selectedId?: string | null;
  onSelectRow?: (log: LogGestionItem) => void;
  onViewDetail: (log: LogGestionItem) => void;
  onResetFilters?: () => void;
}

export function LogsTable({
  logs,
  selectedId,
  onSelectRow,
  onViewDetail,
  onResetFilters,
}: LogsTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(7);

  const totalPages = Math.ceil(logs.length / itemsPerPage) || 1;
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return logs.slice(start, start + itemsPerPage);
  }, [logs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [logs.length]);

  if (logs.length === 0) {
    return <AuditEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div id="logs-table-container" className="flex flex-col gap-4 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white pl-4">
                Fecha y Hora
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Responsable
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Acción
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Elemento
              </TableHead>
              <TableHead className="min-w-[180px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Detalle Breve
              </TableHead>
              <TableHead className="w-[110px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Estado
              </TableHead>
              <TableHead className="w-[90px] text-right text-[11px] font-bold uppercase tracking-wider text-white dark:text-white pr-4">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log) => {
              const isSelected = selectedId === log.id;
              return (
                <TableRow
                  key={log.id}
                  data-state={isSelected ? "selected" : undefined}
                  onClick={() => onSelectRow?.(log)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectRow?.(log);
                    }
                  }}
                  className={cn(
                    "cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    isSelected && "border-l-4 border-l-primary dark:border-l-primary-400 bg-primary/15 dark:bg-primary-900/40"
                  )}
                >
                  {/* Fecha y Hora */}
                  <TableCell className="text-xs font-mono pl-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground dark:text-neutral-100">
                        {log.fechaRelativa}
                      </span>
                      <span className="text-[10px] text-muted-foreground dark:text-neutral-400">
                        {log.fecha.split(" ")[0]}
                      </span>
                    </div>
                  </TableCell>

                  {/* Responsable */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground dark:text-neutral-100 line-clamp-1">
                        {log.responsable.nombre}
                      </span>
                      <span className="text-[11px] text-muted-foreground dark:text-neutral-300 line-clamp-1">
                        {log.responsable.cargo}
                      </span>
                    </div>
                  </TableCell>

                  {/* Acción */}
                  <TableCell className="text-xs">
                    <StatusBadge status={log.accion} />
                  </TableCell>

                  {/* Elemento */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground dark:text-neutral-100 line-clamp-1">
                        {log.elementoNombre}
                      </span>
                      <span className="text-[10px] text-muted-foreground dark:text-neutral-300">
                        {log.tipoElemento} &bull; {log.aplicacion}
                      </span>
                    </div>
                  </TableCell>

                  {/* Detalle breve */}
                  <TableCell className="text-xs text-muted-foreground dark:text-neutral-300">
                    <p className="line-clamp-2 leading-relaxed">{log.detalleBreve}</p>
                  </TableCell>

                  {/* Estado */}
                  <TableCell className="text-xs">
                    <StatusBadge status={log.estado} />
                  </TableCell>

                  {/* Acción "Ver detalle" */}
                  <TableCell className="text-right text-xs pr-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(log);
                          }}
                          aria-label="Ver detalle de auditoría"
                          className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" variant="info">
                        <p>Ver detalle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={logs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </TooltipProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INGRESOS A APLICACIONES TABLE
// ─────────────────────────────────────────────────────────────────────────────
interface AccesosTableProps {
  accesos: AccesoAplicacionItem[];
  selectedId?: string | null;
  onSelectRow?: (acceso: AccesoAplicacionItem) => void;
  onViewDetail: (acceso: AccesoAplicacionItem) => void;
  onResetFilters?: () => void;
}

export function AccesosTable({
  accesos,
  selectedId,
  onSelectRow,
  onViewDetail,
  onResetFilters,
}: AccesosTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(7);

  const totalPages = Math.ceil(accesos.length / itemsPerPage) || 1;
  const paginatedAccesos = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return accesos.slice(start, start + itemsPerPage);
  }, [accesos, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [accesos.length]);

  if (accesos.length === 0) {
    return <AuditEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div id="accesos-table-container" className="flex flex-col gap-4 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white pl-4">
                Fecha y Hora
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Usuario
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Aplicación
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Rol
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Sede
              </TableHead>
              <TableHead className="w-[110px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Resultado
              </TableHead>
              <TableHead className="w-[90px] text-right text-[11px] font-bold uppercase tracking-wider text-white dark:text-white pr-4">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccesos.map((acc) => {
              const isSelected = selectedId === acc.id;
              return (
                <TableRow
                  key={acc.id}
                  data-state={isSelected ? "selected" : undefined}
                  onClick={() => onSelectRow?.(acc)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectRow?.(acc);
                    }
                  }}
                  className={cn(
                    "cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    isSelected && "border-l-4 border-l-primary dark:border-l-primary-400 bg-primary/15 dark:bg-primary-900/40"
                  )}
                >
                  {/* Fecha y Hora */}
                  <TableCell className="text-xs font-mono pl-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground dark:text-neutral-100">
                        {acc.fechaRelativa}
                      </span>
                      <span className="text-[10px] text-muted-foreground dark:text-neutral-400">
                        {acc.fecha.split(" ")[0]}
                      </span>
                    </div>
                  </TableCell>

                  {/* Usuario */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground dark:text-neutral-100 line-clamp-1">
                        {acc.usuario.nombre}
                      </span>
                      <span className="text-[11px] text-muted-foreground dark:text-neutral-300 line-clamp-1 font-mono">
                        {acc.usuario.email}
                      </span>
                    </div>
                  </TableCell>

                  {/* Aplicación */}
                  <TableCell className="text-xs">
                    <span className="font-semibold text-foreground dark:text-neutral-100">
                      {acc.aplicacion}
                    </span>
                  </TableCell>

                  {/* Rol */}
                  <TableCell className="text-xs text-muted-foreground dark:text-neutral-300">
                    {acc.rol}
                  </TableCell>

                  {/* Sede */}
                  <TableCell className="text-xs text-muted-foreground dark:text-neutral-300">
                    {acc.sede}
                  </TableCell>

                  {/* Resultado */}
                  <TableCell className="text-xs">
                    <StatusBadge status={acc.resultado} />
                  </TableCell>

                  {/* Ver detalle */}
                  <TableCell className="text-right text-xs pr-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(acc);
                          }}
                          aria-label="Ver detalle de acceso"
                          className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:bg-primary/10 dark:hover:bg-primary-900/40"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" variant="info">
                        <p>Ver detalle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={accesos.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </TooltipProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ACTIVIDAD DE USUARIOS (AGREGADA) TABLE
// ─────────────────────────────────────────────────────────────────────────────
interface ActividadTableProps {
  actividades: UsuarioActividadItem[];
  selectedUserId?: string | null;
  onSelectUser: (user: UsuarioActividadItem | null) => void;
  onResetFilters?: () => void;
}

export function ActividadTable({
  actividades,
  selectedUserId,
  onSelectUser,
  onResetFilters,
}: ActividadTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(7);

  const totalPages = Math.ceil(actividades.length / itemsPerPage) || 1;
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return actividades.slice(start, start + itemsPerPage);
  }, [actividades, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [actividades.length]);

  if (actividades.length === 0) {
    return <AuditEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div id="actividad-table-container" className="flex flex-col gap-4 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white pl-4">
                Usuario
              </TableHead>
              <TableHead className="min-w-[160px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Aplicaciones Utilizadas
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Rol
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Sede
              </TableHead>
              <TableHead className="w-[120px] text-center text-[11px] font-bold uppercase tracking-wider text-white dark:text-white">
                Cant. Accesos
              </TableHead>
              <TableHead className="w-[130px] text-[11px] font-bold uppercase tracking-wider text-white dark:text-white pr-4">
                Última Actividad
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((act) => {
              const isSelected = selectedUserId === act.usuario.id;
              return (
                <TableRow
                  key={act.id}
                  data-state={isSelected ? "selected" : undefined}
                  onClick={() => onSelectUser(isSelected ? null : act)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectUser(isSelected ? null : act);
                    }
                  }}
                  className={cn(
                    "cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    isSelected && "border-l-4 border-l-primary dark:border-l-primary-400 bg-primary/15 dark:bg-primary-900/40"
                  )}
                >
                  {/* Usuario */}
                  <TableCell className="text-xs pl-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground dark:bg-primary dark:text-white shadow-xs"
                            : "bg-muted dark:bg-neutral-800 text-muted-foreground dark:text-neutral-300"
                        )}
                      >
                        {isSelected ? (
                          <Check className="size-3.5 stroke-[3]" />
                        ) : (
                          act.usuario.nombre[0]
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground dark:text-neutral-100 line-clamp-1">
                          {act.usuario.nombre}
                        </span>
                        <span className="text-[11px] text-muted-foreground dark:text-neutral-300 font-mono line-clamp-1">
                          {act.usuario.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Aplicaciones utilizadas */}
                  <TableCell className="text-xs">
                    {act.aplicacionesUtilizadas.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {act.aplicacionesUtilizadas.slice(0, 2).map((app) => (
                          <Badge
                            key={app}
                            tone="neutral"
                            appearance="soft"
                            size="sm"
                            className="text-[10px] font-medium"
                          >
                            {app}
                          </Badge>
                        ))}
                        {act.aplicacionesUtilizadas.length > 2 && (
                          <Badge
                            tone="neutral"
                            appearance="outline"
                            size="sm"
                            className="text-[10px] text-muted-foreground dark:text-neutral-300"
                          >
                            +{act.aplicacionesUtilizadas.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground dark:text-neutral-400 italic">
                        Sin aplicaciones
                      </span>
                    )}
                  </TableCell>

                  {/* Rol */}
                  <TableCell className="text-xs text-muted-foreground dark:text-neutral-300">
                    {act.rolPrincipal}
                  </TableCell>

                  {/* Sede */}
                  <TableCell className="text-xs text-muted-foreground dark:text-neutral-300">
                    {act.sede}
                  </TableCell>

                  {/* Cantidad de accesos */}
                  <TableCell className="text-center text-xs">
                    <span
                      className={cn(
                        "inline-block font-mono font-bold px-2.5 py-0.5 rounded-full text-xs",
                        act.totalAccesos > 100
                          ? "bg-primary/15 dark:bg-primary-900/40 text-primary dark:text-primary-300"
                          : act.totalAccesos > 0
                            ? "bg-muted dark:bg-neutral-800 text-foreground dark:text-neutral-200"
                            : "text-muted-foreground dark:text-neutral-400"
                      )}
                    >
                      {act.totalAccesos}
                    </span>
                  </TableCell>

                  {/* Última actividad */}
                  <TableCell className="text-xs whitespace-nowrap pr-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground dark:text-neutral-100">
                        {act.ultimaActividadRelativa}
                      </span>
                      <span className="text-[10px] text-muted-foreground dark:text-neutral-400">
                        {act.ultimaActividad}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Paginación */}
        <TablePaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={actividades.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </TooltipProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE AUXILIAR DE PAGINACIÓN
// ─────────────────────────────────────────────────────────────────────────────
function TablePaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t border-border bg-surface">
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Mostrando {startItem}–{endItem} de {totalItems}
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
              {[5, 7, 10, 20].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => onItemsPerPageChange(size)}
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
                onPageChange(Math.max(1, currentPage - 1));
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
                  onPageChange(i + 1);
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
                onPageChange(Math.min(totalPages, currentPage + 1));
              }}
              className={(currentPage === totalPages || totalPages === 0) ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
