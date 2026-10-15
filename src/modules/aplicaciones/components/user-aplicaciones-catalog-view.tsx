"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import {
  AplicacionItem,
  CatalogoAppItem,
  mockAplicacionesData,
} from "../data/aplicaciones-data";
import {
  AplicacionesSummaryCards,
  AppSummaryFilterType,
} from "./aplicaciones-summary-cards";
import { AplicacionesFilterBar } from "./aplicaciones-filter-bar";
import { AplicacionesTable } from "./aplicaciones-table";

export interface UserAplicacionesCatalogViewProps {
  onNavigate?: (url: string) => void;
}

export function UserAplicacionesCatalogView({
  onNavigate = (url) => window.location.replace(url),
}: UserAplicacionesCatalogViewProps = {}) {
  const { profile, logout } = useAuth();
  const [redirectingAppKey, setRedirectingAppKey] = React.useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedEstado, setSelectedEstado] = React.useState("Todos");
  const [filterAtencion, setFilterAtencion] = React.useState(false);

  // Mapear aplicaciones asignadas del perfil cruzadas con metadata institucional
  const catalogoApps: CatalogoAppItem[] = React.useMemo(() => {
    const rawAssigned = profile?.assignedApplications || [];

    if (rawAssigned.length === 0) {
      // Fallback a catálogo institucional mock completo
      return mockAplicacionesData.map((meta, index) => ({
        id: `${meta.id}-${index}`,
        codigo: meta.codigo,
        nombre: meta.nombre,
        descripcion: meta.descripcion,
        urlAcceso: meta.urlAcceso || "/login-notas",
        estado: (meta.estado as "Activa" | "Inactiva") || "Activa",
        sedeId: "sede-pc",
        sedeNombre: "Planta Central",
        rolNombre: "Usuario Asignado",
        icono: meta.icono || "Layers",
      }));
    }

    return rawAssigned.map((assigned, index) => {
      const targetId = (assigned.aplicacionId || "").toLowerCase();
      const targetCode = (assigned.aplicacionCodigo || "").toLowerCase();
      const targetName = (assigned.aplicacionNombre || "").toLowerCase();

      // Buscar coincidencia en la base institucional
      const meta = mockAplicacionesData.find(
        (m) =>
          m.id.toLowerCase() === targetId ||
          m.codigo.toLowerCase() === targetCode ||
          m.nombre.toLowerCase() === targetName
      );

      return {
        id: `${assigned.aplicacionId}-${assigned.sedeId || index}`,
        codigo: assigned.aplicacionCodigo || meta?.codigo || "APP",
        nombre: assigned.aplicacionNombre || meta?.nombre || "Sistema Institucional",
        descripcion:
          meta?.descripcion ||
          "Módulo educativo institucional asignado según tu perfil y sede.",
        urlAcceso: meta?.urlAcceso || "/login-notas",
        estado: (meta?.estado as "Activa" | "Inactiva") || "Activa",
        sedeId: assigned.sedeId,
        sedeNombre: assigned.sedeNombre || "Sede Central",
        rolNombre: assigned.rolNombre || "Usuario",
        icono: meta?.icono || "Layers",
      };
    });
  }, [profile?.assignedApplications]);

  // Métricas
  const totalCount = catalogoApps.length;
  const activasCount = React.useMemo(
    () => catalogoApps.filter((a) => a.estado === "Activa").length,
    [catalogoApps]
  );
  const inactivasCount = React.useMemo(
    () => catalogoApps.filter((a) => a.estado === "Inactiva").length,
    [catalogoApps]
  );

  const activeSummaryFilter = React.useMemo<AppSummaryFilterType | null>(() => {
    if (selectedEstado === "Activa") return "activas";
    if (selectedEstado === "Inactiva") return "inactivas";
    if (selectedEstado === "Todos") return "total";
    return null;
  }, [selectedEstado]);

  const handleSelectSummaryFilter = (filter: AppSummaryFilterType) => {
    if (filter === "total") {
      setSelectedEstado("Todos");
    } else if (filter === "activas") {
      setSelectedEstado((prev) => (prev === "Activa" ? "Todos" : "Activa"));
    } else if (filter === "inactivas") {
      setSelectedEstado((prev) => (prev === "Inactiva" ? "Todos" : "Inactiva"));
    }
  };

  // Filtrado de lista
  const filteredApps = React.useMemo(() => {
    return catalogoApps.filter((app) => {
      const matchSearch =
        searchTerm === "" ||
        app.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.sedeNombre && app.sedeNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.rolNombre && app.rolNombre.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchEstado =
        selectedEstado === "Todos" || app.estado === selectedEstado;

      return matchSearch && matchEstado;
    });
  }, [catalogoApps, searchTerm, selectedEstado]);

  // Handler de lanzamiento de aplicación
  const handleLaunchApp = async (app: CatalogoAppItem) => {
    setRedirectingAppKey(app.id);
    try {
      // Cerrar la sesión de SSO en Firebase Auth para que no recuerde el token en Notas
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión de SSO al ingresar a la aplicación:", err);
    } finally {
      onNavigate(app.urlAcceso || "/login-notas");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Main Applications Container */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6">
          {/* Cabecera Institucional */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-white">
                Mis aplicaciones
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Accede a las aplicaciones y sistemas institucionales que tienes asignados según tu rol y sede.
              </p>
            </div>
          </div>

          {/* Cards resumen operativo */}
          <AplicacionesSummaryCards
            total={totalCount}
            activas={activasCount}
            inactivas={inactivasCount}
            atencion={0}
            activeFilter={activeSummaryFilter}
            onSelectFilter={handleSelectSummaryFilter}
          />

          {/* Separador */}
          <Separator />

          {/* Barra de Filtros */}
          <AplicacionesFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedEstado={selectedEstado}
            onEstadoChange={(est) => setSelectedEstado(est)}
            filterAtencion={filterAtencion}
            onFilterAtencionChange={setFilterAtencion}
          />

          {/* Tabla en Modo Catálogo */}
          <AplicacionesTable
            aplicaciones={filteredApps}
            mode="catalog"
            onLaunchApp={handleLaunchApp}
            redirectingAppId={redirectingAppKey}
          />
        </div>
      </div>
    </div>
  );
}
