"use client";
import { motion } from "framer-motion";
import { fadeUp, revealOnScroll } from "@/lib/motion";
import type { ReactNode } from "react";

/**
 * Reveal — fade-up a block once as it scrolls into view. Client-side
 * enhancement only; MotionConfig reducedMotion="user" (Providers)
 * degrades it to opacity-only under reduced motion. First SSR paint
 * renders the content in place.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} {...revealOnScroll} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export default Reveal;
