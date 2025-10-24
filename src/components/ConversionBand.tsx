"use client";

import Link from "next/link";
import { ShieldCheck, Sparkles, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConversionBand({
  title = "Launch faster. Convert more.",
  subtitle = "Plug-and-play workflows, AI assistance, and expert onboarding included.",
  cta = { label: "START FREE", href: "/contact" },
}: {
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-10
                     border border-white/10 bg-gradient-to-br
                     from-fuchsia-600/20 via-violet-700/10 to-indigo-700/10"
        >
          {/* glow */}
          <div className="pointer-events-none absolute -inset-20 blur-3xl opacity-40"
               style={{ background:
                 "radial-gradient(40% 40% at 30% 20%, rgba(217,70,239,0.3), transparent 70%)" }} />

          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight [text-wrap:balance]">
                {title}
              </h3>
              <p className="mt-2 text-base md:text-lg leading-relaxed text-white/80 [text-wrap:pretty]">
                {subtitle}
              </p>

              <ul className="mt-4 grid gap-2 text-sm text-white/80 md:grid-cols-3">
                <li className="flex items-center gap-2"><Sparkles className="size-4 text-fuchsia-400"/> AI workflows</li>
                <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-400"/> RLS & GDPR-ready</li>
                <li className="flex items-center gap-2"><Clock className="size-4 text-sky-400"/> 1-day onboarding</li>
              </ul>
            </div>

            <div className="md:justify-self-end">
              <Link
                href={cta.href}
                className={[
                  "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600",
                  "shadow-[0_12px_28px_-12px_rgba(168,85,247,0.65)] ring-1 ring-white/10",
                  "transition hover:shadow-[0_18px_40px_-16px_rgba(168,85,247,0.85)] hover:saturate-125 active:translate-y-px",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70",
                ].join(" ")}
              >
                {cta.label}
              </Link>
              <p className="mt-2 text-xs text-white/70 text-center md:text-right">
                No credit card. Cancel anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
