"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useEsAdmin } from "@/lib/useEsAdmin";

function getLocaleFromPath(): string {
  if (typeof window === "undefined") return "en";
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0] || "en";
}

export default function HiddenAdminLink({ locale: localeProp }: { locale?: string }) {
  const { isAdmin, status, loginConGoogle } = useEsAdmin();
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const logoRef = useRef<HTMLElement | null>(null);
  const locale = useMemo(() => localeProp || getLocaleFromPath(), [localeProp]);

  useEffect(() => {
    const el = document.getElementById("site-logo");
    logoRef.current = el as HTMLElement | null;
    if (!el) return;

    let clicks: number[] = [];
    const onClick = () => {
      const now = Date.now();
      clicks = [...clicks.filter((t) => now - t < 800), now];
      if (clicks.length >= 3) {
        clicks = [];
        if (isAdmin) setVisible(true);
        else if (status === "unauthenticated") loginConGoogle();
      }
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [isAdmin, status, loginConGoogle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = e.key.toLowerCase();
      const next = (typed + c).slice(-3);
      setTyped(next);
      if (next === "crm") {
        if (isAdmin) setVisible(true);
        else if (status === "unauthenticated") loginConGoogle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typed, isAdmin, status, loginConGoogle]);

  if (!isAdmin || !visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href={`/${locale}/admin/crm`}
        className="rounded-full bg-black/80 text-white px-4 py-2 text-sm shadow-lg border border-white/10 hover:bg-black"
      >
        Open CRM
      </Link>
    </div>
  );
}