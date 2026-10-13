import { LoginSSOBackground } from "@/modules/auth/components/login-sso-background";
import { DobleFactorNotasForm } from "../components/doble-factor-notas-form";
import type { BackgroundImagesConfig } from "@/modules/auth/types/auth-config";

export interface LoginNotasVerificarCodigoViewProps {
  backgroundImages?: BackgroundImagesConfig;
  redirectTo?: string;
}

export function LoginNotasVerificarCodigoView({
  backgroundImages,
  redirectTo,
}: LoginNotasVerificarCodigoViewProps = {}) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center lg:justify-end p-4 lg:p-12 xl:p-24 overflow-hidden bg-background">
      <LoginSSOBackground images={backgroundImages} />
      <DobleFactorNotasForm
        className="mr-0 lg:mr-12 xl:mr-24 w-full sm:max-w-lg"
        redirectTo={redirectTo}
      />
    </main>
  );
}
