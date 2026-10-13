import { Metadata } from "next";
import { LoginNotasVerificarCodigoView } from "@/modules/notas/views/login-notas-verificar-codigo-view";

export const metadata: Metadata = {
  title: "Conecta MINEDUC | Verificación de seguridad - Notas",
  description:
    "Verificación de dos pasos requerida para acceder al sistema de calificaciones y gestión académica de Notas.",
};

export default function LoginNotasVerificarCodigoPage() {
  return <LoginNotasVerificarCodigoView />;
}
