"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDecorativeIcon,
  CardBadge,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard, InteractiveCard } from "@/components/ui/data-display";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AppWindow,
  LogIn,
  Clock,
  FileText,
  TrendingUp,
  ArrowRight,
  Network,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building2,
  Shield,
  Laptop,
  Layers,
  Download,
  ChevronDown,
  Loader2,
  ImageIcon,
  FileSpreadsheet,
} from "lucide-react";
import { Search } from "@/components/ui/search";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Link } from "@/routing";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { PersonalReportsDialog } from "../components/personal-reports-dialog";
import {
  MI_DASHBOARD_METRICS,
  ACCESOS_POR_FECHA,
  TIEMPO_POR_APLICACION,
  ACTIVIDAD_RECIENTE_USUARIO,
  PeriodoFiltro,
} from "../data/mi-dashboard-data";

export function MiDashboardView() {
  const { user } = useAuth();
  const [periodo, setPeriodo] = React.useState<PeriodoFiltro>("30");
  const [hoveredAppId, setHoveredAppId] = React.useState<string | null>(null);
  const [hoveredDayIdx, setHoveredDayIdx] = React.useState<number | null>(null);
  const [activeAppFilter, setActiveAppFilter] = React.useState("Todas");
  const [searchActivityQuery, setSearchActivityQuery] = React.useState("");
  const [activityAppFilter, setActivityAppFilter] = React.useState("todas");
  const [reportsOpen, setReportsOpen] = React.useState(false);
  const [isExportingImage, setIsExportingImage] = React.useState(false);

  const currentMetrics = MI_DASHBOARD_METRICS[periodo];
  const accessData = ACCESOS_POR_FECHA[periodo];
  const usageData = TIEMPO_POR_APLICACION[periodo];

  // Cálculo para el desglose de tiempo por aplicación
  const totalMinutos = usageData.reduce((acc, curr) => acc + curr.minutos, 0);
  const totalHorasStr = `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}m`;

  const appOptions = ["Todas", ...usageData.map((u) => u.nombre)];

  const filteredUsageData =
    activeAppFilter === "Todas"
      ? usageData
      : usageData.filter((u) => u.nombre === activeAppFilter);

  // Curva SVG interactiva para el gráfico de accesos (con la misma estética que el admin)
  const maxAccessVal = Math.max(...accessData.map((d) => d.accesos), 1);
  const linePoints = accessData.map((item, idx) => {
    const x = 20 + idx * ((280 - 40) / Math.max(accessData.length - 1, 1));
    const normalizedY = item.accesos / maxAccessVal;
    const y = 80 - normalizedY * 65;
    return { ...item, x, y };
  });

  const linePathData =
    linePoints.length > 1
      ? `M ${linePoints[0].x} ${linePoints[0].y} ` +
        linePoints
          .slice(1)
          .map((p, i) => {
            const prev = linePoints[i];
            const cx = (prev.x + p.x) / 2;
            return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
          })
          .join(" ")
      : "";

  const lineAreaData =
    linePoints.length > 1
      ? `${linePathData} L ${linePoints[linePoints.length - 1].x} 88 L ${linePoints[0].x} 88 Z`
      : "";

  // Filtrado de la tabla de actividad reciente
  const filteredActivities = React.useMemo(() => {
    return ACTIVIDAD_RECIENTE_USUARIO.filter((item) => {
      const q = searchActivityQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.accion.toLowerCase().includes(q) ||
        item.aplicacion.toLowerCase().includes(q) ||
        item.sede.toLowerCase().includes(q) ||
        item.dispositivo.toLowerCase().includes(q) ||
        item.fechaHora.includes(q);

      const matchApp =
        activityAppFilter === "todas" || item.aplicacion === activityAppFilter;

      return matchQuery && matchApp;
    });
  }, [searchActivityQuery, activityAppFilter]);

  const activityOptions = React.useMemo(() => {
    return Array.from(new Set(ACTIVIDAD_RECIENTE_USUARIO.map((a) => a.aplicacion)));
  }, []);

  // Exportar captura de imagen (foto) del resumen de Mi Espacio
  const handleExportDashboardImage = async () => {
    setIsExportingImage(true);
    toast.info("Generando captura de Mi Espacio...", {
      description: "Preparando imagen PNG en alta resolución.",
    });

    try {
      const width = 1200;
      const rowHeight = 44;
      const headerHeight = 210;
      const displayedActivities = filteredActivities.slice(0, 10);
      const totalHeight = headerHeight + 50 + displayedActivities.length * rowHeight + 60;

      const canvas = document.createElement("canvas");
      canvas.width = width * 2; // retina 2x
      canvas.height = totalHeight * 2;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No se pudo inicializar el contexto de imagen.");
      }

      ctx.scale(2, 2);

      // Fondo blanco institucional
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, totalHeight);

      // Barra superior institucional
      ctx.fillStyle = "#024a87"; // Primary brand
      ctx.fillRect(0, 0, width, 8);

      // Encabezado institucional
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 20px Inter, system-ui, sans-serif";
      ctx.fillText("Ministerio de Educación — Reporte de Mi Espacio Conecta MINEDUC", 24, 42);

      ctx.fillStyle = "#64748b";
      ctx.font = "12px Inter, system-ui, sans-serif";
      const fechaStr = new Date().toLocaleDateString("es-EC", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const userName = user?.displayName || "Paula Rozo";
      const userEmail = user?.email || "usuario@conecta.com";
      ctx.fillText(
        `Generado el: ${fechaStr} | Usuario: ${userName} (${userEmail}) | Periodo analizado: ${periodo} días`,
        24,
        64
      );

      // Dibujar 4 KPIs en tarjetas limpias
      const kpiY = 85;
      const kpiWidth = (width - 48 - 36) / 4;
      const kpiHeight = 85;
      const kpis = [
        {
          label: "Aplicaciones asignadas",
          value: `${currentMetrics.aplicacionesAsignadas.total}`,
          sub: "4 activas · 2 sedes",
          color: "#024a87",
        },
        {
          label: "Accesos realizados",
          value: `${currentMetrics.accesos.total}`,
          sub: `${currentMetrics.accesos.cambio} vs. anterior`,
          color: "#0284c7",
        },
        {
          label: "Tiempo de uso activo",
          value: `${currentMetrics.tiempoUsoActivo.totalHoras}`,
          sub: `${currentMetrics.tiempoUsoActivo.promedioDiario} promedio`,
          color: "#d97706",
        },
        {
          label: "Reportes personales",
          value: `${currentMetrics.reportesPersonales.totalDisponibles}`,
          sub: "Formatos listos",
          color: "#16a34a",
        },
      ];

      kpis.forEach((kpi, idx) => {
        const kX = 24 + idx * (kpiWidth + 12);
        // Fondo tarjeta
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(kX, kpiY, kpiWidth, kpiHeight, 10);
        } else {
          ctx.rect(kX, kpiY, kpiWidth, kpiHeight);
        }
        ctx.fill();

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(kX, kpiY, kpiWidth, kpiHeight, 10);
        } else {
          ctx.rect(kX, kpiY, kpiWidth, kpiHeight);
        }
        ctx.stroke();

        // Barra decorativa izquierda
        ctx.fillStyle = kpi.color;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(kX, kpiY, 4, kpiHeight, [10, 0, 0, 10]);
        } else {
          ctx.rect(kX, kpiY, 4, kpiHeight);
        }
        ctx.fill();

        // Label
        ctx.fillStyle = "#64748b";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.fillText(kpi.label, kX + 16, kpiY + 24);

        // Valor
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 22px Inter, system-ui, sans-serif";
        ctx.fillText(kpi.value, kX + 16, kpiY + 52);

        // Subtexto
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px Inter, system-ui, sans-serif";
        ctx.fillText(kpi.sub, kX + 16, kpiY + 70);
      });

      // Título de la tabla de actividad
      const yTableTitle = kpiY + kpiHeight + 30;
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 13px Inter, system-ui, sans-serif";
      ctx.fillText("HISTORIAL DE ACTIVIDAD RECIENTE", 24, yTableTitle);

      ctx.fillStyle = "#64748b";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.fillText(
        `(Mostrando ${displayedActivities.length} de ${filteredActivities.length} eventos)`,
        260,
        yTableTitle
      );

      // Cabecera de la tabla
      const yHeader = yTableTitle + 12;
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(20, yHeader, width - 40, 34);

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      const colX = {
        fecha: 32,
        app: 200,
        accion: 380,
        sede: 680,
        dispositivo: 880,
        estado: 1060,
      };

      ctx.fillText("FECHA Y HORA", colX.fecha, yHeader + 21);
      ctx.fillText("APLICACIÓN", colX.app, yHeader + 21);
      ctx.fillText("ACCIÓN REALIZADA", colX.accion, yHeader + 21);
      ctx.fillText("SEDE / ROL", colX.sede, yHeader + 21);
      ctx.fillText("DISPOSITIVO / IP", colX.dispositivo, yHeader + 21);
      ctx.fillText("ESTADO", colX.estado, yHeader + 21);

      // Filas
      let yRow = yHeader + 34;
      displayedActivities.forEach((item, idx) => {
        // Fondo alterno
        if (idx % 2 === 1) {
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(20, yRow, width - 40, rowHeight);
        }

        // Borde inferior
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, yRow + rowHeight);
        ctx.lineTo(width - 20, yRow + rowHeight);
        ctx.stroke();

        const textY = yRow + 26;

        // Fecha y hora
        ctx.fillStyle = "#475569";
        ctx.font = "11px monospace, Inter, sans-serif";
        ctx.fillText(item.fechaHora, colX.fecha, textY);

        // Aplicación
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px Inter, system-ui, sans-serif";
        ctx.fillText(
          item.aplicacion.length > 22 ? item.aplicacion.slice(0, 21) + "…" : item.aplicacion,
          colX.app,
          textY
        );

        // Acción
        ctx.fillStyle = "#334155";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.fillText(
          item.accion.length > 38 ? item.accion.slice(0, 37) + "…" : item.accion,
          colX.accion,
          textY
        );

        // Sede / Rol
        ctx.fillStyle = "#64748b";
        const sedeRol = `${item.sede} · ${item.rol}`;
        ctx.fillText(
          sedeRol.length > 26 ? sedeRol.slice(0, 25) + "…" : sedeRol,
          colX.sede,
          textY
        );

        // Dispositivo / IP
        const dispIp = `${item.dispositivo} (${item.ip})`;
        ctx.fillText(
          dispIp.length > 24 ? dispIp.slice(0, 23) + "…" : dispIp,
          colX.dispositivo,
          textY
        );

        // Estado badge pill
        const isExito =
          item.estado.toLowerCase().includes("éxito") ||
          item.estado.toLowerCase().includes("exito");
        ctx.fillStyle = isExito ? "#ecfdf5" : "#fef3c7";
        const badgeX = colX.estado;
        const badgeY = textY - 14;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(badgeX, badgeY, 65, 20, 10);
        } else {
          ctx.rect(badgeX, badgeY, 65, 20);
        }
        ctx.fill();

        ctx.fillStyle = isExito ? "#10b981" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(badgeX + 10, badgeY + 10, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isExito ? "#065f46" : "#92400e";
        ctx.font = "bold 10px Inter, system-ui, sans-serif";
        ctx.fillText(item.estado, badgeX + 18, textY);

        yRow += rowHeight;
      });

      // Pie de foto institucional
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.fillText(
        `* Reporte oficial generado desde el espacio personal Conecta MINEDUC — Documento informativo para ${userName}.`,
        24,
        yRow + 28
      );

      ctx.textAlign = "right";
      ctx.fillText("Conecta MINEDUC — República del Ecuador", width - 24, yRow + 28);
      ctx.textAlign = "left";

      // Descarga de archivo PNG
      const link = document.createElement("a");
      link.download = `reporte-mi-espacio-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Foto del reporte descargada", {
        description: "Se guardó correctamente la imagen en formato PNG.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al exportar imagen", {
        description: "No se pudo generar la foto de Mi Espacio.",
      });
    } finally {
      setIsExportingImage(false);
    }
  };

  // Exportar CSV
  const handleExportCSV = () => {
    try {
      const headers = ["Fecha y Hora", "Aplicacion", "Accion", "Sede", "Rol", "Dispositivo", "IP", "Estado"];
      const rows = filteredActivities.map((a) => [
        `"${a.fechaHora}"`,
        `"${a.aplicacion}"`,
        `"${a.accion}"`,
        `"${a.sede}"`,
        `"${a.rol}"`,
        `"${a.dispositivo}"`,
        `"${a.ip}"`,
        `"${a.estado}"`,
      ]);
      const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-actividad-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("CSV descargado exitosamente", {
        description: `${filteredActivities.length} registros exportados.`,
      });
    } catch {
      toast.error("Error al exportar CSV");
    }
  };

  // Exportar XLSX
  const handleExportXLSX = () => {
    handleExportCSV();
  };

  // Exportar PDF
  const handleExportPDF = () => {
    toast.info("Generando reporte PDF...", {
      description: "Preparando documento institucional para descarga.",
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Componente Menú de Exportación consistente con el estándar institucional
  const renderExportMenu = (buttonSize?: "sm" | "default", buttonLabel = "Exportar") => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={buttonSize} className="gap-2 text-xs h-9">
          {isExportingImage ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            <Download className="size-4" />
          )}
          {buttonLabel}
          <ChevronDown className="size-3.5 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3 space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-bold text-foreground">Menú de Exportación</p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Menú desplegable de selección rápida de formatos según permisos institucionales.
          </p>
        </div>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="outline"
            type="button"
            onClick={handleExportDashboardImage}
            disabled={isExportingImage}
            className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
          >
            <ImageIcon className="size-4 text-primary shrink-0" />
            <div className="text-left">
              <span className="block leading-none">Foto / PNG</span>
              <span className="text-[10px] text-muted-foreground font-normal">Resumen visual</span>
            </div>
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleExportPDF}
            className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
          >
            <FileText className="size-4 text-danger shrink-0" />
            <div className="text-left">
              <span className="block leading-none">PDF</span>
              <span className="text-[10px] text-muted-foreground font-normal">Documento</span>
            </div>
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleExportCSV}
            className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
          >
            <FileSpreadsheet className="size-4 text-success shrink-0" />
            <div className="text-left">
              <span className="block leading-none">CSV</span>
              <span className="text-[10px] text-muted-foreground font-normal">Datos planos</span>
            </div>
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleExportXLSX}
            className="flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-all text-xs font-semibold h-auto"
          >
            <FileSpreadsheet className="size-4 text-success shrink-0" />
            <div className="text-left">
              <span className="block leading-none">XLSX</span>
              <span className="text-[10px] text-muted-foreground font-normal">Excel libro</span>
            </div>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex flex-col gap-4 w-full pb-6">
      {/* ── 0. Card de Bienvenida (Estilo Idéntico al Admin Dashboard) ── */}
      <Card
        variant="primary"
        className="relative overflow-hidden border-primary/40 dark:!border-border dark:!bg-surface shadow-xs transition-colors"
        innerClassName="justify-center py-6 md:py-7 px-6 md:px-8"
      >
        <div className="flex flex-col justify-center gap-2 w-full z-10 my-auto">
          <CardBadge className="bg-white/15 !text-white border border-white/20 dark:bg-muted/50 dark:!text-muted-foreground dark:border-border backdrop-blur-xs w-fit text-xs font-semibold px-3 py-1 transition-colors">
            Hola, {user?.displayName || "Paula Rozo"} 👋
          </CardBadge>
          <CardTitle className="text-2xl md:text-3xl font-heading font-bold !text-white dark:!text-white tracking-tight h-auto transition-colors">
            Bienvenida a tu espacio personal Conecta MINEDUC
          </CardTitle>
          <CardDescription className="text-sm md:text-base !text-white/90 dark:!text-muted-foreground font-normal transition-colors">
            Accede a tus aplicaciones asignadas, revisa tus accesos recientes y consulta tus métricas personales de uso activo.
          </CardDescription>
        </div>

        <CardDecorativeIcon className="opacity-15 dark:opacity-35 !text-white dark:!text-primary-300 right-4 -bottom-8 pointer-events-none z-0 transition-colors">
          <Network className="size-48 md:size-56 stroke-[1.2]" />
        </CardDecorativeIcon>
      </Card>

      {/* ── Contenedor Principal (Tablero Personal) ── */}
      <div className="bg-surface border border-border shadow-xs rounded-xl p-4 md:p-6 flex flex-col gap-6 w-full">
        {/* Encabezado con título institucional y filtro de periodo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-primary-300">
              Mi dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Resumen de tu actividad y aplicaciones autorizadas en Conecta MINEDUC.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Toggle de Periodo (7, 30, 90 días) */}
            <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => setPeriodo("7")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  periodo === "7"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                7 días
              </button>
              <button
                type="button"
                onClick={() => setPeriodo("30")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  periodo === "30"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                30 días
              </button>
              <button
                type="button"
                onClick={() => setPeriodo("90")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  periodo === "90"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                90 días
              </button>
            </div>

            {renderExportMenu(undefined, "Exportar")}
          </div>
        </div>

        {/* ── 1. Indicadores Principales (4 KpiCards con Diseño Idéntico al Admin) ── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Aplicaciones asignadas"
              value={currentMetrics.aplicacionesAsignadas.total}
              color="primary"
              comparison="4 activas · 2 sedes institucionales"
              icon={<AppWindow />}
            />
            <KpiCard
              label="Accesos realizados"
              value={currentMetrics.accesos.total}
              color="info"
              comparison={`${currentMetrics.accesos.cambio} vs. periodo anterior`}
              icon={<LogIn />}
            />
            <KpiCard
              label="Tiempo de uso activo"
              value={currentMetrics.tiempoUsoActivo.totalHoras}
              color="warning"
              comparison={`${currentMetrics.tiempoUsoActivo.promedioDiario} · Interacción efectiva`}
              icon={<Clock />}
            />
            <KpiCard
              label="Reportes personales"
              value={currentMetrics.reportesPersonales.totalDisponibles}
              color="success-400"
              comparison="Historial de actividad disponible"
              icon={<FileText />}
            />
          </div>
        </section>

        {/* ── 2. Acceso Directo a Mis Aplicaciones ── */}
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge appearance="soft" tone="primary" className="text-[11px] font-semibold">
                Acceso Directo SSO
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">4 aplicaciones activas</span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Abre cualquiera de tus aplicaciones institucionales autorizadas
            </h3>
            <p className="text-xs text-muted-foreground">
              Gestión Docente, SIGE Escolar, Talento Humano y Mesa de Ayuda con inicio de sesión único federado.
            </p>
          </div>

          <Link href="/mis-aplicaciones">
            <Button
              type="button"
              variant="primary"
              size="default"
              className="shrink-0 font-semibold shadow-xs"
              rightIcon={<ArrowRight className="size-4" />}
            >
              Abrir Mis aplicaciones
            </Button>
          </Link>
        </div>

        {/* ── 3. Dos Gráficos Principales (Diseño Visual Idéntico a los Gráficos de Admin) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3.1 Gráfico: Accesos por fecha (Curva SVG interactiva) */}
          <Card variant="panel" className="flex flex-col h-full border border-border shadow-2xs">
            <CardHeader className="items-start text-left gap-1 p-6 pb-3 border-b border-border/50 min-h-[76px] flex flex-col justify-center">
              <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                Accesos por fecha
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground line-clamp-1">
                Frecuencia de inicios de sesión en los últimos {periodo} días.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center p-6 flex-1 min-h-[260px]">
              <div className="w-full max-w-[340px] flex flex-col justify-center">
                <div className="flex items-start justify-between gap-3 mb-4 px-1">
                  <div className="flex flex-col">
                    <div className="text-2xl font-heading font-bold text-foreground leading-none">
                      {currentMetrics.accesos.total}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1">
                      Ingresos registrados
                    </p>
                    <div className="text-[11px] text-success font-semibold mt-1.5 flex items-center gap-1">
                      <TrendingUp className="size-3" /> {currentMetrics.accesos.cambio} vs. periodo anterior
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-2xl font-heading font-bold text-foreground leading-none">
                      100 %
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1">
                      Ingresos exitosos
                    </p>
                  </div>
                </div>

                {/* Gráfico de Línea con Curva SVG y Crosshair */}
                <ChartContainer minHeight={130} className="relative flex flex-col justify-end pt-1 w-full">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-1 bottom-6 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                      <span>{maxAccessVal}</span>
                    </div>
                    <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                      <span>{Math.round(maxAccessVal / 2)}</span>
                    </div>
                    <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                      <span>0</span>
                    </div>
                  </div>

                  {/* Curva SVG */}
                  <div className="relative w-full h-24">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 280 90" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="userAccessFillGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {lineAreaData && <path d={lineAreaData} fill="url(#userAccessFillGradient)" />}

                      {linePathData && (
                        <path
                          d={linePathData}
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Mira vertical (crosshair) */}
                      {hoveredDayIdx !== null && (
                        <line
                          x1={linePoints[hoveredDayIdx].x}
                          y1={0}
                          x2={linePoints[hoveredDayIdx].x}
                          y2={88}
                          stroke="var(--primary)"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          className="opacity-70"
                        />
                      )}

                      {/* Puntos interactivos */}
                      {linePoints.map((p, idx) => {
                        const isHovered = hoveredDayIdx === idx;
                        return (
                          <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? 5 : 3.5}
                            fill={isHovered ? "var(--primary)" : "var(--background)"}
                            stroke="var(--primary)"
                            strokeWidth="2"
                            className="cursor-pointer transition-all duration-150"
                            onMouseEnter={() => setHoveredDayIdx(idx)}
                            onMouseLeave={() => setHoveredDayIdx(null)}
                          />
                        );
                      })}
                    </svg>

                    {/* Tooltip flotante */}
                    {hoveredDayIdx !== null && (
                      <div
                        className="absolute pointer-events-none -translate-x-1/2 z-20"
                        style={{
                          left: `${linePoints[hoveredDayIdx].x}px`,
                          top: `${linePoints[hoveredDayIdx].y - 45}px`,
                        }}
                      >
                        <ChartTooltip active={true} className="px-2.5 py-1.5 shadow-md">
                          <ChartTooltipContent
                            title={linePoints[hoveredDayIdx].etiqueta}
                            label="Accesos"
                            value={linePoints[hoveredDayIdx].accesos}
                            subvalue={linePoints[hoveredDayIdx].appsPrincipales}
                          />
                        </ChartTooltip>
                      </div>
                    )}
                  </div>

                  {/* Etiquetas del Eje X */}
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold pt-1 px-1">
                    {accessData.map((item, idx) => (
                      <span
                        key={item.fecha}
                        className={cn(
                          "transition-colors",
                          hoveredDayIdx === idx ? "text-primary font-bold" : ""
                        )}
                      >
                        {item.fecha}
                      </span>
                    ))}
                  </div>
                </ChartContainer>
              </div>
            </CardContent>

            <CardFooter className="relative z-10 py-4 px-6 border-t border-border/50 mt-auto flex justify-center items-center w-full">
              <button
                type="button"
                onClick={() => setReportsOpen(true)}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/link outline-none"
              >
                Descargar historial completo de accesos{" "}
                <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
              </button>
            </CardFooter>
          </Card>

          {/* 3.2 Gráfico: Tiempo por aplicación (Barras Horizontales con badges) */}
          <Card variant="panel" className="flex flex-col h-full border border-border shadow-2xs">
            <CardHeader className="items-start text-left gap-4 p-6 pb-3 border-b border-border/50">
              <div className="flex flex-col gap-1 w-full">
                <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                  Tiempo por aplicación
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Distribución de tiempo de uso activo en tus aplicaciones asignadas.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full no-scrollbar">
                {appOptions.map((opt) => (
                  <Badge
                    key={opt}
                    tone={activeAppFilter === opt ? "primary" : "neutral"}
                    appearance={activeAppFilter === opt ? "solid" : "soft"}
                    className={cn(
                      "cursor-pointer whitespace-nowrap shadow-none transition-all duration-300 dark:text-white dark:hover:text-white",
                      activeAppFilter !== opt &&
                        "hover:bg-primary-200 hover:text-primary dark:hover:bg-primary-900/40 border-transparent"
                    )}
                    onClick={() => setActiveAppFilter(opt)}
                  >
                    {opt}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 text-xs font-semibold text-muted-foreground flex items-center gap-1.5 w-full">
                <span className="text-foreground font-bold">{totalHorasStr}</span> tiempo efectivo
                <span className="text-muted-foreground/40">•</span>
                <span className="text-foreground font-bold">{usageData.length}</span> aplicaciones
              </div>
            </CardHeader>

            <CardContent className="flex flex-col p-6 flex-1 min-h-[260px] justify-center">
              <div className="flex flex-col gap-4 w-full">
                {filteredUsageData.map((app, idx) => {
                  const isHovered = hoveredAppId === app.id;
                  const isDimmed = hoveredAppId !== null && !isHovered;
                  const pct = Math.round((app.minutos / totalMinutos) * 100);

                  return (
                    <div
                      key={app.id}
                      className="flex flex-col gap-1.5 w-full relative group"
                      onMouseEnter={() => setHoveredAppId(app.id)}
                      onMouseLeave={() => setHoveredAppId(null)}
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                          <ChartTooltip active={true}>
                            <ChartTooltipContent
                              title={app.nombre}
                              label="Tiempo activo"
                              value={app.horas}
                              indicatorColor="var(--primary)"
                              subvalue={`${pct}% del tiempo total de uso`}
                            />
                          </ChartTooltip>
                        </div>
                      )}

                      <div className={cn("flex justify-between items-end", isDimmed && "opacity-50 transition-opacity")}>
                        <span className="text-[13px] font-semibold text-foreground truncate pr-2">
                          {app.nombre}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-foreground">{app.horas}</span>
                          <span className="text-[11px] font-semibold text-muted-foreground w-8 text-right">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isDimmed ? "bg-primary/30" : "bg-primary",
                            idx === 0 && !isDimmed
                              ? "bg-primary"
                              : idx === 1 && !isDimmed
                              ? "bg-primary/80"
                              : idx === 2 && !isDimmed
                              ? "bg-primary/60"
                              : !isDimmed
                              ? "bg-primary/40"
                              : ""
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            <CardFooter className="relative z-10 py-4 px-6 border-t border-border/50 mt-auto flex justify-center items-center w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/link outline-none p-0 h-auto hover:bg-transparent">
                    Ver detalle por aplicación{" "}
                    <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] gap-0 p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                    <DialogTitle className="text-xl font-heading text-primary">
                      Tiempo de uso por aplicación
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Detalle de tiempo activo registrado en tus aplicaciones asignadas.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-muted/40 border-b border-border/50 sticky top-0 backdrop-blur-md">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider col-span-2">
                        Aplicación
                      </span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                        Tiempo
                      </span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                        Porcentaje
                      </span>
                    </div>

                    <div className="flex flex-col divide-y divide-border/40">
                      {usageData.map((app) => (
                        <div
                          key={app.id}
                          className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-muted/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 col-span-2 min-w-0">
                            <div
                              className="size-2 rounded-full shrink-0"
                              style={{ backgroundColor: app.color }}
                            />
                            <span className="text-sm font-bold text-foreground truncate">
                              {app.nombre}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground text-center tabular-nums">
                            {app.horas}
                          </span>
                          <div className="text-right">
                            <Badge appearance="soft" tone="primary" size="sm">
                              {app.porcentaje}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="p-4 border-t border-border/50 bg-muted/10 flex justify-end">
                    <DialogClose asChild>
                      <Button variant="neutral" size="sm">
                        Cerrar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        {/* ── 4. Actividad Reciente del Usuario (Estilo de Tabla del Admin) ── */}
        <Card variant="panel" className="flex flex-col h-full border border-border shadow-2xs">
          <CardHeader className="items-start text-left gap-4 p-6 pb-3 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                  Mi actividad reciente
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Historial cronológico de ingresos y acciones registradas en tu cuenta personal.
                </CardDescription>
              </div>

              <Badge appearance="outline" tone="neutral" className="text-xs font-mono self-start sm:self-auto">
                {filteredActivities.length} eventos registrados
              </Badge>
            </div>

            {/* Buscador interno, filtro por aplicación y exportar reporte */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 w-full">
              {/* Buscador compacto del UI Kit */}
              <div className="w-full sm:w-64 md:w-72 shrink-0">
                <Search
                  value={searchActivityQuery}
                  onChange={(e) => setSearchActivityQuery(e.target.value)}
                  onClear={() => setSearchActivityQuery("")}
                  placeholder="Buscar en actividad..."
                  size="sm"
                  className="w-full text-xs"
                />
              </div>

              {/* Filtro por aplicación con Combobox UI Kit */}
              <div className="w-full sm:w-56 md:w-60 shrink-0">
                <Combobox
                  value={activityAppFilter === "todas" ? "Todas las aplicaciones" : activityAppFilter}
                  onValueChange={(val) => {
                    if (val) {
                      setActivityAppFilter(val === "Todas las aplicaciones" ? "todas" : val);
                    }
                  }}
                >
                  <ComboboxInput
                    placeholder="Todas las aplicaciones"
                    showClear={false}
                    showSearchIcon={false}
                    size="sm"
                    className="w-full text-xs"
                  />
                  <ComboboxContent className="min-w-full">
                    <ComboboxList>
                      <ComboboxItem value="Todas las aplicaciones">Todas las aplicaciones</ComboboxItem>
                      {activityOptions.map((app) => (
                        <ComboboxItem key={app} value={app}>
                          {app}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Botón Descargar reporte al lado */}
              <div className="shrink-0">
                {renderExportMenu("sm", "Descargar reporte")}
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pb-2 pt-0">
            {/* Desktop Table View (lg y superior) */}
            <div className="hidden lg:block overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-3.5 px-4">Fecha y Hora</TableHead>
                    <TableHead className="py-3.5 px-4">Aplicación</TableHead>
                    <TableHead className="py-3.5 px-4">Acción realizada</TableHead>
                    <TableHead className="py-3.5 px-4">Sede / Rol</TableHead>
                    <TableHead className="py-3.5 px-4">Dispositivo / IP</TableHead>
                    <TableHead className="py-3.5 px-4 text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No se encontraron registros de actividad con los criterios aplicados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivities.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="py-3 px-4 font-mono text-xs text-foreground whitespace-nowrap">
                          {item.fechaHora}
                        </TableCell>
                        <TableCell className="py-3 px-4 whitespace-nowrap font-semibold text-foreground">
                          {item.aplicacion}
                        </TableCell>
                        <TableCell className="py-3 px-4 max-w-xs text-foreground/90 text-xs">
                          {item.accion}
                        </TableCell>
                        <TableCell className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                              <Building2 className="size-3.5 text-primary shrink-0" />
                              {item.sede}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Shield className="size-3.5 text-secondary-600 dark:text-secondary-400 shrink-0" />
                              {item.rol}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                          <div className="flex flex-col font-mono text-xs gap-0.5">
                            <span className="flex items-center gap-1.5 text-foreground/90 font-sans">
                              <Laptop className="size-3.5 text-muted-foreground shrink-0" />
                              {item.dispositivo}
                            </span>
                            <span className="text-[11px] text-muted-foreground">IP: {item.ip}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right whitespace-nowrap">
                          <Badge
                            appearance="soft"
                            tone={item.estado === "Exitoso" ? "success" : "warning"}
                            className="text-[11px] gap-1 inline-flex"
                          >
                            {item.estado === "Exitoso" ? (
                              <CheckCircle2 className="size-3 text-success shrink-0" />
                            ) : (
                              <AlertCircle className="size-3 text-warning shrink-0" />
                            )}
                            {item.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Row (Responsive: pantallas < lg) */}
            <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-1 pb-3">
              {filteredActivities.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground border border-border rounded-xl bg-surface">
                  No se encontraron registros de actividad con los criterios aplicados.
                </div>
              ) : (
                filteredActivities.map((item) => (
                  <InteractiveCard
                    key={item.id}
                    className="flex flex-col gap-3 text-left"
                    color="default"
                    hideChevron
                  >
                    {/* Header: Aplicación y Estado */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-foreground truncate">{item.aplicacion}</span>
                        <span className="font-mono text-xs text-muted-foreground">{item.fechaHora}</span>
                      </div>
                      <Badge
                        appearance="soft"
                        tone={item.estado === "Exitoso" ? "success" : "warning"}
                        className="text-[11px] gap-1 shrink-0 px-2 py-0.5"
                      >
                        {item.estado === "Exitoso" ? (
                          <CheckCircle2 className="size-3 text-success shrink-0" />
                        ) : (
                          <AlertCircle className="size-3 text-warning shrink-0" />
                        )}
                        {item.estado}
                      </Badge>
                    </div>

                    {/* Acción realizada */}
                    <div className="text-xs text-foreground/90 leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/40">
                      <span className="font-medium text-foreground">{item.accion}</span>
                    </div>

                    {/* Sede y Rol */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Building2 className="size-3 text-primary shrink-0" />
                          Sede
                        </span>
                        <span className="text-foreground font-medium truncate" title={item.sede}>
                          {item.sede}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Shield className="size-3 text-secondary-600 dark:text-secondary-400 shrink-0" />
                          Rol
                        </span>
                        <span className="text-foreground font-medium truncate" title={item.rol}>
                          {item.rol}
                        </span>
                      </div>
                    </div>

                    {/* Dispositivo e IP */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5 min-w-0 truncate">
                        <Laptop className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{item.dispositivo}</span>
                      </span>
                      <span className="font-mono shrink-0">IP: {item.ip}</span>
                    </div>
                  </InteractiveCard>
                ))
              )}
            </div>
          </CardContent>

          <CardFooter className="relative z-10 py-3.5 px-6 border-t border-border/50 mt-auto flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              Mostrando eventos correspondientes a tu usuario institucional ({user?.email || "usuario@conecta.com"}).
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* ── Modal de Exportación de Reportes Personales ── */}
      <PersonalReportsDialog open={reportsOpen} onOpenChange={setReportsOpen} />
    </div>
  );
}
