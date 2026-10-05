"use client"

/**
 * map-geospatial.tsx
 * ───────────────────
 * Sistema de componentes geoespaciales para MINEDEC GEOportal.
 * Diseñados para interacciones con mapas (Mapbox / Leaflet / Cesium)
 * y paneles de capas geográficas.
 */

import * as React from "react"
import {
  Search, Layers, Eye, EyeOff, Sliders, MapPin, Maximize2, Minimize2,
  ZoomIn, ZoomOut, Compass, Info, Check, ChevronRight, X, Filter,
  School, Home, Radio, HelpCircle, Layers3, Globe, RefreshCw, Map as MapIcon, PersonStanding
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search as SearchInput } from "@/components/ui/search"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── 1. Map Control Button & Group ───────────────────────────────────────────

export interface MapControlButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function MapControlButton({
  icon, label, active, disabled, onClick, className
}: MapControlButtonProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
            className={cn(
              "group size-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm border outline-none",
              active
                ? "bg-primary-700 text-white border-transparent shadow-primary/20"
                : "bg-surface text-muted-foreground border-border hover:bg-primary-300 hover:text-white hover:border-transparent",
              disabled && "opacity-40 cursor-not-allowed",
              className
            )}
          >
            {/* Si el icono ya trae clases de texto (ej. text-muted-foreground), forzamos currentColor en hover/active con [&>svg] o eliminamos el color base del icono si se lo estamos pasando en map-geospatial */}
            <div className={cn("flex items-center justify-center [&>svg]:size-4", 
              active ? "[&>svg]:text-white" : "[&>svg]:text-muted-foreground group-hover:[&>svg]:text-white"
            )}>
              {icon}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs font-semibold">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function MapControlGroup({
  children,
  vertical = true,
  className
}: {
  children: React.ReactNode
  vertical?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "p-1 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-lg flex gap-1 z-20",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── 2. Map Search Component ──────────────────────────────────────────────────

export function MapSearch({
  placeholder = "Buscar predio, colegio o dirección...",
  onSearch,
  className
}: {
  placeholder?: string
  onSearch?: (term: string) => void
  className?: string
}) {
  return (
    <div className={cn("relative w-full max-w-md z-20", className)}>
      <SearchInput 
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="rounded-full bg-surface/95 backdrop-blur-md shadow-lg"
        size="lg"
      />
    </div>
  )
}

// ─── 3. Layer Item & Legend ───────────────────────────────────────────────────

export interface LayerItemProps {
  id: string
  name: string
  category?: string
  visible: boolean
  opacity?: number
  colorToken?: string
  onToggleVisibility: (visible: boolean) => void
  onOpacityChange?: (opacity: number) => void
}

export function LayerItem({
  name, category, visible, opacity = 100, colorToken = "bg-primary",
  onToggleVisibility, onOpacityChange
}: LayerItemProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="w-full rounded-xl border border-border/60 bg-surface/50 p-3 space-y-2 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={cn("size-3 rounded-full shrink-0", colorToken)} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{name}</p>
            {category && <p className="text-[10px] text-muted-foreground">{category}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  aria-label="Ajustar transparencia y opacidad de la capa"
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                  <Sliders className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs font-semibold">
                Opacidad y Ajustes
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onToggleVisibility(!visible)}
                  aria-label={visible ? "Ocultar esta capa del mapa" : "Mostrar esta capa en el mapa"}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    visible ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs font-semibold">
                {visible ? "Ocultar capa" : "Mostrar capa"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {expanded && visible && (
        <div className="pt-2 border-t border-border/40 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Opacidad</span>
            <span className="font-bold text-foreground">{opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => onOpacityChange?.(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}

export function LayerLegend({
  title = "Simbología de Capa",
  items = []
}: {
  title?: string
  items: { label: string; color: string }[]
}) {
  return (
    <div className="p-3 rounded-xl bg-surface border border-border/60 space-y-2 text-left">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-sm shrink-0", it.color)} />
            <span className="text-xs text-foreground truncate">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. Layers Panel & Basemap Selector ───────────────────────────────────────

export function BasemapSelector({
  activeMap,
  onSelectMap
}: {
  activeMap: string
  onSelectMap: (id: string) => void
}) {
  const mapGroups = [
    {
      title: "ESTÁNDAR",
      maps: [
        { id: "calle", label: "Calle", bg: "bg-surface border-2 border-primary/10" },
        { id: "satelite", label: "Satélite", bg: "bg-[#2b3a32]" },
        { id: "relieve", label: "Relieve", bg: "bg-[#d3e5c7]" },
      ]
    },
    {
      title: "GOOGLE",
      maps: [
        { id: "google-calle", label: "Google Calle", bg: "bg-[#fcf7ed] border border-border" },
        { id: "google-satelite", label: "Google Satélite", bg: "bg-[#253229]" },
        { id: "google-hibrido", label: "Google Híbrido", bg: "bg-[#38423d]" },
        { id: "google-terreno", label: "Google Terreno", bg: "bg-[#e2e8db]" },
      ]
    }
  ]

  return (
    <div className="flex flex-col w-full bg-surface rounded-xl">
      <div className="mb-4">
        <h3 className="text-lg font-bold font-heading text-foreground">Mapa base</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Selecciona el estilo de mapa que deseas usar.</p>
      </div>

      <RadioGroup
        value={activeMap}
        onValueChange={onSelectMap}
        className="flex flex-col gap-6"
      >
        {mapGroups.map((group, gIdx) => (
          <div key={group.title} className={cn("flex flex-col gap-1", gIdx > 0 && "pt-6 border-t border-border")}>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-3">
              {group.title}
            </h4>
            
            <div className="flex flex-col">
              {group.maps.map((m) => {
                const isActive = activeMap === m.id;
                return (
                  <label
                    key={m.id}
                    className={cn(
                      "flex items-center w-full p-3 rounded-xl transition-all text-left cursor-pointer",
                      isActive
                        ? "bg-primary/5"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <div className={cn("w-14 h-9 rounded-md shrink-0 shadow-sm relative overflow-hidden", m.bg)}>
                      {/* Generamos unos trazos decorativos para simular un mapa sin usar imágenes externas */}
                      {(m.id.includes("calle") || m.id.includes("relieve") || m.id.includes("terreno")) && (
                        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <path d="M0 20 Q 25 40 50 10 T 100 30" fill="none" stroke="currentColor" strokeWidth="3" className="text-info" />
                           <path d="M20 0 L 40 100 M 70 0 L 50 100 M 0 60 L 100 80" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
                        </svg>
                      )}
                      {(m.id.includes("satelite") || m.id.includes("hibrido")) && (
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black mix-blend-overlay" />
                      )}
                    </div>
                    
                    <span className="ml-4 text-sm font-semibold flex-1 text-foreground">
                      {m.label}
                    </span>
                    
                    <RadioGroupItem value={m.id} size="lg" className="ml-4 shrink-0" />
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export function LayersPanel({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("w-full max-w-xs rounded-2xl border border-border bg-surface/95 backdrop-blur-md p-4 shadow-xl space-y-4 text-left z-20", className)}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <Layers className="size-4 text-primary" />
          <span>Gestor de Capas</span>
        </div>
        <Badge variant="primary" appearance="soft">3 activas</Badge>
      </div>
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  )
}

// ─── 5. Map Popup & Map Info Drawer ──────────────────────────────────────────

export function MapPopup({
  title,
  subtitle,
  category,
  onClose,
  onViewDetails
}: {
  title: string
  subtitle?: string
  category?: string
  onClose?: () => void
  onViewDetails?: () => void
}) {
  return (
    <div className="w-64 rounded-2xl border border-border bg-surface shadow-2xl p-4 space-y-3 text-left relative animate-in zoom-in-95 duration-200">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>

      <div className="space-y-1">
        {category && <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{category}</span>}
        <h4 className="text-sm font-bold text-foreground leading-snug">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <Button variant="primary" size="sm" className="w-full text-xs" onClick={onViewDetails}>
        Ver Ficha Técnica <ChevronRight className="size-3.5 ml-1" />
      </Button>
    </div>
  )
}

// ─── 6. Scale & Coordinates Indicators ────────────────────────────────────────

export function ScaleIndicator({ scale = "1:50,000", distance = "500 m" }: { scale?: string; distance?: string }) {
  return (
    <div className="px-3 py-1.5 rounded-xl border border-border/80 bg-surface/90 backdrop-blur-md shadow-sm text-[11px] font-mono font-semibold text-foreground flex items-center gap-3">
      <span>{scale}</span>
      <div className="flex flex-col items-center">
        <div className="w-12 h-1 bg-foreground rounded-full" />
        <span className="text-[9px] text-muted-foreground mt-0.5">{distance}</span>
      </div>
    </div>
  )
}

export function CoordinatesDisplay({ lat = "-0.1807", lng = "-78.4678" }: { lat?: string; lng?: string }) {
  return (
    <div className="px-3 py-1.5 rounded-xl border border-border/80 bg-surface/90 backdrop-blur-md shadow-sm text-[11px] font-mono text-muted-foreground flex items-center gap-2">
      <Globe className="size-3 text-primary shrink-0" />
      <span>LAT: <strong className="text-foreground">{lat}</strong></span>
      <span>LNG: <strong className="text-foreground">{lng}</strong></span>
    </div>
  )
}

// ─── 7. Map Status Bar ────────────────────────────────────────────────────────

export interface MapStatusBarProps {
  coordinateSystem?: string
  cursorX?: string | number
  cursorY?: string | number
  territorialUnit?: string
  lastUpdated?: string
  className?: string
}

export function MapStatusBar({
  coordinateSystem = "WGS84 (EPSG:4326)",
  cursorX = "-82.27737",
  cursorY = "-0.11704",
  territorialUnit = "Ecuador",
  lastUpdated = "14/08/2026, 12:05 p. m.",
  className
}: MapStatusBarProps) {
  return (
    <div className={cn("w-full bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-medium text-muted-foreground z-20 overflow-hidden min-h-[44px]", className)}>
      <div className="flex items-center gap-3 sm:gap-4 shrink truncate">
        <div className="flex items-center gap-1.5 shrink-0" title="Sistema de coordenadas">
          <Globe className="size-4 text-primary shrink-0" />
          <span className="hidden md:inline">Sistema de coordenadas:</span>
          <span className="hidden sm:inline font-semibold">{coordinateSystem}</span>
          <span className="sm:hidden font-semibold">EPSG:4326</span>
        </div>
        <div className="w-px h-4 bg-border/60 hidden sm:block shrink-0" />
        <div className="flex items-center gap-1.5 font-mono shrink-0" title="Coordenadas del cursor">
          <MapPin className="size-4 text-primary shrink-0" />
          <span>X: <span className="text-foreground font-bold">{cursorX}</span></span>
          <span className="text-border/60">|</span>
          <span>Y: <span className="text-foreground font-bold">{cursorY}</span></span>
        </div>
        <div className="w-px h-4 bg-border/60 hidden sm:block shrink-0" />
        <div className="flex items-center gap-1.5 shrink truncate" title="Unidad territorial activa">
          <MapIcon className="size-4 text-primary shrink-0" />
          <span className="hidden md:inline shrink-0">Unidad territorial:</span> 
          <span className="text-foreground font-semibold truncate">{territorialUnit}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 shrink-0 ml-3" title="Última actualización">
        <RefreshCw className="size-4 text-primary shrink-0" />
        <span className="hidden md:inline">Actualizado:</span> <span className="text-foreground font-semibold hidden sm:inline">{lastUpdated}</span>
      </div>
    </div>
  )
}

// ─── 8. Map Container (Envoltorio Canvas Interactivo) ─────────────────────────

export function MapContainer({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) {
  const [cursor, setCursor] = React.useState({ x: -82.27737, y: -0.11704 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Dynamic coordinate calculation for showcase based on mouse movement
    const rect = e.currentTarget.getBoundingClientRect()
    const x = -82.27737 + ((e.clientX - rect.left) / rect.width) * 0.1
    const y = -0.11704 - ((e.clientY - rect.top) / rect.height) * 0.1
    setCursor({ x: Number(x.toFixed(5)), y: Number(y.toFixed(5)) })
  }

  return (
    <div 
      className={cn("relative w-full h-[520px] rounded-3xl border border-border overflow-hidden bg-surface shadow-2xl flex flex-col justify-between", className)}
      onMouseMove={handleMouseMove}
    >
      {/* Grid simulada de Mapa interactivo */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Map Layer Bar */}
      <div className="relative z-10 flex items-start justify-between gap-4 w-full p-4">
        <MapSearch />
        <ScaleIndicator />
      </div>

      {/* Floating Center Elements / Map Pins */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative pointer-events-auto">
          <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 animate-bounce">
            <School className="size-5" />
          </div>
          <div className="size-32 rounded-full border-2 border-dashed border-primary/40 bg-primary/5 absolute -top-11 -left-11 pointer-events-none animate-pulse" />
        </div>
      </div>

      {/* Bottom Map Controls Bar */}
      <div className="relative z-10 flex items-end justify-end gap-4 w-full p-4 mt-auto">
        <MapControlGroup vertical>
          <MapControlButton icon={<ZoomIn />} label="Acercar" />
          <MapControlButton icon={<ZoomOut />} label="Alejar" />
          <MapControlButton active icon={<Compass />} label="Norte" />
          <MapControlButton icon={<PersonStanding />} label="Street View" />
          <MapControlButton icon={<Maximize2 />} label="Pantalla Completa" />
        </MapControlGroup>
      </div>

      {/* Map Status Bar at the bottom */}
      <MapStatusBar cursorX={cursor.x} cursorY={cursor.y} />

      {children}
    </div>
  )
}
