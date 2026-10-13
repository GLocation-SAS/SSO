"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Building2,
  ShieldCheck,
  FolderTree,
  Check,
  Minus,
  ExternalLink,
  Info,
} from "lucide-react";
import { MisAplicacionItem } from "../data/mis-aplicaciones-data";

interface RecursosDialogProps {
  app: MisAplicacionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenApp: (app: MisAplicacionItem) => void;
}

export function RecursosDialog({
  app,
  open,
  onOpenChange,
  onOpenApp,
}: RecursosDialogProps) {
  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border bg-surface-subtle/40">
          <div className="flex items-center gap-2 mb-1">
            <Badge appearance="soft" tone="primary" className="text-xs font-mono font-semibold">
              {app.codigo}
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{app.categoria}</span>
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-foreground">
            {app.nombre}
          </DialogTitle>
          <DialogDescription className="text-body-sm text-muted-foreground line-clamp-2">
            {app.descripcion}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Trazabilidad de Acceso: Sede y Rol */}
          <div className="rounded-xl border border-border/80 bg-surface p-4 space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Info className="size-3.5 text-primary" />
              Jerarquía de Asignación SSO
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-subtle/60 border border-border/50">
                <Building2 className="size-4 text-primary dark:text-primary-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[11px]">Sede</span>
                  <strong className="text-foreground font-semibold">{app.sede.nombre}</strong>
                  <span className="text-[10px] text-muted-foreground block">Código: {app.sede.codigo}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-subtle/60 border border-border/50">
                <ShieldCheck className="size-4 text-secondary-600 dark:text-secondary-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[11px]">Rol</span>
                  <strong className="text-foreground font-semibold">{app.rol.nombre}</strong>
                  <span className="text-[10px] text-muted-foreground block line-clamp-1">
                    {app.rol.descripcion}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recursos asignados y matriz de permisos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FolderTree className="size-4 text-warning-600 dark:text-warning-400" />
                Recursos autorizados ({app.recursos.length})
              </h4>
              <Badge tone="neutral" appearance="soft" size="sm" className="text-[11px] font-normal">
                Solo lectura
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[46%] pl-4 text-xs font-semibold text-white">
                    Recurso
                  </TableHead>
                  <TableHead className="w-[13.5%] text-center text-xs font-semibold text-white">
                    Ver
                  </TableHead>
                  <TableHead className="w-[13.5%] text-center text-xs font-semibold text-white">
                    Crear
                  </TableHead>
                  <TableHead className="w-[13.5%] text-center text-xs font-semibold text-white">
                    Editar
                  </TableHead>
                  <TableHead className="w-[13.5%] text-center text-xs font-semibold text-white pr-4">
                    Eliminar
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {app.recursos.map((rec) => (
                  <TableRow key={rec.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="size-7 rounded-md bg-warning/10 dark:bg-warning-950/40 text-warning-700 dark:text-warning-300 border border-warning/20 flex items-center justify-center shrink-0 mt-0.5">
                          <FolderTree className="size-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-xs text-foreground leading-tight">
                            {rec.nombre}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              {rec.codigo}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {rec.tipo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-3">
                      <PermisoStatus allowed={rec.permisos.ver} />
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <PermisoStatus allowed={rec.permisos.crear} />
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <PermisoStatus allowed={rec.permisos.editar} />
                    </TableCell>
                    <TableCell className="text-center py-3 pr-4">
                      <PermisoStatus allowed={rec.permisos.eliminar} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-surface-subtle/30 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="neutral"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button
            type="button"
            variant="primary"
            leftIcon={<ExternalLink className="size-4" />}
            onClick={() => {
              onOpenChange(false);
              onOpenApp(app);
            }}
          >
            Abrir aplicación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PermisoStatus({ allowed }: { allowed: boolean }) {
  if (allowed) {
    return (
      <div className="flex justify-center items-center">
        <span
          className="inline-flex items-center justify-center size-6 rounded-md bg-success/15 text-success dark:text-success-400 border border-success/20"
          title="Permitido"
        >
          <Check className="size-3.5 stroke-[2.5]" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <span
        className="inline-flex items-center justify-center size-6 rounded-md bg-muted/40 text-muted-foreground/35"
        title="No autorizado"
      >
        <Minus className="size-3.5" />
      </span>
    </div>
  );
}
