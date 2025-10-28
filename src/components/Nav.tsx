// components/Nav.tsx
"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MouseEvent } from "react";

export default function Nav({ locale }: { locale: string }) {
  // ✅ Usar el namespace "nav" para que lea nav.home, nav.useCases, etc.
  const t = useTranslations("nav");
  const pathname = usePathname();
  const homePath = `/${locale}`;
  const onHome = pathname === homePath || pathname === `${homePath}/`;

  function goTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!onHome) return; // si no estoy en home, que navegue normal a /{locale}#id
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      className="
        w-full max-w-6xl mx-auto
        flex items-center justify-center gap-6 text-sm
      "
      aria-label="Primary"
    >
      <a
        id="site-logo"
        href={`${homePath}#home`}
        onClick={(e) => goTo(e, "home")}
        className="hover:underline"
      >
        {t("home")}
      </a>

      <a
        href={`${homePath}#use-cases`}
        onClick={(e) => goTo(e, "use-cases")}
        className="hover:underline"
      >
        {t("useCases")}
      </a>

      <a
        href={`${homePath}#how-we-work`}
        onClick={(e) => goTo(e, "how-we-work")}
        className="hover:underline"
      >
        {t("howWeWork")}
      </a>

      <a
        href={`${homePath}#contact`}
        onClick={(e) => goTo(e, "contact")}
        className="hover:underline"
      >
        {t("contact")}
      </a>
    </nav>
  );
}
