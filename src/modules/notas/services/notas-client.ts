import { auth } from "@/lib/firebase/client";
import type { NotasSessionResponse } from "../types/notas";

export async function getNotasSession(): Promise<NotasSessionResponse> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No hay un usuario autenticado en la sesión.");
  }

  const token = await currentUser.getIdToken();
  const response = await fetch("/api/notas/session", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Error al validar la sesión en el sistema de Notas.";
    const error = new Error(message);
    (error as any).code = errorData.code;
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
