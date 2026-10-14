"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchCurrentAuthProfile } from "@/modules/gestion-usuarios/services/client-usuarios";
import { toast } from "sonner";

function normalizeRoutePath(p: string | null | undefined): string {
  if (!p) return "";
  let clean = p.split("?")[0].split("#")[0];
  clean = clean.replace(/^\/SSO(?=\/|$)/i, "");
  clean = clean.replace(/^\/(?:es|en)(?=\/|$)/i, "");
  clean = clean.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

const ADMIN_ROUTE_PREFIXES = [
  "/gestion-usuarios",
  "/gestion",
  "/auditoria",
];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout, refreshProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!loading) {
      if (!user) {
        setIsVerifying(false);
        router.replace("/login-sso");
      } else {
        const checkAccess = async () => {
          try {
            const normalizedPath = normalizeRoutePath(pathname);
            const isNotasContext =
              normalizedPath === "/inicio" || normalizedPath.startsWith("/inicio/");

            let currentProfile =
              profile || (await refreshProfile()) || (await fetchCurrentAuthProfile());

            if (isNotasContext && currentProfile && !currentProfile.hasNotasSession) {
              const fresh = await refreshProfile();
              if (fresh) currentProfile = fresh;
            }

            if (!isMounted) return;

            if (!currentProfile) {
              toast.error("Acceso denegado", {
                description: "No se pudo verificar el perfil del usuario.",
              });
              await logout();
              router.replace("/login-sso");
              return;
            }

            if (currentProfile?.usuario && currentProfile.usuario.active === false) {
              toast.error("Acceso denegado", {
                description: "Tu usuario está inactivo. Contacta con el administrador.",
              });
              await logout();
              router.replace("/login-sso");
              return;
            }

            // Validar si la ruta requiere permisos administrativos
            // Nota: /aplicaciones raíz es pública para usuarios autenticados; sus subrutas (/aplicaciones/*) son administrativas.
            const isAplicacionesAdminSubroute =
              normalizedPath !== "/aplicaciones" && normalizedPath.startsWith("/aplicaciones/");

            const isAdminRoute =
              ADMIN_ROUTE_PREFIXES.some(
                (prefix) => normalizedPath === prefix || normalizedPath.startsWith(prefix + "/")
              ) || isAplicacionesAdminSubroute;

            if (isAdminRoute && !currentProfile?.isAdmin) {
              toast.error("Acceso denegado", {
                description: "No tienes permisos administrativos para acceder a este módulo.",
              });
              router.replace("/dashboard");
              return;
            }

            setIsVerifying(false);
          } catch (err: any) {
            if (!isMounted) return;

            const errMsg = err?.message || "";
            const currentNormPath = normalizeRoutePath(pathname);
            const isNotasContext =
              currentNormPath === "/inicio" || currentNormPath.startsWith("/inicio/");

            if (
              errMsg.includes("NOTAS_MFA_REQUIRED") ||
              err?.code === "NOTAS_MFA_REQUIRED" ||
              (isNotasContext &&
                (errMsg.includes("verificación en dos pasos") ||
                  errMsg.includes("MFA_REQUIRED") ||
                  err?.code === "MFA_REQUIRED"))
            ) {
              toast.info("Verificación requerida", {
                description: "Por favor, completa la verificación de dos pasos de Notas.",
              });
              router.replace("/login-notas/verificar-codigo");
              return;
            }

            if (
              errMsg.includes("verificación en dos pasos") ||
              errMsg.includes("MFA_REQUIRED") ||
              err?.code === "MFA_REQUIRED"
            ) {
              toast.info("Verificación requerida", {
                description: "Por favor, completa la verificación de dos pasos.",
              });
              router.replace("/doble-factor");
              return;
            }

            toast.error("Acceso denegado", {
              description: errMsg || "Tu sesión ha expirado o no tienes acceso al sistema.",
            });
            await logout();
            router.replace(isNotasContext ? "/login-notas" : "/login-sso");
          }
        };

        checkAccess();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user, profile, loading, router, pathname, logout, refreshProfile]);

  if (loading || isVerifying) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full" />
          <p className="text-body-sm font-medium text-muted-foreground animate-pulse">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
