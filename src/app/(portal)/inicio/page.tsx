import { Metadata } from "next";
import { InicioView } from "@/modules/inicio/views/inicio-view";

export const metadata: Metadata = {
  title: "Inicio | Notas MINEDUC",
  description: "Portal docente para registro y seguimiento de calificaciones de estudiantes - Conecta MINEDUC.",
};

export default function InicioPage() {
  return <InicioView />;
}
