import type { NotasSessionResponse } from "../types/notas";

export async function getNotasSession(): Promise<NotasSessionResponse> {
  const response = await fetch("/api/notas/session", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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

export async function logoutNotasSession(): Promise<void> {
  const response = await fetch("/api/notas/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.warn("[Notas Client] Error closing Notas session:", errorData);
  }
}
