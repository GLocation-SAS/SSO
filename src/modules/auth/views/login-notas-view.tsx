import { LoginSSOBackground } from "../components/login-sso-background";
import { LoginSSOForm } from "../components/login-sso-form";
import type { LoginAuthConfig } from "../types/auth-config";

export interface LoginNotasViewProps {
  config?: Partial<LoginAuthConfig>;
}

export function LoginNotasView({ config }: LoginNotasViewProps) {
  const defaultTitle = "Conecta MINEDUC - Sistema de Notas";
  const defaultSubtitle = "Acceso a Notas";
  const defaultDescription =
    "Ingreso exclusivo para la consulta y registro de calificaciones, evaluaciones y gestión académica del sistema de Notas.";

  return (
    <main className="relative flex min-h-screen lg:h-screen w-full items-center justify-center lg:justify-end p-4 lg:px-10 lg:py-6 xl:px-20 xl:py-8 overflow-hidden bg-background">
      <LoginSSOBackground images={config?.backgroundImages} />
      <LoginSSOForm
        title={config?.title || defaultTitle}
        subtitle={config?.subtitle || defaultSubtitle}
        description={config?.description || defaultDescription}
        targetApp={config?.targetApp || "notas"}
        redirectTo={config?.redirectTo || "/dashboard?app=notas"}
        className={config?.className || "mr-0 lg:mr-4 xl:mr-12 w-full sm:max-w-md lg:max-w-[480px] max-h-[calc(100vh-2rem)] overflow-y-auto"}
      />
    </main>
  );
}
