import { UsuariosView } from "@/modules/gestion-usuarios/views/usuarios-view";

export const metadata = {
  title: "Usuarios | Conecta MINEDUC",
  description: "Bandeja de gestión de usuarios del sistema Conecta MINEDUC",
};

export default function GestionUsuariosUsuariosPage() {
  return <UsuariosView />;
}

