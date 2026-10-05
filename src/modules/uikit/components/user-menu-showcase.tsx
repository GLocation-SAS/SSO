"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserCircle, Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PRESETS = [
  { label: "Desktop", icon: Monitor, width: 1280 },
  { label: "Tablet", icon: Tablet, width: 768 },
  { label: "Móvil", icon: Smartphone, width: 375 },
] as const;

export function UserMenuShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [isDragging, setIsDragging] = useState(false);

  // Detectar ancho máximo disponible
  useEffect(() => {
    const updateMax = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setMaxWidth(w);
        setViewportWidth((prev) => Math.min(prev, w));
      }
    };
    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  // Drag para resize manual
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startX = e.clientX;
      const startWidth = viewportWidth;

      const handleMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        const newWidth = Math.min(maxWidth, Math.max(320, startWidth + delta * 2));
        setViewportWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [viewportWidth, maxWidth]
  );

  return (
    <div ref={containerRef}>

        {/* ── Toolbar: presets + slider ── */}
        <div className="flex flex-wrap items-center justify-between gap-6 p-4 rounded-2xl border border-border bg-surface/50 mb-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Device presets */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Vista Dispositivo</span>
              <Tabs
                value={
                  Math.abs(viewportWidth - 1280) < 20 || (1280 > maxWidth && viewportWidth === maxWidth)
                    ? "Desktop"
                    : Math.abs(viewportWidth - 768) < 20 || (768 > maxWidth && viewportWidth === maxWidth)
                    ? "Tablet"
                    : "Móvil"
                }
                onValueChange={(val) => {
                  const preset = PRESETS.find((p) => p.label === val);
                  if (preset) {
                    setViewportWidth(Math.min(preset.width, maxWidth));
                  }
                }}
                className="w-auto"
              >
                <TabsList className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border h-auto">
                  {PRESETS.map((preset) => (
                    <TabsTrigger
                      key={preset.label}
                      value={preset.label}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-caption font-semibold transition-all duration-200 border-0 shadow-none cursor-pointer text-muted-foreground hover:text-foreground hover:bg-transparent bg-transparent",
                        "after:hidden data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 data-[state=active]:hover:bg-surface"
                      )}
                    >
                      <preset.icon className="size-3.5 text-secondary shrink-0" />
                      <span>{preset.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Range slider */}
          <div className="flex flex-col gap-1.5 min-w-[200px] text-left">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Ancho Viewport</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={320}
                max={maxWidth}
                value={viewportWidth}
                onChange={(e) => setViewportWidth(Number(e.target.value))}
                className="flex-1 h-1.5 accent-primary cursor-pointer"
                aria-label="Ancho del viewport"
              />
              <span className="text-caption font-mono font-bold text-muted-foreground tabular-nums min-w-[52px] text-right">
                {Math.round(viewportWidth)}px
              </span>
            </div>
          </div>
        </div>

        {/* ── Preview container con resize ── */}
        <div className="flex justify-center">
          <div
            className={cn(
              "relative border border-border rounded-xl overflow-hidden shadow-sm bg-background",
              "transition-[width] duration-150",
              isDragging && "transition-none"
            )}
            style={{ width: `${viewportWidth}px`, maxWidth: "100%" }}
          >
            {/* Iframe for viewport forcing */}
            <iframe
              src="/user-menu-preview"
              className="w-full h-[550px] border-none pointer-events-auto"
              title="User Menu Preview"
            />

            {/* ── Drag handle derecho ── */}
            <div
              onMouseDown={handleMouseDown}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 flex items-center justify-center cursor-ew-resize opacity-0 hover:opacity-100 group/handle transition-opacity",
                isDragging && "opacity-100"
              )}
            >
              <div className="w-1.5 h-8 bg-primary rounded-full shadow-md" />
            </div>
            
            {/* ── Drag handle izquierdo ── */}
            <div
              onMouseDown={handleMouseDown}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-12 flex items-center justify-center cursor-ew-resize opacity-0 hover:opacity-100 group/handle transition-opacity",
                isDragging && "opacity-100"
              )}
            >
              <div className="w-1.5 h-8 bg-primary rounded-full shadow-md" />
            </div>
          </div>
        </div>
      </div>
  );
}
