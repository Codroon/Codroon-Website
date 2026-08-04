"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * CountUp — a stat figure that counts from 0 to its real value the
 * first time it scrolls into view, then stays put. Used by the orange
 * Stats strip, the testimonial stat cards and the product-page stats
 * band (client, 2026-08-02).
 *
 * Figures arrive as display strings ("$300K+", "99%", "4"); only the
 * numeric middle animates, prefix/suffix render throughout. The final
 * string is server-rendered and always present (it is what screen
 * readers, no-JS visitors and crawlers get); the count is a purely
 * decorative aria-hidden overlay, and the real value reserves the box
 * so rows never wiggle mid-count.
 *
 * prefers-reduced-motion → no animation, the value just shows.
 */

/** "$300K+" → { prefix "$", num 300, suffix "K+" } — null if no number. */
function parseFigure(raw: string) {
  const m = raw.match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
  if (!m) return null;
  const num = parseFloat(m[2].replace(/,/g, ""));
  if (!Number.isFinite(num)) return null;
  // keep the source's own thousands-separator convention while counting
  const grouped = m[2].includes(",");
  return { prefix: m[1], num, suffix: m[3], grouped };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  duration = 1600,
  className,
}: {
  /** the finished figure, exactly as it should read at rest */
  value: string;
  /** ms from first paint in view to settling on the real figure */
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  // null = at rest (server markup, reduced motion, and after settling)
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const parsed = parseFigure(value);
    if (!inView || reduced || !parsed) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const n = Math.round(parsed.num * easeOutCubic(p));
      if (p < 1) {
        const digits = parsed.grouped ? n.toLocaleString("en-US") : String(n);
        setDisplay(`${parsed.prefix}${digits}${parsed.suffix}`);
        raf = requestAnimationFrame(tick);
      } else {
        // settle on the exact source string, never a reformatting of it
        setDisplay(null);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  if (!parseFigure(value)) {
    // nothing numeric to animate — render as-is
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {/* the real figure — reserves final width, carries the a11y text */}
      <span className={display !== null ? "opacity-0" : undefined}>{value}</span>
      {display !== null && (
        <span aria-hidden className="absolute inset-0">
          {display}
        </span>
      )}
    </span>
  );
}

export default CountUp;
