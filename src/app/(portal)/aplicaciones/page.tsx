import { AplicacionesView } from "@/modules/aplicaciones/views/aplicaciones-view";

export const metadata = {
  title: "Gestión de Aplicaciones | Conecta MINEDUC",
  description: "Administra las aplicaciones disponibles y su configuración de acceso.",
};

export default function AplicacionesPage() {
  return <AplicacionesView />;
}

