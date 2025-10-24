"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-base-200/40 to-base-300/40 border-t border-base-300/40 text-base-content backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10 text-sm">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-primary">Zenvicode</h3>
          <p className="opacity-80 leading-relaxed">
            Zenvicode helps businesses automate workflows, scale faster, and
            connect smarter with AI-driven integrations for marketing, sales, and
            customer support.
          </p>

          {/* ONLY Instagram */}
          <div className="flex gap-4 mt-4">
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
          <h4 className="font-semibold mb-3 text-primary">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/careers" className="hover:underline">Careers</Link></li>
            <li><Link href="/partners" className="hover:underline">Partners</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold mb-3 text-primary">Solutions</h4>
          <ul className="space-y-2">
            <li><Link href="/ai-automation" className="hover:underline">AI Automation</Link></li>
            <li><Link href="/marketing" className="hover:underline">Omnichannel Marketing</Link></li>
            <li><Link href="/crm" className="hover:underline">CRM Platform</Link></li>
            <li><Link href="/integrations" className="hover:underline">Integrations</Link></li>
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
          © {new Date().getFullYear()} <span className="font-semibold">Zenvicode</span>. 
          All rights reserved. | <Link href="/privacy" className="hover:underline">Privacy Policy</Link> ·{" "}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </p>
      </motion.div>
    </footer>
  );
}
