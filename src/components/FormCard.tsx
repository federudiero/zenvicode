// src/components/FormCard.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const baseSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  message: z.string().min(10, "Please add some details"),
});

type FormType = "lead" | "demo";

export default function FormCard({ type }: { type: FormType }) {
  // schema dinámico según el tipo
  const schema = baseSchema.extend(
    type === "demo" ? { company: z.string().min(2, "Company is too short") } : {}
  );
  type FormValues = z.infer<typeof schema>;

  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/${type === "demo" ? "book-demo" : "lead"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");

      reset();
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative h-full rounded-2xl p-[1.5px] bg-gradient-to-br from-fuchsia-500/70 via-violet-600/40 to-indigo-500/70"
    >
      {/* inner card */}
      <div className="rounded-2xl h-full bg-card/95 backdrop-blur border border-white/10 p-6">
        <div className="mb-5">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight [text-wrap:balance]">
            {type === "demo" ? "Book a Demo" : "Get in Touch"}
          </h3>
          <p className="mt-1 text-base md:text-lg leading-relaxed text-white/80 [text-wrap:pretty]">
            We&apos;ll reply shortly with next steps.
          </p>
        </div>

        <div className="space-y-4">
          {type === "demo" && (
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <Input
                {...register("company")}
                aria-invalid={!!errors.company}
                className="bg-background/40 border-white/10 focus-visible:ring-fuchsia-400"
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.company.message)}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              {...register("name")}
              aria-invalid={!!errors.name}
              className="bg-background/40 border-white/10 focus-visible:ring-fuchsia-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.name.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              className="bg-background/40 border-white/10 focus-visible:ring-fuchsia-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea
              rows={4}
              {...register("message")}
              aria-invalid={!!errors.message}
              className="bg-background/40 border-white/10 focus-visible:ring-fuchsia-400"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.message.message)}
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className={[
                "relative w-full inline-flex items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-white",
                "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600",
                "shadow-[0_8px_24px_-8px_rgba(168,85,247,0.55)] ring-1 ring-white/10",
                "transition will-change-transform",
                "hover:shadow-[0_14px_34px_-10px_rgba(168,85,247,0.75)] hover:saturate-125",
                "active:translate-y-px",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70",
                status === "loading" ? "opacity-80 cursor-wait" : "",
              ].join(" ")}
            >
              <span className="relative z-10">
                {status === "loading" ? "Sending…" : type === "demo" ? "Book a demo" : "Send message"}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 bg-[radial-gradient(120%_120%_at_10%_-20%,white,transparent_40%)]"
              />
            </button>
          </div>

          {/* Status messages */}
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-400 text-sm"
            >
              <CheckCircle2 className="size-4" />
              Submitted successfully — we&apos;ll be in touch!
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              There was an error. Please try again.
            </motion.p>
          )}
        </div>
      </div>
    </motion.form>
  );
}
