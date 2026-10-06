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
import { UsuarioSheetAccess } from "../components/usuario-sheet-access";

export function UsuariosView() {
  const [usuarios, setUsuarios] = React.useState<UsuarioItem[]>(mockUsuariosData);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSede, setSelectedSede] = React.useState("Todas");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedRol, setSelectedRol] = React.useState("Todos");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");

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
        if (!user.sedes.some(s => s.sedeNombre === selectedSede)) return false;
      }

      // 3. Aplicación
      if (selectedApp !== "Todas") {
        const hasApp = user.sedes.some(s => s.asignaciones.some(a => a.aplicacionNombre === selectedApp));
        if (!hasApp) return false;
      }

      // 4. Rol
      if (selectedRol !== "Todos") {
        const hasRol = user.sedes.some(s => s.asignaciones.some(a => a.rolNombre === selectedRol));
        if (!hasRol) return false;
      }

      // 5. Estado
      if (selectedEstado !== "Todos" && user.estado !== selectedEstado) {
        return false;
      }

      return true;
    });
  }, [usuarios, searchTerm, selectedSede, selectedApp, selectedRol, selectedEstado]);

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
    const nextStatus = usuario.estado === "Activo" ? "Inactivo" : "Activo";
    const actionWord = usuario.estado === "Activo" ? "inactivar" : "activar";

    setConfirmDialog({
      open: true,
      title: `¿Deseas ${actionWord} al usuario?`,
      description: `Esta acción cambiará el estado de ${usuario.nombre} a "${nextStatus}". Los accesos a las aplicaciones vinculadas serán ajustados de forma inmediata.`,
      onConfirm: () => {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? { ...u, estado: nextStatus } : u))
        );
        toast.info(`Usuario ${actionWord}do correctamente`);
      },
    });
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

          {/* Filtros */}
          <UsuariosFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={setSelectedEstado}
            selectedSede={selectedSede}
            onSedeChange={setSelectedSede}
            selectedApp={selectedApp}
            onAppChange={setSelectedApp}
            selectedRol={selectedRol}
            onRolChange={setSelectedRol}
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

        <UsuarioSheetAccess
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
          onConfirm={confirmDialog.onConfirm}
        />

      </div>
    </div>
  );
}
