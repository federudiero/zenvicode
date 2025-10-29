// src/app/[locale]/(site)/page.tsx
import Hero from "@/components/Hero";
import StepsSticky, { type StepItem } from "@/components/StepsSticky";
import FormCard from "@/components/FormCard";
import Footer from "@/components/Footer";
import BackgroundVideo from "@/components/BackgroundVideo";
import BackgroundVideo2 from "@/components/BackgroundVideo2";
import WorkShowcase from "@/components/WorkShowcase";

import stepsJson from "@/content/steps_sticky.json";
const steps: StepItem[] = stepsJson.items;

export default function HomePage() {
  return (
    <main className="relative">
      <div className="space-y-24 md:space-y-32">
        {/* Home / Hero */}
        <section id="home" className="container mx-auto px-4 pt-16 md:pt-20">
          <Hero />
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="scroll-mt-24">
          <StepsSticky items={steps} />
        </section>

        {/* How We Work */}
        <section id="how-we-work" className="scroll-mt-24">
          <BackgroundVideo src="/redesSociales.mp4" heightClassName="h-screen" />
        </section>

<section className="scroll-mt-24">
  <WorkShowcase />
</section>


        {/* Contact */}
        <section id="contact" className="w-full scroll-mt-24">
          <BackgroundVideo2 src="/lineas.mp4" heightClassName="min-h-[80vh]">
            <div className="container mx-auto px-6 py-12 md:py-24">
              <div className="grid md:min-h-[60vh] md:grid-cols-[1.05fr_1fr] items-center gap-8 md:gap-12 lg:gap-16">
                <aside className="relative rounded-2xl bg-black/35 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8">
                  <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight [text-wrap:balance]">Contact</h2>
                  <p className="mt-2 text-white/80">We’ll get back to you within 24 hours.</p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="text-sm font-semibold text-white/70">Teléfono</div>
                      <a href="tel:+5493518120950" className="text-white/90 hover:underline">+54 9 3518120950</a>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white/70">Email</div>
                      <a href="mailto:zenvicode@gmail.com" className="text-white/90 hover:underline">zenvicode@gmail.com</a>
                    </div>
                  </div>

                  <div className="mt-8 h-px w-full bg-white/10" />

                  <ul className="mt-6 flex items-center gap-3 text-white/85">
                    <li>
                      <a href="https://facebook.com/tu_pagina" className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition" aria-label="Facebook">Fb</a>
                    </li>
                    <li>
                      <a href="https://instagram.com/tu_pagina" className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition" aria-label="Instagram">Ig</a>
                    </li>
                    <li>
                      <a href="https://youtube.com/@tu_canal" className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition" aria-label="YouTube">Yt</a>
                    </li>
                  </ul>
                </aside>


                <div className="md:pl-0">
                  <FormCard type="lead" />
                </div>
              </div>
            </div>
          </BackgroundVideo2>
        </section>
      </div>

      <Footer />
    </main>
  );
}
