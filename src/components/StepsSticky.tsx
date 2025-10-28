"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";

export type StepItem = {
  id: string;
  img: string;       // ruta en /public o remota
  title: string;
  subtitle?: string;
  bullets?: string[];
  kpi?: string;      // ✅ nuevo
  reverse?: boolean; // (no lo usamos en sticky, pero lo aceptamos)
};

type Props = {
  items: StepItem[];
  stickyHeight?: string;  // ej: "70vh"
  stickyTop?: string;     // ej: "15vh"
  className?: string;     // fondo y color de texto
  showMobileImage?: boolean; // muestra imagen arriba del texto en mobile
};

export default function StepsSticky({
  items,
  stickyHeight = "70vh",
  stickyTop = "15vh",
  className = "bg-black text-white",
  showMobileImage = true,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Parallax sutil para el panel sticky completo
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={sectionRef} className={`w-full ${className}`}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Columna izquierda: STICKY MEDIA con parallax (desktop) */}
          <div
            className="relative hidden md:block"
            style={{ position: "sticky", top: stickyTop, height: stickyHeight }}
          >
            <motion.div style={{ y: parallaxY }} className="relative w-full h-full">
              {/* ⬇️ Reducimos “presencia” visual con padding dentro del área sticky */}
              <div className="absolute inset-0 p-4 md:p-6">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10">
                  <AnimatePresence mode="popLayout">
                    {items.map((it, idx) =>
                      idx === active ? (
                        <motion.div
                          key={it.id}
                          className="absolute inset-0"
                          initial={{ opacity: 0.0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        >
                          <Image
                            src={it.img}
                            alt={it.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        </motion.div>
                      ) : null
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha: TEXTO que entra al scrollear */}
          <div className="space-y-[50vh] md:space-y-[65vh]">
            {items.map((it, idx) => (
              <StepCard
                key={it.id}
                index={idx}
                item={it}
                isActive={active === idx}
                onBecameActive={() => setActive(idx)}
                showMobileImage={showMobileImage}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Card de texto: detecta su visibilidad y notifica al padre cuando entra en viewport */
function StepCard({
  item,
  isActive,
  onBecameActive,
  index,
  showMobileImage,
}: {
  item: StepItem;
  isActive: boolean;
  onBecameActive: () => void;
  index: number;
  showMobileImage?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-30% 0% -50% 0%", amount: 0.35 });

  useEffect(() => {
    if (inView) onBecameActive();
  }, [inView, onBecameActive]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="max-w-xl"
    >
      {/* Imagen encima del texto en mobile (tamaño más contenido) */}
      {showMobileImage && (
        <div className="mb-4 md:hidden rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5">
          <Image
            src={item.img}
            alt={item.title}
            width={1200}
            height={800}
            className="w-full h-auto object-cover aspect-[16/10] max-h-56"
            priority={index === 0}
          />
        </div>
      )}

      {/* KPI badge si existe */}
      {item.kpi && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            {item.kpi}
          </span>
        </div>
      )}

      <motion.h3
        className="text-3xl md:text-4xl font-extrabold tracking-tight [text-wrap:balance]"
        initial={false}
        animate={{
          color: isActive ? "rgb(34,197,94)" : "white", // emerald-500 cuando activo
        }}
        transition={{ duration: 0.35 }}
      >
        {item.title}
      </motion.h3>

      {item.subtitle && (
        <motion.p
          className="mt-3 text-sm md:text-base text-white/80 [text-wrap:pretty]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {item.subtitle}
        </motion.p>
      )}

      {item.bullets?.length ? (
        <motion.ul
          className="mt-4 space-y-2 text-white/85"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.15 },
            },
          }}
        >
          {item.bullets.map((b, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2"
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35 },
                },
              }}
            >
              <span className="mt-1 inline-block size-1.5 rounded-full bg-emerald-400" />
              <span>{b}</span>
            </motion.li>
          ))}
        </motion.ul>
      ) : null}
    </motion.div>
  );
}
