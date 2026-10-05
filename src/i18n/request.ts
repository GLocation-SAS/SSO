import { getRequestConfig } from "next-intl/server";
import { routing } from "@/routing";

export default getRequestConfig(async () => {
  // Exportación estática no permite leer requestLocale/headers
  const locale = routing.defaultLocale || "es";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
