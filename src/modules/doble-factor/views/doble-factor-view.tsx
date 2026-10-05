"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { LoginSSOBackground } from "@/modules/auth/components/login-sso-background";
import { VerificationCodeInput } from "../components/verification-code-input";

export function DobleFactorView() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isComplete = code.length === 6;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      toast.error("Por favor, completa el código de verificación de 6 dígitos.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    // Mock validation
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Código verificado correctamente.");
      router.push("/dashboard");
    }, 1500);
  };

  const handleBack = () => {
    router.push("/login-sso");
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center lg:justify-end p-4 lg:p-12 xl:p-24 overflow-hidden bg-background">
      <LoginSSOBackground />
      
      <div className="mr-0 lg:mr-12 xl:mr-24 w-full sm:max-w-lg relative z-10 min-h-[550px] sm:min-h-[650px] flex flex-col justify-center rounded-xl border border-border bg-card p-6 sm:p-10 shadow-lg text-card-foreground">
        <div className="mb-6 flex items-center justify-between">
          <Image
            src="/horizontal-light.svg"
            alt="Logo Conecta MINEDUC"
            width={180}
            height={45}
            className="dark:hidden"
            unoptimized
          />
          <Image
            src="/horizontal-dark.svg"
            alt="Logo Conecta MINEDUC"
            width={180}
            height={45}
            className="hidden dark:block"
            unoptimized
          />
          <ThemeToggle />
        </div>

        <Separator className="mb-6" />

        <div className="mb-8 text-left">
          <h1 className="sr-only font-heading text-h2 font-bold">Conecta MINEDUC</h1>
          <h2 className="font-heading text-h2 font-semibold mb-2 text-primary-500 dark:text-primary-300">
            Verificación en dos pasos
          </h2>
          <p className="font-sans text-body-sm text-muted-foreground text-balance">
            Ingresa el código de verificación para continuar con el acceso a Conecta.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6" noValidate>
          <div className="space-y-4">
            <VerificationCodeInput
              value={code}
              onChange={(val) => {
                setCode(val);
                if (errorMsg) setErrorMsg(null);
              }}
              disabled={isLoading}
              error={!!errorMsg}
            />
            {errorMsg && (
              <p className="text-body-sm text-danger font-sans font-medium">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Verificar y continuar"}
            </Button>
            
            <Button
              type="button"
              variant="neutral"
              className="w-full"
              onClick={handleBack}
              disabled={isLoading}
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
