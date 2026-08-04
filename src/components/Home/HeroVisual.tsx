import { Bot, Plug, Rocket, type LucideIcon } from "lucide-react";

/**
 * HeroVisual — ONE compact dashboard mockup with three chip cards
 * placed fully OUTSIDE it. Each chip is linked by a connector that
 * starts flush at the dashboard's border (lines never run inside the
 * dashboard) and ends in a single orange node dot at the chip.
 * Brand tokens only; abstract bars, no fabricated numbers.
 *
 * Server-renderable (no client hooks), decorative (aria-hidden).
 * Swap the SVG for a real product screenshot when one exists.
 */

function Chip({
  icon: Icon,
  label,
  note,
  className,
}: {
  icon: LucideIcon;
  label: string;
  note: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface/95 py-2 pl-2.5 pr-3.5 shadow-lg shadow-black/40 backdrop-blur-sm ${className ?? ""}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-accent-dim">
        <Icon size={15} />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-[0.8rem] font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block whitespace-nowrap text-[0.72rem] text-muted-foreground">
          {note}
        </span>
      </span>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[520px]">
      <svg viewBox="0 0 560 480" className="h-auto w-full" role="presentation">
        {/* ============ the one (compact) dashboard ============ */}
        <rect
          x="130"
          y="140"
          width="330"
          height="240"
          rx="14"
          fill="var(--surface-raised)"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />

        {/* browser title bar */}
        <line x1="130" y1="168" x2="460" y2="168" stroke="var(--border)" strokeWidth="1" />
        <circle cx="148" cy="154" r="3.5" fill="var(--accent)" />
        <circle cx="162" cy="154" r="3.5" fill="var(--border-strong)" />
        <circle cx="176" cy="154" r="3.5" fill="var(--border-strong)" />
        <rect x="196" y="147" width="130" height="14" rx="7" fill="var(--surface-card)" />

        {/* sidebar */}
        <line x1="214" y1="168" x2="214" y2="380" stroke="var(--border)" strokeWidth="1" />
        <rect x="142" y="186" width="58" height="8" rx="4" fill="var(--accent)" opacity="0.8" />
        <rect x="142" y="208" width="48" height="7" rx="3.5" fill="var(--surface-card)" />
        <rect x="142" y="228" width="52" height="7" rx="3.5" fill="var(--surface-card)" />
        <rect x="142" y="248" width="44" height="7" rx="3.5" fill="var(--surface-card)" />

        {/* main: heading */}
        <rect x="232" y="184" width="100" height="9" rx="4.5" fill="var(--surface-card)" />
        <rect x="232" y="200" width="140" height="6" rx="3" fill="var(--surface-card)" opacity="0.7" />

        {/* stat tiles */}
        <rect x="232" y="220" width="98" height="50" rx="9" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1" />
        <rect x="244" y="232" width="38" height="7" rx="3.5" fill="var(--surface-raised)" />
        <rect x="244" y="248" width="60" height="5" rx="2.5" fill="var(--surface-raised)" />
        <rect x="344" y="220" width="98" height="50" rx="9" fill="var(--surface-card)" stroke="var(--border)" strokeWidth="1" />
        <rect x="356" y="232" width="38" height="7" rx="3.5" fill="var(--surface-raised)" />
        <rect x="356" y="248" width="60" height="5" rx="2.5" fill="var(--surface-raised)" />

        {/* content rows */}
        <rect x="232" y="288" width="210" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="232" y="306" width="186" height="6" rx="3" fill="var(--surface-card)" />
        <rect x="232" y="324" width="198" height="6" rx="3" fill="var(--surface-card)" />

        {/* actions */}
        <rect x="232" y="342" width="76" height="26" rx="7" fill="var(--accent)" opacity="0.25" />
        <rect x="320" y="342" width="88" height="26" rx="7" fill="var(--surface-card)" />

        {/* ============ connectors: dashboard border → chip ============ */}
        {/* lines START flush on the border and travel OUTWARD only;
            a single orange dot marks the chip end */}
        <g stroke="var(--border-strong)" strokeWidth="1.25" fill="none">
          {/* top edge → AI agents (top-left) */}
          <line x1="160" y1="140" x2="112" y2="86" />
          {/* top edge → MVPs & SaaS (top-right) */}
          <line x1="428" y1="140" x2="452" y2="66" />
          {/* bottom edge → Integrations (bottom-right) */}
          <line x1="400" y1="380" x2="432" y2="406" />
        </g>
        <g fill="var(--accent)">
          <circle cx="112" cy="86" r="3.5" />
          <circle cx="452" cy="66" r="3.5" />
          <circle cx="432" cy="406" r="3.5" />
        </g>
      </svg>

      {/* Chips — fully outside the dashboard */}
      <Chip icon={Bot} label="AI agents" note="into your workflow" className="left-[4%] top-[4%]" />
      <Chip
        icon={Rocket}
        label="MVPs & SaaS"
        note="production-grade builds"
        className="right-[2%] top-0"
      />
      <Chip
        icon={Plug}
        label="Integrations"
        note="your stack, connected"
        className="bottom-[2%] right-[6%]"
      />
    </div>
  );
}

export default HeroVisual;
