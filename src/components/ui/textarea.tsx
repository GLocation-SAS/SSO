"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "group/textarea relative isolate flex min-h-32 w-full rounded-md border bg-transparent transition-[color,box-shadow,border-color] duration-500 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
  {
    variants: {
      state: {
        default: [
          "border-border",
          "[--input-glow:var(--primary)]",
          "[--input-radial:color-mix(in_srgb,var(--color-primary)_15%,transparent)]",
          "hover:border-primary/50",
          "focus-within:border-primary",
          "focus-within:shadow-[0_0_10px_-10px_var(--primary)]",
        ].join(" "),
        error: [
          "border-danger",
          "[--input-glow:var(--danger)]",
          "[--input-radial:color-mix(in_srgb,var(--color-danger)_12%,transparent)]",
          "focus-within:shadow-[0_0_10px_-8px_var(--danger)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

import { Button } from "@/components/ui/button"
import { SendHorizontal } from "lucide-react"

export interface TextareaProps
  extends React.ComponentProps<"textarea">,
  VariantProps<typeof textareaVariants> {
  showSendButton?: boolean
  onSend?: (value: string) => void
}

function Textarea({
  className,
  state,
  onFocus,
  onBlur,
  showSendButton,
  onSend,
  ...props
}: TextareaProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isFocused, setIsFocused] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleSend = () => {
    if (onSend && textareaRef.current) {
      onSend(textareaRef.current.value)
    }
  }

  return (
    <div
      data-slot="textarea-group"
      className={cn(textareaVariants({ state }), className)}
      onMouseMove={handleMouseMove}
    >
      {/* SOFT RADIAL EFFECT */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute",
          "z-[1]",
          "h-32",
          "w-32",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "rounded-full",
          "bg-[var(--input-radial)]",
          "blur-3xl",
          "transition-opacity",
          "duration-500",
          "opacity-0"
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isFocused ? 1 : 0,
        }}
      />

      {/* PERIMETRAL GLOW EFFECT */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute",
          "inset-0",
          "z-[2]",
          "rounded-[inherit]",
          "opacity-0",
          "transition-opacity",
          "duration-500",
          "shadow-[0_0_20px_-15px_var(--input-glow)]"
        )}
        style={{
          opacity: isFocused ? 1 : 0,
        }}
      />

      <div className="relative z-[3] flex w-full flex-1 rounded-[inherit] overflow-hidden">
        <textarea
          ref={textareaRef}
          data-slot="textarea"
          className={cn(
            "flex field-sizing-content min-h-32 w-full bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted-foreground md:text-sm resize-none",
            showSendButton && "pb-14"
          )}
          onFocus={(e) => {
            setIsFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          {...props}
        />
      </div>

      {showSendButton && (
        <div className="absolute right-3 bottom-3 z-[4]">
          <Button
            size="icon-sm"
            variant="primary"
            className="rounded-2xl shadow-lg shadow-primary/20"
            onClick={handleSend}
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export { Textarea, textareaVariants }
