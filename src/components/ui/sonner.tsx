"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      offset={80}
      icons={{
        success: (
          <div className="flex items-center justify-center shrink-0 ml-1 mr-6">
            <CircleCheckIcon className="size-6 text-success stroke-[2px]" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center shrink-0 ml-1 mr-6">
            <InfoIcon className="size-6 text-info stroke-[2px]" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center shrink-0 ml-1 mr-6">
            <TriangleAlertIcon className="size-6 text-warning stroke-[2px]" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center shrink-0 ml-1 mr-6">
            <OctagonXIcon className="size-6 text-danger stroke-[2px]" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center shrink-0 ml-1 mr-6">
            <Loader2Icon className="size-6 animate-spin text-primary stroke-[2px]" />
          </div>
        ),
      }}
      style={{} as React.CSSProperties}
      richColors
      toastOptions={{
        classNames: {
          toast: `
            group toast
            !rounded-[20px]
            !bg-surface
            !border
            !border-border
            !text-foreground
            !shadow-lg
            backdrop-blur-2xl
            transition-all duration-300
            !gap-4
            !p-4
            !items-center
            !min-w-[340px]
            font-sans
          `,

          title: `
            text-[15px]
            font-bold
            tracking-tight
            leading-tight
            text-left
            w-full
            group-[[data-type=success]]:text-success
            group-[[data-type=info]]:text-info
            group-[[data-type=warning]]:text-warning
            group-[[data-type=error]]:text-danger
            group-[[data-type=default]]:text-foreground
          `,

          description: `
            text-xs
            !text-muted-foreground
            leading-snug
            text-left
            w-full
            !mt-0.5
          `,

          actionButton: `
            group/badge inline-flex shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full font-bold uppercase tracking-wider whitespace-nowrap transition-all
            bg-primary text-primary-foreground border-transparent shadow-xs
            h-6 px-2.5 text-[10px]
            hover:bg-primary/90
          `,

          cancelButton: `
            rounded-xl
            bg-muted
            text-muted-foreground
            hover:bg-muted-foreground/10
            transition-all
          `,

          closeButton: `
            hover:bg-muted
            text-muted-foreground
            hover:text-foreground
            transition-all
          `,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }