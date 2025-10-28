// components/Hero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canAnimate = mounted && !reduce;

  const headline = "Zenvicode";
  const sub = "AI + automation, seamless workflows & outcomes.";

  return (
    <section
      className="
        relative
        py-32 md:py-48
        min-h-[72vh] flex items-center
        bg-transparent      /* ✅ sin fondo para que no aparezca el “recuadro” */
      "
    >
      {/* ✅ Sin decoraciones ni spotlight para que no se vea borde alguno */}

      <div className="relative mx-auto w-full max-w-6xl px-6 text-center">
        <div className="will-change-transform">
          <h1
            className="
              mt-6 text-white font-extrabold tracking-tight
              text-5xl sm:text-6xl md:text-7xl [text-wrap:balance]
              [text-shadow:0_3px_18px_rgba(0,0,0,.65)]
            "
          >
            {headline.split("").map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={canAnimate ? { opacity: 0, y: 12, scale: 0.96 } : false}
                animate={canAnimate ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.04 * i,
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={canAnimate ? { opacity: 0, y: 10 } : false}
            animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
            transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.45 }}
            className="mx-auto mt-4 max-w-2xl text-white/85 text-lg md:text-xl [text-wrap:pretty]"
          >
            {sub}
          </motion.p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <CTA href="#contact" variant="primary">
              Start a project
            </CTA>
            <CTA href="/work" variant="ghost">
              See work
            </CTA>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <a
      href={href}
      className={
        variant === "primary"
          ? "relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition-colors ring-1 ring-emerald-400/40"
          : "relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white/90 bg-white/5 hover:bg-white/10 transition-colors ring-1 ring-white/15"
      }
    >
      {children}
    </a>
  );
}
