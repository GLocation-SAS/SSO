"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { InteractiveCard } from "@/components/ui/data-display";
import {
  History,
  Search,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Shield,
  Building2,
} from "lucide-react";
import { ActividadPersonalItem, PeriodoFiltro } from "../data/mi-dashboard-data";
import { Link } from "@/routing";

interface RecentActivitySectionProps {
  activities: ActividadPersonalItem[];
  periodo: PeriodoFiltro;
}

export function RecentActivitySection({
  activities,
  periodo,
}: RecentActivitySectionProps) {
  const [query, setQuery] = useState("");
  const [appFilter, setAppFilter] = useState("todas");

  const appOptions = useMemo(() => {
    const list = Array.from(new Set(activities.map((a) => a.aplicacion)));
    return ["todas", ...list];
  }, [activities]);

  const filtered = useMemo(() => {
    return activities.filter((item) => {
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.accion.toLowerCase().includes(q) ||
        item.aplicacion.toLowerCase().includes(q) ||
        item.sede.toLowerCase().includes(q) ||
        item.dispositivo.toLowerCase().includes(q) ||
        item.fechaHora.includes(q);

      const matchApp = appFilter === "todas" || item.aplicacion === appFilter;

      return matchQuery && matchApp;
    });
  }, [activities, query, appFilter]);

  return (
    <Card className="rounded-2xl border-border bg-card shadow-xs">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <History className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Actividad reciente del usuario
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Registro cronológico exclusivo de tus accesos y acciones en los últimos {periodo} días
              </CardDescription>
            </div>
          </div>

          <Badge appearance="outline" tone="neutral" className="text-xs font-mono self-start sm:self-auto">
            {filtered.length} eventos
          </Badge>
        </div>

        {/* Buscador y filtro interno */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-3">
          <div className="relative flex-1 w-full">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en actividad (acción, app, dispositivo)..."
              className="pl-8 h-9 text-xs bg-surface"
            />
          </div>

          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-auto"
          >
            <option value="todas">Todas las aplicaciones</option>
            {appOptions
              .filter((a) => a !== "todas")
              .map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0 border-t border-border/60">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-4">Fecha y Hora</TableHead>
                <TableHead className="py-3 px-4">Aplicación</TableHead>
                <TableHead className="py-3 px-4">Acción realizada</TableHead>
                <TableHead className="py-3 px-4">Sede / Rol</TableHead>
                <TableHead className="py-3 px-4">Dispositivo / IP</TableHead>
                <TableHead className="py-3 px-4 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No se encontraron eventos de actividad con los criterios aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-3 px-4 font-mono text-[11px] text-foreground whitespace-nowrap">
                      {item.fechaHora}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap font-semibold text-foreground">
                      {item.aplicacion}
                    </TableCell>
                    <TableCell className="py-3 px-4 max-w-xs text-foreground/90">
                      {item.accion}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-[11px] text-foreground font-medium">
                          <Building2 className="size-3 text-primary shrink-0" />
                          {item.sede}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Shield className="size-3 text-secondary-600 dark:text-secondary-400 shrink-0" />
                          {item.rol}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-muted-foreground font-mono text-[10px]">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-foreground/80">
                          <Laptop className="size-3 text-muted-foreground shrink-0" />
                          {item.dispositivo}
                        </span>
                        <span>IP: {item.ip}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-right whitespace-nowrap">
                      <Badge
                        appearance="soft"
                        tone={item.estado === "Exitoso" ? "success" : "warning"}
                        className="text-[10px] gap-1 inline-flex"
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

        {/* Mobile Cards View */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 w-full">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground border border-border rounded-xl bg-surface">
              No se encontraron eventos de actividad con los criterios aplicados.
            </div>
          ) : (
            filtered.map((item) => (
              <InteractiveCard
                key={item.id}
                className="flex flex-col gap-2.5 text-left"
                color="default"
                hideChevron
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-foreground truncate">{item.aplicacion}</span>
                    <span className="font-mono text-xs text-muted-foreground">{item.fechaHora}</span>
                  </div>
                  <Badge
                    appearance="soft"
                    tone={item.estado === "Exitoso" ? "success" : "warning"}
                    className="text-[10px] gap-1 shrink-0 px-2 py-0.5"
                  >
                    {item.estado === "Exitoso" ? (
                      <CheckCircle2 className="size-3 text-success shrink-0" />
                    ) : (
                      <AlertCircle className="size-3 text-warning shrink-0" />
                    )}
                    {item.estado}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/90 leading-snug">{item.accion}</p>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3 text-primary shrink-0" />
                    {item.sede}
                  </span>
                  <span className="font-mono text-[10px]">IP: {item.ip}</span>
                </div>
              </InteractiveCard>
            ))
          )}
        </div>

        <div className="p-3.5 bg-surface-subtle/30 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground px-4">
          <span>Solo se muestran los registros de tu cuenta personal ({activities.length} totales registrados).</span>
          <Link
            href="/mis-aplicaciones"
            className="text-primary hover:underline font-semibold flex items-center gap-1"
          >
            Ver mis aplicaciones
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
