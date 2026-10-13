import { Metadata } from "next";
import { MiDashboardView } from "@/modules/mi-dashboard/views/mi-dashboard-view";

export const metadata: Metadata = {
  title: "Mi Dashboard | Conecta MINEDUC",
  description: "Panel personal de métricas, accesos y actividad de usuario en Conecta MINEDUC.",
};

export default function MiDashboardPage() {
  return <MiDashboardView />;
}
