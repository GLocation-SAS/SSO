"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon, AlertTriangle, X, Info, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DialogVariant = "default" | "success" | "danger" | "warning" | "info" | null | undefined

interface DialogContextValue {
  variant?: DialogVariant
}

const DialogContext = React.createContext<DialogContextValue>({ variant: "default" })

const dialogVariants = cva(
  "fixed top-1/2 left-1/2 z-50 flex flex-col max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 duration-300 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      variant: {
        default: "rounded-2xl border border-border bg-background shadow-xl p-6",
        success: "rounded-3xl border border-border/80 bg-background/98 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-success/15",
        danger: "rounded-3xl border border-border/80 bg-background/98 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-danger/15",
        warning: "rounded-3xl border border-border/80 bg-background/98 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-warning/15",
        info: "rounded-3xl border border-border/80 bg-background/98 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-info/15",
      },
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-3xl sm:max-w-4xl",
        "2xl": "max-w-5xl",
        "3xl": "max-w-6xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/60 backdrop-blur-sm duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogIcon({ variant }: { variant?: DialogVariant }) {
  if (!variant || variant === "default") return null

  const icons = {
    success: <Check className="size-8 text-success stroke-[2.8px]" />,
    danger: <X className="size-8 text-danger stroke-[2.5px]" />,
    warning: <AlertTriangle className="size-8 text-amber-500 dark:text-warning stroke-[2.2px]" />,
    info: <Info className="size-8 text-info stroke-[2.2px]" />,
  }

  const outerBg = {
    success: "bg-success/15 shadow-success/20",
    danger: "bg-danger/15 shadow-danger/20",
    warning: "bg-amber-500/15 shadow-warning/20",
    info: "bg-info/15 shadow-info/20",
  }

  return (
    <div className="flex justify-center w-full my-2">
      <div
        className={cn(
          "size-20 rounded-full flex items-center justify-center transition-all duration-300 animate-in zoom-in-75",
          outerBg[variant]
        )}
      >
        {icons[variant]}
      </div>
    </div>
  )
}

function DialogContent({
  className,
  children,
  variant = "default",
  size,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogVariants> & {
    showCloseButton?: boolean
  }) {
  const isStatus = Boolean(variant && variant !== "default")

  return (
    <DialogContext.Provider value={{ variant }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(dialogVariants({ variant, size }), "overflow-hidden", className)}
          {...props}
        >
          {/* Ambient Glow background ONLY for status dialogs */}
          {isStatus && (
            <div
              className={cn(
                "absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full blur-[80px] opacity-25 pointer-events-none transition-all duration-700",
                variant === "success" && "bg-success",
                variant === "danger" && "bg-danger",
                variant === "warning" && "bg-warning",
                variant === "info" && "bg-info"
              )}
            />
          )}

          {isStatus ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <DialogIcon variant={variant} />
              {children}
            </div>
          ) : (
            <div className="relative z-10 w-full flex flex-col min-h-0 flex-1 overflow-hidden">
              {children}
            </div>
          )}

          {showCloseButton && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <DialogPrimitive.Close
                    data-slot="dialog-close"
                    asChild
                    className="absolute top-4 right-4 z-20"
                  >
                    <Button
                      variant="ghost"
                      className="rounded-full size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
                      size="icon"
                    >
                      <XIcon className="size-4" />
                      <span className="sr-only">Cerrar</span>
                    </Button>
                  </DialogPrimitive.Close>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={4}>
                  <p className="text-xs">Cerrar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogContext.Provider>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(DialogContext)
  const isStatus = Boolean(variant && variant !== "default")

  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1.5 w-full",
        isStatus ? "items-center text-center" : "items-start text-left",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const { variant } = React.useContext(DialogContext)
  const isStatus = Boolean(variant && variant !== "default")

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        isStatus
          ? "flex flex-col-reverse sm:grid sm:grid-flow-col sm:auto-cols-fr items-center justify-center gap-3 w-full sm:w-fit sm:min-w-[280px] mx-auto pt-3 [&_button]:w-full"
          : "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 w-full pt-4",
        className
      )}
      {...props}
    >
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="neutral" size="default">
            Cerrar
          </Button>
        </DialogPrimitive.Close>
      )}
      {children}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  const { variant } = React.useContext(DialogContext)
  const isStatus = Boolean(variant && variant !== "default")

  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl sm:text-2xl font-heading font-bold tracking-tight text-foreground",
        isStatus && [
          "text-center font-black",
          variant === "warning" && "text-warning",
          variant === "danger" && "text-danger",
          variant === "success" && "text-success",
          variant === "info" && "text-info",
        ],
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  const { variant } = React.useContext(DialogContext)
  const isStatus = Boolean(variant && variant !== "default")

  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        isStatus ? "text-center max-w-sm" : "text-left",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
