"use client";

import React, { useState } from "react";
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
  FileText,
  Download,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  REPORTES_PERSONALES_DISPONIBLES,
  ACTIVIDAD_RECIENTE_USUARIO,
  TIEMPO_POR_APLICACION,
  ReportePersonalDescarga,
} from "../data/mi-dashboard-data";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PersonalReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonalReportsDialog({
  open,
  onOpenChange,
}: PersonalReportsDialogProps) {
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (report: ReportePersonalDescarga) => {
    setDownloadingId(report.id);

    setTimeout(() => {
      let content = "";
      let filename = "";
      let mimeType = "";

      const userEmail = user?.email || "prueba2@gmail.com";
      const userName = user?.displayName || "Paula Rozo";

      if (report.formato === "CSV") {
        filename = `Reporte_Accesos_SSO_${userEmail.replace(/[@.]/g, "_")}.csv`;
        mimeType = "text/csv;charset=utf-8;";
        const headers = "FechaHora,Aplicacion,Sede,Rol,Accion,Dispositivo,IP,Estado\n";
        const rows = ACTIVIDAD_RECIENTE_USUARIO.map(
          (a) =>
            `"${a.fechaHora}","${a.aplicacion}","${a.sede}","${a.rol}","${a.accion}","${a.dispositivo}","${a.ip}","${a.estado}"`
        ).join("\n");
        content = headers + rows;
      } else if (report.formato === "JSON") {
        filename = `Reporte_Tiempo_Uso_${userEmail.replace(/[@.]/g, "_")}.json`;
        mimeType = "application/json;charset=utf-8;";
        const dataJson = {
          usuario: {
            nombre: userName,
            email: userEmail,
            cargo: user?.cargo || "Docente / Funcionario",
          },
          fechaExportacion: new Date().toISOString(),
          distribucionTiempoActivo: TIEMPO_POR_APLICACION["30"],
          resumenActividades: ACTIVIDAD_RECIENTE_USUARIO,
        };
        content = JSON.stringify(dataJson, null, 2);
      } else {
        filename = `Certificado_Roles_${userEmail.replace(/[@.]/g, "_")}.txt`;
        mimeType = "text/plain;charset=utf-8;";
        content = `CONECTA MINEDUC - CERTIFICADO DE ACCESOS Y ROLES\nUsuario: ${userName}\nEmail: ${userEmail}\nFecha: ${new Date().toLocaleDateString()}\nEstado: Activo\nSedes: Coordinación Zonal 9, Planta Central\nSistemas: Gestión Docente, SIGE, Talento Humano, Mesa de Ayuda\n`;
      }

      // Trigger client file download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      toast.success("Reporte descargado con éxito", {
        description: `Se ha guardado el archivo ${filename} en tu dispositivo.`,
      });
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border bg-surface-subtle/40">
          <div className="flex items-center gap-2 mb-1">
            <Badge appearance="soft" tone="primary" className="text-xs font-semibold">
              Exportación Oficial
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Datos Personales</span>
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-foreground">
            Reportes personales de actividad
          </DialogTitle>
          <DialogDescription className="text-body-sm text-muted-foreground">
            Genera y descarga en tu equipo los registros de acceso y métricas de uso activo asociados exclusivamente a tu cuenta institucional.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {REPORTES_PERSONALES_DISPONIBLES.map((rep) => {
            const isDownloading = downloadingId === rep.id;
            return (
              <div
                key={rep.id}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    {rep.formato === "CSV" ? (
                      <FileSpreadsheet className="size-5" />
                    ) : rep.formato === "JSON" ? (
                      <FileCode className="size-5" />
                    ) : (
                      <FileText className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {rep.titulo}
                      </h4>
                      <Badge appearance="outline" tone="neutral" className="text-[10px] font-mono">
                        {rep.formato}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {rep.descripcion}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> {rep.fechaGeneracion}
                      </span>
                      <span>•</span>
                      <span>{rep.tamanio}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isDownloading}
                  onClick={() => handleDownload(rep)}
                  className="shrink-0 self-start sm:self-auto"
                  leftIcon={
                    isDownloading ? (
                      <span className="size-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="size-3.5" />
                    )
                  }
                >
                  {isDownloading ? "Generando..." : "Descargar"}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border bg-surface-subtle/30 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-success">
            <CheckCircle2 className="size-3.5 text-success" />
            Servicio de exportación activo
          </span>
          <Button
            type="button"
            variant="neutral"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
