"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// 1. CHART CONTAINER
// ─────────────────────────────────────────────────────────────────────────────

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: string
  minHeight?: number | string
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, aspectRatio, minHeight = 220, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        tabIndex={0}
        className={cn("w-full relative overflow-visible select-none", className)}
        style={{
          aspectRatio,
          minHeight,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// ─────────────────────────────────────────────────────────────────────────────
// 2. CHART TOOLTIP & CONTENT
// ─────────────────────────────────────────────────────────────────────────────

export interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  x?: number
  y?: number
  align?: "top" | "bottom" | "auto"
}

export const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ className, active = true, x, y, children, style, ...props }, ref) => {
    if (!active) return null

    const isPositioned = typeof x === "number" && typeof y === "number"

    return (
      <div
        ref={ref}
        role="tooltip"
        aria-live="polite"
        className={cn(
          "z-50 pointer-events-none rounded-xl border border-border bg-surface/95 backdrop-blur-md px-3 py-2 text-xs text-foreground shadow-xl transition-all duration-150 ease-out",
          isPositioned ? "absolute -translate-x-1/2 -translate-y-full mb-2" : "",
          className
        )}
        style={{
          ...(isPositioned ? { left: `${x}px`, top: `${y}px` } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartTooltip.displayName = "ChartTooltip"

export interface ChartTooltipContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  label?: string
  value?: string | number
  indicatorColor?: string
  subvalue?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, title, label, value, indicatorColor = "var(--chart-1)", subvalue, trend, trendValue, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5 min-w-[140px]", className)} {...props}>
        {title && (
          <div className="font-semibold text-[11px] text-muted-foreground border-b border-border/50 pb-1 mb-0.5">
            {title}
          </div>
        )}
        {label || value ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: indicatorColor }}
                aria-hidden="true"
              />
              <span className="font-medium text-foreground">{label}</span>
            </div>
            {value !== undefined && <span className="font-bold text-foreground tabular-nums">{value}</span>}
          </div>
        ) : null}
        {(subvalue || trendValue) && (
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
            {subvalue && <span>{subvalue}</span>}
            {trendValue && (
              <span
                className={cn(
                  "font-bold",
                  trend === "up" && "text-success",
                  trend === "down" && "text-danger",
                  trend === "neutral" && "text-muted-foreground"
                )}
              >
                {trendValue}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// ─────────────────────────────────────────────────────────────────────────────
// 3. CHART LEGEND
// ─────────────────────────────────────────────────────────────────────────────

export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: "start" | "center" | "end"
}

export const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ className, alignment = "center", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-2",
          alignment === "start" && "justify-start",
          alignment === "center" && "justify-center",
          alignment === "end" && "justify-end",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

export interface ChartLegendItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  color: string
  value?: string | number
  active?: boolean
}

export const ChartLegendItem = React.forwardRef<HTMLButtonElement, ChartLegendItemProps>(
  ({ className, label, color, value, active = true, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center gap-1.5 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1 py-0.5",
          active ? "opacity-100" : "opacity-40 hover:opacity-75",
          className
        )}
        {...props}
      >
        <span
          className="size-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span className="text-foreground/90">{label}</span>
        {value !== undefined && <span className="font-bold text-foreground tabular-nums ml-1">({value})</span>}
      </button>
    )
  }
)
ChartLegendItem.displayName = "ChartLegendItem"
