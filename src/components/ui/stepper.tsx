import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
  completedSteps?: number[];
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, activeStep, completedSteps = [], onStepClick }: StepperProps) {
  const filledLines = completedSteps;

  return (
    <div className="w-full">
      {/* Vista Desktop / Tablet */}
      <ol className="hidden md:flex items-start justify-between w-full relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(index) || index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep && !isCompleted;

          return (
            <li
              key={step.id}
              className="flex-1 relative flex flex-col items-center group"
              aria-current={isActive ? "step" : undefined}
            >
              {/* Conector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-[24px] left-[50%] right-[-50%] h-[3px] bg-neutral-200 dark:bg-neutral-800 z-0">
                  <motion.div
                    className="h-full bg-primary-400 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: filledLines.includes(index) || activeStep > index ? 1 : 0
                    }}
                    transition={{ ease: "easeInOut", duration: 0.35 }}
                  />
                </div>
              )}

              {/* Nodo Squircle Interactivo */}
              <motion.button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={isPending || !onStepClick}
                aria-disabled={isPending || !onStepClick}
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
                  isPending || !onStepClick ? (isPending ? "cursor-not-allowed" : "cursor-default") : "cursor-pointer hover:border-primary-400/50"
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
                  {step.title}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Vista Móvil simplificada */}
      <div className="md:hidden flex items-center justify-between gap-4 w-full">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Paso {activeStep + 1} de {steps.length}
        </span>

        <div className="flex-1 h-2 bg-primary-50 dark:bg-primary-900/40 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-primary-400 origin-left w-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (activeStep + 1) / steps.length }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
          />
        </div>

        <span className="text-sm font-bold text-foreground whitespace-nowrap min-w-[36px] text-right">
          {Math.round(((activeStep + 1) / steps.length) * 100)}%
        </span>
      </div>
    </div>
  );
}

