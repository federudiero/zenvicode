// components/GlobalBg.tsx
"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/** Fondo global estilo Hero (grid + blobs + partículas + spotlight) */
export default function GlobalBg() {
  // Evita diferencias SSR/CSR: animamos luego de montar
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canAnimate = mounted && !reduce;

  // Mouse parallax base centro viewport
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 });

  // ✅ Hooks de transform SIEMPRE fuera de condicionales
  const spotX = useTransform(smx, (v) => `calc(50% + ${v * 1}px)`);
  const spotY = useTransform(smy, (v) => `calc(50% + ${v * 1}px)`);

  const blob1X = useTransform(smx, (v) => v * 0.08);
  const blob1Y = useTransform(smy, (v) => v * 0.06);
  const blob2X = useTransform(smx, (v) => v * -0.06);
  const blob2Y = useTransform(smy, (v) => v * -0.05);
  const blob3X = useTransform(smx, (v) => v * 0.04);
  const blob3Y = useTransform(smy, (v) => v * 0.02);

  useEffect(() => {
    if (!canAnimate) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mx.set(e.clientX - cx);
      my.set(e.clientY - cy);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [canAnimate, mx, my]);

  // Partículas deterministas, ligeras
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        top: `${(i * 167) % 100}%`,
        left: `${(i * 97) % 100}%`,
        delay: (i % 7) * 0.15,
        size: (i % 5) + 2,
        blur: (i % 3) * 2,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-black">
      {/* Grid punteada */}
      <div className="absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_center,#fff_1px,transparent_1.2px)] [background-size:22px_22px]" />

      {/* Blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 size-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.45), rgba(139,92,246,0.0))",
          x: canAnimate ? blob1X : 0,
          y: canAnimate ? blob1Y : 0,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-40 size-[40rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,197,94,0.35), rgba(34,197,94,0.0))",
          x: canAnimate ? blob2X : 0,
          y: canAnimate ? blob2Y : 0,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 size-[28rem] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(14,165,233,0.28), rgba(14,165,233,0.0))",
          x: canAnimate ? blob3X : 0,
          y: canAnimate ? blob3Y : 0,
        }}
      />

      {/* Partículas */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/50"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            filter: `blur(${p.blur}px)`,
            opacity: 0.35,
          }}
          animate={
            canAnimate
              ? { y: [0, -12, 0], opacity: [0.25, 0.45, 0.25] }
              : undefined
          }
          transition={{
            duration: 3.6 + (p.id % 5) * 0.4,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}

      {/* Spotlight */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: canAnimate
            ? `radial-gradient(650px 650px at ${spotX} ${spotY}, rgba(255,255,255,0.14), transparent 60%)`
            : "transparent",
        }}
      />
    </div>
  );
}
