import { Metadata } from "next";
import { NotasWelcomeView } from "@/modules/dashboard/views/notas-welcome-view";

export const metadata: Metadata = {
  title: "Bienvenido | Sistema de Notas",
  description: "Módulo de bienvenida del Sistema de Notas de Conecta MINEDUC",
};

export default function BienvenidoPage() {
  return <NotasWelcomeView />;
}
