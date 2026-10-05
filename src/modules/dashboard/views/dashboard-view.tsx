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
import { KpiCard } from "@/components/ui/data-display";
import {
  Users,
  AppWindow,
  ShieldCheck,
  Layers,
  Key,
  AlertTriangle,
  ArrowRight,
  Clock,
  TrendingUp,
  Network,
} from "lucide-react";
import { Link } from "@/routing";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";

const ATTENTION_ITEMS = [
  {
    id: 1,
    title: "112 usuarios sin rol asignado",
    description: "Sin perfil de acceso configurado.",
    actionLabel: "Revisar usuarios",
    href: "/usuarios",
  },
  {
    id: 2,
    title: "4 aplicaciones sin roles configurados",
    description: "Sin perfiles de acceso asociados.",
    actionLabel: "Revisar aplicaciones",
    href: "/aplicaciones",
  },
  {
    id: 3,
    title: "2 roles sin recursos asociados",
    description: "Sin funciones ni recursos asignados.",
    actionLabel: "Revisar roles",
    href: "/roles",
  },
  {
    id: 4,
    title: "210 usuarios sin ingresos recientes",
    description: "Sin ingresos en los últimos 30 días.",
    actionLabel: "Revisar actividad",
    href: "/usuarios",
  },
];

const RECENT_CHANGES = [
  {
    id: 1,
    time: "08:02",
    type: "Permiso agregado al rol",
    description: "Permiso «Crear» en Contratos para Talento Humano Distrital.",
  },
  {
    id: 2,
    time: "07:44",
    type: "Nuevo rol creado",
    description: "Rol «Analista de notas» en Sistema de Notas.",
  },
  {
    id: 3,
    time: "07:30",
    type: "Usuario desactivado",
    description: "Lucía Toapanta marcada como inactiva.",
  },
];

const ROLE_DISTRIBUTION = [
  { id: "docente", name: "Docente", count: 560, pct: 45, color: "var(--primary)" },
  { id: "th-distrital", name: "Talento Humano Distrital", count: 311, pct: 25, color: "var(--info)" },
  { id: "jefe-th", name: "Jefe de Talento Humano", count: 187, pct: 15, color: "var(--warning)" },
  { id: "registro", name: "Registro y Control", count: 125, pct: 10, color: "var(--success)" },
  { id: "otros", name: "Otros", count: 62, pct: 5, color: "var(--muted-foreground)" },
];

const TOP_APPLICATIONS = [
  { id: "geoportal", name: "Geoportal", count: 650, pct: 52, color: "var(--primary)" },
  { id: "sso", name: "SSO", count: 420, pct: 34, color: "var(--info)" },
  { id: "tramites", name: "Trámites", count: 175, pct: 14, color: "var(--warning)" },
];

const ACCESS_HISTORY = [
  { day: "Lun", date: "29 Sep", value: 1820, change: null },
  { day: "Mar", date: "30 Sep", value: 2150, change: "+18%" },
  { day: "Mié", date: "01 Oct", value: 1980, change: "-8%" },
  { day: "Jue", date: "02 Oct", value: 2410, change: "+22%" },
  { day: "Vie", date: "03 Oct", value: 2290, change: "-5%" },
  { day: "Sáb", date: "04 Oct", value: 1750, change: "-24%" },
  { day: "Dom", date: "05 Oct", value: 1880, change: "+7%" },
];

export function DashboardView() {
  const [hoveredRoleId, setHoveredRoleId] = React.useState<string | null>(null);
  const [hoveredAppIdx, setHoveredAppIdx] = React.useState<number | null>(null);
  const [hoveredDayIdx, setHoveredDayIdx] = React.useState<number | null>(null);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;
  const donutSegments = ROLE_DISTRIBUTION.map((item) => {
    const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPct / 100) * circumference);
    accumulatedPct += item.pct;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  const activeRole = ROLE_DISTRIBUTION.find((r) => r.id === hoveredRoleId);

  const lineMaxVal = 2600;
  const lineMinVal = 1400;
  const linePoints = ACCESS_HISTORY.map((item, idx) => {
    const x = 20 + idx * ((280 - 40) / 6);
    const normalizedY = (item.value - lineMinVal) / (lineMaxVal - lineMinVal);
    const y = 80 - normalizedY * 65;
    return { ...item, x, y };
  });

  const linePathData =
    `M ${linePoints[0].x} ${linePoints[0].y} ` +
    linePoints
      .slice(1)
      .map((p, i) => {
        const prev = linePoints[i];
        const cx = (prev.x + p.x) / 2;
        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      })
      .join(" ");

  const lineAreaData = `${linePathData} L ${linePoints[linePoints.length - 1].x} 88 L ${linePoints[0].x} 88 Z`;

  return (
    <div className="flex flex-col gap-4 md:gap-5 w-full pb-4">
      {/* 0. Card destacada e interactiva de bienvenida */}
      <Card
        variant="primary"
        className="relative overflow-hidden border-primary/40 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <CardBadge className="bg-white/15 text-white backdrop-blur-xs w-fit text-xs font-semibold px-3 py-1">
              Hola, Sandra 👋
            </CardBadge>
            <CardTitle className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight h-auto">
              Bienvenida a Conecta MINEDUC
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-white/90 font-normal leading-relaxed">
              Consulta y gestiona usuarios, aplicaciones, roles, recursos y accesos desde un solo lugar.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xs"
              asChild
            >
              <Link href="/usuarios">
                Gestionar accesos <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/40 text-white hover:bg-white/15 hover:text-white"
              asChild
            >
              <Link href="/auditoria">Ver auditoría</Link>
            </Button>
          </div>
        </div>

        <CardDecorativeIcon className="opacity-15 text-white right-4 -bottom-8 pointer-events-none z-0">
          <Network className="size-48 md:size-56 stroke-[1.2]" />
        </CardDecorativeIcon>
      </Card>

      {/* Contenedor del Tablero Estratégico */}
      <div className="bg-surface border border-border shadow-xs rounded-xl p-4 md:p-6 flex flex-col gap-6 w-full">
        {/* Encabezado contextual */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-primary-300">
            Tablero estratégico
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Vista general del estado y actividad de Conecta MINEDUC.
          </p>
        </div>

        {/* 1. Indicadores principales */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard
              label="Aplicaciones"
              value="8"
              color="primary"
              comparison="6 activas · 2 inactivas"
              icon={<AppWindow />}
            />
            <KpiCard
              label="Usuarios"
              value="1.245"
              color="neutral"
              comparison="1.058 activos · 187 inactivos"
              icon={<Users />}
            />
            <KpiCard
              label="Roles"
              value="12"
              color="secondary-300"
              comparison="Perfiles configurados"
              icon={<ShieldCheck />}
            />
            <KpiCard
              label="Recursos"
              value="340"
              color="warning"
              comparison="Elementos configurados"
              icon={<Layers />}
            />
            <KpiCard
              label="Accesos"
              value="8.421"
              color="success-400"
              comparison="Relaciones configuradas"
              icon={<Key />}
            />
          </div>
        </section>

      {/* 2. Información visual de apoyo y actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usuarios por rol - DONUT CHART */}
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader className="items-start text-left gap-1 p-6 pb-2">
                  <CardTitle className="text-lg md:text-xl font-heading font-bold text-foreground h-auto">
                    Usuarios por rol
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Distribución según el perfil de acceso principal en el sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-2 pb-4">
                  <ChartContainer minHeight={170} className="relative flex flex-col items-center justify-center py-1">
                    {/* Floating Tooltip */}
                    {activeRole && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                        <ChartTooltip active={true}>
                          <ChartTooltipContent
                            title={activeRole.name}
                            label="Usuarios"
                            value={activeRole.count}
                            indicatorColor={activeRole.color}
                            subvalue={`${activeRole.pct}% del total asignado`}
                          />
                        </ChartTooltip>
                      </div>
                    )}

                    {/* Donut SVG */}
                    <div className="relative size-36 flex items-center justify-center my-1">
                      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="var(--muted)"
                          strokeWidth="11"
                          className="opacity-25"
                        />
                        {donutSegments.map((seg) => {
                          const isHovered = hoveredRoleId === seg.id;
                          const isDimmed = hoveredRoleId !== null && !isHovered;
                          return (
                            <circle
                              key={seg.id}
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="transparent"
                              stroke={seg.color}
                              strokeWidth={isHovered ? 13 : 11}
                              strokeDasharray={seg.strokeDasharray}
                              strokeDashoffset={seg.strokeDashoffset}
                              strokeLinecap="round"
                              className={cn(
                                "cursor-pointer transition-all duration-200",
                                isHovered ? "filter drop-shadow-md" : "",
                                isDimmed ? "opacity-35" : "opacity-100"
                              )}
                              onMouseEnter={() => setHoveredRoleId(seg.id)}
                              onMouseLeave={() => setHoveredRoleId(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Center Hole */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
                        {activeRole ? (
                          <>
                            <span className="text-lg font-bold font-heading text-foreground tabular-nums leading-tight">
                              {activeRole.count}
                            </span>
                            <span className="text-[10px] font-bold truncate max-w-[90px]" style={{ color: activeRole.color }}>
                              {activeRole.pct}% {activeRole.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl font-bold font-heading text-foreground tabular-nums">
                              100%
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                              1.245 usuarios
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Legend */}
                    <ChartLegend alignment="center" className="gap-2 pt-3 border-t border-border/50 w-full justify-center">
                      {ROLE_DISTRIBUTION.map((item) => (
                        <ChartLegendItem
                          key={item.id}
                          label={item.name}
                          color={item.color}
                          value={`${item.pct}%`}
                          active={hoveredRoleId === null || hoveredRoleId === item.id}
                          onMouseEnter={() => setHoveredRoleId(item.id)}
                          onMouseLeave={() => setHoveredRoleId(null)}
                          className="text-[10px] py-0"
                        />
                      ))}
                    </ChartLegend>
                  </ChartContainer>
                </CardContent>
              </div>
            </Card>

            {/* Aplicaciones con mayor número de usuarios - BAR CHART */}
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader className="items-start text-left gap-1 p-6 pb-2">
                  <CardTitle className="text-lg md:text-xl font-heading font-bold text-foreground h-auto">
                    Aplicaciones con mayor número de usuarios
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Sistemas que concentran la mayor cantidad de usuarios registrados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-3 pb-4">
                  <ChartContainer minHeight={170} className="relative flex flex-col justify-end pt-3">
                    {/* Y-Axis Grid lines */}
                    <div className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>700</span>
                      </div>
                      <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>350</span>
                      </div>
                      <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                        <span>0</span>
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="h-28 flex items-end justify-around gap-4 z-10 px-4 border-b border-border/70">
                      {TOP_APPLICATIONS.map((app, idx) => {
                        const heightPercent = (app.count / 700) * 100;
                        const isHovered = hoveredAppIdx === idx;
                        const isDimmed = hoveredAppIdx !== null && !isHovered;

                        return (
                          <div
                            key={app.id}
                            className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group max-w-[80px]"
                            onMouseEnter={() => setHoveredAppIdx(idx)}
                            onMouseLeave={() => setHoveredAppIdx(null)}
                            tabIndex={0}
                            role="button"
                            aria-label={`${app.name}: ${app.count} usuarios (${app.pct}%)`}
                          >
                            {isHovered && (
                              <ChartTooltip
                                active={true}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 min-w-[130px]"
                              >
                                <ChartTooltipContent
                                  title={app.name}
                                  label="Usuarios"
                                  value={`${app.count}`}
                                  indicatorColor={app.color}
                                  subvalue={`${app.pct}% de concentración`}
                                />
                              </ChartTooltip>
                            )}

                            <div
                              className={cn(
                                "w-full rounded-t-md transition-all duration-200",
                                isHovered ? "scale-y-[1.03] shadow-xs" : "opacity-90 hover:opacity-100",
                                isDimmed && "opacity-45"
                              )}
                              style={{
                                height: `${heightPercent}%`,
                                backgroundColor: app.color,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* X-Axis labels */}
                    <div className="flex justify-around text-[11px] font-semibold text-muted-foreground pt-2 px-4">
                      {TOP_APPLICATIONS.map((app, idx) => (
                        <span
                          key={app.id}
                          className={cn(
                            "transition-colors text-center truncate max-w-[80px]",
                            hoveredAppIdx === idx ? "text-primary font-bold" : ""
                          )}
                        >
                          {app.name}
                        </span>
                      ))}
                    </div>
                  </ChartContainer>
                </CardContent>
              </div>
              <CardFooter className="pt-2 pb-5 px-6 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 gap-1.5 p-0 h-auto font-medium"
                  asChild
                >
                  <Link href="/aplicaciones">
                    Ver todas las aplicaciones <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Ingresos a aplicaciones - LINE CHART */}
          <Card>
            <CardHeader className="items-start text-left gap-1 p-6 pb-2">
              <CardTitle className="text-lg md:text-xl font-heading font-bold text-foreground h-auto">
                Ingresos a aplicaciones
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Comportamiento de actividad y accesos de los últimos 7 días.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                    14.280
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Ingresos registrados
                  </p>
                  <div className="text-xs text-success flex items-center gap-1 mt-1 font-semibold">
                    <TrendingUp className="size-3.5" />
                    +12 % respecto a la semana anterior
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                    98,5 %
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Ingresos exitosos
                  </p>
                </div>
              </div>

              {/* Line Chart */}
              <ChartContainer minHeight={150} className="relative flex flex-col justify-end pt-2">
                {/* Grid lines */}
                <div className="absolute inset-x-0 top-1 bottom-6 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>2.600</span>
                  </div>
                  <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>2.000</span>
                  </div>
                  <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>1.400</span>
                  </div>
                </div>

                {/* SVG Curve */}
                <div className="relative w-full h-28">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 280 90" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="accessFillGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area Fill */}
                    <path d={lineAreaData} fill="url(#accessFillGradient)" />

                    {/* Stroke Line */}
                    <path
                      d={linePathData}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Vertical crosshair line for hovered item */}
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

                    {/* Data points */}
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

                  {/* Floating Chart Tooltip */}
                  {hoveredDayIdx !== null && (
                    <div
                      className="absolute -top-16 -translate-x-1/2 pointer-events-none transition-all duration-150 z-20"
                      style={{
                        left: `${(linePoints[hoveredDayIdx].x / 280) * 100}%`,
                      }}
                    >
                      <ChartTooltip active={true}>
                        <ChartTooltipContent
                          title={`${ACCESS_HISTORY[hoveredDayIdx].day} · ${ACCESS_HISTORY[hoveredDayIdx].date}`}
                          label="Ingresos"
                          value={ACCESS_HISTORY[hoveredDayIdx].value.toLocaleString()}
                          indicatorColor="var(--primary)"
                          trend={
                            ACCESS_HISTORY[hoveredDayIdx].change?.startsWith("+")
                              ? "up"
                              : ACCESS_HISTORY[hoveredDayIdx].change?.startsWith("-")
                                ? "down"
                                : "neutral"
                          }
                          trendValue={
                            ACCESS_HISTORY[hoveredDayIdx].change
                              ? `${ACCESS_HISTORY[hoveredDayIdx].change} vs anterior`
                              : "Base sem."
                          }
                        />
                      </ChartTooltip>
                    </div>
                  )}
                </div>

                {/* X-Axis labels */}
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 px-3 border-t border-border/70">
                  {ACCESS_HISTORY.map((d, i) => (
                    <span
                      key={d.day}
                      className={cn(
                        "transition-colors",
                        hoveredDayIdx === i ? "text-primary font-bold" : ""
                      )}
                    >
                      {d.day}
                    </span>
                  ))}
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* 3. Requiere atención */}
        <div className="flex flex-col gap-6">
          <Card className="border-warning/30 bg-warning/5 h-full flex flex-col justify-between">
            <div>
              <CardHeader className="items-start text-left gap-1 p-6 pb-3 border-b border-warning/20">
                <CardTitle className="text-lg md:text-xl font-heading font-bold text-warning flex items-center gap-2 h-auto">
                  <AlertTriangle className="size-5 shrink-0" />
                  Requiere atención
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Situaciones detectadas que podrían requerir revisión o gestión.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
                {ATTENTION_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 bg-surface border border-warning/20 rounded-xl shadow-2xs hover:border-warning/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground leading-snug truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2.5 shrink-0 border-warning/40 text-warning hover:bg-warning hover:text-white transition-colors"
                      asChild
                    >
                      <Link href={item.href}>
                        {item.actionLabel} <ArrowRight className="size-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Últimos cambios de gestión */}
      <Card>
        <CardHeader className="items-start text-left gap-1 p-6 pb-3">
          <CardTitle className="text-lg md:text-xl font-heading font-bold text-foreground h-auto">
            Últimos cambios de gestión
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Registro reciente de acciones sobre usuarios, aplicaciones y roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <div className="flex flex-col divide-y divide-border/60">
            {RECENT_CHANGES.map((change) => (
              <div key={change.id} className="flex items-start gap-3.5 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 mt-0.5">
                  <Clock className="size-3.5 text-muted-foreground/70" />
                  <span className="font-mono text-xs font-semibold">{change.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground leading-snug">{change.type}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {change.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-3 pb-6 px-6 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 gap-1.5 p-0 h-auto font-medium"
            asChild
          >
            <Link href="/auditoria">
              Ver auditoría completa <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
);
}
