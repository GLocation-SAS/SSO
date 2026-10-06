"use client"

/**
 * data-display.tsx
 * ─────────────────
 * 13 componentes de Data Display para MINEDEC GEOportal Design System.
 * Todos usan exclusivamente tokens semánticos del sistema.
 *
 * Exports:
 *   BaseCard, InteractiveCard, KpiCard, InstitutionCard,
 *   LayerCard, RiskCard, DocumentCard, ReportCard,
 *   DataBadge, DataChip, MetadataList, StatusIndicator
 */

import * as React from "react"
import {
  MoreHorizontal, ChevronRight, TrendingUp, TrendingDown,
  Minus, Building2, MapPin, Users, BookOpen, Layers,
  Download, Share2, Eye, Link2, FileText, FileSpreadsheet,
  FileArchive, FileImage, FileVideo, FileAudio, FileCode,
  File, Globe, Map, AlertTriangle, Bell, CheckCircle2,
  XCircle, Clock, Loader2, Wifi, WifiOff, BarChart3,
  X, Plus, Info, Shield, Zap, MoreVertical, Copy, ShieldCheck, Calendar, GraduationCap, Ruler, Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─────────────────────────────────────────────────────────────────────────────
// 1. BASE CARD
// ─────────────────────────────────────────────────────────────────────────────

export interface BaseCardProps {
  title?: string
  description?: string
  cover?: React.ReactNode
  centered?: boolean
  footer?: React.ReactNode
  action?: React.ReactNode
  menu?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  className?: string
}

export function BaseCard({
  title, description, cover, centered, footer, action, menu, children, disabled, className,
}: BaseCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-surface shadow-sm transition-shadow duration-200 w-full overflow-hidden flex flex-col relative",
      disabled ? "opacity-50 pointer-events-none" : "hover:shadow-md",
      className
    )}>
      {cover && (
        <div className="w-full relative shrink-0">
          {cover}
        </div>
      )}

      <div className={cn("p-6 flex-1 flex flex-col", centered ? "items-center text-center" : "")}>
        {(title || menu) && (
          <div className={cn("flex w-full mb-1 gap-2", centered ? "justify-center relative items-center" : "items-start justify-between")}>
            {title && <h3 className={cn("font-bold text-foreground leading-tight", centered ? "text-lg mt-1" : "text-sm")}>{title}</h3>}
            {menu && <div className={cn("shrink-0", centered ? "absolute right-0 top-0" : "")}>{menu}</div>}
          </div>
        )}

        {description && (
          <p className={cn("text-xs text-muted-foreground mb-5", centered ? "max-w-[90%]" : "")}>{description}</p>
        )}

        {children && <div className="w-full mb-1">{children}</div>}
      </div>

      {(footer || action) && (
        <div className={cn(
          "px-6 py-4 flex items-center",
          centered ? "justify-center pb-6 pt-0" : "justify-between border-t border-border mt-auto"
        )}>
          {footer && <span className="text-xs text-muted-foreground shrink-0">{footer}</span>}
          {action && <div className={cn(centered && !footer ? "w-full" : "ml-auto")}>{action}</div>}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INTERACTIVE CARD
// ─────────────────────────────────────────────────────────────────────────────

export interface InteractiveCardProps {
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  decorativeIcon?: React.ReactNode
  meta?: React.ReactNode
  color?: "default" | "neutral" | "primary" | "info" | "warning" | "success" | "danger" | "purple"
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  hideChevron?: boolean
  isActive?: boolean
  borderless?: boolean
  shadowless?: boolean
  iconContainerClassName?: string
  activeInnerBgClassName?: string
}

const INTERACTIVE_COLORS: Record<string, string> = {
  default: "bg-surface border-border hover:border-transparent",
  neutral: "bg-muted/30 border-border hover:border-transparent",
  primary: "bg-primary/10 border-primary/20 hover:border-transparent",
  secondary: "bg-secondary/10 border-secondary/20 hover:border-transparent",
  info: "bg-info/10 border-info/20 hover:border-transparent",
  warning: "bg-warning/10 border-warning/20 hover:border-transparent",
  success: "bg-success/10 border-success/20 hover:border-transparent",
  danger: "bg-danger/10 border-danger/20 hover:border-transparent",
}

const INTERACTIVE_INNER_BG: Record<string, string> = {
  default: "bg-surface",
  neutral: "bg-muted/35 dark:bg-muted/20",
  primary: "bg-primary-50/80 dark:bg-primary-900/20",
  secondary: "bg-secondary-50/80 dark:bg-secondary-900/20",
  info: "bg-info-50/80 dark:bg-info-900/20",
  warning: "bg-warning-50/80 dark:bg-warning-900/20",
  success: "bg-success-50/80 dark:bg-success-900/20",
  danger: "bg-danger-50/80 dark:bg-danger-900/20",
}

const INTERACTIVE_INNER_BG_ACTIVE: Record<string, string> = {
  default: "bg-surface-secondary dark:bg-surface/90",
  neutral: "bg-muted/80 dark:bg-muted/60",
  primary: "bg-primary-100 dark:bg-primary-900/45",
  secondary: "bg-secondary-100 dark:bg-secondary-900/45",
  info: "bg-info-100 dark:bg-info-900/45",
  warning: "bg-warning-100 dark:bg-warning-900/45",
  success: "bg-success-100 dark:bg-success-900/45",
  danger: "bg-danger-100 dark:bg-danger-900/45",
}

const INTERACTIVE_ICON_COLORS: Record<string, string> = {
  default: "text-primary",
  neutral: "text-muted-foreground",
  primary: "text-primary dark:text-primary-300",
  secondary: "text-secondary-600 dark:text-secondary-400",
  info: "text-info-600 dark:text-info-400",
  warning: "text-warning-700 dark:text-warning-300",
  success: "text-success-700 dark:text-success-300",
  danger: "text-danger-700 dark:text-danger-300",
}

const INTERACTIVE_ICON_BG: Record<string, string> = {
  default: "bg-surface text-primary",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary dark:text-primary-300",
  secondary: "bg-secondary/15 text-secondary-600 dark:text-secondary-400",
  info: "bg-info/15 text-info-600 dark:text-info-400",
  warning: "bg-warning/15 text-warning-700 dark:text-warning-300",
  success: "bg-success/15 text-success-700 dark:text-success-300",
  danger: "bg-danger/15 text-danger-700 dark:text-danger-300",
}

export function InteractiveCard({
  title,
  subtitle,
  description,
  icon,
  decorativeIcon,
  meta,
  color = "default",
  onClick,
  disabled,
  className,
  hideChevron,
  isActive = false,
  borderless = false,
  shadowless = false,
  iconContainerClassName,
  activeInnerBgClassName,
}: InteractiveCardProps) {
  const colorClass = INTERACTIVE_COLORS[color] || INTERACTIVE_COLORS.default;
  const innerBgClass = isActive
    ? (activeInnerBgClassName || INTERACTIVE_INNER_BG_ACTIVE[color] || INTERACTIVE_INNER_BG_ACTIVE.default)
    : (INTERACTIVE_INNER_BG[color] || INTERACTIVE_INNER_BG.default);
  const iconColorClass = INTERACTIVE_ICON_COLORS[color] || INTERACTIVE_ICON_COLORS.default;
  const iconBgClass = INTERACTIVE_ICON_BG[color] || INTERACTIVE_ICON_BG.default;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-xl transition-all duration-200 outline-none overflow-hidden",
        borderless ? "p-0 border-0 border-transparent hover:border-transparent" : "p-[1px] border",
        shadowless ? "shadow-none hover:shadow-none active:shadow-none" : "shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0",
        colorClass,
        borderless && "border-transparent hover:border-transparent",
        className
      )}
    >
      {/* Soft Ambient Glow on Hover (Behind inner mask, bleeds through semi-transparent bg) */}
      {!disabled && !shadowless && (
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0">
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] blur-[40px] opacity-25",
              iconColorClass
            )}
            style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 60%)' }}
          />
        </div>
      )}

      {/* Inner Mask to preserve background color and block the center of spinning gradient */}
      <div
        className={cn(
          "absolute pointer-events-none z-0 transition-colors duration-200",
          borderless ? "inset-0 rounded-xl" : "inset-[1px] rounded-[10px]",
          innerBgClass
        )}
      />

      {/* Decorative Icon (Bottom Right) */}
      {decorativeIcon && (
        <div className="absolute -bottom-6 -right-6 size-32 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] group-hover:scale-105 transition-all duration-500 z-10">
          {decorativeIcon}
        </div>
      )}

      <div className="relative z-10 p-5 flex items-start gap-4">
        {icon && (
          <div
            className={cn(
              "shrink-0 size-11 rounded-full flex items-center justify-center transition-colors",
              (borderless || shadowless)
                ? cn("border-0 shadow-none", iconBgClass)
                : cn("bg-surface shadow-sm border border-border/30", iconColorClass),
              iconContainerClassName
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground leading-tight truncate">{title}</h3>
            {!hideChevron && <ChevronRight className="size-4 text-foreground/50 shrink-0 transition-transform group-hover:translate-x-0.5" />}
          </div>
          {subtitle && (
            <p className="text-xs text-foreground/70 font-medium mt-0.5 flex items-center gap-1">
              <MapPin className="size-3 shrink-0" />{subtitle}
            </p>
          )}
          {description && <p className="text-xs text-foreground/60 mt-1">{description}</p>}
          {meta && <div className="mt-4">{meta}</div>}
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. KPI CARD
// ─────────────────────────────────────────────────────────────────────────────

export type KpiTrend = "up" | "down" | "neutral" | "warning"
export type KpiColor = "primary" | "neutral" | "secondary-300" | "warning" | "success-400" | "info"
const KPI_COLORS: Record<KpiColor, { container: string; iconBg: string; valueText: string }> = {
  primary: {
    container: "bg-primary/5 border-primary/20 hover:border-primary/40",
    iconBg: "bg-primary/10 text-primary",
    valueText: "text-primary dark:text-primary-300",
  },
  neutral: {
    container: "bg-muted/30 border-border hover:border-border/80",
    iconBg: "bg-muted text-foreground",
    valueText: "text-foreground",
  },
  "secondary-300": {
    container: "bg-secondary-50/50 dark:bg-secondary-900/10 border-secondary-300/30 hover:border-secondary-300/60",
    iconBg: "bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 dark:text-secondary-300",
    valueText: "text-secondary-600 dark:text-secondary-300",
  },
  info: {
    container: "bg-info-50/50 dark:bg-info-900/10 border-info/30 hover:border-info/60",
    iconBg: "bg-info/10 text-info-600 dark:text-info-400",
    valueText: "text-info-600 dark:text-info-400",
  },
  warning: {
    container: "bg-warning-50/50 dark:bg-warning-900/10 border-warning/30 hover:border-warning/60",
    iconBg: "bg-warning/10 text-warning",
    valueText: "text-warning",
  },
  "success-400": {
    container: "bg-success-50/50 dark:bg-success-900/10 border-success-400/30 hover:border-success-400/60",
    iconBg: "bg-success/10 text-success-600 dark:text-success-400",
    valueText: "text-success-600 dark:text-success-400",
  },
}

export interface KpiCardProps {
  label: string
  value?: string | number
  trend?: KpiTrend
  change?: string
  comparison?: string
  description?: string
  updatedAt?: string
  icon?: React.ReactNode
  color?: KpiColor
  prefixText?: string
  highlightedText?: string
  actionLabel?: string
  onAction?: () => void
  menuActions?: React.ReactNode
  className?: string
}

const TREND_CONFIG: Record<KpiTrend, { icon: React.ReactNode; colorClass: string }> = {
  up: { icon: <TrendingUp className="size-3.5" />, colorClass: "text-success" },
  down: { icon: <TrendingDown className="size-3.5" />, colorClass: "text-danger" },
  neutral: { icon: <Minus className="size-3.5" />, colorClass: "text-muted-foreground" },
  warning: { icon: <TrendingUp className="size-3.5" />, colorClass: "text-warning" },
}

export function KpiCard({
  label, value, trend, change, comparison, description, updatedAt, icon, color = "primary",
  prefixText, highlightedText, actionLabel, onAction, menuActions, className
}: KpiCardProps) {
  const trendCfg = trend ? TREND_CONFIG[trend] : null
  const isNarrative = prefixText || highlightedText
  const colorCfg = KPI_COLORS[color] || KPI_COLORS.primary

  return (
    <div className={cn(
      "rounded-2xl border shadow-xs p-6 flex flex-col justify-between w-full min-h-[160px] transition-all duration-200 hover:shadow-md",
      colorCfg.container,
      className
    )}>
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex flex-col gap-3">
          {icon && (
            <div className={cn("size-10 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden", colorCfg.iconBg)}>
              <div className="relative z-10 [&>svg]:size-5">{icon}</div>
            </div>
          )}
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        </div>
        {menuActions && (
          <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
            {menuActions}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end">
        {isNarrative ? (
          <div className="mb-4">
            <p className="text-xl md:text-2xl font-medium leading-snug tracking-tight text-muted-foreground">
              {prefixText}{" "}
              {highlightedText && <span className={cn("font-bold", colorCfg.valueText)}>{highlightedText}</span>}
            </p>
          </div>
        ) : (
          <div className="mb-2">
            <div className="flex items-end gap-3 mb-1">
              <span className={cn("text-4xl font-bold font-heading tabular-nums tracking-tight", colorCfg.valueText)}>{value}</span>
              {trendCfg && change && (
                <span className={cn("flex items-center gap-0.5 text-sm font-semibold mb-1.5", trendCfg.colorClass)}>
                  {trendCfg.icon}{change}
                </span>
              )}
            </div>
            {comparison && <p className="text-xs font-medium text-muted-foreground">{comparison}</p>}
            {description && <p className="text-xs text-muted-foreground/80 mt-1 leading-relaxed">{description}</p>}
          </div>
        )}

        {updatedAt && !actionLabel && (
          <p className="text-[10px] font-medium text-muted-foreground/60 mt-2">{updatedAt}</p>
        )}

        {actionLabel && (
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onAction}
              className="h-8 px-4 inline-flex items-center justify-center text-[11px] font-bold bg-surface border border-border shadow-sm rounded-full hover:bg-muted transition-colors text-foreground"
            >
              {actionLabel}
            </button>
            <div className="flex gap-1 ml-auto">
              <div className="w-4 h-0.5 bg-foreground/80 rounded-full" />
              <div className="w-4 h-0.5 bg-border rounded-full" />
              <div className="w-4 h-0.5 bg-border rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INSTITUTION CARD
// ─────────────────────────────────────────────────────────────────────────────

export interface InstitutionCardProps {
  name: string
  amie?: string
  location?: string
  status?: "active" | "inactive" | "review"
  students?: number
  teachers?: number
  blocks?: number
  classrooms?: number
  imageUrl?: string
  updatedAt?: string
  infoStatus?: string
  onViewProfile?: () => void
  onCopyAmie?: () => void
  className?: string
}

const INST_STATUS: Record<string, { label: string; dotColor: string; bgBorder: string }> = {
  active: { label: "ACTIVA", dotColor: "bg-success", bgBorder: "bg-success/10 border-success/20 text-success" },
  inactive: { label: "INACTIVA", dotColor: "bg-danger", bgBorder: "bg-danger/10 border-danger/20 text-danger" },
  review: { label: "EN REVISIÓN", dotColor: "bg-warning", bgBorder: "bg-warning/10 border-warning/20 text-warning" },
}

export function InstitutionCard({
  name, amie, location, status = "active", students, teachers, blocks, classrooms, imageUrl, updatedAt, infoStatus, onViewProfile, onCopyAmie, className,
}: InstitutionCardProps) {
  const st = INST_STATUS[status] || INST_STATUS.active;
  return (
    <div className={cn("rounded-2xl border border-border/80 bg-surface shadow-sm overflow-hidden w-full flex flex-col", className)}>
      {/* 1. Compact Header with centered icon */}
      <div className="relative py-3 px-6 h-14 flex items-center justify-center border-b border-border/60 bg-gradient-to-b from-muted/10 to-surface shrink-0">
        <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
          <Building2 className="size-5" />
        </div>
        <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
          <MoreVertical className="size-4" />
        </button>
      </div>

      {/* 2. Middle Row: Image and Info block */}
      <div className="p-5 flex flex-col md:flex-row gap-5 items-start">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full md:w-32 h-24 object-cover rounded-xl border border-border/50 shadow-sm shrink-0" />
        ) : (
          <div className="w-full md:w-32 h-24 bg-muted/40 rounded-xl border border-border/50 shadow-sm shrink-0 flex items-center justify-center text-muted-foreground/60">
            <Building2 className="size-7" />
          </div>
        )}

        <div className="flex-1 min-w-0 w-full relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="inline-flex text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
              Institución educativa
            </span>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold border", st.bgBorder)}>
              <span className={cn("size-1.5 rounded-full", st.dotColor)} />
              {st.label}
            </span>
          </div>

          <h3 className="text-base font-bold text-foreground mt-1.5 leading-tight tracking-tight truncate">{name}</h3>

          {amie && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <span>Código AMIE: {amie}</span>
              <button
                type="button"
                onClick={onCopyAmie}
                className="hover:text-foreground transition-colors p-0.5"
                title="Copiar Código AMIE"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Metrics Grid */}
      <div className="px-5 py-3 border-t border-border/60">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {blocks !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-xl">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Building2 className="size-4.5" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground leading-none block">{blocks}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Bloques</p>
              </div>
            </div>
          )}

          {students !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-xl">
              <div className="size-9 rounded-lg bg-info/10 flex items-center justify-center text-info shrink-0">
                <Users className="size-4.5" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground leading-none block">{students.toLocaleString()}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Estudiantes</p>
              </div>
            </div>
          )}

          {teachers !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-xl">
              <div className="size-9 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                <GraduationCap className="size-4.5" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground leading-none block">{teachers}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Docentes</p>
              </div>
            </div>
          )}

          {classrooms !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-xl">
              <div className="size-9 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                <BarChart3 className="size-4.5" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground leading-none block">{classrooms}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Aulas</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer box */}
      {(updatedAt || infoStatus || onViewProfile) && (
        <div className="px-5 pb-5 pt-1">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            {updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary shrink-0" />
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide leading-none">Última actualización</p>
                  <p className="text-[11px] font-semibold text-foreground mt-0.5">{updatedAt}</p>
                </div>
              </div>
            )}

            {infoStatus && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4.5 text-success shrink-0" />
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide leading-none">Estado de la información</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    <p className="text-[11px] font-bold text-success">{infoStatus}</p>
                  </div>
                </div>
              </div>
            )}

            {onViewProfile && (
              <Button
                onClick={onViewProfile}
                variant="primary"
                className="shrink-0 rounded-xl px-5 h-10 text-xs"
              >
                Ver ficha completa <ChevronRight className="size-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LAYER CARD
// ─────────────────────────────────────────────────────────────────────────────

export interface LayerCardProps {
  name: string
  category?: string
  dataType?: string
  scale?: string
  updatedAt?: string
  status?: "published" | "draft" | "archived"
  onViewMap?: () => void
  onMetadata?: () => void
  onDownload?: () => void
  onCopyLink?: () => void
  className?: string
}

const LAYER_STATUS: Record<string, { label: string; bgBorder: string }> = {
  published: { label: "PUBLICADA", bgBorder: "bg-success/10 border-success/20 text-success" },
  draft: { label: "BORRADOR", bgBorder: "bg-warning/10 border-warning/20 text-warning" },
  archived: { label: "ARCHIVADA", bgBorder: "bg-neutral/10 border-neutral/20 text-muted-foreground" },
}

export function LayerCard({
  name, category, dataType, scale, updatedAt, status = "published",
  onViewMap, onMetadata, onDownload, onCopyLink, className,
}: LayerCardProps) {
  const st = LAYER_STATUS[status] || LAYER_STATUS.published;
  return (
    <div className={cn("rounded-2xl border border-border/80 bg-surface shadow-sm p-6 flex flex-col gap-5 w-full", className)}>
      {/* 1. Header Row */}
      <div className="flex items-start gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Layers className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground leading-tight tracking-tight">{name}</h3>
            {category && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                <Globe className="size-3" />
                {category}
              </span>
            )}
          </div>
        </div>
        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <MoreVertical className="size-4" />
        </button>
      </div>

      {/* 2. Metadata Rows */}
      <div className="divide-y divide-border/60 border-y border-border/60 py-1">
        {dataType && (
          <div className="flex items-center justify-between py-2.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="size-4 text-primary" />
              <span>Tipo</span>
            </div>
            <span className="font-bold text-foreground">{dataType}</span>
          </div>
        )}
        {scale && (
          <div className="flex items-center justify-between py-2.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ruler className="size-4 text-primary" />
              <span>Escala</span>
            </div>
            <span className="font-bold text-foreground">{scale}</span>
          </div>
        )}
        {updatedAt && (
          <div className="flex items-center justify-between py-2.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary" />
              <span>Actualizada</span>
            </div>
            <span className="font-bold text-foreground">{updatedAt}</span>
          </div>
        )}
      </div>

      {/* 3. Footer Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <span className={cn("inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-bold border", st.bgBorder)}>
          <span className="size-1.5 rounded-full bg-current" />
          {st.label}
        </span>

        <div className="flex items-center gap-1.5">
          <TooltipProvider delayDuration={200}>
            {[
              { icon: <Eye className="size-4.5" />, label: "Ver en mapa", fn: onViewMap },
              { icon: <Info className="size-4.5" />, label: "Metadatos", fn: onMetadata },
              { icon: <Download className="size-4.5" />, label: "Descargar", fn: onDownload },
              { icon: <Link2 className="size-4.5" />, label: "Copiar enlace", fn: onCopyLink },
              { icon: <MoreVertical className="size-4.5" />, label: "Más" },
            ].map(({ icon, label, fn }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={fn}
                    className="size-9 rounded-lg border border-border flex items-center justify-center bg-surface hover:bg-muted text-muted-foreground hover:text-primary transition-all shadow-sm"
                    aria-label={label}
                  >
                    {icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6} className="text-xs font-semibold">
                  {label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. DOCUMENT CARD
// ─────────────────────────────────────────────────────────────────────────────

export interface DocumentCardProps {
  filename: string
  sizeLabel?: string
  uploadedAt?: string
  onPreview?: () => void
  onDownload?: () => void
  onShare?: () => void
  className?: string
}

function getDocIcon(filename: string): { icon: React.ReactNode; variant: "error" | "success" | "info" | "warning" | "primary" | "neutral"; label: string } {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, { icon: React.ReactNode; variant: "error" | "success" | "info" | "warning" | "primary" | "neutral"; label: string }> = {
    pdf: { icon: <FileText className="size-6" />, variant: "error", label: "PDF" },
    doc: { icon: <FileText className="size-6" />, variant: "info", label: "Word" },
    docx: { icon: <FileText className="size-6" />, variant: "info", label: "Word" },
    xls: { icon: <FileSpreadsheet className="size-6" />, variant: "success", label: "Excel" },
    xlsx: { icon: <FileSpreadsheet className="size-6" />, variant: "success", label: "Excel" },
    csv: { icon: <FileSpreadsheet className="size-6" />, variant: "success", label: "CSV" },
    ppt: { icon: <FileText className="size-6" />, variant: "warning", label: "PPT" },
    pptx: { icon: <FileText className="size-6" />, variant: "warning", label: "PPT" },
    zip: { icon: <FileArchive className="size-6" />, variant: "warning", label: "ZIP" },
    geojson: { icon: <Globe className="size-6" />, variant: "success", label: "GeoJSON" },
    shp: { icon: <Map className="size-6" />, variant: "success", label: "SHP" },
    kml: { icon: <Map className="size-6" />, variant: "info", label: "KML" },
    kmz: { icon: <Map className="size-6" />, variant: "info", label: "KMZ" },
    json: { icon: <FileCode className="size-6" />, variant: "primary", label: "JSON" },
    txt: { icon: <FileText className="size-6" />, variant: "neutral", label: "TXT" },
  }
  return map[ext] ?? { icon: <File className="size-6" />, variant: "neutral", label: ext.toUpperCase() || "File" }
}

export function DocumentCard({ filename, sizeLabel, uploadedAt, onPreview, onDownload, onShare, className }: DocumentCardProps) {
  const { icon, variant, label } = getDocIcon(filename)
  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("rounded-xl border border-border bg-surface shadow-sm p-5 w-full", className)}>
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            "size-12 rounded-xl flex items-center justify-center shrink-0",
            variant === "error" && "bg-danger/10 text-danger",
            variant === "success" && "bg-success/10 text-success",
            variant === "info" && "bg-info/10 text-info",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "neutral" && "bg-muted text-muted-foreground",
          )}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm font-semibold text-foreground truncate cursor-default leading-tight">{filename}</p>
              </TooltipTrigger>
              <TooltipContent>{filename}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={variant === "primary" ? "primary" : variant === "neutral" ? "neutral" : variant} appearance="soft" className="text-[9px] h-4">
                {label}
              </Badge>
              {sizeLabel && <span className="text-xs text-muted-foreground">· {sizeLabel}</span>}
            </div>
            {uploadedAt && <p className="text-[11px] text-muted-foreground mt-1">Subido: {uploadedAt}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDownload && (
            <Button variant="primary" size="sm" className="flex-1" onClick={onDownload}>
              <Download className="size-3.5 mr-1.5" />Descargar
            </Button>
          )}
          {onPreview && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onPreview} aria-label="Vista previa">
                  <Eye className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista previa</TooltipContent>
            </Tooltip>
          )}
          {onShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onShare} aria-label="Compartir">
                  <Share2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compartir</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. REPORT CARD
// ─────────────────────────────────────────────────────────────────────────────

export type ReportStatus = "generated" | "processing" | "error" | "scheduled"

export interface ReportCardProps {
  title: string
  period?: string
  territory?: string
  generatedAt?: string
  status?: ReportStatus
  formats?: string[]
  onView?: () => void
  onDownload?: () => void
  className?: string
}

const REPORT_STATUS: Record<ReportStatus, { label: string; variant: "success" | "info" | "error" | "neutral" }> = {
  generated: { label: "Generado", variant: "success" },
  processing: { label: "Procesando", variant: "info" },
  error: { label: "Error", variant: "error" },
  scheduled: { label: "Programado", variant: "neutral" },
}

export function ReportCard({ title, period, territory, generatedAt, status = "generated", formats = [], onView, onDownload, className }: ReportCardProps) {
  const st = REPORT_STATUS[status]
  return (
    <div className={cn("rounded-xl border border-border bg-surface shadow-sm p-5 w-full", className)}>
      <div className="flex items-start gap-3 mb-3">
        <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0">
          <BarChart3 className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
            <Badge variant={st.variant} appearance="soft" className="shrink-0 text-[10px]">{st.label}</Badge>
          </div>
          {period && <p className="text-xs text-muted-foreground mt-0.5">{period}</p>}
        </div>
      </div>
      <div className="space-y-1 mb-4">
        {territory && <MetaRow label="Territorio" value={territory} />}
        {generatedAt && <MetaRow label="Generado" value={generatedAt} />}
        {formats.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-muted-foreground">Formatos:</span>
            {formats.map((f) => (
              <span key={f} className="text-[11px] font-semibold text-foreground bg-muted rounded px-1.5 py-0.5">{f}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onView && <Button variant="primary" size="sm" className="flex-1" onClick={onView}>Ver reporte</Button>}
        {onDownload && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onDownload} aria-label="Descargar">
                  <Download className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Descargar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. DATA BADGE
// ─────────────────────────────────────────────────────────────────────────────
// Re-exports the existing Badge with preset props for Data Display usage.
// This is a thin wrapper to document the intent in Data Display context.

export { Badge as DataBadge }

// ─────────────────────────────────────────────────────────────────────────────
// 11. CHIP
// ─────────────────────────────────────────────────────────────────────────────

export interface DataChipProps {
  label: string
  icon?: React.ReactNode
  selected?: boolean
  removable?: boolean
  disabled?: boolean
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export function DataChip({ label, icon, selected, removable, disabled, onRemove, onClick, className }: DataChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-3 rounded-full border text-xs font-medium transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        selected
          ? "bg-primary/10 border-primary/40 text-primary"
          : "bg-surface border-border text-foreground hover:border-primary/40 hover:bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:size-3">{icon}</span>}
      <span>{label}</span>
      {removable && !disabled && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Eliminar ${label}`}
          onClick={(e) => { e.stopPropagation(); onRemove?.() }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onRemove?.() } }}
          className="shrink-0 size-3.5 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <X className="size-2.5" />
        </span>
      )}
    </button>
  )
}

export function AddChip({ label = "Agregar filtro", onClick }: { label?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 h-7 px-3 rounded-full border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      <Plus className="size-3" />{label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. METADATA LIST
// ─────────────────────────────────────────────────────────────────────────────

export interface MetadataItem {
  label: string
  value: string
  icon?: React.ReactNode
}

export interface MetadataListProps {
  items: MetadataItem[]
  variant?: "compact" | "comfortable"
  className?: string
}

export function MetadataList({ items, variant = "comfortable", className }: MetadataListProps) {
  return (
    <dl className={cn("w-full divide-y divide-border", className)}>
      {items.map(({ label, value, icon }) => (
        <div
          key={label}
          className={cn(
            "flex items-center justify-between gap-4",
            variant === "compact" ? "py-1.5" : "py-2.5"
          )}
        >
          <dt className={cn(
            "flex items-center gap-1.5 text-muted-foreground shrink-0",
            variant === "compact" ? "text-[11px]" : "text-xs"
          )}>
            {icon && <span className="[&>svg]:size-3 shrink-0">{icon}</span>}
            {label}
          </dt>
          <dd className={cn(
            "text-right font-medium text-foreground",
            variant === "compact" ? "text-[11px]" : "text-xs"
          )}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. STATUS INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

export type StatusType =
  | "online"
  | "processing"
  | "warning"
  | "critical"
  | "offline"
  | "inactive"
  | "completed"

export interface StatusIndicatorProps {
  status: StatusType
  label?: string
  description?: string
  showLabel?: boolean
  size?: "sm" | "md"
  className?: string
}

const STATUS_CONFIG: Record<StatusType, {
  dot: string
  text: string
  label: string
  icon?: React.ReactNode
  pulse?: boolean
}> = {
  online: { dot: "bg-success", text: "text-success", label: "En línea", pulse: true },
  processing: { dot: "bg-info", text: "text-info", label: "Procesando", pulse: true, icon: <Loader2 className="size-3 animate-spin" /> },
  warning: { dot: "bg-warning", text: "text-warning", label: "Advertencia" },
  critical: { dot: "bg-danger", text: "text-danger", label: "Crítico", pulse: true },
  offline: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "Fuera de línea" },
  inactive: { dot: "bg-border", text: "text-muted-foreground", label: "Inactivo" },
  completed: { dot: "bg-success", text: "text-success", label: "Completado", icon: <CheckCircle2 className="size-3" /> },
}

export function StatusIndicator({ status, label, description, size = "md", className }: StatusIndicatorProps) {
  const cfg = STATUS_CONFIG[status]
  const displayLabel = label ?? cfg.label
  return (
    <div className={cn("flex items-start gap-2.5 text-left w-full", className)}>
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        {cfg.icon ? (
          <span className={cn(cfg.text)}>{cfg.icon}</span>
        ) : (
          <>
            <span className={cn(
              "rounded-full",
              size === "sm" ? "size-2" : "size-2.5",
              cfg.dot
            )} />
            {cfg.pulse && (
              <span className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-50",
                cfg.dot
              )} />
            )}
          </>
        )}
      </div>
      <div className="flex flex-col text-left items-start min-w-0">
        <p className={cn(
          "font-semibold leading-tight text-left",
          size === "sm" ? "text-[11px]" : "text-xs",
          cfg.text
        )}>
          {displayLabel}
        </p>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5 text-left leading-normal">{description}</p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. BANNER, PROGRESS BAR, SPINNER, EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

export interface BannerProps {
  title: string
  description?: string
  variant?: "info" | "success" | "warning" | "danger"
  onClose?: () => void
  className?: string
}

export function Banner({
  title, description, variant = "info", onClose, className
}: BannerProps) {
  const styles = {
    info: "bg-info/10 border-info/30 text-info",
    success: "bg-success/10 border-success/30 text-success",
    warning: "bg-warning/10 border-warning/30 text-warning",
    danger: "bg-danger/10 border-danger/30 text-danger",
  }

  const icons = {
    info: <Info className="size-4 shrink-0" />,
    success: <CheckCircle2 className="size-4 shrink-0" />,
    warning: <AlertTriangle className="size-4 shrink-0" />,
    danger: <XCircle className="size-4 shrink-0" />,
  }

  return (
    <div className={cn("w-full p-4 rounded-xl border flex items-start justify-between gap-3 text-left", styles[variant], className)}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5">{icons[variant]}</div>
        <div className="min-w-0">
          <p className="text-xs font-bold leading-tight">{title}</p>
          {description && <p className="text-[11px] opacity-90 mt-0.5 leading-normal">{description}</p>}
        </div>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="p-1 opacity-70 hover:opacity-100 rounded-lg">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  className
}: {
  value: number
  label?: string
  showValue?: boolean
  className?: string
}) {
  return (
    <div className={cn("w-full space-y-1.5 text-left", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
          {label && <span>{label}</span>}
          {showValue && <span className="tabular-nums font-bold text-primary">{Math.round(value)}%</span>}
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  )
}

export function Spinner({
  size = "md",
  className,
  "aria-label": ariaLabel = "Cargando",
}: {
  size?: "sm" | "md" | "lg"
  className?: string
  "aria-label"?: string
}) {
  const sizes = { sm: "size-4", md: "size-6", lg: "size-8" }
  return (
    <div role="status" aria-label={ariaLabel} className="inline-flex items-center justify-center shrink-0">
      <Loader2
        className={cn(
          "text-primary",
          "animate-[spin_0.9s_linear_infinite]",
          "motion-reduce:animate-none motion-reduce:opacity-70",
          sizes[size],
          className
        )}
      />
    </div>
  )
}

export function EmptyState({
  title = "No hay datos disponibles",
  description = "Actualmente no existen registros para mostrar en esta sección.",
  type = "default",
  action,
  className
}: {
  title?: string
  description?: string
  type?: "default" | "search" | "error" | "lock"
  action?: React.ReactNode
  className?: string
}) {
  const icons = {
    default: <FileText className="size-8 text-primary" />,
    search: <Search className="size-8 text-muted-foreground" />,
    error: <AlertTriangle className="size-8 text-danger" />,
    lock: <Shield className="size-8 text-warning" />,
  }

  return (
    <div className={cn("w-full p-8 rounded-2xl border border-dashed border-border/80 bg-surface/40 flex flex-col items-center text-center gap-3", className)}>
      <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center shadow-xs">
        {icons[type]}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER
// ─────────────────────────────────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-foreground">{value}</span>
    </div>
  )
}
