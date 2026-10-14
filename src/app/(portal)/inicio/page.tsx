import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InicioView } from "@/modules/inicio/views/inicio-view";
import {
  NOTAS_SESSION_COOKIE_NAME,
  verifyNotasSessionFromCookies,
} from "@/modules/notas/services/server-notas-session";

export const metadata: Metadata = {
  title: "Inicio | Notas MINEDUC",
  description: "Portal docente para registro y seguimiento de calificaciones de estudiantes - Conecta MINEDUC.",
};

export default async function InicioPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(NOTAS_SESSION_COOKIE_NAME)?.value;
  const session = await verifyNotasSessionFromCookies(sessionToken);

  if (!session) {
    redirect("/login-notas");
  }

  return <InicioView />;
}
