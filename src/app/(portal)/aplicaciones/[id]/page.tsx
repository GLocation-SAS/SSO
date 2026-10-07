import { AplicacionDetailView } from "@/modules/aplicaciones/views/aplicacion-detail-view";

export const metadata = {
  title: "Detalle de Aplicación | Conecta MINEDUC",
  description: "Configuración y detalle de acceso de la aplicación",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AplicacionDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AplicacionDetailView id={id} />;
}
