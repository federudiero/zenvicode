"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  count?: number;
  speedRange?: [number, number];
  amplitude?: { x: number; y: number };
  /** Mostrar línea SVG suave */
  showConnector?: boolean;  // default false
  /** Mostrar cometas (rebote dentro de pantalla) */
  showComets?: boolean;     // default false
};

export default function N8nGraphBG({
  count = 26,
  speedRange = [4, 9],
  amplitude = { x: 16, y: 10 },
  showConnector = false,
  showComets = false,
}: Props) {
  const nodes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const r1 = Math.random();
      const r2 = Math.random();
      const r3 = Math.random();
      const r4 = Math.random();
      return {
        id: i,
        left: 6 + r1 * 88,
        top: 8 + r2 * 84,
        size: 1.4 + r3 * 2.1,
        dur: speedRange[0] + r4 * (speedRange[1] - speedRange[0]),
        delay: Math.random() * 2,
      };
    });
  }, [count, speedRange[0], speedRange[1]]);

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ contain: "paint" }} // aísla el pintado y previene efectos colaterales
    >
      <div className="absolute inset-0 bg-dot-grid text-white/40 dark:text-white/30" />
      <div className="grain absolute inset-0" />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-fuchsia-500/10 blur-3xl" />

      {nodes.map((n) => (
        <motion.div
          key={n.id}
          animate={{
            x: [0, amplitude.x, -amplitude.x * 0.7, 0],
            y: [0, -amplitude.y, amplitude.y * 0.6, 0],
            opacity: [0.65, 1, 0.75, 1],
          }}
          transition={{
            duration: n.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: n.delay,
          }}
          style={{
            left: `${n.left}%`,
            top: `${n.top}%`,
            width: n.size,
            height: n.size,
            transform: "translate3d(0,0,0)",
          }}
          className="absolute rounded-full bg-fuchsia-400/80 shadow-[0_0_14px_3px_rgba(232,121,249,0.45)]"
        />
      ))}

      {showConnector && (
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gl" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(232,121,249,0)" />
              <stop offset="50%" stopColor="rgba(232,121,249,.35)" />
              <stop offset="100%" stopColor="rgba(232,121,249,0)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M8,28 C28,20 42,60 60,48 80,40 90,70 96,64"
            stroke="url(#gl)"
            strokeWidth="0.6"
            fill="none"
            animate={{ pathLength: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      )}

      {showComets && (
        <>
          <Comet y="24%" delay={0} />
          <Comet y="72%" delay={1.2} />
        </>
      )}
    </div>
  );
}

/** Cometa que rebota dentro del viewport (sin salirse, sin scroll) */
function Comet({ y = "40%", delay = 0 }: { y?: string; delay?: number }) {
  return (
    <motion.div
      className="absolute h-px w-[40vw] max-w-[70vw] bg-gradient-to-r from-transparent via-fuchsia-400/70 to-transparent"
      style={{ top: y, left: "5vw", filter: "blur(0.3px)" }}
      animate={{ x: ["0vw", "55vw", "0vw"] }}  // ping-pong
      transition={{ duration: 7.5, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
