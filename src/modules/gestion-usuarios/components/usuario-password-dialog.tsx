"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Key, Eye, EyeOff, ShieldCheck, Mail, AlertCircle } from "lucide-react";
import { UsuarioItem } from "../data/usuarios-data";

interface UsuarioPasswordDialogProps {
  usuario: UsuarioItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (usuarioId: string) => void;
}

export function UsuarioPasswordDialog({
  usuario,
  open,
  onOpenChange,
  onSuccess,
}: UsuarioPasswordDialogProps) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [requireResetNextLogin, setRequireResetNextLogin] = React.useState(true);
  const [sendEmailNotification, setSendEmailNotification] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setError(null);
    }
  }, [open]);

  if (!usuario) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError(null);
    onSuccess(usuario.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="default" className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary dark:text-primary-400 mb-1">
            <Key className="size-5" />
            <DialogTitle className="text-lg font-heading font-bold text-foreground">
              Cambiar clave de usuario
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Restablece o define una nueva contraseña para este usuario.
          </DialogDescription>
        </DialogHeader>

        {/* Resumen del usuario destino */}
        <div className="bg-muted/40 border border-border/70 rounded-xl p-3 flex flex-col gap-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">
              {usuario.nombre} {usuario.apellidos}
            </span>
            <span className="font-mono text-muted-foreground text-[11px]">
              C.I. {usuario.identificacion}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="size-3 text-muted-foreground" />
            <span className="truncate">{usuario.correo}</span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nueva Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nueva contraseña temporal o definitiva
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa la nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Mínimo 8 caracteres, alfanumérico con mayúsculas y símbolos.
            </span>
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Confirmar nueva contraseña
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Vuelve a ingresar la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          {/* Opciones de seguridad */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-border/50 text-xs">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <Checkbox
                checked={requireResetNextLogin}
                onCheckedChange={(checked) => setRequireResetNextLogin(Boolean(checked))}
                className="mt-0.5"
              />
              <span className="text-muted-foreground leading-snug">
                Exigir al usuario cambiar su clave en el próximo inicio de sesión.
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <Checkbox
                checked={sendEmailNotification}
                onCheckedChange={(checked) => setSendEmailNotification(Boolean(checked))}
                className="mt-0.5"
              />
              <span className="text-muted-foreground leading-snug">
                Enviar notificación con enlace de acceso seguro a <strong className="text-foreground">{usuario.correo}</strong>.
              </span>
            </label>
          </div>

          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="neutral"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="gap-2">
              <ShieldCheck className="size-4" />
              Actualizar contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

