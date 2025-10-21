"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback } from "react";
import Image from "next/image";

type Item = {
  src?: string;
  alt?: string;
  /** Pretítulo corto (kicker) */
  kicker?: string;
  /** Título o etiqueta principal */
  title?: string;
  /** Posición del caption */
  captionPos?: "top" | "bottom" | "center";
};

export default function ShowcaseCollage({
  images = [
    { src: "/1.png", kicker: "Integraciones", title: "WhatsApp, Slack y más" },
    { src: "/2.png", kicker: "Orquestación", title: "Flujos n8n escalables" },
    { src: "/3.png", kicker: "Mensajería", title: "Plantillas y KPIs" },
    { src: "/4.png", kicker: "IA Agentes", title: "Asignación y memoria" },
    { src: "/5.png", kicker: "Monitoreo", title: "Alertas y observabilidad" },
    { src: "/6.png", kicker: "Analítica", title: "Embudo y conversión" },
  ],
}: {
  images?: (string | Item)[];
}) {
  const items: Item[] = images.map((it) =>
    typeof it === "string" ? { src: it } : it
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
      {/* Layout asimétrico (moderno) */}
      <Cell span="md:col-span-5 h-64 md:h-[20rem]" item={items[0]} delay={0.0} />
      <Cell span="md:col-span-4 h-48 md:h-[16rem]" item={items[1]} delay={0.05} />
      <Cell span="md:col-span-3 h-48 md:h-[16rem]" item={items[2]} delay={0.1} />

      {/* Spotlight central */}
      <Cell
        span="md:col-span-7 h-64 md:h-[24rem]"
        item={{ captionPos: "bottom", ...items[3] }}
        delay={0.15}
        spotlight
      />
      <Cell span="md:col-span-5 h-64 md:h-[24rem]" item={items[4]} delay={0.2} />

      {/* Fila inferior */}
      <Cell span="md:col-span-4 h-48 md:h-[16rem]" item={items[5]} delay={0.25} />
      {/* Ejemplo de tarjeta SOLO TEXTO intercalada */}
      <Cell
        span="md:col-span-4 h-48 md:h-[16rem]"
        item={{
          kicker: "Automatización",
          title: "Dispara eventos por webhooks o cron",
          captionPos: "center",
        }}
        delay={0.3}
      />
      <Cell
        span="md:col-span-4 h-48 md:h-[16rem]"
        item={{
          kicker: "Seguridad",
          title: "Roles, logs y auditoría en Firestore",
          captionPos: "center",
        }}
        delay={0.35}
      />
    </div>
  );
}

function Cell({
  span,
  item,
  delay = 0,
  spotlight = false,
}: {
  span: string;
  item?: Item;
  delay?: number;
  spotlight?: boolean;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useTransform(rx, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(ry, [-0.5, 0.5], [-10, 10]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      ry.set((e.clientX - r.left) / r.width - 0.5);
      rx.set((e.clientY - r.top) / r.height - 0.5);
    },
    [rx, ry]
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  const pos = item?.captionPos ?? "bottom";
  const posClasses =
    pos === "top"
      ? "top-0"
      : pos === "center"
      ? "top-1/2 -translate-y-1/2"
      : "bottom-0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={`${span} group`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY }}
        className={[
          "relative h-full w-full overflow-hidden rounded-2xl",
          "border border-white/10 bg-white/[0.04] backdrop-blur",
          "shadow-[0_18px_60px_-30px_rgba(0,0,0,0.55)]",
          "transition-transform duration-300 will-change-transform",
          "hover:scale-[1.02]",
          spotlight ? "ring-1 ring-fuchsia-500/30" : "",
        ].join(" ")}
      >
        {/* ▼ Borde degradé por debajo */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[1.05rem] z-0"
          style={{
            border: "1px solid transparent",
            background:
              "linear-gradient(#0000, #0000) padding-box, linear-gradient(120deg, rgba(232,121,249,0.5), rgba(99,102,241,0.5)) border-box",
          }}
        />

        {/* Imagen si existe */}
        {item?.src ? (
          <Image
            src={item.src as string}
            alt={(item.alt ?? item.title ?? "showcase") as string}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover z-10 scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={false}
            draggable={false}
          />
        ) : (
          // Card solo texto (sin imagen)
          <div className="absolute inset-0 z-10 grid place-items-center bg-gradient-to-br from-fuchsia-500/10 via-indigo-500/5 to-transparent" />
        )}

        {/* Caption (kicker + title) */}
        {(item?.kicker || item?.title) && (
          <div
            className={[
              "absolute left-0 right-0 z-20",
              posClasses,
              "px-4 py-3 md:px-5 md:py-4",
            ].join(" ")}
          >
            <div className="mx-3 md:mx-4 rounded-xl bg-black/35 backdrop-blur-sm ring-1 ring-white/10 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.6)]">
              <div className="px-3.5 py-2.5 md:px-4 md:py-3">
                {item?.kicker && (
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-fuchsia-300/90">
                    {item.kicker}
                  </p>
                )}
                {item?.title && (
                  <h4 className="text-sm md:text-base font-semibold leading-snug">
                    {item.title}
                  </h4>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Glow violeta */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[1.1rem] blur-xl opacity-60 z-20"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(217,70,239,0.10), rgba(99,102,241,0.00))",
          }}
        />
        {/* Shine */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background:
              "linear-gradient(60deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 80%)",
            mixBlendMode: "overlay",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
