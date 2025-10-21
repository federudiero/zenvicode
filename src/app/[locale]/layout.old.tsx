import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

async function getMessages(locale: string) {
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return messages;
  } catch {
    return null;
  }
}

export default async function LocaleLayout(
  props: Readonly<{ params: Promise<{ locale: string }>; children: React.ReactNode }>
) {
  const { params, children } = await props;
  const { locale } = await params;
  if (!["en", "es"].includes(locale)) notFound();
  const messages = await getMessages(locale);
  if (!messages) notFound();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
  );
}