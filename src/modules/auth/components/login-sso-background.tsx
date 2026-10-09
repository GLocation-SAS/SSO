import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAssetPath } from "@/lib/assets";
import type { BackgroundImagesConfig } from "../types/auth-config";

export interface LoginSSOBackgroundProps {
  className?: string;
  images?: BackgroundImagesConfig;
}

export function LoginSSOBackground({ className, images }: LoginSSOBackgroundProps) {
  const mobileLight = images?.mobileLight || "/fondo-mobile.png";
  const mobileDark = images?.mobileDark || "/fondo-mobile-dark.png";
  const desktopLight = images?.desktopLight || "/fondo-desktop.png";
  const desktopDark = images?.desktopDark || "/fondo-desktop-dark.png";

  return (
    <div className={cn("absolute inset-0 z-0 h-full w-full overflow-hidden", className)}>
      {/* Fondo móvil claro */}
      <Image
        src={getAssetPath(mobileLight)}
        alt="Fondo móvil Conecta MINEDUC Claro"
        fill
        className="block dark:hidden md:!hidden object-cover object-center"
        priority
        unoptimized
      />
      {/* Fondo móvil oscuro */}
      <Image
        src={getAssetPath(mobileDark)}
        alt="Fondo móvil Conecta MINEDUC Oscuro"
        fill
        className="hidden dark:block md:!hidden object-cover object-center"
        priority
        unoptimized
      />
      {/* Fondo escritorio claro */}
      <Image
        src={getAssetPath(desktopLight)}
        alt="Persona trabajando en contexto administrativo en MINEDUC Claro"
        fill
        className="hidden md:block dark:!hidden object-cover object-bottom"
        priority
        unoptimized
      />
      {/* Fondo escritorio oscuro */}
      <Image
        src={getAssetPath(desktopDark)}
        alt="Persona trabajando en contexto administrativo en MINEDUC Oscuro"
        fill
        className="hidden dark:md:block object-cover object-bottom"
        priority
        unoptimized
      />
    </div>
  );
}

