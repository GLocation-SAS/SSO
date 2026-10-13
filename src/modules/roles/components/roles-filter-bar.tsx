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
import { Search } from "@/components/ui/search";
import { X } from "lucide-react";
import { AplicacionRef } from "../data/roles-data";

interface RolesFilterBarProps {
  aplicaciones: AplicacionRef[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedApp: string;
  onAppChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
  filterSinRecursos: boolean;
  onFilterSinRecursosChange: (value: boolean) => void;
}

export function RolesFilterBar({
  aplicaciones,
  searchTerm,
  onSearchChange,
  selectedApp,
  onAppChange,
  selectedEstado,
  onEstadoChange,
  filterSinRecursos,
  onFilterSinRecursosChange,
}: RolesFilterBarProps) {
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedApp !== "Todas" ||
    selectedEstado !== "Todos" ||
    filterSinRecursos;

  const handleReset = () => {
    onSearchChange("");
    onAppChange("Todas");
    onEstadoChange("Todos");
    onFilterSinRecursosChange(false);
  };

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      <div className="flex flex-wrap items-end gap-3.5 w-full">
        {/* Buscador de roles */}
        <div className="flex-1 min-w-[260px] max-w-[420px] flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Buscar rol
          </label>
          <Search
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            size="sm"
            className="w-full text-xs"
          />
        </div>

        {/* Filtro por Aplicación */}
        <div className="w-[220px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Aplicación
          </label>
          <Combobox
            value={selectedApp}
            onValueChange={(val) => {
              if (val) onAppChange(val);
            }}
          >
            <ComboboxInput
              placeholder="Todas las aplicaciones"
              showClear={false}
              size="sm"
              className="w-full text-xs"
            />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todas">Todas las aplicaciones</ComboboxItem>
                {aplicaciones.map((app) => (
                  <ComboboxItem key={app.id} value={app.id}>
                    {app.nombre} ({app.codigo})
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Filtro por Estado */}
        <div className="w-[180px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
                <ComboboxItem value="Activo">Activo</ComboboxItem>
                <ComboboxItem value="Inactivo">Inactivo</ComboboxItem>
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
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-9"
          >
            <X className="size-3.5" />
            <span>Restablecer</span>
          </Button>
        )}
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium">
            Filtros activos:
          </span>
          {searchTerm && (
            <DataChip
              label={`Búsqueda: "${searchTerm}"`}
              removable
              onRemove={() => onSearchChange("")}
              className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
            />
          )}
          {selectedApp !== "Todas" && (
            <DataChip
              label={`Aplicación: ${aplicaciones.find((a) => a.id === selectedApp)?.nombre || selectedApp
                }`}
              removable
              onRemove={() => onAppChange("Todas")}
              className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
            />
          )}
          {selectedEstado !== "Todos" && (
            <DataChip
              label={`Estado: ${selectedEstado}`}
              removable
              onRemove={() => onEstadoChange("Todos")}
              className={selectedEstado === "Activo" ? "bg-success/10 border-success/30 text-success-600 dark:text-success-400 hover:bg-success/20" : "bg-muted-foreground/10 border-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/20"}
            />
          )}
          {filterSinRecursos && (
            <DataChip
              label="Sin recursos configurados"
              removable
              onRemove={() => onFilterSinRecursosChange(false)}
              className="bg-warning/10 border-warning/30 text-warning-700 dark:text-warning-400 hover:bg-warning/20"
            />
          )}
        </div>
      )}
    </div>
  );
}
