"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const switchVariants = cva(
  "peer group/switch relative inline-flex shrink-0 items-center cursor-pointer  rounded-full border border-transparent shadow-xs transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-disabled:cursor-not-allowed data-disabled:opacity-50 ",
  {
    variants: {
      variant: {
        primary: "data-checked:bg-primary data-unchecked:bg-background border-2 border-primary enabled:hover:border-primary enabled:hover:ring-4 enabled:hover:ring-primary/20",
        secondary: "data-checked:bg-secondary data-unchecked:bg-background border-2 border-secondary enabled:hover:border-secondary enabled:hover:ring-4 enabled:hover:ring-secondary/20",
        success: "data-checked:bg-success data-unchecked:bg-background border-2 border-success enabled:hover:border-success enabled:hover:ring-4 enabled:hover:ring-success/20",
        error: "data-checked:bg-danger data-unchecked:bg-background border-2 border-danger enabled:hover:border-danger enabled:hover:ring-4 enabled:hover:ring-danger/20",
        warning: "data-checked:bg-warning data-unchecked:bg-background border-2 border-warning enabled:hover:border-warning enabled:hover:ring-4 enabled:hover:ring-warning/20",
        info: "data-checked:bg-info data-unchecked:bg-background border-2 border-info enabled:hover:border-info enabled:hover:ring-4 enabled:hover:ring-info/20",
      },
      size: {
        sm: "h-[14px] w-[24px]",
        default: "h-[18.4px] w-[32px]",
        lg: "h-[24px] w-[44px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full ring-0 transition-all duration-300",
  {
    variants: {
      variant: {
        primary: "data-unchecked:bg-primary data-checked:bg-white",
        secondary: "data-unchecked:bg-secondary data-checked:bg-white",
        success: "data-unchecked:bg-success data-checked:bg-white",
        error: "data-unchecked:bg-danger data-checked:bg-white",
        warning: "data-unchecked:bg-warning data-checked:bg-white",
        info: "data-unchecked:bg-info data-checked:bg-white",
      },
      size: {
        sm: "size-2.5 data-checked:translate-x-[10px] data-unchecked:translate-x-0.5",
        default: "size-3.5 data-checked:translate-x-[14px] data-unchecked:translate-x-0.5",
        lg: "size-4.5 data-checked:translate-x-[19px] data-unchecked:translate-x-0.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  VariantProps<typeof switchVariants> { }

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, variant = "primary", size = "default", ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(switchVariants({ variant, size }), className)}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(switchThumbVariants({ variant, size }))}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
