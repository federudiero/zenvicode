"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-base-200/40 to-base-300/40 border-t border-base-300/40 text-base-content backdrop-blur-md relative z-10">
      {/* Centramos todo el grid y el texto */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 text-sm place-items-center text-center">
        {/* Brand */}
        <div className="max-w-md">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-primary [text-wrap:balance]">
            Zenvicode
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-white/80 [text-wrap:pretty]">
            Zenvicode helps businesses automate workflows, scale faster, and
            connect smarter with AI-driven integrations for marketing, sales, and
            customer support.
          </p>

          {/* ONLY Instagram */}
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="https://instagram.com/tu_cuenta"
              aria-label="Instagram"
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={22} />
            </Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xl font-semibold tracking-tight mb-3 text-primary [text-wrap:balance]">
            Company
          </h4>
          <ul className="space-y-2 flex flex-col items-center">
            <li><Link href="/about" className="hover:underline text-white/80">About Us</Link></li>
            <li><Link href="/careers" className="hover:underline text-white/80">Careers</Link></li>
            <li><Link href="/partners" className="hover:underline text-white/80">Partners</Link></li>
            <li><Link href="/contact" className="hover:underline text-white/80">Contact</Link></li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="text-xl font-semibold tracking-tight mb-3 text-primary [text-wrap:balance]">
            Solutions
          </h4>
          <ul className="space-y-2 flex flex-col items-center">
            <li><Link href="/ai-automation" className="hover:underline text-white/80">AI Automation</Link></li>
            <li><Link href="/marketing" className="hover:underline text-white/80">Omnichannel Marketing</Link></li>
            <li><Link href="/crm" className="hover:underline text-white/80">CRM Platform</Link></li>
            <li><Link href="/integrations" className="hover:underline text-white/80">Integrations</Link></li>
          </ul>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-t border-base-300/40 py-6 text-center text-xs opacity-70"
      >
        <p>
          © {new Date().getFullYear()} <span className="font-semibold">Zenvicode</span>.{" "}
          All rights reserved. | <Link href="/privacy" className="hover:underline">Privacy Policy</Link> ·{" "}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </p>
      </motion.div>
    </footer>
  );
}
