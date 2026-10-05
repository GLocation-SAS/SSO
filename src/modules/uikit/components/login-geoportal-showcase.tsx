"use client";

import React from "react";
import { SubSection } from './sub-section';
import { UserCircle2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const defaultLoginConfig = {
  title: "Bienvenido al \n Geoportal MINEDEC",
  description: "Información geoespacial, análisis de riesgos e indicadores territoriales para apoyar la toma de decisiones sobre las instituciones educativas.",
  cards: [
    { title: "Visor territorial", description: "Explora instituciones educativas, capas geográficas y áreas de influencia.", icon: "Map", color: "primary" },
    { title: "Riesgos e indicadores", description: "Consulta niveles de riesgo, alertas e indicadores del entorno educativo.", icon: "FileText", color: "success" },
    { title: "Reportes y fichas", description: "Analiza información territorial y genera fichas y reportes institucionales.", icon: "BarChart3", color: "info" },
    { title: "Asistente IA", description: "Consulta información del Geoportal utilizando lenguaje natural.", icon: "Bot", color: "warning" },
  ],
  loginButtonText: "Iniciar sesión",
  googleButtonText: "Iniciar sesión con Google",
};

export function LoginGeoportalShowcase() {
  const [config, setConfig] = React.useState(defaultLoginConfig);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [draftConfig, setDraftConfig] = React.useState(defaultLoginConfig);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleSave = () => {
    setConfig(draftConfig);
    setIsModalOpen(false);
    toast.success("Configuración del login guardada correctamente");
  };

  const handleOpen = () => {
    setDraftConfig(config);
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_LOGIN', payload: config }, '*');
    }
  }, [config]);

  return (
    <div className="space-y-6">
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
              <DialogTitle>Editar Pantalla de Login</DialogTitle>
              <DialogDescription>
                Personaliza los textos, descripciones y botones de la pantalla de inicio de sesión.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">

              <div>
                <h3 className="text-body font-bold mb-4">Información Principal</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block mb-2">Título Principal</span>
                    <InputGroup multiline>
                      <InputGroupTextarea
                        value={draftConfig.title}
                        onChange={(e) => setDraftConfig(prev => ({ ...prev, title: e.target.value }))}
                        rows={2}
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block mb-2">Descripción</span>
                    <InputGroup multiline>
                      <InputGroupTextarea
                        value={draftConfig.description}
                        onChange={(e) => setDraftConfig(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-body font-bold mb-4">Capacidades (Cards)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftConfig.cards.map((card, index) => (
                    <div key={index} className="bg-background p-3 rounded-xl border border-border space-y-3">
                      <span className="font-bold text-xs">Card {index + 1}</span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Título</span>
                        <InputGroup size="sm">
                          <InputGroupInput
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...draftConfig.cards];
                              newCards[index].title = e.target.value;
                              setDraftConfig(prev => ({ ...prev, cards: newCards }));
                            }}
                          />
                        </InputGroup>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Descripción</span>
                        <InputGroup size="sm" multiline>
                          <InputGroupTextarea
                            value={card.description}
                            onChange={(e) => {
                              const newCards = [...draftConfig.cards];
                              newCards[index].description = e.target.value;
                              setDraftConfig(prev => ({ ...prev, cards: newCards }));
                            }}
                            rows={2}
                            className="text-xs"
                          />
                        </InputGroup>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-body font-bold mb-4">Botones</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block mb-2">Botón Principal</span>
                    <InputGroup>
                      <InputGroupInput
                        value={draftConfig.loginButtonText}
                        onChange={(e) => setDraftConfig(prev => ({ ...prev, loginButtonText: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block mb-2">Botón de Google</span>
                    <InputGroup>
                      <InputGroupInput
                        value={draftConfig.googleButtonText}
                        onChange={(e) => setDraftConfig(prev => ({ ...prev, googleButtonText: e.target.value }))}
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={() => setIsConfirmOpen(true)}>Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleSave}
        />
      </div>

      {/* ── Preview container ── */}
      <div className="flex justify-center">
        <div className="relative border border-border rounded-xl overflow-hidden shadow-sm bg-background w-full">
          <iframe
            ref={iframeRef}
            src={`/login-geoportal`}
            className="w-full h-[800px] border-none bg-background pointer-events-auto"
            title="Login Preview"
            onLoad={() => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_LOGIN', payload: config }, '*');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
