import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAssetPath } from "@/lib/assets";
import type { BackgroundImagesConfig } from "../types/auth-config";

export interface LoginSSOBackgroundProps {
  className?: string;
  images?: BackgroundImagesConfig;
  desktopPosition?: string;
  mobilePosition?: string;
}

export function LoginSSOBackground({
  className,
  images,
  desktopPosition,
  mobilePosition,
}: LoginSSOBackgroundProps) {
  const mobileLight = images?.mobileLight || "/fondo-mobile.png";
  const mobileDark = images?.mobileDark || images?.mobileLight || "/fondo-mobile.png";
  const desktopLight = images?.desktopLight || "/fondo-desktop.png";
  const desktopDark = images?.desktopDark || images?.desktopLight || "/fondo-desktop.png";

  const resolvedDesktopPosition = desktopPosition || images?.desktopPosition || "object-left-top";
  const resolvedMobilePosition = mobilePosition || images?.mobilePosition || "object-top";

  return (
    <div className={cn("absolute inset-0 z-0 h-full w-full overflow-hidden", className)}>
      {/* Fondo móvil claro */}
      <Image
        src={getAssetPath(mobileLight)}
        alt="Fondo móvil Conecta MINEDUC Claro"
        fill
        className={cn(
          "block dark:hidden md:!hidden object-cover",
          resolvedMobilePosition
        )}
        priority
        unoptimized
      />
      {/* Fondo móvil oscuro */}
      <Image
        src={getAssetPath(mobileDark)}
        alt="Fondo móvil Conecta MINEDUC Oscuro"
        fill
        className={cn(
          "hidden dark:block md:!hidden object-cover",
          resolvedMobilePosition
        )}
        priority
        unoptimized
      />
      {/* Fondo escritorio claro */}
      <Image
        src={getAssetPath(desktopLight)}
        alt="Persona trabajando en contexto administrativo en MINEDUC Claro"
        fill
        className={cn(
          "hidden md:block dark:!hidden object-cover",
          resolvedDesktopPosition,
          className
        )}
        priority
        unoptimized
      />
      {/* Fondo escritorio oscuro */}
      <Image
        src={getAssetPath(desktopDark)}
        alt="Persona trabajando en contexto administrativo en MINEDUC Oscuro"
        fill
        className={cn(
          "hidden dark:md:block object-cover",
          resolvedDesktopPosition,
          className
        )}
        priority
        unoptimized
      />
    </div>
  );
}

