"use client";
import { SubSection } from "./sub-section";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Layers, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { DialogShowcase } from "./dialog-showcase";




export function ModalsOverlaysShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
        {/* 1. MODAL BASE */}
        <SubSection icon={ExternalLink} id="modal-base" title="Modal" description={<>Ventanas superpuestas que permiten mostrar información importante, completar una tarea puntual o solicitar una confirmación sin abandonar la pantalla actual.<br/><br/><span className="text-muted-foreground italic">Recomendación: Utilizar un modal cuando el usuario necesita concentrarse temporalmente en una acción específica antes de continuar.</span></>} registerSection={registerSection}>
          <div className="flex items-center gap-4 flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="neutral">Modal Mediano</Button>
              </DialogTrigger>
              <DialogContent size="default">
                <DialogHeader>
                  <DialogTitle>Título del Modal</DialogTitle>
                  <DialogDescription>Este es un ejemplo de contenido modal integrado dentro del sistema.</DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton>
                  <Button variant="primary" size="lg">Aceptar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SubSection>

        {/* 2. CONFIRMATION DIALOG */}
        <SubSection id="confirmation-dialog" title="Confirmation Dialog" description={<>Diálogo utilizado para confirmar acciones relevantes, especialmente aquellas que pueden modificar información, afectar permisos o tener consecuencias difíciles de revertir.<br/><br/><span className="text-muted-foreground italic">Debe responder claramente: ¿Qué va a ocurrir? ¿Qué consecuencia tiene? ¿Qué acción confirma el usuario?</span></>}>
          <div className="flex items-center gap-4 flex-wrap">

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="warning">Confirmation Dialog (Warning)</Button>
              </DialogTrigger>
              <DialogContent variant="warning">
                <DialogHeader>
                  <DialogTitle>¿Eliminar elemento?</DialogTitle>
                  <DialogDescription>Estás a punto de eliminar este elemento de la base de datos central. Esta acción no se puede deshacer.</DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton>
                  <Button variant="warning" size="lg">Eliminar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger">Eliminar capa (Danger)</Button>
              </DialogTrigger>
              <DialogContent variant="danger">
                <DialogHeader>
                  <DialogTitle>¿Eliminar esta capa?</DialogTitle>
                  <DialogDescription>Esta acción eliminará la capa del catálogo y dejará de estar disponible en el visor.</DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton>
                  <Button variant="danger" size="lg">Eliminar capa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SubSection>
        <DialogShowcase registerSection={registerSection} />
    </div>
  );
}
