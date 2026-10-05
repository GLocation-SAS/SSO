"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // Base
    "group",
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",

    "overflow-hidden",
    "rounded-md",
    "border-2",


    "font-semibold",
    "outline-none",
    "select-none",
    "isolate",

    // Motion
    "transition-[border-color,color,transform,box-shadow]",
    "duration-500",

    // States
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "active:scale-[0.96]",

    // Icons
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "border-primary",
          "text-white",
          "bg-primary",

          // Radial fill
          "[--radial-bg:var(--primitive-primary-800)] dark:[--radial-bg:var(--primitive-primary-900)]",

          // Glow
          "[--glow:var(--primitive-primary-500)]",

          // Hover
          "hover:text-white/90",

        ].join(" "),

        secondary: [
          "border-secondary/40",
          "text-secondary/80",
          "dark:border-secondary/20",
          "dark:text-secondary-200",
          "bg-secondary/5",
          "dark:bg-secondary/10",

          "[--radial-bg:var(--primitive-secondary-200)] dark:[--radial-bg:var(--primitive-secondary-800)]",
          "[--glow:var(--primitive-secondary-300)] dark:[--glow:var(--primitive-secondary-500)]",

          "hover:bg-secondary/15",
          "hover:text-secondary",
          "dark:hover:text-white",
          "dark:hover:bg-secondary-800",
        ].join(" "),

        success: [
          "border-success",
          "text-white",
          "bg-success",

          "[--radial-bg:var(--primitive-success-600)]",
          "[--glow:var(--primitive-success-600)]",

          "hover:text-white/90",
        ].join(" "),

        warning: [
          "border-warning",
          "text-neutral-950 dark:text-neutral-950",
          "bg-warning",
          "font-bold",

          "[--radial-bg:var(--primitive-warning-400)] dark:[--radial-bg:var(--primitive-warning-300)]",
          "[--glow:var(--primitive-warning-500)]",

          "hover:bg-warning/90 hover:text-neutral-950",
        ].join(" "),

        danger: [
          "border-danger",
          "text-white",
          "bg-danger",

          "[--radial-bg:var(--primitive-danger-700)]",
          "[--glow:var(--primitive-danger-700)]",

          "hover:text-white/90",
        ].join(" "),

        info: [
          "border-info",
          "text-white",
          "bg-info",

          "[--radial-bg:var(--primitive-info-600)]",
          "[--glow:var(--primitive-info-600)]",

          "hover:bg-info/90",
          "hover:border-info/90",
          "hover:text-white",
        ].join(" "),
        ghost: [
          // Colors
          "border-transparent",
          "text-foreground",

          // Transparent base
          "bg-transparent",

          // Radial
          "[--radial-bg:var(--primitive-neutral-200)]",
          "dark:[--radial-bg:var(--primitive-neutral-800)]",

          // Glow
          "[--glow:var(--primitive-neutral-300)]",
          "dark:[--glow:var(--primitive-neutral-700)]",

          // Hover
          "hover:text-foreground",
          "hover:border-border/40",
          "hover:bg-muted/30",
        ].join(" "),

        neutral: [
          // Base
          "border-border",
          "bg-muted",
          "text-foreground",
          "font-semibold",

          // Radial
          "[--radial-bg:var(--primitive-neutral-200)]",
          "dark:[--radial-bg:var(--primitive-neutral-700)]",

          // Glow
          "[--glow:var(--primitive-neutral-300)]",
          "dark:[--glow:var(--primitive-neutral-600)]",

          // Hover
          "hover:bg-muted/80",
          "hover:text-foreground",
          "hover:border-border/80",

        ].join(" "),

        outline: [
          // Base
          "border-border",
          "bg-muted/40",
          "text-foreground",

          // Radial
          "[--radial-bg:var(--primitive-neutral-200)]",
          "dark:[--radial-bg:var(--primitive-neutral-700)]",

          // Glow
          "[--glow:var(--primitive-neutral-300)]",
          "dark:[--glow:var(--primitive-neutral-600)]",

          // Hover
          "hover:border-foreground/20",
          "hover:bg-muted/60",
          "hover:text-foreground",
          "hover:shadow-xs",
        ].join(" "),
      },

      size: {
        default: "h-11 px-8 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-10 text-lg",
        icon: "w-11 h-11 shrink-0",
        "icon-sm": "w-9 h-9 shrink-0",
        "icon-xs": "w-7 h-7 shrink-0",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = React.useState(false)

    const handleMouseMove = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      const rect = e.currentTarget.getBoundingClientRect()

      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const innerContent = (
      <>
        {/* RADIAL FILL */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute",
            "z-[1]",
            "h-64",
            "w-64",
            "rounded-full",
            "bg-[var(--radial-bg)]",
            "transform-gpu",
            "will-change-transform"
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(-50%, -50%) scale(${isHovered ? 1.6 : 0})`,
            opacity: isHovered ? 1 : 0,
            transition: "transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-in-out",
          }}
        />

        {/* LIQUID GLOW */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute",
            "z-[2]",
            "h-40",
            "w-40",
            "-translate-x-1/2",
            "-translate-y-1/2",
            "rounded-full",
            "bg-[var(--glow)]",
            "blur-[45px]"
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            opacity: isHovered ? 0.45 : 0,
            transition: "opacity 800ms ease-in-out",
          }}
        />

        {/* SOFT LIGHT */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute",
            "inset-0",
            "z-[3]",
            "bg-gradient-to-br",
            "from-white/10",
            "to-transparent",
            "transition-opacity",
            "duration-500",
            "ease-in-out",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />
      </>
    )

    const childNode = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children

    const content = (
      <>
        {innerContent}
        {/* CONTENT */}
        <span
          className={cn(
            "pointer-events-none relative z-[4] flex w-full items-center gap-2",
            className?.includes("justify-between")
              ? "justify-between"
              : className?.includes("justify-start")
                ? "justify-start"
                : "justify-center"
          )}
        >
          {leftIcon}
          {childNode}
          {rightIcon}
        </span>
      </>
    )

    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        onMouseEnter={(e) => {
          setIsHovered(true)
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          setIsHovered(false)
          props.onMouseLeave?.(e)
        }}
        onMouseMove={(e) => {
          handleMouseMove(e)
          props.onMouseMove?.(e)
        }}
      >
        {asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
          ? React.cloneElement(children, {
            children: content,
          })
          : content}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }