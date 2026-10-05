"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  PenTool, 
  FileText, 
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  { id: "intro", title: "Introducción", description: "Primer contacto", icon: BookOpen },
  { id: "concepts", title: "Conceptos", description: "Bases teóricas", icon: Lightbulb },
  { id: "practice", title: "Práctica", description: "Ejercicios interactivos", icon: PenTool },
  { id: "evaluation", title: "Evaluación", description: "Ponte a prueba", icon: FileText },
  { id: "cert", title: "Finalización", description: "Logro obtenido", icon: Award },
];

export function StepperShowcase() {
  const [activeNode, setActiveNode] = useState(0); // El nodo resaltado visualmente
  const [visibleContent, setVisibleContent] = useState(0); // El contenido que se muestra abajo
  const [completedNodes, setCompletedNodes] = useState<number[]>([]);
  const [filledLines, setFilledLines] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = async () => {
    if (activeNode >= STEPS.length - 1 || isAnimating) return;
    const nextIndex = activeNode + 1;

    // Si el usuario simplemente está avanzando sobre pasos que ya completó, 
    // navegamos instantáneamente sin animación lenta.
    if (completedNodes.includes(activeNode) && filledLines.includes(activeNode)) {
      setActiveNode(nextIndex);
      setVisibleContent(nextIndex);
      return;
    }

    // Iniciar secuencia de animación controlada y continua
    setIsAnimating(true);

    // 1. Confirmar el paso actual (180ms animación + margen)
    setCompletedNodes(prev => [...new Set([...prev, activeNode])]);
    await new Promise(resolve => setTimeout(resolve, 200));

    // 2. Llenar suavemente la línea hacia el siguiente paso
    setFilledLines(prev => [...new Set([...prev, activeNode])]);
    await new Promise(resolve => setTimeout(resolve, 350)); // Tiempo alineado con la duración de la línea

    // 3 y 4. Activar el siguiente nodo (icono y texto cambian)
    setActiveNode(nextIndex);
    await new Promise(resolve => setTimeout(resolve, 150));

    // 5 y 6. Mostrar el contenido del nuevo paso con transición
    setVisibleContent(nextIndex);
    await new Promise(resolve => setTimeout(resolve, 250)); // Esperar a que el contenido aparezca

    setIsAnimating(false);
  };

  const handlePrev = async () => {
    if (activeNode > 0 && !isAnimating) {
      setIsAnimating(true);
      const prevIndex = activeNode - 1;
      
      // Retraer línea suavemente hacia atrás
      setFilledLines(prev => prev.filter(line => line !== prevIndex));
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Desmarcar el nodo actual como completado
      setCompletedNodes(prev => prev.filter(node => node !== activeNode));
      
      setActiveNode(prevIndex);
      setVisibleContent(prevIndex);
      await new Promise(resolve => setTimeout(resolve, 250));
      
      setIsAnimating(false);
    }
  };

  const handleStepClick = async (index: number) => {
    if (isAnimating || index === activeNode) return;
    
    if (index < activeNode) {
      setIsAnimating(true);
      
      // Retraer todas las líneas posteriores al nodo destino
      setFilledLines(prev => prev.filter(line => line < index));
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Desmarcar los nodos posteriores
      setCompletedNodes(prev => prev.filter(node => node <= index));
      
      setActiveNode(index);
      setVisibleContent(index);
      await new Promise(resolve => setTimeout(resolve, 250));
      
      setIsAnimating(false);
    }
  };

  return (
    <div className="p-8 rounded-xl border border-border bg-card shadow-sm">
        <div className="sr-only" aria-live="polite">
          Paso {STEPS[activeNode].title} en curso. Paso {activeNode + 1} de {STEPS.length}.
        </div>

        <div className="w-full">
          {/* Vista Desktop / Tablet */}
          <ol className="hidden md:flex items-start justify-between w-full relative">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedNodes.includes(index);
              const isActive = index === activeNode;
              const isPending = index > activeNode && !completedNodes.includes(index);

              return (
                <li 
                  key={step.id} 
                  className="flex-1 relative flex flex-col items-center group"
                  aria-current={isActive ? "step" : undefined}
                >
                  {/* Conector Line */}
                  {index < STEPS.length - 1 && (
                    <div className="absolute top-[24px] left-[50%] right-[-50%] h-[3px] bg-neutral-200 dark:bg-neutral-800 z-0">
                      <motion.div 
                        className="h-full bg-primary-400 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: filledLines.includes(index) ? 1 : 0 
                        }}
                        transition={{ ease: "easeInOut", duration: 0.35 }}
                      />
                    </div>
                  )}

                  {/* Nodo Squircle Interactivo */}
                  <motion.button
                    onClick={() => handleStepClick(index)}
                    disabled={isPending || isAnimating}
                    aria-disabled={isPending || isAnimating}
                    animate={
                      isCompleted && !isActive ? { scale: [1, 0.95, 1] } : { scale: 1 }
                    }
                    transition={{ duration: 0.18, ease: "easeInOut" }}
                    className={cn(
                      "size-12 rounded-full flex items-center justify-center relative transition-all duration-300 border-2 outline-none z-10",
                      isActive ? "ring-4 ring-primary/20 dark:ring-primary/40 ring-offset-0" : "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isCompleted || isActive
                        ? "bg-primary-400 border-primary-400 text-white shadow-md shadow-primary-400/20" 
                        : "bg-background border-neutral-200 dark:border-neutral-800 text-muted-foreground",
                      isPending ? "cursor-not-allowed" : "cursor-pointer hover:border-primary-400/50"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isCompleted || isActive ? "active" : "pending"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <Icon className="size-5 stroke-[2px]" />
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>

                  {/* Textos inferiores */}
                  <div className="mt-3 text-center z-10">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                      isActive || isCompleted ? "text-primary-400" : "text-muted-foreground"
                    )}>
                      Paso {index + 1}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Vista Móvil simplificada */}
          <div className="md:hidden flex items-center justify-between gap-4 w-full">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Paso {activeNode + 1} de {STEPS.length}
            </span>
            
            <div className="flex-1 h-2 bg-primary-50 dark:bg-primary-900/40 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-primary-400 origin-left w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (activeNode + 1) / STEPS.length }}
                transition={{ ease: "easeInOut", duration: 0.35 }}
              />
            </div>

            <span className="text-sm font-bold text-foreground whitespace-nowrap min-w-[36px] text-right">
              {Math.round(((activeNode + 1) / STEPS.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Contenido Dinámico del Paso */}
        <div className="mt-12 p-8 rounded-lg bg-surface border border-border/60 min-h-[160px] flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={visibleContent}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ ease: "easeOut", duration: 0.25 }}
              className="text-center"
            >
              <h4 className="text-base font-bold text-foreground mb-2">
                Contenido de {STEPS[visibleContent].title}
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Este es el paso interactivo correspondiente a la sección de {STEPS[visibleContent].title.toLowerCase()}. Completa las tareas indicadas en esta sección antes de avanzar.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botones de Navegación */}
        <div className="mt-8 flex justify-between items-center gap-4">
          <Button
            variant="neutral"
            onClick={handlePrev}
            disabled={visibleContent === 0 || isAnimating}
            leftIcon={<ArrowLeft className="size-4" />}
          >
            Anterior
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isAnimating || visibleContent === STEPS.length - 1}
            rightIcon={visibleContent !== STEPS.length - 1 ? <ArrowRight className="size-4" /> : <Check className="size-4" />}
          >
            {visibleContent === STEPS.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </div>
  );
}
