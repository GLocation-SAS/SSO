import { Metadata } from "next";
import { LogsGestionView } from "@/modules/auditoria/views/logs-gestion-view";

export const metadata: Metadata = {
  title: "Logs de gestión | Auditoría y trazabilidad | SSO MINEDUC",
  description: "Consulta los cambios realizados sobre usuarios, aplicaciones, roles y accesos del sistema.",
};

export default function LogsGestionPage() {
  return <LogsGestionView />;
}
