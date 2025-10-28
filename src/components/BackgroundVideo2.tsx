// src/components/BackgroundVideo2.tsx
"use client";

import { PropsWithChildren, useEffect, useRef } from "react";

type BackgroundVideo2Props = PropsWithChildren<{
  /** Altura del contenedor: ej. "h-[560px]" | "h-screen" | "min-h-[70vh]" */
  heightClassName?: string;
  /** Opacidad del overlay negro (0–100) */
  overlayOpacity?: number;
  /** Ruta del video en /public (ej. "/lineas.mp4") */
  src?: string;
  /** Poster opcional en /public */
  poster?: string;
}>;

export default function BackgroundVideo2({
  children,
  heightClassName = "h-[560px]",
  overlayOpacity = 20,
  src = "/redesSociales.mp4",
  poster,
}: BackgroundVideo2Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  // Forzar reproducción cuando esté listo (algunos navegadores exigen este empujón)
  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        if (v.paused) {
          v.currentTime = v.currentTime || 0;
          await v.play();
        }
      } catch {
        // si autoplay está bloqueado por el navegador, no rompemos
      }
    };

    const onCanPlay = () => tryPlay();

    v.addEventListener("canplay", onCanPlay);
    // intento inmediato por si ya está listo
    tryPlay();

    return () => {
      v.removeEventListener("canplay", onCanPlay);
    };
  }, [src]);

  return (
    <section className={`relative w-full overflow-hidden ${heightClassName}`}>
      {/* Video de fondo */}
      <video
        key={src} // resetea el tag si cambia la fuente
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        aria-hidden="true"
        // Fallback: si el loop se corta, reintenta
        onEnded={(e) => {
          const v = e.currentTarget;
          try {
            v.currentTime = 0;
            // algunos navegadores requieren promesa
            void v.play();
          } catch {}
        }}
      />

      {/* Overlay para contraste */}
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
              Tu título sobre el video
            </h2>
            <p className="text-sm md:text-base text-white/85 max-w-2xl mx-auto">
              Podés pasar contenido como children para personalizar este bloque.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
