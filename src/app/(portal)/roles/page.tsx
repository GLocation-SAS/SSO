import { RolesView } from "@/modules/roles/views/roles-view";

export const metadata = {
  title: "Gestión de Roles | Conecta MINEDUC",
  description: "Administra los roles de las aplicaciones y configura sus recursos y permisos.",
};

export default function RolesPage() {
  return <RolesView />;
}
