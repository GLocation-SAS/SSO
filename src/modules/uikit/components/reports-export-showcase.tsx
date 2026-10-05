"use client";

import React from "react";
import { SubSection } from "./sub-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileCheck, Sliders, FileSpreadsheet, CheckCircle2, Clock, AlertCircle, Eye, Filter, Layers, Share2, ListOrdered } from "lucide-react";




export function ReportsExportShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const [downloadState, setDownloadState] = React.useState<"idle" | "loading">("idle");

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
        {/* 1. EXPORT BUTTON */}
        <SubSection icon={Download} id="export-button" title="Botón de Exportación" description="Botón especializado para iniciar acciones de descarga y exportación." registerSection={registerSection}>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">
              Default Export
            </Button>
            <Button variant="primary" size="sm">
              <Download className="size-4 mr-2" /> Exportar Datos
            </Button>
            <Button variant="primary" size="sm" disabled>
              <Download className="size-4 mr-2" /> Exportar Deshabilitado
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDownloadState("loading");
                setTimeout(() => setDownloadState("idle"), 2500);
              }}
            >
              {downloadState === "loading" ? (
                <>Generando PDF...</>
              ) : (
                <><Download className="size-4 mr-2" /> Probar Estado Loading</>
              )}
            </Button>
          </div>
        </SubSection>

        {/* 2. EXPORT MENU */}
        <SubSection icon={Share2} id="export-menu" title="Menú de Exportación" description="Menú desplegable de selección rápida de formatos según permisos institucionales." registerSection={registerSection}>
          <div className="p-4 rounded-xl border border-border bg-surface max-w-sm space-y-2">
            <p className="text-xs font-bold text-foreground">Seleccionar Formato de Exportación:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto">
                <FileText className="size-4 text-danger" /> PDF
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto">
                <FileSpreadsheet className="size-4 text-success" /> CSV
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto">
                <FileSpreadsheet className="size-4 text-success" /> XLSX
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto">
                <Layers className="size-4 text-primary" /> GeoJSON
              </Button>
            </div>
          </div>
        </SubSection>


        {/* 4. REPORT PREVIEW */}
        <SubSection icon={Eye} id="report-preview" title="Vista Previa de Reporte" description="Previsualización de documentos consolidados antes de confirmar la descarga." registerSection={registerSection}>
          <div className="p-6 rounded-2xl border border-border bg-background shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="size-5 text-primary" />
                <h4 className="text-sm font-bold text-foreground">Vista Previa — Reporte de Infraestructura 2026</h4>
              </div>
              <Badge variant="info" appearance="soft">Borrador de Vista Previa</Badge>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 text-xs space-y-2 font-mono">
              <p className="font-bold text-foreground font-sans">Encabezado del Informe:</p>
              <p>• Entidad: Ministerio de Educación del Ecuador</p>
              <p>• Alcance: 45 Unidades Educativas analizadas</p>
              <p>• Fecha de generación: 10 de Marzo de 2026</p>
            </div>
          </div>
        </SubSection>

        {/* 5. REPORT STATUS */}
        <SubSection icon={Clock} id="report-status" title="Estado de Reporte" description="Indicadores visuales de avance de procesamiento de reportes." registerSection={registerSection}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-border bg-surface text-xs space-y-1">
              <span className="text-[10px] text-muted-foreground block font-semibold">Estado 1</span>
              <Badge variant="neutral" appearance="soft" className="gap-1"><Clock className="size-3" /> Preparando</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface text-xs space-y-1">
              <span className="text-[10px] text-muted-foreground block font-semibold">Estado 2</span>
              <Badge variant="warning" appearance="soft" className="gap-1"><Sliders className="size-3" /> Generando</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface text-xs space-y-1">
              <span className="text-[10px] text-muted-foreground block font-semibold">Estado 3</span>
              <Badge variant="success" appearance="filled" className="gap-1"><CheckCircle2 className="size-3" /> Disponible</Badge>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface text-xs space-y-1">
              <span className="text-[10px] text-muted-foreground block font-semibold">Estado 4</span>
              <Badge variant="error" appearance="soft" className="gap-1"><AlertCircle className="size-3" /> Error</Badge>
            </div>
          </div>
        </SubSection>

        {/* 6. DOWNLOAD ITEM & DOWNLOAD LIST */}
        <SubSection icon={ListOrdered} id="download-list" title="Lista de Descargas" description="Fila individual y lista consistente de archivos listos para descargar." registerSection={registerSection}>
          <div className="space-y-3">
            {/* Item 1 */}
            <div className="p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-colors flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <FileText className="size-5" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-foreground">Informe_Riesgo_Zona3_2026.pdf</h5>
                  <p className="text-[10px] text-muted-foreground">PDF • 4.2 MB • Generado hoy a las 14:30</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" appearance="soft">Disponible</Badge>
                <Button variant="primary" size="sm">
                  <Download className="size-3.5 mr-1.5" /> Descargar
                </Button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-4 rounded-2xl border border-border bg-surface hover:bg-surface-raised transition-colors flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-foreground">Matriz_Predios_Escolares.xlsx</h5>
                  <p className="text-[10px] text-muted-foreground">XLSX • 1.8 MB • Generado ayer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" appearance="soft">Disponible</Badge>
                <Button variant="neutral" size="sm">
                  <Download className="size-3.5 mr-1.5" /> Descargar
                </Button>
              </div>
            </div>
          </div>
        </SubSection>
    </div>
  );
}
