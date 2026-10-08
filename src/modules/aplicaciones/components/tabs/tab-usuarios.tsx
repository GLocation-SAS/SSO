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
import { Search } from "@/components/ui/search";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Building2,
  ShieldCheck,
  MoreVertical,
  UserCheck,
  UserX,
  ExternalLink,
  Users,
  Eye,
} from "lucide-react";
import {
  AplicacionItem,
  AplicacionUsuarioAccess,
  mockUsuariosAccesoPorApp,
  SEDES_CATALOGO_APPS,
} from "../../data/aplicaciones-data";
import { Link } from "@/routing";
import { toast } from "sonner";

interface TabUsuariosProps {
  aplicacion: AplicacionItem;
}

export function TabUsuarios({ aplicacion }: TabUsuariosProps) {
  const initialUsers = mockUsuariosAccesoPorApp[aplicacion.id] || [];
  const [usuarios, setUsuarios] = React.useState<AplicacionUsuarioAccess[]>(initialUsers);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRol, setSelectedRol] = React.useState("Todos");
  const [selectedSede, setSelectedSede] = React.useState("Todas");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");

  // Diálogo para revocar/cambiar estado
  const [selectedUserToToggle, setSelectedUserToToggle] =
    React.useState<AplicacionUsuarioAccess | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  // Lista única de roles disponibles en esta app
  const availableRoles = React.useMemo(() => {
    return Array.from(new Set(usuarios.map((u) => u.rol)));
  }, [usuarios]);

  // Filtrado
  const filteredUsuarios = React.useMemo(() => {
    return usuarios.filter((usr) => {
      const matchSearch =
        searchTerm === "" ||
        usr.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usr.usuarioEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usr.cedula.includes(searchTerm);

      const matchRol = selectedRol === "Todos" || usr.rol === selectedRol;
      const matchSede = selectedSede === "Todas" || usr.sede === selectedSede;
      const matchEstado =
        selectedEstado === "Todos" || usr.estado === selectedEstado;

      return matchSearch && matchRol && matchSede && matchEstado;
    });
  }, [usuarios, searchTerm, selectedRol, selectedSede, selectedEstado]);

  const handleToggleUserStatus = () => {
    if (!selectedUserToToggle) return;
    const newStatus =
      selectedUserToToggle.estado === "Activo" ? "Inactivo" : "Activo";
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === selectedUserToToggle.id ? { ...u, estado: newStatus } : u
      )
    );
    toast.success(
      `Acceso de "${selectedUserToToggle.usuarioNombre}" actualizado a ${newStatus}.`
    );
    setIsConfirmOpen(false);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col gap-6">
        {/* Banner de Contexto Arquitectónico */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Relación de acceso institucional
              </h3>
              <p className="text-xs text-muted-foreground">
                Cada usuario accede a <strong>{aplicacion.nombre}</strong>{" "}
                mediante una <strong>Sede autorizada</strong> con un{" "}
                <strong>Rol asignado</strong>.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs shrink-0">
            <Link href="/gestion-usuarios/usuarios" className="gap-1.5">
              <span>Gestionar en Usuarios</span>
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-end gap-3.5 w-full">
          {/* Buscador */}
          <div className="flex-1 min-w-[260px] max-w-[380px]">
            <Search
              placeholder="Buscar por nombre, correo o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              size="sm"
              className="w-full text-xs"
            />
          </div>

          {/* Filtro Rol */}
          <div className="w-[180px] shrink-0 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Rol
            </label>
            <Combobox
              value={selectedRol}
              onValueChange={(val) => {
                if (val) setSelectedRol(val);
              }}
            >
              <ComboboxInput
                placeholder="Todos los roles"
                showClear={false}
                size="sm"
                className="w-full text-xs"
              />
              <ComboboxContent className="min-w-full">
                <ComboboxList>
                  <ComboboxItem value="Todos">Todos los roles</ComboboxItem>
                  {availableRoles.map((r) => (
                    <ComboboxItem key={r} value={r}>
                      {r}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Filtro Sede */}
          <div className="w-[200px] shrink-0 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Sede
            </label>
            <Combobox
              value={selectedSede}
              onValueChange={(val) => {
                if (val) setSelectedSede(val);
              }}
            >
              <ComboboxInput
                placeholder="Todas las sedes"
                showClear={false}
                size="sm"
                className="w-full text-xs"
              />
              <ComboboxContent className="min-w-full">
                <ComboboxList>
                  <ComboboxItem value="Todas">Todas las sedes</ComboboxItem>
                  {SEDES_CATALOGO_APPS.map((s) => (
                    <ComboboxItem key={s} value={s}>
                      {s}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Filtro Estado */}
          <div className="w-[150px] shrink-0 flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Estado
            </label>
            <Combobox
              value={selectedEstado}
              onValueChange={(val) => {
                if (val) setSelectedEstado(val);
              }}
            >
              <ComboboxInput
                placeholder="Todos"
                showClear={false}
                size="sm"
                className="w-full text-xs"
              />
              <ComboboxContent className="min-w-full">
                <ComboboxList>
                  <ComboboxItem value="Todos">Todos</ComboboxItem>
                  <ComboboxItem value="Activo">Activo</ComboboxItem>
                  <ComboboxItem value="Inactivo">Inactivo</ComboboxItem>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Reset button if active */}
          {(searchTerm !== "" ||
            selectedRol !== "Todos" ||
            selectedSede !== "Todas" ||
            selectedEstado !== "Todos") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRol("Todos");
                  setSelectedSede("Todas");
                  setSelectedEstado("Todos");
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar
              </Button>
            )}
        </div>

        {/* Tabla de Usuarios */}
        <div id="aplicacion-usuarios-table-container" className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[260px] pl-6 dark:text-white">
                  Usuario
                </TableHead>
                <TableHead className="w-[220px] dark:text-white">
                  Sede
                </TableHead>
                <TableHead className="w-[200px] dark:text-white">
                  Rol asignado
                </TableHead>
                <TableHead className="w-[110px] text-center dark:text-white">
                  Estado
                </TableHead>
                <TableHead className="w-[140px] dark:text-white">
                  Último acceso
                </TableHead>
                <TableHead className="w-[100px] text-right dark:text-white pr-6">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground dark:text-neutral-300">
                    No se encontraron usuarios asignados a esta aplicación con los filtros actuales.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsuarios.map((usr) => (
                  <TableRow key={usr.id}>
                    {/* 1. Usuario */}
                    <TableCell className="pl-6">
                      <div className="flex flex-col min-w-0 py-1">
                        <span className="font-semibold text-sm text-foreground dark:text-neutral-100 truncate">
                          {usr.usuarioNombre}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-neutral-300">
                          <span className="truncate">{usr.usuarioEmail}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-muted-foreground dark:text-neutral-400">
                            {usr.cedula}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Sede */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <Building2 className="size-3.5 text-primary dark:text-primary-300 shrink-0" />
                        <span className="font-medium text-foreground dark:text-neutral-100">
                          {usr.sede}
                        </span>
                      </div>
                    </TableCell>

                    {/* 3. Rol */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <ShieldCheck className="size-3.5 text-secondary-600 dark:text-secondary-300 shrink-0" />
                        <Badge
                          tone="primary"
                          appearance="soft"
                          size="sm"
                          className="font-medium"
                        >
                          {usr.rol}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* 4. Estado */}
                    <TableCell className="text-center">
                      <Badge
                        tone={usr.estado === "Activo" ? "success" : "neutral"}
                        appearance="soft"
                        size="sm"
                      >
                        {usr.estado}
                      </Badge>
                    </TableCell>

                    {/* 5. Último acceso */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground dark:text-neutral-300">
                        {usr.ultimoAcceso}
                      </span>
                    </TableCell>

                    {/* 6. Acciones */}
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground dark:text-neutral-300 hover:text-foreground dark:hover:text-white"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                              href="/gestion-usuarios/usuarios"
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4 text-muted-foreground" />
                              <span>Ver usuario</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserToToggle(usr);
                              setIsConfirmOpen(true);
                            }}
                            className={
                              usr.estado === "Activo"
                                ? "text-warning cursor-pointer flex items-center gap-2"
                                : "text-success cursor-pointer flex items-center gap-2"
                            }
                          >
                            {usr.estado === "Activo" ? (
                              <>
                                <UserX className="size-4" />
                                <span>Inactivar acceso</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-4" />
                                <span>Activar acceso</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Diálogo de Confirmación */}
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title={
            selectedUserToToggle?.estado === "Activo"
              ? "Inactivar acceso de usuario"
              : "Activar acceso de usuario"
          }
          description={`¿Confirmas que deseas ${selectedUserToToggle?.estado === "Activo"
              ? "inactivar"
              : "restablecer"
            } los permisos de "${selectedUserToToggle?.usuarioNombre}" en la sede "${selectedUserToToggle?.sede
            }" para esta aplicación?`}
          confirmText={
            selectedUserToToggle?.estado === "Activo"
              ? "Inactivar acceso"
              : "Activar acceso"
          }
          variant={
            selectedUserToToggle?.estado === "Activo" ? "warning" : "success"
          }
          onConfirm={handleToggleUserStatus}
        />
      </div>
    </TooltipProvider>
  );
}

