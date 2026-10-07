"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Check, Sun, Moon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload, type FileUploadItem } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/data-display";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetPath } from "@/lib/assets";

interface LogoManagerCardProps {
  /** Identificador del recurso en minedec-kit-assets (bucket de borrador, NUNCA minedec-design-tokens). */
  slot: "horizontal" | "vertical" | "escudo" | "favicon";
  title: string;
  description: string;
  badge1: string;
  badge2: string;
  defaultLightImg: string;
  defaultDarkImg: string;
  editLabel?: string;
  maxHeightClass?: string;
  allowedFormats?: string;
}

export function LogoManagerCard({
  slot,
  title,
  description,
  badge1,
  badge2,
  defaultLightImg,
  defaultDarkImg,
  editLabel = "Editar recurso",
  maxHeightClass = "max-h-16",
  allowedFormats = "SVG o PNG",
}: LogoManagerCardProps) {
  const [lightImg, setLightImg] = React.useState(defaultLightImg);
  const [darkImg, setDarkImg] = React.useState(defaultDarkImg);

  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [deletePending, setDeletePending] = React.useState<{ id: string, type: 'light' | 'dark' } | null>(null);

  const [lightFiles, setLightFiles] = React.useState<FileUploadItem[]>([]);
  const [darkFiles, setDarkFiles] = React.useState<FileUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // When opening the upload modal, clear previous files
  const handleOpenUpload = () => {
    setLightFiles([]);
    setDarkFiles([]);
    setCurrentStep(1);
    setIsUploadOpen(true);
  };

  const handleFileSelect = (newFiles: File[], type: 'light' | 'dark') => {
    if (newFiles.length === 0) return;

    const file = newFiles[0];
    const isSvgOrPng = file.type === "image/svg+xml" || file.type === "image/png";
    const setter = type === 'light' ? setLightFiles : setDarkFiles;

    if (!isSvgOrPng) {
      setter([
        {
          id: Math.random().toString(36).substring(7),
          file,
          status: "error",
          errorType: "format",
          progress: 0,
        },
      ]);
      return;
    }

    setter([
      {
        id: Math.random().toString(36).substring(7),
        file,
        status: "success",
        errorType: null,
        progress: 100,
      },
    ]);
  };

  const handleRemoveFile = (id: string, type: 'light' | 'dark') => {
    // Instead of removing immediately, ask for confirmation
    setDeletePending({ id, type });
  };

  const confirmDeleteFile = () => {
    if (!deletePending) return;
    const { id, type } = deletePending;
    if (type === 'light') {
      setLightFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setDarkFiles((prev) => prev.filter((f) => f.id !== id));
    }
    setDeletePending(null);
  };

  const handleOpenConfirm = () => {
    const hasLight = lightFiles.length > 0 && lightFiles[0].status === "success";
    const hasDark = darkFiles.length > 0 && darkFiles[0].status === "success";

    if (!hasLight && !hasDark) return;
    setIsUploadOpen(false);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setIsUploadOpen(true);
  };

  const handleConfirmUpload = async () => {
    const hasLight = lightFiles.length > 0 && lightFiles[0].status === "success";
    const hasDark = darkFiles.length > 0 && darkFiles[0].status === "success";
    if (!hasLight && !hasDark) return;

    setIsProcessing(true);

    try {
      const uploadPromises = [];

      if (hasLight) {
        const bodyLight = new FormData();
        bodyLight.append("file", lightFiles[0].file);
        // Compatibilidad: el light principal lo subimos como slot (p/ej 'horizontal')
        bodyLight.append("slot", slot);
        uploadPromises.push(
          fetch("/api/kit-assets", { method: "POST", body: bodyLight })
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => {
              setLightImg(data.url);
              // Tambien seteamos la variable en version "-light" por si acaso
              const bodyLight2 = new FormData();
              bodyLight2.append("file", lightFiles[0].file);
              bodyLight2.append("slot", `${slot}-light`);
              return fetch("/api/kit-assets", { method: "POST", body: bodyLight2 });
            })
        );
      }

      if (hasDark) {
        const bodyDark = new FormData();
        bodyDark.append("file", darkFiles[0].file);
        bodyDark.append("slot", `${slot}-dark`);
        uploadPromises.push(
          fetch("/api/kit-assets", { method: "POST", body: bodyDark })
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => setDarkImg(data.url))
        );
      }

      await Promise.all(uploadPromises);

      toast.success(`${title} actualizado`, {
        description: "Los recursos se guardaron en el bucket de borrador del kit.",
      });
    } catch (err) {
      toast.error(`No se pudo actualizar ${title.toLowerCase()}`, {
        description: err instanceof Error ? err.message : "Error desconocido.",
      });
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
    }
  };

  const currentLightFile = lightFiles[0];
  const isValidLight = currentLightFile?.status === "success";
  const previewLightUrl = isValidLight ? URL.createObjectURL(currentLightFile.file) : null;

  const currentDarkFile = darkFiles[0];
  const isValidDark = currentDarkFile?.status === "success";
  const previewDarkUrl = isValidDark ? URL.createObjectURL(currentDarkFile.file) : null;

  const hasAnyValid = isValidLight || isValidDark;

  return (
    <>
      <div className="flex flex-col rounded-2xl border border-border/60 shadow-xs overflow-hidden group bg-surface">
        {/* Image Box */}
        <div className="relative h-48 p-6 flex flex-col items-center justify-center border-b border-border/40 bg-surface/50">
          <img
            src={getAssetPath(lightImg)}
            alt={`${title} Light`}
            className={`dark:hidden ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105`}
            onError={() => setLightImg(defaultLightImg)}
          />
          <img
            src={getAssetPath(darkImg)}
            alt={`${title} Dark`}
            className={`hidden dark:block ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md`}
            onError={() => setDarkImg(defaultDarkImg)}
          />
        </div>

        {/* Info Area */}
        <div className="p-6 flex flex-col flex-1 bg-surface">
          <div className="flex gap-2 mb-4">
            <Badge tone="info" appearance="soft" size="sm" className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1">
              {badge1}
            </Badge>
            <Badge tone="warning" appearance="soft" size="sm" className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1">
              {badge2}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-foreground font-bold text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 min-h-[3rem]">
              {description}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <a href={getAssetPath(lightImg)} download className="w-full dark:hidden">
              <Button variant="primary" className="w-full rounded-xl" leftIcon={<Download className="size-4" />}>
                Descargar SVG
              </Button>
            </a>
            <a href={getAssetPath(darkImg)} download className="w-full hidden dark:block">
              <Button variant="primary" className="w-full rounded-xl" leftIcon={<Download className="size-4" />}>
                Descargar SVG
              </Button>
            </a>

            <Button variant="neutral" className="w-full rounded-xl" leftIcon={<Edit2 className="size-4" />} onClick={handleOpenUpload}>
              {editLabel}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent size="xl" className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-0 text-center sm:text-center">
            <DialogTitle className="text-center">Reemplazar {title.toLowerCase()}</DialogTitle>
            <DialogDescription className="mt-1 whitespace-nowrap text-center mx-auto">
              Carga las versiones del logotipo para fondos claros y oscuros.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 flex flex-col gap-4 mt-2">
            {/* Indicador de pasos estilo Stepper */}
            <div className="w-full px-4 sm:px-12 mb-0">
              <ol className="flex items-start justify-between w-full relative">
                {[
                  { id: 'light', title: 'Fondos claros', icon: Sun },
                  { id: 'dark', title: 'Fondos oscuros', icon: Moon }
                ].map((step, index) => {
                  const Icon = step.icon;
                  // En este caso simple: index 0 (Paso 1), index 1 (Paso 2)
                  const isActive = index + 1 === currentStep;
                  const isCompleted = currentStep > index + 1;

                  return (
                    <li
                      key={step.id}
                      className="flex-1 relative flex flex-col items-center group"
                      aria-current={isActive ? "step" : undefined}
                    >
                      {/* Conector Line */}
                      {index === 0 && (
                        <div className="absolute top-[24px] left-[50%] right-[-50%] h-[3px] bg-neutral-200 dark:bg-neutral-800 z-0">
                          <motion.div
                            className="h-full bg-primary-400 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: currentStep > 1 ? 1 : 0 }}
                            transition={{ ease: "easeInOut", duration: 0.35 }}
                          />
                        </div>
                      )}

                      {/* Nodo Squircle Interactivo */}
                      <motion.button
                        onClick={() => setCurrentStep((index + 1) as 1 | 2)}
                        animate={isCompleted && !isActive ? { scale: [1, 0.95, 1] } : { scale: 1 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        className={cn(
                          "size-12 rounded-full flex items-center justify-center relative transition-all duration-300 border-2 outline-none z-10",
                          isActive ? "ring-4 ring-primary/20 dark:ring-primary/40 ring-offset-0" : "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isCompleted || isActive
                            ? "bg-primary-400 border-primary-400 text-white shadow-md shadow-primary-400/20"
                            : "bg-background border-neutral-200 dark:border-neutral-800 text-muted-foreground",
                          "cursor-pointer hover:border-primary-400/50"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isCompleted || isActive ? "active" : "pending"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                          >
                            <Icon className="size-5 stroke-[2px]" />
                          </motion.div>
                        </AnimatePresence>
                      </motion.button>

                      {/* Textos inferiores */}
                      <div className="mt-3 text-center z-10">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                          isActive || isCompleted ? "text-primary-400" : "text-muted-foreground"
                        )}>
                          {step.title}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col border border-border rounded-xl p-5 bg-surface/30 gap-4"
                >
                  <div>
                    <h4 className="text-foreground font-bold text-sm">Versión para fondos claros</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      Logotipo principal a color · Recomendado para fondos blancos o claros.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 items-start">
                    <FileUpload
                      accept=".svg,.png"
                      allowedFormats={allowedFormats}
                      maxFiles={1}
                      multiple={false}
                      items={lightFiles}
                      onFileSelect={(files) => handleFileSelect(files, 'light')}
                      onRemove={(id) => handleRemoveFile(id, 'light')}
                      onCancel={(id) => handleRemoveFile(id, 'light')}
                    />
                    {previewLightUrl && (
                      <div className="h-[120px] bg-muted rounded-xl border border-border flex items-center justify-center p-2 shadow-inner">
                        <img src={previewLightUrl} alt="Light Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    SVG o PNG · Fondo transparente recomendado
                  </span>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col border border-border rounded-xl p-5 bg-surface/30 gap-4"
                >
                  <div>
                    <h4 className="text-foreground font-bold text-sm">Versión para fondos oscuros</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      Logotipo optimizado · Recomendado para fondos oscuros.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 items-start">
                    <FileUpload
                      accept=".svg,.png"
                      allowedFormats={allowedFormats}
                      maxFiles={1}
                      multiple={false}
                      items={darkFiles}
                      onFileSelect={(files) => handleFileSelect(files, 'dark')}
                      onRemove={(id) => handleRemoveFile(id, 'dark')}
                      onCancel={(id) => handleRemoveFile(id, 'dark')}
                    />
                    {previewDarkUrl && (
                      <div className="h-[120px] bg-primary-900 rounded-xl border border-primary-800 flex items-center justify-center p-2 shadow-inner">
                        <img src={previewDarkUrl} alt="Dark Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    SVG o PNG · Fondo transparente recomendado
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter showCloseButton={false} className="w-full mt-2 pt-4 border-t border-border/40">
            <div className="grid grid-cols-2 w-full gap-3">
              {currentStep === 1 ? (
                <>
                  <Button variant="neutral" className="w-full" onClick={() => setIsUploadOpen(false)}>Cancelar</Button>
                  <Button variant="primary" className="w-full" onClick={() => setCurrentStep(2)}>Continuar</Button>
                </>
              ) : (
                <>
                  <Button variant="neutral" className="w-full" onClick={() => setCurrentStep(1)}>Atrás</Button>
                  <Button variant="primary" className="w-full" disabled={!hasAnyValid} onClick={handleOpenConfirm}>Guardar cambios</Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Guardar cambios</DialogTitle>
            <DialogDescription>
              Se subirán los nuevos archivos para el {title.toLowerCase()}. Esto reemplazará las versiones anteriores.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fondos claros</span>
              <div className="h-[100px] bg-muted rounded-xl border border-border flex items-center justify-center p-2">
                {previewLightUrl ? (
                  <img src={previewLightUrl} alt="Light" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Sin cambios</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fondos oscuros</span>
              <div className="h-[100px] bg-primary-900 rounded-xl border border-primary-800 flex items-center justify-center p-2">
                {previewDarkUrl ? (
                  <img src={previewDarkUrl} alt="Dark" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Sin cambios</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter showCloseButton={false} className="w-full mt-4">
            <div className="grid grid-cols-2 w-full gap-3">
              <Button variant="neutral" className="w-full" disabled={isProcessing} onClick={handleCancelConfirm}>Cancelar</Button>
              <Button variant="warning" className="w-full h-auto py-3 whitespace-nowrap" disabled={isProcessing} onClick={handleConfirmUpload}>
                {isProcessing ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Actualizando...
                  </>
                ) : (
                  "Confirmar reemplazo"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePending} onOpenChange={(open) => !open && setDeletePending(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar archivo seleccionado?</DialogTitle>
            <DialogDescription>
              Estás a punto de quitar este archivo de la selección. Tendrás que volver a cargarlo si deseas usarlo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false} className="w-full mt-4">
            <div className="grid grid-cols-2 w-full gap-3">
              <Button variant="neutral" className="w-full" onClick={() => setDeletePending(null)}>Cancelar</Button>
              <Button variant="danger" className="w-full" onClick={confirmDeleteFile}>Sí, eliminar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
