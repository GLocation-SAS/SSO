import { Metadata } from "next";
import { ActividadUsuariosView } from "@/modules/auditoria/views/actividad-usuarios-view";

export const metadata: Metadata = {
  title: "Actividad de usuarios | Auditoría y trazabilidad | SSO MINEDUC",
  description: "Consulta el uso e interacción de los usuarios en los sistemas integrados.",
};

export default function ActividadUsuariosPage() {
  return <ActividadUsuariosView />;
}
