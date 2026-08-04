/**
 * RetrievalFlowVisual — hero diagram for the generative-AI service
 * page: a retrieval pipeline — document → chunks → embedding →
 * ranked results. Brand tokens only; abstract shapes, no fabricated
 * values (result rows are bars, not numbers).
 *
 * Same contract as AgentFlowVisual: CSS-only animation (afv-* classes),
 * fully server-rendered, readable with JavaScript disabled, static
 * under prefers-reduced-motion, no scroll-gating. Decorative
 * (aria-hidden).
 */

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  fill: "var(--muted-foreground)",
} as const;

export function RetrievalFlowVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="presentation">
        {/* ---------- document ---------- */}
        <text x="34" y="122" {...label}>
          document
        </text>
        <rect
          x="34"
          y="140"
          width="118"
          height="150"
          rx="10"
          fill="var(--surface-raised)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        <rect x="50" y="158" width="70" height="8" rx="4" fill="var(--surface-card)" />
        <rect x="50" y="176" width="86" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="50" y="192" width="78" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="50" y="208" width="84" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="50" y="224" width="64" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="50" y="248" width="80" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="50" y="264" width="72" height="6" rx="3" fill="var(--surface-card)" />

        {/* document → chunks */}
        <line
          className="afv-flow"
          x1="152"
          y1="215"
          x2="204"
          y2="215"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />

        {/* ---------- chunks ---------- */}
        <text x="212" y="122" {...label}>
          chunks
        </text>
        {[150, 196, 242].map((y) => (
          <g key={y}>
            <rect
              x="212"
              y={y}
              width="92"
              height="34"
              rx="8"
              fill="var(--surface-card)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <rect x="224" y={y + 13} width="56" height="6" rx="3" fill="var(--surface-raised)" />
          </g>
        ))}

        {/* chunks → embedding (staggered) */}
        <line className="afv-link" x1="304" y1="167" x2="360" y2="206" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />
        <line className="afv-link afv-link-2" x1="304" y1="213" x2="360" y2="214" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />
        <line className="afv-link afv-link-3" x1="304" y1="259" x2="360" y2="222" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />

        {/* ---------- embedding ---------- */}
        <text x="336" y="176" {...label}>
          embedding
        </text>
        <circle
          className="afv-glow"
          cx="372"
          cy="215"
          r="19"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle cx="372" cy="215" r="10" fill="var(--accent)" />

        {/* embedding → results */}
        <line
          className="afv-flow"
          x1="391"
          y1="215"
          x2="418"
          y2="215"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />

        {/* ---------- ranked results ---------- */}
        <text x="418" y="122" {...label}>
          ranked results
        </text>
        <rect
          x="418"
          y="140"
          width="118"
          height="150"
          rx="10"
          fill="var(--surface-raised)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        {/* top match — accent highlighted */}
        <rect x="430" y="154" width="94" height="32" rx="7" fill="var(--accent)" opacity="0.25" />
        <rect x="440" y="167" width="58" height="6" rx="3" fill="var(--accent)" opacity="0.85" />
        {/* lower matches — decreasing relevance bars */}
        <rect x="430" y="196" width="94" height="32" rx="7" fill="var(--surface-card)" />
        <rect x="440" y="209" width="44" height="6" rx="3" fill="var(--surface-raised)" />
        <rect x="430" y="238" width="94" height="32" rx="7" fill="var(--surface-card)" />
        <rect x="440" y="251" width="32" height="6" rx="3" fill="var(--surface-raised)" />
      </svg>
    </div>
  );
}

export default RetrievalFlowVisual;
