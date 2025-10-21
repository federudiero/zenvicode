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


  return (
    <section
      className="
        relative overflow-hidden
        py-36 md:py-44 lg:py-56      /* más aire vertical */
        min-h-[70vh] md:min-h-[72vh] /* altura mínima del hero */
        flex items-center            /* centra contenido vertical */
      "
    >
      <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-8 md:mb-10">
          <SymbolAnimated size={240} float orbiting src="/zenvicode_symbol.png" />
        </div>
<div className="mx-auto mt-4 h-px w-24" />
         

        <div className="mx-auto mt-8 md:mt-10 max-w-6xl">
      <ZenvicodeReveal
  className="text-6xl sm:text-7xl font-semibold tracking-tight text-white
             [text-shadow:0_2px_14px_rgba(139,92,246,.35),0_1px_0_rgba(0,0,0,.65)]"
  align="center"
  mode="mount"
  force
  delay={0.15}
/>
           <div className="mx-auto mt-4 h-px w-24" />
          {/* símbolo animado */}
     
      
        </div>

        {/* título principal (de hero.json) */}
       <motion.h1
  initial={false}
  animate={isClient && !reduce ? { opacity: 1, y: 0 } : undefined}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="mt-6 text-3xl sm:text-5xl font-medium text-white
             [text-shadow:0_3px_18px_rgba(0,0,0,.65),0_0_22px_rgba(139,92,246,.38)]"
>
  {title}
</motion.h1>
 

        {/* 'Zenvicode' animado como bloque aparte */}
       
      </div>
    </section>
  );
}
