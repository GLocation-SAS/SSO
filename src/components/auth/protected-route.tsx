"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchCurrentAuthProfile } from "@/modules/gestion-usuarios/services/client-usuarios";
import { toast } from "sonner";

const ADMIN_ROUTE_PREFIXES = [
  "/gestion-usuarios",
  "/gestion",
  "/aplicaciones",
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
            const currentProfile =
              profile || (await refreshProfile()) || (await fetchCurrentAuthProfile());
            if (!isMounted) return;

            if (currentProfile?.usuario && currentProfile.usuario.active === false) {
              toast.error("Acceso denegado", {
                description: "Tu usuario está inactivo. Contacta con el administrador.",
              });
              await logout();
              router.replace("/login-sso");
              return;
            }

            // Validar si la ruta requiere permisos administrativos
            const isAdminRoute = ADMIN_ROUTE_PREFIXES.some(
              (prefix) => pathname === prefix || pathname?.startsWith(prefix + "/")
            );

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
            if (errMsg.includes("verificación en dos pasos") || errMsg.includes("MFA_REQUIRED")) {
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
            router.replace("/login-sso");
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
