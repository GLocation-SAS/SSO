"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  UserPlus,
  Download,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Link } from "@/routing";
import { toast } from "sonner";

import {
  UsuarioItem,
  mockUsuariosData,
} from "../data/usuarios-data";
import { UsuariosFilterBar } from "../components/usuarios-filter-bar";
import { UsuariosTable } from "../components/usuarios-table";
import { UsuarioDetalleDrawer } from "../components/usuario-detalle-drawer";
import { UsuarioPasswordDialog } from "../components/usuario-password-dialog";
import { UsuarioFormDialog } from "../components/usuario-form-dialog";

export function UsuariosView() {
  const [usuarios, setUsuarios] = React.useState<UsuarioItem[]>(mockUsuariosData);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSede, setSelectedSede] = React.useState("all");
  const [selectedApp, setSelectedApp] = React.useState("all");
  const [selectedEstado, setSelectedEstado] = React.useState("all");

  // Paginación
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);

  // Modales y Drawers
  const [detailUser, setDetailUser] = React.useState<UsuarioItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const [passwordUser, setPasswordUser] = React.useState<UsuarioItem | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false);

  const [formUser, setFormUser] = React.useState<UsuarioItem | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  // Filtrado reactivo
  const filteredUsuarios = React.useMemo(() => {
    return usuarios.filter((user) => {
      // 1. Search term (nombre, apellidos, identificación, correo)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const fullName = `${user.nombre} ${user.apellidos}`.toLowerCase();
        const matchesName = fullName.includes(query);
        const matchesId = user.identificacion.includes(query);
        const matchesEmail = user.correo.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesEmail) return false;
      }

      // 2. Sede
      if (selectedSede !== "all" && user.sede !== selectedSede) {
        return false;
      }

      // 3. Aplicación
      if (selectedApp !== "all") {
        const hasApp = user.rolesAplicaciones.some(
          (r) => r.aplicacionNombre.toLowerCase() === selectedApp.toLowerCase()
        );
        if (!hasApp) return false;
      }

      // 4. Estado
      if (selectedEstado !== "all" && user.estado !== selectedEstado) {
        return false;
      }

      return true;
    });
  }, [usuarios, searchTerm, selectedSede, selectedApp, selectedEstado]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSede, selectedApp, selectedEstado, pageSize]);

  // Slice paginado
  const paginatedUsuarios = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsuarios.slice(startIndex, startIndex + pageSize);
  }, [filteredUsuarios, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedSede("all");
    setSelectedApp("all");
    setSelectedEstado("all");
  };

  // Handlers de usuario
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

  const handleOpenChangePassword = (usuario: UsuarioItem) => {
    setPasswordUser(usuario);
    setIsPasswordOpen(true);
  };

  const handleSaveUser = (savedUser: UsuarioItem) => {
    if (formUser) {
      // Update existing
      setUsuarios((prev) =>
        prev.map((u) => (u.id === savedUser.id ? savedUser : u))
      );
      toast.success("Usuario actualizado", {
        description: `Los datos de ${savedUser.nombre} ${savedUser.apellidos} fueron actualizados.`,
      });
    } else {
      // Add new
      setUsuarios((prev) => [savedUser, ...prev]);
      toast.success("Usuario creado exitosamente", {
        description: `El usuario ${savedUser.nombre} ${savedUser.apellidos} ha sido incorporado al directorio.`,
      });
    }
  };

  const handlePasswordSuccess = (usuarioId: string) => {
    const user = usuarios.find((u) => u.id === usuarioId);
    toast.success("Contraseña actualizada", {
      description: `Se restableció la contraseña institucional para ${user?.nombre || "el usuario"}.`,
    });
  };

  const handleToggleStatus = (usuario: UsuarioItem) => {
    const nextStatus = usuario.estado === "Activo" ? "Inactivo" : "Activo";
    const actionWord = usuario.estado === "Activo" ? "inactivar" : "activar";

    setConfirmDialog({
      open: true,
      title: `¿Deseas ${actionWord} al usuario?`,
      description: `Esta acción cambiará el estado de ${usuario.nombre} ${usuario.apellidos} a "${nextStatus}". Los accesos a las aplicaciones vinculadas serán ajustados de forma inmediata.`,
      onConfirm: () => {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? { ...u, estado: nextStatus } : u))
        );
        toast.info(`Estado actualizado`, {
          description: `El usuario ahora está "${nextStatus}".`,
        });
      },
    });
  };

  const handleDelete = (usuario: UsuarioItem) => {
    setConfirmDialog({
      open: true,
      title: "¿Eliminar usuario de forma permanente?",
      description: `Se eliminará el registro de ${usuario.nombre} ${usuario.apellidos} (C.I. ${usuario.identificacion}). Esta acción desvinculará todas sus aplicaciones y permisos en el SSO.`,
      onConfirm: () => {
        setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
        toast.success("Usuario eliminado", {
          description: `El registro de ${usuario.nombre} ha sido retirado del sistema.`,
        });
      },
    });
  };

  const handleExport = () => {
    // Generate CSV data from current filtered list
    const headers = ["ID", "Nombres", "Apellidos", "Identificación", "Correo", "Sede", "Estado", "Aplicaciones"];
    const rows = filteredUsuarios.map((u) => [
      u.id,
      `"${u.nombre}"`,
      `"${u.apellidos}"`,
      `"${u.identificacion}"`,
      `"${u.correo}"`,
      `"${u.sede}"`,
      `"${u.estado}"`,
      `"${u.rolesAplicaciones.map((r) => r.aplicacionNombre).join("; ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `usuarios_conecta_mineduc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exportación generada", {
      description: `Se descargó el reporte con ${filteredUsuarios.length} usuarios filtrados.`,
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-5 w-full pb-4">
      {/* Contenedor General */}
      <div className="bg-surface border border-border shadow-xs rounded-xl p-4 md:p-6 flex flex-col gap-6 w-full">
        {/* 1. Page Header con Título, Descripción y CTAs Principales */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-primary-300">
              Usuarios
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Supervisa el directorio centralizado de usuarios, sedes institucionales,
              aplicaciones asociadas y gestión contextual de accesos.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2 flex-1 sm:flex-none text-xs"
            >
              <Download className="size-4" />
              Exportar
            </Button>

            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="gap-2 flex-1 sm:flex-none text-xs"
            >
              <UserPlus className="size-4" />
              Crear usuario
            </Button>
          </div>
        </div>

        {/* 3. Filtros */}
        <UsuariosFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSede={selectedSede}
          onSedeChange={setSelectedSede}
          selectedApp={selectedApp}
          onAppChange={setSelectedApp}
          selectedEstado={selectedEstado}
          onEstadoChange={setSelectedEstado}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredUsuarios.length}
        />

        {/* 4. Tabla de Usuarios Paginada */}
        <UsuariosTable
          usuarios={paginatedUsuarios}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredUsuarios.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onViewDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onChangePassword={handleOpenChangePassword}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        {/* 5. Modales y Drawers Contextuales */}
        {/* Drawer: Ver detalle */}
        <UsuarioDetalleDrawer
          usuario={detailUser}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onEdit={handleOpenEdit}
          onChangePassword={handleOpenChangePassword}
        />

        {/* Modal: Cambiar contraseña (Acción Contextual) */}
        <UsuarioPasswordDialog
          usuario={passwordUser}
          open={isPasswordOpen}
          onOpenChange={setIsPasswordOpen}
          onSuccess={handlePasswordSuccess}
        />

        {/* Modal: Crear / Editar usuario */}
        <UsuarioFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          usuarioToEdit={formUser}
          onSave={handleSaveUser}
        />

        {/* Confirmación: Inactivar / Eliminar */}
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
        />
      </div>
    </div>
  );
}

