import N8nGraphBG from "@/components/n8n/N8nGraphBG";
import FormCard from "@/components/FormCard";

export default function ContactPage() {
  return (
    <main className="relative">
      {/* Background (same vibe as pricing) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
        suppressHydrationWarning
      >
        <N8nGraphBG
          count={80}
          speedRange={[1.2, 2.2]}
          amplitude={{ x: 22, y: 14 }}
          showComets
          showConnector
        />
      </div>

      {/* Header */}
      <section className="container mx-auto px-6 pt-16 pb-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight [text-wrap:balance]">
          Let's Talk
        </h1>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-white/80 [text-wrap:pretty]">
          Tell us what you need — we reply in under 24 hours. Or email us at
          <a href="mailto:federudiero@gmail.com" className="inline-block ml-1 underline">federudiero@gmail.com</a>.
        </p>
      </section>

      {/* Forms */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          <FormCard type="lead" />
          <FormCard type="demo" />
        </div>
      </section>
    </main>
  );
}
