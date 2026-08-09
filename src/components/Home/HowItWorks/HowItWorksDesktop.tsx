"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaButton } from "@/components/contact/CtaButton";
import { easeOutExpo } from "@/lib/motion";
import { STEPS } from "./data";

// heavy, below-the-fold decorative visual -> lazy, client-only
const NodeGraph = dynamic(
  () => import("./NodeGraph").then((m) => m.NodeGraph),
  { ssr: false }
);

/**
 * Desktop "How It Works" - 300vh outer section with a pinned 100vh
 * stage. Scroll progress (0->1) drives the node graph + rail via motion
 * values (no setState on scroll). The text steps switch on a discrete
 * active index and cross-fade with AnimatePresence (mode="wait") so
 * exactly one step is ever mounted - no overlap.
 *
 * BUG FIX: the active step is synced from scrollYProgress.get() on
 * mount (and on every change), not only on scroll events. Previously,
 * loading or hydrating anywhere inside/past the section left step 01
 * frozen on the stage until the next scroll event — which read as
 * "steps 02/03 never render".
 */
export function HowItWorksDesktop() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  useEffect(() => {
    const toIndex = (v: number) => (v < 0.34 ? 0 : v < 0.66 ? 1 : 2);
    // sync immediately (covers loading mid-section / hydration swap) …
    setActive(toIndex(scrollYProgress.get()));
    // … then follow scroll
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = toIndex(v);
      setActive((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [scrollYProgress]);

  const step = STEPS[active];

  return (
    <section id="how-it-works" ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container width="wide">
          <div className="grid grid-cols-12 items-center gap-x-8">
            <div className="col-span-1 flex justify-center">
              <Rail progress={scrollYProgress} active={active} />
            </div>

            <div className="col-span-5">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="text-h2 mt-5 text-foreground">
                From first call to shipped in three steps.
              </h2>

              <div className="relative mt-14 min-h-[320px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -22 }}
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                  >
                    {/* Numerals are informative: 4.5:1, not --accent-dim. */}
                    <span className="text-mono block text-5xl text-muted-foreground">
                      {step.n}
                    </span>
                    <h3 className="text-h3 mt-4 text-foreground">{step.title}</h3>
                    <p className="text-body-lg mt-4 max-w-md text-muted-foreground">
                      {step.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <EndCta active={active} />
            </div>

            <div className="col-span-6 flex items-center justify-center">
              <div className="h-[64vh] max-h-[620px] w-full">
                <NodeGraph progress={scrollYProgress} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function EndCta({ active }: { active: number }) {
  const show = active === 2;
  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="mt-12"
      aria-hidden={!show}
    >
      <CtaButton size="lg" tabIndex={show ? 0 : -1}>
        Book your free discovery call
        <ArrowRight className="size-[1.1em]" aria-hidden />
      </CtaButton>
    </motion.div>
  );
}

function Rail({
  progress,
  active,
}: {
  progress: MotionValue<number>;
  active: number;
}) {
  return (
    <div className="relative h-[280px] w-px bg-border">
      <motion.div
        className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
        style={{ scaleY: progress }}
      />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ top: `${i * 50}%` }}
          className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-all duration-300 ${
            active >= i ? "scale-125 bg-accent" : "scale-100 bg-border"
          }`}
        />
      ))}
    </div>
  );
}

export default HowItWorksDesktop;
