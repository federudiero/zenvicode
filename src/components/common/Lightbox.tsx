"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

// We may not have Dialog installed; implement minimal lightbox.
export function Lightbox({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-4",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="relative max-w-4xl w-full">
          <button
            className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full px-3 py-1 text-sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}