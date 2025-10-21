"use client";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  size?: number;                  // ancho en px
  float?: boolean;
  orbiting?: boolean;
  respectReducedMotion?: boolean;
  src?: string;                   // ruta del asset
};

export default function SymbolAnimated({
  size = 240,
  float = true,
  orbiting = true,
  respectReducedMotion = false,
  src = "/zenvicode_symbol.png",        // <-- usa este por defecto
}: Props) {
  // si querés respetar reduced motion, reemplazá por useReducedMotion()
  const reduce = false || !respectReducedMotion;

  return (
    <motion.div
      className="relative mx-auto w-fit [perspective:900px]"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Glow detrás */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-2xl blur-2xl opacity-70
                   bg-[radial-gradient(60%_60%_at_50%_45%,rgba(168,85,247,.28),rgba(0,0,0,0))]"
      />

      {/* Aro de pulso */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-[1px] w-[1px] rounded-full"
          animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          style={{
            background: "radial-gradient(circle, rgba(232,121,249,.45) 0%, rgba(232,121,249,0) 70%)",
            boxShadow: "0 0 50px 15px rgba(232,121,249,.25)",
          }}
        />
      )}

      {/* Órbitas */}
      {orbiting && !reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-[4px] w-[4px] rounded-full
                       bg-fuchsia-400/85 shadow-[0_0_10px_3px_rgba(232,121,249,.5)]"
            style={{ transformOrigin: "0 0" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i * 1.2, repeat: Infinity, ease: "linear" }}
          />
        ))}

      {/* Símbolo */}
      <motion.div
        animate={float ? { y: [0, -6, 0] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{
          filter:
            "drop-shadow(0 6px 18px rgba(0,0,0,.45)) drop-shadow(0 0 10px rgba(34,197,194,.10))",
        }}
      >
        <Image
          src={src}                                  // <-- ahora configurable
          alt="Zenvicode symbol"
          width={size}
          height={Math.round(size * 0.62)}           // mantiene proporción del recorte
          priority
          className="h-auto w-auto"                  // <-- FIX: no limita a 240px
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 60vw"
        />
      </motion.div>
    </motion.div>
  );
}
