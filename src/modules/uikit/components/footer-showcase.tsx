"use client";

import React from "react";
import { SubSection } from './sub-section';
import { Footer } from '@/components/layout/footer';
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone, Settings2, User, Share2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { defaultFooterConfig } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const PRESETS = [
  { label: "Desktop", icon: Monitor, width: 1280 },
  { label: "Tablet", icon: Tablet, width: 768 },
  { label: "Móvil", icon: Smartphone, width: 375 },
] as const;

export function FooterShowcase() {
  const [theme, setTheme] = React.useState("light");
  const [config, setConfig] = React.useState(defaultFooterConfig);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [draftConfig, setDraftConfig] = React.useState(defaultFooterConfig);
  const [activeStep, setActiveStep] = React.useState(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleSave = () => {
    setConfig(draftConfig);
    setIsModalOpen(false);
    toast.success("Configuración del footer guardada correctamente");
  };

  const handleOpen = () => {
    setDraftConfig(config);
    setActiveStep(0);
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_FOOTER', payload: config }, '*');
    }
  }, [config]);

  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "light");
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = React.useState(1280);
  const [maxWidth, setMaxWidth] = React.useState(1280);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
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

  const handleMouseDown = React.useCallback(
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
    <div ref={containerRef} className="space-y-6">
      <div className="pt-2"></div>

      {/* ── Toolbar: presets + slider ── */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-4 rounded-2xl border border-border bg-surface/50">
        <div className="flex flex-wrap items-center gap-6">
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

      {/* ── Botón de Personalización ── */}
      <div className="flex justify-end">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpen} variant="outline" className="gap-2">
              <Settings2 className="size-4" />
              Editar Componente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Footer</DialogTitle>
              <DialogDescription>
                Personaliza la información institucional y redes sociales del footer. Los cambios se aplicarán cuando guardes.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-8 w-full max-w-sm mx-auto">
                <ol className="flex items-start justify-between w-full relative">
                  {[{ id: 'contacto', title: 'Contacto', icon: User }, { id: 'redes', title: 'Redes Sociales', icon: Share2 }].map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;
                    return (
                      <li key={step.id} className="flex-1 relative flex flex-col items-center group">
                        {index < 1 && (
                          <div className="absolute top-[24px] left-[50%] right-[-50%] h-[3px] bg-neutral-200 dark:bg-neutral-800 z-0">
                            <motion.div
                              className="h-full bg-primary-400 origin-left"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: activeStep > 0 ? 1 : 0 }}
                              transition={{ ease: "easeInOut", duration: 0.35 }}
                            />
                          </div>
                        )}
                        <button
                          onClick={() => setActiveStep(index)}
                          className={cn(
                            "size-12 rounded-full flex items-center justify-center relative transition-all duration-300 border-2 outline-none z-10",
                            isActive ? "ring-4 ring-primary/20 dark:ring-primary/40 ring-offset-0" : "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isCompleted || isActive
                              ? "bg-primary-400 border-primary-400 text-white shadow-md shadow-primary-400/20"
                              : "bg-background border-neutral-200 dark:border-neutral-800 text-muted-foreground",
                            "cursor-pointer hover:border-primary-400/50"
                          )}
                        >
                          <Icon className="size-5 stroke-[2px]" />
                        </button>
                        <div className="mt-3 text-center z-10">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                            isActive || isCompleted ? "text-primary-400" : "text-muted-foreground"
                          )}>
                            {index + 1}. {step.title}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="min-h-[250px] relative">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="contacto"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-bold text-muted-foreground block mb-2 text-left">Dirección 1</span>
                          <InputGroup>
                            <InputGroupInput value={draftConfig.contact.address1} onChange={(e) => setDraftConfig(prev => ({ ...prev, contact: { ...prev.contact, address1: e.target.value } }))} />
                          </InputGroup>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-muted-foreground block mb-2 text-left">Dirección 2</span>
                          <InputGroup>
                            <InputGroupInput value={draftConfig.contact.address2} onChange={(e) => setDraftConfig(prev => ({ ...prev, contact: { ...prev.contact, address2: e.target.value } }))} />
                          </InputGroup>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-muted-foreground block mb-2 text-left">Teléfono</span>
                          <InputGroup>
                            <InputGroupInput value={draftConfig.contact.phone} onChange={(e) => setDraftConfig(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))} />
                          </InputGroup>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-muted-foreground block mb-2 text-left">Página Oficial (Enlaces Oficiales)</span>
                          <InputGroup>
                            <InputGroupInput value={draftConfig.website.label} onChange={(e) => setDraftConfig(prev => ({ ...prev, website: { ...prev.website, label: e.target.value } }))} />
                          </InputGroup>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-xs font-bold text-muted-foreground block mb-2 text-left">Copyright</span>
                          <InputGroup>
                            <InputGroupInput value={draftConfig.copyright} onChange={(e) => setDraftConfig(prev => ({ ...prev, copyright: e.target.value }))} />
                          </InputGroup>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="redes"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col gap-3">
                        {Object.entries(draftConfig.socials).map(([key, data]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-background p-3 rounded-xl border border-border">
                            <div className="flex items-center gap-3 w-full sm:w-36 shrink-0">
                              <Switch
                                checked={data.enabled}
                                onCheckedChange={(checked) => {
                                  setDraftConfig(prev => ({ ...prev, socials: { ...prev.socials, [key]: { ...prev.socials[key as keyof typeof draftConfig.socials], enabled: checked } } }));
                                }}
                              />
                              <span className="font-bold capitalize text-sm">{key}</span>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <InputGroup size="sm" className="h-8">
                                <InputGroupInput
                                  placeholder="URL (ej: https://...)"
                                  value={data.url}
                                  onChange={(e) => setDraftConfig(prev => ({ ...prev, socials: { ...prev.socials, [key]: { ...prev.socials[key as keyof typeof draftConfig.socials], url: e.target.value } } }))}
                                  className="text-xs"
                                />
                              </InputGroup>
                              <InputGroup size="sm" className="h-8">
                                <InputGroupInput
                                  placeholder="Usuario (ej: @ministerio)"
                                  value={data.username}
                                  onChange={(e) => setDraftConfig(prev => ({ ...prev, socials: { ...prev.socials, [key]: { ...prev.socials[key as keyof typeof draftConfig.socials], username: e.target.value } } }))}
                                  className="text-xs"
                                />
                              </InputGroup>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <DialogFooter className="flex flex-row justify-between w-full sm:justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <div className="flex items-center gap-2">
                {activeStep > 0 && (
                  <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)}>
                    <ArrowLeft className="size-4 mr-2" /> Anterior
                  </Button>
                )}
                {activeStep < 1 ? (
                  <Button onClick={() => setActiveStep(activeStep + 1)}>
                    Siguiente <ArrowRight className="size-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => setIsConfirmOpen(true)}>Guardar cambios</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleSave}
        />
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
          {/* Footer renderizado directamente */}
          <div className="w-full h-[800px] border-none bg-background pointer-events-auto flex flex-col justify-end relative [transform:translateZ(0)] overflow-hidden" data-theme={theme}>
            <Footer />
          </div>
          {(() => {
            if (typeof window !== "undefined") {
              window.postMessage({ type: 'UPDATE_FOOTER', payload: config }, '*');
            }
            return null;
          })()}

          <div
            onMouseDown={handleMouseDown}
            className={cn(
              "absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-10",
              "flex items-center justify-center",
              "bg-transparent hover:bg-primary/5",
              "transition-colors duration-150",
              "group"
            )}
            aria-label="Arrastrar para cambiar ancho"
          >
            <div
              className={cn(
                "w-1 h-10 rounded-full",
                "bg-border group-hover:bg-primary/40",
                "transition-colors duration-150",
                isDragging && "bg-primary/60"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
