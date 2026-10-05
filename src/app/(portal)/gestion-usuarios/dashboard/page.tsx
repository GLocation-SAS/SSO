import { DashboardView } from "@/modules/dashboard/views/dashboard-view";

export const metadata = {
  title: "Dashboard de usuarios | Conecta MINEDUC",
  description: "Métricas y resumen de gestión de usuarios del sistema Conecta MINEDUC",
};

export default function GestionUsuariosDashboardPage() {
  return <DashboardView />;
}

