"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  RotateCcw,
  AlertTriangle,
  Building2,
  AppWindow,
  LayoutGrid,
  List,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import {
  MIS_APLICACIONES_USUARIO,
  MisAplicacionItem,
  RecursoAsignado,
} from "../data/mis-aplicaciones-data";
import { mockAplicacionesData } from "@/modules/aplicaciones/data/aplicaciones-data";
import { MisAplicacionesCard } from "../components/mis-aplicaciones-card";
import {
  MisAplicacionesSummaryCards,
  MisAppSummaryFilterType,
} from "../components/mis-aplicaciones-summary-cards";
import { MisAplicacionesTable } from "../components/mis-aplicaciones-table";
import { RecursosDialog } from "../components/recursos-dialog";
import { useAuth } from "@/hooks/useAuth";

export function MisAplicacionesView() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  // Mapear aplicaciones reales autorizadas para el usuario desde Firestore/perfil
  const resolvedUserApps = useMemo<MisAplicacionItem[]>(() => {
    const sedes = profile?.usuario?.sedes;
    if (Array.isArray(sedes) && sedes.length > 0) {
      const items: MisAplicacionItem[] = [];
      const seen = new Set<string>();

      for (const sede of sedes) {
        if (!Array.isArray(sede?.asignaciones)) continue;
        for (const asig of sede.asignaciones) {
          const isActivo = asig.estado === "Activo" || (asig as any).activo === true;
          if (!isActivo) continue;

          const asigAppName = (asig.aplicacionNombre || "").trim();
          const asigAppCode = ((asig as any).aplicacionCodigo || (asig as any).codigo || "").trim();
          const asigAppId = (asig.rolAplicacionId || asig.id || "").toLowerCase();

          const key = `${asigAppName.toLowerCase()}-${sede.sedeId}`;
          if (seen.has(key)) continue;
          seen.add(key);

          // Buscar metadatos institucionales complementarios (ícono, descripción, url de acceso)
          const meta = mockAplicacionesData.find(
            (m) =>
              m.id.toLowerCase() === asigAppId ||
              m.codigo.toLowerCase() === asigAppCode.toLowerCase() ||
              m.nombre.toLowerCase() === asigAppName.toLowerCase() ||
              asigAppName.toLowerCase().includes(m.nombre.toLowerCase())
          );

          // Mapear recursos y permisos reales asignados
          const recursos: RecursoAsignado[] = (asig.permisos || []).map((p, idx) => ({
            id: `rec-${idx}-${p.recursoCodigo}`,
            codigo: p.recursoCodigo,
            nombre: p.recursoNombre,
            tipo: "Módulo",
            permisos: {
              codigo: p.recursoCodigo,
              nombre: p.recursoNombre,
              ver: Boolean(p.puedeVer),
              crear: Boolean(p.puedeCrear),
              editar: Boolean(p.puedeEditar),
              eliminar: Boolean(p.puedeEliminar),
            },
          }));

          const rawIcon = meta?.icono || "School";
          const icono = (["GraduationCap", "School", "Users", "Headphones", "FileText", "Shield"].includes(rawIcon)
            ? rawIcon
            : "School") as MisAplicacionItem["icono"];

          const isNotas =
            asigAppName.toLowerCase().includes("notas") ||
            asigAppCode.toLowerCase().includes("notas") ||
            asigAppId.includes("notas");
          const resolvedUrl = isNotas ? "/login-notas" : meta?.urlAcceso || "/mis-aplicaciones";

          items.push({
            id: asig.id || `app-${items.length + 1}`,
            codigo: asigAppCode || meta?.codigo || "APP",
            nombre: asigAppName || meta?.nombre || "Sistema Institucional",
            descripcion:
              meta?.descripcion ||
              `Sistema institucional para la gestión y seguimiento en ${sede.sedeNombre || "MINEDUC"}.`,
            urlAcceso: resolvedUrl,
            icono,
            colorTone: "primary",
            sede: {
              id: sede.sedeId,
              codigo: (sede as any).codigo || sede.sedeId,
              nombre: sede.sedeNombre || "Sede Institucional",
              tipo: (sede as any).tipo || "Coordinación Zonal",
            },
            rol: {
              id: asig.rolAplicacionId || asig.id,
              nombre: asig.rolNombre || "Usuario",
              descripcion: `Rol asignado: ${asig.rolNombre || "Usuario"}`,
            },
            ultimoAcceso: "Hoy, activo",
            estado: asig.estado === "Inactivo" ? "Mantenimiento" : "Activa",
            recursos,
            categoria: "Sistemas Institucionales",
          });
        }
      }

      if (items.length > 0) return items;
    }

    if (Array.isArray(profile?.assignedApplications) && profile.assignedApplications.length > 0) {
      return profile.assignedApplications.map((assigned, idx) => {
        const meta = mockAplicacionesData.find(
          (m) =>
            m.id.toLowerCase() === assigned.aplicacionId.toLowerCase() ||
            m.codigo.toLowerCase() === (assigned.aplicacionCodigo || "").toLowerCase() ||
            m.nombre.toLowerCase() === assigned.aplicacionNombre.toLowerCase()
        );

        const isNotas =
          (assigned.aplicacionNombre || "").toLowerCase().includes("notas") ||
          (assigned.aplicacionCodigo || "").toLowerCase().includes("notas") ||
          (assigned.aplicacionId || "").toLowerCase().includes("notas");
        const resolvedUrl = isNotas ? "/login-notas" : meta?.urlAcceso || "/mis-aplicaciones";

        return {
          id: `${assigned.aplicacionId}-${idx}`,
          codigo: assigned.aplicacionCodigo || meta?.codigo || "APP",
          nombre: assigned.aplicacionNombre || meta?.nombre || "Sistema Institucional",
          descripcion:
            meta?.descripcion ||
            `Acceso institucional asignado para la sede ${assigned.sedeNombre}.`,
          urlAcceso: resolvedUrl,
          icono: "School",
          colorTone: "primary",
          sede: {
            id: assigned.sedeId,
            codigo: assigned.sedeId,
            nombre: assigned.sedeNombre,
            tipo: "Coordinación Zonal",
          },
          rol: {
            id: `rol-${idx}`,
            nombre: assigned.rolNombre || "Usuario",
            descripcion: `Rol asignado: ${assigned.rolNombre || "Usuario"}`,
          },
          ultimoAcceso: "Hoy, activo",
          estado: "Activa",
          recursos: [],
          categoria: "Sistemas Institucionales",
        };
      });
    }

    // Fallback únicamente si no existe sesión autenticada (desarrollo estático aislado)
    if (!profile && !user) {
      return MIS_APLICACIONES_USUARIO;
    }

    return [];
  }, [profile, user]);

  const [apps, setApps] = useState<MisAplicacionItem[]>([]);

  useEffect(() => {
    if (resolvedUserApps.length > 0 || (profile && !authLoading)) {
      setApps(resolvedUserApps);
    }
  }, [resolvedUserApps, profile, authLoading]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSede, setSelectedSede] = useState<string>("todas");
  const [selectedRol, setSelectedRol] = useState<string>("todos");
  const [activeSummaryFilter, setActiveSummaryFilter] = useState<MisAppSummaryFilterType | null>("total");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Simulated states for testing
  const [isLoading, setIsLoading] = useState(false);
  const isDataLoading = (authLoading && !profile) || isLoading;
  const [hasError, setHasError] = useState(false);

  // Modal de recursos
  const [selectedAppForRecursos, setSelectedAppForRecursos] = useState<MisAplicacionItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Métricas para summary cards
  const totalCount = apps.length;
  const activasCount = useMemo(
    () => apps.filter((a) => a.estado === "Activa").length,
    [apps]
  );
  const sedesCount = useMemo(
    () => new Set(apps.map((a) => a.sede.nombre)).size,
    [apps]
  );
  const rolesCount = useMemo(
    () => new Set(apps.map((a) => a.rol.nombre)).size,
    [apps]
  );

  // Sedes disponibles para el filtro
  const sedesOptions = useMemo(() => {
    const list = Array.from(new Set(apps.map((a) => a.sede.nombre)));
    return ["todas", ...list];
  }, [apps]);

  // Roles disponibles para el filtro
  const rolesOptions = useMemo(() => {
    const list = Array.from(new Set(apps.map((a) => a.rol.nombre)));
    return ["todos", ...list];
  }, [apps]);

  // Manejo de filtro interactivo desde las Cards de resumen
  const handleSelectSummaryFilter = (filter: MisAppSummaryFilterType) => {
    if (activeSummaryFilter === filter && filter !== "total") {
      setActiveSummaryFilter("total");
    } else {
      setActiveSummaryFilter(filter);
    }
  };

  // Filtrado reactivo con búsqueda, sede, rol y card activa
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        app.nombre.toLowerCase().includes(query) ||
        app.descripcion.toLowerCase().includes(query) ||
        app.codigo.toLowerCase().includes(query) ||
        app.rol.nombre.toLowerCase().includes(query) ||
        app.sede.nombre.toLowerCase().includes(query);

      const matchesSede = selectedSede === "todas" || app.sede.nombre === selectedSede;
      const matchesRol = selectedRol === "todos" || app.rol.nombre === selectedRol;

      let matchesSummary = true;
      if (activeSummaryFilter === "activas") {
        matchesSummary = app.estado === "Activa";
      }

      return matchesSearch && matchesSede && matchesRol && matchesSummary;
    });
  }, [apps, searchQuery, selectedSede, selectedRol, activeSummaryFilter]);

  const handleOpenApp = (app: MisAplicacionItem) => {
    // Actualizar último acceso de la app en estado
    const now = new Date();
    const formatted = `Hoy a las ${now.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;

    setApps((prev) =>
      prev.map((item) =>
        item.id === app.id ? { ...item, ultimoAcceso: formatted } : item
      )
    );

    toast.info("Iniciando sesión única SSO...", {
      description: `Redirigiendo a ${app.nombre}${user?.email ? ` con credenciales de ${user.email}` : ""}...`,
    });

    if (app.urlAcceso.startsWith("/")) {
      router.push(app.urlAcceso);
    } else {
      window.open(app.urlAcceso, "_blank", "noopener,noreferrer");
    }
  };

  const handleViewRecursos = (app: MisAplicacionItem) => {
    setSelectedAppForRecursos(app);
    setDialogOpen(true);
  };

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Catálogo de aplicaciones sincronizado");
    }, 900);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSede("todas");
    setSelectedRol("todos");
    setActiveSummaryFilter("total");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedSede !== "todas" ||
    selectedRol !== "todos" ||
    activeSummaryFilter !== "total";

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Contenedor Principal Unificado con Bordes y Padding idéntico a /aplicaciones */}
        <div className="border border-border rounded-xl bg-surface p-4 sm:p-6 shadow-sm flex flex-col gap-6">
          {/* ── 1. Cabecera Institucional ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                  Mis aplicaciones
                </h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Accede de forma directa a las aplicaciones institucionales asignadas a tu cuenta de usuario con autenticación centralizada.
              </p>
            </div>

            {/* Acciones del encabezado: Selector de vista y sincronización */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
              {/* Conmutador de vista: Tarjetas vs Tabla */}
              <div className="inline-flex items-center p-1 rounded-lg border border-border bg-muted/40">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Vista en tarjetas"
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                    viewMode === "table"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Vista en tabla"
                >
                  <List className="size-3.5" />
                  <span className="hidden sm:inline">Tabla</span>
                </button>
              </div>

              {/* Botón sincronizar */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulateLoading}
                disabled={isLoading}
                leftIcon={
                  <RotateCw
                    className={cn("size-3.5", isLoading && "animate-spin text-primary")}
                  />
                }
                className="text-xs h-9"
              >
                Sincronizar
              </Button>
            </div>
          </div>

          {/* ── 2. Cards Resumen Operativo (InteractiveCard) ── */}
          <MisAplicacionesSummaryCards
            total={totalCount}
            activas={activasCount}
            sedesCount={sedesCount}
            rolesCount={rolesCount}
            activeFilter={activeSummaryFilter}
            onSelectFilter={handleSelectSummaryFilter}
          />

          {/* ── 3. Separador Estructural ── */}
          <Separator />

          {/* ── 4. Barra de Filtros y Búsqueda (Combobox UI Kit) ── */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
            {/* Combobox de Búsqueda de aplicación */}
            <div className="flex-1 min-w-[260px] max-w-md">
              <Combobox
                value={searchQuery}
                onValueChange={(val) => {
                  if (val !== null) setSearchQuery(val);
                }}
              >
                <ComboboxInput
                  placeholder="Buscar o seleccionar aplicación..."
                  showClear={true}
                  size="sm"
                  className="w-full text-xs"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ComboboxContent className="min-w-[max-content]">
                  <ComboboxList>
                    {apps.map((app) => (
                      <ComboboxItem
                        key={app.id}
                        value={app.nombre}
                        className="whitespace-nowrap pr-6"
                      >
                        {app.nombre}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Dropdowns de Filtro con Combobox */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filtro por Sede */}
              <div className="w-full sm:w-[210px] shrink-0">
                <Combobox
                  value={selectedSede === "todas" ? "Todas las sedes" : selectedSede}
                  onValueChange={(val) => {
                    if (val === "Todas las sedes" || !val) {
                      setSelectedSede("todas");
                    } else {
                      setSelectedSede(val);
                    }
                  }}
                >
                  <ComboboxInput
                    placeholder="Todas las sedes"
                    showClear={false}
                    showSearchIcon={false}
                    size="sm"
                    className="w-full text-xs"
                  />
                  <ComboboxContent className="min-w-[max-content]">
                    <ComboboxList>
                      <ComboboxItem value="Todas las sedes" className="whitespace-nowrap pr-6">
                        Todas las sedes
                      </ComboboxItem>
                      {sedesOptions
                        .filter((s) => s !== "todas")
                        .map((sede) => (
                          <ComboboxItem key={sede} value={sede} className="whitespace-nowrap pr-6">
                            {sede}
                          </ComboboxItem>
                        ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Filtro por Rol */}
              <div className="w-full sm:w-[220px] shrink-0">
                <Combobox
                  value={selectedRol === "todos" ? "Todos los roles" : selectedRol}
                  onValueChange={(val) => {
                    if (val === "Todos los roles" || !val) {
                      setSelectedRol("todos");
                    } else {
                      setSelectedRol(val);
                    }
                  }}
                >
                  <ComboboxInput
                    placeholder="Todos los roles"
                    showClear={false}
                    showSearchIcon={false}
                    size="sm"
                    className="w-full text-xs"
                  />
                  <ComboboxContent className="min-w-[max-content]">
                    <ComboboxList>
                      <ComboboxItem value="Todos los roles" className="whitespace-nowrap pr-6">
                        Todos los roles
                      </ComboboxItem>
                      {rolesOptions
                        .filter((r) => r !== "todos")
                        .map((rol) => (
                          <ComboboxItem key={rol} value={rol} className="whitespace-nowrap pr-6">
                            {rol}
                          </ComboboxItem>
                        ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground h-9"
                  leftIcon={<RotateCcw className="size-3.5" />}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* ── 6. Estado: CARGA (Loading Skeleton) ── */}
          {isDataLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-border bg-card space-y-4 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="size-11 rounded-xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <Skeleton className="h-3.5 w-full rounded" />
                    <Skeleton className="h-3.5 w-2/3 rounded" />
                  </div>
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* ── 7. Estado: ERROR ── */}
          {!isDataLoading && hasError && (
            <div className="p-8 rounded-2xl border border-danger/30 bg-danger/5 text-center space-y-4 max-w-xl mx-auto my-6">
              <div className="size-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mx-auto">
                <AlertTriangle className="size-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Error al consultar tus aplicaciones asignadas
                </h3>
                <p className="text-body-sm text-muted-foreground">
                  No fue posible obtener el listado de aplicaciones desde el servicio institucional SSO.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={() => setHasError(false)}
                leftIcon={<RotateCcw className="size-4" />}
              >
                Reintentar consulta
              </Button>
            </div>
          )}

          {/* ── 8. Estado: VACÍO (Empty) ── */}
          {!isDataLoading && !hasError && filteredApps.length === 0 && (
            <div className="p-12 rounded-2xl border border-dashed border-border bg-card text-center space-y-4 max-w-md mx-auto my-6">
              <div className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground mx-auto">
                <AppWindow className="size-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  No se encontraron aplicaciones
                </h3>
                <p className="text-body-sm text-muted-foreground">
                  No tienes aplicaciones asignadas para este filtro o perfil.
                </p>
              </div>
              <Button
                type="button"
                variant="neutral"
                onClick={handleClearFilters}
                leftIcon={<RotateCcw className="size-4" />}
              >
                Restablecer filtros
              </Button>
            </div>
          )}

          {/* ── 9. Estado: CARGADO ── */}
          {!isDataLoading && !hasError && filteredApps.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <div className="flex flex-col gap-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 w-full">
                    {filteredApps.map((app) => (
                      <MisAplicacionesCard
                        key={app.id}
                        app={app}
                        onOpenApp={handleOpenApp}
                        onViewRecursos={handleViewRecursos}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                    <span className="font-medium">
                      Mostrando {filteredApps.length} de {apps.length} aplicaciones autorizadas
                    </span>
                  </div>
                </div>
              ) : (
                <MisAplicacionesTable
                  apps={filteredApps}
                  onOpenApp={handleOpenApp}
                  onViewRecursos={handleViewRecursos}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Modal de Detalle de Recursos y Transparencia ── */}
      <RecursosDialog
        app={selectedAppForRecursos}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onOpenApp={handleOpenApp}
      />
    </div>
  );
}
