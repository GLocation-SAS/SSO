"use client"

import { SubSection } from "./sub-section";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Card } from "@/components/ui/card"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, BellIcon, TimerIcon, Loader2Icon, MessageSquare } from "lucide-react"




export function ToastShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void } = {}) {
  const showDefault = () => toast("Proceso en segundo plano", {
    description: "La sincronización se está llevando a cabo.",
    icon: <BellIcon className="size-5 fill-primary text-primary-foreground" />
  })

  const showSuccess = () => toast.success("Operación exitosa", {
    description: "Los datos se han guardado correctamente en el sistema."
  })

  const showInfo = () => toast.info("Información del sistema", {
    description: "Hay una nueva actualización disponible para el módulo de mapas."
  })

  const showWarning = () => toast.warning("Advertencia de seguridad", {
    description: "Tu sesión expirará en 5 minutos por inactividad."
  })

  const showError = () => toast.error("Error de conexión", {
    description: "No se pudo establecer conexión con el servidor. Reintente más tarde."
  })

  const showAction = () => toast("Usuario eliminado", {
    description: "El usuario ha sido eliminado del sistema.",
    action: {
      label: "Deshacer",
      onClick: () => console.log("Deshacer clickeado"),
    },
  })

  const showPromise = () => {
    const promise = new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "GLocation" }), 2000))

    toast.promise(promise, {
      loading: 'Importando archivo...',
      success: 'Archivo importado correctamente.',
      error: 'No se pudo completar la importación.',
    });
  }

  const showCustom = () => toast("Mensaje personalizado", {
    description: "Este es un toast con una configuración personalizada de duración.",
    duration: 5000,
  })

  return (
    <div className="space-y-10 w-full">
      {/* Semantic Variants */}
      <SubSection icon={MessageSquare} id="toast" title="Toast" description="Notificaciones temporales que confirman una acción, comunican un resultado o alertan sobre una situación sin interrumpir el flujo principal del usuario." registerSection={registerSection}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button
              variant="primary"
              onClick={showDefault}
              className="w-full"
            >
              <BellIcon className="size-4 mr-2" />
              Default Toast
            </Button>
            <Button
              variant="success"
              onClick={showSuccess}
              className="w-full"
            >
              <CircleCheckIcon className="size-4 mr-2" />
              Success Toast
            </Button>
            <Button
              variant="info"
              onClick={showInfo}
              className="w-full"
            >
              <InfoIcon className="size-4 mr-2" />
              Info Toast
            </Button>
            <Button
              variant="warning"
              onClick={showWarning}
              className="w-full"
            >
              <TriangleAlertIcon className="size-4 mr-2" />
              Warning Toast
            </Button>
            <Button
              variant="danger"
              onClick={showError}
              className="w-full"
            >
              <OctagonXIcon className="size-4 mr-2" />
              Error Toast
            </Button>
          </div>
        </SubSection>

        {/* Interaction Variants */}
        <SubSection title="Interacción y Estado" description="Algunas notificaciones pueden incluir una acción o reflejar el avance de procesos que continúan ejecutándose en segundo plano.">
          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={showAction}
            >
              <BellIcon className="size-4" />
              Con Acción
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={showPromise}
            >
              <Loader2Icon className="size-4 animate-spin" />
              Estado Promise
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={showCustom}
            >
              <TimerIcon className="size-4" />
              Duración Larga
            </Button>
          </div>
        </SubSection>
      <Toaster />
    </div>
  )
}
