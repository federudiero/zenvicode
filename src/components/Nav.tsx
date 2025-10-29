import Link from "next/link";

export default function Nav() {
  const linkCls =
    // base
    "px-3 py-1.5 rounded-lg text-white/80 transition " +
    // efectos visuales
    "hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.75)] " + // glow
    "hover:-translate-y-0.5 hover:scale-[1.04] " + // pop 3D suave
    "active:translate-y-0 active:scale-[0.98] " + // tap feedback en touch
    // accesibilidad
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
    // perf
    "[will-change:transform,filter]";

  return (
    <header className="w-full sticky top-0 z-40 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20 border-b border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        {/* Centered links (wrap on small screens) */}
        <nav className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-sm text-center">
          <Link href="#services" className={linkCls}>Services</Link>
          <Link href="#cases" className={linkCls}>Case Studies</Link>
          <Link href="#integrations" className={linkCls}>Integrations</Link>
          <Link href="#contact" className={linkCls}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
