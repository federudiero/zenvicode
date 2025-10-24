import Hero from "@/components/Hero";
import Steps from "@/components/Steps";

import N8nGraphBG from "@/components/n8n/N8nGraphBG";

import FormCard from "@/components/FormCard";

import OmnichannelHero from "@/components/OmnichannelHero";
import ShowcaseCollage from "@/components/ShowcaseCollage";

import Footer from "@/components/Footer";

function SectionDivider() {
  return (
    <div className="container mx-auto px-4">
      <div className="my-10 md:my-14 h-px w-full rounded-full bg-gradient-to-r from-transparent via-fuchsia-500/25 to-transparent" />
    </div>
  );
}

export default function HomePage() {

  return (
    <main className="relative">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
        suppressHydrationWarning
      >
        <N8nGraphBG
          count={75}
          speedRange={[1.2, 2.2]}
          amplitude={{ x: 23, y: 13 }}
        
        />
      </div>

      {/* Más aire vertical general */}
      <div className="space-y-24 md:space-y-32">
        <section className="container mx-auto px-4 pt-16 md:pt-20">
          <Hero />
        </section>

  <SectionDivider />

<section className="container mx-auto px-4">
  <OmnichannelHero
    leftLogos={[
      { src: "/brands/meta.svg",      alt: "Meta",       rotate: -14 },
      { src: "/brands/googleads.svg", alt: "Google Ads", rotate:  10 },
      { src: "/brands/reddit.svg",    alt: "Reddit",     rotate:  -6 },
    ]}
    rightLogos={[
      { src: "/brands/linkedin.svg",  alt: "LinkedIn",   rotate:  12 },
      { src: "/brands/tiktok.svg",    alt: "TikTok",     rotate:  -8 },
      { src: "/brands/youtube.svg",   alt: "YouTube",    rotate:   8 },
    ]}
    ctaHref="/contact"
    ctaLabel="Try Now for Free"
    title={"Omnichannel Ads,\nOne Smart Platform"}
    subtitle="Run and manage campaigns seamlessly across every major platform. Launch once, scale everywhere—with AI-powered optimization."
  />
</section>


 
  <SectionDivider />


 
        <section className="container mx-auto px-4">
          <Steps />
        </section>

     


        <SectionDivider />

        {/* Contact con padding y grilla más separada */}
        <section id="contact" className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Contact us
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              Tell us what you need and we’ll get back within one business day.
            </p>
          </div>

          <div className="mt-8 md:mt-12 grid gap-4 md:gap-6 md:grid-cols-3">
            <a
              href="mailto:hello@zenvicode.com"
              className="relative rounded-2xl p-5 text-sm border border-white/10 bg-card/60 backdrop-blur transition hover:border-fuchsia-400/40 hover:shadow-[0_10px_30px_-12px_rgba(217,70,239,0.35)]"
            >
              <span className="font-semibold">Email</span>
              <span className="block text-muted-foreground">hello@zenvicode.com</span>
            </a>
            <a
              href="https://wa.me/549000000000"
              target="_blank"
              rel="noreferrer"
              className="relative rounded-2xl p-5 text-sm border border-white/10 bg-card/60 backdrop-blur transition hover:border-fuchsia-400/40 hover:shadow-[0_10px_30px_-12px_rgba(217,70,239,0.35)]"
            >
              <span className="font-semibold">WhatsApp</span>
              <span className="block text-muted-foreground">Chat with our team</span>
            </a>
            <div className="relative rounded-2xl p-5 text-sm border border-white/10 bg-card/60 backdrop-blur">
              <span className="font-semibold">Availability</span>
              <span className="block text-muted-foreground">
                Mon–Fri, 9:00–18:00 (UTC-3)
              </span>
            </div>
          </div>
        </section>

        <SectionDivider />


        <section className="container mx-auto px-4 py-12 md:py-20">
  <ShowcaseCollage
  images={[
    { src: "/1.png", kicker: "Integraciones", title: "WhatsApp, Slack y más" },
    { src: "/2.png", kicker: "Orquestación", title: "Flujos n8n escalables", captionPos: "top" },
    { src: "/3.png", kicker: "Mensajería", title: "Plantillas y KPIs" },
    { src: "/4.png", kicker: "IA Agentes", title: "Asignación y memoria", captionPos: "bottom" },
    { src: "/5.png", kicker: "Monitoreo", title: "Alertas y observabilidad" },
    { src: "/6.png", kicker: "Analítica", title: "Embudo y conversión" },
  ]}
/>
</section>

          <div className="grid gap-8 md:gap-10 md:grid-cols-2 items-stretch">
            <FormCard type="lead" />
            <FormCard type="demo" />
          </div>

      
      </div>
       <Footer />
    </main>
  );
}
