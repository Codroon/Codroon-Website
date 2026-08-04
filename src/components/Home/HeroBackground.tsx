"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * HeroBackground — atmospheric, restrained backdrop for the hero:
 *  - animated film-grain overlay (CSS)
 *  - one slow-drifting accent glow (single accent — no second hue)
 *  - a masked dot-grid that parallaxes toward the cursor
 *
 * All motion is gated by usePrefersReducedMotion; the global CSS
 * reduced-motion rule also freezes the keyframe animations.
 */
export function HeroBackground() {
  const reduced = usePrefersReducedMotion();

  // pointer position, normalised to roughly -1..1 around screen centre
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  // depth: grid drifts gently, glow drifts more, opposite direction
  const gridX = useTransform(sx, [-1, 1], [-12, 12]);
  const gridY = useTransform(sy, [-1, 1], [-12, 12]);
  const glowX = useTransform(sx, [-1, 1], [28, -28]);
  const glowY = useTransform(sy, [-1, 1], [22, -22]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Glow — drifts via CSS keyframes, parallax via motion transform */}
      <motion.div
        style={reduced ? undefined : { x: glowX, y: glowY }}
        className="hero-glow hero-glow--accent absolute right-[-8%] top-[4%] h-[40rem] w-[40rem] opacity-50"
      />

      {/* Dot grid */}
      <motion.div
        style={reduced ? undefined : { x: gridX, y: gridY }}
        className="hero-dotgrid"
      />

      {/* Grain */}
      <div className="hero-grain" />

      {/* Soft top + bottom vignette to settle the type over the glow */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-background/40 via-transparent to-background" />
    </div>
  );
}

export default HeroBackground;
