import { DashboardUsuariosView } from "@/modules/gestion/dashboard";

export const metadata = {
  title: "Resumen de gestión | Conecta MINEDUC",
  description: "Consulta el estado general de los usuarios, sus accesos y distribución dentro de las aplicaciones.",
};

export default function GestionDashboardPage() {
  return <DashboardUsuariosView />;
}

