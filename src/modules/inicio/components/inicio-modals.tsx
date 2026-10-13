"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Download,
  Save,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  CursoDocente,
  ESTUDIANTES_EJEMPLO_MOCK,
  RECTIFICACION_PENDIENTE_MOCK,
  EstudianteNota,
  RectificacionSolicitud,
} from "../data/inicio-data";

// ─────────────────────────────────────────────────────────────────────────────
// 1. MODAL DE REGISTRO / VISUALIZACIÓN DE CALIFICACIONES
// ─────────────────────────────────────────────────────────────────────────────
interface CalificacionesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curso: CursoDocente | null;
  onSave?: (cursoId: string) => void;
}

export function CalificacionesModal({
  open,
  onOpenChange,
  curso,
  onSave,
}: CalificacionesModalProps) {
  const [estudiantes, setEstudiantes] = React.useState<EstudianteNota[]>(ESTUDIANTES_EJEMPLO_MOCK);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setEstudiantes(ESTUDIANTES_EJEMPLO_MOCK);
  }, [curso]);

  const handleGradeChange = (id: string, field: "aporte1" | "aporte2" | "examen", val: string) => {
    const num = parseFloat(val) || 0;
    const clamped = Math.min(Math.max(num, 0), 10);

    setEstudiantes((prev) =>
      prev.map((est) => {
        if (est.id !== id) return est;
        const updated = { ...est, [field]: clamped };
        const promedio = Number(((updated.aporte1 + updated.aporte2 + updated.examen) / 3).toFixed(2));
        return {
          ...updated,
          promedio,
          estado: promedio >= 7.0 ? "Aprobado" : "Supletorio",
        };
      })
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onOpenChange(false);
      toast.success("Calificaciones actualizadas", {
        description: `Se guardaron correctamente las notas del curso ${curso?.asignatura} - ${curso?.nivel} "${curso?.paralelo}".`,
      });
      if (curso) {
        onSave?.(curso.id);
      }
    }, 800);
  };

  if (!curso) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 shrink-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge tone="primary" appearance="soft" size="sm">
              {curso.nivel} · Paralelo &ldquo;{curso.paralelo}&rdquo;
            </Badge>
            <Badge tone={curso.estado === "Completado" ? "success" : "warning"} appearance="soft" size="sm">
              {curso.estado}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-foreground">
            {curso.asignatura} — Registro de Calificaciones
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Quimestre II · {curso.estudiantes} estudiantes matriculados · Aula: {curso.aula}
          </DialogDescription>
        </DialogHeader>

        {/* Tabla de Estudiantes */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-bold">#</TableHead>
                  <TableHead className="text-xs font-bold">Estudiante</TableHead>
                  <TableHead className="w-28 text-center text-xs font-bold">Aporte 1 (10)</TableHead>
                  <TableHead className="w-28 text-center text-xs font-bold">Aporte 2 (10)</TableHead>
                  <TableHead className="w-28 text-center text-xs font-bold">Examen (10)</TableHead>
                  <TableHead className="w-24 text-center text-xs font-bold">Promedio</TableHead>
                  <TableHead className="w-28 text-center text-xs font-bold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantes.map((est) => (
                  <TableRow key={est.id}>
                    <TableCell className="text-center text-xs font-medium text-muted-foreground">
                      {est.numeroLista}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">
                          {est.apellidos} {est.nombres}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          CI: {est.cedula}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={est.aporte1}
                        onChange={(e) => handleGradeChange(est.id, "aporte1", e.target.value)}
                        className="w-16 mx-auto text-center text-xs font-semibold py-1 px-1.5 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary tabular-nums"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={est.aporte2}
                        onChange={(e) => handleGradeChange(est.id, "aporte2", e.target.value)}
                        className="w-16 mx-auto text-center text-xs font-semibold py-1 px-1.5 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary tabular-nums"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={est.examen}
                        onChange={(e) => handleGradeChange(est.id, "examen", e.target.value)}
                        className="w-16 mx-auto text-center text-xs font-semibold py-1 px-1.5 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary tabular-nums"
                      />
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs tabular-nums">
                      <span className={est.promedio >= 7.0 ? "text-success" : "text-danger"}>
                        {est.promedio.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        tone={est.estado === "Aprobado" ? "success" : "danger"}
                        appearance="soft"
                        size="sm"
                        className="text-[10px]"
                      >
                        {est.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="p-4 px-6 border-t border-border/60 bg-muted/20 shrink-0 flex items-center justify-between">
          <div className="text-xs text-muted-foreground hidden sm:block">
            * Calificaciones en escala de 0.00 a 10.00 según normativa LOEI.
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Save className="size-3.5" />}
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Guardando..." : "Guardar notas"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MODAL DE CONSULTA DE TODOS LOS CURSOS
// ─────────────────────────────────────────────────────────────────────────────
interface TodosCursosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cursos: CursoDocente[];
  onSelectCurso: (curso: CursoDocente) => void;
}

export function TodosCursosModal({
  open,
  onOpenChange,
  cursos,
  onSelectCurso,
}: TodosCursosModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 shrink-0">
          <DialogTitle className="text-xl font-heading font-bold text-foreground">
            Directorio de Cursos Asignados
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Listado completo de cursos del período lectivo 2025 - 2026 en Unidad Educativa Manuela Cañizares.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cursos.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary dark:text-primary-300">
                    {c.nivel} &ldquo;{c.paralelo}&rdquo;
                  </span>
                  <Badge
                    tone={c.estado === "Completado" ? "success" : c.estado === "En progreso" ? "primary" : "warning"}
                    appearance="soft"
                    size="sm"
                  >
                    {c.estado}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-foreground">{c.asignatura}</h4>
                <p className="text-xs text-muted-foreground">
                  {c.estudiantes} estudiantes · {c.aula} · {c.especialidad}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-foreground">{c.progreso}%</div>
                  <div className="text-[10px] text-muted-foreground">Avance</div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={c.estado === "Completado" ? "outline" : "primary"}
                  onClick={() => {
                    onOpenChange(false);
                    onSelectCurso(c);
                  }}
                >
                  {c.estado === "Completado" ? "Ver calificaciones" : "Continuar registro"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="p-4 px-6 border-t border-border/60 bg-muted/20">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MODAL DE CARGA MASIVA DE CALIFICACIONES
// ─────────────────────────────────────────────────────────────────────────────
interface CargaMasivaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cursos: CursoDocente[];
}

export function CargaMasivaModal({
  open,
  onOpenChange,
  cursos,
}: CargaMasivaModalProps) {
  const [selectedCursoId, setSelectedCursoId] = React.useState(cursos[0]?.id || "");
  const [fileUploaded, setFileUploaded] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSimulateUpload = () => {
    setFileUploaded("plantilla_calificaciones_quimestre2.xlsx");
    toast.info("Archivo cargado", {
      description: "Plantilla Excel validada: 31 registros detectados sin errores de formato.",
    });
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setFileUploaded(null);
      onOpenChange(false);
      toast.success("Carga masiva completada", {
        description: "Se importaron exitosamente las calificaciones del archivo para el curso seleccionado.",
      });
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileSpreadsheet className="size-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Módulo de Importación</span>
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-foreground">
            Carga Masiva de Calificaciones
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Importa notas utilizando la plantilla Excel oficial validada por el Ministerio de Educación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Selector de curso */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Selecciona el curso a importar:
            </label>
            <select
              value={selectedCursoId}
              onChange={(e) => setSelectedCursoId(e.target.value)}
              className="w-full text-xs bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.asignatura} — {c.nivel} &ldquo;{c.paralelo}&rdquo; ({c.estudiantes} estudiantes)
                </option>
              ))}
            </select>
          </div>

          {/* Descarga de plantilla */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">Plantilla oficial para este curso</p>
              <p className="text-[11px] text-muted-foreground">
                Incluye nómina oficial con cédulas y nombres de los estudiantes.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Download className="size-3.5" />}
              onClick={() => {
                toast.success("Descarga iniciada", {
                  description: "Plantilla Excel descargada con la lista oficial de estudiantes.",
                });
              }}
              className="shrink-0"
            >
              Descargar
            </Button>
          </div>

          {/* Área de arrastrar y soltar */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleSimulateUpload}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSimulateUpload();
              }
            }}
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/2 transition-colors flex flex-col items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="size-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">
                Haz clic o arrastra tu archivo Excel aquí
              </p>
              <p className="text-[11px] text-muted-foreground">
                Formatos permitidos: .XLSX o .CSV (máximo 10MB)
              </p>
            </div>
          </div>

          {/* Archivo cargado */}
          {fileUploaded && (
            <div className="p-3 rounded-lg border border-success/30 bg-success-50/40 dark:bg-success-900/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span className="text-xs font-semibold text-foreground">{fileUploaded}</span>
              </div>
              <Badge tone="success" appearance="soft" size="sm">
                Listo para procesar
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!fileUploaded || isProcessing}
            onClick={handleProcess}
          >
            {isProcessing ? "Importando registros..." : "Procesar calificaciones"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODAL DE GESTIÓN DE RECTIFICACIONES
// ─────────────────────────────────────────────────────────────────────────────
interface RectificacionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  solicitud?: RectificacionSolicitud;
  onResolved?: () => void;
}

export function RectificacionModal({
  open,
  onOpenChange,
  solicitud = RECTIFICACION_PENDIENTE_MOCK,
  onResolved,
}: RectificacionModalProps) {
  const handleAction = (decision: "Aprobada" | "Rechazada") => {
    setTimeout(() => {
      onOpenChange(false);
      toast.success(
        decision === "Aprobada" ? "Rectificación aprobada" : "Rectificación rechazada",
        {
          description: `La solicitud ${solicitud.codigo} ha sido marcada como ${decision.toLowerCase()} y notificada a Secretaría.`,
        }
      );
      onResolved?.();
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge tone="warning" appearance="solid" size="sm">
              Solicitud Pendiente
            </Badge>
            <span className="text-xs font-bold text-muted-foreground">{solicitud.codigo}</span>
          </div>
          <DialogTitle className="text-xl font-heading font-bold text-foreground">
            Solicitud de Rectificación de Calificación
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ingresada el {solicitud.fechaSolicitud} por {solicitud.solicitante}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Ficha del Estudiante */}
          <div className="p-3.5 rounded-xl border border-border bg-surface space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estudiante:</span>
              <span className="font-bold text-foreground">{solicitud.estudiante}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cédula:</span>
              <span className="font-medium text-foreground">{solicitud.cedula}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asignatura / Curso:</span>
              <span className="font-medium text-foreground">
                {solicitud.asignatura} — {solicitud.curso}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Período evaluado:</span>
              <span className="font-medium text-foreground">
                {solicitud.quimestre} · {solicitud.parcial || "Parcial 2"}
              </span>
            </div>
          </div>

          {/* Comparativa de Calificaciones */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-muted/20 text-center">
              <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                Calificación Actual
              </span>
              <span className="text-2xl font-bold font-heading text-danger tabular-nums">
                {solicitud.notaActual.toFixed(2)}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-success/30 bg-success-50/30 dark:bg-success-900/10 text-center">
              <span className="text-[11px] font-medium text-success block mb-1">
                Calificación Solicitada
              </span>
              <span className="text-2xl font-bold font-heading text-success tabular-nums">
                {solicitud.notaPropuesta.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Motivo / Justificación */}
          <div className="space-y-1">
            <span className="font-bold text-foreground">Justificación y soporte:</span>
            <p className="p-3 rounded-xl border border-border bg-muted/30 text-muted-foreground leading-relaxed">
              &ldquo;{solicitud.motivo}&rdquo;
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => handleAction("Rechazada")}
          >
            Rechazar solicitud
          </Button>
          <Button
            type="button"
            variant="success"
            size="sm"
            leftIcon={<Check className="size-3.5" />}
            onClick={() => handleAction("Aprobada")}
          >
            Aprobar rectificación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODAL DE CRONOGRAMA ACADÉMICO Y FECHAS LÍMITE (ALERTA / WARNING)
// ─────────────────────────────────────────────────────────────────────────────
interface CronogramaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CronogramaModal({ open, onOpenChange }: CronogramaModalProps) {
  const fechas = [
    { fecha: "15 Octubre, 2026", evento: "Cierre de notas Parcial 1", estado: "Completado", badgeTone: "success" as const },
    { fecha: "24 Octubre, 2026", evento: "Cierre de notas Parcial 2", estado: "En curso", badgeTone: "primary" as const },
    { fecha: "28 Octubre, 2026", evento: "Cierre definitivo Quimestre II (Plataforma)", estado: "Próximo (15 días)", badgeTone: "warning" as const },
    { fecha: "03 Noviembre, 2026", evento: "Juntas de curso y publicación de actas", estado: "Programado", badgeTone: "neutral" as const },
    { fecha: "10 Noviembre, 2026", evento: "Período de supletorios y remediales", estado: "Programado", badgeTone: "neutral" as const },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge tone="warning" appearance="soft" size="sm">
              Alerta de Calendario
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">Sierra 2025-2026</span>
          </div>
          <DialogTitle className="text-lg font-heading font-bold">
            Cronograma de Cierre de Calificaciones
          </DialogTitle>
          <DialogDescription className="text-xs">
            Planificación oficial del Ministerio de Educación para el Quimestre II.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Alerta de bloqueo */}
          <div className="p-3.5 rounded-xl border border-warning/30 bg-warning-50/30 dark:bg-warning-900/10 flex items-start gap-3">
            <span className="size-2 rounded-full bg-warning shrink-0 mt-1.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              El <strong>28 de Octubre, 2026 a las 23:59</strong> se suspenderá automáticamente el ingreso y modificación de notas ordinarias. Cualquier rectificación posterior requerirá solicitud formal al Distrito.
            </p>
          </div>

          {/* Tabla de Hitos */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground">Hitos y plazos establecidos:</span>
            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden text-xs">
              {fechas.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-surface">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">{item.evento}</span>
                    <span className="text-[11px] text-muted-foreground">{item.fecha}</span>
                  </div>
                  <Badge tone={item.badgeTone} appearance="soft" size="sm">
                    {item.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button
            type="button"
            variant="warning"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              toast.success("Recordatorio de cronograma configurado en el panel.");
            }}
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

