"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ShieldAlert, Loader2 } from "lucide-react";

const ADMIN_PREFIXES = [
  "/dashboard",
  "/gestion-usuarios",
  "/gestion",
  "/aplicaciones",
  "/roles",
  "/recursos",
  "/auditoria",
];

export function PortalRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoaded, isStandardUser, isDocente } = useAuth();
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded || !profile) return;

    const cleanPath = pathname.replace(/^\/(?:es|en)(?=\/|$)/i, "");

    // 1. Control de acceso estricto a Notas (/inicio): requiere sesión verificada en Notas
    if (cleanPath === "/inicio" || cleanPath.startsWith("/inicio/")) {
      if (!profile?.hasNotasSession) {
        router.replace("/login-notas");
        return;
      }
    }

    // 2. Control de acceso a módulos administrativos para usuarios sin permisos de administración
    if (isStandardUser || isDocente) {
      const isAdminRoute = ADMIN_PREFIXES.some(
        (prefix) => cleanPath === prefix || cleanPath.startsWith(prefix + "/")
      );

      if (isAdminRoute) {
        setIsUnauthorized(true);
        toast.error("Acceso restringido", {
          description: "No tienes permisos para módulos administrativos. Redirigiendo...",
        });
        const timer = setTimeout(() => {
          router.replace(profile?.hasNotasSession ? "/inicio" : "/mis-aplicaciones");
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setIsUnauthorized(false);
      }
    } else {
      setIsUnauthorized(false);
    }
  }, [pathname, isLoaded, isStandardUser, isDocente, profile, router]);

  if (isUnauthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4">
        <div className="size-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
          <ShieldAlert className="size-7" />
        </div>
        <div className="max-w-md space-y-1">
          <h2 className="text-h3 font-heading font-bold text-foreground">Acceso no autorizado</h2>
          <p className="text-body-sm text-muted-foreground">
            {isDocente
              ? "El perfil docente no tiene acceso a los módulos administrativos del sistema central."
              : "El perfil de usuario estándar no tiene acceso a los módulos administrativos de Conecta MINEDUC."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Redirigiendo a {isDocente ? "Inicio" : "Mi dashboard"}...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
