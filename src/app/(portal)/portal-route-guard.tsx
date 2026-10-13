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
  const { user, isLoaded, isStandardUser, isDocente } = useAuth();
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isStandardUser || isDocente) {
      const cleanPath = pathname.replace(/^\/(?:es|en)(?=\/|$)/i, "");
      const isAdminRoute = ADMIN_PREFIXES.some(
        (prefix) => cleanPath === prefix || cleanPath.startsWith(prefix + "/")
      );

      if (isAdminRoute) {
        setIsUnauthorized(true);
        toast.error("Acceso restringido", {
          description: isDocente
            ? "El perfil docente no tiene permisos para módulos administrativos. Redirigiendo a Inicio..."
            : "La cuenta actual (usuario estándar) no tiene permisos para módulos administrativos. Redirigiendo a tu espacio personal...",
        });
        const timer = setTimeout(() => {
          router.replace(isDocente ? "/inicio" : "/mi-dashboard");
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setIsUnauthorized(false);
      }
    } else {
      setIsUnauthorized(false);
    }
  }, [pathname, isLoaded, isStandardUser, isDocente, router]);

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
