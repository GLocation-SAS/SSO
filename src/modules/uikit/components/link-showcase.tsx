"use client";

import React from "react";
import { Link } from "@/components/ui/link";
import { ArrowRight, FileText } from "lucide-react";

export function LinkShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="space-y-12">
      {/* Variantes */}
      <div className="space-y-4">
        <h4 className="text-caption font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
          Variantes Principales
        </h4>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Default Link</span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">Para navegar hacia otra página o sección.</span>
            </div>
            <Link href="#">Ver detalles</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Inline Link</span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">Para incluir un enlace dentro de un texto o párrafo.</span>
            </div>
            <p className="text-body text-foreground">
              Para conocer más información, consulta los <Link variant="inline" href="#">términos y condiciones</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Iconos */}
      <div className="space-y-4">
        <h4 className="text-caption font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
          Enlaces con Íconos
        </h4>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Leading Icon</span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">Cuando el ícono ayuda a identificar la acción antes del texto.</span>
            </div>
            <Link href="#" leadingIcon={<FileText />}>Ver ficha completa</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Trailing Icon</span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">Para reforzar visualmente que el enlace lleva a otra vista o acción relacionada.</span>
            </div>
            <Link href="#" trailingIcon={<ArrowRight />}>Ver más</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">External Link</span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">Para indicar que el usuario será dirigido a un recurso externo.</span>
            </div>
            <Link href="#" isExternal>Descargar documentación</Link>
          </div>
        </div>
      </div>

      {/* Estados */}
      <div className="space-y-4">
        <h4 className="text-caption font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
          Estados
        </h4>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Disabled</span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">Para mostrar una opción temporalmente no disponible sin permitir interacción.</span>
            </div>
            <Link href="#" isDisabled>Enlace deshabilitado</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-64 flex flex-col gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Disabled External</span>
            </div>
            <Link href="#" isExternal isDisabled>Sitio no disponible</Link>
          </div>
        </div>
      </div>

      {/* Tamaños */}
      <div className="space-y-4">
        <h4 className="text-caption font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
          Tamaños
        </h4>
        <div className="flex flex-col gap-6 items-start">
          <div className="flex items-center gap-8">
            <div className="w-48 text-sm font-semibold text-muted-foreground">Small (sm)</div>
            <Link href="#" size="sm" isExternal>Ministerio de Educación</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-48 text-sm font-semibold text-muted-foreground">Por defecto</div>
            <Link href="#" isExternal>Ministerio de Educación</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-48 text-sm font-semibold text-muted-foreground">Large (lg)</div>
            <Link href="#" size="lg" isExternal>Ministerio de Educación</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
