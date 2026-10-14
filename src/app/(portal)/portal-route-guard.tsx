"use client";

import React from "react";

export function PortalRouteGuard({ children }: { children: React.ReactNode }) {
  // Guardia de rutas temporalmente desprotegido para pruebas directas
  return <>{children}</>;
}
