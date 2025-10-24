"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Logo = {
  src: string;
  alt: string;
  /** initial rotation in degrees */
  rotate?: number;
};

type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  leftLogos?: Logo[];
  rightLogos?: Logo[];
};


export default function OmnichannelHero({
  title = "Omnichannel Ads,\nOne Smart Platform",
  subtitle = "Run and manage campaigns seamlessly across every major platform. Launch once, scale everywhere—with AI-powered optimization.",
 
  ctaHref = "/contact",
   leftLogos = [
    { src: "/brands/meta.svg",      alt: "Meta",       rotate: -14 },
    { src: "/brands/googleads.svg", alt: "Google Ads", rotate:  10 },
    { src: "/brands/reddit.svg",    alt: "Reddit",     rotate:  -6 },
  ],
  rightLogos = [
    { src: "/brands/linkedin.svg",  alt: "LinkedIn",   rotate:  12 },
    { src: "/brands/tiktok.svg",    alt: "TikTok",     rotate:  -8 },
    { src: "/brands/youtube.svg",   alt: "YouTube",    rotate:   8 },
  ],
}: Props) {
  return (
    <section className="relative">
      <div className="container mx-auto px-6">
        {/* 3-col grid: left logos / text / right logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-12 py-12 md:py-16">
          {/* Left column */}
          <div className="relative h-[320px] md:h-[360px] order-2 md:order-1">
            <Tile {...leftLogos[0]} className="absolute left-2 top-0 md:left-4 md:top-2" delay={0.0} />
            <Tile {...leftLogos[1]} className="absolute left-8 md:left-16 top-24 md:top-28" delay={0.4} />
            <Tile {...leftLogos[2]} className="absolute left-0 md:left-6 bottom-0" delay={0.8} />
          </div>

          {/* Center column */}
          <div className="order-1 md:order-2 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight whitespace-pre-line [text-wrap:balance]">
              {title}
            </h2>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-white/80 max-w-lg mx-auto [text-wrap:pretty]">
              {subtitle}
            </p>

            <div className="mt-5">
              
            </div>
          </div>

          {/* Right column */}
          <div className="relative h-[320px] md:h-[360px] order-3">
            <Tile {...rightLogos[0]} className="absolute right-2 top-0 md:right-4 md:top-2" delay={0.15} />
            <Tile {...rightLogos[1]} className="absolute right-8 md:right-16 top-24 md:top-28" delay={0.55} />
            <Tile {...rightLogos[2]} className="absolute right-0 md:right-6 bottom-0" delay={0.95} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({
  src,
  alt,
  rotate = 0,
  className = "",
  delay = 0,
}: Logo & { className?: string; delay?: number }) {
  return (
     <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [0, -8, 0],
        transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
      whileHover={{ scale: 1.05, rotate: rotate * 0.06 }}
      className={[
        "size-28 md:size-32 rounded-2xl bg-white shadow-xl",
        "border border-black/5",
        "flex items-center justify-center",
        "transition-transform will-change-transform",
        className,
      ].join(" ")}
      // rotación fija correcta en style
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <Image
        src={src}
        alt={alt}
        width={96}
        height={96}
        priority={delay < 0.2}
        className="max-h-[70%] max-w-[70%] object-contain"
        draggable={false}
      />
    </motion.div>
  );
}
