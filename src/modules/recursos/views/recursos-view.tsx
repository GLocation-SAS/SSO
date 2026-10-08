"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { toast } from "sonner";

import {
  RecursoItem,
  mockRecursosData,
  mockAplicacionesParaRecursos,
  mockRolesPorRecurso,
} from "../data/recursos-data";
import {
  RecursosSummaryCards,
  RecursoSummaryFilterType,
} from "../components/recursos-summary-cards";
import { RecursosFilterBar } from "../components/recursos-filter-bar";
import { RecursosTable } from "../components/recursos-table";
import { RecursoModalForm } from "../components/recurso-modal-form";
import { RecursoModalDetail } from "../components/recurso-modal-detail";

export function RecursosView() {
  const [recursos, setRecursos] = React.useState<RecursoItem[]>(mockRecursosData);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");

  // Modales
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [recursoToEdit, setRecursoToEdit] = React.useState<RecursoItem | null>(null);
  const [detailRecurso, setDetailRecurso] = React.useState<RecursoItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Métricas para summary cards
  const totalCount = recursos.length;
  const activosCount = React.useMemo(
    () => recursos.filter((r) => r.estado === "Activo").length,
    [recursos]
  );
  const inactivosCount = React.useMemo(
    () => recursos.filter((r) => r.estado === "Inactivo").length,
    [recursos]
  );
  const appsWithRecursosCount = React.useMemo(() => {
    const uniqueApps = new Set(recursos.map((r) => r.aplicacionId));
    return uniqueApps.size;
  }, [recursos]);

  // Filtro activo reflejado en Cards
  const activeSummaryFilter = React.useMemo<RecursoSummaryFilterType | null>(() => {
    if (selectedEstado === "Activo") return "activos";
    if (selectedEstado === "Inactivo") return "inactivos";
    if (selectedEstado === "Todos" && selectedApp === "Todas" && !searchTerm) return "total";
    return null;
  }, [selectedEstado, selectedApp, searchTerm]);

  const handleSelectSummaryFilter = (filter: RecursoSummaryFilterType) => {
    if (filter === "total") {
      setSelectedEstado("Todos");
      setSelectedApp("Todas");
      setSearchTerm("");
    } else if (filter === "activos") {
      if (activeSummaryFilter === "activos") {
        setSelectedEstado("Todos");
      } else {
        setSelectedEstado("Activo");
      }
    } else if (filter === "inactivos") {
      if (activeSummaryFilter === "inactivos") {
        setSelectedEstado("Todos");
      } else {
        setSelectedEstado("Inactivo");
      }
    } else if (filter === "apps") {
      // Toggle or reset filters to display all apps
      setSelectedApp("Todas");
      setSelectedEstado("Todos");
    }
  };

  // Filtrado de la lista
  const filteredRecursos = React.useMemo(() => {
    return recursos.filter((rec) => {
      // 1. Buscador por nombre o código
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        term === "" ||
        rec.nombre.toLowerCase().includes(term) ||
        rec.codigo.toLowerCase().includes(term) ||
        rec.aplicacionNombre.toLowerCase().includes(term) ||
        rec.aplicacionCodigo.toLowerCase().includes(term);

      // 2. Filtro por aplicación
      const matchApp =
        selectedApp === "Todas" || rec.aplicacionId === selectedApp;

      // 3. Filtro por estado
      const matchEstado =
        selectedEstado === "Todos" || rec.estado === selectedEstado;

      return matchSearch && matchApp && matchEstado;
    });
  }, [recursos, searchTerm, selectedApp, selectedEstado]);

  // Handlers de modales
  const handleOpenCreate = () => {
    setRecursoToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rec: RecursoItem) => {
    setRecursoToEdit(rec);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (rec: RecursoItem) => {
    setDetailRecurso(rec);
    setIsDetailOpen(true);
  };

  const handleSaveRecurso = (savedRecurso: RecursoItem) => {
    const isNew = !recursos.some((r) => r.id === savedRecurso.id);

    if (isNew) {
      setRecursos((prev) => [savedRecurso, ...prev]);
      toast.success(`Recurso "${savedRecurso.nombre}" creado exitosamente.`);
    } else {
      setRecursos((prev) =>
        prev.map((r) => (r.id === savedRecurso.id ? savedRecurso : r))
      );
      if (detailRecurso?.id === savedRecurso.id) {
        setDetailRecurso(savedRecurso);
      }
      toast.success(`Recurso "${savedRecurso.nombre}" actualizado.`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedApp("Todas");
    setSelectedEstado("Todos");
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Codigo",
      "Nombre",
      "Aplicacion_Codigo",
      "Aplicacion_Nombre",
      "Descripcion",
      "Estado",
      "Roles_Asociados",
      "Fecha_Creacion",
      "Ultima_Actualizacion",
    ];

    const rows = filteredRecursos.map((r) => {
      const rolesCount = (mockRolesPorRecurso[r.id] || []).length;
      return [
        r.id,
        r.codigo,
        `"${r.nombre.replace(/"/g, '""')}"`,
        r.aplicacionCodigo,
        `"${r.aplicacionNombre}"`,
        `"${(r.descripcion || "").replace(/"/g, '""')}"`,
        r.estado,
        rolesCount,
        r.fechaCreacion,
        `"${r.ultimaActualizacion}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `recursos_mineduc_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Listado de recursos exportado en formato CSV.");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Contenedor Principal de Gestión de Recursos */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                  Recursos
                </h1>
                <Badge tone="warning" appearance="soft" size="sm">
                  Mockup en desarrollo
                </Badge>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Administra los recursos disponibles para las aplicaciones y su asignación a roles.
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

              {/* Botón Primario: Nuevo recurso */}
              <Button
                variant="primary"
                onClick={handleOpenCreate}
                className="gap-2 flex-1 sm:flex-none text-xs"
              >
                <Plus className="size-4" />
                Nuevo recurso
              </Button>
            </div>
          </div>

          {/* Cards Superiores */}
          <RecursosSummaryCards
            total={totalCount}
            activos={activosCount}
            inactivos={inactivosCount}
            appsCount={appsWithRecursosCount}
            activeFilter={activeSummaryFilter}
            onSelectFilter={handleSelectSummaryFilter}
          />

          {/* Filtros */}
          <RecursosFilterBar
            aplicaciones={mockAplicacionesParaRecursos}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedApp={selectedApp}
            onAppChange={setSelectedApp}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
            onReset={handleResetFilters}
          />

          {/* Tabla de Recursos */}
          <RecursosTable
            recursos={filteredRecursos}
            onViewDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Modal: Crear / Editar Recurso */}
      <RecursoModalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        recursoToEdit={recursoToEdit}
        existingRecursos={recursos}
        onSave={handleSaveRecurso}
      />

      {/* Modal: Detalle del Recurso */}
      <RecursoModalDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        recurso={detailRecurso}
        onEdit={handleOpenEdit}
      />
    </div>
  );
}

