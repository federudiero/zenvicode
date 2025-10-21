"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type Props = {
  text?: string;
  className?: string;
  align?: "left" | "center" | "right";
  mode?: "inView" | "mount";     // ← cómo disparar la animación
  force?: boolean;               // ← ignora prefers-reduced-motion
  delay?: number;                // ← delay opcional (segundos)
};

const container = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1, y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 + delay },
  },
});

const letter: Variants = {
  hidden: { opacity: 0, y: 18, x: -8, filter: "blur(8px)" },
  show:   { opacity: 1, y: 0,  x: 0,  filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ZenvicodeReveal({
  text = "Zenvicode",
  className = "text-5xl sm:text-7xl font-semibold tracking-tight",
  align = "center",
  mode = "inView",
  force = false,
  delay = 0,
}: Props) {
  const prefersReduced = useReducedMotion();
  const reduce = force ? false : prefersReduced; // si force=true, siempre anima

  const letters = [...text];
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  const baseProps =
    mode === "mount"
      ? { initial: reduce ? false : "hidden", animate: reduce ? undefined : "show" }
      : { initial: reduce ? false : "hidden", whileInView: reduce ? undefined : "show", viewport: { once: true, amount: 0.6 } };

  return (
    <motion.h2
      className={`${className} ${alignClass}`}
      variants={reduce ? undefined : container(delay)}
      {...baseProps}
    >
      {letters.map((ch, i) => (
        <motion.span key={`${ch}-${i}`} variants={reduce ? undefined : letter} className="inline-block">
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.h2>
  );
}
