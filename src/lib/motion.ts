import type { Variants, Transition } from "framer-motion";

/* ============================================================
   Motion tokens — Framer Motion primitives for the whole site.
   Signature section animations live in later prompts; these are
   the shared building blocks.
   ============================================================ */

/* ---- Easings ---- */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const; // premium "out" feel
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/* ---- Durations (seconds) ---- */
export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  reveal: 0.8,
} as const;

/* ---- Shared transitions ---- */
export const transitionBase: Transition = {
  duration: duration.base,
  ease: easeOutExpo,
};

export const transitionReveal: Transition = {
  duration: duration.reveal,
  ease: easeOutExpo,
};

/* ---- Variants ---- */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionBase },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitionReveal },
};

/** Parent for staggered children. Pair with fadeUp/fadeIn on children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/* ---- Scroll-reveal preset ----
   Spread onto a motion element:
   <motion.div {...revealOnScroll} variants={fadeUp} />
*/
export const revealOnScroll = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-10%" },
};

/** Reduced-motion safe variant set: opacity only, no transforms. */
export const fadeInOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base } },
};