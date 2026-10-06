"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserPlus, Download } from "lucide-react";
import { Link } from "@/routing";
import { toast } from "sonner";


import {
  UsuarioItem,
  mockUsuariosData,
} from "../data/usuarios-data";
import { UsuariosFilterBar } from "../components/usuarios-filter-bar";
import { UsuariosTable } from "../components/usuarios-table";
import { UsuarioModalDetail } from "../components/usuario-modal-detail";
import { UsuarioPasswordDialog } from "../components/usuario-password-dialog";
import { UsuarioModalForm } from "../components/usuario-modal-form";
import { UsuarioModalAccess } from "../components/usuario-modal-access";
import {
  UsuariosSummaryCards,
  SummaryFilterType,
} from "../components/usuarios-summary-cards";

export function UsuariosView() {
  const [usuarios, setUsuarios] = React.useState<UsuarioItem[]>(mockUsuariosData);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSede, setSelectedSede] = React.useState("Todas");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedRol, setSelectedRol] = React.useState("Todos");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");
  const [filterSinAccesos, setFilterSinAccesos] = React.useState(false);

  // Métricas operacionales para Cards resumen
  const totalCount = usuarios.length;
  const activeCount = React.useMemo(
    () => usuarios.filter((u) => u.estado === "Activo").length,
    [usuarios]
  );
  const inactiveCount = React.useMemo(
    () => usuarios.filter((u) => u.estado === "Inactivo").length,
    [usuarios]
  );
  const sinAccesosCount = React.useMemo(
    () =>
      usuarios.filter((u) => {
        const totalAsig = u.sedes.reduce(
          (acc, s) => acc + (s.asignaciones?.length || 0),
          0
        );
        return totalAsig === 0;
      }).length,
    [usuarios]
  );

  // Filtro activo reflejado en Cards
  const activeSummaryFilter = React.useMemo<SummaryFilterType | null>(() => {
    if (filterSinAccesos) return "sin-accesos";
    if (selectedEstado === "Activo") return "activos";
    if (selectedEstado === "Inactivo") return "inactivos";
    if (selectedEstado === "Todos" && !filterSinAccesos) return "total";
    return null;
  }, [filterSinAccesos, selectedEstado]);

  const handleSelectSummaryFilter = (filter: SummaryFilterType) => {
    if (filter === "total") {
      setSelectedEstado("Todos");
      setFilterSinAccesos(false);
    } else if (filter === "activos") {
      if (activeSummaryFilter === "activos") {
        setSelectedEstado("Todos");
        setFilterSinAccesos(false);
      } else {
        setSelectedEstado("Activo");
        setFilterSinAccesos(false);
      }
    } else if (filter === "inactivos") {
      if (activeSummaryFilter === "inactivos") {
        setSelectedEstado("Todos");
        setFilterSinAccesos(false);
      } else {
        setSelectedEstado("Inactivo");
        setFilterSinAccesos(false);
      }
    } else if (filter === "sin-accesos") {
      if (activeSummaryFilter === "sin-accesos") {
        setFilterSinAccesos(false);
      } else {
        setFilterSinAccesos(true);
        setSelectedEstado("Todos");
      }
    }
  };

  // Modales y Drawers
  const [detailUser, setDetailUser] = React.useState<UsuarioItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const [passwordUser, setPasswordUser] = React.useState<UsuarioItem | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false);

  const [formUser, setFormUser] = React.useState<UsuarioItem | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [accessUser, setAccessUser] = React.useState<UsuarioItem | null>(null);
  const [isAccessOpen, setIsAccessOpen] = React.useState(false);

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "success" | "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirmar",
    cancelText: "Cerrar",
    variant: "warning",
    onConfirm: () => { },
  });

  // Filtrado reactivo
  const filteredUsuarios = React.useMemo(() => {
    return usuarios.filter((user) => {
      // 0. Usuarios sin accesos
      if (filterSinAccesos) {
        const totalAsig = user.sedes.reduce(
          (acc, s) => acc + (s.asignaciones?.length || 0),
          0
        );
        if (totalAsig > 0) return false;
      }

      // 1. Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const fullName = `${user.nombre} ${user.apellidos}`.toLowerCase();
        const matchesName = fullName.includes(query);
        const idDoc = user.documentoIdentificacion || user.identificacion || "";
        const matchesId = idDoc.toLowerCase().includes(query);
        const emailStr = (user.email || user.correo || "").toLowerCase();
        const matchesEmail = emailStr.includes(query);
        if (!matchesName && !matchesId && !matchesEmail) return false;
      }

      // 2. Sede
      if (selectedSede !== "Todas") {
        if (!user.sedes.some((s) => s.sedeNombre === selectedSede)) return false;
      }

      // 3. Aplicación
      if (selectedApp !== "Todas") {
        const hasApp = user.sedes.some((s) =>
          s.asignaciones.some((a) => a.aplicacionNombre === selectedApp)
        );
        if (!hasApp) return false;
      }

      // 4. Rol
      if (selectedRol !== "Todos") {
        const hasRol = user.sedes.some((s) =>
          s.asignaciones.some((a) => a.rolNombre === selectedRol)
        );
        if (!hasRol) return false;
      }

      // 5. Estado
      if (selectedEstado !== "Todos" && user.estado !== selectedEstado) {
        return false;
      }

      return true;
    });
  }, [
    usuarios,
    searchTerm,
    selectedSede,
    selectedApp,
    selectedRol,
    selectedEstado,
    filterSinAccesos,
  ]);

  // Handlers
  const handleOpenDetail = (usuario: UsuarioItem) => {
    setDetailUser(usuario);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (usuario: UsuarioItem) => {
    setFormUser(usuario);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setFormUser(null);
    setIsFormOpen(true);
  };

  const handleOpenAccess = (usuario: UsuarioItem) => {
    setAccessUser(usuario);
    setIsAccessOpen(true);
  };

  const handleOpenChangePassword = (usuario: UsuarioItem) => {
    setPasswordUser(usuario);
    setIsPasswordOpen(true);
  };

  const handleSaveUser = (savedUser: UsuarioItem) => {
    if (formUser) {
      setUsuarios((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
    } else {
      setUsuarios((prev) => [savedUser, ...prev]);
    }
  };

  const handlePasswordSuccess = (usuarioId: string) => {
    const user = usuarios.find((u) => u.id === usuarioId);
    toast.success("Contraseña actualizada", {
      description: `Se restableció la clave de ${user?.nombre || "el usuario"}.`,
    });
  };

  const handleToggleStatus = (usuario: UsuarioItem) => {
    const isCurrentlyActive = usuario.estado === "Activo";
    const nextStatus = isCurrentlyActive ? "Inactivo" : "Activo";
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();

    if (isCurrentlyActive) {
      setConfirmDialog({
        open: true,
        variant: "warning",
        title: "¿Inactivar usuario?",
        description: `Estás a punto de inactivar a este usuario. Esta acción suspenderá su acceso a todas las aplicaciones asignadas.`,
        confirmText: "Inactivar",
        cancelText: "Cancelar",
        onConfirm: () => {
          setUsuarios((prev) =>
            prev.map((u) => (u.id === usuario.id ? { ...u, estado: "Inactivo" } : u))
          );
          toast.info("Usuario inactivado correctamente", {
            description: `${nombreCompleto} ha pasado a estado Inactivo.`,
          });
        },
      });
    } else {
      setConfirmDialog({
        open: true,
        variant: "success",
        title: "¿Activar usuario?",
        description: `Estás a punto de activar a este usuario. Esta acción restablecerá su acceso a todas las aplicaciones asignadas.`,
        confirmText: "Activar",
        cancelText: "Cancelar",
        onConfirm: () => {
          setUsuarios((prev) =>
            prev.map((u) => (u.id === usuario.id ? { ...u, estado: "Activo" } : u))
          );
          toast.success("Usuario activado correctamente", {
            description: `${nombreCompleto} ha pasado a estado Activo.`,
          });
        },
      });
    }
  };

  const handleExport = () => {
    toast.success("Exportación generada", {
      description: `Se descargó el reporte con ${filteredUsuarios.length} usuarios filtrados.`,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Main User Container */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">

          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-white">
                Usuarios
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Administra los usuarios, sus sedes y accesos a las aplicaciones institucionales.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <Button variant="outline" onClick={handleExport} className="gap-2 flex-1 sm:flex-none text-xs">
                <Download className="size-4" /> Exportar
              </Button>
              <Button variant="primary" onClick={handleOpenCreate} className="gap-2 flex-1 sm:flex-none text-xs">
                <UserPlus className="size-4" /> Crear usuario
              </Button>
            </div>
          </div>

          {/* Cards resumen operativo */}
          <UsuariosSummaryCards
            total={totalCount}
            activos={activeCount}
            inactivos={inactiveCount}
            sinAccesos={sinAccesosCount}
            activeFilter={activeSummaryFilter}
            onSelectFilter={handleSelectSummaryFilter}
          />

          {/* Filtros */}
          <UsuariosFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={(est) => {
              setSelectedEstado(est);
              if (filterSinAccesos) setFilterSinAccesos(false);
            }}
            selectedSede={selectedSede}
            onSedeChange={setSelectedSede}
            selectedApp={selectedApp}
            onAppChange={setSelectedApp}
            selectedRol={selectedRol}
            onRolChange={setSelectedRol}
            filterSinAccesos={filterSinAccesos}
            onFilterSinAccesosChange={setFilterSinAccesos}
          />

          {/* Tabla */}
          <UsuariosTable
            usuarios={filteredUsuarios}
            onViewDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onManageAccess={handleOpenAccess}
            onChangePassword={handleOpenChangePassword}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Modales */}
        <UsuarioModalDetail
          usuario={detailUser}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onEdit={(u) => {
            setIsDetailOpen(false);
            handleOpenEdit(u);
          }}
        />

        <UsuarioModalForm
          usuarioToEdit={formUser}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSave={handleSaveUser}
        />

        <UsuarioModalAccess
          usuario={accessUser}
          allUsuarios={usuarios}
          open={isAccessOpen}
          onOpenChange={setIsAccessOpen}
          onSave={handleSaveUser}
        />

        <UsuarioPasswordDialog
          usuario={passwordUser}
          open={isPasswordOpen}
          onOpenChange={setIsPasswordOpen}
          onSuccess={handlePasswordSuccess}
        />

        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant}
          onConfirm={confirmDialog.onConfirm}
        />

      </div>
    </div>
  );
}
