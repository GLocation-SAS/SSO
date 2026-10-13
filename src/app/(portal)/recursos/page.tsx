import { RecursosView } from "@/modules/recursos/views/recursos-view";

export const metadata = {
  title: "Gestión de Recursos | Conecta MINEDUC",
  description: "Administra el catálogo global de recursos disponibles en las aplicaciones del SSO.",
};

export default function RecursosPage() {
  return <RecursosView />;
}
