"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/routing";
import {
  AuditSummaryCards,
  AuditSummaryCardItem,
} from "../components/audit-summary-cards";
import {
  AuditFilters,
  FilterSelectConfig,
  ActiveChipItem,
} from "../components/audit-filters";
import { LogsTable } from "../components/audit-table";
import { DynamicChartPanel } from "../components/dynamic-chart-panel";
import { AuditDetailDialog } from "../components/audit-detail-dialog";
import {
  mockLogsGestion,
  LogGestionItem,
  TipoAccionLog,
  TipoElementoLog,
  EstadoLog,
} from "../data/logs.mock";
import {
  FileText,
  Users,
  KeyRound,
  AlertTriangle,
  History,
  ShieldCheck,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

export function LogsGestionView() {
  const [logs] = React.useState<LogGestionItem[]>(mockLogsGestion);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAccion, setSelectedAccion] = React.useState("Todas");
  const [selectedElemento, setSelectedElemento] = React.useState("Todos");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedResultado, setSelectedResultado] = React.useState("Todos");
  const [selectedResponsable, setSelectedResponsable] = React.useState("Todos");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedKpiFilter, setSelectedKpiFilter] = React.useState<string | null>(null);

  // Selección de fila para análisis interactivo
  const [selectedLog, setSelectedLog] = React.useState<LogGestionItem | null>(null);

  // Modal de Detalle
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [logInDetail, setLogInDetail] = React.useState<LogGestionItem | null>(null);

  // 1. Filtrado de datos
  const filteredLogs = React.useMemo(() => {
    return logs.filter((item) => {
      // Filtro KPI Card
      if (selectedKpiFilter === "usuarios" && item.tipoElemento !== "Usuario") {
        return false;
      }
      if (
        selectedKpiFilter === "accesos" &&
        item.tipoElemento !== "Rol" &&
        item.tipoElemento !== "Permiso"
      ) {
        return false;
      }
      if (selectedKpiFilter === "revision" && item.estado !== "Requiere revisión") {
        return false;
      }

      // Filtro de Búsqueda (usuario o elemento)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchResp = item.responsable.nombre.toLowerCase().includes(q);
        const matchElem = item.elementoNombre.toLowerCase().includes(q);
        const matchDet = item.detalleBreve.toLowerCase().includes(q);
        const matchApp = item.aplicacion.toLowerCase().includes(q);
        if (!matchResp && !matchElem && !matchDet && !matchApp) return false;
      }

      // Tipo de Acción
      if (selectedAccion !== "Todas" && item.accion !== selectedAccion) {
        return false;
      }

      // Tipo de Elemento
      if (selectedElemento !== "Todos" && item.tipoElemento !== selectedElemento) {
        return false;
      }

      // Aplicación
      if (selectedApp !== "Todas" && item.aplicacion !== selectedApp) {
        return false;
      }

      // Resultado
      if (selectedResultado !== "Todos" && item.estado !== selectedResultado) {
        return false;
      }

      // Responsable
      if (selectedResponsable !== "Todos" && item.responsable.nombre !== selectedResponsable) {
        return false;
      }

      return true;
    });
  }, [logs, selectedKpiFilter, searchTerm, selectedAccion, selectedElemento, selectedApp, selectedResultado, selectedResponsable]);

  // Si el log seleccionado ya no está en los filtrados, se limpia la selección de fila
  React.useEffect(() => {
    if (selectedLog && !filteredLogs.some((l) => l.id === selectedLog.id)) {
      setSelectedLog(null);
    }
  }, [filteredLogs, selectedLog]);

  // 2. Métricas KPI Cards Superiores (Máximo 4)
  const totalCount = logs.length;
  const userChangesCount = React.useMemo(
    () => logs.filter((l) => l.tipoElemento === "Usuario").length,
    [logs]
  );
  const accessChangesCount = React.useMemo(
    () => logs.filter((l) => l.tipoElemento === "Rol" || l.tipoElemento === "Permiso").length,
    [logs]
  );
  const revisionCount = React.useMemo(
    () => logs.filter((l) => l.estado === "Requiere revisión").length,
    [logs]
  );

  const kpiCards: AuditSummaryCardItem[] = [
    {
      id: "total",
      label: "Eventos registrados",
      value: totalCount,
      icon: FileText,
      color: "primary",
      subtitle: "Total de cambios administrativos",
      isActive: selectedKpiFilter === "total",
    },
    {
      id: "usuarios",
      label: "Cambios de usuarios",
      value: userChangesCount,
      icon: Users,
      color: "info",
      subtitle: "Altas, bajas y credenciales",
      isActive: selectedKpiFilter === "usuarios",
    },
    {
      id: "accesos",
      label: "Cambios de accesos",
      value: accessChangesCount,
      icon: KeyRound,
      color: "success",
      subtitle: "Roles y permisos asignados",
      isActive: selectedKpiFilter === "accesos",
    },
    {
      id: "revision",
      label: "Requieren revisión",
      value: revisionCount,
      icon: AlertTriangle,
      color: "warning",
      subtitle: "Eventos con alerta de política",
      isActive: selectedKpiFilter === "revision",
    },
  ];

  const handleSelectKpiCard = (id: string) => {
    if (selectedKpiFilter === id) {
      setSelectedKpiFilter(null);
    } else {
      setSelectedKpiFilter(id);
    }
  };

  // 3. Dropdowns para AuditFilters
  const selectFilterConfigs: FilterSelectConfig[] = [
    {
      id: "accion",
      label: "Tipo de acción",
      value: selectedAccion,
      options: [
        { label: "Todas las acciones", value: "Todas" },
        { label: "Creación", value: "Creación" },
        { label: "Modificación", value: "Modificación" },
        { label: "Eliminación", value: "Eliminación" },
        { label: "Asignación de rol", value: "Asignación de rol" },
        { label: "Revocación de rol", value: "Revocación de rol" },
        { label: "Cambio de estado", value: "Cambio de estado" },
        { label: "Reinicio de contraseña", value: "Reinicio de contraseña" },
        { label: "Asignación de recurso", value: "Asignación de recurso" },
      ],
      onChange: setSelectedAccion,
      width: "180px",
    },
    {
      id: "elemento",
      label: "Tipo de elemento",
      value: selectedElemento,
      options: [
        { label: "Todos los elementos", value: "Todos" },
        { label: "Usuario", value: "Usuario" },
        { label: "Aplicación", value: "Aplicación" },
        { label: "Rol", value: "Rol" },
        { label: "Recurso", value: "Recurso" },
        { label: "Permiso", value: "Permiso" },
      ],
      onChange: setSelectedElemento,
      width: "160px",
    },
    {
      id: "aplicacion",
      label: "Aplicación",
      value: selectedApp,
      options: [
        { label: "Todas las apps", value: "Todas" },
        { label: "Gestión Docente", value: "Gestión Docente" },
        { label: "Talento Humano", value: "Talento Humano" },
        { label: "SIGE", value: "SIGE" },
        { label: "SSO Conecta", value: "SSO Conecta" },
        { label: "Geoportal", value: "Geoportal" },
      ],
      onChange: setSelectedApp,
      width: "170px",
    },
    {
      id: "resultado",
      label: "Resultado",
      value: selectedResultado,
      options: [
        { label: "Todos los resultados", value: "Todos" },
        { label: "Exitoso", value: "Exitoso" },
        { label: "Fallido", value: "Fallido" },
        { label: "Requiere revisión", value: "Requiere revisión" },
      ],
      onChange: setSelectedResultado,
      width: "170px",
    },
    {
      id: "responsable",
      label: "Responsable",
      value: selectedResponsable,
      options: [
        { label: "Todos los responsables", value: "Todos" },
        // This should theoretically be dynamic based on the logs, but for mock, hardcode a few
        { label: "Carlos Xavier Andrade", value: "Carlos Xavier Andrade" },
        { label: "Estefanía Patricia Morales", value: "Estefanía Patricia Morales" },
        { label: "Diana Marisol Vega", value: "Diana Marisol Vega" },
      ],
      onChange: setSelectedResponsable,
      width: "200px",
    },
  ];

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedAccion !== "Todas" ||
    selectedElemento !== "Todos" ||
    selectedApp !== "Todas" ||
    selectedResultado !== "Todos" ||
    selectedResponsable !== "Todos" ||
    selectedKpiFilter !== null ||
    dateRange !== undefined;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedAccion("Todas");
    setSelectedElemento("Todos");
    setSelectedApp("Todas");
    setSelectedResultado("Todos");
    setSelectedResponsable("Todos");
    setSelectedKpiFilter(null);
    setDateRange(undefined);
    setSelectedLog(null);
  };

  const activeChips: ActiveChipItem[] = [];
  if (searchTerm) {
    activeChips.push({
      id: "search",
      label: `Búsqueda: "${searchTerm}"`,
      onRemove: () => setSearchTerm(""),
    });
  }
  if (selectedAccion !== "Todas") {
    activeChips.push({
      id: "accion",
      label: `Acción: ${selectedAccion}`,
      onRemove: () => setSelectedAccion("Todas"),
    });
  }
  if (selectedElemento !== "Todos") {
    activeChips.push({
      id: "elemento",
      label: `Elemento: ${selectedElemento}`,
      onRemove: () => setSelectedElemento("Todos"),
    });
  }
  if (selectedApp !== "Todas") {
    activeChips.push({
      id: "app",
      label: `App: ${selectedApp}`,
      onRemove: () => setSelectedApp("Todas"),
    });
  }
  if (selectedResultado !== "Todos") {
    activeChips.push({
      id: "resultado",
      label: `Resultado: ${selectedResultado}`,
      onRemove: () => setSelectedResultado("Todos"),
    });
  }
  if (selectedResponsable !== "Todos") {
    activeChips.push({
      id: "responsable",
      label: `Responsable: ${selectedResponsable}`,
      onRemove: () => setSelectedResponsable("Todos"),
    });
  }
  if (selectedKpiFilter) {
    activeChips.push({
      id: "kpi",
      label: `Filtro KPI: ${selectedKpiFilter}`,
      onRemove: () => setSelectedKpiFilter(null),
    });
  }

  // 4. Lógica de Gráficos Dinámicos de la Derecha
  // Responden a los filtros Y al log seleccionado
  const dynamicContext = React.useMemo(() => {
    if (selectedLog) {
      return {
        title: selectedLog.elementoNombre,
        subtitle: `Evento ${selectedLog.codigoEvento} • ${selectedLog.accion} en ${selectedLog.aplicacion}`,
        hasSelection: true,
      };
    }
    if (selectedApp !== "Todas") {
      return {
        title: selectedApp,
        subtitle: `Filtrando cambios realizados sobre ${selectedApp}`,
        hasSelection: true,
      };
    }
    if (selectedElemento !== "Todos") {
      return {
        title: `Elementos: ${selectedElemento}`,
        subtitle: `Analizando únicamente registros de tipo ${selectedElemento}`,
        hasSelection: true,
      };
    }
    return {
      title: "Todos los eventos",
      subtitle: "Vista general de cambios administrativos del sistema",
      hasSelection: false,
    };
  }, [selectedLog, selectedApp, selectedElemento]);

  // Donut: Distribución de acciones en el dataset filtrado
  const donutData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const dataset = selectedLog ? [selectedLog] : filteredLogs;

    dataset.forEach((item) => {
      counts[item.accion] = (counts[item.accion] || 0) + 1;
    });

    const total = dataset.length || 1;
    const colors = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];

    const items = Object.entries(counts).map(([label, val], idx) => ({
      id: label,
      label,
      value: val,
      pct: Math.round((val / total) * 100),
      color: colors[idx % colors.length],
    }));

    return {
      title: "Eventos por tipo de acción",
      items,
    };
  }, [filteredLogs, selectedLog]);

  // Barras horizontales: Elementos más modificados o aplicaciones
  const barsData = React.useMemo(() => {
    const dataset = selectedLog ? [selectedLog] : filteredLogs;
    const counts: Record<string, number> = {};

    dataset.forEach((item) => {
      const key = `${item.tipoElemento}: ${item.elementoNombre}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = dataset.length || 1;
    const items = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, val]) => ({
        id: label,
        label,
        value: val,
        pct: Math.round((val / total) * 100),
        color: "var(--color-primary)",
      }));

    return {
      title: "Elementos con mayor frecuencia",
      items,
      valueSuffix: "cambios",
    };
  }, [filteredLogs, selectedLog]);

  // Trend temporal de eventos
  const trendData = React.useMemo(() => {
    return {
      title: "Evolución de eventos en el periodo",
      unit: "Cambios",
      points: [
        { label: "01/10", value: 2 },
        { label: "02/10", value: 3 },
        { label: "03/10", value: 2 },
        { label: "04/10", value: 4 },
        { label: "05/10", value: 6 },
        { label: "06/10", value: filteredLogs.length },
      ],
    };
  }, [filteredLogs.length]);

  return (
    <div className="flex flex-col gap-5 w-full h-full pb-6">


      {/* Contenedor Principal */}
      <div className="border border-border rounded-xl bg-surface p-5 sm:p-6 shadow-sm flex flex-col gap-6">
        {/* Cabecera de Título y Descripción */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-white">
              Logs de gestión
            </h1>
            <Badge tone="warning" appearance="soft" size="sm">Mockup en desarrollo</Badge>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            Consulta los cambios realizados sobre usuarios, aplicaciones, roles y accesos del sistema.
          </p>
        </div>

        {/* Resumen superior: 4 Cards KPI */}
        <AuditSummaryCards
          cards={kpiCards}
          activeId={selectedKpiFilter}
          onSelectCard={handleSelectKpiCard}
        />

        <Separator />

        <AuditFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar usuario o elemento afectado..."
          selectFilters={selectFilterConfigs}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
          activeChips={activeChips}
        />

        {/* Layout Principal: Izquierda 65% / Derecha 35% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* IZQUIERDA (~65% / col-span-8): Consulta de Eventos */}
          <div className="lg:col-span-8 flex flex-col gap-5 w-full">

            {/* Tabla de Logs */}
            <LogsTable
              logs={filteredLogs}
              selectedId={selectedLog?.id}
              onSelectRow={(log) => {
                if (selectedLog?.id === log.id) {
                  setSelectedLog(null);
                } else {
                  setSelectedLog(log);
                }
              }}
              onViewDetail={(log) => {
                setLogInDetail(log);
                setDetailModalOpen(true);
              }}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* DERECHA (~35% / col-span-4): Análisis Dinámico */}
          <div className="lg:col-span-4 w-full sticky top-4">
            <DynamicChartPanel
              title="Análisis Dinámico"
              contextTitle={dynamicContext.title}
              contextSubtitle={dynamicContext.subtitle}
              hasSelection={dynamicContext.hasSelection}
              onClearSelection={() => setSelectedLog(null)}
              donutData={donutData}
              barsData={barsData}
              trendData={trendData}
              extraStat={
                selectedLog
                  ? {
                      label: "Código de evento",
                      value: selectedLog.codigoEvento,
                      subtext: `Responsable: ${selectedLog.responsable.nombre}`,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Modal Dialog XL de Detalle */}
      <AuditDetailDialog
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        logItem={logInDetail}
      />
    </div>
  );
}
