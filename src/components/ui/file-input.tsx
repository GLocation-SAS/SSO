"use client"

import * as React from "react"
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  File as FileGeneric,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  XCircle,
  Map,
  Globe,
  Layers,
  Play,
  Trash2,
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

// ─── Types ───────────────────────────────────────────────────────────────────

export type FileItemStatus =
  | "idle"
  | "queued"
  | "uploading"
  | "paused"
  | "success"
  | "error"
  | "cancelled"

export type FileErrorType =
  | "format"
  | "size"
  | "invalid"
  | "network"
  | "cancelled"
  | null

export interface FileItemData {
  id: string
  file: File
  status: FileItemStatus
  errorType: FileErrorType
  progress: number
  previewUrl?: string
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
  items?: FileItemData[]
  onFileSelect?: (files: File[]) => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  onCancel?: (id: string) => void
}

// ─── File type registry ────────────────────────────────────────────────────

// Badge variant/appearance from Design System
// variant: "primary" | "secondary" | "error" | "success" | "warning" | "info" | "neutral"
// appearance: "default" | "outline" | "soft"
interface FileTypeDef {
  label: string
  iconColor: string                              // semantic token class for icon
  badgeVariant: "primary" | "secondary" | "error" | "success" | "warning" | "info" | "neutral"
  badgeAppearance: "solid" | "outline" | "soft" | "ghost"
  icon: React.ReactNode
}

// Mapping: file type → closest semantic token
// PDF  → error/danger (red)       Excel/CSV → success (green)
// Word → info (blue)              ZIP/Archive → warning (amber)
// PPT  → warning (orange)         Image → secondary (violet)
// Video → secondary               Audio → warning (soft)
// Geo formats → success (geo/earth)  JSON/Code → primary
// TXT  → neutral                  Unknown → neutral
const EXT_MAP: Record<string, FileTypeDef> = {
  pdf:     { label: "PDF",        iconColor: "text-danger",   badgeVariant: "error",     badgeAppearance: "soft", icon: <FileText className="size-8" /> },
  doc:     { label: "Word",       iconColor: "text-info",     badgeVariant: "info",      badgeAppearance: "soft", icon: <FileText className="size-8" /> },
  docx:    { label: "Word",       iconColor: "text-info",     badgeVariant: "info",      badgeAppearance: "soft", icon: <FileText className="size-8" /> },
  xls:     { label: "Excel",      iconColor: "text-success",  badgeVariant: "success",   badgeAppearance: "soft", icon: <FileSpreadsheet className="size-8" /> },
  xlsx:    { label: "Excel",      iconColor: "text-success",  badgeVariant: "success",   badgeAppearance: "soft", icon: <FileSpreadsheet className="size-8" /> },
  csv:     { label: "CSV",        iconColor: "text-success",  badgeVariant: "success",   badgeAppearance: "outline", icon: <FileSpreadsheet className="size-8" /> },
  ppt:     { label: "PowerPoint", iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "soft", icon: <FileText className="size-8" /> },
  pptx:    { label: "PowerPoint", iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "soft", icon: <FileText className="size-8" /> },
  jpg:     { label: "Image",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "soft", icon: <FileImage className="size-8" /> },
  jpeg:    { label: "Image",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "soft", icon: <FileImage className="size-8" /> },
  png:     { label: "Image",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "soft", icon: <FileImage className="size-8" /> },
  webp:    { label: "Image",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "soft", icon: <FileImage className="size-8" /> },
  mp4:     { label: "Video",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "outline", icon: <FileVideo className="size-8" /> },
  mov:     { label: "Video",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "outline", icon: <FileVideo className="size-8" /> },
  webm:    { label: "Video",      iconColor: "text-secondary",badgeVariant: "secondary", badgeAppearance: "outline", icon: <FileVideo className="size-8" /> },
  mp3:     { label: "Audio",      iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "soft", icon: <FileAudio className="size-8" /> },
  wav:     { label: "Audio",      iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "soft", icon: <FileAudio className="size-8" /> },
  zip:     { label: "ZIP",        iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "solid", icon: <FileArchive className="size-8" /> },
  rar:     { label: "Archive",    iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "solid", icon: <FileArchive className="size-8" /> },
  "7z":    { label: "Archive",    iconColor: "text-warning",  badgeVariant: "warning",   badgeAppearance: "solid", icon: <FileArchive className="size-8" /> },
  geojson: { label: "GeoJSON",    iconColor: "text-success",  badgeVariant: "success",   badgeAppearance: "solid", icon: <Globe className="size-8" /> },
  shp:     { label: "SHP",        iconColor: "text-success",  badgeVariant: "success",   badgeAppearance: "outline", icon: <Layers className="size-8" /> },
  kml:     { label: "KML",        iconColor: "text-info",     badgeVariant: "info",      badgeAppearance: "outline", icon: <Map className="size-8" /> },
  kmz:     { label: "KMZ",        iconColor: "text-info",     badgeVariant: "info",      badgeAppearance: "outline", icon: <Map className="size-8" /> },
  txt:     { label: "TXT",        iconColor: "text-muted-foreground", badgeVariant: "neutral", badgeAppearance: "soft", icon: <FileText className="size-8" /> },
  json:    { label: "JSON",       iconColor: "text-primary",  badgeVariant: "primary",   badgeAppearance: "soft", icon: <FileCode className="size-8" /> },
}

const DEFAULT_TYPE: FileTypeDef = {
  label: "File",
  iconColor: "text-muted-foreground",
  badgeVariant: "neutral",
  badgeAppearance: "soft",
  icon: <FileGeneric className="size-8" />,
}

function getFileType(file: File): FileTypeDef {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_MAP[ext] ?? DEFAULT_TYPE
}

function isImage(file: File) {
  return file.type.startsWith("image/")
}

function isVideo(file: File) {
  return file.type.startsWith("video/")
}

// ─── formatBytes ─────────────────────────────────────────────────────────────

export function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

// ─── FileItem Component ────────────────────────────────────────────────────

interface FileItemProps {
  item: FileItemData
  disabled?: boolean
  onRemove: () => void
  onRetry: () => void
  onCancel: () => void
}

function FileItem({ item, disabled, onRemove, onRetry, onCancel }: FileItemProps) {
  const { file, status, errorType, progress, previewUrl } = item
  const ft = getFileType(file)
  const isImg = isImage(file)
  const isVid = isVideo(file)

  const [showSuccess, setShowSuccess] = React.useState(status === "success")

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (status === "success") {
      timeout = setTimeout(() => {
        setShowSuccess(true)
      }, 400)
    } else {
      setShowSuccess(false)
    }
    return () => clearTimeout(timeout)
  }, [status])

  const srLabel = `${file.name}, ${ft.label}, ${formatBytes(file.size)}, ${status === "uploading" ? `cargando, ${Math.round(progress)} por ciento` : status}`

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="listitem"
        aria-label={srLabel}
        className={cn(
          "group relative w-full rounded-xl border bg-surface p-4 transition-all duration-300",
          "animate-in fade-in slide-in-from-bottom-3",
          status === "error"
            ? "border-danger/40 bg-danger/5"
            : status === "success"
            ? "border-success/30 bg-success/5"
            : status === "cancelled"
            ? "border-dashed border-border/60 opacity-70"
            : "border-border",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <div className="flex items-start gap-4 w-full">

          {/* ── Left: icon or preview ─────────── */}
          <div className="shrink-0 relative mt-0.5">
            {/* Image preview */}
            {isImg && previewUrl ? (
              <div className="size-12 rounded-lg overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="size-full object-cover"
                />
              </div>
            ) : isVid && previewUrl ? (
              <div className="size-12 rounded-lg overflow-hidden border border-border bg-black relative">
                <video src={previewUrl} className="size-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="size-4 text-white drop-shadow" />
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "size-12 rounded-xl flex items-center justify-center bg-muted/70",
                  ft.iconColor,
                  status === "success" && "text-success",
                  status === "error" && "text-danger"
                )}
              >
                {status === "success"
                  ? <CheckCircle2 className="size-8 animate-in zoom-in spin-in-12 duration-500" />
                  : status === "error"
                  ? <AlertTriangle className="size-8" />
                  : React.cloneElement(ft.icon as React.ReactElement<{ className?: string }>, {
                      className: cn(
                        "size-8",
                        status === "uploading" && "animate-pulse"
                      )
                    })
                }
              </div>
            )}
          </div>

          {/* ── Center: info + progress ──────── */}
          <div className="flex-1 min-w-0 space-y-1">

            {/* Name + badge */}
            <div className="flex items-start gap-2 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[240px] leading-tight cursor-default">
                    {file.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{file.name}</TooltipContent>
              </Tooltip>
              <Badge
                variant={ft.badgeVariant}
                appearance={ft.badgeAppearance}
                className="shrink-0 h-4 text-[9px] px-1.5"
              >
                {ft.label}
              </Badge>
            </div>

            {/* Meta: type + size */}
            <p className="text-xs text-muted-foreground">
              {ft.label} · {formatBytes(file.size)}
            </p>

            {/* Status text */}
            {status === "uploading" && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
                Subiendo archivo…
              </p>
            )}
            {status === "success" && showSuccess && (
              <p className="text-xs text-success font-medium flex items-center gap-1 animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="size-3.5" />
                Archivo cargado correctamente
              </p>
            )}
            {status === "cancelled" && (
              <p className="text-xs text-muted-foreground">Carga cancelada</p>
            )}
            {status === "queued" && (
              <p className="text-xs text-muted-foreground">En cola…</p>
            )}
            {status === "paused" && (
              <p className="text-xs text-warning font-medium">Carga pausada</p>
            )}
            {status === "error" && (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-danger">
                  {errorType === "format" && "Formato no permitido"}
                  {errorType === "size" && "El archivo supera el tamaño máximo"}
                  {errorType === "invalid" && "No se pudo procesar el archivo"}
                  {errorType === "network" && "No se pudo cargar el archivo"}
                  {errorType === "cancelled" && "Carga cancelada"}
                  {!errorType && "Error al cargar"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {errorType === "format" && "Verifica que el formato sea permitido."}
                  {errorType === "size" && "Reduce el tamaño o comprime el archivo."}
                  {errorType === "invalid" && "El archivo puede estar dañado o incompleto."}
                  {errorType === "network" && "Verifica tu conexión e intenta de nuevo."}
                </p>
              </div>
            )}

            {/* Progress bar */}
            {(status === "uploading" || (status === "success" && !showSuccess)) && (
              <div className="space-y-1 pt-1 animate-in fade-in duration-200">
                <div
                  role="progressbar"
                  aria-valuenow={status === "success" ? 100 : Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${status === "success" ? 100 : Math.round(progress)} por ciento`}
                  className="w-full h-1.5 rounded-full bg-primary/15 overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${status === "success" ? 100 : Math.min(Math.max(progress, 0), 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {formatBytes((file.size * (status === "success" ? 100 : progress)) / 100)} de {formatBytes(file.size)}
                  </span>
                  <span className="text-[11px] font-bold text-primary tabular-nums">
                    {status === "success" ? 100 : Math.round(progress)}%
                  </span>
                </div>
              </div>
            )}

            {/* Error / Cancelled retry */}
            {(status === "error" || status === "cancelled") && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="mt-2 text-xs font-semibold w-full"
                onClick={onRetry}
              >
                <RefreshCw className="size-3 mr-1" />
                Reintentar
              </Button>
            )}
          </div>

          {/* ── Right: actions ───────────────── */}
          {!disabled && (
            <div className="shrink-0 flex items-center gap-1.5">
              {status === "uploading" ? (
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
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─── DropZone ──────────────────────────────────────────────────────────────

interface DropZoneProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled?: boolean
  multiple?: boolean
  accept?: string
  allowedFormats?: string
  maxSizeMB?: number
  maxFiles?: number
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}

function DropZone({
  inputRef,
  disabled,
  multiple,
  accept,
  allowedFormats = "PDF, Word, Excel, CSV, imágenes, videos y archivos geoespaciales",
  maxSizeMB = 20,
  maxFiles = 10,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: DropZoneProps) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Zona de carga de archivos. Arrastra un archivo o presiona Enter para seleccionar."
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
        "relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 outline-none overflow-hidden",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "flex flex-col items-center justify-center gap-5 text-center",
        "py-12 px-6",
        isDragging
          ? "border-primary bg-primary/10 text-primary shadow-2xl scale-[1.01]"
          : "border-border bg-background hover:border-primary/50 hover:bg-muted/30 shadow-xs",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer group"
      )}
    >
      {/* Dynamic Background Glow */}
      <div className={cn(
        "absolute -top-24 left-1/2 -translate-x-1/2 size-64 rounded-full blur-[90px] pointer-events-none transition-all duration-500",
        isDragging ? "bg-primary/20" : "bg-primary/10"
      )} />

      {/* Decorative File Fan Icon Illustration */}
      <div
        className={cn(
          "relative rounded-full p-5 transition-all duration-500 flex items-center justify-center",
          isDragging
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-primary/10 text-primary group-hover:scale-105"
        )}
      >
        <UploadCloud
          className="size-10 transition-colors duration-300"
        />
        {isDragging && (
          <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50" />
        )}
      </div>

      {/* Hero Text */}
      <div className="space-y-1.5 z-10 max-w-md">
        <p className={cn(
          "text-lg font-black tracking-tight transition-colors",
          isDragging ? "text-primary" : "text-foreground"
        )}>
          {isDragging ? "¡Sueltalos aquí mismo!" : "Arrastra y suelta tus archivos aquí"}
        </p>
        <p className={cn(
          "text-xs leading-relaxed transition-colors",
          isDragging ? "text-primary/90" : "text-muted-foreground"
        )}>
          Soporta <span className={cn("font-bold", isDragging ? "text-primary" : "text-primary")}>imágenes, videos, documentos</span> o cualquier archivo hasta {maxSizeMB} MB.
        </p>
      </div>

      {!isDragging && (
        <div className="z-10 flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="primary"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled) onClick()
            }}
            tabIndex={-1}
          >
            {multiple ? "Seleccionar archivos desde el equipo" : "Seleccionar archivo"}
          </Button>

          <p className="text-[11px] text-muted-foreground font-medium">
            O explora tus carpetas locales • Máximo {maxFiles} archivos
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main FileUpload ───────────────────────────────────────────────────────

export function FileUpload({
  label,
  accept,
  maxSizeMB = 20,
  maxFiles = 10,
  multiple = false,
  disabled = false,
  required = false,
  className,
  allowedFormats = "PDF, Word, Excel, CSV, imágenes, videos y archivos geoespaciales",
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
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (e.target) e.target.value = ""
  }

  return (
    <div className={cn("flex flex-col gap-3 w-full text-left", className)}>
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
        onChange={handleFileChange}
        disabled={disabled}
        aria-hidden="true"
      />

      <DropZone
        inputRef={inputRef}
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        allowedFormats={allowedFormats}
        maxSizeMB={maxSizeMB}
        maxFiles={maxFiles}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      />

      {items.length > 0 && (
        <div className="space-y-3 mt-2">
          {/* Resumen superior estilo gestor documental */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 border-b border-border/40">
            <span className="font-semibold text-foreground">
              Archivos seleccionados ({items.length}/{maxFiles})
            </span>
            <div className="flex items-center gap-3">
              <span>
                {(items.reduce((acc, i) => acc + i.file.size, 0) / (1024 * 1024)).toFixed(1)} MB en total
              </span>
              <span>•</span>
              <span>
                {items.filter(i => i.status === "success").length} completados
              </span>
              {items.some(i => i.status === "uploading") && (
                <>
                  <span>•</span>
                  <span className="text-primary font-medium">
                    {items.filter(i => i.status === "uploading").length} cargando
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            role="list"
            aria-label="Archivos cargados"
            className="space-y-2"
          >
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
        </div>
      )}
    </div>
  )
}

export const FileUploadAdvanced = FileUpload
