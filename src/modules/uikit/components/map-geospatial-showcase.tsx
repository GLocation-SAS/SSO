"use client";
import { SubSection } from "./sub-section";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Globe, MapPin, Layers, Sliders, Info, Search, ZoomIn, Compass, Map } from "lucide-react";
import {
  MapContainer, MapControlGroup, MapControlButton, MapSearch, LayersPanel, LayerItem,
  LayerLegend, BasemapSelector, MapPopup, ScaleIndicator, CoordinatesDisplay
} from "@/components/ui/map-geospatial";




export function MapGeospatialShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  const [activeMap, setActiveMap] = React.useState("google-calle");
  const [layer1, setLayer1] = React.useState(true);
  const [layer2, setLayer2] = React.useState(true);
  const [opacity1, setOpacity1] = React.useState(100);

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
        {/* 1. MAP CONTAINER INTERACTIVO */}
        <SubSection icon={Map} id="map-container" title="Visor de Mapa y Contenedor" description="Visor geográfico principal con controles flotantes, barra de búsqueda y regla de escala." registerSection={registerSection}>
          <MapContainer />
        </SubSection>

        {/* 2. LAYERS PANEL, BASEMAP SELECTOR & LEGEND */}
        <SubSection icon={Layers} id="layers-panel" title="Panel de Capas, Mapas Base y Leyenda" description="Gestor de capas geográficas con opacidad, mapa base y simbología." registerSection={registerSection}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <LayersPanel>
              <LayerItem
                id="1"
                name="Instituciones Educativas (AMIE)"
                category="Infraestructura"
                visible={layer1}
                opacity={opacity1}
                colorToken="bg-primary"
                onToggleVisibility={setLayer1}
                onOpacityChange={setOpacity1}
              />
              <LayerItem
                id="2"
                name="Áreas de Riesgo Volcánico"
                category="Gestión de Riesgos"
                visible={layer2}
                colorToken="bg-danger"
                onToggleVisibility={setLayer2}
              />
            </LayersPanel>

            <div className="space-y-4">
              <BasemapSelector activeMap={activeMap} onSelectMap={setActiveMap} />

              <p className="text-xs font-bold text-foreground pt-2">Simbología Activa</p>
              <LayerLegend
                title="Simbología Infraestructura"
                items={[
                  { label: "Colegio Público", color: "bg-primary" },
                  { label: "Colegio Fisco-misional", color: "bg-info" },
                  { label: "Zona Inundable 2km", color: "bg-warning" },
                  { label: "Riesgo Sísmico", color: "bg-danger" },
                ]}
              />
            </div>
          </div>
        </SubSection>

        {/* 3. MAP POPUP & CONTROLS */}
        <SubSection icon={MapPin} id="map-popup" title="Popup de Mapa e Indicadores" description="Popup emergente al seleccionar elementos sobre el mapa e indicadores de coordenadas." registerSection={registerSection}>
          <div className="flex flex-wrap items-center gap-6">
            <MapPopup
              title="Unidad Educativa Manuela Cañizares"
              subtitle="Quito • Código AMIE: 17H00012"
              category="Institución Educativa"
            />

            <div className="space-y-3">
              <p className="text-xs font-bold text-foreground">Indicadores y Coordenadas WGS84</p>
              <CoordinatesDisplay lat="-0.1807" lng="-78.4678" />
              <ScaleIndicator scale="1:25,000" distance="250 m" />
            </div>
          </div>
        </SubSection>
    </div>
  );
}
