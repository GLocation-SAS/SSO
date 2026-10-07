import { RolDetailView } from "@/modules/aplicaciones/views/rol-detail-view";
import { mockRolesPorApp } from "@/modules/aplicaciones/data/aplicaciones-data";

export function generateStaticParams() {
  const params: { id: string; rolId: string }[] = [];
  
  Object.entries(mockRolesPorApp).forEach(([appId, roles]) => {
    roles.forEach((rol) => {
      params.push({
        id: appId,
        rolId: rol.id,
      });
    });
  });
  
  return params;
}

export const metadata = {
  title: "Detalle de Rol y Permisos | Conecta MINEDUC",
  description: "Matriz de permisos y recursos por rol institucional",
};

interface PageProps {
  params: Promise<{
    id: string;
    rolId: string;
  }>;
}

export default async function RolDetailPage({ params }: PageProps) {
  const { id, rolId } = await params;
  return <RolDetailView appId={id} rolId={rolId} />;
}

