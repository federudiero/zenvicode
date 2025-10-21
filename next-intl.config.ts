import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale === "es" ? "es" : "en";
  return {
    locale: safeLocale,
    messages: (await import(`./src/app/messages/${safeLocale}.json`)).default,
  };
});