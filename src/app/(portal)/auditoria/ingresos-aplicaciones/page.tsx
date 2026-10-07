import { Metadata } from "next";
import { IngresosAplicacionesView } from "@/modules/auditoria/views/ingresos-aplicaciones-view";

export const metadata: Metadata = {
  title: "Ingresos a aplicaciones | Auditoría y trazabilidad | SSO MINEDUC",
  description: "Consulta los accesos realizados por los usuarios a las aplicaciones vinculadas al SSO.",
};

export default function IngresosAplicacionesPage() {
  return <IngresosAplicacionesView />;
}
