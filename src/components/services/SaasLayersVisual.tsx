/**
 * SaasLayersVisual — hero diagram for the SaaS service page: layered
 * multi-tenant architecture. Three tenant windows share one
 * application layer, one billing layer, and one database layer whose
 * rows are visibly isolated per tenant. Labels use the deck's own
 * vocabulary. Brand tokens only; abstract shapes, no fabricated
 * values.
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

const TENANTS = [
  { x: 62, dot: "var(--accent)", text: "tenant a", link: "" },
  { x: 222, dot: "var(--accent-dim)", text: "tenant b", link: "afv-link-2" },
  { x: 382, dot: "var(--border-strong)", text: "tenant c", link: "afv-link-3" },
];

function Layer({
  y,
  h,
  text,
  children,
}: {
  y: number;
  h: number;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <g>
      <rect
        x="90"
        y={y}
        width="380"
        height={h}
        rx="10"
        fill="var(--surface-raised)"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />
      <text x="108" y={y + 26} {...label}>
        {text}
      </text>
      {children}
    </g>
  );
}

export function SaasLayersVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="presentation">
        {/* ---------- tenants ---------- */}
        {TENANTS.map((t) => (
          <g key={t.text}>
            <rect
              x={t.x}
              y="36"
              width="116"
              height="64"
              rx="9"
              fill="var(--surface-card)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <circle cx={t.x + 14} cy="50" r="3" fill={t.dot} />
            <text x={t.x + 26} y="55" {...label}>
              {t.text}
            </text>
            <rect x={t.x + 14} y="70" width="70" height="6" rx="3" fill="var(--surface-raised)" />
            <rect x={t.x + 14} y="84" width="54" height="5" rx="2.5" fill="var(--surface-raised)" />
            {/* tenant → application */}
            <line
              className={`afv-link ${t.link}`}
              x1={t.x + 58}
              y1="100"
              x2={t.x + 58}
              y2="140"
              stroke="var(--accent-dim)"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>
        ))}

        {/* ---------- shared layers ---------- */}
        <Layer y={140} h={54} text="application">
          <rect x="240" y="158" width="120" height="7" rx="3.5" fill="var(--surface-card)" />
          <rect x="374" y="158" width="72" height="7" rx="3.5" fill="var(--surface-card)" />
        </Layer>

        <line className="afv-flow" x1="280" y1="194" x2="280" y2="216" stroke="var(--border-strong)" strokeWidth="1.5" />

        <Layer y={216} h={54} text="billing">
          <rect x="240" y="232" width="58" height="22" rx="6" fill="var(--accent)" opacity="0.25" />
          <rect x="312" y="232" width="58" height="22" rx="6" fill="var(--surface-card)" />
          <rect x="384" y="232" width="58" height="22" rx="6" fill="var(--surface-card)" />
        </Layer>

        <line className="afv-flow" x1="280" y1="270" x2="280" y2="292" stroke="var(--border-strong)" strokeWidth="1.5" />

        {/* database — row-level isolation per tenant */}
        <g>
          <rect
            className="afv-glow"
            x="84"
            y="286"
            width="392"
            height="100"
            rx="13"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <rect
            x="90"
            y="292"
            width="380"
            height="88"
            rx="10"
            fill="var(--surface-raised)"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
          />
          <text x="108" y="318" {...label}>
            database
          </text>
          {/* isolated row groups, one per tenant */}
          {TENANTS.map((t, i) => {
            const gx = 240 + i * 78;
            return (
              <g key={t.text}>
                <rect x={gx} y="306" width="64" height="60" rx="7" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1" />
                <circle cx={gx + 12} cy="318" r="2.5" fill={t.dot} />
                <rect x={gx + 10} y="330" width="44" height="5" rx="2.5" fill="var(--surface-raised)" />
                <rect x={gx + 10} y="342" width="36" height="5" rx="2.5" fill="var(--surface-raised)" />
                <rect x={gx + 10} y="354" width="40" height="5" rx="2.5" fill="var(--surface-raised)" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default SaasLayersVisual;
