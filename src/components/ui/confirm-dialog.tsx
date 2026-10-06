import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "¿Confirmar acción?",
  description = "Esta acción modificará la configuración del elemento seleccionado.",
  confirmText = "Confirmar",
  cancelText = "Cerrar",
  variant = "warning",
  onConfirm,
}: ConfirmDialogProps) {
  const isStatus = Boolean(variant && variant !== "default");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant={variant}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={false}>
          <Button
            type="button"
            variant="neutral"
            size="default"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "default" ? "primary" : variant}
            size="default"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
