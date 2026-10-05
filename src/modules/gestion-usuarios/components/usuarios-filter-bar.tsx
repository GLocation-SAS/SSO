"use client";

import * as React from "react";
import { Search } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem
} from "@/components/ui/combobox";
import {
  ChevronDown,
  FilterX,
  MapPin,
  AppWindow,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  SEDES_MINEDUC,
  APLICACIONES_MINEDUC,
  ESTADOS_USUARIO,
} from "../data/usuarios-data";

interface UsuariosFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedSede: string;
  onSedeChange: (val: string) => void;
  selectedApp: string;
  onAppChange: (val: string) => void;
  selectedEstado: string;
  onEstadoChange: (val: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export function UsuariosFilterBar({
  searchTerm,
  onSearchChange,
  selectedSede,
  onSedeChange,
  selectedApp,
  onAppChange,
  selectedEstado,
  onEstadoChange,
  onResetFilters,
  totalFiltered,
}: UsuariosFilterBarProps) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedSede !== "all" ||
    selectedApp !== "all" ||
    selectedEstado !== "all";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[240px]">
          <Search
            placeholder="Buscar por nombre, cédula o correo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            className="w-full"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro por Estado */}
          <div className="w-[140px]">
            <Combobox
              value={selectedEstado}
              onValueChange={(val) => { if(val) onEstadoChange(val) }}
            >
              <ComboboxInput placeholder="Estado" showClear={false} />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxItem value="all">Todos los estados</ComboboxItem>
                  {ESTADOS_USUARIO.map((est) => (
                    <ComboboxItem key={est} value={est}>
                      {est}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Filtro por Aplicación */}
          <div className="w-[160px]">
            <Combobox
              value={selectedApp}
              onValueChange={(val) => { if(val) onAppChange(val) }}
            >
              <ComboboxInput placeholder="Aplicación" showClear={false} />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxItem value="all">Todas las aplicaciones</ComboboxItem>
                  {APLICACIONES_MINEDUC.map((app) => (
                    <ComboboxItem key={app} value={app}>
                      {app}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Filtro por Sede */}
          <div className="w-[200px]">
            <Combobox
              value={selectedSede}
              onValueChange={(val) => { if(val) onSedeChange(val) }}
            >
              <ComboboxInput placeholder="Sede" showClear={false} />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxItem value="all">Todas las sedes</ComboboxItem>
                  {SEDES_MINEDUC.map((sede) => (
                    <ComboboxItem key={sede} value={sede}>
                      {sede}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Botón Reset si hay filtros aplicados */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="gap-1.5 h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <FilterX className="size-3.5" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Active filters indicators */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40 text-xs text-muted-foreground">
          <span className="font-medium mr-1">Filtros activos:</span>
          {searchTerm && (
            <Badge tone="primary" appearance="soft" size="sm" className="gap-1">
              Búsqueda: {searchTerm}
            </Badge>
          )}
          {selectedEstado !== "all" && (
            <Badge tone="neutral" appearance="soft" size="sm">
              Estado: {selectedEstado}
            </Badge>
          )}
          {selectedApp !== "all" && (
            <Badge tone="info" appearance="soft" size="sm">
              App: {selectedApp}
            </Badge>
          )}
          {selectedSede !== "all" && (
            <Badge tone="secondary" appearance="soft" size="sm">
              Sede: {selectedSede}
            </Badge>
          )}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {totalFiltered} resultados encontrados
          </span>
        </div>
      )}
    </div>
  );
}

