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
import { AccesosTable } from "../components/audit-table";
import { DynamicChartPanel } from "../components/dynamic-chart-panel";
import { AuditDetailDialog } from "../components/audit-detail-dialog";
import {
  mockAccesosAplicaciones,
  AccesoAplicacionItem,
  ResultadoIngreso,
} from "../data/accesos.mock";
import {
  LogIn,
  CheckCircle2,
  XCircle,
  Users,
  ShieldAlert,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

export function IngresosAplicacionesView() {
  const [accesos] = React.useState<AccesoAplicacionItem[]>(mockAccesosAplicaciones);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedRol, setSelectedRol] = React.useState("Todos");
  const [selectedSede, setSelectedSede] = React.useState("Todas");
  const [selectedResultado, setSelectedResultado] = React.useState("Todos");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedKpiFilter, setSelectedKpiFilter] = React.useState<string | null>(null);

  // Selección de fila interactiva
  const [selectedAcceso, setSelectedAcceso] = React.useState<AccesoAplicacionItem | null>(null);

  // Modal de Detalle
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [accesoInDetail, setAccesoInDetail] = React.useState<AccesoAplicacionItem | null>(null);

  // 1. Filtrado de datos
  const filteredAccesos = React.useMemo(() => {
    return accesos.filter((item) => {
      // Filtro KPI Card
      if (selectedKpiFilter === "exitosos" && item.resultado !== "Exitoso") {
        return false;
      }
      if (
        selectedKpiFilter === "fallidos" &&
        item.resultado !== "Fallido" &&
        item.resultado !== "Bloqueado"
      ) {
        return false;
      }

      // Buscar usuario (nombre, correo o cédula)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = item.usuario.nombre.toLowerCase().includes(q);
        const matchMail = item.usuario.email.toLowerCase().includes(q);
        const matchCed = item.usuario.cedula.includes(q);
        if (!matchName && !matchMail && !matchCed) return false;
      }

      // Aplicación
      if (selectedApp !== "Todas" && item.aplicacion !== selectedApp) {
        return false;
      }

      // Rol
      if (selectedRol !== "Todos" && item.rol !== selectedRol) {
        return false;
      }

      // Sede
      if (selectedSede !== "Todas" && item.sede !== selectedSede) {
        return false;
      }

      // Resultado
      if (selectedResultado !== "Todos" && item.resultado !== selectedResultado) {
        return false;
      }

      return true;
    });
  }, [
    accesos,
    selectedKpiFilter,
    searchTerm,
    selectedApp,
    selectedRol,
    selectedSede,
    selectedResultado,
  ]);

  React.useEffect(() => {
    if (selectedAcceso && !filteredAccesos.some((a) => a.id === selectedAcceso.id)) {
      setSelectedAcceso(null);
    }
  }, [filteredAccesos, selectedAcceso]);

  // 2. Resumen Superior (Máximo 4 Cards)
  const totalCount = accesos.length;
  const exitososCount = React.useMemo(
    () => accesos.filter((a) => a.resultado === "Exitoso").length,
    [accesos]
  );
  const noCompletadosCount = React.useMemo(
    () => accesos.filter((a) => a.resultado === "Fallido" || a.resultado === "Bloqueado").length,
    [accesos]
  );
  const usuariosActivosCount = React.useMemo(() => {
    const set = new Set(accesos.map((a) => a.usuario.id));
    return set.size;
  }, [accesos]);

  const kpiCards: AuditSummaryCardItem[] = [
    {
      id: "total",
      label: "Ingresos registrados",
      value: totalCount,
      icon: LogIn,
      color: "primary",
      subtitle: "Total de intentos de acceso",
      isActive: selectedKpiFilter === "total",
    },
    {
      id: "exitosos",
      label: "Ingresos exitosos",
      value: exitososCount,
      icon: CheckCircle2,
      color: "success",
      subtitle: "Sesiones autenticadas OK",
      isActive: selectedKpiFilter === "exitosos",
    },
    {
      id: "fallidos",
      label: "Ingresos no completados",
      value: noCompletadosCount,
      icon: XCircle,
      color: "danger",
      subtitle: "Fallos o bloqueos de acceso",
      isActive: selectedKpiFilter === "fallidos",
    },
    {
      id: "usuarios",
      label: "Usuarios con actividad",
      value: usuariosActivosCount,
      icon: Users,
      color: "info",
      subtitle: "Personas únicas conectadas",
      isActive: selectedKpiFilter === "usuarios",
    },
  ];

  const handleSelectKpiCard = (id: string) => {
    if (selectedKpiFilter === id) {
      setSelectedKpiFilter(null);
    } else {
      setSelectedKpiFilter(id);
    }
  };

  // 3. Dropdowns de Filtro
  const selectFilterConfigs: FilterSelectConfig[] = [
    {
      id: "app",
      label: "Aplicación",
      value: selectedApp,
      options: [
        { label: "Todas las aplicaciones", value: "Todas" },
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
      id: "rol",
      label: "Rol",
      value: selectedRol,
      options: [
        { label: "Todos los roles", value: "Todos" },
        { label: "Docente Titular", value: "Docente Titular" },
        { label: "Administrador General", value: "Administrador General" },
        { label: "Operador de Distrito", value: "Operador de Distrito" },
        { label: "Analista de Nómina", value: "Analista de Nómina" },
        { label: "Administradora Zonal", value: "Administradora Zonal" },
        { label: "Rector de Unidad Educativa", value: "Rector de Unidad Educativa" },
        { label: "Docente", value: "Docente" },
      ],
      onChange: setSelectedRol,
      width: "170px",
    },
    {
      id: "sede",
      label: "Sede",
      value: selectedSede,
      options: [
        { label: "Todas las sedes", value: "Todas" },
        { label: "Planta Central", value: "Planta Central" },
        { label: "Coordinación Zonal 9", value: "Coordinación Zonal 9" },
        { label: "Coordinación Zonal 8", value: "Coordinación Zonal 8" },
        { label: "Coordinación Zonal 6", value: "Coordinación Zonal 6" },
        { label: "Distrito 09D03", value: "Distrito 09D03" },
        { label: "Distrito 17D01", value: "Distrito 17D01" },
        { label: "Distrito 11D01", value: "Distrito 11D01" },
      ],
      onChange: setSelectedSede,
      width: "160px",
    },
    {
      id: "resultado",
      label: "Resultado",
      value: selectedResultado,
      options: [
        { label: "Todos los resultados", value: "Todos" },
        { label: "Exitoso", value: "Exitoso" },
        { label: "Fallido", value: "Fallido" },
        { label: "Bloqueado", value: "Bloqueado" },
      ],
      onChange: setSelectedResultado,
      width: "150px",
    },
  ];

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedApp !== "Todas" ||
    selectedRol !== "Todos" ||
    selectedSede !== "Todas" ||
    selectedResultado !== "Todos" ||
    selectedKpiFilter !== null ||
    dateRange !== undefined;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedApp("Todas");
    setSelectedRol("Todos");
    setSelectedSede("Todas");
    setSelectedResultado("Todos");
    setSelectedKpiFilter(null);
    setDateRange(undefined);
    setSelectedAcceso(null);
  };

  const activeChips: ActiveChipItem[] = [];
  if (searchTerm) {
    activeChips.push({
      id: "search",
      label: `Usuario: "${searchTerm}"`,
      onRemove: () => setSearchTerm(""),
    });
  }
  if (selectedApp !== "Todas") {
    activeChips.push({
      id: "app",
      label: `App: ${selectedApp}`,
      onRemove: () => setSelectedApp("Todas"),
    });
  }
  if (selectedRol !== "Todos") {
    activeChips.push({
      id: "rol",
      label: `Rol: ${selectedRol}`,
      onRemove: () => setSelectedRol("Todos"),
    });
  }
  if (selectedSede !== "Todas") {
    activeChips.push({
      id: "sede",
      label: `Sede: ${selectedSede}`,
      onRemove: () => setSelectedSede("Todas"),
    });
  }
  if (selectedResultado !== "Todos") {
    activeChips.push({
      id: "resultado",
      label: `Resultado: ${selectedResultado}`,
      onRemove: () => setSelectedResultado("Todos"),
    });
  }
  if (selectedKpiFilter) {
    activeChips.push({
      id: "kpi",
      label: `Filtro KPI: ${selectedKpiFilter}`,
      onRemove: () => setSelectedKpiFilter(null),
    });
  }

  // 4. Panel Dinámico de la Derecha
  const dynamicContext = React.useMemo(() => {
    if (selectedAcceso) {
      return {
        title: selectedAcceso.usuario.nombre,
        subtitle: `Analizando accesos de ${selectedAcceso.usuario.nombre} (${selectedAcceso.usuario.email})`,
        hasSelection: true,
      };
    }
    if (selectedApp !== "Todas") {
      return {
        title: selectedApp,
        subtitle: `Trazabilidad de accesos dirigidos a ${selectedApp}`,
        hasSelection: true,
      };
    }
    return {
      title: "Todas las aplicaciones",
      subtitle: "Consolidado de eventos de autenticación SSO",
      hasSelection: false,
    };
  }, [selectedAcceso, selectedApp]);

  // Donut: Resultado de ingresos
  const donutData = React.useMemo(() => {
    const dataset = selectedAcceso
      ? accesos.filter((a) => a.usuario.id === selectedAcceso.usuario.id)
      : filteredAccesos;

    const exitosos = dataset.filter((a) => a.resultado === "Exitoso").length;
    const fallidos = dataset.filter((a) => a.resultado === "Fallido").length;
    const bloqueados = dataset.filter((a) => a.resultado === "Bloqueado").length;
    const total = dataset.length || 1;

    const items = [
      {
        id: "exitoso",
        label: "Exitosos",
        value: exitosos,
        pct: Math.round((exitosos / total) * 100),
        color: "var(--color-success)",
      },
      {
        id: "fallido",
        label: "Fallidos",
        value: fallidos,
        pct: Math.round((fallidos / total) * 100),
        color: "var(--color-warning)",
      },
      {
        id: "bloqueado",
        label: "Bloqueados",
        value: bloqueados,
        pct: Math.round((bloqueados / total) * 100),
        color: "var(--color-danger)",
      },
    ].filter((i) => i.value > 0);

    return {
      title: "Resultado de los ingresos",
      items,
    };
  }, [filteredAccesos, selectedAcceso, accesos]);

  // Barras horizontales: Ingresos por aplicación
  const barsData = React.useMemo(() => {
    const dataset = selectedAcceso
      ? accesos.filter((a) => a.usuario.id === selectedAcceso.usuario.id)
      : filteredAccesos;

    const counts: Record<string, number> = {};
    dataset.forEach((a) => {
      counts[a.aplicacion] = (counts[a.aplicacion] || 0) + 1;
    });

    const total = dataset.length || 1;
    const items = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, val]) => ({
        id: label,
        label,
        value: val,
        pct: Math.round((val / total) * 100),
        color: "var(--color-primary)",
      }));

    return {
      title: selectedAcceso ? "Aplicaciones del usuario" : "Ingresos por aplicación",
      items,
      valueSuffix: "ingresos",
    };
  }, [filteredAccesos, selectedAcceso, accesos]);

  // Evolución temporal
  const trendData = React.useMemo(() => {
    return {
      title: "Evolución de ingresos durante el periodo",
      unit: "Accesos",
      points: [
        { label: "09:00", value: 3 },
        { label: "11:00", value: 5 },
        { label: "13:00", value: 4 },
        { label: "14:00", value: 8 },
        { label: "15:00", value: 6 },
        { label: "16:00", value: 2 },
      ],
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full h-full pb-6">
      {/* 1. BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/auditoria/logs-gestion">Auditoría y trazabilidad</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ingresos a aplicaciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Contenedor Principal */}
      <div className="border border-border rounded-xl bg-surface p-5 sm:p-6 shadow-sm flex flex-col gap-6">
        {/* Cabecera de Título y Descripción */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-white">
              Ingresos a aplicaciones
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            Consulta los accesos realizados por los usuarios a las aplicaciones vinculadas al SSO.
          </p>
        </div>

        {/* Resumen Superior: 4 Cards */}
        <AuditSummaryCards
          cards={kpiCards}
          activeId={selectedKpiFilter}
          onSelectCard={handleSelectKpiCard}
        />

        <Separator />

        {/* Layout Principal: Izquierda 65% / Derecha 35% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* IZQUIERDA (~65%): Tabla y Filtros */}
          <div className="lg:col-span-8 flex flex-col gap-5 w-full">
            <AuditFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar por nombre, correo o cédula..."
              selectFilters={selectFilterConfigs}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              hasActiveFilters={hasActiveFilters}
              onReset={handleResetFilters}
              activeChips={activeChips}
            />

            <AccesosTable
              accesos={filteredAccesos}
              selectedId={selectedAcceso?.id}
              onSelectRow={(acc) => {
                if (selectedAcceso?.id === acc.id) {
                  setSelectedAcceso(null);
                } else {
                  setSelectedAcceso(acc);
                }
              }}
              onViewDetail={(acc) => {
                setAccesoInDetail(acc);
                setDetailModalOpen(true);
              }}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* DERECHA (~35%): Panel Gráfico Dinámico */}
          <div className="lg:col-span-4 w-full sticky top-4">
            <DynamicChartPanel
              title="Análisis Dinámico"
              contextTitle={dynamicContext.title}
              contextSubtitle={dynamicContext.subtitle}
              hasSelection={dynamicContext.hasSelection}
              onClearSelection={() => setSelectedAcceso(null)}
              donutData={donutData}
              barsData={barsData}
              trendData={trendData}
              extraStat={
                selectedAcceso
                  ? {
                      label: "Sesión seleccionada",
                      value: selectedAcceso.codigoAcceso,
                      subtext: `IP: ${selectedAcceso.detalles.ip} • ${selectedAcceso.detalles.navegador}`,
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
        accesoItem={accesoInDetail}
      />
    </div>
  );
}
