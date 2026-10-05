"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Construction } from "@/components/layout/construction/construction";
import { Hammer, Layout, FileQuestion } from "lucide-react";
import { SubSection } from "./sub-section";
import { LoginGeoportalShowcase } from "./login-geoportal-showcase";

export function SystemPagesShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
      {/* Login UI Kit (Button only) */}
      <SubSection
        id="login-uikit"
        title="Pantalla de Login UI Kit"
        description="Pantalla de acceso para el UI Kit."
        icon={Layout}
        registerSection={registerSection}
        isEditable={true}
      >
        <div className="flex gap-4 items-center flex-wrap">
          <Button variant="primary" onClick={() => window.open('/login', '_blank')}>
            <Layout className="size-4 mr-2" />
            Ir a Login UI Kit
          </Button>
        </div>
      </SubSection>

      {/* Login Geoportal (Full iframe and editor) */}
      <SubSection
        id="login-geoportal-internal"
        title="Pantalla de Login Geoportal"
        description="Pantalla de acceso para funcionarios y usuarios internos."
        icon={Layout}
        registerSection={registerSection}
        isEditable={true}
      >
        <LoginGeoportalShowcase />
      </SubSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <SubSection
          id="404-page"
          title="Pantalla de Estado 404"
          description="Pantalla que informa al usuario que la página solicitada no está disponible y le ofrece una forma clara de regresar a una sección válida del sistema."
          icon={FileQuestion}
          registerSection={registerSection}
        >
          <div className="flex gap-4 items-center flex-wrap">
            <Button variant="neutral" onClick={() => window.open('/ruta-inexistente', '_blank')}>
              <FileQuestion className="size-4 mr-2" />
              Probar Pantalla 404
            </Button>
          </div>
        </SubSection>

        <SubSection
          id="under-construction-page"
          title="Página en construcción"
          description="Pantalla que indica al usuario que la sección a la que intenta acceder se encuentra actualmente en desarrollo y no está disponible de momento."
          icon={Hammer}
          registerSection={registerSection}
        >
          <div className="w-full h-[600px] border border-border rounded-xl overflow-hidden bg-background relative">
            <Construction />
          </div>
        </SubSection>
      </div>
    </div>
  );
}
