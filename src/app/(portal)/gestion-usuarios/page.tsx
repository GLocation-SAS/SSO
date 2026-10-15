import { UsuariosView } from "@/modules/gestion-usuarios/views/usuarios-view";

export const metadata = {
  title: "Gestión de Usuarios | Conecta MINEDUC",
  description: "Módulo central de administración y asignación de usuarios institucionales",
};

export default function GestionUsuariosRootPage() {
  return <UsuariosView />;
}
