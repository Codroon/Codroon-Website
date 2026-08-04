/**
 * ModularBlocksVisual — hero diagram for the custom-software page:
 * loose modules assembling into one system. Scattered blocks on the
 * left flow into a slotted frame on the right; one slot still open,
 * its module on the way. Brand tokens only; abstract shapes.
 *
 * Same contract as the other hero visuals: CSS-only animation (afv-*),
 * fully server-rendered, readable with JavaScript disabled, static
 * under prefers-reduced-motion, no scroll-gating. Decorative
 * (aria-hidden).
 */

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  fill: "var(--muted-foreground)",
} as const;

export function ModularBlocksVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="presentation">
        {/* ---------- loose modules ---------- */}
        <text x="46" y="92" {...label}>
          modules
        </text>
        <g transform="rotate(-4 90 140)">
          <rect x="52" y="112" width="76" height="52" rx="8" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="64" y="128" width="42" height="6" rx="3" fill="var(--surface-raised)" />
          <rect x="64" y="142" width="30" height="5" rx="2.5" fill="var(--surface-raised)" />
        </g>
        <g transform="rotate(3 110 250)">
          <rect x="70" y="222" width="76" height="52" rx="8" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="82" y="238" width="42" height="6" rx="3" fill="var(--surface-raised)" />
          <rect x="82" y="252" width="30" height="5" rx="2.5" fill="var(--surface-raised)" />
        </g>
        {/* the module in transit — accent, headed for the open slot */}
        <g transform="rotate(-2 130 340)">
          <rect x="92" y="318" width="76" height="52" rx="8" fill="var(--surface-raised)" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="104" y="334" width="42" height="6" rx="3" fill="var(--accent)" opacity="0.6" />
          <rect x="104" y="348" width="30" height="5" rx="2.5" fill="var(--surface-card)" />
        </g>

        {/* flows into the system */}
        <line className="afv-flow" x1="132" y1="140" x2="252" y2="166" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line className="afv-flow" x1="150" y1="248" x2="252" y2="238" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line className="afv-link" x1="170" y1="340" x2="286" y2="310" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />

        {/* ---------- the system ---------- */}
        <text x="252" y="92" {...label}>
          your system
        </text>
        <rect
          className="afv-glow"
          x="246"
          y="104"
          width="268"
          height="278"
          rx="16"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <rect
          x="252"
          y="110"
          width="256"
          height="266"
          rx="13"
          fill="var(--surface-raised)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        {/* title bar */}
        <line x1="252" y1="138" x2="508" y2="138" stroke="var(--border)" strokeWidth="1" />
        <circle cx="268" cy="124" r="3" fill="var(--accent)" />
        <circle cx="280" cy="124" r="3" fill="var(--border-strong)" />

        {/* filled slots */}
        {[
          { x: 268, y: 152 },
          { x: 388, y: 152 },
          { x: 268, y: 226 },
          { x: 388, y: 226 },
          { x: 388, y: 300 },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width="104" height="62" rx="8" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1" />
            <rect x={s.x + 14} y={s.y + 18} width="56" height="6" rx="3" fill="var(--surface-raised)" />
            <rect x={s.x + 14} y={s.y + 34} width="42" height="5" rx="2.5" fill="var(--surface-raised)" />
            {i === 0 && <circle cx={s.x + 88} cy={s.y + 16} r="3" fill="var(--accent-dim)" />}
          </g>
        ))}

        {/* the open slot — dashed, waiting for the accent module */}
        <rect
          x="268"
          y="300"
          width="104"
          height="62"
          rx="8"
          fill="none"
          stroke="var(--accent-dim)"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
      </svg>
    </div>
  );
}

export default ModularBlocksVisual;
