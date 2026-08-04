"use client";
import { motion } from "framer-motion";
import type { ServiceKey } from "./data";

/**
 * Per-service micro-animations. Each demonstrates the service and only
 * loops when `active` (card is in view / hovered). When inactive they
 * render a meaningful static end-state — which is also what reduced
 * motion users see (the global reduced-motion rule freezes loops).
 * All decorative → the parent marks them aria-hidden.
 *
 * Every motion element gets an explicit `initial` so SSR renders
 * concrete attribute values (no "undefined"/hydration mismatches), and
 * computed coordinates are rounded so server and client serialize the
 * same string.
 */

const A = "var(--accent)";
const C = "var(--accent-dim)";
const SURF = "var(--surface-2)";
const BORD = "var(--border)";

type Props = { active: boolean };

const loop = (active: boolean, duration: number, delay = 0) =>
  active
    ? { duration, repeat: Infinity, ease: "easeInOut" as const, delay }
    : { duration: 0 };

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---------- SaaS: app interface assembling itself ---------- */
function SaaS({ active }: Props) {
  const bars = [
    { y: 52, w: 70 },
    { y: 68, w: 110 },
    { y: 84, w: 90 },
  ];
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden>
      <rect x="20" y="20" width="180" height="112" rx="10" fill={SURF} stroke={BORD} />
      <circle cx="34" cy="34" r="3" fill={A} />
      <circle cx="44" cy="34" r="3" fill={BORD} />
      <circle cx="54" cy="34" r="3" fill={BORD} />
      <line x1="20" y1="44" x2="200" y2="44" stroke={BORD} />
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x="34"
          y={b.y}
          width={b.w}
          height="7"
          rx="3.5"
          fill={i === 0 ? A : BORD}
          style={{ transformOrigin: "34px center", transformBox: "fill-box" }}
          initial={{ scaleX: 1, opacity: 1 }}
          animate={active ? { scaleX: [0, 1, 1, 0], opacity: [0.4, 1, 1, 0.4] } : { scaleX: 1, opacity: 1 }}
          transition={loop(active, 4, i * 0.4)}
        />
      ))}
      <motion.rect
        x="34" y="104" width="46" height="16" rx="5" fill={A}
        initial={{ opacity: 0.9 }}
        animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.9 }}
        transition={loop(active, 3)}
      />
      <rect x="88" y="104" width="46" height="16" rx="5" fill={SURF} stroke={BORD} />
    </svg>
  );
}

/* ---------- AI Integration: tokens stream model → product ---------- */
function Integration({ active }: Props) {
  const tokens = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden>
      <circle cx="40" cy="75" r="20" fill="none" stroke={C} strokeWidth="1.5" />
      <circle cx="40" cy="75" r="9" fill={C} opacity="0.8" />
      <motion.rect
        x="140" y="44" width="60" height="62" rx="8" fill={SURF} stroke={A}
        initial={{ opacity: 0.9 }}
        animate={active ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.9 }}
        transition={loop(active, 2)}
      />
      <rect x="150" y="56" width="34" height="5" rx="2.5" fill={A} opacity="0.8" />
      <rect x="150" y="68" width="40" height="4" rx="2" fill={BORD} />
      <rect x="150" y="78" width="30" height="4" rx="2" fill={BORD} />
      {tokens.map((t) => (
        <motion.circle
          key={t} cy="75" r="3.5" fill={A}
          initial={{ cx: 60, opacity: 0 }}
          animate={active ? { cx: [60, 140], opacity: [0, 1, 1, 0] } : { cx: 60, opacity: 0 }}
          transition={loop(active, 1.8, t * 0.45)}
        />
      ))}
    </svg>
  );
}

/* ---------- AI Automation: pulse along a pipeline ---------- */
function Automation({ active }: Props) {
  const nodes = [40, 90, 140, 190];
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden>
      <line x1="40" y1="75" x2="190" y2="75" stroke={BORD} strokeWidth="2" />
      {nodes.map((x, i) => (
        <motion.circle
          key={x} cx={x} cy="75" r="8" fill={SURF} stroke={BORD} strokeWidth="1.5"
          initial={{ stroke: BORD, fill: SURF }}
          animate={active ? { stroke: [BORD, A, BORD], fill: [SURF, A, SURF] } : { stroke: BORD, fill: SURF }}
          transition={loop(active, 3, i * 0.5)}
        />
      ))}
      <motion.circle
        cy="75" r="4" fill={A}
        initial={{ cx: 40, opacity: 0 }}
        animate={active ? { cx: [40, 190], opacity: [0, 1, 1, 0] } : { cx: 40, opacity: 0 }}
        transition={loop(active, 3)}
      />
      <text x="40" y="100" fill={BORD} fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">trigger</text>
      <text x="190" y="100" fill={BORD} fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">done</text>
    </svg>
  );
}

/* ---------- AI Agents: pulsing core spawns orbiting tasks ---------- */
function Agents({ active }: Props) {
  const orbits = [0, 120, 240];
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden>
      <motion.circle
        cx="110" cy="75" fill="none" stroke={A} strokeWidth="1.5"
        initial={{ r: 18, opacity: 0.6 }}
        animate={active ? { r: [16, 22, 16], opacity: [0.8, 0.3, 0.8] } : { r: 18, opacity: 0.6 }}
        transition={loop(active, 2.4)}
      />
      <circle cx="110" cy="75" r="9" fill={A} />
      <motion.g
        style={{ transformOrigin: "110px 75px" }}
        initial={{ rotate: 0 }}
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={active ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      >
        {orbits.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = r2(110 + Math.cos(rad) * 48);
          const y = r2(75 + Math.sin(rad) * 40);
          return <circle key={deg} cx={x} cy={y} r="6" fill={SURF} stroke={C} strokeWidth="1.5" />;
        })}
      </motion.g>
    </svg>
  );
}

/* ---------- Integrations & APIs: hub snaps to endpoints ---------- */
function Apis({ active }: Props) {
  const ends = [
    { x: 40, y: 40 },
    { x: 180, y: 40 },
    { x: 40, y: 110 },
    { x: 180, y: 110 },
  ];
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" aria-hidden>
      {ends.map((e, i) => (
        <g key={i}>
          <motion.line
            x1="110" y1="75" x2={e.x} y2={e.y} stroke={A} strokeWidth="1.5"
            initial={{ pathLength: 1, opacity: 0.5 }}
            animate={active ? { pathLength: [0, 1], opacity: [0, 0.8, 0.8] } : { pathLength: 1, opacity: 0.5 }}
            transition={loop(active, 2.6, i * 0.3)}
          />
          <rect x={e.x - 10} y={e.y - 8} width="20" height="16" rx="4" fill={SURF} stroke={BORD} strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="110" cy="75" r="14" fill={SURF} stroke={A} strokeWidth="1.5" />
      <circle cx="110" cy="75" r="5" fill={A} />
    </svg>
  );
}

const MAP: Record<ServiceKey, (p: Props) => React.ReactElement> = {
  saas: SaaS,
  integration: Integration,
  automation: Automation,
  agents: Agents,
  apis: Apis,
};

export function ServiceAnimation({
  service,
  active,
}: {
  service: ServiceKey;
  active: boolean;
}) {
  const Comp = MAP[service];
  return <Comp active={active} />;
}

export default ServiceAnimation;