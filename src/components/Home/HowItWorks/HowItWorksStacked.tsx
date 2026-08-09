"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaButton } from "@/components/contact/CtaButton";
import { easeOutExpo } from "@/lib/motion";
import { STEPS } from "./data";
import { PhaseGlyph } from "./PhaseGlyph";

/**
 * Stacked "How It Works" — used on mobile and for reduced motion (and
 * as the SSR first paint, so the narrative copy is always in the
 * server-rendered HTML). A vertical stack of step cards. With motion,
 * each card fades up on enter (once); with `reduced`, it's a clean
 * static layout. All copy is real DOM text in every state.
 */
export function HowItWorksStacked({ reduced }: { reduced: boolean }) {
  return (
    <Section id="how-it-works" containerWidth="default">
      <Eyebrow>How it works</Eyebrow>
      <h2 className="text-h2 mt-5 max-w-2xl text-foreground">
        From first call to shipped — in three steps.
      </h2>

      <div className="mt-12 flex flex-col gap-5">
        {STEPS.map((step, i) => {
          const reveal = reduced
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-10%" },
                transition: { duration: 0.6, ease: easeOutExpo, delay: i * 0.05 },
              };
          return (
            <motion.div
              key={step.n}
              {...reveal}
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8"
            >
              <div className="flex items-start gap-5">
                {/* Numerals are informative: 4.5:1, not --accent-dim. */}
                <span className="text-mono text-3xl text-muted-foreground">{step.n}</span>
                <div aria-hidden className="h-16 w-20 shrink-0">
                  <PhaseGlyph phase={step.phase} />
                </div>
              </div>
              <h3 className="text-h3 mt-5 text-foreground">{step.title}</h3>
              <p className="text-body mt-3 text-muted-foreground">{step.body}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10">
        <CtaButton size="lg">
          Book your free discovery call
          <ArrowRight className="size-[1.1em]" aria-hidden />
        </CtaButton>
      </div>
    </Section>
  );
}

export default HowItWorksStacked;
