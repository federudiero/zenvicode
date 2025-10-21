"use client";

export default function GlobalBg() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
      <div className="absolute inset-0 bg-[#000000]" />
      <div
        className="absolute -inset-[25%] rounded-[9999px] blur-3xl opacity-80 bg-[radial-gradient(55%_45%_at_50%_40%,rgba(147,51,234,0.38)_0%,rgba(88,28,135,0.22)_35%,rgba(0,0,0,0)_75%)]"
      />
      <div
        className="absolute -inset-[35%] rounded-[9999px] blur-[80px] opacity-50 bg-[radial-gradient(35%_30%_at_80%_50%,rgba(168,85,247,0.20)_0%,rgba(0,0,0,0)_70%)]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_40%,transparent_60%,rgba(0,0,0,0.45)_100%)]" />
      <div className="absolute inset-0 bg-dot-grid opacity-15 mix-blend-soft-light" />
    </div>
  );
}