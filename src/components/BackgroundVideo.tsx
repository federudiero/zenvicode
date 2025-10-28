// src/components/BackgroundVideo.tsx
"use client";

import { PropsWithChildren } from "react";

type BackgroundVideoProps = PropsWithChildren<{
  /** Altura: por defecto 560px. Podés pasar "100vh" para pantalla completa. */
  heightClassName?: string;
  /** Opcional: opacidad del overlay negro (0 a 100). Ej: 30 = 30% */
  overlayOpacity?: number;
  /** Ruta del video en /public/ */
  src?: string;
  /** Poster opcional en /public/ */
  poster?: string;
}>;

export default function BackgroundVideo({
  children,
  heightClassName = "h-[560px]",
  overlayOpacity = 20,
  src = "/redesSociales.mp4",
  poster,
}: BackgroundVideoProps) {
  return (
    <section className={`relative w-full overflow-hidden ${heightClassName}`}>
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // sin controles
      />

      {/* Overlay para mejorar contraste del texto (ajustable) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
        aria-hidden="true"
      />

      {/* Contenido encima del video */}
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
        {children ?? (
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
             Omnichannel Ads , One Smart Platform
            </h2>
            <p className="text-sm md:text-base text-white/85 max-w-2xl mx-auto">
             Run and manage campaigns seamlessly across every major platform. Launch once, scale everywhere—with AI-powered optimization.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
