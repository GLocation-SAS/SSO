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
  FileText,
  ImageIcon,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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

  // Estado exportación de imagen
  const [isExportingImage, setIsExportingImage] = React.useState(false);

  // Exportar Foto / PNG de la tabla
  const handleExportTableImage = async () => {
    setIsExportingImage(true);
    try {
      const container = document.getElementById("roles-table-container");
      if (!container) {
        throw new Error("Contenedor de tabla no encontrado.");
      }

      // Snapshot institucional nítido
      const width = Math.max(container.scrollWidth || 1200, 1100);
      const rowHeight = 44;
      const headerHeight = 110;
      const displayedRoles = filteredRoles.slice(0, 15);
      const totalHeight = headerHeight + displayedRoles.length * rowHeight + 60;

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
      ctx.fillText("Ministerio de Educación — Reporte de Roles y Permisos", 24, 40);

      ctx.fillStyle = "#64748b";
      ctx.font = "12px Inter, system-ui, sans-serif";
      const fechaStr = new Date().toLocaleDateString("es-EC", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      ctx.fillText(`Generado el: ${fechaStr} | Total registros filtrados: ${filteredRoles.length}`, 24, 62);

      // Cabecera de la tabla
      const yHeader = 85;
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(20, yHeader, width - 40, 36);

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      const colX = {
        nombre: 32,
        app: 320,
        recursos: 540,
        usuarios: 700,
        estado: 820,
        actualizacion: 940,
      };

      ctx.fillText("NOMBRE DEL ROL", colX.nombre, yHeader + 22);
      ctx.fillText("APLICACIÓN", colX.app, yHeader + 22);
      ctx.fillText("RECURSOS ASIGNADOS", colX.recursos, yHeader + 22);
      ctx.fillText("USUARIOS", colX.usuarios, yHeader + 22);
      ctx.fillText("ESTADO", colX.estado, yHeader + 22);
      ctx.fillText("ÚLTIMA ACTUALIZACIÓN", colX.actualizacion, yHeader + 22);

      // Filas
      let yRow = yHeader + 36;
      displayedRoles.forEach((rol, idx) => {
        if (idx % 2 === 1) {
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(20, yRow, width - 40, rowHeight);
        }

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, yRow + rowHeight);
        ctx.lineTo(width - 20, yRow + rowHeight);
        ctx.stroke();

        const textY = yRow + 26;

        // Nombre del rol
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px Inter, system-ui, sans-serif";
        const nom = rol.nombre;
        ctx.fillText(nom.length > 34 ? nom.slice(0, 33) + "…" : nom, colX.nombre, textY);

        // Aplicación
        ctx.fillStyle = "#475569";
        ctx.font = "11px Inter, system-ui, sans-serif";
        const appTxt = `${rol.aplicacionNombre} (${rol.aplicacionCodigo})`;
        ctx.fillText(appTxt.length > 26 ? appTxt.slice(0, 25) + "…" : appTxt, colX.app, textY);

        // Recursos asignados
        const recCount = rol.recursosAsignados.length;
        ctx.fillStyle = recCount > 0 ? "#0369a1" : "#d97706";
        ctx.fillText(recCount > 0 ? `${recCount} recursos asociados` : "Sin recursos asignados", colX.recursos, textY);

        // Usuarios count
        ctx.fillStyle = "#334155";
        ctx.fillText(`${rol.usuariosCount} usuarios`, colX.usuarios, textY);

        // Estado badge pill
        const isActivo = rol.estado === "Activo";
        ctx.fillStyle = isActivo ? "#ecfdf5" : "#f1f5f9";
        const badgeX = colX.estado;
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
        ctx.fillText(rol.estado, badgeX + 18, textY);

        // Última actualización
        ctx.fillStyle = "#64748b";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.fillText(rol.ultimaActualizacion || "—", colX.actualizacion, textY);

        yRow += rowHeight;
      });

      // Pie de foto institucional
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.fillText(
        displayedRoles.length < filteredRoles.length
          ? `* Vista preliminar de ${displayedRoles.length} de ${filteredRoles.length} roles exportados en formato PNG institucional.`
          : `* Exportación completa de ${displayedRoles.length} roles en formato PNG institucional.`,
        24,
        yRow + 28
      );

      // Descarga de archivo PNG
      const link = document.createElement("a");
      link.download = `reporte-roles-${new Date().toISOString().slice(0, 10)}.png`;
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

  // Exportar en CSV
  const handleExportCSV = () => {
    try {
      const headers = [
        "ID",
        "Nombre del Rol",
        "Código Aplicación",
        "Nombre Aplicación",
        "Estado",
        "Usuarios Asignados",
        "Recursos Asociados",
        "Última Actualización",
      ];
      const rows = filteredRoles.map((r) => [
        `"${r.id}"`,
        `"${r.nombre}"`,
        `"${r.aplicacionCodigo}"`,
        `"${r.aplicacionNombre}"`,
        `"${r.estado}"`,
        `"${r.usuariosCount}"`,
        `"${r.recursosAsignados.length}"`,
        `"${r.ultimaActualizacion}"`,
      ]);

      const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-roles-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("CSV descargado exitosamente", {
        description: `${filteredRoles.length} roles exportados.`,
      });
    } catch {
      toast.error("Error al exportar CSV");
    }
  };

  // Exportar XLSX
  const handleExportXLSX = () => {
    handleExportCSV();
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
              {/* Menú de Exportación según UI Kit */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 flex-1 sm:flex-none text-xs"
                  >
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
        variant={rolToToggle?.estado === "Activo" ? "warning" : "default"}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}
