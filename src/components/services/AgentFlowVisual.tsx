/**
 * AgentFlowVisual — animated agent-flow diagram for the service hero:
 * trigger → agent (reasoning) → tools, with a verify loop back into
 * the agent and an output node. Nodes, edges and state transitions
 * built from brand tokens.
 *
 * Animation is CSS-only (afv-* classes in globals.css): fully
 * server-rendered, runs without JavaScript, and prefers-reduced-motion
 * freezes it into the complete static diagram. No scroll-gating, no
 * pinning. Decorative (aria-hidden) — the narrative lives in the page
 * copy.
 */

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  fill: "var(--muted-foreground)",
} as const;

export function AgentFlowVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="presentation">
        {/* ---------- trigger ---------- */}
        <text x="36" y="86" {...label}>
          trigger
        </text>
        <circle cx="60" cy="110" r="8" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle cx="60" cy="110" r="3" fill="var(--accent)" />

        {/* trigger → agent */}
        <line
          className="afv-flow"
          x1="72"
          y1="116"
          x2="176"
          y2="168"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />

        {/* ---------- agent core ---------- */}
        {/* pulse outline */}
        <rect
          className="afv-glow"
          x="174"
          y="134"
          width="178"
          height="118"
          rx="16"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <rect
          x="180"
          y="140"
          width="166"
          height="106"
          rx="13"
          fill="var(--surface-raised)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        <text x="202" y="168" {...label} fill="var(--foreground)" fontSize={13} letterSpacing="2">
          AGENT
        </text>
        {/* reasoning bars — middle one is the "plan" step */}
        <rect x="202" y="182" width="104" height="7" rx="3.5" fill="var(--surface-card)" />
        <rect x="202" y="198" width="84" height="7" rx="3.5" fill="var(--accent)" opacity="0.7" />
        <rect x="202" y="214" width="96" height="7" rx="3.5" fill="var(--surface-card)" />

        {/* ---------- agent → tools ---------- */}
        <line className="afv-link" x1="352" y1="168" x2="418" y2="112" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />
        <line className="afv-link afv-link-2" x1="352" y1="193" x2="418" y2="192" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />
        <line className="afv-link afv-link-3" x1="352" y1="218" x2="418" y2="272" stroke="var(--accent-dim)" strokeWidth="1.5" opacity="0.6" />

        {/* ---------- tools ---------- */}
        {[
          { y: 90, text: "crm" },
          { y: 170, text: "database" },
          { y: 250, text: "email" },
        ].map((t) => (
          <g key={t.text}>
            <rect
              x="418"
              y={t.y}
              width="112"
              height="44"
              rx="10"
              fill="var(--surface-card)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <circle cx="438" cy={t.y + 22} r="4" fill="var(--accent-dim)" />
            <text x="452" y={t.y + 27} {...label}>
              {t.text}
            </text>
          </g>
        ))}

        {/* ---------- agent → verify ---------- */}
        <line className="afv-flow" x1="263" y1="252" x2="263" y2="308" stroke="var(--border-strong)" strokeWidth="1.5" />

        {/* verify node */}
        <rect x="203" y="308" width="120" height="46" rx="10" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1.5" />
        <path d="M222 331l6 6 10-12" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="248" y="336" {...label}>
          verify
        </text>

        {/* verify loop back into the agent (re-plan) */}
        <path
          className="afv-flow"
          d="M203 331 C 128 331 128 193 174 193"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        <text x="96" y="288" {...label}>
          re-plan
        </text>

        {/* ---------- verify → output ---------- */}
        <line className="afv-flow" x1="323" y1="331" x2="418" y2="331" stroke="var(--border-strong)" strokeWidth="1.5" />
        <rect x="418" y="308" width="112" height="46" rx="10" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle cx="440" cy="331" r="8" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="440" cy="331" r="3" fill="var(--accent)" />
        <text x="456" y="336" {...label}>
          done
        </text>
      </svg>
    </div>
  );
}

export default AgentFlowVisual;
