"use client";
import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Lightbox } from "@/components/common/Lightbox";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const images = [
  { src: "/media/n8n/workflow-01.png", alt: "Workflow 01" },
  { src: "/media/n8n/workflow-02.png", alt: "Workflow 02" },
  { src: "/media/n8n/workflow-03.png", alt: "Workflow 03" },
  { src: "/media/n8n/workflow-04.png", alt: "Workflow 04" },
];

export default function N8nGallery() {
  const t = useTranslations();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 1], [0, 0.5, 1, 1]);

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <section aria-labelledby="workflows-title" className="relative">
      <div className="absolute inset-0 -z-10">
        {/* Background reusable visuals */}
        <div className="absolute inset-0 bg-dot-grid text-foreground/20 dark:text-foreground/30" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="workflows-title" className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("workflows.title")}</h2>
        <p className="text-muted-foreground mt-2">{t("workflows.description")}</p>
        <motion.div ref={ref} style={{ y, opacity }} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <motion.button
              key={img.src}
              className={cn(
                "group relative rounded-xl overflow-hidden border bg-card hover:shadow-md transition-transform",
                "hover:rotate-[0.5deg] hover:-translate-y-0.5",
                "hover-shine"
              )}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setActive(img.src);
                setOpen(true);
              }}
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-44">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <Lightbox open={open} onOpenChange={setOpen}>
        {active && (
          <Image
            src={active}
            alt="Active workflow"
            width={1280}
            height={800}
            className="w-full h-auto rounded-lg border"
            unoptimized
            priority
          />
        )}
      </Lightbox>
    </section>
  );
}