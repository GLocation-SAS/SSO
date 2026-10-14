import { LoginNotasView } from "@/modules/auth/views/login-notas-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conecta MINEDUC | Acceso a Notas",
  description:
    "Ingreso exclusivo para la consulta y registro de calificaciones, evaluaciones y gestión académica del sistema de Notas.",
};

export default function LoginNotasPage() {
  return <LoginNotasView />;
}
