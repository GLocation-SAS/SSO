"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { Users, Shield, UserPlus, Key, FileCheck, History, Activity, CheckCircle2, XCircle, MoreHorizontal, Edit, UserX, UserCheck, Trash2, AlertTriangle, User, Mail } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "@/components/ui/search";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { InteractiveCard } from "@/components/ui/data-display";
import { toast } from "sonner";


import { SubSection } from "./sub-section";

function UserFormDemo() {
  const [formOpen, setFormOpen] = React.useState(false);
  const [warningOpen, setWarningOpen] = React.useState(false);

  const handleSaveClick = () => {
    setWarningOpen(true);
  };

  const handleConfirm = () => {
    setWarningOpen(false);
    setFormOpen(false);
    toast.success("Usuario guardado exitosamente");
  };

  return (
    <>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">
            <UserPlus className="mr-2 size-4" />
            Abrir Formulario de Usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl p-0 gap-0">
          <DialogHeader className="text-left space-y-2 p-6 border-b border-border/60">
            <DialogTitle className="text-2xl font-heading font-bold text-foreground">Crear nuevo usuario institucional</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Completa la información del usuario y asígnale un rol para gestionar su acceso a la plataforma.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6 text-left">
            {/* Nombre completo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground block text-left">Nombre completo</label>
              <InputGroup leftIcon={<User className="size-4 text-muted-foreground" />}>
                <InputGroupInput type="text" placeholder="Ej: Patricia Morales" />
              </InputGroup>
            </div>

            {/* Correo institucional */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground block text-left">Correo institucional</label>
              <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                <InputGroupInput type="email" placeholder="usuario@educacion.gob.ec" />
              </InputGroup>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground block text-left">Rol</label>
              <Combobox defaultValue="">
                <ComboboxInput placeholder="Selecciona un rol" className="w-full" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="admin">Administrador</ComboboxItem>
                    <ComboboxItem value="gestor">Gestor</ComboboxItem>
                    <ComboboxItem value="analista">Analista SIG</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground block text-left">Estado</label>
              <Combobox defaultValue="">
                <ComboboxInput placeholder="Selecciona un estado" className="w-full" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="activo">Activo</ComboboxItem>
                    <ComboboxItem value="inactivo">Inactivo</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          <DialogFooter className="flex flex-row sm:justify-between items-center w-full p-6 border-t border-border">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="w-full sm:w-32 bg-transparent">Cancelar</Button>
            <Button variant="primary" onClick={handleSaveClick} className="w-full sm:w-40 mt-3 sm:mt-0">Guardar usuario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="size-5" />
              Confirmar Guardado
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas guardar este usuario institucional? Asegúrate de que los datos sean correctos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="neutral" onClick={() => setWarningOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdministrationShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const [users, setUsers] = React.useState([
    { id: "1", name: "Carlos Andrés Villalobos", email: "cvillalobos@minedec.gov", role: "ADMIN", roleType: "Director de Área", area: "INNOVACIÓN TECNOLÓGICA", status: "Activo" },
    { id: "2", name: "María Fernanda Gómez", email: "mgomez@minedec.gov", role: "COLABORADOR", roleType: "Especialista SIG", area: "INFRAESTRUCTURA EDUCATIVA", status: "Activo" },
    { id: "3", name: "Luis Eduardo Martínez", email: "lmartinez@minedec.gov", role: "ADMIN", roleType: "Coordinador General", area: "PLANIFICACIÓN", status: "Activo" },
    { id: "4", name: "Ana Lucía Silva", email: "asilva@minedec.gov", role: "SUPERADMIN", roleType: "Analista de Datos", area: "ESTADÍSTICA", status: "Activo" },
    { id: "5", name: "Javier Antonio Vargas", email: "jvargas@minedec.gov", role: "COLABORADOR", roleType: "Auditor", area: "CONTROL INTERNO", status: "Activo" }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [userToModify, setUserToModify] = React.useState<{ id: string, action: 'delete' | 'toggle' | null }>({ id: '', action: null });

  const confirmAction = () => {
    if (userToModify.action === 'toggle') {
      setUsers(prev => prev.map(u => u.id === userToModify.id ? { ...u, status: u.status === "Activo" ? "Inactivo" : "Activo" } : u));
      toast.success("Estado de usuario actualizado correctamente");
    } else if (userToModify.action === 'delete') {
      setUsers(prev => prev.filter(u => u.id !== userToModify.id));
      toast.success("Usuario eliminado correctamente");
    }
    setUserToModify({ id: '', action: null });
  };

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
      {/* 1. USER TABLE & USER STATUS */}
      <SubSection id="user-table" title="Gestión de usuarios y accesos" description="Visualiza el layout completo de la tabla administrativa tal como se requiere en producción." registerSection={registerSection}>
        <div className="space-y-6">

          {/* Header and KPIs */}
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8 mb-6">
            {/* Left Side: Title and description */}
            <div className="flex flex-col gap-3 max-w-2xl mt-2">
              <Badge variant="neutral" appearance="soft" className="w-fit text-[10px] tracking-widest uppercase mb-1">
                # GESTIÓN DE COLABORADORES
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-heading font-black tracking-tight text-foreground">
                Gestión de usuarios
              </h2>
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                Administra los accesos, roles y perfiles de los usuarios del <strong>GEOportal del MINEDEC</strong>.
              </p>
            </div>
            {/* Right Side: KPIs removidos según solicitud */}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
            {/* Search */}
            <div className="w-full lg:w-80">
              <Search
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            </div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Combobox>
                <ComboboxInput placeholder="Rol..." className="min-w-[120px]" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="admin">ADMIN</ComboboxItem>
                    <ComboboxItem value="colaborador">COLABORADOR</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Combobox>
                <ComboboxInput placeholder="Estado..." className="min-w-[120px]" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="activo">Activo</ComboboxItem>
                    <ComboboxItem value="inactivo">Inactivo</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Combobox>
                <ComboboxInput placeholder="Cargo..." className="min-w-[140px]" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="director">Director de Área</ComboboxItem>
                    <ComboboxItem value="especialista">Especialista SIG</ComboboxItem>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Primary Button */}
            <div className="lg:ml-auto w-full lg:w-auto flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="primary" className="px-6 whitespace-nowrap !w-auto">
                    <UserPlus className="size-4 mr-2" />
                    Crear usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md text-center">
                  <DialogHeader>
                    <DialogTitle>Funcionalidad de Prueba</DialogTitle>
                    <DialogDescription>El formulario completo se encuentra en la sección inferior &quot;User Form&quot;.</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-primary [&_th]:text-white">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 lg:pl-8 rounded-tl-xl">Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right pr-6 lg:pr-8 rounded-tr-xl">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id} className="border-border/50 bg-surface hover:bg-muted/20">
                    <TableCell className="font-bold text-foreground py-3 pl-6 lg:pl-8">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                    <TableCell className="font-medium text-sm">{u.roleType}</TableCell>
                    <TableCell>
                      <Badge variant="neutral" appearance="soft" className="text-[10px] tracking-wide bg-muted/40 border-border/50">
                        {u.area}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="info" appearance="soft" className="text-[10px] tracking-wide">{u.role}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={u.status === "Activo" ? "success" : "neutral"} appearance="soft" className="text-[10px] tracking-widest">
                        {u.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 lg:pr-8">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={u.status === "Activo" ? "text-danger hover:text-danger hover:bg-danger/10" : "text-success hover:text-success hover:bg-success/10"}
                          onClick={() => setUserToModify({ id: u.id, action: 'toggle' })}
                        >
                          {u.status === "Activo" ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-danger hover:text-danger hover:bg-danger/10"
                          onClick={() => setUserToModify({ id: u.id, action: 'delete' })}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Modal de Confirmación */}
          {(() => {
            const u = users.find(u => u.id === userToModify.id);
            const isDeactivating = u?.status === 'Activo';
            const modalVariant = userToModify.action === 'delete' ? 'warning' : (isDeactivating ? 'warning' : 'success');

            return (
              <Dialog open={userToModify.action !== null} onOpenChange={(open) => !open && setUserToModify({ id: '', action: null })}>
                <DialogContent variant={modalVariant} className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Confirmar Acción
                    </DialogTitle>
                    <DialogDescription>
                      {userToModify.action === 'delete'
                        ? "¿Estás seguro que deseas eliminar este usuario de forma permanente?"
                        : `¿Estás seguro que deseas ${isDeactivating ? 'desactivar' : 'activar'} a este usuario?`}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="neutral" onClick={() => setUserToModify({ id: '', action: null })}>Cancelar</Button>
                    <Button variant={modalVariant} onClick={confirmAction}>
                      {userToModify.action === 'delete' ? 'Eliminar' : 'Confirmar'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })()}
        </div>
      </SubSection>

      {/* 2. USER FORM & ROLE SELECT (DIALOG) */}
      <SubSection icon={UserPlus} id="user-form" title="Formulario de Usuario y Selección de Rol" description="Formulario estructurado de creación/edición de usuarios con selección de rol." registerSection={registerSection}>
        <div className="p-5 rounded-2xl border border-border bg-surface/60 flex flex-col items-start gap-4">
          <p className="text-sm text-muted-foreground">El componente de formulario ahora se implementa obligatoriamente dentro de un modal.</p>

          <UserFormDemo />
        </div>
      </SubSection>

      {/* 3. PERMISSION MATRIX */}
      <SubSection icon={Shield} id="permission-matrix" title="Matriz de Permisos" description="Matriz visual de Roles × Permisos para control de acceso grano fino." registerSection={registerSection}>
        <div className="border border-border rounded-2xl overflow-hidden bg-surface text-xs text-left">
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border font-bold">
              <tr>
                <th className="p-3">Módulo / Permiso</th>
                <th className="p-3 text-center">Lectura</th>
                <th className="p-3 text-center">Creación</th>
                <th className="p-3 text-center">Edición</th>
                <th className="p-3 text-center">Publicación</th>
                <th className="p-3 text-center">Administración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-3 font-bold text-foreground">Gestor</td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-muted-foreground"><XCircle className="size-4 mx-auto opacity-30" /></td>
                <td className="p-3 text-center text-muted-foreground"><XCircle className="size-4 mx-auto opacity-30" /></td>
                <td className="p-3 text-center text-muted-foreground"><XCircle className="size-4 mx-auto opacity-30" /></td>
                <td className="p-3 text-center text-muted-foreground"><XCircle className="size-4 mx-auto opacity-30" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-foreground">Analista SIG</td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-muted-foreground"><XCircle className="size-4 mx-auto opacity-30" /></td>
                <td className="p-3 text-center text-muted-foreground"><XCircle className="size-4 mx-auto opacity-30" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-foreground">Administrador</td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
                <td className="p-3 text-center text-success"><CheckCircle2 className="size-4 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </SubSection>

      {/* 5. VERSION HISTORY & AUDIT LOG */}
      <SubSection icon={History} id="audit-log" title="Historial de Versiones y Registro de Auditoría" description="Historial de versiones restaurables y registro de auditoría de seguridad." registerSection={registerSection}>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-border bg-surface/60 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <History className="size-4 text-primary" /> Historial de Versiones
              </span>
              <Badge variant="neutral" appearance="soft">v1.4 Actual</Badge>
            </div>
            <div className="divide-y divide-border/60 text-xs">
              <div className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">v1.4 — Ajuste de Capas Zonal 3</p>
                  <p className="text-[10px] text-muted-foreground">10 Mar 2026 • Carlos Andrade</p>
                </div>
                <Badge variant="success" appearance="soft">Vigente</Badge>
              </div>
              <div className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">v1.3 — Modificación Inicial</p>
                  <p className="text-[10px] text-muted-foreground">05 Mar 2026 • María F. López</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-primary">Restaurar</Button>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="p-4 rounded-2xl border border-border bg-surface/60 space-y-3 text-left">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Activity className="size-4 text-info" /> Registro de Auditoría
            </span>
            <div className="space-y-2 text-[11px] font-mono">
              <p className="text-muted-foreground">• [10/Mar/2026 14:22] <strong className="text-foreground">carlos.andrade</strong> actualizó la capa &quot;Escuelas_Riesgo_Zona3&quot; → <span className="text-success font-bold">Éxito</span></p>
              <p className="text-muted-foreground">• [10/Mar/2026 12:10] <strong className="text-foreground">maria.lopez</strong> creó el usuario &quot;lorena.silva&quot; → <span className="text-success font-bold">Éxito</span></p>
            </div>
          </div>
        </div>
      </SubSection>
    </div>
  );
}
