"use client";
import { SubSection } from "./sub-section";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Palette, Layers, Type, Box, SquareDashed, Moon, Sun, Circle, Download, Contrast, Image as ImageIcon, Edit2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogoManagerCard } from "./logo-manager-card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/data-display";

const SEMANTIC_COLORS = [
  { name: "Primary", title: "Primary", hex: "#2D2D96", variable: "--primary", class: "bg-primary", foreground: "text-primary-foreground", description: <>Color principal para acciones importantes y elementos institucionales. Se utiliza, por ejemplo, en botones principales, navegación y encabezados destacados.</> },
  { name: "Secondary", title: "Secondary", hex: "#4C50A8", variable: "--secondary", class: "bg-secondary", foreground: "text-secondary-foreground", description: <>Color de apoyo para acciones menos prioritarias, etiquetas, elementos complementarios y fondos suaves.</> },
  { name: "Success", title: "Success", hex: "#006D68", variable: "--success", class: "bg-success", foreground: "text-success-foreground", description: <>Indica que una acción se realizó correctamente o que un proceso terminó de forma satisfactoria.<br /><br /><strong className="text-foreground font-medium">Ejemplos:</strong> registro guardado, archivo cargado correctamente, proceso completado.</> },
  { name: "Warning", title: "Warning", hex: "#E8890A", variable: "--warning", class: "bg-warning", foreground: "text-warning-foreground", description: <>Advierte sobre una situación que requiere atención, pero que todavía no representa un error crítico.<br /><br /><strong className="text-foreground font-medium">Ejemplos:</strong> información incompleta, riesgo preventivo, acción pendiente.</> },
  { name: "Danger", title: "Danger", hex: "#722F37", variable: "--danger", class: "bg-danger", foreground: "text-danger-foreground", description: <>Indica errores, situaciones críticas o acciones que pueden tener consecuencias importantes.<br /><br /><strong className="text-foreground font-medium">Ejemplos:</strong> eliminación de información, error del sistema, alerta de alto riesgo.</> },
  { name: "Info", title: "Info", hex: "#2C3459", variable: "--info", class: "bg-info", foreground: "text-info-foreground", description: <>Se utiliza para mostrar información útil, instrucciones, ayuda o contexto adicional.<br /><br /><strong className="text-foreground font-medium">Ejemplos:</strong> mensajes de orientación, tooltips, recomendaciones o avisos informativos.</> },
  { name: "Surface", title: "Surface", hex: "#F4F7F9", variable: "--surface", class: "bg-surface", foreground: "text-surface-foreground", description: <>Color utilizado como fondo de tarjetas, paneles y áreas donde se organiza el contenido.</> },
  { name: "Muted", title: "Muted", hex: "#6F7F8F", variable: "--muted", class: "bg-muted", foreground: "text-muted-foreground", description: <>Se utiliza en información que debe permanecer visible pero con menor importancia visual.<br /><br /><strong className="text-foreground font-medium">Ejemplos:</strong> textos secundarios, fechas, metadatos, controles deshabilitados.</> },
  { name: "Accent", title: "Accent", hex: "#6F7BF7", variable: "--accent", class: "bg-accent", foreground: "text-accent-foreground", description: <>Color utilizado para destacar elementos específicos de la interfaz sin reemplazar el color principal.<br /><br /><strong className="text-foreground font-medium">Ejemplos:</strong> elementos seleccionados, indicadores, pequeños destacados visuales.</> },
];

const GOVERNMENT_COLORS = [
  { name: "Government Accent 1", hex: "#FFC003", token: "--government-accent-1", class: "bg-[var(--government-accent-1)]", foreground: "text-neutral-900" },
  { name: "Government Primary", hex: "#2D2D96", token: "--government-primary", class: "bg-[var(--government-primary)]", foreground: "text-white" },
  { name: "Government Accent 2", hex: "#FF0018", token: "--government-accent-2", class: "bg-[var(--government-accent-2)]", foreground: "text-white" },
  { name: "Government Accent 3", hex: "#7B7CB6", token: "--government-accent-3", class: "bg-[var(--government-accent-3)]", foreground: "text-white" },
  { name: "Government Secondary", hex: "#4C50A8", token: "--government-secondary", class: "bg-[var(--government-secondary)]", foreground: "text-white" },
  { name: "Government Info", hex: "#2C3459", token: "--government-info", class: "bg-[var(--government-info)]", foreground: "text-white" },
];

const FULL_SCALES = [
  {
    name: "Primary",
    title: "Primary",
    prefix: "primary",
    colors: [
      { level: "50", hex: "#F4F4F9" },
      { level: "100", hex: "#EAEAF4" },
      { level: "200", hex: "#C0C0DF" },
      { level: "300", hex: "#9696CA" },
      { level: "400", hex: "#6C6CB5" },
      { level: "500", hex: "#2D2D96" },
      { level: "600", hex: "#242478" },
      { level: "700", hex: "#1B1B5A" },
      { level: "800", hex: "#12123C" },
      { level: "900", hex: "#09091E" },
    ]
  },
  {
    name: "Secondary",
    title: "Secondary",
    prefix: "secondary",
    colors: [
      { level: "50", hex: "#F6F6F9" },
      { level: "100", hex: "#ECEEF4" },
      { level: "200", hex: "#CCD0E5" },
      { level: "300", hex: "#AEB2D6" },
      { level: "400", hex: "#8F94C6" },
      { level: "500", hex: "#4C50A8" },
      { level: "600", hex: "#3D4086" },
      { level: "700", hex: "#2E3065" },
      { level: "800", hex: "#1E2043" },
      { level: "900", hex: "#0F1022" },
    ]
  },
  {
    name: "Success",
    title: "Success",
    prefix: "success",
    colors: [
      { level: "50", hex: "#E6F0F0" },
      { level: "100", hex: "#CCE1E0" },
      { level: "200", hex: "#99C4C2" },
      { level: "300", hex: "#66A6A3" },
      { level: "400", hex: "#338985" },
      { level: "500", hex: "#006D68" },
      { level: "600", hex: "#005753" },
      { level: "700", hex: "#00413E" },
      { level: "800", hex: "#002C2A" },
      { level: "900", hex: "#001615" },
    ]
  },
  {
    name: "Warning",
    title: "Warning",
    prefix: "warning",
    colors: [
      { level: "50", hex: "#FDF3E6" },
      { level: "100", hex: "#FBE8CD" },
      { level: "200", hex: "#F7D09B" },
      { level: "300", hex: "#F2B968" },
      { level: "400", hex: "#EEA136" },
      { level: "500", hex: "#E8890A" },
      { level: "600", hex: "#BA6E08" },
      { level: "700", hex: "#8B5206" },
      { level: "800", hex: "#5D3704" },
      { level: "900", hex: "#2E1B02" },
    ]
  },
  {
    name: "Danger",
    title: "Danger",
    prefix: "danger",
    colors: [
      { level: "50", hex: "#F1EAEB" },
      { level: "100", hex: "#E3D5D7" },
      { level: "200", hex: "#C7ABAF" },
      { level: "300", hex: "#AA8287" },
      { level: "400", hex: "#8E585F" },
      { level: "500", hex: "#722F37" },
      { level: "600", hex: "#5B262C" },
      { level: "700", hex: "#441C21" },
      { level: "800", hex: "#2E1316" },
      { level: "900", hex: "#17090B" },
    ]
  },
  {
    name: "Info",
    title: "Info",
    prefix: "info",
    colors: [
      { level: "50", hex: "#F4F4F6" },
      { level: "100", hex: "#E9EAEE" },
      { level: "200", hex: "#BFC2CD" },
      { level: "300", hex: "#9599AC" },
      { level: "400", hex: "#6B708A" },
      { level: "500", hex: "#2C3459" },
      { level: "600", hex: "#232947" },
      { level: "700", hex: "#1A1F35" },
      { level: "800", hex: "#111423" },
      { level: "900", hex: "#080A11" },
    ]
  },
  {
    name: "Neutral",
    title: "Gris base",
    prefix: "neutral",
    colors: [
      { level: "50", hex: "#FFFFFF" },
      { level: "100", hex: "#F8F9FA" },
      { level: "200", hex: "#E9ECEF" },
      { level: "300", hex: "#DEE2E6" },
      { level: "400", hex: "#CED4DA" },
      { level: "500", hex: "#ADB5BD" },
      { level: "600", hex: "#6C757D" },
      { level: "700", hex: "#495057" },
      { level: "800", hex: "#343A40" },
      { level: "900", hex: "#212529" },
    ]
  },
  {
    name: "Data",
    title: "Gráficos y Datos",
    prefix: "chart",
    colors: [
      { level: "1", hex: "#2563EB" },
      { level: "2", hex: "#0891B2" },
      { level: "3", hex: "#7C3AED" },
      { level: "4", hex: "#15803D" },
      { level: "5", hex: "#D97706" },
      { level: "6", hex: "#BE185D" },
    ]
  },
  {
    name: "Avatar",
    title: "Avatar Dinámico",
    prefix: "avatar",
    colors: [
      { level: "0-bg", hex: "#FEE2E2" },
      { level: "1-bg", hex: "#FFEDD5" },
      { level: "2-bg", hex: "#FEF3C7" },
      { level: "3-bg", hex: "#ECFCCB" },
      { level: "4-bg", hex: "#DCFCE7" },
      { level: "5-bg", hex: "#D1FAE5" },
      { level: "6-bg", hex: "#CCFBF1" },
      { level: "7-bg", hex: "#CFFAFE" },
      { level: "8-bg", hex: "#E0F2FE" },
      { level: "9-bg", hex: "#DBEAFE" },
      { level: "10-bg", hex: "#E0E7FF" },
      { level: "11-bg", hex: "#EDE9FE" },
      { level: "12-bg", hex: "#F3E8FF" },
      { level: "13-bg", hex: "#FAE8FF" },
      { level: "14-bg", hex: "#FCE7F3" },
      { level: "15-bg", hex: "#FFE4E6" },
    ]
  }
];

const TYPOGRAPHY_SCALE = [
  { level: "H1", style: "Título Principal", size: "32px", weight: "700", usage: "Encabezados principales de página", className: "text-h1 font-heading font-bold" },
  { level: "H2", style: "Título Secundario", size: "24px", weight: "600", usage: "Secciones dentro de una página", className: "text-h2 font-heading font-semibold" },
  { level: "H3", style: "Título Terciario", size: "20px", weight: "600", usage: "Subsecciones o tarjetas", className: "text-h3 font-heading font-semibold" },
  { level: "Body", style: "Texto del Cuerpo", size: "16px", weight: "400", usage: "Contenido principal y párrafos", className: "text-body font-normal" },
  { level: "Caption", style: "Nota al Pie", size: "12px", weight: "400", usage: "Metadatos, avisos legales", className: "text-caption font-normal" },
  { level: "Button", style: "Texto del Botón", size: "14px", weight: "500", usage: "Etiquetas de botones y acciones", className: "text-body-sm font-medium" },
];




export function StyleGuide({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const [activeScaleName, setActiveScaleName] = useState(FULL_SCALES[0].name);
  const activeScale = FULL_SCALES.find((s) => s.name === activeScaleName) || FULL_SCALES[0];
  const [simulatedColors, setSimulatedColors] = useState<Record<string, string>>({});
  const [editingColor, setEditingColor] = useState<{ name: string, hex: string, newHex?: string, scaleId?: string, level?: string } | null>(null);
  const [isApplyingColor, setIsApplyingColor] = useState(false);

  // Tipografía
  const [simulatedFonts, setSimulatedFonts] = useState<{ heading: string, body: string }>({ heading: "Barlow", body: "Montserrat" });
  const [editingFontFamily, setEditingFontFamily] = useState<{ id: "heading" | "body", title: string, currentFont: string, newFont?: string } | null>(null);
  const [isApplyingFont, setIsApplyingFont] = useState(false);
  const [showConfirmFont, setShowConfirmFont] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiada: ${text}`);
  };

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
      {/* Subsección 0: Brand Assets / Logos Oficiales */}
      <SubSection
        id="foundations-logos"
        registerSection={registerSection}
        title="Recursos de Marca: Logotipos"
        icon={ImageIcon}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 w-full">

          {/* Card 1: Horizontal */}
          <LogoManagerCard
            slot="horizontal"
            title="Logotipo Horizontal"
            description="Versión principal del logotipo. Recomendada para encabezados, páginas web, documentos y espacios horizontales."
            badge1="HORIZONTAL"
            badge2="PRINCIPAL"
            defaultLightImg="/horizontal-light.svg"
            defaultDarkImg="/horizontal-dark.svg"
            editLabel="Editar logotipo"
          />

          {/* Card 2: Vertical */}
          <LogoManagerCard
            slot="vertical"
            title="Logotipo Vertical"
            description="Versión alternativa para espacios más estrechos o composiciones verticales, donde el logotipo horizontal no se adapta correctamente."
            badge1="VERTICAL"
            badge2="SECUNDARIO"
            defaultLightImg="/vertical-light.svg"
            defaultDarkImg="/vertical-dark.svg"
            editLabel="Editar logotipo"
            maxHeightClass="max-h-24"
          />

          {/* Card 3: Símbolo (Escudo) */}
          <LogoManagerCard
            slot="escudo"
            title="Escudo Nacional"
            description="Símbolo institucional que puede utilizarse de forma independiente únicamente en los casos definidos por los lineamientos de marca."
            badge1="SÍMBOLO"
            badge2="SECUNDARIO"
            defaultLightImg="/escudo-light.svg"
            defaultDarkImg="/escudo-dark.svg"
            editLabel="Editar símbolo"
            maxHeightClass="max-h-20"
          />

          {/* Card 4: Favicon */}
          <LogoManagerCard
            slot="favicon"
            title="Favicon"
            description="Versión simplificada del símbolo que identifica el sitio en la pestaña del navegador y en espacios digitales de tamaño muy pequeño."
            badge1="FAVICON"
            badge2="MÍNIMO"
            defaultLightImg="/favicon-light.svg"
            defaultDarkImg="/favicon-dark.svg"
            editLabel="Editar favicon"
            allowedFormats=".svg,.png,.ico"
          />
        </div>
      </SubSection>

      {/* Subsección 1: Paleta de Gobierno */}
      <SubSection
        id="foundations-government-colors"
        registerSection={registerSection}
        title="Paleta Cromática de Gobierno"
        icon={Palette}
        description={
          <>
            Estos son los colores oficiales de Gobierno que sirven como referencia visual para la interfaz de MINEDEC. A partir de ellos se definen los colores que se utilizan en botones, navegación, mensajes, estados y otros elementos del sistema.<br /><br />
            Se conserva el valor oficial como parte de la identidad institucional, aunque no necesariamente todos los colores se utilicen como botones o estados.
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOVERNMENT_COLORS.map((color) => (
            <div
              key={color.name}
              className="flex flex-col rounded-xl border border-border/60 shadow-sm overflow-hidden bg-surface group"
            >
              {/* Top Half (Color) */}
              <div
                className={cn("p-5 flex flex-col justify-between h-36 transition-all duration-300 group-hover:brightness-105", color.foreground)}
                style={{ backgroundColor: simulatedColors[color.name] || color.hex }}
              >
                <div className="flex justify-between items-center w-full">
                  <Badge variant="secondary" className="bg-black/30 text-white hover:bg-black/40 border-transparent pointer-events-none">
                    {color.name}
                  </Badge>
                  <Badge variant="secondary" className="bg-black/30 text-white hover:bg-black/40 border-transparent font-mono pointer-events-none">
                    {simulatedColors[color.name] || color.hex}
                  </Badge>
                </div>
                <h3 className="text-xl font-heading font-bold text-left">{color.name}</h3>
              </div>

              {/* Bottom Half (Details) */}
              <div className="p-5 flex flex-col gap-6 bg-surface/40 flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Variable para desarrollo</span>
                  <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded w-fit">{color.token}</code>
                </div>
                <div className="mt-auto pt-4 border-t border-border/40">
                  <Button variant="neutral" size="sm" className="w-full text-xs" onClick={() => setEditingColor({ name: color.name, hex: color.hex })}>
                    Editar color
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Subsección 1.2: Aplicación en UI */}
      <SubSection
        id="foundations-ui-application"
        registerSection={registerSection}
        title="Aplicación en UI"
        description="Estos colores oficiales se asignan a funciones específicas dentro de la interfaz para que las acciones y mensajes sean consistentes en todo el sistema."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-background/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg shadow-inner shrink-0" style={{ backgroundColor: simulatedColors["Government Primary"] || "var(--government-primary)" }} />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Primary</span>
                <span className="text-xs font-mono text-muted-foreground mt-0.5">Government Primary • {simulatedColors["Government Primary"] || "#2D2D96"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-background/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg shadow-inner shrink-0" style={{ backgroundColor: simulatedColors["Government Secondary"] || "var(--government-secondary)" }} />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Secondary</span>
                <span className="text-xs font-mono text-muted-foreground mt-0.5">Government Secondary • {simulatedColors["Government Secondary"] || "#4C50A8"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-background/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg shadow-inner shrink-0" style={{ backgroundColor: simulatedColors["Government Info"] || "var(--government-info)" }} />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Info</span>
                <span className="text-xs font-mono text-muted-foreground mt-0.5">Government Info • {simulatedColors["Government Info"] || "#2C3459"}</span>
              </div>
            </div>
          </div>
        </div>
      </SubSection>

      {/* Subsección 1.5: Colores de Marca */}
      <SubSection
        id="foundations-colors"
        registerSection={registerSection}
        title="Colores Generales Base y Semánticos"
        icon={Contrast}
        description="Los colores semánticos ayudan a reconocer rápidamente qué está ocurriendo en la interfaz. Cada color comunica un significado específico, como éxito, advertencia, error o información. Estos son colores generales base y semánticos."
      >

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEMANTIC_COLORS.map((color) => (
            <div
              key={color.name}
              className="flex flex-col rounded-xl border border-border/60 shadow-sm overflow-hidden bg-surface group"
            >
              {/* Top Half (Color) */}
              <div className={cn("p-5 flex flex-col justify-between h-36 transition-all duration-300 group-hover:brightness-105", color.class, color.foreground)}>
                <div className="flex justify-between items-center w-full">
                  <Badge variant="secondary" className="bg-black/30 text-white hover:bg-black/40 border-transparent pointer-events-none">
                    {color.name}
                  </Badge>
                  <Badge variant="secondary" className="bg-black/30 text-white hover:bg-black/40 border-transparent font-mono pointer-events-none">
                    {color.hex}
                  </Badge>
                </div>
                <h3 className="text-xl font-heading font-bold text-left">{color.title}</h3>
              </div>

              {/* Bottom Half (Details) */}
              <div className="p-5 flex flex-col gap-4 bg-surface/40 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {color.description}
                </p>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Token CSS</span>
                  <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded w-fit">{color.variable}</code>
                </div>
                <div className="mt-auto pt-4 border-t border-border/40">
                  <Button variant="neutral" size="sm" className="w-full text-xs" onClick={() => setEditingColor({ name: color.title, hex: color.hex })}>
                    Editar color
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Subsección 2: Escalas Cromáticas Primitivas */}
      <SubSection
        id="foundations-scales"
        registerSection={registerSection}
        title="Escalas Cromáticas"
        icon={Palette}
        description={
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Escalas cromáticas primitivas · 50–900</span>
            <p>Cada color principal cuenta con diferentes tonos, desde los más claros hasta los más oscuros. Estas variaciones permiten crear fondos, bordes, estados al pasar el cursor, elementos seleccionados y textos manteniendo una misma familia visual.</p>
          </div>
        }
      >

        {/* Tabs */}
        <div className="mb-8 w-full">
          <Tabs value={activeScaleName} onValueChange={setActiveScaleName} className="w-full">
            <TabsList className="flex flex-wrap h-auto w-full justify-start md:w-auto md:inline-flex">
              {FULL_SCALES.map((scale) => (
                <TabsTrigger
                  key={scale.name}
                  value={scale.name}
                  className="gap-2"
                >
                  <span
                    className={cn("w-2 h-2 rounded-full", activeScaleName !== scale.name && "opacity-70")}
                    style={{ backgroundColor: scale.colors.find(c => c.level === "500")?.hex || "transparent" }}
                  />
                  {scale.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Selected Scale Card */}
        <div className="bg-card rounded-[2rem] border border-border/50 p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 rounded-full border border-border/50 bg-surface/50 text-muted-foreground text-xs font-bold tracking-widest shadow-sm">
                {activeScale.name}
              </div>
              <div>
                <h3 className="text-h3 font-heading font-bold text-foreground">
                  {activeScale.title}
                </h3>
                <p className="text-caption text-muted-foreground mt-3 flex items-center gap-2">
                  <span className="uppercase text-[10px] font-bold tracking-wider opacity-70">Referencia técnica para desarrollo:</span>
                  <code className="text-primary font-mono bg-muted/50 px-1.5 py-0.5 rounded">bg-{activeScale.prefix}-500</code> ({activeScale.colors.find(c => c.level === "500")?.hex})
                </p>
              </div>
            </div>

            {/* Small gradient bar and Edit action */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex h-3 w-48 rounded-full overflow-hidden shadow-inner">
                {activeScale.colors.map((c) => (
                  <div key={c.level} className="h-full flex-1" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <Button
                variant="neutral"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const hexValue = simulatedColors[activeScale.name] || activeScale.colors.find(c => c.level === "500")?.hex || "";
                  setEditingColor({
                    name: activeScale.title,
                    hex: hexValue,
                    newHex: hexValue,
                    scaleId: activeScale.name
                  });
                }}
              >
                Editar color principal
              </Button>
            </div>
          </div>

          {/* Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-4">
            {activeScale.colors.map((color) => {
              const specificSimulatedColor = simulatedColors[`${activeScale.name}-${color.level}`];
              const isSimulatedBase = !!simulatedColors[activeScale.name];
              const isMain = color.level === "500" || color.level === "1" || color.level === "0-bg";

              const displayHex = specificSimulatedColor || (isSimulatedBase && isMain ? simulatedColors[activeScale.name] : color.hex);
              const isOutdated = isSimulatedBase && !isMain && !specificSimulatedColor;

              return (
                <div
                  key={color.level}
                  className={cn(
                    "group relative flex flex-col items-center justify-center p-3 py-4 rounded-2xl bg-surface border border-border/40 transition-all duration-300 overflow-hidden",
                    !isOutdated && "hover:bg-surface/70 hover:-translate-y-1",
                    isOutdated && "opacity-60 bg-muted/20"
                  )}
                >
                  {/* Copiar color click area */}
                  <div
                    className="absolute inset-0 cursor-pointer z-0"
                    onClick={() => handleCopy(`bg-${activeScale.prefix}-${color.level}`, "Clase Tailwind")}
                    title={`Copiar bg-${activeScale.prefix}-${color.level}`}
                  />

                  {/* Editar color botón */}
                  <Button
                    variant="secondary"
                    size="icon-xs"
                    className="absolute top-2 right-2 size-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-background/80 hover:bg-background backdrop-blur shadow-sm text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingColor({
                        name: `${activeScale.title} - ${color.level}`,
                        hex: displayHex,
                        newHex: displayHex,
                        scaleId: activeScale.name,
                        level: color.level
                      });
                    }}
                    title="Editar este tono"
                  >
                    <Edit2 className="size-3" />
                  </Button>

                  <div
                    className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-sm mb-3 shrink-0 transition-transform duration-300 relative z-10 pointer-events-none", !isOutdated && "group-hover:scale-110")}
                    style={{ backgroundColor: displayHex }}
                  />
                  <div className="flex flex-col items-center gap-0.5 z-10 w-full pointer-events-none">
                    <span className="text-sm font-bold text-foreground truncate w-full text-center">{color.level}</span>
                    <span className={cn("text-[10px] text-muted-foreground uppercase font-mono truncate w-full text-center", specificSimulatedColor || (isSimulatedBase && isMain) ? "font-bold text-primary" : "opacity-80")}>{displayHex}</span>
                  </div>

                  {isOutdated && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none p-1 z-20">
                      <Badge tone="warning" appearance="solid" className="text-[8px] h-4 px-1 absolute top-2 whitespace-normal text-center leading-tight pointer-events-none shadow-none">
                        Desactualizado
                      </Badge>
                    </div>
                  )}
                  {specificSimulatedColor && !isMain && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                      <Badge tone="success" appearance="solid" className="text-[8px] h-4 px-1 whitespace-nowrap shadow-sm">
                        Modificado
                      </Badge>
                    </div>
                  )}
                  {isSimulatedBase && isMain && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                      <Badge tone="success" appearance="solid" className="text-[8px] h-4 px-1 whitespace-nowrap shadow-sm">
                        Base nuevo
                      </Badge>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </SubSection>

      {/* Subsección 3: Sistema Tipográfico */}
      <SubSection
        id="foundations-typography"
        registerSection={registerSection}
        title="Tipografía"
        icon={Type}
        description={
          <>
            Jerarquía visual utilizando <strong className="text-foreground">{simulatedFonts.heading}</strong> para títulos y encabezados, combinada con <strong className="text-foreground">{simulatedFonts.body}</strong> para cuerpo de texto.
          </>
        }
      >
        <div className="flex flex-col gap-10">
          {[
            {
              id: "heading" as const,
              title: "Tipografía de títulos",
              currentFont: simulatedFonts.heading,
              items: TYPOGRAPHY_SCALE.filter(t => t.className.includes("font-heading"))
            },
            {
              id: "body" as const,
              title: "Tipografía de cuerpo",
              currentFont: simulatedFonts.body,
              items: TYPOGRAPHY_SCALE.filter(t => !t.className.includes("font-heading"))
            }
          ].map((group) => (
            <div key={group.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-h4 font-bold text-foreground flex items-center gap-2">
                  {group.title} <Badge appearance="soft" tone="neutral" className="ml-2 font-mono">{group.currentFont}</Badge>
                </h4>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => {
                    setEditingFontFamily({
                      id: group.id,
                      title: group.title,
                      currentFont: group.currentFont,
                      newFont: group.currentFont
                    });
                  }}
                >
                  Editar tipografía
                </Button>
              </div>

              <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-card text-left shadow-sm">
                <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-4 border-b border-border bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-2">Token</div>
                  <div className="col-span-3">Estilo & Peso</div>
                  <div className="col-span-2">Tamaño</div>
                  <div className="col-span-5">Muestra</div>
                </div>
                {group.items.map((type, i) => (
                  <div key={type.level} className={cn("grid grid-cols-1 md:grid-cols-12 gap-6 px-8 py-6 md:items-center", i !== group.items.length - 1 && "border-b border-border")}>
                    <div className="md:col-span-2 flex items-center justify-start">
                      <span className="font-mono text-sm font-bold text-primary">{type.level}</span>
                    </div>
                    <div className="md:col-span-3 flex flex-col justify-center items-start text-left">
                      <span className="text-sm font-medium text-foreground">{type.style}</span>
                      <span className="text-caption text-muted-foreground mt-0.5">{type.weight}</span>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-start">
                      <Badge tone="neutral" appearance="soft" size="md" className="font-mono">{type.size}</Badge>
                    </div>
                    <div className={cn("md:col-span-5 truncate text-left flex items-center justify-start text-foreground", type.className)} style={{ fontFamily: group.currentFont }}>
                      El veloz murciélago hindú comía...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Subsección 4: Sombras y Elevación */}
      <SubSection
        id="foundations-shadows"
        registerSection={registerSection}
        title="Sombras y Elevación"
        icon={Layers}
        description="Sistema de sombras semánticas para establecer jerarquía y crear sensación de volumen real."
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { level: "xs", class: "shadow-xs", desc: "Elementos interactivos pequeños, inputs" },
            { level: "sm", class: "shadow-sm", desc: "Botones, tarjetas sutiles" },
            { level: "md", class: "shadow-md", desc: "Dropdowns, menús, tarjetas elevadas" },
            { level: "lg", class: "shadow-lg", desc: "Modales, popovers destacados" },
          ].map((shadow) => (
            <div key={shadow.level} className="flex flex-col group">
              <div className="h-64 flex items-center justify-center p-6 relative bg-white dark:bg-neutral-950 rounded-[2rem] border border-border/40 mb-6 transition-all duration-300">
                <div
                  className={cn(
                    "w-36 h-36 bg-surface border border-border/30 rounded-2xl flex flex-col items-center justify-center relative z-10 transition-transform duration-500 group-hover:-translate-y-2",
                    shadow.class
                  )}
                >
                  <span className="text-3xl font-heading font-bold text-foreground">{shadow.level.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex flex-col px-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-heading text-xl font-bold text-foreground uppercase">{shadow.level}</span>
                  <Badge tone="neutral" appearance="soft" size="sm" className="font-mono pointer-events-none">
                    var(--elevation-{shadow.level})
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{shadow.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Subsección 5: Radios y Bordes */}
      <SubSection
        id="foundations-radius"
        registerSection={registerSection}
        title="Radios y Bordes"
        icon={SquareDashed}
        description="Redondez base del sistema (0.75rem) aplicada proporcionalmente a los elementos."
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { level: "sm", class: "rounded-sm", px: "4.8px", desc: "Inputs o chips compactos" },
            { level: "md", class: "rounded-md", px: "9.6px", desc: "Botones y controles" },
            { level: "lg", class: "rounded-lg", px: "12px", desc: "Tarjetas y paneles" },
            { level: "xl", class: "rounded-xl", px: "16.8px", desc: "Modales y contenedores grandes" },
          ].map((radius) => (
            <div key={radius.level} className="flex flex-col group">
              <div className="h-64 flex items-center justify-center p-6 relative bg-white dark:bg-neutral-950 rounded-[2rem] border border-border/40 mb-6 transition-all duration-300">
                <div
                  className={cn(
                    "w-36 h-36 bg-surface border-2 border-border/60 flex flex-col items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105 shadow-sm",
                    radius.class
                  )}
                >
                  <span className="font-mono text-xl font-bold text-foreground tracking-tight">{radius.px}</span>
                </div>
              </div>
              <div className="flex flex-col px-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-heading text-xl font-bold text-foreground uppercase">{radius.level}</span>
                  <Badge tone="neutral" appearance="soft" size="sm" className="font-mono pointer-events-none">
                    var(--radius-{radius.level})
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{radius.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <Dialog open={!!editingColor} onOpenChange={(open) => !open && setEditingColor(null)}>
        <DialogContent variant="warning" className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-warning">Editar color {editingColor?.name}</DialogTitle>
            <DialogDescription>
              Vas a modificar el color base del sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Color actual */}
              <div className="flex flex-col gap-2 items-center">
                <span className="text-sm font-bold text-foreground">Color actual</span>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface w-full">
                  <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: editingColor?.hex }} />
                  <span className="font-mono text-base font-bold uppercase">{editingColor?.hex}</span>
                </div>
              </div>

              {/* Right Column: Nuevo color */}
              <div className="flex flex-col gap-2 items-center">
                <span className="text-sm font-bold text-foreground">Nuevo color (Simulación)</span>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface w-full relative">
                  <div
                    className="w-12 h-12 rounded-lg shadow-sm relative overflow-hidden"
                    style={{ backgroundColor: editingColor?.newHex || editingColor?.hex }}
                  >
                    <input
                      type="color"
                      value={editingColor?.newHex || editingColor?.hex || "#000000"}
                      onChange={(e) => setEditingColor(prev => prev ? { ...prev, newHex: e.target.value } : null)}
                      className="absolute inset-[-10px] w-[150%] h-[150%] cursor-pointer opacity-0"
                    />
                  </div>
                  <span className="font-mono text-base font-bold uppercase">
                    {editingColor?.newHex || editingColor?.hex}
                  </span>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl flex items-center gap-3 font-sans">
              <svg className="size-5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex flex-col gap-2 flex-1">
                {editingColor && ["Government Accent 1", "Government Accent 2", "Government Accent 3"].includes(editingColor.name) ? (
                  <p className="text-sm text-warning-900 dark:text-warning-200 text-left font-normal">
                    Este color es un acento gubernamental y <strong className="font-bold">no cuenta con una escala cromática</strong> de 10 tonos en el sistema. Su modificación solo afectará a esta variable en particular.
                  </p>
                ) : (
                  <p className="text-sm text-warning-900 dark:text-warning-200 text-left font-normal">
                    Estás editando el color base (<strong className="font-bold">tono 500</strong>) de la escala. El resto de los tonos debe <strong className="font-bold">terminar de editarse en la escala</strong>, por lo que se recomienda crear o generar la escala a partir de este.
                  </p>
                )}

                {editingColor && ["Government Primary", "Government Secondary", "Government Info"].includes(editingColor.name) && (
                  <p className="text-sm text-warning-900 dark:text-warning-200 font-medium mt-1 text-left">
                    Al cambiar este color gubernamental, también estás modificando el color base de la escala semántica <strong className="font-bold">{editingColor.name === "Government Primary" ? "Primary" : editingColor.name === "Government Secondary" ? "Secondary" : "Info"}</strong>, lo que afectará las variables y componentes de desarrollo.
                  </p>
                )}

                {editingColor && editingColor.scaleId && editingColor.level === "500" && (
                  <p className="text-sm text-warning-900 dark:text-warning-200 font-medium mt-1 text-left">
                    Al editar el tono 500, estás modificando el color principal de toda la escala <strong className="font-bold">{editingColor.scaleId}</strong>
                    {["Primary", "Secondary", "Info"].includes(editingColor.scaleId) && ` y su color gubernamental asociado, lo que impactará directamente en las variables de desarrollo y el diseño general.`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="w-full pt-4">
            <div className="grid grid-cols-2 w-full gap-3">
              <Button variant="outline" className="w-full" onClick={() => setEditingColor(null)}>
                Cancelar
              </Button>
              <Button
                variant="warning"
                className="w-full whitespace-nowrap"
                disabled={isApplyingColor}
                onClick={async () => {
                  if (!editingColor?.newHex) { setEditingColor(null); return; }

                  const updates: Record<string, string> = {};
                  if (editingColor.scaleId) {
                    if (editingColor.level === "500" || !editingColor.level) {
                      updates[editingColor.scaleId] = editingColor.newHex;
                      if (editingColor.scaleId === "Primary") updates["Government Primary"] = editingColor.newHex;
                      if (editingColor.scaleId === "Secondary") updates["Government Secondary"] = editingColor.newHex;
                      if (editingColor.scaleId === "Info") updates["Government Info"] = editingColor.newHex;
                    } else {
                      updates[`${editingColor.scaleId}-${editingColor.level}`] = editingColor.newHex;
                    }
                  } else {
                    updates[editingColor.name] = editingColor.newHex;
                    if (editingColor.name === "Government Primary") updates["Primary"] = editingColor.newHex;
                    if (editingColor.name === "Government Secondary") updates["Secondary"] = editingColor.newHex;
                    if (editingColor.name === "Government Info") updates["Info"] = editingColor.newHex;
                  }

                  setIsApplyingColor(true);
                  try {
                    const res = await fetch("/api/kit-colors", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ updates }),
                    });
                    if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `HTTP ${res.status}`);

                    setSimulatedColors(prev => ({ ...prev, ...updates }));
                    toast.success("Color actualizado", { description: "Se guardó en el bucket de borrador del kit." });
                  } catch (err) {
                    toast.error("No se pudo guardar el color", {
                      description: err instanceof Error ? err.message : "Error desconocido.",
                    });
                  } finally {
                    setIsApplyingColor(false);
                    setEditingColor(null);
                  }
                }}
              >
                {isApplyingColor ? (<><Spinner size="sm" className="mr-2" />Guardando...</>) : "Confirmar cambio"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Typography Family Edit Dialog */}
      <Dialog open={!!editingFontFamily && !showConfirmFont} onOpenChange={(open) => !open && setEditingFontFamily(null)}>
        <DialogContent
          variant="info"
          className="sm:max-w-xl"
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('[data-slot="combobox-content"]')) {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('[data-slot="combobox-content"]')) {
              e.preventDefault();
            }
          }}
          onFocusOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('[data-slot="combobox-content"]')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-info">Cambiar tipografía</DialogTitle>
            <DialogDescription>
              Selecciona la nueva familia tipográfica que utilizará esta escala.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-6">

            {/* Combobox container */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-foreground">Tipografía actual</span>
                <Badge appearance="outline" tone="neutral" size="md" className="capitalize">{editingFontFamily?.currentFont}</Badge>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm font-semibold text-foreground text-left px-1">Nueva tipografía</span>
                <div className="w-full">
                  <Combobox
                    value={editingFontFamily?.newFont || ""}
                    onValueChange={(val) => {
                      if (val) setEditingFontFamily(prev => prev ? { ...prev, newFont: val as string } : null);
                    }}
                  >
                    <ComboboxInput placeholder="Buscar o seleccionar tipografía..." />
                    <ComboboxContent>
                      <ComboboxList>
                        {['Barlow', 'Montserrat', 'Roboto', 'Inter', 'Open Sans', 'Poppins', 'Lato', 'Oswald'].map(font => (
                          <ComboboxItem
                            key={font}
                            value={font}
                            className={cn("flex items-center justify-between", editingFontFamily?.newFont === font && "bg-primary/5 text-primary font-bold")}
                          >
                            <span style={{ fontFamily: font }}>{font}</span>
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <div className="p-4 bg-info/10 border border-info/30 rounded-xl flex items-center gap-3 mt-1">
                  <svg className="size-5 text-info shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-info-900 dark:text-info-200 flex-1 text-left">
                    Selecciona únicamente la familia tipográfica. La escala de tamaños, pesos y alturas de línea se conservará.
                  </p>
                </div>
              </div>
            </div>

            {/* Vista previa */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-foreground">Vista previa</span>
              <div className="grid grid-cols-2 gap-4">
                {/* Left: Actual */}
                <div className="p-4 rounded-xl border border-border bg-surface flex flex-col gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Actual</span>
                  <span className="font-medium">{editingFontFamily?.currentFont}</span>
                  <div className="text-4xl" style={{ fontFamily: editingFontFamily?.currentFont }}>Aa</div>
                  <div className="text-lg font-bold" style={{ fontFamily: editingFontFamily?.currentFont }}>Título de ejemplo</div>
                  <div className="text-sm" style={{ fontFamily: editingFontFamily?.currentFont }}>Texto de ejemplo</div>
                </div>

                {/* Right: Nueva */}
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
                  <span className="text-xs font-bold text-primary uppercase">Nueva</span>
                  <span className="font-medium text-primary">{editingFontFamily?.newFont}</span>
                  <div className="text-4xl text-primary" style={{ fontFamily: editingFontFamily?.newFont }}>Aa</div>
                  <div className="text-lg font-bold text-primary" style={{ fontFamily: editingFontFamily?.newFont }}>Título de ejemplo</div>
                  <div className="text-sm text-primary" style={{ fontFamily: editingFontFamily?.newFont }}>Texto de ejemplo</div>
                </div>
              </div>
            </div>

          </div>

          <DialogFooter className="w-full pt-4">
            <div className="grid grid-cols-2 w-full gap-3">
              <Button variant="outline" className="w-full" onClick={() => setEditingFontFamily(null)}>
                Cancelar
              </Button>
              <Button
                variant="info"
                className="w-full whitespace-nowrap"
                onClick={() => setShowConfirmFont(true)}
                disabled={!editingFontFamily?.newFont || editingFontFamily.newFont === editingFontFamily.currentFont}
              >
                Aplicar tipografía
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Font Dialog */}
      <Dialog open={showConfirmFont} onOpenChange={setShowConfirmFont}>
        <DialogContent variant="warning" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-warning">¿Cambiar esta tipografía?</DialogTitle>
            <DialogDescription>
              La nueva familia se aplicará a todos los estilos asociados a esta escala tipográfica. Los tamaños, pesos y alturas de línea se conservarán.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full pt-4 mt-2">
            <div className="flex flex-col w-full gap-3">
              <Button
                variant="warning"
                className="w-full"
                disabled={isApplyingFont}
                onClick={async () => {
                  if (!editingFontFamily?.newFont) return;
                  setIsApplyingFont(true);
                  try {
                    const res = await fetch("/api/kit-fonts", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ role: editingFontFamily.id, family: editingFontFamily.newFont }),
                    });
                    if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `HTTP ${res.status}`);

                    setSimulatedFonts(prev => ({ ...prev, [editingFontFamily.id]: editingFontFamily.newFont! }));
                    toast.success("Tipografía actualizada", { description: "Se descargó la fuente y se guardó en el bucket de borrador del kit." });
                    setEditingFontFamily(null);
                    setShowConfirmFont(false);
                  } catch (err) {
                    toast.error("No se pudo aplicar la tipografía", {
                      description: err instanceof Error ? err.message : "Error desconocido.",
                    });
                  } finally {
                    setIsApplyingFont(false);
                  }
                }}
              >
                {isApplyingFont ? (<><Spinner size="sm" className="mr-2" />Aplicando...</>) : "Confirmar cambio"}
              </Button>
              <Button variant="outline" className="w-full" disabled={isApplyingFont} onClick={() => setShowConfirmFont(false)}>
                Cancelar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
