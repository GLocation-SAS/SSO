"use client";

import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Rutas temporalmente desprotegidas para pruebas fluidas de acceso y vistas
  return <>{children}</>;
}
