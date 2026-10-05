import Image from "next/image";
import { cn } from "@/lib/utils";

export function LoginSSOBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 z-0 h-full w-full overflow-hidden", className)}>
      {/* Fondo móvil claro */}
      <Image
        src="/fondo-mobile.png"
        alt="Fondo móvil Conecta MINEDUC Claro"
        fill
        className="block dark:hidden md:!hidden object-cover object-center"
        priority
        unoptimized
      />
      {/* Fondo móvil oscuro */}
      <Image
        src="/fondo-mobile-dark.png"
        alt="Fondo móvil Conecta MINEDUC Oscuro"
        fill
        className="hidden dark:block md:!hidden object-cover object-center"
        priority
        unoptimized
      />
      {/* Fondo escritorio claro */}
      <Image
        src="/fondo-desktop.png"
        alt="Persona trabajando en contexto administrativo en MINEDUC Claro"
        fill
        className="hidden md:block dark:!hidden object-cover object-bottom"
        priority
        unoptimized
      />
      {/* Fondo escritorio oscuro */}
      <Image
        src="/fondo-desktop-dark.png"
        alt="Persona trabajando en contexto administrativo en MINEDUC Oscuro"
        fill
        className="hidden dark:md:block object-cover object-bottom"
        priority
        unoptimized
      />
    </div>
  );
}
