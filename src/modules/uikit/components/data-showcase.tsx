"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Layers, BarChart3,
  MapPin, Shield, Bell, Globe,
  Hash, Clock, Navigation, GraduationCap, AlertTriangle, Map, CheckCircle2, Info, XCircle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapacityCard } from "@/components/ui/capacity-card";

import {
  BaseCard,
  InteractiveCard,
  KpiCard,
  InstitutionCard,
  LayerCard,
  DocumentCard,
  ReportCard,
  DataChip,
  AddChip,
  MetadataList,
  StatusIndicator,
} from "@/components/ui/data-display";

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ id, registerSection, number, title, description, children }: {
  id: string;
  registerSection?: (id: string, el: HTMLElement | null) => void;
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      ref={(el) => {
        if (id) registerSection?.(id, el);
      }}
      className="w-full bg-surface border border-border/50 rounded-[2rem] p-8 md:p-10 flex flex-col shadow-sm scroll-mt-24"
    >
      <div className="flex flex-col gap-2 mb-8">
        <h3 className="text-h3 font-heading font-bold text-foreground flex items-center gap-3">{title}</h3>
        {description && <div className="text-sm text-muted-foreground leading-relaxed">{description}</div>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}

// ─── Showcase ────────────────────────────────────────────────────────────────

export function DataShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">

        {/* ── 1. Base Card ── */}
        <Section id="base-card" registerSection={registerSection} number={1} title="Tarjeta Base" description="Contenedor básico para agrupar información relacionada.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BaseCard
              title="Plugin QGIS MINEDEC"
              description="Desarrollado por MINEDEC Tech"
              centered
              cover={
                <div className="h-32 bg-gradient-to-r from-primary/70 via-primary-600 to-primary flex items-center justify-center">
                  <div className="flex items-center gap-4 text-white">
                    <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"><Globe className="size-6" /></div>
                    <span className="text-white/60">•••</span>
                    <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"><Layers className="size-6" /></div>
                  </div>
                </div>
              }
              action={<Button variant="primary" className="w-full rounded-full">Descargar Plugin</Button>}
            >
              <div className="bg-surface border border-border rounded-xl p-4 mt-2 text-left space-y-4">
                <div>
                  <div className="flex justify-between items-center"><h4 className="text-sm font-bold">MINEDEC GeoTeam</h4><span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-semibold">SIG / Integraciones</span></div>
                  <p className="text-xs text-muted-foreground">Conector SIG Desktop</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Acerca de</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Este complemento conecta de manera directa el GEOportal con tu sesión de QGIS, permitiendo la carga y edición offline de límites administrativos y zonas de riesgo escolar en tiempo real.</p>
                </div>
              </div>
            </BaseCard>

            <BaseCard
              title="Título de la tarjeta"
              description="Descripción opcional que da contexto sobre el contenido de esta tarjeta básica."
              footer="Actualizado hace 2 min"
              action={<span className="text-primary text-xs font-semibold cursor-pointer">Ver más</span>}
            >
              <div className="h-32 w-full bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                Contenido principal
              </div>
            </BaseCard>
            
            <BaseCard
              title="Tarjeta Inactiva"
              description="Esta tarjeta no está disponible actualmente."
              footer="Sin datos"
              disabled
            >
              <p className="text-xs text-muted-foreground mt-4">La tarjeta deshabilitada reduce su opacidad y bloquea interacciones.</p>
            </BaseCard>
          </div>
        </Section>

        {/* ── 2. Interactive Card ── */}
        <Section id="interactive-card" registerSection={registerSection} number={2} title="Tarjeta Interactiva" description="Tarjeta completamente clicable con efecto hover y navegación.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InteractiveCard
              title="Institución Educativa San José"
              subtitle="Quito, Pichincha"
              description="12 bloques · 1.250 estudiantes"
              icon={<GraduationCap className="size-5" />}
              decorativeIcon={<Building2 className="size-full" />}
              color="primary"
            />
            <InteractiveCard
              title="Capa: Uso de Suelo"
              subtitle="Pichincha"
              description="Vectorial · Escala 1:25.000"
              icon={<Map className="size-5" />}
              decorativeIcon={<Globe className="size-full" />}
              color="success"
            />
            <InteractiveCard
              title="Alerta: Crecida de río"
              subtitle="Esmeraldas"
              description="Nivel crítico superado. Monitoreo activo."
              icon={<Bell className="size-5" />}
              decorativeIcon={<AlertTriangle className="size-full" />}
              color="warning"
            />
            <InteractiveCard
              title="Reporte Amenazas Julio 2026"
              subtitle="Nacional"
              description="PDF · Generado 31/07/2026"
              icon={<BarChart3 className="size-5" />}
              disabled
            />
          </div>
        </Section>

        {/* ── 2.5. Capacity Card ── */}
        <Section id="capacity-card" registerSection={registerSection} number={12} title="Tarjeta de Capacidad" description="Tarjetas con borde animado y glow integrado.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CapacityCard 
                title="Visor territorial"
                description="Explora instituciones educativas, capas geográficas y áreas de influencia."
                icon={MapPin}
                color="primary"
            />
            <CapacityCard 
                title="Riesgos e indicadores"
                description="Consulta niveles de riesgo, alertas e indicadores del entorno educativo."
                icon={BarChart3}
                color="success"
            />
            <CapacityCard 
                title="Reportes y fichas"
                description="Analiza información territorial y genera fichas y reportes institucionales."
                icon={Globe}
                color="info"
            />
            <CapacityCard 
                title="Asistente IA"
                description="Consulta información del Geoportal utilizando lenguaje natural."
                icon={Zap}
                color="warning"
            />
          </div>
        </Section>

        {/* ── 3. KPI Card ── */}
        <Section id="kpi-card" registerSection={registerSection} number={3} title="Tarjeta KPI" description="Indicador clave con valor, tendencia y variación. Soporta modo estándar y modo narrativo.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              label="Asistente IA" 
              prefixText="Desde el mes pasado, el registro de amenazas ha" 
              highlightedText="crecido un 18%" 
              actionLabel="Ver detalles ✧"
              icon={<Globe className="size-5" />} 
              menuActions={<span className="text-xl leading-none cursor-pointer pb-2 hover:text-foreground">...</span>}
              className="lg:col-span-2"
            />
            <KpiCard label="Total instituciones" value="2,458" trend="up" change="+12.5%" comparison="vs. mes anterior" updatedAt="Hoy 08:30" icon={<Building2 className="size-4" />} />
            <KpiCard label="Riesgo alto" value="128" trend="down" change="-8.3%" comparison="vs. mes anterior" updatedAt="Hoy 08:30" icon={<Shield className="size-4" />} />
            <KpiCard label="Capas GIS" value="347" trend="neutral" change="0%" comparison="Sin variación" updatedAt="Ayer" icon={<Layers className="size-4" />} />
            <KpiCard label="Alertas activas" value="14" trend="warning" change="+4" comparison="vs. semana anterior" updatedAt="Hace 1 hora" icon={<Bell className="size-4" />} />
          </div>
        </Section>

        {/* ── 4. Institution Card ── */}
        <Section id="institution-card" registerSection={registerSection} number={4} title="Tarjeta de Institución" description="Resumen de información de una institución educativa.">
          <div className="space-y-6 max-w-4xl">
            <InstitutionCard 
              name="U.E. María Auxiliadora" 
              amie="17H000123" 
              location="Cuenca, Azuay" 
              status="active" 
              blocks={8} 
              students={980} 
              teachers={45} 
              classrooms={25}
              imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=450&q=80"
              updatedAt="10/05/2026 - 08:45"
              infoStatus="Actualizada"
              onViewProfile={() => {}} 
              onCopyAmie={() => {}}
            />
            <InstitutionCard 
              name="Escuela Fiscal Juan Montalvo" 
              amie="17H000456" 
              location="Quito, Pichincha" 
              status="review" 
              blocks={5} 
              students={420} 
              teachers={15} 
              classrooms={12}
              imageUrl="https://images.unsplash.com/photo-1577896851231-70ee18881754?w=450&q=80"
              updatedAt="08/08/2026 - 11:30"
              infoStatus="En proceso"
              onViewProfile={() => {}} 
              onCopyAmie={() => {}}
            />
          </div>
        </Section>

        {/* ── 5. Layer Card ── */}
        <Section id="layer-card" registerSection={registerSection} number={5} title="Tarjeta de Capa" description="Información y acciones de una capa geoespacial.">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LayerCard name="Cobertura de Uso de Suelo" category="Territorio" dataType="Vectorial" scale="1:25.000" updatedAt="10/05/2026" status="published" onViewMap={() => {}} onMetadata={() => {}} onDownload={() => {}} onCopyLink={() => {}} />
            <LayerCard name="Red Vial Estatal" category="Transporte" dataType="Vectorial" scale="1:50.000" updatedAt="08/08/2026" status="draft" onViewMap={() => {}} onMetadata={() => {}} onDownload={() => {}} onCopyLink={() => {}} />
            <LayerCard name="Zonas de Riesgo Volcánico" category="Amenazas" dataType="Raster" scale="1:100.000" updatedAt="01/01/2026" status="archived" onViewMap={() => {}} onMetadata={() => {}} onDownload={() => {}} onCopyLink={() => {}} />
          </div>
        </Section>

        {/* ── 6. Document Card ── */}
        <Section id="document-card" registerSection={registerSection} number={6} title="Tarjeta de Documento" description="Documento con tipo detectado automáticamente, metadata y acciones.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DocumentCard filename="Guia_gestion_riesgos.pdf" sizeLabel="2.4 MB" uploadedAt="10/05/2026" onPreview={() => {}} onDownload={() => {}} onShare={() => {}} />
            <DocumentCard filename="instituciones_educativas.xlsx" sizeLabel="5.7 MB" uploadedAt="08/08/2026" onPreview={() => {}} onDownload={() => {}} onShare={() => {}} />
            <DocumentCard filename="amenazas_pichincha.geojson" sizeLabel="12.1 MB" uploadedAt="01/08/2026" onPreview={() => {}} onDownload={() => {}} onShare={() => {}} />
          </div>
        </Section>

        {/* ── 7. Report Card ── */}
        <Section id="report-card" registerSection={registerSection} number={7} title="Tarjeta de Reporte" description="Reporte disponible para consulta o descarga con formatos.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard title="Reporte mensual de riesgos" period="Mayo 2026" territory="Pichincha" generatedAt="31/05/2026" status="generated" formats={["PDF", "XLSX", "CSV"]} onView={() => {}} onDownload={() => {}} />
            <ReportCard title="Reporte de amenazas" period="Julio 2026" territory="Nacional" generatedAt="08/08/2026" status="processing" formats={["PDF"]} onView={() => {}} onDownload={() => {}} />
            <ReportCard title="Reporte anual de instituciones" period="2025" territory="Nacional" generatedAt="01/01/2026" status="generated" formats={["PDF", "XLSX"]} onView={() => {}} onDownload={() => {}} />
          </div>
        </Section>

        {/* ── 8. Badge ── */}
        <Section id="badge" registerSection={registerSection} number={8} title="Etiqueta (Badge)" description="Indicadores visuales compactos para estados, categorías y etiquetas con soporte para variantes semánticas y estilos de contorno.">
          <div className="space-y-12 w-full">
            {/* Filled */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Relleno</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Badge tone="primary" appearance="solid">Primary</Badge>
                <Badge tone="secondary" appearance="solid">Secondary</Badge>
                <Badge tone="success" appearance="solid">Success</Badge>
                <Badge tone="warning" appearance="solid">Warning</Badge>
                <Badge tone="danger" appearance="solid">Error / Danger</Badge>
                <Badge tone="info" appearance="solid">Info</Badge>
                <Badge tone="neutral" appearance="solid">Neutral</Badge>
              </div>
            </div>

            {/* Outline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contorno</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Badge tone="primary" appearance="outline">Primary</Badge>
                <Badge tone="secondary" appearance="outline">Secondary</Badge>
                <Badge tone="success" appearance="outline">Success</Badge>
                <Badge tone="warning" appearance="outline">Warning</Badge>
                <Badge tone="danger" appearance="outline">Error / Danger</Badge>
                <Badge tone="info" appearance="outline">Info</Badge>
                <Badge tone="neutral" appearance="outline">Neutral</Badge>
              </div>
            </div>

            {/* With icon */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Con icono</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Badge tone="success" icon={<CheckCircle2 className="size-3.5" />}>Activo</Badge>
                <Badge tone="info" icon={<Info className="size-3.5" />}>Información</Badge>
                <Badge tone="warning" icon={<AlertTriangle className="size-3.5" />}>Advertencia</Badge>
                <Badge tone="danger" icon={<XCircle className="size-3.5" />}>Error</Badge>
                <Badge tone="primary" icon={<CheckCircle2 className="size-3.5" />}>Completado</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tamaños</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Badge tone="primary" size="sm">Pequeño</Badge>
                <Badge tone="primary" size="md">Mediano</Badge>
                <Badge tone="primary" size="lg">Grande</Badge>
              </div>
            </div>

            <div className="border-t border-border/60 pt-8" />

            {/* Status examples */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status examples</h3>
                <p className="text-xs text-muted-foreground italic mt-1">Casos reales de aplicación en el Geoportal MINEDEC.</p>
              </div>
              <div className="flex flex-wrap gap-4 items-end">
                <Badge tone="success" appearance="soft" icon={<CheckCircle2 className="size-3.5" />}>Activo</Badge>
                <Badge tone="neutral" appearance="soft" icon={<XCircle className="size-3.5" />}>Inactivo</Badge>
                
                <Badge tone="danger" appearance="solid" icon={<AlertTriangle className="size-3.5" />}>Riesgo alto</Badge>
                <Badge tone="warning" appearance="solid" icon={<AlertTriangle className="size-3.5" />}>Riesgo medio</Badge>
                <Badge tone="info" appearance="solid" icon={<Info className="size-3.5" />}>Riesgo bajo</Badge>
                
                <Badge tone="warning" appearance="soft" icon={<Clock className="size-3.5" />}>Pendiente</Badge>
                <Badge tone="primary" appearance="outline" icon={<Clock className="size-3.5" />}>Procesando</Badge>
                <Badge tone="success" appearance="outline" icon={<CheckCircle2 className="size-3.5" />}>Completado</Badge>
                
                <Badge tone="secondary" appearance="soft" icon={<Globe className="size-3.5" />}>Público</Badge>
                <Badge tone="primary" appearance="solid" icon={<Building2 className="size-3.5" />}>Institucional</Badge>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 9. Chip ── */}
        <Section id="chip" registerSection={registerSection} number={9} title="Filtro (Chip)" description="Elemento interactivo para filtros, selección y etiquetas removibles.">
          <div className="p-6 border border-border rounded-xl bg-surface space-y-4">
            <div className="flex flex-wrap gap-2">
              <DataChip label="Pichincha" removable onRemove={() => {}} />
              <DataChip label="Azuay" removable onRemove={() => {}} />
              <DataChip label="Riesgo alto" removable selected icon={<Shield className="size-3" />} onRemove={() => {}} />
              <DataChip label="Inundación" removable onRemove={() => {}} />
              <DataChip label="Estado: Activa" removable onRemove={() => {}} />
              <AddChip />
            </div>
            <div className="flex flex-wrap gap-2">
              <DataChip label="Seleccionado" selected />
              <DataChip label="Default" />
              <DataChip label="Con icono" icon={<MapPin className="size-3" />} />
              <DataChip label="Deshabilitado" disabled />
            </div>
          </div>
        </Section>

        {/* ── 10. Metadata List ── */}
        <Section id="metadata-list" registerSection={registerSection} number={10} title="Lista de Metadatos" description="Lista organizada de atributos y valores con jerarquía clara.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Comfortable</p>
              <div className="p-5 border border-border rounded-xl bg-surface">
                <MetadataList
                  variant="comfortable"
                  items={[
                    { label: "Código AMIE", value: "17H000123", icon: <Hash className="size-3" /> },
                    { label: "Provincia",   value: "Pichincha",  icon: <MapPin className="size-3" /> },
                    { label: "Distrito",    value: "Quito Centro", icon: <Navigation className="size-3" /> },
                    { label: "Tipo",        value: "Fiscal", icon: <Building2 className="size-3" /> },
                    { label: "Zona",        value: "Urbana", icon: <Globe className="size-3" /> },
                    { label: "Actualizado", value: "10/08/2026", icon: <Clock className="size-3" /> },
                  ]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Compact</p>
              <div className="p-5 border border-border rounded-xl bg-surface">
                <MetadataList
                  variant="compact"
                  items={[
                    { label: "Código AMIE",     value: "17H000123" },
                    { label: "Provincia",        value: "Pichincha" },
                    { label: "Distrito",         value: "Quito Centro" },
                    { label: "Tipo institución", value: "Fiscal" },
                    { label: "Zona",             value: "Urbana" },
                    { label: "Área influencia",  value: "2 km" },
                    { label: "Actualizado",      value: "10/08/2026" },
                  ]}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* ── 11. Status Indicator ── */}
        <Section id="status-indicator" registerSection={registerSection} number={11} title="Indicador de Estado" description="Señal visual que comunica un estado actual mediante dot + texto.">
          <div className="p-6 border border-border rounded-xl bg-surface">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
              <StatusIndicator status="online"     description="Sistema operativo" />
              <StatusIndicator status="processing" description="Tarea en ejecución" />
              <StatusIndicator status="warning"    description="Requiere atención" />
              <StatusIndicator status="critical"   description="Intervención urgente" />
              <StatusIndicator status="offline"    description="Servicio no disponible" />
              <StatusIndicator status="inactive"   description="Sin actividad reciente" />
              <StatusIndicator status="completed"  description="Proceso finalizado" />
            </div>
          </div>
        </Section>

    </div>
  );
}
