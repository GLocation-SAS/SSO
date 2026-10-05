"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, XCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden selection:bg-primary/20">
      {/* Fondo y luz ambiental de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* COMPONENTE PRINCIPAL DE PÁGINA 404 */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        
        {/* NÚMERO 404 GIGANTE CON ÍCONOS Y BURBUJAS FLOTANTES ANIDADAS Y ALREDEDOR */}
        <div className="relative my-4 flex items-center justify-center select-none">
          
          {/* Número 404 en la tipografía del sistema */}
          <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-black font-heading text-primary leading-none tracking-tighter drop-shadow-sm">
            404
          </h1>

          {/* ELEMENTOS DECORATIVOS FLOTANTES CON MICROANIMACIÓN FLOATING */}
          
          {/* Elemento 1: Burbuja de Búsqueda (Arriba Izquierda del 4) */}
          <div className="absolute -top-2 left-6 sm:left-10 bg-surface/90 dark:bg-surface-raised border border-border/80 shadow-lg backdrop-blur-md p-3 rounded-2xl animate-bounce [animation-duration:4s] flex items-center justify-center">
            <Search className="size-5 text-primary" />
          </div>

          {/* Elemento 2: Burbuja de Error X (Centro del 0) */}
          <div className="absolute top-8 left-[38%] sm:left-[42%] bg-surface/90 dark:bg-surface-raised border border-border/80 shadow-lg backdrop-blur-md p-2.5 rounded-2xl animate-pulse [animation-duration:3s] flex items-center justify-center">
            <XCircle className="size-5 text-danger" />
          </div>

          {/* Elemento 3: Burbuja de Alerta (Arriba Derecha del último 4) */}
          <div className="absolute top-4 right-8 sm:right-14 bg-surface/90 dark:bg-surface-raised border border-border/80 shadow-lg backdrop-blur-md p-3 rounded-2xl animate-bounce [animation-duration:5s] flex items-center justify-center">
            <AlertCircle className="size-5 text-warning" />
          </div>

          {/* Elemento 4: Puntos/Círculos Geométricos Decorativos Flotantes */}
          <div className="absolute -bottom-2 left-1/4 size-3 rounded-full bg-primary/30 animate-pulse [animation-duration:2.5s]" />
          <div className="absolute top-1/3 right-4 size-4 rounded-full bg-secondary/30 animate-pulse [animation-duration:3.5s]" />
          <div className="absolute -top-6 right-1/3 size-2.5 rounded-full bg-warning/40" />
        </div>

        {/* MENSAJE PRINCIPAL Y TEXTO DESCRIPTIVO */}
        <div className="space-y-3 max-w-lg mt-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans font-medium">
            Lo sentimos, la página que buscas no existe, fue movida o no está disponible en este momento dentro del geoportal.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link href="/">
            <Button variant="primary" size="lg" leftIcon={<Home className="size-4" />}>
              Volver al inicio
            </Button>
          </Link>
        </div>

      </div>

      {/* PIE DE PÁGINA DISCRETO INSTITUCIONAL */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/80 font-sans">
        Ministerio de Educación del Ecuador — GEOportal
      </div>
    </div>
  );
}
