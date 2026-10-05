import { GeoportalHeader } from "@/components/layout/geoportal-header";

import { Suspense } from "react";

export default function HeaderPreviewPage() {
  const variant = "full";
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Cargando...</div>}>
        <GeoportalHeader variant={variant} />
      </Suspense>
    </div>
  );
}
