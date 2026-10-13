"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { DataChip } from "@/components/ui/data-display";
import { AplicacionRef } from "../data/recursos-data";
import { RotateCcw } from "lucide-react";

interface RecursosFilterBarProps {
  aplicaciones: AplicacionRef[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedApp: string;
  onAppChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
  onReset: () => void;
}

export function RecursosFilterBar({
  aplicaciones,
  searchTerm,
  onSearchChange,
  selectedApp,
  onAppChange,
  selectedEstado,
  onEstadoChange,
  onReset,
}: RecursosFilterBarProps) {
  const hasActiveFilters =
    searchTerm !== "" || selectedApp !== "Todas" || selectedEstado !== "Todos";

  const selectedAppObj = aplicaciones.find((a) => a.id === selectedApp);
  const selectedAppLabel = selectedApp === "Todas" ? "Todas las aplicaciones" : selectedAppObj?.nombre || selectedApp;

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      <div className="flex flex-wrap items-end gap-3.5 w-full">
        {/* Buscador por nombre o código */}
        <div className="flex-1 min-w-[280px] max-w-[420px] flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Buscar recurso
          </label>
          <Search
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder="Buscar por nombre o código..."
            size="sm"
            className="w-full"
          />
        </div>

        {/* Filtro por Aplicación */}
        <div className="w-[230px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Aplicación
          </label>
          <Combobox
            value={selectedAppLabel}
            onValueChange={(val) => {
              if (!val || val === "Todas las aplicaciones") {
                onAppChange("Todas");
              } else {
                const found = aplicaciones.find((a) => a.nombre === val);
                onAppChange(found ? found.id : val);
              }
            }}
          >
            <ComboboxInput
              placeholder="Todas las aplicaciones"
              showClear={false}
              size="sm"
              className="w-full"
            />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todas las aplicaciones">
                  Todas las aplicaciones
                </ComboboxItem>
                {aplicaciones.map((app) => (
                  <ComboboxItem key={app.id} value={app.nombre}>
                    {app.nombre} ({app.codigo})
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Filtro por Estado */}
        <div className="w-[170px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Estado
          </label>
          <Combobox
            value={selectedEstado === "Todos" ? "Todos los estados" : selectedEstado}
            onValueChange={(val) => {
              if (!val || val === "Todos los estados") {
                onEstadoChange("Todos");
              } else {
                onEstadoChange(val);
              }
            }}
          >
            <ComboboxInput
              placeholder="Todos los estados"
              showClear={false}
              size="sm"
              className="w-full"
            />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todos los estados">Todos los estados</ComboboxItem>
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
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground h-9 px-3 gap-1.5 shrink-0 self-end"
          >
            <RotateCcw className="size-3.5" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
          <span className="text-[11px] font-medium text-muted-foreground">
            Filtros activos:
          </span>

          {searchTerm && (
            <DataChip
              label={`Búsqueda: "${searchTerm}"`}
              removable
              onRemove={() => onSearchChange("")}
              selected
            />
          )}

          {selectedApp !== "Todas" && (
            <DataChip
              label={`Aplicación: ${selectedAppLabel}`}
              removable
              onRemove={() => onAppChange("Todas")}
              selected
            />
          )}

          {selectedEstado !== "Todos" && (
            <DataChip
              label={`Estado: ${selectedEstado}`}
              removable
              onRemove={() => onEstadoChange("Todos")}
              selected
            />
          )}
        </div>
      )}
    </div>
  );
}

