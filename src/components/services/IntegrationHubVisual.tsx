/**
 * IntegrationHubVisual — hero diagram for the AI-integration service
 * page: hub and spoke — the systems a business already runs (labels
 * straight from the deck subhead) connecting to a central AI core.
 * Brand tokens only; abstract shapes, no fabricated values.
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

/* chip width sized to its label (mono ≈7.2px/char + icon dot + padding) */
const SYSTEMS = [
  { x: 74, y: 84, w: 78, text: "crm", link: "" },
  { x: 380, y: 62, w: 112, text: "helpdesk", link: "afv-link-2" },
  { x: 416, y: 196, w: 112, text: "database", link: "afv-link-3" },
  { x: 344, y: 330, w: 120, text: "warehouse", link: "" },
  { x: 92, y: 312, w: 152, text: "internal tools", link: "afv-link-2" },
];

const CHIP_H = 44;

export function IntegrationHubVisual() {
  const cx = 268;
  const cy = 206;
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="presentation">
        {/* spokes — staggered pulses from systems to the core */}
        {SYSTEMS.map((s) => (
          <line
            key={`l-${s.text}`}
            className={`afv-link ${s.link}`}
            x1={s.x + s.w / 2}
            y1={s.y + CHIP_H / 2}
            x2={cx}
            y2={cy}
            stroke="var(--accent-dim)"
            strokeWidth="1.5"
            opacity="0.6"
          />
        ))}

        {/* core */}
        <circle
          className="afv-glow"
          cx={cx}
          cy={cy}
          r="34"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle cx={cx} cy={cy} r="22" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="9" fill="var(--accent)" />

        {/* system chips */}
        {SYSTEMS.map((s) => (
          <g key={s.text}>
            <rect
              x={s.x}
              y={s.y}
              width={s.w}
              height={CHIP_H}
              rx="10"
              fill="var(--surface-card)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <circle cx={s.x + 20} cy={s.y + CHIP_H / 2} r="4" fill="var(--accent-dim)" />
            <text x={s.x + 34} y={s.y + CHIP_H / 2 + 4} {...label}>
              {s.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default IntegrationHubVisual;
