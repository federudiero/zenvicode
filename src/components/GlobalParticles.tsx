"use client";
import N8nGraphBG from "./n8n/N8nGraphBG";

export default function GlobalParticles() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-40 overflow-hidden"
      style={{ contain: "paint" }}
      aria-hidden="true"
    >
      {/* Mount animated particles globally without affecting section styles */}
      <N8nGraphBG />
    </div>
  );
}