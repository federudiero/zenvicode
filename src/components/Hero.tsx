// components/Hero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
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
        bg-transparent
      "
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 text-center">
        <div className="will-change-transform">
          <h1
            className="
              mt-6 text-white font-extrabold tracking-tight
              text-5xl sm:text-6xl md:text-7xl [text-wrap:balance]
              [text-shadow:0_3px_18px_rgba(0,0,0,.65)]
              select-none
            "
            // Si el mouse sale del título, limpiamos estado de hover
            onMouseLeave={() => setHoverIndex(null)}
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
                className="
                  inline-block align-baseline
                  px-[1px]  /* evita jitter en hover */
                  cursor-default
                  [will-change:transform,filter]
                "
                onMouseEnter={() => setHoverIndex(i)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                onTouchStart={() => {
                  setHoverIndex(i);
                  // efecto breve en touch
                  setTimeout(() => setHoverIndex(null), 180);
                }}
                // Estado de hover por letra
                whileHover={!reduce ? { y: -4, scale: 1.06 } : undefined}
                style={{
                  filter:
                    hoverIndex === i
                      ? "drop-shadow(0 0 12px rgba(255,255,255,.75))"
                      : undefined,
                  transition: "transform 160ms ease, filter 160ms ease",
                }}
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
