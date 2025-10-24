"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  src?: string;
  alt?: string;
  kicker?: string;
  title?: string;
  captionPos?: "top" | "bottom" | "center"; // (not used in this variant)
};

type Props = {
  images?: (string | Item)[];
  /** ms between slides (0 = no auto-rotation) */
  autoplayMs?: number;
  /** thumbnails panel position on desktop */
  thumbsSide?: "right" | "left";
};

export default function ShowcaseCollage({
  images = [
    { src: "/1.png", kicker: "Integrations", title: "WhatsApp, Slack & more" },
    { src: "/2.png", kicker: "Orchestration", title: "Scalable n8n flows" },
    { src: "/3.png", kicker: "Messaging", title: "Templates & KPIs" },
    { src: "/4.png", kicker: "AI Agents", title: "Assignment & memory" },
    { src: "/5.png", kicker: "Monitoring", title: "Alerts & observability" },
    { src: "/6.png", kicker: "Analytics", title: "Funnel & conversion" },
  ],
  autoplayMs = 4500,
  thumbsSide = "right",
}: Props) {
  const items: Item[] = useMemo(
    () => images.map((it) => (typeof it === "string" ? { src: it } : it)),
    [images]
  );
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);

  // Auto-rotation
  useEffect(() => {
    if (!autoplayMs) return;
    const i = setInterval(() => {
      if (!paused.current) setIdx((p) => (p + 1) % items.length);
    }, autoplayMs);
    return () => clearInterval(i);
  }, [autoplayMs, items.length]);

  // Helpers
  const pick = (n: number) => (n + items.length) % items.length;
  const active = items[idx];

  return (
    <section
      className={`grid gap-5 md:gap-6 ${
        thumbsSide === "right"
          ? "lg:grid-cols-[minmax(0,1fr)_360px]"
          : "lg:grid-cols-[360px_minmax(0,1fr)]"
      }`}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Hero panel */}
      <div className="relative h-[54vw] max-h-[560px] lg:h-[540px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur">
        {/* Soft glow */}
        <span
          aria-hidden
          className="absolute -inset-px blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 45%, rgba(167,139,250,.12), rgba(99,102,241,0))",
          }}
        />
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {active?.src ? (
              <Image
                src={active.src}
                alt={(active.alt ?? active.title ?? "showcase") as string}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                draggable={false}
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-white/10 to-transparent" />
            )}

            {/* Caption */}
            {(active?.kicker || active?.title) && (
              <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4">
                <div className="mx-1 sm:mx-2 rounded-xl bg-black/45 ring-1 ring-white/10 backdrop-blur px-3.5 py-2.5 max-w-[90%]">
                  {active?.kicker && (
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80">
                      {active.kicker}
                    </p>
                  )}
                  {active?.title && (
                    <h4 className="text-base sm:text-lg font-semibold tracking-tight [text-wrap:balance]">
                      {active.title}
                    </h4>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev/Next controls */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3">
          <button
            aria-label="Previous"
            className="rounded-full bg-black/40 ring-1 ring-white/10 p-2 hover:bg-black/55 transition"
            onClick={() => setIdx((p) => pick(p - 1))}
          >
            <Chevron className="rotate-180" />
          </button>
          <button
            aria-label="Next"
            className="rounded-full bg-black/40 ring-1 ring-white/10 p-2 hover:bg-black/55 transition"
            onClick={() => setIdx((p) => pick(p + 1))}
          >
            <Chevron />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute left-0 right-0 bottom-2 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-white/90" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails (row on mobile, column on desktop) */}
      <div
        className={`${
          thumbsSide === "right" ? "lg:order-none" : "lg:order-first"
        }`}
      >
        <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar pr-1">
          {items.map((it, i) => (
            <Thumb
              key={i}
              item={it}
              active={i === idx}
              onSelect={() => setIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Subcomponents ---------------- */

function Thumb({
  item,
  active,
  onSelect,
}: {
  item: Item;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative shrink-0 rounded-xl overflow-hidden border transition-all
        ${active ? "border-white/40 ring-2 ring-white/30" : "border-white/10 hover:border-white/20"}
        w-[46%] sm:w-[38%] lg:w-full lg:h-[110px]
      `}
      aria-pressed={active}
    >
      {item?.src ? (
        <Image
          src={item.src}
          alt={(item.alt ?? item.title ?? "thumbnail") as string}
          width={320}
          height={200}
          className={`h-full w-full object-cover ${
            active ? "" : "opacity-80 grayscale-[30%]"
          }`}
          draggable={false}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-white/10 to-transparent" />
      )}
      {(item?.kicker || item?.title) && (
        <div className="absolute left-0 right-0 bottom-0 p-2">
          <div
            className={`rounded-md px-2 py-1 text-[10px] leading-none backdrop-blur ${
              active ? "bg-black/60 ring-1 ring-white/20" : "bg-black/35"
            }`}
          >
            <span className="font-medium">
              {item.title || item.kicker || "Item"}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 text-white ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="m10 6 6 6-6 6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

