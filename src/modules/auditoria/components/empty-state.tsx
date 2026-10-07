"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search, FileSearch, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditEmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
  className?: string;
}

export function AuditEmptyState({
  title = "No se encontraron registros",
  description = "Prueba modificando los criterios de búsqueda o limpiando los filtros seleccionados.",
  onResetFilters,
  className,
}: AuditEmptyStateProps) {
  return (
    <div
      className={cn(
        "w-full py-12 px-6 rounded-2xl border border-dashed border-border/80 bg-surface/50 flex flex-col items-center justify-center text-center gap-3",
        className
      )}
    >
      <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground shadow-xs">
        <FileSearch className="size-7" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {onResetFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-2 text-xs gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Restablecer filtros
        </Button>
      )}
    </div>
  );
}
