"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Item = {
  src: string;
  alt: string;
  title: string;
  badge: string;
  blurb: string;
};

const DEFAULT_ITEMS: Item[] = [
  {
    src: "/n8n.webp",
    alt: "AI Agent onboarding flow",
    title: "AI Agent – Onboarding Flow",
    badge: "HR • Slack • Entra ID • Jira",
    blurb:
      "Automate user onboarding: AI Agent decide permisos, crea usuario en Entra/Jira y lo invita a los canales correctos en Slack.",
  },
  {
    src: "/n8n2.webp",
    alt: "API Agent for Proxmox",
    title: "API Agent – Proxmox Ops",
    badge: "Gemini/Groq • Docs grounding",
    blurb:
      "Un API Agent seguro que entiende la documentación de Proxmox, ejecuta GET/POST/DELETE y devuelve respuestas estructuradas.",
  },
  {
    src: "/whatsapp-n8n-worflow.png",
    alt: "WhatsApp + n8n customer support",
    title: "WhatsApp + n8n – Smart Support",
    badge: "WhatsApp Cloud • Memory • Sheets",
    blurb:
      "Atención al cliente con IA: entra un WhatsApp, el agente busca info, mejora ficha de producto y responde en segundos.",
  },
];

export default function WorkShowcase({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  // Para loop infinito duplicamos el array (seamless)
  const loopItems = [...items, ...items];
  const scrollerRef = useRef<HTMLDivElement>(null);

  // autoplay control
  const [paused, setPaused] = useState(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // rueda -> pausa temporal
  const onWheel = (e: React.WheelEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
      setPaused(true);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      pauseTimer.current = setTimeout(() => setPaused(false), 1400);
    }
  };

  // autoplay con requestAnimationFrame
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const speedPxPerSec = 80; // 🔧 velocidad del marquee
    let raf = 0;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;

      if (!paused) {
        el.scrollLeft += speedPxPerSec * dt;

        // cuando llega a la mitad (porque duplicamos items), reseteamos
        const half = (el.scrollWidth - el.clientWidth) / 2;
        if (el.scrollLeft >= half) {
          // mantener continuidad visual
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // helpers: pausar/reanudar por hover/touch
  const handleEnter = () => setPaused(true);
  const handleLeave = () => setPaused(false);
  const handleTouchStart = () => setPaused(true);
  const handleTouchEnd = () => {
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setPaused(false), 800);
  };

  return (
    <section id="work" className="relative">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-6 md:mb-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Work & Automations</h2>
          <p className="mt-2 text-white/70">Selected flows we build at Zenvicode.</p>
        </header>

        {/* Contenedor del marquee */}
        <div
          ref={scrollerRef}
          onWheel={onWheel}
          onMouseLeave={handleLeave}
          onTouchEnd={handleTouchEnd}
          className="
            relative -mx-4 md:mx-0
            overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            pl-4 pr-8 md:pl-0 md:pr-10
            scroll-smooth
            select-none
          "
          // padding para que no se corten bordes al inicio/fin visible
          style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "2.5rem" }}
        >
          <div className="flex gap-4 md:gap-6 py-2 min-w-max">
            {loopItems.map((it, i) => (
              <Card
                key={`${it.title}-${i}`}
                item={it}
                // pausa cuando estás sobre cada card/contendor
                onHoverStart={handleEnter}
                onHoverEnd={handleLeave}
                onTouchStart={handleTouchStart}
              />
            ))}
            {/* espaciador al final (no visible cuando resetea, ayuda en layouts chicos) */}
            <div className="w-12 md:w-16 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  item,
  onHoverStart,
  onHoverEnd,
  onTouchStart,
}: {
  item: Item;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onTouchStart: () => void;
}) {
  return (
    <motion.article
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onTouchStart={onTouchStart}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="
        w-[88vw] sm:w-[72vw] md:w-[520px] lg:w-[600px]
        rounded-2xl overflow-hidden
        bg-white/5 ring-1 ring-white/10
        hover:ring-white/20 hover:shadow-2xl hover:shadow-emerald-500/10
        [will-change:transform,filter]
      "
      role="group"
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 72vw, 600px"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <span
          className="
            absolute left-3 top-3 text-[11px] uppercase tracking-[0.12em]
            rounded-lg px-2 py-1 bg-black/55 ring-1 ring-white/15 text-white/85
          "
        >
          {item.badge}
        </span>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-semibold text-white">{item.title}</h3>
        <p className="mt-1 text-white/75 leading-relaxed">{item.blurb}</p>

        <div className="mt-4 flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium
                       text-white bg-emerald-500 hover:bg-emerald-400 ring-1 ring-emerald-400/40 transition"
          >
            Start a project
          </a>
          <a
            href="#how-we-work"
            className="inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium
                       text-white/90 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 transition"
          >
            How we work
          </a>
        </div>
      </div>
    </motion.article>
  );
}
