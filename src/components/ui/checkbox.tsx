"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const checkboxVariants = cva(
  "peer relative flex shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-all outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 dark:bg-input/30",
  {
    variants: {
      variant: {
        primary:
          "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary enabled:hover:border-primary enabled:hover:ring-4 enabled:hover:ring-primary/20",
        secondary:
          "data-checked:border-secondary data-checked:bg-secondary data-checked:text-secondary-foreground dark:data-checked:bg-secondary enabled:hover:border-secondary enabled:hover:ring-4 enabled:hover:ring-secondary/20",
        error:
          "data-checked:border-danger data-checked:bg-danger data-checked:text-danger-foreground dark:data-checked:bg-danger border-danger/50 enabled:hover:border-danger enabled:hover:ring-4 enabled:hover:ring-danger/20",
        success:
          "data-checked:border-success data-checked:bg-success data-checked:text-success-foreground dark:data-checked:bg-success border-success/50 enabled:hover:border-success enabled:hover:ring-4 enabled:hover:ring-success/20",
        warning:
          "data-checked:border-warning data-checked:bg-warning data-checked:text-warning-foreground dark:data-checked:bg-warning border-warning/50 enabled:hover:border-warning enabled:hover:ring-4 enabled:hover:ring-warning/20",
        info:
          "data-checked:border-info data-checked:bg-info data-checked:text-info-foreground dark:data-checked:bg-info border-info/50 enabled:hover:border-info enabled:hover:ring-4 enabled:hover:ring-info/20",
      },
      size: {
        sm: "size-3.5",
        md: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Checkbox({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(checkboxVariants({ variant, size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "grid place-content-center text-current transition-none",
          size === "sm" && "[&>svg]:size-3",
          (size === "md" || !size) && "[&>svg]:size-3.5",
          size === "lg" && "[&>svg]:size-4"
        )}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
