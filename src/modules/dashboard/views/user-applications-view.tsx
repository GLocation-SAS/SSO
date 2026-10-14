"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDecorativeIcon,
  CardBadge,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppWindow, ArrowRight, Network, Sparkles, Building2, Shield } from "lucide-react";
import { Link } from "@/routing";
import { useAuth } from "@/hooks/useAuth";

export interface UserApplicationsViewProps {
  onNavigate?: (url: string) => void;
}

export function UserApplicationsView({
  onNavigate = (url) => window.location.replace(url),
}: UserApplicationsViewProps = {}) {
  const { user, profile, logout } = useAuth();
  const [redirectingAppKey, setRedirectingAppKey] = React.useState<string | null>(null);

  const handleLaunchApp = async (appKey: string) => {
    setRedirectingAppKey(appKey);
    try {
      // Cerrar la sesión de SSO en Firebase Auth para que no recuerde el token en Notas
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión de SSO al ingresar a la aplicación:", err);
    } finally {
      onNavigate("/login-notas");
    }
  };

  const userName =
    profile?.usuario?.nombre && profile?.usuario?.apellidos
      ? `${profile.usuario.nombre} ${profile.usuario.apellidos}`
      : user?.displayName || user?.email?.split("@")[0] || "Usuario";

  // Extraer aplicaciones asignadas reales desde el perfil verificado por el servidor
  const assignedApps = profile?.assignedApplications || [];

  return (
    <div className="flex flex-col gap-6 w-full pb-4">
      {/* 0. Card destacada de bienvenida */}
      <Card
        variant="primary"
        className="relative overflow-hidden border-primary/40 dark:!border-border dark:!bg-surface shadow-xs transition-colors"
        innerClassName="justify-center py-6 md:py-7 px-6 md:px-8"
      >
        <div className="flex flex-col justify-center gap-2 w-full z-10 my-auto">
          <CardBadge className="bg-white/15 !text-white border border-white/20 dark:bg-muted/50 dark:!text-muted-foreground dark:border-border backdrop-blur-xs w-fit text-xs font-semibold px-3 py-1 transition-colors">
            Hola, {userName} 👋
          </CardBadge>
          <CardTitle className="text-2xl md:text-3xl font-heading font-bold !text-white dark:!text-white tracking-tight h-auto transition-colors">
            Bienvenido a Conecta MINEDUC
          </CardTitle>
          <CardDescription className="text-sm md:text-base !text-white/90 dark:!text-muted-foreground font-normal transition-colors">
            Accede a las aplicaciones y sistemas institucionales que tienes asignados según tu rol y sede.
          </CardDescription>
        </div>

        <CardDecorativeIcon className="opacity-15 dark:opacity-35 !text-white dark:!text-primary-300 right-4 -bottom-8 pointer-events-none z-0 transition-colors">
          <Network className="size-48 md:size-56 stroke-[1.2]" />
        </CardDecorativeIcon>
      </Card>

      {/* Contenedor de Mis aplicaciones */}
      <div className="bg-surface border border-border shadow-xs rounded-xl p-4 md:p-6 flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary dark:text-primary-300">
              Mis aplicaciones
            </h1>
            <Badge tone="primary" size="sm" className="font-semibold">
              {assignedApps.length} disponibles
            </Badge>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Selecciona una aplicación asignada para iniciar sesión en su respectivo módulo.
          </p>
        </div>

        {assignedApps.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl flex flex-col items-center gap-3">
            <AppWindow className="size-12 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-foreground">
              No tienes aplicaciones asignadas
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Actualmente no cuentas con sedes o aplicaciones activas registradas. Por favor, contacta con tu administrador zonal o soporte técnico.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedApps.map((app, index) => (
              <Card
                key={`${app.aplicacionId}-${app.sedeId}-${index}`}
                variant="panel"
                className="flex flex-col justify-between hover:border-primary/40 hover:shadow-sm transition-all duration-200"
              >
                <CardHeader className="gap-3 p-6 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                      <AppWindow className="size-6" />
                    </div>
                    <Badge variant="success" size="sm" className="font-semibold shrink-0">
                      Activa
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-bold text-foreground leading-snug">
                      {app.aplicacionNombre || "Sistema Institucional"}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Módulo educativo institucional
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-6 py-2 flex flex-col gap-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 shrink-0 text-primary/70" />
                    <span className="truncate">
                      <strong>Sede:</strong> {app.sedeNombre || "Sede Central"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 shrink-0 text-info/70" />
                    <span className="truncate">
                      <strong>Rol:</strong> {app.rolNombre || "Usuario"}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-4 border-t border-border/40 mt-3">
                  <Button
                    variant="primary"
                    size="default"
                    className="w-full justify-center font-bold gap-2 shadow-xs"
                    disabled={redirectingAppKey !== null}
                    onClick={() => handleLaunchApp(`${app.aplicacionId}-${index}`)}
                  >
                    {redirectingAppKey === `${app.aplicacionId}-${index}`
                      ? "Iniciando acceso..."
                      : "Ingresar a la aplicación"}
                    <ArrowRight className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
