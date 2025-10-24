"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import hero from "@/content/hero.json";
import { useTranslations } from "next-intl";
import SymbolAnimated from "@/components/SymbolAnimated";
import ZenvicodeReveal from "@/components/ZenvicodeReveal";

export default function Hero() {
  const reduce = useReducedMotion();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const t = useTranslations();

  type HeroJson = { title?: string };
  const title = (hero as HeroJson)?.title ?? t("hero.title");

  // ✅ Sólo animamos si estamos en cliente y no se prefiere reducir animaciones
  const canAnimate = isClient && !reduce;

  return (
    <section
      className="
        relative overflow-hidden
        py-36 md:py-44 lg:py-56
        min-h-[70vh] md:min-h-[72vh]
        flex items-center
      "
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Símbolo animado */}
        <div className="mb-8 md:mb-10">
          <SymbolAnimated size={240} float orbiting src="/zenvicode_symbol.png" />
        </div>

        {/* ===== Marca: Zenvicode (arriba, grande) ===== */}
        <motion.h1
          initial={canAnimate ? { opacity: 0, y: 10 } : false}
          animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="
            text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white
            [text-wrap:balance]
            [text-shadow:0_3px_18px_rgba(0,0,0,.65),0_0_22px_rgba(139,92,246,.38)]
          "
        >
          Zenvicode
        </motion.h1>

        {/* Separador sutil */}
        <div className="mx-auto mt-2 h-3" />

        {/* ===== Headline desde hero.json (más chico) ===== */}
        <div className="mx-auto mt-1 md:mt-2 max-w-5xl">
          <ZenvicodeReveal
            text={title}
            className="
              text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white
              [text-wrap:balance]
              [text-shadow:0_2px_14px_rgba(139,92,246,.35),0_1px_0_rgba(0,0,0,.65)]
            "
            align="center"
            mode="mount"
            force
            delay={0.15}
          />
        </div>
      </div>
    </section>
  );
}
