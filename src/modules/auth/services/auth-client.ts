import { auth } from "@/lib/firebase/client";
import type { UsuarioItem } from "@/modules/gestion-usuarios/types/usuario";

export interface AuthProfileResponse {
  uid: string;
  email: string;
  debeCambiarPassword: boolean;
  usuario?: UsuarioItem | null;
}

export interface FetchAuthProfileOptions {
  targetApp?: string;
}

export async function fetchAuthProfile(
  options?: FetchAuthProfileOptions
): Promise<AuthProfileResponse> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No hay un usuario autenticado en la sesión.");
  }

  const token = await currentUser.getIdToken();
  const queryParams = options?.targetApp
    ? `?app=${encodeURIComponent(options.targetApp)}`
    : "";

  const response = await fetch(`/api/auth/me${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "No se pudo obtener el perfil de autenticación.";
    const error = new Error(message);
    (error as any).code = errorData.code;
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
