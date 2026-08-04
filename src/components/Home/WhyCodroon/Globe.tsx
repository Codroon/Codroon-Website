"use client";
import { motion, useTime, useTransform, type MotionValue } from "framer-motion";

/**
 * Globe — a lightweight SVG wireframe globe (NOT a solar system).
 * Latitude rings are static; longitude meridians revolve by animating
 * their horizontal radius from a shared time value, simulating the
 * sphere spinning on its vertical axis. Pure SVG → instant load, smooth
 * GPU-friendly motion, no heavy dependency.
 *
 * `spin=false` (off-screen or reduced motion) → static wireframe.
 * Decorative → aria-hidden by the parent.
 */

const SPEED = (2 * Math.PI) / 16000; // one revolution / 16s
const MERIDIANS = 6;
/** rendered size of each logomark node, in viewBox units */
const MARK = 26;
const LAT_FRACTIONS = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
const r2 = (n: number) => Math.round(n * 100) / 100;

export function Globe({ spin, size = 320 }: { spin: boolean; size?: number }) {
  const time = useTime();
  const c = size / 2;
  const R = size * 0.38;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      aria-hidden
      role="presentation"
    >
      {/* soft glow */}
      <circle
        cx={c}
        cy={c}
        r={R * 0.82}
        fill="var(--accent)"
        opacity={0.08}
        style={{ filter: "blur(34px)" }}
      />

      {/* sphere outline */}
      <circle cx={c} cy={c} r={R} fill="none" stroke="var(--accent)" strokeWidth={1.2} opacity={0.45} />

      {/* latitude rings (static) */}
      {LAT_FRACTIONS.map((f, i) => {
        const dy = f * R;
        const rx = r2(Math.sqrt(Math.max(0, R * R - dy * dy)));
        const ry = r2(rx * 0.22);
        return (
          <ellipse
            key={i}
            cx={c}
            cy={r2(c + dy)}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={0.8}
            opacity={0.28}
          />
        );
      })}

      {/* longitude meridians (revolving) */}
      {Array.from({ length: MERIDIANS }).map((_, k) => (
        <Meridian
          key={k}
          time={time}
          offset={(k * Math.PI) / MERIDIANS}
          spin={spin}
          R={R}
          c={c}
        />
      ))}

      {/* connection nodes — the Codroon logomark (client, 2026-08-02:
          the mark replaces the plain dots), pulsing like the dots did */}
      {[
        { x: c - 30, y: c - 42 },
        { x: c + 44, y: c - 8 },
        { x: c + 8, y: c + 46 },
      ].map((d, i) => (
        <motion.image
          key={i}
          href="/images/codroon-mark.svg"
          x={d.x - MARK / 2}
          y={d.y - MARK / 2}
          width={MARK}
          height={MARK}
          initial={{ opacity: 0.7 }}
          animate={spin ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.7 }}
          transition={spin ? { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 } : { duration: 0 }}
        />
      ))}
    </svg>
  );
}

function Meridian({
  time,
  offset,
  spin,
  R,
  c,
}: {
  time: MotionValue<number>;
  offset: number;
  spin: boolean;
  R: number;
  c: number;
}) {
  const rx = useTransform(time, (t) => {
    const phase = spin ? t * SPEED : 0;
    return r2(Math.max(0.6, Math.abs(R * Math.cos(phase + offset))));
  });
  const opacity = useTransform(time, (t) => {
    const phase = spin ? t * SPEED : 0;
    return r2(0.16 + 0.5 * Math.abs(Math.cos(phase + offset)));
  });

  return (
    <motion.ellipse
      cx={c}
      cy={c}
      ry={R}
      rx={rx}
      style={{ opacity }}
      fill="none"
      stroke="var(--border-strong)"
      strokeWidth={1}
    />
  );
}

export default Globe;