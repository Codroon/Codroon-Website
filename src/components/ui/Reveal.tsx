"use client";
import { motion } from "framer-motion";
import { fadeUp, revealOnScroll } from "@/lib/motion";
import { useRevealArmed } from "@/hooks/useRevealArmed";
import type { ReactNode } from "react";

/**
 * Reveal — fade-up a block once as it scrolls into view.
 *
 * The server renders a plain div, so the content is visible in the HTML
 * and survives the client bundle failing to load or run. The motion
 * version takes over before the first client paint. See
 * useRevealArmed for why the element is swapped rather than the prop
 * flipped.
 *
 * The old doc comment here claimed "First SSR paint renders the content
 * in place", which was not true: framer wrote opacity:0 into the SSR
 * markup and it stayed there without JavaScript.
 *
 * MotionConfig reducedMotion="user" (Providers) degrades this to
 * opacity-only under reduced motion.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const armed = useRevealArmed();

  if (!armed) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} {...revealOnScroll} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export default Reveal;
