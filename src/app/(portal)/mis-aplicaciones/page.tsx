import { Metadata } from "next";
import { MisAplicacionesView } from "@/modules/mis-aplicaciones/views/mis-aplicaciones-view";

export const metadata: Metadata = {
  title: "Mis Aplicaciones | Conecta MINEDUC",
  description: "Catálogo de aplicaciones y sistemas autorizados para el usuario en Conecta MINEDUC.",
};

export default function MisAplicacionesPage() {
  return <MisAplicacionesView />;
}
