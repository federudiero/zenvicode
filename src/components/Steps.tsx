"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import steps from "@/content/steps.json";
// ❌ ya no usamos ZenvicodeReveal para el título (causaba cortes por letra)

type Block = {
  id: string;
  img: string;
  title: string;
  subtitle: string;
  bullets: string[];
  kpi?: string;
  cta?: string;
  reverse?: boolean;
};

type StepsJson = { items: Block[] };

/* ==== Reveal palabra por palabra ==== */
const wordsContainer = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delayChildren: 0.05 + delay, staggerChildren: 0.04 },
  },
});

const word: Variants = {
  hidden: { opacity: 0, y: 14, x: -6, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function WordReveal({
  text,
  delay = 0,
  className = "",
}: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const words = text.split(" ");

  if (!mounted) {
    return (
      <p className={className} suppressHydrationWarning>
        {words.map((w, i) => (
          <span key={i} className="inline-block mr-1">{w}</span>
        ))}
      </p>
    );
  }

  return (
    <motion.p
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={reduce ? undefined : { once: true, amount: 0.55 }}
      variants={reduce ? undefined : wordsContainer(delay)}
      suppressHydrationWarning
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={reduce ? undefined : word}
          className="inline-block mr-1"
        >
          {w}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ==== Contenedor + slide/blur para imagen/texto ==== */
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const slideBlur = (from: "left" | "right"): Variants => {
  const x = from === "left" ? -42 : 42;
  return {
    hidden: { opacity: 0, x, filter: "blur(12px)" },
    show:   { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
  };
};

export default function Steps() {
  const reduce = useReducedMotion();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const items: Block[] = Array.isArray((steps as StepsJson).items) ? (steps as StepsJson).items : [];
  const canAnimate = isClient && !reduce;

  const heroShadow =
    "[text-shadow:0_3px_18px_rgba(0,0,0,.65),0_0_22px_rgba(139,92,246,.38)]";

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-16">
        {items.map((b, idx) => {
          const rev = b.reverse ?? idx % 2 === 1;

          const motionGroup =
            reduce || !isClient
              ? { initial: false }
              : {
                  initial: "hidden" as const,
                  whileInView: "show" as const,
                  viewport: { once: true, amount: 0.35 },
                  variants: containerVariants,
                };

          return (
            <motion.div
              key={b.id}
              {...motionGroup}
              className={`grid items-center gap-8 md:grid-cols-2 ${rev ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              {/* Imagen */}
              <motion.div
                variants={reduce ? undefined : slideBlur(rev ? "right" : "left")}
                className="
                  relative group overflow-hidden rounded-2xl border border-white/10 bg-black/30
                  shadow-[0_0_35px_rgba(139,92,246,.12)]
                  before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl
                  before:opacity-0 before:transition-opacity before:duration-700
                  before:shadow-[0_0_60px_12px_rgba(139,92,246,.20)]
                  group-hover:before:opacity-100
                  animate-[pulse_5s_ease-in-out_infinite]
                "
              >
                <Image
                  src={b.img}
                  alt={b.title}
                  width={1280}
                  height={800}
                  unoptimized
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={idx === 0}
                  className="
                    h-auto w-full object-cover transition-transform duration-600 group-hover:scale-[1.022]
                    brightness-[.9] contrast-[1.1] saturate-[1.05]
                    [filter:drop-shadow(0_0_22px_rgba(139,92,246,.28))]
                  "
                />
                <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_50%_50%,rgba(0,0,0,.50),transparent_70%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,0,20,.45),transparent_35%),radial-gradient(80%_80%_at_50%_20%,rgba(8,0,20,.35),transparent_70%)]" />
              </motion.div>

              {/* Texto */}
              <motion.div variants={reduce ? undefined : slideBlur(rev ? "left" : "right")} className="space-y-4">
                {/* Título: palabra por palabra + sin cortes internos */}
                <WordReveal
                  text={b.title}
                  delay={idx * 0.05}
                  className={`text-2xl md:text-3xl font-semibold text-white ${heroShadow}
                              [text-wrap:balance] break-normal [overflow-wrap:normal] [word-break:normal] [hyphens:none]`}
                />

                {/* Subtítulo */}
                <WordReveal
                  text={b.subtitle}
                  delay={0.1}
                  className={`text-base md:text-lg leading-relaxed text-white/80 ${heroShadow} [text-wrap:pretty]`}
                />

                {/* Bullets */}
                <motion.ul
                  initial={false}
                  whileInView={canAnimate ? "show" : undefined}
                  viewport={canAnimate ? { once: true, amount: 0.2, margin: "-10% 0% -10% 0%" } : undefined}
                  variants={canAnimate ? { hidden: {}, show: { transition: { staggerChildren: 0.06 } } } : undefined}
                  className="mt-3 space-y-2"
                >
                  {b.bullets?.map((t, i) => (
                    <motion.li
                      key={i}
                      variants={canAnimate ? { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } } : undefined}
                      className="flex gap-2 opacity-95"
                    >
                      <span className="mt-2 inline-block size-2 rounded-full bg-fuchsia-400" />
                      <span className={`text-white/80 ${heroShadow}`}>{t}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                {b.kpi && <p className={`pt-2 text-fuchsia-300/95 ${heroShadow}`}>{b.kpi}</p>}

                {b.cta && (
                  <div className="pt-2">
                    <a
                      href="#contact"
                      className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 text-white ${heroShadow}`}
                    >
                      {b.cta}
                      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
                        <path fill="currentColor" d="M13 5l7 7l-7 7v-4H4v-6h9V5z" />
                      </svg>
                    </a>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
