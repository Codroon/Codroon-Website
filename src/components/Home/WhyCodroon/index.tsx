"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Globe } from "./Globe";
import { TechMarquee } from "./TechMarquee";
import { DIFFERENTIATORS } from "./data";

/**
 * Why Codroon — asymmetric split: copy left, a revolving wireframe globe
 * right (lightweight SVG). id="why-codroon". The globe only spins while
 * in view and never under reduced motion. Below the split, a marquee of
 * the real stack framed as "tools we build with".
 */
export function WhyCodroon() {
  const reduced = usePrefersReducedMotion();
  const globeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(globeRef, { amount: 0.2 });

  return (
    <Section id="why-codroon" containerWidth="wide">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy — left */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Why Codroon</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-h2 mt-5 max-w-xl text-foreground">
            Why founders build with Codroon.
          </motion.h2>

          <div className="mt-10 flex flex-col gap-8">
            {DIFFERENTIATORS.map((d, i) => (
              <motion.div key={d.title} variants={fadeUp} className="flex gap-5">
                {/* numerals are not actions — accent-dim, never accent */}
                <span className="text-mono mt-1 text-sm text-accent-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-xl font-semibold text-foreground">
                    {d.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                    {d.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Globe — right */}
        <div
          ref={globeRef}
          className="mx-auto aspect-square w-full max-w-[340px] lg:max-w-[460px]"
        >
          <Globe spin={inView && !reduced} />
        </div>
      </div>

      {/* "Right tools" proof — marquee */}
      <div className="mt-20">
        <p className="text-eyebrow mb-6 text-muted-foreground">Tools we build with</p>
        <TechMarquee />
      </div>
    </Section>
  );
}

export default WhyCodroon;