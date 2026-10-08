"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FolderTree,
  AlertTriangle,
  Loader2,
  ImageIcon,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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

  // Confirmaciones
  const [recursoToToggle, setRecursoToToggle] = React.useState<RecursoItem | null>(null);
  const [isConfirmToggleOpen, setIsConfirmToggleOpen] = React.useState(false);
  const [recursoToDelete, setRecursoToDelete] = React.useState<RecursoItem | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);

  // Estado de exportación
  const [isExportingImage, setIsExportingImage] = React.useState(false);

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

  // Toggle Estado (Activar/Desactivar)
  const handleRequestToggleStatus = (rec: RecursoItem) => {
    setRecursoToToggle(rec);
    setIsConfirmToggleOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    if (!recursoToToggle) return;
    const newStatus = recursoToToggle.estado === "Activo" ? "Inactivo" : "Activo";
    const updated = {
      ...recursoToToggle,
      estado: newStatus as "Activo" | "Inactivo",
      ultimaActualizacion: new Date().toISOString().split("T")[0],
    };
    setRecursos((prev) =>
      prev.map((r) => (r.id === recursoToToggle.id ? updated : r))
    );
    if (detailRecurso?.id === recursoToToggle.id) {
      setDetailRecurso(updated);
    }
    setIsConfirmToggleOpen(false);
    toast.success(
      `Recurso "${recursoToToggle.nombre}" ahora está ${newStatus === "Activo" ? "activo" : "inactivo"}.`
    );
    setRecursoToToggle(null);
  };

  // Eliminar Recurso
  const handleRequestDelete = (rec: RecursoItem) => {
    setRecursoToDelete(rec);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!recursoToDelete) return;
    setRecursos((prev) => prev.filter((r) => r.id !== recursoToDelete.id));
    if (detailRecurso?.id === recursoToDelete.id) {
      setIsDetailOpen(false);
      setDetailRecurso(null);
    }
    setIsConfirmDeleteOpen(false);
    toast.success(`Recurso "${recursoToDelete.nombre}" eliminado correctamente.`);
    setRecursoToDelete(null);
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

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recursos_mineduc_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Listado de recursos exportado en formato CSV.");
  };

  // Exportar PDF
  const handleExportPDF = () => {
    toast.info("Generando reporte PDF...", {
      description: "Preparando documento institucional para descarga.",
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Exportar Imagen de Tabla
  const handleExportTableImage = async () => {
    try {
      setIsExportingImage(true);
      const container = document.getElementById("recursos-table-container");
      if (!container) throw new Error("Contenedor de tabla no encontrado.");

      const width = Math.max(container.scrollWidth || 1200, 1100);
      const rowHeight = 44;
      const headerHeight = 110;
      const displayed = filteredRecursos.slice(0, 15);
      const totalHeight = headerHeight + displayed.length * rowHeight + 60;

      const canvas = document.createElement("canvas");
      canvas.width = width * 2;
      canvas.height = totalHeight * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se pudo inicializar canvas.");

      ctx.scale(2, 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, totalHeight);

      ctx.fillStyle = "#024a87";
      ctx.fillRect(0, 0, width, 8);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 18px Inter, system-ui, sans-serif";
      ctx.fillText("Ministerio de Educación — Reporte de Recursos", 24, 40);

      ctx.fillStyle = "#64748b";
      ctx.font = "12px Inter, system-ui, sans-serif";
      const fechaStr = new Date().toLocaleDateString("es-EC", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
      });
      ctx.fillText(`Generado el ${fechaStr} | Sistema SSO MINEDUC`, 24, 60);

      const colX = { rec: 24, app: 300, desc: 500, roles: 800, est: 980 };
      const tableY = 90;

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(20, tableY, width - 40, 36);

      ctx.fillStyle = "#334155";
      ctx.font = "bold 12px Inter, system-ui, sans-serif";
      ctx.fillText("Recurso", colX.rec, tableY + 23);
      ctx.fillText("Aplicación", colX.app, tableY + 23);
      ctx.fillText("Descripción", colX.desc, tableY + 23);
      ctx.fillText("Roles Asociados", colX.roles, tableY + 23);
      ctx.fillText("Estado", colX.est, tableY + 23);

      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, tableY + 36);
      ctx.lineTo(width - 20, tableY + 36);
      ctx.stroke();

      displayed.forEach((r, idx) => {
        const yRow = tableY + 36 + idx * rowHeight;
        
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, yRow + rowHeight);
        ctx.lineTo(width - 20, yRow + rowHeight);
        ctx.stroke();

        const textY = yRow + 26;

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px Inter, system-ui, sans-serif";
        const nom = r.nombre;
        ctx.fillText(nom.length > 35 ? nom.slice(0, 34) + "…" : nom, colX.rec, textY);

        ctx.fillStyle = "#475569";
        ctx.font = "11px Inter, system-ui, sans-serif";
        const app = r.aplicacionNombre;
        ctx.fillText(app.length > 25 ? app.slice(0, 24) + "…" : app, colX.app, textY);

        const desc = r.descripcion || "Sin descripción";
        ctx.fillText(desc.length > 40 ? desc.slice(0, 39) + "…" : desc, colX.desc, textY);

        const rolesCount = (mockRolesPorRecurso[r.id] || []).length;
        ctx.fillStyle = rolesCount > 0 ? "#0369a1" : "#d97706";
        ctx.fillText(`${rolesCount} roles asignados`, colX.roles, textY);

        const isActivo = r.estado === "Activo";
        ctx.fillStyle = isActivo ? "#ecfdf5" : "#f1f5f9";
        const badgeX = colX.est;
        const badgeY = textY - 14;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, 60, 20, 10);
        ctx.fill();

        ctx.fillStyle = isActivo ? "#10b981" : "#94a3b8";
        ctx.beginPath();
        ctx.arc(badgeX + 10, badgeY + 10, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isActivo ? "#065f46" : "#475569";
        ctx.font = "bold 10px Inter, system-ui, sans-serif";
        ctx.fillText(r.estado, badgeX + 18, textY - 1);
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1.0));
      if (!blob) throw new Error("Fallo al crear Blob");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `recursos-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Foto de la tabla exportada");
    } catch {
      toast.error("Error al exportar imagen");
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Contenedor Principal de Gestión de Recursos */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-xl bg-warning/15 dark:bg-warning-950/40 text-warning-700 dark:text-warning-300 flex items-center justify-center shrink-0 border border-warning/20 shadow-xs mt-0.5">
                <FolderTree className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                    Recursos
                  </h1>
                </div>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                  Administra los recursos disponibles para las aplicaciones y su asignación a roles.
                </p>
              </div>
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
                      className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto col-span-2"
                    >
                      <FileSpreadsheet className="size-4 text-success shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">CSV</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Datos planos</span>
                      </div>
                    </Button>
                  </div>
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
            onToggleStatus={handleRequestToggleStatus}
            onDelete={handleRequestDelete}
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

      {/* Diálogo de Confirmación: Cambiar Estado */}
      <ConfirmDialog
        open={isConfirmToggleOpen}
        onOpenChange={setIsConfirmToggleOpen}
        title={
          recursoToToggle?.estado === "Activo"
            ? "¿Desactivar recurso?"
            : "¿Activar recurso?"
        }
        description={
          recursoToToggle?.estado === "Activo"
            ? `El recurso "${recursoToToggle?.nombre}" (${recursoToToggle?.codigo}) dejará de estar disponible para ser asignado en nuevos roles o permisos hasta que sea reactivado.`
            : `El recurso "${recursoToToggle?.nombre}" (${recursoToToggle?.codigo}) volverá a estar disponible para su uso en roles y políticas.`
        }
        confirmText={
          recursoToToggle?.estado === "Activo"
            ? "Sí, desactivar"
            : "Sí, activar"
        }
        variant={recursoToToggle?.estado === "Activo" ? "warning" : "success"}
        onConfirm={handleConfirmToggleStatus}
      />

      {/* Diálogo de Confirmación: Eliminar Recurso */}
      <ConfirmDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title="¿Eliminar recurso definitivamente?"
        description={`Esta acción eliminará el recurso "${recursoToDelete?.nombre}" (${recursoToDelete?.codigo}) y todas sus asociaciones a roles. Esta operación no se puede revertir.`}
        confirmText="Sí, eliminar definitivamente"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

