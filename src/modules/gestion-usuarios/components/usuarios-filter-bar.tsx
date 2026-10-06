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
import {
  SEDES_CATALOGO,
  APLICACIONES_CATALOGO,
  ESTADOS_USUARIO,
  ROLES_APLICACION,
  ROL_APLICACION_SEDE,
  ROLES_POR_APLICACION,
} from "../data/usuarios-data";

interface UsuariosFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
  selectedSede: string;
  onSedeChange: (value: string) => void;
  selectedApp: string;
  onAppChange: (value: string) => void;
  selectedRol: string;
  onRolChange: (value: string) => void;
  filterSinAccesos?: boolean;
  onFilterSinAccesosChange?: (value: boolean) => void;
}

export function UsuariosFilterBar({
  searchTerm,
  onSearchChange,
  selectedEstado,
  onEstadoChange,
  selectedSede,
  onSedeChange,
  selectedApp,
  onAppChange,
  selectedRol,
  onRolChange,
  filterSinAccesos = false,
  onFilterSinAccesosChange,
}: UsuariosFilterBarProps) {
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedEstado !== "Todos" ||
    selectedApp !== "Todas" ||
    selectedSede !== "Todas" ||
    selectedRol !== "Todos" ||
    filterSinAccesos;

  const handleReset = () => {
    onSearchChange("");
    onEstadoChange("Todos");
    onAppChange("Todas");
    onSedeChange("Todas");
    onRolChange("Todos");
    onFilterSinAccesosChange?.(false);
  };

  // Roles dependientes de Aplicación y contextualizados por ROL_APLICACION_SEDE
  const availableRoles = React.useMemo(() => {
    if (selectedApp === "Todas" || selectedApp === "all" || !selectedApp) {
      return [];
    }

    const appRoles = ROLES_APLICACION.filter((ra) => ra.aplicacionNombre === selectedApp);

    // Si hay una sede específica seleccionada, filtrar según ROL_APLICACION_SEDE
    if (selectedSede !== "Todas" && selectedSede !== "all" && selectedSede) {
      const sedeEntry = SEDES_CATALOGO.find((s) => s.nombre === selectedSede);
      if (sedeEntry) {
        const allowedIds = ROL_APLICACION_SEDE.filter(
          (ras) => ras.sedeId === sedeEntry.id || ras.sedeNombre === selectedSede
        ).map((ras) => ras.rolAplicacionId);

        if (allowedIds.length > 0) {
          const filtered = appRoles.filter((ra) => allowedIds.includes(ra.id)).map((ra) => ra.rolNombre);
          if (filtered.length > 0) return Array.from(new Set(filtered));
        }
      }
    }

    if (appRoles.length > 0) {
      return Array.from(new Set(appRoles.map((ra) => ra.rolNombre)));
    }

    return ROLES_POR_APLICACION[selectedApp] || [];
  }, [selectedApp, selectedSede]);

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-end gap-3.5 w-full">
        {/* SearchInput principal */}
        <div className="flex-1 min-w-[340px] max-w-[500px]">
          <Search
            placeholder="Buscar por nombre, número de documento o correo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            className="w-full h-9 text-sm"
          />
        </div>

        {/* Filtro por Estado */}
        <div className="w-[170px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Estado</label>
          <Combobox
            value={selectedEstado}
            onValueChange={(val) => {
              if (val) onEstadoChange(val);
            }}
          >
            <ComboboxInput placeholder="Todos los estados" showClear={false} className="w-full h-9 text-xs" />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todos">Todos los estados</ComboboxItem>
                {ESTADOS_USUARIO.map((est) => (
                  <ComboboxItem key={est} value={est}>
                    {est}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Filtro por Sede */}
        <div className="w-[240px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Sede</label>
          <Combobox
            value={selectedSede}
            onValueChange={(val) => {
              if (val) {
                onSedeChange(val);
                // Si el rol ya no es válido para la combinación sede-app, resetear
                onRolChange("Todos");
              }
            }}
          >
            <ComboboxInput placeholder="Todas las sedes" showClear={false} className="w-full h-9 text-xs" />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todas">Todas las sedes</ComboboxItem>
                {SEDES_CATALOGO.map((sede) => (
                  <ComboboxItem key={sede.id} value={sede.nombre}>
                    {sede.nombre}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Filtro por Aplicación */}
        <div className="w-[230px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Aplicación</label>
          <Combobox
            value={selectedApp}
            onValueChange={(val) => {
              if (val) {
                onAppChange(val);
                onRolChange("Todos"); // Dependiente: resetear rol al cambiar aplicación
              }
            }}
          >
            <ComboboxInput placeholder="Todas las aplicaciones" showClear={false} className="w-full h-9 text-xs" />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todas">Todas las aplicaciones</ComboboxItem>
                {APLICACIONES_CATALOGO.map((app) => (
                  <ComboboxItem key={app.id} value={app.nombre}>
                    {app.nombre}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Filtro por Rol (Dependiente de Aplicación y Sede) */}
        <div className="w-[260px] shrink-0 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Rol</label>
          <Combobox
            value={selectedRol}
            onValueChange={(val) => {
              if (val) onRolChange(val);
            }}
            disabled={selectedApp === "Todas" || selectedApp === "all" || !selectedApp}
          >
            <ComboboxInput
              placeholder={
                selectedApp === "Todas" || !selectedApp
                  ? "Elija aplicación primero"
                  : "Todos los roles"
              }
              showClear={false}
              className="w-full h-9 text-xs"
            />
            <ComboboxContent className="min-w-full">
              <ComboboxList>
                <ComboboxItem value="Todos">Todos los roles</ComboboxItem>
                {availableRoles.map((rol) => (
                  <ComboboxItem key={rol} value={rol}>
                    {rol}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      {/* Chips de Filtros Activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground font-medium mr-1">Filtros activos:</span>

          {searchTerm && (
            <DataChip
              label={`Búsqueda: ${searchTerm}`}
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
          {selectedSede !== "Todas" && (
            <DataChip
              label={`Sede: ${selectedSede}`}
              removable
              onRemove={() => onSedeChange("Todas")}
              className="bg-warning/10 border-warning/30 text-warning-600 dark:text-warning-400 hover:bg-warning/20"
            />
          )}
          {selectedApp !== "Todas" && (
            <DataChip
              label={`Aplicación: ${selectedApp}`}
              removable
              onRemove={() => {
                onAppChange("Todas");
                onRolChange("Todos");
              }}
              className="bg-info/10 border-info/30 text-info-600 dark:text-info-400 hover:bg-info/20"
            />
          )}
          {selectedRol !== "Todos" && (
            <DataChip
              label={`Rol: ${selectedRol}`}
              removable
              onRemove={() => onRolChange("Todos")}
              className="bg-secondary-50 border-secondary-300 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-300 hover:bg-secondary-100"
            />
          )}
          {filterSinAccesos && (
            <DataChip
              label="Accesos: Sin accesos"
              removable
              onRemove={() => onFilterSinAccesosChange?.(false)}
              className="bg-warning/10 border-warning/30 text-warning-700 dark:text-warning-400 hover:bg-warning/20"
            />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs h-7 px-2 ml-auto text-muted-foreground hover:text-foreground"
          >
            Limpiar todos
          </Button>
        </div>
      )}
    </div>
  );
}
