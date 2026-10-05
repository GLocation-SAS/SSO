"use client"

/**
 * FileUpload — Basic
 * ──────────────────
 * Dropzone básica + lista de archivos.
 * Limpia, simple y funcional. Sin badges de tipo ni preview.
 *
 * Para la versión avanzada con tipo de archivo, badges,
 * preview de imagen/video y animaciones → usar FileUploadAdvanced
 * (src/components/ui/file-input.tsx)
 */

import * as React from "react"
import {
  UploadCloud,
  File as FileIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  XCircle,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileUploadStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error"
  | "cancelled"

export type FileUploadError = "format" | "size" | "invalid" | "network" | null

export interface FileUploadItem {
  id: string
  file: File
  status: FileUploadStatus
  errorType: FileUploadError
  progress: number
}

export interface FileUploadProps {
  label?: string
  accept?: string
  maxSizeMB?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  allowedFormats?: string
  items?: FileUploadItem[]
  onFileSelect?: (files: File[]) => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  onCancel?: (id: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

// ─── FileItem ─────────────────────────────────────────────────────────────────

function FileItem({
  item,
  disabled,
  onRemove,
  onRetry,
  onCancel,
}: {
  item: FileUploadItem
  disabled?: boolean
  onRemove: () => void
  onRetry: () => void
  onCancel: () => void
}) {
  const { file, status, errorType, progress } = item

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="listitem"
        aria-label={`${file.name}, ${status}`}
        className={cn(
          "group relative w-full bg-background p-3 sm:p-3.5 transition-all duration-200 border-t border-border/50",
          status === "error" && "bg-danger/5",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3 w-full">
          {/* Icon */}
          <div className="shrink-0">
            {status === "success" ? (
              <CheckCircle2 className="size-5 text-success" />
            ) : status === "error" ? (
              <AlertTriangle className="size-5 text-danger" />
            ) : (
              <FileIcon className={cn("size-5 text-primary", status === "uploading" && "animate-pulse")} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate cursor-default leading-tight">
                    {file.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{file.name}</TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-2 shrink-0">
                {status === "uploading" && (
                  <span className="text-xs font-semibold text-primary tabular-nums">
                    {Math.round(progress)}%
                  </span>
                )}
                {status === "uploading" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Cancelar carga"
                        className="p-1.5 rounded-md border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Cancelar carga</TooltipContent>
                  </Tooltip>
                )}
                {status !== "uploading" && !disabled && (
                  <div className="flex items-center gap-1.5">
                    {status === "error" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={onRetry}
                            aria-label="Reintentar"
                            className="p-1.5 rounded-md border border-border/60 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <RefreshCw className="size-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Reintentar</TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={onRemove}
                          aria-label="Eliminar archivo"
                          className="p-1.5 rounded-md border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Eliminar</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>

            {/* Status messaging / Subtitle */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className={cn(
                "text-[11px]",
                status === "success" ? "text-success font-medium" :
                status === "error" ? "text-danger font-medium" :
                "text-muted-foreground"
              )}>
                {status === "idle" && formatBytes(file.size)}
                {status === "uploading" && formatBytes(file.size)}
                {status === "success" && "Archivo cargado correctamente."}
                {status === "cancelled" && "Carga cancelada."}
                {status === "error" && (
                  errorType === "format" ? "Formato de archivo no permitido." :
                  errorType === "size"   ? "El archivo supera el tamaño límite." :
                  errorType === "invalid" ? "No se pudo procesar el archivo." :
                  errorType === "network" ? "Error de red al cargar el archivo." :
                  "Error al cargar el archivo."
                )}
              </span>
            </div>

            {/* Progress bar line at bottom of item */}
            {status === "uploading" && (
              <div
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-1 rounded-full bg-primary/20 overflow-hidden mt-1.5"
              >
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─── DropZone Header ─────────────────────────────────────────────────────────

function DropZoneHeader({
  disabled,
  multiple,
  itemsCount,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: {
  disabled?: boolean
  multiple?: boolean
  itemsCount: number
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}) {
  const isUploadingAny = itemsCount > 0

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Zona de carga."
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "w-full p-3 sm:p-4 transition-all duration-200 cursor-pointer select-none",
        "flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/40",
        isDragging && "bg-primary/10",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={disabled}
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); if (!disabled) onClick() }}
          className="shrink-0 w-auto font-semibold shadow-2xs h-8 text-xs px-3"
        >
          <UploadCloud className="size-4 mr-1.5" />
          {multiple ? "Seleccionar archivos..." : "Seleccionar archivo..."}
        </Button>

        <span className="text-xs text-muted-foreground truncate hidden sm:inline">
          {isDragging ? "Suelta los archivos para cargarlos" : "Arrastra y suelta archivos aquí"}
        </span>
      </div>

      {itemsCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-primary font-bold shrink-0">
          <CheckCircle2 className="size-4" />
          <span>Listo para cargar</span>
        </div>
      )}
    </div>
  )
}

// ─── Main FileUpload Box ─────────────────────────────────────────────────────

export function FileUpload({
  label,
  accept,
  maxSizeMB = 20,
  maxFiles = 10,
  multiple = false,
  disabled = false,
  required = false,
  className,
  items = [],
  onFileSelect,
  onRemove,
  onRetry,
  onCancel,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || !onFileSelect) return
    onFileSelect(Array.from(files).slice(0, maxFiles))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (e.target) e.target.value = ""
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full text-left", className)}>
      {label && (
        <label className={cn("text-sm font-semibold text-foreground", disabled && "opacity-50")}>
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden="true"
      />

      {/* Single Box Container (Cajita Integrada) */}
      <div className={cn(
        "w-full rounded-xl border border-border overflow-hidden bg-background shadow-2xs transition-all duration-200",
        isDragging && "ring-2 ring-primary border-primary"
      )}>
        {/* Top bar header */}
        <DropZoneHeader
          disabled={disabled}
          multiple={multiple}
          itemsCount={items.length}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        />

        {/* List of files embedded directly inside the container */}
        {items.length > 0 && (
          <div role="list" aria-label="Archivos" className="w-full">
            {items.map((item) => (
              <FileItem
                key={item.id}
                item={item}
                disabled={disabled}
                onRemove={() => onRemove?.(item.id)}
                onRetry={() => onRetry?.(item.id)}
                onCancel={() => onCancel?.(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
