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
import { ActividadTable } from "../components/audit-table";
import { DynamicChartPanel } from "../components/dynamic-chart-panel";
import {
  mockActividadUsuarios,
  UsuarioActividadItem,
} from "../data/actividad.mock";
import {
  Users,
  AppWindow,
  Activity,
  UserX,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

export function ActividadUsuariosView() {
  const [actividades] = React.useState<UsuarioActividadItem[]>(mockActividadUsuarios);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedPeriodo, setSelectedPeriodo] = React.useState("ultimos-7");
  const [selectedApp, setSelectedApp] = React.useState("Todas");
  const [selectedRol, setSelectedRol] = React.useState("Todos");
  const [selectedSede, setSelectedSede] = React.useState("Todas");
  const [selectedNivel, setSelectedNivel] = React.useState("Todos");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedKpiFilter, setSelectedKpiFilter] = React.useState<string | null>(null);

  // Selección de usuario (fila de la tabla)
  const [selectedUser, setSelectedUser] = React.useState<UsuarioActividadItem | null>(null);

  // 1. Filtrado de datos
  const filteredActividades = React.useMemo(() => {
    return actividades.filter((item) => {
      // Filtro rápido de KPI
      if (selectedKpiFilter === "activos" && item.nivelActividad === "Sin actividad") {
        return false;
      }
      if (selectedKpiFilter === "inactivos" && item.nivelActividad !== "Sin actividad") {
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

      // Aplicación utilizada
      if (selectedApp !== "Todas") {
        if (!item.aplicacionesUtilizadas.includes(selectedApp)) {
          return false;
        }
      }

      // Rol
      if (selectedRol !== "Todos" && item.rolPrincipal !== selectedRol) {
        return false;
      }

      // Sede
      if (selectedSede !== "Todas" && item.sede !== selectedSede) {
        return false;
      }

      // Nivel de actividad
      if (selectedNivel !== "Todos" && item.nivelActividad !== selectedNivel) {
        return false;
      }

      return true;
    });
  }, [actividades, searchTerm, selectedApp, selectedRol, selectedSede, selectedNivel, selectedKpiFilter]);

  // Si el usuario seleccionado queda fuera por filtros, limpiarlo
  React.useEffect(() => {
    if (selectedUser && !filteredActividades.some((a) => a.usuario.id === selectedUser.usuario.id)) {
      setSelectedUser(null);
    }
  }, [filteredActividades, selectedUser]);

  // 2. Tarjetas Resumen KPI
  const kpiCards: AuditSummaryCardItem[] = React.useMemo(() => {
    const totalUsuarios = actividades.length;
    const activos = actividades.filter((a) => a.nivelActividad !== "Sin actividad").length;
    const inactivos = actividades.filter((a) => a.nivelActividad === "Sin actividad").length;

    // Aplicaciones únicas con uso
    const allApps = new Set<string>();
    actividades.forEach((a) => a.aplicacionesUtilizadas.forEach((app) => allApps.add(app)));
    const appsActivas = allApps.size;

    // Total accesos del periodo
    const totalAccesos = actividades.reduce((acc, curr) => acc + curr.totalAccesos, 0);

    return [
      {
        id: "activos",
        label: "Usuarios con actividad",
        value: activos.toString(),
        icon: Users,
        color: "primary",
        subtitle: `De ${totalUsuarios} usuarios registrados`,
        isActive: selectedKpiFilter === "activos",
      },
      {
        id: "apps",
        label: "Aplicaciones con actividad",
        value: appsActivas.toString(),
        icon: AppWindow,
        color: "neutral",
        subtitle: "Sistemas SSO con sesiones activas",
        isActive: selectedKpiFilter === "apps",
      },
      {
        id: "accesos",
        label: "Total accesos del período",
        value: totalAccesos.toLocaleString("es-EC"),
        icon: Activity,
        color: "success",
        subtitle: "Volumen acumulado analizado",
        isActive: selectedKpiFilter === "accesos",
      },
      {
        id: "inactivos",
        label: "Usuarios sin actividad",
        value: inactivos.toString(),
        icon: UserX,
        color: inactivos > 0 ? "warning" : "neutral",
        subtitle: "Sin sesión en los últimos 30 días",
        isActive: selectedKpiFilter === "inactivos",
      },
    ];
  }, [actividades, selectedKpiFilter]);

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
      id: "periodo",
      label: "Período",
      value: selectedPeriodo,
      options: [
        { label: "Últimos 7 días", value: "ultimos-7" },
        { label: "Últimos 15 días", value: "ultimos-15" },
        { label: "Último mes", value: "mes" },
        { label: "Rango personalizado", value: "custom" },
      ],
      onChange: setSelectedPeriodo,
      width: "160px",
    },
    {
      id: "app",
      label: "Aplicación",
      value: selectedApp,
      options: [
        { label: "Todas las aplicaciones", value: "Todas" },
        { label: "Gestión Docente", value: "Gestión Docente" },
        { label: "SIGE", value: "SIGE" },
        { label: "Talento Humano", value: "Talento Humano" },
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
        { label: "Operador de Soporte", value: "Operador de Soporte" },
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
      id: "nivel",
      label: "Nivel de actividad",
      value: selectedNivel,
      options: [
        { label: "Todos los niveles", value: "Todos" },
        { label: "Alta", value: "Alta" },
        { label: "Media", value: "Media" },
        { label: "Baja", value: "Baja" },
        { label: "Sin actividad", value: "Sin actividad" },
      ],
      onChange: setSelectedNivel,
      width: "160px",
    },
  ];

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedApp !== "Todas" ||
    selectedRol !== "Todos" ||
    selectedSede !== "Todas" ||
    selectedNivel !== "Todos" ||
    selectedPeriodo !== "ultimos-7" ||
    dateRange !== undefined ||
    selectedKpiFilter !== null;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedPeriodo("ultimos-7");
    setSelectedApp("Todas");
    setSelectedRol("Todos");
    setSelectedSede("Todas");
    setSelectedNivel("Todos");
    setDateRange(undefined);
    setSelectedKpiFilter(null);
    setSelectedUser(null);
  };

  // Chips activos
  const activeChips: ActiveChipItem[] = [];
  if (searchTerm.trim()) {
    activeChips.push({
      id: "search",
      label: `Búsqueda: "${searchTerm}"`,
      onRemove: () => setSearchTerm(""),
    });
  }
  if (selectedApp !== "Todas") {
    activeChips.push({
      id: "app",
      label: `Aplicación: ${selectedApp}`,
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
  if (selectedNivel !== "Todos") {
    activeChips.push({
      id: "nivel",
      label: `Nivel: ${selectedNivel}`,
      onRemove: () => setSelectedNivel("Todos"),
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
    if (selectedUser) {
      return {
        title: selectedUser.usuario.nombre,
        subtitle: `Patrón de uso individual: ${selectedUser.usuario.cargo} · ${selectedUser.sede}`,
        hasSelection: true,
      };
    }
    if (selectedApp !== "Todas") {
      return {
        title: selectedApp,
        subtitle: `Intensidad de uso agregada en ${selectedApp}`,
        hasSelection: true,
      };
    }
    return {
      title: "Resumen de todos los usuarios",
      subtitle: "Distribución agregada de uso y recurrencia",
      hasSelection: false,
    };
  }, [selectedUser, selectedApp]);

  // Donut: Desglose por aplicación o por nivel de actividad
  const donutData = React.useMemo(() => {
    if (selectedUser) {
      // Para el usuario seleccionado: desglose por sus aplicaciones
      const items = selectedUser.desglosePorApp.map((item, idx) => ({
        id: item.aplicacion,
        label: item.aplicacion,
        value: item.accesos,
        pct: item.porcentaje,
        color: item.color || `var(--chart-${(idx % 5) + 1})`,
      }));

      return {
        title: "Distribución de accesos por aplicación",
        items: items.length > 0 ? items : [{ id: "none", label: "Sin accesos", value: 0, pct: 100, color: "var(--color-muted)" }],
      };
    }

    // Vista agregada: Distribución por Nivel de Actividad
    const total = filteredActividades.length || 1;
    const alta = filteredActividades.filter((a) => a.nivelActividad === "Alta").length;
    const media = filteredActividades.filter((a) => a.nivelActividad === "Media").length;
    const baja = filteredActividades.filter((a) => a.nivelActividad === "Baja").length;
    const inactivo = filteredActividades.filter((a) => a.nivelActividad === "Sin actividad").length;

    const items = [
      {
        id: "alta",
        label: "Alta actividad",
        value: alta,
        pct: Math.round((alta / total) * 100),
        color: "var(--chart-1)",
      },
      {
        id: "media",
        label: "Media actividad",
        value: media,
        pct: Math.round((media / total) * 100),
        color: "var(--chart-2)",
      },
      {
        id: "baja",
        label: "Baja actividad",
        value: baja,
        pct: Math.round((baja / total) * 100),
        color: "var(--chart-3)",
      },
      {
        id: "inactivo",
        label: "Sin actividad",
        value: inactivo,
        pct: Math.round((inactivo / total) * 100),
        color: "var(--chart-5)",
      },
    ].filter((i) => i.value > 0);

    return {
      title: "Distribución por nivel de actividad",
      items,
    };
  }, [filteredActividades, selectedUser]);

  // Barras horizontales: Aplicaciones más utilizadas (o roles con más actividad)
  const barsData = React.useMemo(() => {
    if (selectedUser) {
      // Para el usuario seleccionado: desglose por aplicación ordenado
      const items = selectedUser.desglosePorApp.map((app) => ({
        id: app.aplicacion,
        label: app.aplicacion,
        value: app.accesos,
        pct: app.porcentaje,
        color: app.color,
      }));

      return {
        title: "Intensidad de uso por sistema",
        items,
        valueSuffix: "ingresos",
      };
    }

    // Vista agregada: Aplicaciones con mayor volumen de accesos
    const appCountMap: Record<string, number> = {};
    filteredActividades.forEach((item) => {
      item.desglosePorApp.forEach((d) => {
        appCountMap[d.aplicacion] = (appCountMap[d.aplicacion] || 0) + d.accesos;
      });
    });

    const entries = Object.entries(appCountMap).sort((a, b) => b[1] - a[1]);
    const maxVal = Math.max(...entries.map(([, v]) => v), 1);

    const items = entries.slice(0, 5).map(([app, count]) => ({
      id: app,
      label: app,
      value: count,
      pct: Math.round((count / maxVal) * 100),
      color: "var(--chart-1)",
    }));

    return {
      title: "Aplicaciones con más accesos",
      items,
      valueSuffix: "ingresos",
    };
  }, [filteredActividades, selectedUser]);

  // Evolución temporal: Accesos diarios en la semana
  const trendData = React.useMemo(() => {
    if (selectedUser) {
      // Evolución semanal del usuario seleccionado
      return {
        title: "Evolución de accesos del usuario",
        points: selectedUser.evolucionSemanal.map((p) => ({
          label: p.diaSemana,
          value: p.accesos,
        })),
        unit: "ingresos",
      };
    }

    // Vista agregada: Suma de la evolución semanal de los usuarios filtrados
    const dayTotals: Record<string, { label: string; value: number }> = {
      Lun: { label: "Lun", value: 0 },
      Mar: { label: "Mar", value: 0 },
      Mié: { label: "Mié", value: 0 },
      Jue: { label: "Jue", value: 0 },
      Vie: { label: "Vie", value: 0 },
      Sáb: { label: "Sáb", value: 0 },
      Dom: { label: "Dom", value: 0 },
    };

    filteredActividades.forEach((act) => {
      act.evolucionSemanal.forEach((point) => {
        if (dayTotals[point.diaSemana]) {
          dayTotals[point.diaSemana].value += point.accesos;
        }
      });
    });

    return {
      title: "Evolución de accesos durante el período",
      points: Object.values(dayTotals),
      unit: "ingresos",
    };
  }, [filteredActividades, selectedUser]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full pb-10">
      {/* ── 1. Encabezado & Breadcrumb ────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">Auditoría y trazabilidad</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Actividad de usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Actividad de usuarios
            </h1>
            <Badge tone="warning" appearance="soft" size="sm">Mockup en desarrollo</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Consulta el uso e interacción de los usuarios en los sistemas integrados.
          </p>
        </div>
      </div>

      <Separator />

      {/* ── 2. Resumen Superior (Máx 4 KPI Cards) ────────────────────────── */}
      <AuditSummaryCards
        cards={kpiCards}
        onSelectCard={handleSelectKpiCard}
      />

      {/* ── 3. Layout Principal 65% / 35% ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA (~65%): Filtros y Tabla Operativa */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <AuditFilters
            searchPlaceholder="Buscar por nombre, correo o cédula..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectFilters={selectFilterConfigs}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            activeChips={activeChips}
          />

          {/* Tabla de Actividad Agregada */}
          <ActividadTable
            actividades={filteredActividades}
            selectedUserId={selectedUser?.usuario.id}
            onSelectUser={setSelectedUser}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* COLUMNA DERECHA (~35%): Panel Dinámico Reactivo */}
        <div className="lg:col-span-4 lg:sticky lg:top-4">
          <DynamicChartPanel
            contextTitle={dynamicContext.title}
            contextSubtitle={dynamicContext.subtitle}
            hasSelection={dynamicContext.hasSelection}
            onClearSelection={() => setSelectedUser(null)}
            donutData={donutData}
            barsData={barsData}
            trendData={trendData}
          />
        </div>
      </div>
    </div>
  );
}
