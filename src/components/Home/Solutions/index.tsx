"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUp, easeOutExpo } from "@/lib/motion";
import { SolutionCard } from "./SolutionCard";
import { SERVICES, CALENDLY } from "./data";

/**
 * Solutions — a living bento grid of services unified by a
 * cursor-tracking spotlight. id="solutions" (navbar "Services" links
 * here). Responsive: bento on desktop, single column on mobile.
 * Spotlight + tilt are desktop-only; micro-animations run when a card
 * is in view (and intensify on hover). Reduced motion → static cards.
 */
export function Solutions() {
  const gridWrap = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // cursor spotlight → write CSS vars on the grid wrapper (no setState)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = gridWrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };

  return (
    <Section id="solutions" containerWidth="wide">
      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
        className="max-w-2xl"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>What we build</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="text-h2 mt-5 text-foreground"
        >
          Everything it takes to ship your product.
        </motion.h2>
      </motion.div>

      {/* Bento grid */}
      <div
        ref={gridWrap}
        onMouseMove={onMove}
        className="relative mt-14"
      >
        {/* cursor spotlight (desktop) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
          style={{
            background:
              "radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:[grid-auto-rows:minmax(220px,1fr)]"
        >
          {SERVICES.map((service) => (
            <SolutionCard key={service.key} service={service} />
          ))}
        </motion.div>
      </div>

      {/* Section-end CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
      >
        <span className="text-body-lg text-muted-foreground">
          Have a use case in mind?
        </span>
        <Button href={CALENDLY} target="_blank" rel="noopener noreferrer" variant="secondary">
          Book a discovery call
          <ArrowRight className="size-[1.1em]" aria-hidden />
        </Button>
      </motion.div>
    </Section>
  );
}

export default Solutions;