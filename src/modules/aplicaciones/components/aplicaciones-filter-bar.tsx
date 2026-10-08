"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { DataChip } from "@/components/ui/data-display";
import { AplicacionItem } from "../data/aplicaciones-data";

interface AplicacionesFilterBarProps {
  aplicaciones: AplicacionItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
  filterAtencion?: boolean;
  onFilterAtencionChange?: (value: boolean) => void;
}

export function AplicacionesFilterBar({
  aplicaciones,
  searchTerm,
  onSearchChange,
  selectedEstado,
  onEstadoChange,
  filterAtencion = false,
  onFilterAtencionChange,
}: AplicacionesFilterBarProps) {
  const hasActiveFilters =
    searchTerm !== "" || selectedEstado !== "Todos" || filterAtencion;

  const handleReset = () => {
    onSearchChange("");
    onEstadoChange("Todos");
    onFilterAtencionChange?.(false);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-end gap-3.5 w-full">
        {/* Combobox de Búsqueda de aplicación */}
        <div className="flex-1 min-w-[280px] max-w-[450px]">
          <Combobox
            value={searchTerm}
            onValueChange={(val) => {
              if (val !== null) onSearchChange(val);
            }}
          >
            <ComboboxInput
              placeholder="Buscar o seleccionar aplicación..."
              showClear={true}
              size="sm"
              className="w-full text-xs"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                {aplicaciones.map((app) => (
                  <ComboboxItem key={app.id} value={app.nombre}>
                    {app.nombre}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Filtro por Estado */}
        <div className="w-[200px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">
            Estado
          </label>
          <Combobox
            value={selectedEstado}
            onValueChange={(val) => {
              if (val) onEstadoChange(val);
            }}
          >
            <ComboboxInput
              placeholder="Todos los estados"
              showClear={false}
              size="sm"
              className="w-full text-xs"
            />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todos">Todos los estados</ComboboxItem>
                <ComboboxItem value="Activa">Activa</ComboboxItem>
                <ComboboxItem value="Inactiva">Inactiva</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Botón Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Filtros activos:</span>
          {searchTerm && (
            <DataChip
              label={`Búsqueda: "${searchTerm}"`}
              removable
              onRemove={() => onSearchChange("")}
              className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
            />
          )}
          {selectedEstado !== "Todos" && (
            <DataChip
              label={`Estado: ${selectedEstado}`}
              removable
              onRemove={() => onEstadoChange("Todos")}
              className="bg-success/10 border-success/30 text-success-600 dark:text-success-400 hover:bg-success/20"
            />
          )}
          {filterAtencion && (
            <DataChip
              label="Requieren atención"
              removable
              onRemove={() => onFilterAtencionChange?.(false)}
              className="bg-warning/10 border-warning/30 text-warning-600 dark:text-warning-400 hover:bg-warning/20"
            />
          )}
        </div>
      )}
    </div>
  );
}
