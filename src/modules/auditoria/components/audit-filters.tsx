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
import { DateRangeField } from "@/components/ui/date-range-field";
import { DataChip } from "@/components/ui/data-display";
import { RotateCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";

export interface FilterSelectOption {
  label: string;
  value: string;
}

export interface FilterSelectConfig {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  width?: string;
}

export interface ActiveChipItem {
  id: string;
  label: string;
  onRemove: () => void;
}

interface AuditFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  selectFilters?: FilterSelectConfig[];
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
  activeChips?: ActiveChipItem[];
  className?: string;
}

export function AuditFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  selectFilters = [],
  dateRange,
  onDateRangeChange,
  hasActiveFilters,
  onReset,
  activeChips = [],
  className,
}: AuditFiltersProps) {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Barra de controles interactivos */}
      <div className="flex flex-wrap items-end gap-3 w-full">
        {/* Input de Búsqueda */}
        <div className="flex-1 min-w-[240px] max-w-[380px] flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Búsqueda</label>
          <Search
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            size="sm"
            className="w-full text-xs"
          />
        </div>

        {/* Dropdowns de Filtro */}
        {selectFilters.map((flt) => (
          <div
            key={flt.id}
            className="shrink-0 flex flex-col gap-1.5"
            style={{ width: flt.width || "170px" }}
            title={`Filtrar resultados por ${flt.label.toLowerCase()}`}
          >
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">{flt.label}</label>
            <Combobox
              value={flt.value}
              onValueChange={(val) => {
                if (val) flt.onChange(val);
              }}
            >
              <ComboboxInput
                placeholder={flt.placeholder || flt.label}
                showClear={false}
                size="sm"
                className="w-full text-xs"
              />
              <ComboboxContent className="min-w-[max-content] z-50">
                <ComboboxList>
                  {flt.options.map((opt) => (
                    <ComboboxItem key={opt.value} value={opt.value} className="whitespace-nowrap pr-6">
                      {opt.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        ))}

        {/* Selector de Rango de Fechas si aplica */}
        {onDateRangeChange && (
          <div className="shrink-0 min-w-[210px] flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Rango de fechas</label>
            <DateRangeField
              value={dateRange}
              onChange={onDateRangeChange}
              size="sm"
              placeholder="Seleccionar fechas"
              clearable
              className="w-full text-xs"
            />
          </div>
        )}

        {/* Botón Reset / Limpiar */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters && activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground font-medium">Filtros aplicados:</span>
          {activeChips.map((chip) => (
            <DataChip
              key={chip.id}
              label={chip.label}
              onRemove={chip.onRemove}
              removable
              className="text-xs"
            />
          ))}
        </div>
      )}
    </div>
  );
}
