/**
 * MvpTimelineVisual — hero diagram for the MVP service page: a build
 * timeline progressing to launch. Milestones labelled from the deck's
 * own process steps (scope → foundation → weekly demos → launch), with
 * the product visibly growing above the line at each stop. Brand
 * tokens only; abstract shapes, no fabricated numbers.
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

export function MvpTimelineVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="presentation">
        {/* ---------- timeline ---------- */}
        <line
          className="afv-flow"
          x1="60"
          y1="310"
          x2="500"
          y2="310"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />

        {/* ---------- milestone 1: scope (a single cut-down bar) ---------- */}
        <circle cx="90" cy="310" r="6" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <text x="66" y="342" {...label}>
          scope
        </text>
        <rect x="58" y="252" width="64" height="28" rx="7" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="68" y="263" width="36" height="6" rx="3" fill="var(--surface-raised)" />

        {/* ---------- milestone 2: foundation (frame + two bars) ---------- */}
        <circle cx="210" cy="310" r="6" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <text x="172" y="342" {...label}>
          foundation
        </text>
        <rect x="168" y="216" width="84" height="64" rx="8" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1.5" />
        <line x1="168" y1="234" x2="252" y2="234" stroke="var(--border)" strokeWidth="1" />
        <circle cx="178" cy="225" r="2.5" fill="var(--border-strong)" />
        <rect x="178" y="244" width="52" height="6" rx="3" fill="var(--surface-raised)" />
        <rect x="178" y="258" width="40" height="6" rx="3" fill="var(--surface-raised)" />

        {/* ---------- milestone 3: weekly demos (frame filling in) ---------- */}
        <circle cx="330" cy="310" r="6" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <text x="284" y="342" {...label}>
          weekly demos
        </text>
        <rect x="284" y="180" width="96" height="100" rx="9" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1.5" />
        <line x1="284" y1="200" x2="380" y2="200" stroke="var(--border)" strokeWidth="1" />
        <circle cx="295" cy="190" r="2.5" fill="var(--accent-dim)" />
        <rect x="295" y="210" width="60" height="6" rx="3" fill="var(--surface-raised)" />
        <rect x="295" y="224" width="72" height="6" rx="3" fill="var(--surface-raised)" />
        <rect x="295" y="238" width="52" height="6" rx="3" fill="var(--surface-raised)" />
        <rect x="295" y="254" width="40" height="16" rx="5" fill="var(--accent)" opacity="0.25" />

        {/* ---------- milestone 4: launch (the real product, accent) ---------- */}
        <circle
          className="afv-glow"
          cx="470"
          cy="310"
          r="14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle cx="470" cy="310" r="7" fill="var(--accent)" />
        <text x="446" y="342" {...label}>
          launch
        </text>
        <rect x="414" y="140" width="112" height="140" rx="10" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="414" y1="162" x2="526" y2="162" stroke="var(--border)" strokeWidth="1" />
        <circle cx="426" cy="151" r="2.5" fill="var(--accent)" />
        <circle cx="436" cy="151" r="2.5" fill="var(--border-strong)" />
        <rect x="426" y="174" width="66" height="7" rx="3.5" fill="var(--accent)" opacity="0.85" />
        <rect x="426" y="190" width="88" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="426" y="204" width="76" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="426" y="218" width="84" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="426" y="240" width="48" height="20" rx="6" fill="var(--accent)" opacity="0.25" />
        <rect x="482" y="240" width="32" height="20" rx="6" fill="var(--surface-card)" />
      </svg>
    </div>
  );
}

export default MvpTimelineVisual;
