import { Metadata } from "next";
import { MiPerfilView } from "@/modules/mi-perfil/views/mi-perfil-view";

export const metadata: Metadata = {
  title: "Mi Perfil | Conecta MINEDUC",
  description: "Perfil del usuario institucional y asignación de sedes y roles en Conecta MINEDUC.",
};

export default function MiPerfilPage() {
  return <MiPerfilView />;
}
