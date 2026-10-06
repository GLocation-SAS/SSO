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
  ChevronDown,
} from "lucide-react";
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
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";

const ATTENTION_ITEMS = [
  {
    id: 1,
    title: "112 usuarios sin rol asignado",
    description: "Sin perfil de acceso configurado.",
    actionLabel: "Revisar usuarios",
    href: "/gestion-usuarios/usuarios",
    icon: Users,
  },
  {
    id: 2,
    title: "4 aplicaciones sin roles configurados",
    description: "Sin perfiles de acceso asociados.",
    actionLabel: "Revisar aplicaciones",
    href: "/aplicaciones",
    icon: AppWindow,
  },
  {
    id: 3,
    title: "2 roles sin recursos asociados",
    description: "Sin funciones ni recursos asignados.",
    actionLabel: "Revisar roles",
    href: "/roles",
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: "210 usuarios sin ingresos recientes",
    description: "Sin ingresos en los últimos 30 días.",
    actionLabel: "Revisar actividad",
    href: "/gestion-usuarios/usuarios",
    icon: Clock,
  },
];

const APLICACIONES_OPTIONS = ["Sistema de Notas", "Portal Educativo", "Gestión de Personal"];

const RECENT_CHANGES_SUMMARY = [
  { id: "usuarios", group: "Usuarios", count: 8, lastTime: "10:24 AM", icon: Users, color: "bg-muted text-foreground border-border" },
  { id: "roles", group: "Roles", details: "Sistema de Notas", count: 5, lastTime: "09:40 AM", icon: ShieldCheck, color: "bg-info/10 text-info border-info/20" },
  { id: "recursos", group: "Recursos", details: "Sistema de Notas", count: 12, lastTime: "08:02 AM", icon: Layers, color: "bg-warning/10 text-warning border-warning/20" },
  { id: "asignaciones", group: "Asignaciones de acceso", count: 6, lastTime: "07:45 AM", icon: Network, color: "bg-success/10 text-success border-success/20" },
  { id: "permisos", group: "Permisos", count: 9, lastTime: "07:20 AM", icon: Key, color: "bg-success/10 text-success border-success/20" }
];


const ROLE_DISTRIBUTION = [
  { id: "docente", name: "Docente", count: 560, pct: 45, color: "var(--primary)", resources: 8, status: "Activo" },
  { id: "analista", name: "Analista de notas", count: 311, pct: 25, color: "var(--info)", resources: 12, status: "Activo" },
  { id: "rector", name: "Rector", count: 187, pct: 15, color: "var(--warning)", resources: 24, status: "Activo" },
  { id: "admin", name: "Administrador", count: 125, pct: 10, color: "var(--success)", resources: 45, status: "Activo" },
  { id: "otros", name: "Otros", count: 62, pct: 5, color: "var(--muted-foreground)", resources: 3, status: "Activo" },
];

const APP_CONFIG_DATA = [
  { id: "notas", name: "Sistema de Notas", roles: 8, recursos: 42, color: "var(--primary)" },
  { id: "portal", name: "Portal Educativo", roles: 5, recursos: 28, color: "var(--info)" },
  { id: "personal", name: "Gestión de Personal", roles: 6, recursos: 35, color: "var(--warning)" },
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
  const [activeFilter, setActiveFilter] = React.useState("Hoy");

  const filterMultiplier = activeFilter === "Hoy" ? 1 : activeFilter === "Ayer" ? 0.8 : activeFilter === "Esta semana" ? 4.5 : activeFilter === "Semana anterior" ? 5.2 : 18.4;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const donutSegments = React.useMemo(() => {
    let acc = 0;
    const segments = [];
    for (const item of ROLE_DISTRIBUTION) {
      const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((acc / 100) * circumference);
      acc += item.pct;
      segments.push({ ...item, strokeDasharray, strokeDashoffset });
    }
    return segments;
  }, [circumference]);

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
    <div className="flex flex-col gap-4 w-full pb-4">
      {/* 0. Card destacada de bienvenida */}
      <Card
        variant="primary"
        className="relative overflow-hidden border-primary/40 dark:!border-border dark:!bg-surface shadow-xs transition-colors"
        innerClassName="justify-center py-6 md:py-7 px-6 md:px-8"
      >
        <div className="flex flex-col justify-center gap-2 w-full z-10 my-auto">
          <CardBadge className="bg-white/15 !text-white border border-white/20 dark:bg-muted/50 dark:!text-muted-foreground dark:border-border backdrop-blur-xs w-fit text-xs font-semibold px-3 py-1 transition-colors">
            Hola, Paula Rozo 👋
          </CardBadge>
          <CardTitle className="text-2xl md:text-3xl font-heading font-bold !text-white dark:!text-primary-300 tracking-tight h-auto transition-colors">
            Bienvenida a Conecta MINEDUC
          </CardTitle>
          <CardDescription className="text-sm md:text-base !text-white/90 dark:!text-muted-foreground font-normal transition-colors">
            Supervisa y gestiona usuarios, aplicaciones, roles y accesos institucionales desde un solo lugar.
          </CardDescription>
        </div>

        <CardDecorativeIcon className="opacity-15 dark:opacity-35 !text-white dark:!text-primary-300 right-4 -bottom-8 pointer-events-none z-0 transition-colors">
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
              color="info"
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
              label="Asignaciones de acceso"
              value="8.421"
              color="success-400"
              comparison="Relaciones usuario, sede, rol y aplicación"
              icon={<Key />}
            />
          </div>
        </section>

        {/* 2. Operación y Gestión: Requiere atención y Últimos cambios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2.1 Requiere atención */}
          <Card variant="panel" className="relative flex flex-col h-full bg-surface shadow-none transition-colors overflow-hidden border-0">

            {/* Relleno sutil animado de alerta */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
              <div className="absolute inset-0 bg-warning/[0.08] animate-[pulse_3s_ease-in-out_infinite]" />
            </div>

            {/* Borde dinámico rotatorio con máscara perfecta (más lento: 8s) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{
                padding: "2px",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite]"
                style={{ background: 'conic-gradient(from 0deg, transparent 0 250deg, var(--warning) 360deg)' }}
              />
            </div>

            <CardHeader className="relative z-10 items-start text-left gap-1 p-6 pb-3 border-b border-warning/20">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-lg md:text-xl font-heading font-bold text-warning flex items-center gap-2 h-auto">
                  <AlertTriangle className="size-5 shrink-0" />
                  Requiere atención
                </CardTitle>
                <Badge variant="warning" size="sm" className="font-bold">
                  {ATTENTION_ITEMS.length} avisos
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Situaciones detectadas que podrían requerir revisión o gestión.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 px-6 py-4 flex-1">
              <div className="flex flex-col gap-3">
                {ATTENTION_ITEMS.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 bg-surface border border-warning/20 rounded-xl shadow-2xs hover:border-warning/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-lg flex items-center justify-center shrink-0 border bg-warning/10 text-warning border-warning/20">
                          <ItemIcon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground leading-snug truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="warning"
                        size="sm"
                        className="shrink-0 h-8 px-3 text-xs font-bold !text-white hover:bg-warning/90 shadow-2xs gap-1"
                        asChild
                      >
                        <Link href={item.href}>
                          {item.actionLabel}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="relative z-10 py-4 px-6 border-t border-warning/20 mt-auto flex justify-center items-center w-full">
              <Link
                href="/gestion-usuarios/usuarios"
                className="text-sm font-semibold text-foreground hover:text-warning transition-colors flex items-center gap-1.5 group/link"
              >
                Ver todos los avisos <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 2.2 Últimos cambios de gestión */}
          <Card variant="panel" className="flex flex-col h-full">
            <CardHeader className="items-start text-left gap-4 p-6 pb-3 border-b border-border/50">
              <div className="flex flex-col gap-1 w-full">
                <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                  Últimos cambios de gestión
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Resumen de la actividad administrativa reciente.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full no-scrollbar">
                {["Hoy", "Ayer", "Esta semana", "Semana anterior", "Último mes"].map((filter) => (
                  <Badge 
                    key={filter}
                    tone={activeFilter === filter ? "primary" : "neutral"}
                    appearance={activeFilter === filter ? "solid" : "soft"} 
                    className={cn(
                      "cursor-pointer whitespace-nowrap shadow-none",
                      activeFilter !== filter && "hover:bg-muted/50 border-transparent"
                    )}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4 flex-1">
              <div className="flex flex-col gap-3">
                {RECENT_CHANGES_SUMMARY.map((change) => {
                  const Icon = change.icon;
                  const displayCount = Math.max(1, Math.floor(change.count * filterMultiplier));
                  return (
                    <div
                      key={change.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface shadow-2xs hover:bg-muted/30 hover:border-border transition-all duration-150 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("size-9 rounded-lg flex items-center justify-center shrink-0 border", change.color)}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-sm font-bold text-foreground leading-snug">
                            {change.group}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {displayCount} cambios
                            </span>
                            {change.details && (
                              <>
                                <span className="text-muted-foreground/40 text-[10px]">•</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{change.details}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                          {activeFilter === "Hoy" || activeFilter === "Ayer" ? `Último: ${change.lastTime}` : `Actualizado`}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-[11px] font-bold text-primary hover:underline outline-none text-right">
                              Ver detalle
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
                            <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                              <DialogTitle className="text-xl font-heading text-primary">Cambios en {change.group.toLowerCase()}</DialogTitle>
                              <DialogDescription className="text-sm text-muted-foreground">
                                {change.details ? `${change.details} · ` : ""}{activeFilter} · {displayCount} cambios registrados
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col p-6 max-h-[60vh] overflow-y-auto">
                              <div className="flex gap-4 items-start pb-4 border-b border-border/50 mb-4">
                                <div className="w-20 shrink-0 text-left">
                                  <span className="font-mono text-xs font-semibold text-muted-foreground">{change.lastTime}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-bold text-foreground">Registro actualizado</span>
                                  <span className="text-sm text-muted-foreground">Se modificó un registro en {change.group.toLowerCase()}.</span>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="flex items-center sm:justify-between w-full p-4 border-t border-border/50 bg-muted/10">
                              <DialogClose asChild>
                                <Button variant="ghost" size="sm">Cerrar</Button>
                              </DialogClose>
                              <Button variant="primary" size="sm" asChild>
                                <Link href="/auditoria">Ver auditoría completa <ArrowRight className="size-4 ml-1.5" /></Link>
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="relative z-10 py-4 px-6 border-t border-border/50 mt-auto flex justify-center items-center w-full">
              <Link
                href="/auditoria"
                className="text-sm font-semibold text-foreground hover:text-primary-300 transition-colors flex items-center gap-1.5 group/link"
              >
                Ver auditoría completa <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* 3. Información analítica: Roles, Aplicaciones e Ingresos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 3.1 Usuarios por rol - DONUT CHART */}
          <Card variant="panel" className="flex flex-col h-full border border-border shadow-2xs">
            <CardHeader className="items-start text-left gap-4 p-6 pb-3 border-b border-border/50 min-h-[76px] flex flex-col justify-center">
              <div className="flex flex-col gap-1 w-full">
                <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                  Usuarios por rol
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                  Distribución de usuarios según los roles asignados en una aplicación.
                </CardDescription>
              </div>
              <div className="w-full relative">
                <select 
                  className="w-full text-sm border border-border/60 rounded-md bg-surface text-foreground py-1.5 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-colors"
                  defaultValue="Sistema de Notas"
                >
                  {APLICACIONES_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 flex-1 min-h-[260px]">
              <ChartContainer minHeight={180} className="relative flex flex-col items-center justify-center w-full">
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
                          5 roles
                        </span>
                        <span className="text-[9px] font-semibold text-muted-foreground mt-0.5 leading-[1.1]">
                          1.245 usuarios<br/>asociados
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <ChartLegend alignment="center" className="gap-2 pt-3 w-full justify-center flex-wrap">
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
            <CardFooter className="relative z-10 py-4 px-6 border-t border-border/50 mt-auto flex justify-center items-center w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-sm font-semibold text-foreground hover:text-primary-300 transition-colors flex items-center gap-1.5 group/link outline-none">
                    Ver detalle de roles <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] gap-0 p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                    <DialogTitle className="text-xl font-heading text-primary">Roles de Sistema de Notas</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Detalle de usuarios y recursos asociados a cada rol.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-muted/40 border-b border-border/50 sticky top-0 backdrop-blur-md">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider col-span-1">Rol</span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Usuarios</span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Recursos</span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Estado</span>
                    </div>
                    <div className="flex flex-col divide-y divide-border/40">
                      {ROLE_DISTRIBUTION.map((r) => (
                        <div key={r.id} className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-muted/10 transition-colors">
                          <div className="flex items-center gap-2 col-span-1">
                            <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                            <span className="text-sm font-bold text-foreground truncate">{r.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground text-center tabular-nums">{r.count}</span>
                          <span className="text-sm font-semibold text-muted-foreground text-center tabular-nums">{r.resources}</span>
                          <div className="text-right">
                            <Badge appearance="soft" tone="success" size="sm">{r.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="p-4 border-t border-border/50 bg-muted/10 flex justify-end">
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">Cerrar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          {/* 3.2 Configuración por aplicación - GROUPED BAR CHART */}
          <Card variant="panel" className="flex flex-col h-full border border-border shadow-2xs">
            <CardHeader className="items-start text-left gap-1 p-6 pb-3 border-b border-border/50 min-h-[76px] flex flex-col justify-center">
              <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                Configuración por aplicación
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground line-clamp-1">
                Comparación de roles y recursos configurados en cada aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 flex-1 min-h-[260px]">
              <ChartContainer minHeight={180} className="relative flex flex-col justify-end w-full max-w-[280px]">
                {/* Y-Axis Grid lines */}
                <div className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>50</span>
                  </div>
                  <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>25</span>
                  </div>
                  <div className="border-b border-border/60 w-full flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>0</span>
                  </div>
                </div>

                {/* Bars */}
                <div className="h-32 flex items-end justify-around gap-2 z-10 px-2 border-b border-border/70">
                  {APP_CONFIG_DATA.map((app, idx) => {
                    const rolesHeight = (app.roles / 50) * 100;
                    const recursosHeight = (app.recursos / 50) * 100;
                    const isHovered = hoveredAppIdx === idx;
                    const isDimmed = hoveredAppIdx !== null && !isHovered;

                    return (
                      <div
                        key={app.id}
                        className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer group px-1"
                        onMouseEnter={() => setHoveredAppIdx(idx)}
                        onMouseLeave={() => setHoveredAppIdx(null)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${app.name}: ${app.roles} roles, ${app.recursos} recursos`}
                      >
                        {isHovered && (
                          <ChartTooltip
                            active={true}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 min-w-[160px] z-20"
                          >
                            <ChartTooltipContent
                              title={app.name}
                              label=""
                              value=""
                              indicatorColor={app.color}
                              subvalue={`${app.roles} roles · ${app.recursos} recursos configurados`}
                            />
                          </ChartTooltip>
                        )}

                        <div className={cn("flex items-end gap-1.5 w-full justify-center", isDimmed && "opacity-45")}>
                          <div
                            className={cn(
                              "w-3 rounded-t-sm transition-all duration-200",
                              isHovered ? "scale-y-[1.03] shadow-xs" : "opacity-90 hover:opacity-100",
                            )}
                            style={{
                              height: `${rolesHeight}%`,
                              backgroundColor: "var(--info)",
                            }}
                          />
                          <div
                            className={cn(
                              "w-3 rounded-t-sm transition-all duration-200",
                              isHovered ? "scale-y-[1.03] shadow-xs" : "opacity-90 hover:opacity-100",
                            )}
                            style={{
                              height: `${recursosHeight}%`,
                              backgroundColor: "var(--warning)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis labels */}
                <div className="flex justify-around text-[11px] font-semibold text-muted-foreground pt-2 px-2">
                  {APP_CONFIG_DATA.map((app, idx) => (
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

                {/* Legend */}
                <ChartLegend alignment="center" className="gap-4 pt-4 w-full justify-center">
                  <ChartLegendItem label="Roles" color="var(--info)" active={true} />
                  <ChartLegendItem label="Recursos" color="var(--warning)" active={true} />
                </ChartLegend>
              </ChartContainer>
            </CardContent>
            <CardFooter className="relative z-10 py-4 px-6 border-t border-border/50 mt-auto flex justify-center items-center w-full">
              <Link
                href="/gestion-aplicaciones"
                className="text-sm font-semibold text-foreground hover:text-primary-300 transition-colors flex items-center gap-1.5 group/link"
              >
                Ver configuración de aplicaciones <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 3.3 Ingresos a aplicaciones - LINE CHART */}
          <Card variant="panel" className="flex flex-col h-full md:col-span-2 lg:col-span-1 border border-border shadow-2xs">
            <CardHeader className="items-start text-left gap-1 p-6 pb-3 border-b border-border/50 min-h-[76px] flex flex-col justify-center">
              <CardTitle className="text-lg md:text-xl font-heading font-bold text-primary h-auto">
                Ingresos a aplicaciones
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground line-clamp-1">
                Comportamiento de actividad y accesos de los últimos 7 días.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 flex-1 min-h-[260px]">
              <div className="w-full max-w-[280px] flex flex-col justify-center">
                <div className="flex items-center justify-between gap-3 mb-2 px-1">
                  <div>
                    <div className="text-2xl font-heading font-bold text-foreground leading-none">
                      14.280
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1 flex items-center gap-1">
                      Registrados <span className="text-success font-semibold flex items-center"><TrendingUp className="size-3 inline" />+12%</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-foreground leading-none">
                      98,5 %
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1">
                      Exitosos
                    </p>
                  </div>
                </div>

                {/* Line Chart */}
                <ChartContainer minHeight={130} className="relative flex flex-col justify-end pt-1 w-full">
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
                  <div className="relative w-full h-24">
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
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground pt-2 px-2">
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
              </div>
            </CardContent>
            <CardFooter className="relative z-10 py-4 px-6 border-t border-border/50 mt-auto flex justify-center items-center w-full">
              <Link
                href="/auditoria"
                className="text-sm font-semibold text-foreground hover:text-primary-300 transition-colors flex items-center gap-1.5 group/link"
              >
                Ver trazabilidad de ingresos <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
