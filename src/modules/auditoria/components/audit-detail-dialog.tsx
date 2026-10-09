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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./status-badge";
import { LogGestionItem } from "../data/logs.mock";
import { AccesoAplicacionItem } from "../data/accesos.mock";
import { InteractiveCard } from "@/components/ui/data-display";
import {
  Clock,
  User,
  Shield,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Globe,
  Laptop,
  Check,
  FileText,
} from "lucide-react";

interface AuditDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logItem?: LogGestionItem | null;
  accesoItem?: AccesoAplicacionItem | null;
}

export function AuditDetailDialog({
  open,
  onOpenChange,
  logItem,
  accesoItem,
}: AuditDetailDialogProps) {
  if (!logItem && !accesoItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="3xl" className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {logItem && <LogDetailContent log={logItem} onClose={() => onOpenChange(false)} />}
        {accesoItem && <AccesoDetailContent acceso={accesoItem} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETALLE PARA LOG DE GESTIÓN
// ─────────────────────────────────────────────────────────────────────────────
function LogDetailContent({
  log,
  onClose,
}: {
  log: LogGestionItem;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <DialogHeader className="space-y-1.5 text-left">
        <DialogTitle className="text-xl sm:text-2xl font-bold font-heading text-primary dark:text-white">
          Detalle del Cambio Administrativo
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
          Registro formal de la acción ejecutada en la plataforma SSO institucional.
        </DialogDescription>
      </DialogHeader>

      <Separator />

      {/* Grid de Metadatos Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Responsable */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="info"
          icon={<User className="size-5" />}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Responsable</span>
            <span className="text-sm font-semibold text-foreground leading-tight">{log.responsable.nombre}</span>
            <span className="text-[11px] text-muted-foreground font-mono mt-0.5">{log.responsable.email}</span>
            <span className="text-[10px] text-muted-foreground mt-1.5">{log.responsable.cargo}</span>
          </div>
        </InteractiveCard>

        {/* Fecha y Hora */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="neutral"
          icon={<Clock className="size-5" />}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Fecha y Hora</span>
            <span className="text-sm font-semibold text-foreground leading-tight">{log.fecha}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Registro: {log.fechaRelativa}</span>
            <span className="text-[10px] text-muted-foreground mt-1.5">Sede: {log.responsable.sede}</span>
          </div>
        </InteractiveCard>

        {/* Acción Realizada */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="primary"
          icon={<Shield className="size-5" />}
        >
          <div className="flex flex-col text-left items-start">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Acción Realizada</span>
            <StatusBadge status={log.accion} size="md" />
            <span className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 leading-snug">
              {log.detalleBreve}
            </span>
          </div>
        </InteractiveCard>

        {/* Elemento Afectado */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="default"
          icon={<Layers className="size-5" />}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Elemento Afectado</span>
            <span className="text-sm font-semibold text-foreground line-clamp-1 leading-tight">
              {log.elementoNombre}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Tipo: <strong className="text-foreground">{log.tipoElemento}</strong>
            </span>
            <span className="text-[10px] text-muted-foreground mt-1.5">
              Aplicación: {log.aplicacion}
            </span>
          </div>
        </InteractiveCard>
      </div>

      {/* Motivo de estado si requiere atención o falló */}
      {log.motivoEstado && (
        <div className="p-4 rounded-xl border border-warning/40 bg-warning/10 text-xs flex items-start gap-3">
          <AlertTriangle className="size-5 text-warning-700 dark:text-warning shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-semibold text-warning-800 dark:text-warning-300">
              Observación de Estado
            </strong>
            <p className="text-muted-foreground">{log.motivoEstado}</p>
          </div>
        </div>
      )}

      {/* Tabla Comparativa de Cambios: Valor Anterior vs Valor Nuevo */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          Modificaciones Realizadas (Valor Anterior vs. Valor Nuevo)
        </h4>

        <div className="rounded-xl border border-border/80 overflow-hidden divide-y divide-border/60">
          {log.cambios.map((c, i) => (
            <div
              key={i}
              className="p-3.5 bg-surface hover:bg-muted/20 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="w-full sm:w-1/3">
                <span className="font-semibold text-foreground block">{c.etiqueta}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{c.campo}</span>
              </div>

              <div className="flex-1 w-full flex items-center gap-3">
                {/* Valor Anterior */}
                <div className="flex-1 p-2 rounded-lg bg-danger/10 border border-danger/20 text-muted-foreground">
                  <span className="text-[10px] font-bold text-danger uppercase block mb-0.5">
                    Anterior
                  </span>
                  <span className="line-through">{c.valorAnterior}</span>
                </div>

                <ArrowRight className="size-4 text-muted-foreground shrink-0 hidden sm:block" />

                {/* Valor Nuevo */}
                <div className="flex-1 p-2 rounded-lg bg-success/10 border border-success/20 text-foreground font-medium">
                  <span className="text-[10px] font-bold text-success uppercase block mb-0.5">
                    Nuevo
                  </span>
                  <span>{c.valorNuevo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observaciones generales */}
      {log.observaciones && (
        <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs">
          <span className="font-bold text-foreground block mb-1">Notas de Auditoría:</span>
          <p className="text-muted-foreground leading-relaxed">{log.observaciones}</p>
        </div>
      )}

      <DialogFooter className="pt-2 flex flex-col sm:flex-row items-center sm:justify-between gap-3 w-full">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <StatusBadge status={log.estado} />
          <Badge variant="neutral" appearance="soft" size="sm" className="font-mono text-[10px]">
            {log.codigoEvento}
          </Badge>
        </div>
        <Button variant="neutral" onClick={onClose} className="w-full sm:w-auto">
          Cerrar detalle
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETALLE PARA INGRESO A APLICACIONES
// ─────────────────────────────────────────────────────────────────────────────
function AccesoDetailContent({
  acceso,
  onClose,
}: {
  acceso: AccesoAplicacionItem;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <DialogHeader className="space-y-1.5 text-left">
        <DialogTitle className="text-xl sm:text-2xl font-bold font-heading text-primary dark:text-white">
          Detalle del Acceso a Aplicación
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
          Trazabilidad del evento de autenticación registrado por la pasarela SSO Conecta.
        </DialogDescription>
      </DialogHeader>

      <Separator />

      {/* Datos Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Usuario */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="info"
          icon={<User className="size-5" />}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Usuario</span>
            <span className="text-sm font-semibold text-foreground leading-tight">{acceso.usuario.nombre}</span>
            <span className="text-[11px] text-muted-foreground font-mono mt-0.5">{acceso.usuario.email}</span>
            <span className="text-[10px] text-muted-foreground mt-1.5">
              Cédula: {acceso.usuario.cedula}
            </span>
          </div>
        </InteractiveCard>

        {/* Aplicación y Rol */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="primary"
          icon={<Layers className="size-5" />}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Aplicación Solicitada</span>
            <span className="text-sm font-semibold text-foreground leading-tight">{acceso.aplicacion}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Rol en la app: <strong className="text-foreground">{acceso.rol}</strong>
            </span>
            <span className="text-[10px] text-muted-foreground mt-1.5">
              Código: {acceso.aplicacionCodigo}
            </span>
          </div>
        </InteractiveCard>

        {/* Sede y Temporalidad */}
        <InteractiveCard 
          hideChevron 
          borderless
          shadowless
          color="neutral"
          icon={<Clock className="size-5" />}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Fecha y Ubicación</span>
            <span className="text-sm font-semibold text-foreground leading-tight">{acceso.fecha}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Sede: {acceso.sede}</span>
            <span className="text-[10px] text-muted-foreground mt-1.5">
              Transcurrido: {acceso.fechaRelativa}
            </span>
          </div>
        </InteractiveCard>
      </div>

      {/* Mensaje de Resultado */}
      <div className="p-4 rounded-xl border border-border bg-surface/60 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={acceso.resultado} />
          <span className="text-xs font-semibold text-foreground">Resultado del Intento</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{acceso.motivo}</p>
      </div>

      {/* Datos de Sesión (Presentados de forma entendible) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Contexto de Conexión
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
              <Globe className="size-3.5 text-primary" /> Red e IP
            </span>
            <span className="font-mono text-foreground font-semibold">{acceso.detalles.ip}</span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">Red institucional</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
              <Laptop className="size-3.5 text-primary" /> Dispositivo
            </span>
            <span className="text-foreground font-semibold">{acceso.detalles.navegador}</span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              SO: {acceso.detalles.sistemaOperativo}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
              <Shield className="size-3.5 text-primary" /> Autenticación
            </span>
            <span className="text-foreground font-semibold">
              {acceso.detalles.metodoAutenticacion}
            </span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">
              Respuesta: {acceso.detalles.tiempoRespuestaMs} ms
            </span>
          </div>
        </div>
      </div>

      <DialogFooter className="pt-2 flex flex-col sm:flex-row items-center sm:justify-between gap-3 w-full">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <StatusBadge status={acceso.resultado} />
          <Badge variant="neutral" appearance="soft" size="sm" className="font-mono text-[10px]">
            {acceso.codigoAcceso}
          </Badge>
        </div>
        <Button variant="neutral" onClick={onClose} className="w-full sm:w-auto">
          Cerrar detalle
        </Button>
      </DialogFooter>
    </div>
  );
}
