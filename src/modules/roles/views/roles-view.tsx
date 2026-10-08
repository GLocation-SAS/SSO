"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Download,
  ChevronDown,
  FileSpreadsheet,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import {
  RolItem,
  mockRolesData,
  mockAplicacionesParaRoles,
} from "../data/roles-data";
import {
  RolesSummaryCards,
  RoleSummaryFilterType,
} from "../components/roles-summary-cards";
import { RolesFilterBar } from "../components/roles-filter-bar";
import { RolesTable } from "../components/roles-table";
import { RolModalForm } from "../components/rol-modal-form";
import { RolModalDetail } from "../components/rol-modal-detail";

export function RolesView() {
  const [roles, setRoles] = React.useState<RolItem[]>(mockRolesData);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");
  const [filterSinRecursos, setFilterSinRecursos] = React.useState(false);

  // Modales
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [rolToEdit, setRolToEdit] = React.useState<RolItem | null>(null);
  const [detailRol, setDetailRol] = React.useState<RolItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Confirmación de Inactivación / Activación
  const [rolToToggle, setRolToToggle] = React.useState<RolItem | null>(null);
  const [isConfirmToggleOpen, setIsConfirmToggleOpen] = React.useState(false);

  // Métricas para summary cards
  const totalCount = roles.length;
  const activosCount = React.useMemo(
    () => roles.filter((r) => r.estado === "Activo").length,
    [roles]
  );
  const inactivosCount = React.useMemo(
    () => roles.filter((r) => r.estado === "Inactivo").length,
    [roles]
  );
  const sinRecursosCount = React.useMemo(
    () => roles.filter((r) => r.recursosAsignados.length === 0).length,
    [roles]
  );

  // Filtro activo reflejado en Cards
  const activeSummaryFilter = React.useMemo<RoleSummaryFilterType | null>(() => {
    if (filterSinRecursos) return "sin-recursos";
    if (selectedEstado === "Activo") return "activos";
    if (selectedEstado === "Inactivo") return "inactivos";
    if (selectedEstado === "Todos" && !filterSinRecursos) return "total";
    return null;
  }, [filterSinRecursos, selectedEstado]);

  const handleSelectSummaryFilter = (filter: RoleSummaryFilterType) => {
    if (filter === "total") {
      setSelectedEstado("Todos");
      setFilterSinRecursos(false);
    } else if (filter === "activos") {
      if (activeSummaryFilter === "activos") {
        setSelectedEstado("Todos");
        setFilterSinRecursos(false);
      } else {
        setSelectedEstado("Activo");
        setFilterSinRecursos(false);
      }
    } else if (filter === "inactivos") {
      if (activeSummaryFilter === "inactivos") {
        setSelectedEstado("Todos");
        setFilterSinRecursos(false);
      } else {
        setSelectedEstado("Inactivo");
        setFilterSinRecursos(false);
      }
    } else if (filter === "sin-recursos") {
      if (activeSummaryFilter === "sin-recursos") {
        setFilterSinRecursos(false);
      } else {
        setFilterSinRecursos(true);
        setSelectedEstado("Todos");
      }
    }
  };

  // Filtrado de lista
  const filteredRoles = React.useMemo(() => {
    return roles.filter((rol) => {
      const matchSearch =
        searchTerm === "" ||
        rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.aplicacionNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.aplicacionCodigo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchApp =
        selectedApp === "Todas" || rol.aplicacionId === selectedApp;

      const matchEstado =
        selectedEstado === "Todos" || rol.estado === selectedEstado;

      const matchSinRecursos =
        !filterSinRecursos || rol.recursosAsignados.length === 0;

      return matchSearch && matchApp && matchEstado && matchSinRecursos;
    });
  }, [roles, searchTerm, selectedApp, selectedEstado, filterSinRecursos]);

  // Handlers CRUD
  const handleOpenDetail = (rol: RolItem) => {
    setDetailRol(rol);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setRolToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rol: RolItem) => {
    setRolToEdit(rol);
    setIsFormOpen(true);
  };

  const handleSaveRol = (savedRol: RolItem) => {
    const isNew = !roles.some((r) => r.id === savedRol.id);
    if (isNew) {
      setRoles((prev) => [savedRol, ...prev]);
      toast.success(`Rol "${savedRol.nombre}" creado exitosamente.`);
    } else {
      setRoles((prev) =>
        prev.map((r) => (r.id === savedRol.id ? savedRol : r))
      );
      if (detailRol?.id === savedRol.id) {
        setDetailRol(savedRol);
      }
      toast.success(`Rol "${savedRol.nombre}" actualizado.`);
    }
  };

  const handleRequestToggleStatus = (rol: RolItem) => {
    setRolToToggle(rol);
    setIsConfirmToggleOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    if (!rolToToggle) return;
    const isCurrentlyActive = rolToToggle.estado === "Activo";
    const newStatus: "Activo" | "Inactivo" = isCurrentlyActive ? "Inactivo" : "Activo";

    setRoles((prev) =>
      prev.map((r) =>
        r.id === rolToToggle.id ? { ...r, estado: newStatus } : r
      )
    );

    if (isCurrentlyActive) {
      toast.warning(`El rol "${rolToToggle.nombre}" ha sido inactivado.`);
    } else {
      toast.success(`El rol "${rolToToggle.nombre}" ha sido activado.`);
    }

    setIsConfirmToggleOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedApp("Todas");
    setSelectedEstado("Todos");
    setFilterSinRecursos(false);
  };

  // Exportar en CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nombre",
      "Aplicacion_Codigo",
      "Aplicacion_Nombre",
      "Estado",
      "Usuarios_Asignados",
      "Recursos_Asociados",
      "Ultima_Actualizacion",
    ];
    const rows = filteredRoles.map((r) => [
      r.id,
      `"${r.nombre}"`,
      r.aplicacionCodigo,
      `"${r.aplicacionNombre}"`,
      r.estado,
      r.usuariosCount,
      r.recursosAsignados.length,
      `"${r.ultimaActualizacion}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roles_mineduc_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Listado de roles exportado en formato CSV.");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Contenedor Principal de Gestión de Roles */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                  Gestión de roles
                </h1>
                <Badge tone="warning" appearance="soft" size="sm">
                  Mockup en desarrollo
                </Badge>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Administra los roles de las aplicaciones y configura sus recursos y permisos.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              {/* Menú de Exportación */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 sm:flex-none text-xs"
                  >
                    <Download className="size-4" />
                    Exportar
                    <ChevronDown className="size-3.5 opacity-60 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 space-y-1">
                  <DropdownMenuItem
                    onClick={handleExportCSV}
                    className="cursor-pointer flex items-center gap-2 text-xs"
                  >
                    <FileSpreadsheet className="size-4 text-success" />
                    <span>Exportar en CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Botón Principal Crear Rol */}
              <Button
                variant="primary"
                onClick={handleOpenCreate}
                className="gap-1.5 flex-1 sm:flex-none text-xs"
              >
                <Plus className="size-4" />
                <span>Crear rol</span>
              </Button>
            </div>
          </div>

          {/* Cards Resumen Interactivas */}
          <RolesSummaryCards
            total={totalCount}
            activos={activosCount}
            inactivos={inactivosCount}
            sinRecursos={sinRecursosCount}
            activeFilter={activeSummaryFilter}
            onSelectFilter={handleSelectSummaryFilter}
          />

          {/* Barra de Filtros */}
          <RolesFilterBar
            aplicaciones={mockAplicacionesParaRoles}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedApp={selectedApp}
            onAppChange={setSelectedApp}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
            filterSinRecursos={filterSinRecursos}
            onFilterSinRecursosChange={setFilterSinRecursos}
          />

          {/* Tabla de Roles (con acciones visibles) */}
          <RolesTable
            roles={filteredRoles}
            onViewDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onToggleStatus={handleRequestToggleStatus}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Modal Formulario (Crear / Editar) - Dialog XL */}
      <RolModalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        rolToEdit={rolToEdit}
        existingRoles={roles}
        onSave={handleSaveRol}
      />

      {/* Modal Detalle (Consulta) - Dialog XL */}
      <RolModalDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        rol={detailRol}
        onEdit={handleOpenEdit}
      />

      {/* ConfirmDialog para Desactivar / Activar Rol */}
      <ConfirmDialog
        open={isConfirmToggleOpen}
        onOpenChange={setIsConfirmToggleOpen}
        title={
          rolToToggle?.estado === "Activo"
            ? `¿Desactivar el rol "${rolToToggle?.nombre}"?`
            : `¿Activar el rol "${rolToToggle?.nombre}"?`
        }
        description={
          rolToToggle?.estado === "Activo" ? (
            <div className="space-y-2 text-xs">
              <p>
                Al desactivar este rol en{" "}
                <strong>{rolToToggle?.aplicacionNombre}</strong>, quedará
                suspendido y no podrá ser asignado a nuevos usuarios.
              </p>
              {rolToToggle?.usuariosCount && rolToToggle.usuariosCount > 0 ? (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/15 border border-warning/30 text-warning-800 dark:text-warning-300">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong>Atención:</strong> Este rol cuenta actualmente con{" "}
                    <strong>{rolToToggle.usuariosCount} usuarios asignados</strong>.
                    Al desactivarlo, dichos usuarios podrían ver restringido su acceso
                    a las funcionalidades y recursos del sistema.
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            `El rol "${rolToToggle?.nombre}" volverá a estar disponible para asignación y sus permisos serán reactivados.`
          )
        }
        confirmText={
          rolToToggle?.estado === "Activo" ? "Desactivar rol" : "Activar rol"
        }
        cancelText="Cancelar"
        variant={rolToToggle?.estado === "Activo" ? "warning" : "primary"}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}
