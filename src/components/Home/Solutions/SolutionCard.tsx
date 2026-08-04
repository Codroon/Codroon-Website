"use client";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { ServiceAnimation } from "./animations";
import type { Service } from "./data";

const TILT = 6; // max degrees

export function SolutionCard({ service }: { service: Service }) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [hover, setHover] = useState(false);

  const interactive = isDesktop && !reduced;
  const active = (inView || hover) && !reduced;

  // 3D tilt toward cursor (desktop only)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * TILT * 2);
    rx.set(-ny * TILT * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
    setHover(false);
  };

  return (
    <motion.div variants={fadeUp} className={cn("h-full", service.place)}>
      <motion.div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={interactive ? { rotateX: srx, rotateY: sry, transformPerspective: 900 } : undefined}
        whileHover={interactive ? { y: -6 } : undefined}
        className={cn(
          "group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-surface p-6 transition-colors duration-300 sm:p-7",
          hover ? "border-[color-mix(in_srgb,var(--accent)_45%,var(--border))]" : "border-border"
        )}
      >
        {/* micro-animation */}
        <div
          className={cn(
            "pointer-events-none mb-6 w-full flex-1 transition-opacity duration-300",
            service.flagship ? "min-h-[200px]" : "min-h-[120px]",
            hover ? "opacity-100" : "opacity-90"
          )}
          aria-hidden
        >
          <ServiceAnimation service={service.key} active={active} />
        </div>

        {/* copy */}
        <div className="mt-auto">
          <h3 className="font-sans text-xl font-semibold text-foreground">
            {service.title}
          </h3>
          <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            {service.descriptor}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SolutionCard;