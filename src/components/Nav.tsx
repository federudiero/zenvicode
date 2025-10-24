"use client";
import { useTranslations } from "next-intl";

export default function Nav({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  return (
    <nav className="max-w-6xl mx-auto flex gap-4 text-sm">
      <a id="site-logo" href={`/${locale}`} className="hover:underline">{t("home")}</a>
      <a href={`/${locale}/use-cases`} className="hover:underline">{t("useCases")}</a>
      <a href={`/${locale}/how-we-work`} className="hover:underline">{t("howWeWork")}</a>
      <a href={`/${locale}/contact`} className="hover:underline">{t("contact")}</a>
    </nav>
  );
}