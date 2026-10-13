"use client";

import * as React from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardDecorativeIcon,
  CardBadge,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  School,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { DOCENTE_PROFILE } from "../data/inicio-data";

interface InicioWelcomeCardProps {
  onContinuarRegistrando?: () => void;
}

export function InicioWelcomeCard({
  onContinuarRegistrando,
}: InicioWelcomeCardProps) {
  return (
    <Card
      variant="primary"
      className="relative overflow-hidden border-primary/40 dark:!border-border dark:!bg-surface shadow-xs transition-colors"
      innerClassName="justify-center py-6 md:py-7 px-6 md:px-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full z-10 my-auto">
        {/* Lado izquierdo: Información y Bienvenida */}
        <div className="flex flex-col gap-2.5 max-w-2xl">
          {/* Metadata chips / Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <CardBadge className="bg-white/15 !text-white border border-white/20 dark:bg-muted/50 dark:!text-muted-foreground dark:border-border backdrop-blur-xs text-xs font-semibold px-3 py-1 transition-colors flex items-center gap-1.5">
              <GraduationCap className="size-3.5" />
              <span>Rol: {DOCENTE_PROFILE.rol}</span>
            </CardBadge>

            <span className="hidden sm:inline-block size-1 rounded-full bg-white/40 dark:bg-muted-foreground/40" />

            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 dark:text-muted-foreground bg-white/10 dark:bg-muted/40 px-2.5 py-0.5 rounded-full border border-white/15 dark:border-border">
              <School className="size-3.5 shrink-0 text-white dark:text-primary-300" />
              <span className="truncate">{DOCENTE_PROFILE.institucion}</span>
            </div>

            <span className="hidden sm:inline-block size-1 rounded-full bg-white/40 dark:bg-muted-foreground/40" />

            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 dark:text-muted-foreground bg-white/10 dark:bg-muted/40 px-2.5 py-0.5 rounded-full border border-white/15 dark:border-border">
              <Calendar className="size-3.5 shrink-0 text-white dark:text-primary-300" />
              <span>Período: {DOCENTE_PROFILE.quimestreActivo}</span>
            </div>
          </div>

          {/* Título principal */}
          <CardTitle className="text-2xl md:text-3xl font-heading font-bold !text-white dark:!text-white tracking-tight h-auto transition-colors mt-1">
            ¡Bienvenido, Juan Carlos!
          </CardTitle>

          {/* Descripción */}
          <CardDescription className="text-sm md:text-base !text-white/90 dark:!text-muted-foreground font-normal transition-colors max-w-xl">
            Continúa con el registro y seguimiento de las calificaciones de tus estudiantes.
          </CardDescription>
        </div>

        {/* Lado derecho: CTA Principal con Button del UI Kit */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="default"
            rightIcon={<ArrowRight className="size-4" />}
            onClick={onContinuarRegistrando}
            className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/70 dark:border-border dark:text-foreground dark:bg-muted/40 dark:hover:bg-muted/60 shadow-sm backdrop-blur-xs [--radial-bg:rgba(255,255,255,0.25)] dark:[--radial-bg:var(--primitive-neutral-700)] [--glow:rgba(255,255,255,0.35)]"
          >
            Continuar registrando
          </Button>
        </div>
      </div>

      {/* Elemento gráfico decorativo en esquina */}
      <CardDecorativeIcon className="opacity-15 dark:opacity-30 !text-white dark:!text-primary-300 right-3 -bottom-8 pointer-events-none z-0 transition-colors">
        <GraduationCap className="size-48 md:size-56 stroke-[1.1]" />
      </CardDecorativeIcon>
    </Card>
  );
}
