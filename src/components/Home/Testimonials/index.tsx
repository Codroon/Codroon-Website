"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { easeOutExpo } from "@/lib/motion";
import { useRevealArmed } from "@/hooks/useRevealArmed";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Testimonials — full-bleed accent (brand orange) section, following
 * the reference: the featured quote sits DIRECTLY on the orange
 * surface (no card), small quote text, square pagination indicators
 * beneath it (no arrows), compact stat tiles on the right. All text
 * directly on the orange surface is #232220 (--accent-foreground).
 *
 * Quotes auto-advance every 7s (client, 2026-08-02), same contract as
 * the product slider: pause on hover AND focus, no autoplay under
 * reduced motion, dots stay directly clickable. The stat tiles count
 * up on first view.
 *
 * DUMMY COPY WARNING: the four testimonials are placeholder drafts so
 * the design can be reviewed — replace with real client testimonials
 * before launch. The four stat figures are client-supplied.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

// DUMMY — replace with real client testimonials before launch.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Codroon took us from a rough idea to a working MVP our first customers actually paid for, in five weeks. The weekly demos kept us honest and the plan never drifted.",
    name: "Sarah K.",
    role: "Founder",
    company: "fintech startup",
  },
  {
    quote:
      "They integrated an AI agent into our support stack without ripping anything out. Tickets that took hours now clear in minutes.",
    name: "Marcus T.",
    role: "Head of Operations",
    company: "e-commerce brand",
  },
  {
    quote:
      "The discovery call alone was worth it. We walked away with a plan we could have taken anywhere. We chose to build it with them.",
    name: "Alina R.",
    role: "Product Lead",
    company: "healthcare SaaS",
  },
  {
    quote:
      "Fast without being sloppy. We own the code, the docs are clean, and nothing broke when we scaled.",
    name: "David M.",
    role: "CTO",
    company: "logistics startup",
  },
];

// Client-supplied figures for this section.
const STAT_CARDS = [
  { value: "100+", label: "projects delivered" },
  { value: "99%", label: "client satisfaction" },
  { value: "4+", label: "years of experience" },
  { value: "40+", label: "technologies we work with" },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const armed = useRevealArmed();
  const count = TESTIMONIALS.length;

  const autoplay = !reduced && !paused && count > 1;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [autoplay, count]);

  if (count === 0) return null;

  const t = TESTIMONIALS[index];

  return (
    <section id="testimonials" className="bg-accent py-24 sm:py-32">
      <Container width="wide">
        <p className="text-eyebrow text-accent-foreground">Testimonials</p>
        <h2 className="text-h2 mt-5 max-w-2xl text-accent-foreground">
          What clients say.
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Featured quote — directly on the orange surface, no card.
              Hover or keyboard focus anywhere in this column holds the
              current quote. */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div
              aria-live={autoplay ? "off" : "polite"}
              className="min-h-[170px] sm:min-h-[150px]"
            >
              <AnimatePresence mode="wait">
                {/* initial={false} until the client is up: framer
                    serialises `initial` into the SSR markup, so the
                    first quote shipped with opacity:0 and stayed
                    invisible whenever the bundle did not run. Slide
                    CHANGES still animate, because each new key mounts
                    fresh once armed, and the first slide is the only
                    one that ever rendered on the server. */}
                <motion.figure
                  key={index}
                  initial={armed ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                >
                  <blockquote className="text-body max-w-xl text-accent-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-[0.9rem] text-accent-foreground">
                    <span className="font-semibold">{t.name}</span>
                    {", "}
                    {t.role}, {t.company}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Square pagination indicators.
                NOT role="tablist". It was, and the pattern was
                incomplete in every way that matters: role="tab"
                requires each tab to own a tabpanel via aria-controls,
                the panel needs role="tabpanel", and the set needs
                arrow-key roving focus. None of that existed, so a
                screen reader announced "tab 1 of 4" and then arrow keys
                did nothing, which is worse than no pattern at all
                (client, 2026-08-09).

                A carousel's dots are just buttons that change what is
                shown. aria-current marks the active one, the quote
                region above already carries aria-live, and Tab moves
                between them the way it does for any button. */}
            <div className="mt-8 flex items-center" role="group" aria-label="Choose a testimonial">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Show testimonial ${i + 1} of ${count}`}
                  onClick={() => setIndex(i)}
                  className="flex h-11 w-8 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground"
                >
                  <span
                    aria-hidden
                    className={`block h-2.5 w-2.5 rounded-[2px] transition-colors duration-200 ${
                      i === index
                        ? "bg-accent-foreground"
                        : "bg-accent-foreground/35 hover:bg-accent-foreground/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Stat tiles — compact */}
          <ul className="grid grid-cols-2 gap-4">
            {STAT_CARDS.map((s) => (
              <li
                key={s.label}
                className="flex flex-col justify-center rounded-[var(--radius-md)] bg-surface px-5 py-4"
              >
                <span className="text-mono text-2xl text-foreground sm:text-3xl">
                  <CountUp value={s.value} />
                </span>
                <span className="mt-1 text-[0.85rem] text-muted-foreground">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
