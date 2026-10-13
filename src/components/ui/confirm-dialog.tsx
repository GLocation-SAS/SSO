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
  description?: React.ReactNode;
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
        <DialogFooter 
          showCloseButton={false}
          className="flex-col sm:flex sm:flex-col w-full sm:w-full gap-3 [&_button]:w-full pt-4"
        >
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
          <Button
            type="button"
            variant="neutral"
            size="default"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
