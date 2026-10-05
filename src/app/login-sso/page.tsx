import { LoginSSOView } from "@/modules/auth/views/login-sso-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conecta MINEDUC | Iniciar sesiÃ³n",
  description: "AdministraciÃ³n centralizada de accesos y permisos a las aplicaciones y recursos institucionales del MINEDUC.",
};

export default function LoginSSOPage() {
  return <LoginSSOView />;
}
