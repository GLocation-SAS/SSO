"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  const [isExportingImage, setIsExportingImage] = React.useState(false);

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
      toast.success(`Aplicación creada correctamente. Por favor completa su configuración.`);
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
      toast.warning(`La aplicación "${appToToggle.nombre}" fue desactivada.`);
    } else {
      toast.success(`La aplicación "${appToToggle.nombre}" ha sido activada.`);
    }

    setIsConfirmToggleOpen(false);
  };

  // Exportar captura de imagen (foto) de la tabla
  const handleExportTableImage = async () => {
    setIsExportingImage(true);
    toast.info("Generando captura de la tabla...", {
      description: "Preparando imagen PNG en alta resolución.",
    });

    try {
      const container = document.getElementById("aplicaciones-table-container");
      if (!container) {
        throw new Error("Contenedor de tabla no encontrado.");
      }

      // Generar snapshot canvas con diseño institucional nítido
      const width = Math.max(container.scrollWidth || 1200, 1100);
      const rowHeight = 44;
      const headerHeight = 110;
      const displayedApps = filteredApps.slice(0, 15);
      const totalHeight = headerHeight + displayedApps.length * rowHeight + 60;

      const canvas = document.createElement("canvas");
      canvas.width = width * 2; // retina 2x
      canvas.height = totalHeight * 2;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No se pudo inicializar el contexto de imagen.");
      }

      ctx.scale(2, 2);

      // Fondo blanco institucional
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, totalHeight);

      // Barra superior institucional
      ctx.fillStyle = "#024a87"; // Primary brand
      ctx.fillRect(0, 0, width, 8);

      // Encabezado institucional
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 18px Inter, system-ui, sans-serif";
      ctx.fillText("Ministerio de Educación — Reporte de Aplicaciones", 24, 40);

      ctx.fillStyle = "#64748b";
      ctx.font = "12px Inter, system-ui, sans-serif";
      const fechaStr = new Date().toLocaleDateString("es-EC", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      ctx.fillText(`Generado el: ${fechaStr} | Total registros filtrados: ${filteredApps.length}`, 24, 62);

      // Cabecera de la tabla
      const yHeader = 85;
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(20, yHeader, width - 40, 36);

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      const colX = {
        app: 32,
        codigo: 280,
        estado: 420,
        usuarios: 560,
        roles: 700,
        recursos: 840,
        fecha: 980,
      };

      ctx.fillText("APLICACIÓN", colX.app, yHeader + 22);
      ctx.fillText("CÓDIGO", colX.codigo, yHeader + 22);
      ctx.fillText("ESTADO", colX.estado, yHeader + 22);
      ctx.fillText("USUARIOS", colX.usuarios, yHeader + 22);
      ctx.fillText("ROLES", colX.roles, yHeader + 22);
      ctx.fillText("RECURSOS", colX.recursos, yHeader + 22);
      ctx.fillText("ACTUALIZACIÓN", colX.fecha, yHeader + 22);

      // Filas
      let yRow = yHeader + 36;
      displayedApps.forEach((app, idx) => {
        // Fondo alterno suave
        if (idx % 2 === 1) {
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(20, yRow, width - 40, rowHeight);
        }

        // Borde inferior sutil
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, yRow + rowHeight);
        ctx.lineTo(width - 20, yRow + rowHeight);
        ctx.stroke();

        const textY = yRow + 26;

        // Aplicacion
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px Inter, system-ui, sans-serif";
        const nom = app.nombre;
        ctx.fillText(nom.length > 25 ? nom.slice(0, 24) + "…" : nom, colX.app, textY);

        // Codigo
        ctx.fillStyle = "#475569";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.fillText(app.codigo, colX.codigo, textY);

        // Estado badge pill
        const isActiva = app.estado === "Activa";
        ctx.fillStyle = isActiva ? "#ecfdf5" : "#f1f5f9";
        const badgeX = colX.estado;
        const badgeY = textY - 14;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, 60, 20, 10);
        ctx.fill();

        ctx.fillStyle = isActiva ? "#10b981" : "#94a3b8";
        ctx.beginPath();
        ctx.arc(badgeX + 10, badgeY + 10, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isActiva ? "#065f46" : "#475569";
        ctx.font = "bold 10px Inter, system-ui, sans-serif";
        ctx.fillText(app.estado, badgeX + 18, textY);

        // Usuarios
        ctx.fillStyle = "#475569";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.fillText(app.usuariosCount.toString(), colX.usuarios, textY);

        // Roles
        ctx.fillText(app.rolesCount.toString(), colX.roles, textY);

        // Recursos
        ctx.fillText(app.recursosCount.toString(), colX.recursos, textY);

        // Fecha
        ctx.fillStyle = "#64748b";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.fillText(app.ultimaActualizacion || "—", colX.fecha, textY);

        yRow += rowHeight;
      });

      // Pie de foto institucional
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.fillText(
        displayedApps.length < filteredApps.length
          ? `* Vista preliminar de ${displayedApps.length} de ${filteredApps.length} aplicaciones exportadas en formato PNG institucional.`
          : `* Exportación completa de ${displayedApps.length} aplicaciones en formato PNG institucional.`,
        24,
        yRow + 28
      );

      // Descarga de archivo PNG
      const link = document.createElement("a");
      link.download = `reporte-aplicaciones-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Foto de la tabla descargada", {
        description: "Se guardó correctamente la imagen en formato PNG.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al exportar imagen", {
        description: "No se pudo generar la foto de la tabla.",
      });
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleExportCSV = () => {
    try {
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
      const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-aplicaciones-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("CSV descargado exitosamente", {
        description: `${filteredApps.length} aplicaciones exportadas.`,
      });
    } catch {
      toast.error("Error al exportar CSV");
    }
  };

  const handleExportXLSX = () => {
    handleExportCSV();
  };

  const handleExportPDF = () => {
    toast.info("Generando reporte PDF...", {
      description: "Preparando documento institucional para descarga.",
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Main Applications Container */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-white">
                  Gestión de aplicaciones
                </h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Administra las aplicaciones disponibles y su configuración de acceso.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              {/* Menú de Exportación según UI Kit */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 flex-1 sm:flex-none text-xs">
                    {isExportingImage ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <Download className="size-4" />
                    )}
                    Exportar
                    <ChevronDown className="size-3.5 opacity-60 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-3 space-y-2">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Menú de Exportación</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      Menú desplegable de selección rápida de formatos según permisos institucionales.
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleExportTableImage}
                      disabled={isExportingImage}
                      className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
                    >
                      <ImageIcon className="size-4 text-primary shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">Foto / PNG</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Tabla visual</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleExportPDF}
                      className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
                    >
                      <FileText className="size-4 text-danger shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">PDF</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Documento</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleExportCSV}
                      className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
                    >
                      <FileSpreadsheet className="size-4 text-success shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">CSV</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Datos planos</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleExportXLSX}
                      className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
                    >
                      <FileSpreadsheet className="size-4 text-success shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">XLSX</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Excel libro</span>
                      </div>
                    </Button>
                  </div>
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
            aplicaciones={aplicaciones}
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
          <div id="aplicaciones-table-container">
            <AplicacionesTable
              aplicaciones={filteredApps}
              onViewDetail={handleOpenDetail}
              onEdit={handleOpenEdit}
              onToggleStatus={handleRequestToggleStatus}
            />
          </div>
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
            ? "Desactivar aplicación"
            : "Activar aplicación"
        }
        description={
          appToToggle?.estado === "Activa"
            ? "Los usuarios dejarán de tener acceso a esta aplicación. La configuración de roles y recursos se conservará."
            : `¿Deseas reactivar el acceso a "${appToToggle?.nombre}"? Los funcionarios con roles activos podrán autenticarse nuevamente.`
        }
        confirmText={
          appToToggle?.estado === "Activa"
            ? "Desactivar aplicación"
            : "Activar aplicación"
        }
        variant={appToToggle?.estado === "Activa" ? "warning" : "success"}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

