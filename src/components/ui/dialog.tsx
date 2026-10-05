"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon, CheckCircle2, AlertTriangle, X, Info, HelpCircle, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const dialogVariants = cva(
  "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-2xl border-0 bg-background/98 backdrop-blur-2xl p-6 sm:p-8 duration-300 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 shadow-2xl",
  {
    variants: {
      variant: {
        default: "shadow-primary/10",
        success: "shadow-success/15",
        danger: "shadow-danger/15",
        warning: "shadow-warning/15",
        info: "shadow-info/15",
      },
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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

function DialogIcon({ variant }: { variant?: "default" | "success" | "danger" | "warning" | "info" | null }) {
  if (!variant || variant === "default") return null

  const icons = {
    success: <Check className="size-7 text-white stroke-[2.8px]" />,
    danger: <X className="size-8 text-white stroke-[2.5px]" />,
    warning: <AlertTriangle className="size-8 text-white stroke-[2.2px]" />,
    info: <Info className="size-8 text-white stroke-[2.2px]" />,
  }

  const outerBg = {
    success: "bg-success/15 shadow-success/20",
    danger: "bg-danger/15 shadow-danger/20",
    warning: "bg-warning/15 shadow-warning/20",
    info: "bg-info/15 shadow-info/20",
  }

  const innerBg = {
    success: "bg-success shadow-lg shadow-success/30",
    danger: "bg-danger shadow-lg shadow-danger/30",
    warning: "bg-warning shadow-lg shadow-warning/30",
    info: "bg-info shadow-lg shadow-info/30",
  }

  return (
    <div className="flex justify-center w-full my-2">
      {/* Outer soft halo circle */}
      <div
        className={cn(
          "size-20 rounded-full flex items-center justify-center transition-all duration-500 animate-in zoom-in-75 duration-300",
          outerBg[variant]
        )}
      >
        {/* Inner solid circle with white icon */}
        <div
          className={cn(
            "size-12 rounded-full flex items-center justify-center transition-all duration-300",
            innerBg[variant]
          )}
        >
          {icons[variant]}
        </div>
      </div>
    </div>
  )
}

function DialogContent({
  className,
  children,
  variant,
  size,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogVariants> & {
    showCloseButton?: boolean
  }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogVariants({ variant, size }), "overflow-hidden", className)}
        {...props}
      >
        {/* Ambient Glow background */}
        <div className={cn(
          "absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full blur-[80px] opacity-25 pointer-events-none transition-all duration-700",
          variant === "success" && "bg-success",
          variant === "danger" && "bg-danger",
          variant === "warning" && "bg-warning",
          variant === "info" && "bg-info",
          (variant === "default" || !variant) && "bg-primary"
        )} />

        <div className="relative z-10 flex flex-col items-center text-center gap-5">
          {variant && variant !== "default" && <DialogIcon variant={variant} />}
          {children}
        </div>

        {showCloseButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogPrimitive.Close
                  data-slot="dialog-close"
                  asChild
                  className="absolute top-4 right-4 z-20"
                >
                  <Button
                    variant="ghost"
                    className="rounded-full size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                    size="icon"
                  >
                    <XIcon className="size-4" />
                    <span className="sr-only">Cerrar</span>
                  </Button>
                </DialogPrimitive.Close>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-[60]">
                Cerrar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col items-center gap-2 text-center w-full", className)}
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
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:grid sm:grid-flow-col sm:auto-cols-fr items-center justify-center gap-3 w-full sm:w-fit sm:min-w-[280px] mx-auto pt-3 [&_button]:w-full [&_button]:h-11 [&_button]:text-sm [&_button]:font-semibold",
        className
      )}
      {...props}
    >
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="neutral">Cerrar</Button>
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
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl sm:text-2xl font-heading font-black tracking-tight text-foreground text-center",
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
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm sm:text-base text-muted-foreground leading-relaxed text-center max-w-sm",
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
