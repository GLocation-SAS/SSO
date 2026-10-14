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
import {
  AppWindow,
  Hammer,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import { Link } from "@/routing";
import { useAuth } from "@/hooks/useAuth";

export function NotasWelcomeView() {
  const { user, profile } = useAuth();

  const userName =
    profile?.usuario?.nombre && profile?.usuario?.apellidos
      ? `${profile.usuario.nombre} ${profile.usuario.apellidos}`
      : user?.displayName || user?.email?.split("@")[0] || "Docente";

  return (
    <div className="flex flex-col gap-6 w-full pb-4">
      {/* 0. Card destacada de bienvenida */}
      <Card
        variant="primary"
        className="relative overflow-hidden border-primary/40 dark:!border-border dark:!bg-surface shadow-xs transition-colors"
        innerClassName="justify-center py-6 md:py-7 px-6 md:px-8"
      >
        <div className="flex flex-col justify-center gap-2 w-full z-10 my-auto">
          <CardBadge className="bg-white/15 !text-white border border-white/20 dark:bg-muted/50 dark:!text-muted-foreground dark:border-border backdrop-blur-xs w-fit text-xs font-semibold px-3 py-1 transition-colors">
            Hola, {userName} 👋
          </CardBadge>
          <CardTitle className="text-2xl md:text-3xl font-heading font-bold !text-white dark:!text-white tracking-tight h-auto transition-colors">
            Bienvenido al Sistema de Notas
          </CardTitle>
          <CardDescription className="text-sm md:text-base !text-white/90 dark:!text-muted-foreground font-normal transition-colors">
            Módulo institucional para la consulta, registro y administración académica de calificaciones y evaluaciones.
          </CardDescription>
        </div>

        <CardDecorativeIcon className="opacity-15 dark:opacity-35 !text-white dark:!text-primary-300 right-4 -bottom-8 pointer-events-none z-0 transition-colors">
          <AppWindow className="size-48 md:size-56 stroke-[1.2]" />
        </CardDecorativeIcon>
      </Card>

      {/* Contenedor del Tablero Estratégico "En construcción" */}
      <div className="bg-surface border border-border shadow-xs rounded-xl p-8 md:p-12 flex flex-col gap-6 w-full items-center text-center">
        <div className="size-20 rounded-2xl bg-warning/10 border border-warning/20 text-warning flex items-center justify-center shadow-xs">
          <Hammer className="size-10 animate-bounce duration-1000" />
        </div>

        <div className="flex flex-col gap-3 max-w-xl">
          <Badge variant="warning" size="md" className="mx-auto font-bold px-3 py-1">
            En construcción
          </Badge>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Tablero estratégico en construcción
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Estamos preparando las analíticas, reportes por período y tableros de rendimiento escolar para tu sede académica. Muy pronto podrás visualizar métricas de calificaciones y evaluaciones consolidadas en este panel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4 text-left">
          <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <BookOpen className="size-4" />
              <span>Registro de notas</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Ingreso rápido de calificaciones parciales y quimestrales.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-info font-bold text-sm">
              <Calendar className="size-4" />
              <span>Cronograma escolar</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Fechas límite para cierre y asentamiento de actas.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-success font-bold text-sm">
              <Layers className="size-4" />
              <span>Reportes consolidados</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Boletines oficiales y resúmenes de aprobados.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard" className="gap-2 font-medium">
              <ArrowLeft className="size-4" />
              Volver a Mis Aplicaciones
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
