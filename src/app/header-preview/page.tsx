import { GeoportalHeader } from "@/components/layout/geoportal-header";

export default async function HeaderPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string; theme?: string }>;
}) {
  const params = await searchParams;
  const variant = (params.variant as "full" | "navigation" | "user-actions") || "full";
  return (
    <div className="min-h-screen bg-background">
      <GeoportalHeader variant={variant} />
    </div>
  );
}
