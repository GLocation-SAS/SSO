"use client";

import React from "react";
import { SubSection } from "./sub-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeoportalHeader } from "@/components/layout/geoportal-header";
import { Footer } from "@/components/layout/footer";
import { Search } from "@/components/ui/search";
import { Globe, Search as SearchIcon, Building2, FileText, HelpCircle, ChevronDown, Filter, Download, MapPin, CheckCircle2, ExternalLink, Footprints, Building, Info } from "lucide-react";




export function PublicMicrositeShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
        {/* 1. PUBLIC HEADER */}
        <SubSection icon={Globe} id="public-header" title="Encabezado público (Public Header)" description="Navegación pública unificada e institucional reutilizando el header del Geoportal." registerSection={registerSection}>
          <div className="border border-border rounded-2xl overflow-visible shadow-sm relative transform-gpu translate-z-0">
            {/* Contenedor amplio para visualizar los dropdowns del header sin cortes */}
            <div className="relative min-h-[360px] bg-background rounded-2xl overflow-visible">
              <GeoportalHeader variant="navigation" />
            </div>
          </div>
        </SubSection>


        {/* 3. PUBLIC SEARCH & PUBLIC FILTERS */}
        <SubSection icon={SearchIcon} id="public-search" title="Public Search & Filters" description="Buscador inteligente con filtros temáticos para la ciudadanía." registerSection={registerSection}>
          <div className="p-5 rounded-2xl border border-border bg-surface space-y-4">
            <div className="relative w-full max-w-2xl">
              <Search
                placeholder="Buscar instituciones educativas, políticas o mapas..."
                className="w-full bg-background"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-foreground">Filtros:</span>
              <Badge variant="neutral" appearance="soft" className="cursor-pointer hover:bg-primary/10">Zona 3</Badge>
              <Badge variant="neutral" appearance="soft" className="cursor-pointer hover:bg-primary/10">Educación Pública</Badge>
              <Badge variant="neutral" appearance="soft" className="cursor-pointer hover:bg-primary/10">Planes 2026</Badge>
            </div>
          </div>
        </SubSection>

        {/* 4. INSTITUTION CARD */}
        <SubSection icon={Building} id="institution-card" title="Tarjeta de institución (Institution Card)" description="Tarjeta pública de información de establecimientos educativos." registerSection={registerSection}>
          <div className="p-5 rounded-2xl border border-border bg-surface space-y-3 text-left max-w-md shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">AMIE: 17H00012</span>
                <h4 className="text-sm font-bold text-foreground">Unidad Educativa Manuela Cañizares</h4>
              </div>
              <Badge variant="success" appearance="soft">Pública</Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" /> Quito, Pichincha • Zona 3
            </p>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-semibold">1,250 Estudiantes</span>
              <Button variant="outline" size="sm">Ver Ficha Pública</Button>
            </div>
          </div>
        </SubSection>

        {/* 5. DOCUMENT & PUBLICATION CARD */}
        <SubSection icon={FileText} id="document-card" title="Document Card & Publication Card" description="Tarjetas públicas para descarga de normativas, guías e informes oficiales." registerSection={registerSection}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border bg-surface flex items-start gap-3 text-left">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                <FileText className="size-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h5 className="text-xs font-bold text-foreground truncate">Guía_Gestión_Riesgos_Escolares_2026.pdf</h5>
                <p className="text-[10px] text-muted-foreground">Documento Oficial • 2.4 MB</p>
                <div className="pt-2">
                  <Button variant="primary" size="sm" className="gap-2">
                    <Download className="size-4" />
                    Descargar PDF
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-surface flex items-start gap-3 text-left">
              <div className="size-10 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0 mt-1">
                <Globe className="size-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h5 className="text-xs font-bold text-foreground truncate">Informe Anual de Cobertura Territorial</h5>
                <p className="text-[10px] text-muted-foreground">Publicado por MINEDEC • Feb 2026</p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="size-4" />
                    Leer Artículo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SubSection>

        {/* 6. FAQ ACCORDION */}
        <SubSection icon={HelpCircle} id="faq-accordion" title="Acordeón de preguntas frecuentes (FAQ Accordion)" description="Acordeón interactivo de preguntas frecuentes para la ciudadanía." registerSection={registerSection}>
          <div className="space-y-2 max-w-xl text-left">
            {[
              { id: 0, q: "¿Cómo puedo consultar si mi escuela está en zona de riesgo?", a: "Puedes usar el buscador público de la sección principal ingresando el código AMIE o la ubicación de tu cantón." },
              { id: 1, q: "¿Dónde descargo los conjuntos de datos abiertos?", a: "En la pestaña 'Recursos' selecciona 'Datos Abiertos' para descargar información en formato CSV, XLSX y GeoJSON." }
            ].map((faq) => (
              <div key={faq.id} className="rounded-xl border border-border bg-surface overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full p-3.5 text-xs font-bold text-foreground flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform ${activeFaq === faq.id ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === faq.id && (
                  <div className="p-3.5 pt-0 text-xs text-muted-foreground border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SubSection>

        {/* 7. PUBLIC FOOTER */}
        <SubSection icon={Footprints} id="public-footer" title="Pie de página público (Public Footer)" description="Pie de página público adaptado al lenguaje institucional del Ministerio de Educación." registerSection={registerSection}>
          <div className="border border-border rounded-2xl overflow-hidden bg-background">
            <Footer />
          </div>
        </SubSection>
    </div>
  );
}
