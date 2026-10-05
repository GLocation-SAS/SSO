"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent, ClipboardEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function DobleFactorForm({ className }: { className?: string }) {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    // Permitir solo números
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    
    // Si escribió un caracter
    if (value.length > 0) {
      newCode[index] = value.slice(-1); // tomar solo el último caracter
      setCode(newCode);
      // Foco al siguiente input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Si borró
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        // Si está vacío y presiona borrar, ir al anterior
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i];
    }
    setCode(newCode);
    
    // Foco al último input modificado o al final
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeComplete) {
      toast.warning("Código incompleto", {
        description: "Por favor, ingresa los 6 dígitos del código enviado a tu correo.",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Verificación exitosa", {
        description: "Has ingresado correctamente. Redirigiendo...",
      });
      // Aquí iría la redirección al dashboard
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div
      className={cn(
        "relative z-10 w-full max-w-lg min-h-[550px] sm:min-h-[650px] flex flex-col justify-center rounded-xl border border-border bg-card/85 backdrop-blur-xl lg:bg-card lg:backdrop-blur-none p-6 sm:p-10 shadow-lg text-card-foreground",
        className
      )}
    >
      <div className="flex flex-col h-full justify-between gap-6">
        {/* Cabecera y Marca */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/horizontal-light.svg"
              alt="Logo Gobierno de Ecuador Claro"
              width={140}
              height={45}
              className="dark:hidden"
              unoptimized
            />
            <Image
              src="/horizontal-dark.svg"
              alt="Logo Gobierno de Ecuador Oscuro"
              width={140}
              height={45}
              className="hidden dark:block"
              unoptimized
            />
          </div>
          <ThemeToggle />
        </div>

        <Separator className="bg-border/60" />

        {/* Textos Informativos */}
        <div className="mb-4 text-center sm:text-left">
          <button 
            type="button"
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary dark:hover:text-secondary-300 transition-colors"
            onClick={() => router.push('/login-sso')}
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </button>
          <h2 className="font-heading text-h2 font-semibold mb-2 text-primary-500 dark:text-primary-300">
            Verificación de seguridad
          </h2>
          <p className="font-sans text-body-sm text-muted-foreground text-balance">
            Ingresa el código de 6 dígitos que hemos enviado a tu correo institucional para confirmar tu identidad.
          </p>
        </div>

        {/* Formulario OTP */}
        <form onSubmit={verifyCode} className="space-y-8" noValidate>
          <div className="flex justify-between gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={cn(
                  "w-12 h-14 sm:w-14 sm:h-16 flex-1 rounded-md border text-center font-heading text-h3 font-bold outline-none transition-all duration-300",
                  // Variación suave de fondo neutral cuando está lleno
                  digit !== "" 
                    ? "bg-neutral-300 border-neutral-300 text-neutral-500 scale-105 dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-500" 
                    : "bg-surface border-input text-neutral-500 focus:border-neutral-300 focus:ring-2 focus:ring-ring"
                )}
              />
            ))}
          </div>

          <div
            className="w-full"
            onClick={(e) => {
              if (!isCodeComplete) {
                e.preventDefault();
                toast.warning("Código incompleto", {
                  description: "Por favor, ingresa los 6 dígitos del código enviado a tu correo.",
                });
              }
            }}
          >
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!isCodeComplete || isLoading}
            >
              {isLoading ? "Verificando..." : "Verificar código"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-2">
          <p className="text-body-sm text-muted-foreground">
            ¿No recibiste el código?{" "}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => toast.success("Nuevo código enviado a tu correo.")}
            >
              Reenviar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
