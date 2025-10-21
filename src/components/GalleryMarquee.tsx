"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  images: string[];                 // rutas (p.ej. /media/1.png)
  colsClass?: string;               // grid responsive (Tailwind)
  gapClass?: string;                // gap (Tailwind)
  itemRadiusClass?: string;         // radios (Tailwind)
  hoverScale?: number;              // escala en hover (1.00–1.10)
  blurOnEnter?: boolean;            // blur al aparecer
};

export default function GalleryMarquee({
  images,
  colsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  gapClass = "gap-6 md:gap-8",
  itemRadiusClass = "rounded-xl",
  hoverScale = 1.04,
  blurOnEnter = true,
}: Props) {
  return (
    <div className={`grid ${colsClass} ${gapClass}`}>
      {images.map((src, i) => {
        const fromLeft = i % 2 === 0; // alterna entrada
        return (
          <motion.div
            key={`${src}-${i}`}
            initial={{
              opacity: 0,
              x: fromLeft ? -48 : 48,
              filter: blurOnEnter ? "blur(6px)" : "blur(0px)",
            }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1], // easeOut expo-ish
              delay: (i % 6) * 0.04,    // micro-stagger por fila
            }}
            className="group"
          >
            <div
              className={[
                "relative overflow-hidden",
                itemRadiusClass,
                "bg-white/5 border border-white/10",
                "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.4)]",
                "transition-transform duration-300 will-change-transform",
                "aspect-[16/10]", // asegura caja para Image fill
              ].join(" ")}
              style={{ transformOrigin: fromLeft ? "left center" : "right center" }}
            >
              <Image
                src={src}
                alt="gallery"
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-contain"
                draggable={false}
                unoptimized
                priority={false}
              />

              {/* overlay sutil al hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/10 to-transparent" />
            </div
            >

            {/* hover scale sutil */}
            <style jsx>{`
              .group:hover > div {
                transform: scale(${hoverScale});
              }
              .group:active > div {
                transform: scale(${Math.max(hoverScale - 0.02, 1)});
              }
            `}</style>
          </motion.div>
        );
      })}
    </div>
  );
}
