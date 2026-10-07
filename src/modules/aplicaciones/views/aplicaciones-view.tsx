"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Download, ChevronDown, FileText, FileSpreadsheet, ImageIcon, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "@/routing";

import {
  AplicacionItem,
  mockAplicacionesData,
} from "../data/aplicaciones-data";
import {
  AplicacionesSummaryCards,
  AppSummaryFilterType,
} from "../components/aplicaciones-summary-cards";
import { AplicacionesFilterBar } from "../components/aplicaciones-filter-bar";
import { AplicacionesTable } from "../components/aplicaciones-table";
import { AplicacionModalForm } from "../components/aplicacion-modal-form";
import { AplicacionModalDetail } from "../components/aplicacion-modal-detail";

export function AplicacionesView() {
  const router = useRouter();
  const [aplicaciones, setAplicaciones] =
    React.useState<AplicacionItem[]>(mockAplicacionesData);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");
  const [filterAtencion, setFilterAtencion] = React.useState(false);

  // Métricas para summary cards
  const totalCount = aplicaciones.length;
  const activasCount = React.useMemo(
    () => aplicaciones.filter((a) => a.estado === "Activa").length,
    [aplicaciones]
  );
  const inactivasCount = React.useMemo(
    () => aplicaciones.filter((a) => a.estado === "Inactiva").length,
    [aplicaciones]
  );
  const atencionCount = React.useMemo(
    () => aplicaciones.filter((a) => a.requiereAtencion).length,
    [aplicaciones]
  );

  // Filtro activo reflejado en Cards
  const activeSummaryFilter = React.useMemo<AppSummaryFilterType | null>(() => {
    if (filterAtencion) return "atencion";
    if (selectedEstado === "Activa") return "activas";
    if (selectedEstado === "Inactiva") return "inactivas";
    if (selectedEstado === "Todos" && !filterAtencion) return "total";
    return null;
  }, [filterAtencion, selectedEstado]);

  const handleSelectSummaryFilter = (filter: AppSummaryFilterType) => {
    if (filter === "total") {
      setSelectedEstado("Todos");
      setFilterAtencion(false);
    } else if (filter === "activas") {
      if (activeSummaryFilter === "activas") {
        setSelectedEstado("Todos");
        setFilterAtencion(false);
      } else {
        setSelectedEstado("Activa");
        setFilterAtencion(false);
      }
    } else if (filter === "inactivas") {
      if (activeSummaryFilter === "inactivas") {
        setSelectedEstado("Todos");
        setFilterAtencion(false);
      } else {
        setSelectedEstado("Inactiva");
        setFilterAtencion(false);
      }
    } else if (filter === "atencion") {
      if (activeSummaryFilter === "atencion") {
        setFilterAtencion(false);
      } else {
        setFilterAtencion(true);
        setSelectedEstado("Todos");
      }
    }
  };

  // Modales
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [appToEdit, setAppToEdit] = React.useState<AplicacionItem | null>(null);
  const [detailApp, setDetailApp] = React.useState<AplicacionItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Diálogo de Inactivación / Activación
  const [appToToggle, setAppToToggle] = React.useState<AplicacionItem | null>(null);
  const [isConfirmToggleOpen, setIsConfirmToggleOpen] = React.useState(false);

  // Filtrado de lista
  const filteredApps = React.useMemo(() => {
    return aplicaciones.filter((app) => {
      const matchSearch =
        searchTerm === "" ||
        app.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado =
        selectedEstado === "Todos" || app.estado === selectedEstado;

      const matchAtencion = !filterAtencion || app.requiereAtencion;

      return matchSearch && matchEstado && matchAtencion;
    });
  }, [aplicaciones, searchTerm, selectedEstado, filterAtencion]);

  // Handlers
  const handleOpenDetail = (app: AplicacionItem) => {
    setDetailApp(app);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setAppToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (app: AplicacionItem) => {
    setAppToEdit(app);
    setIsFormOpen(true);
  };

  const handleSaveApp = (savedApp: AplicacionItem) => {
    const isNew = !aplicaciones.some((a) => a.id === savedApp.id);
    if (isNew) {
      setAplicaciones((prev) => [savedApp, ...prev]);
      toast.success(`Aplicación "${savedApp.nombre}" creada correctamente.`);
      // Apertura automática del modal de detalle para configurar roles y recursos
      setDetailApp(savedApp);
      setIsDetailOpen(true);
    } else {
      setAplicaciones((prev) =>
        prev.map((a) => (a.id === savedApp.id ? savedApp : a))
      );
      if (detailApp?.id === savedApp.id) {
        setDetailApp(savedApp);
      }
      toast.success(`Aplicación "${savedApp.nombre}" actualizada.`);
    }
  };

  const handleRequestToggleStatus = (app: AplicacionItem) => {
    setAppToToggle(app);
    setIsConfirmToggleOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    if (!appToToggle) return;
    const isCurrentlyActive = appToToggle.estado === "Activa";
    const newStatus: "Activa" | "Inactiva" = isCurrentlyActive ? "Inactiva" : "Activa";

    setAplicaciones((prev) =>
      prev.map((a) =>
        a.id === appToToggle.id ? { ...a, estado: newStatus } : a
      )
    );

    if (isCurrentlyActive) {
      toast.warning(`La aplicación "${appToToggle.nombre}" fue inactivada.`);
    } else {
      toast.success(`La aplicación "${appToToggle.nombre}" ha sido activada.`);
    }

    setIsConfirmToggleOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Codigo", "Nombre", "Estado", "Usuarios", "Roles", "Recursos", "URL"];
    const rows = filteredApps.map((a) => [
      a.id,
      a.codigo,
      `"${a.nombre}"`,
      a.estado,
      a.usuariosCount,
      a.rolesCount,
      a.recursosCount,
      `"${a.urlAcceso}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aplicaciones_mineduc_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Listado de aplicaciones exportado en CSV.");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Main Applications Container */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-white">
                Gestión de aplicaciones
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Administra las aplicaciones disponibles y su configuración de acceso.
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

              {/* Botón Nueva aplicación */}
              <Button
                variant="primary"
                onClick={handleOpenCreate}
                className="gap-2 flex-1 sm:flex-none text-xs"
              >
                <Plus className="size-4" /> Nueva aplicación
              </Button>
            </div>
          </div>

          {/* Cards resumen operativo */}
          <AplicacionesSummaryCards
            total={totalCount}
            activas={activasCount}
            inactivas={inactivasCount}
            atencion={atencionCount}
            activeFilter={activeSummaryFilter}
            onSelectFilter={handleSelectSummaryFilter}
          />

          {/* Separador entre resumen y filtros */}
          <Separator />

          {/* Barra de Filtros */}
          <AplicacionesFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={(est) => {
              setSelectedEstado(est);
              if (filterAtencion) setFilterAtencion(false);
            }}
            filterAtencion={filterAtencion}
            onFilterAtencionChange={setFilterAtencion}
          />

          {/* Tabla */}
          <AplicacionesTable
            aplicaciones={filteredApps}
            onViewDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onToggleStatus={handleRequestToggleStatus}
          />
        </div>
      </div>

      {/* Modal Dialog XL Detalle de Aplicación */}
      <AplicacionModalDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        aplicacion={detailApp}
        onEdit={(app) => {
          setIsDetailOpen(false);
          handleOpenEdit(app);
        }}
        onToggleStatus={handleRequestToggleStatus}
      />

      {/* Modal Dialog XL Crear / Editar */}
      <AplicacionModalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        aplicacionToEdit={appToEdit}
        onSave={handleSaveApp}
      />

      {/* Diálogo de Confirmación de Inactivación / Activación */}
      <ConfirmDialog
        open={isConfirmToggleOpen}
        onOpenChange={setIsConfirmToggleOpen}
        title={
          appToToggle?.estado === "Activa"
            ? "Inactivar aplicación"
            : "Activar aplicación"
        }
        description={
          appToToggle?.estado === "Activa"
            ? "Los usuarios dejarán de tener acceso a esta aplicación. La configuración de roles y recursos se conservará."
            : `¿Deseas reactivar el acceso a "${appToToggle?.nombre}"? Los funcionarios con roles activos podrán autenticarse nuevamente.`
        }
        confirmText={
          appToToggle?.estado === "Activa"
            ? "Inactivar aplicación"
            : "Activar aplicación"
        }
        variant={appToToggle?.estado === "Activa" ? "danger" : "success"}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

