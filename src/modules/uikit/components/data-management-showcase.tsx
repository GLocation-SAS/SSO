"use client";
import { SubSection } from "./sub-section";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Upload, FileCheck, Table, CheckCircle2, History, AlertCircle } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { FileUploadAdvanced } from "@/components/ui/file-input";
import {
  ValidationSummary, FieldMapping, ProcessingStatus, ExecutionHistory
} from "@/components/ui/data-management";
import { FolderShowcase } from "./folder-showcase";




export function DataManagementShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const [basicFiles, setBasicFiles] = React.useState([
    {
      id: "1",
      file: new File(["demo"], "matriz_colegios_2026.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      status: "success" as const,
      errorType: null,
      progress: 100,
    }
  ]);

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
      {/* 1. DROPZONE & UPLOAD ITEMS */}
        <SubSection icon={Upload} id="file-upload-widgets" title="Dropzone, Upload Item & Upload List" description="Widgets integrados de carga de archivos en caja compacta o experiencia avanzada." registerSection={registerSection}>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-foreground mb-2">File Upload (Básico Integrado en Cajita)</p>
              <FileUpload label="Documentos Adjuntos" items={basicFiles} />
            </div>

            <div>
              <p className="text-xs font-bold text-foreground mb-2">Advanced File Upload (Arrastre Masivo)</p>
              <FileUploadAdvanced label="Capas Geográficas y GeoJSON" />
            </div>
          </div>
        </SubSection>

        {/* 2. FIELD MAPPING & VALIDATION SUMMARY */}
        <SubSection icon={CheckCircle2} id="validation-mapping" title="Field Mapping & Validation Summary" description="Herramientas para asociar columnas de archivos y revisar errores de validación." registerSection={registerSection}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldMapping
              mappings={[
                { sourceField: "COD_AMIE", targetField: "amie_code", required: true, mapped: true },
                { sourceField: "NOMBRE_INSTITUCION", targetField: "institution_name", required: true, mapped: true },
                { sourceField: "LATITUD_WGS84", targetField: "latitude", required: true, mapped: true },
                { sourceField: "LONGITUD_WGS84", targetField: "longitude", required: true, mapped: true },
              ]}
            />

            <ValidationSummary
              totalRows={250}
              validRows={242}
              errorsCount={2}
              warningsCount={6}
              errors={[
                { row: 14, field: "LATITUD_WGS84", message: "Coordenada fuera de los límites de Ecuador.", type: "error" },
                { row: 88, field: "COD_AMIE", message: "Código AMIE no registrado en el padrón central.", type: "error" },
                { row: 102, field: "TELEFONO", message: "Número de teléfono con formato inusual.", type: "warning" },
              ]}
            />
          </div>
        </SubSection>

        {/* 3. PROCESSING STATUS & EXECUTION HISTORY */}
        <SubSection icon={History} id="processing-history" title="Processing Status & Execution History" description="Seguimiento en tiempo real de pipelines de carga e historial de ejecuciones." registerSection={registerSection}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProcessingStatus status="processing" progress={75} currentStep="Importando capas vectoriales en base espacial..." />

            <ExecutionHistory
              history={[
                { id: "1", filename: "padron_instituciones_q1.csv", date: "15 May 2026 10:30", status: "success", records: 1250 },
                { id: "2", filename: "predios_zona_7.geojson", date: "14 May 2026 16:20", status: "success", records: 480 },
                { id: "3", filename: "matriz_aulas_inundadas.xlsx", date: "12 May 2026 09:15", status: "error", records: 0 },
              ]}
            />
          </div>
        </SubSection>
        <FolderShowcase registerSection={registerSection} />
      </div>
  );
}
