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
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirmar acción",
  description = "¿Estás seguro de que deseas guardar los cambios realizados? Esta acción modificará la configuración del componente.",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="warning" className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-col-reverse gap-3 w-full sm:flex-col-reverse sm:gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cancelar
          </Button>
          <Button variant="warning" onClick={() => {
            onConfirm();
            onOpenChange(false);
          }} className="w-full">
            Sí, guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

