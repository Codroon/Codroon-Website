/**
 * PhaseGlyph — small static SVG illustrating one phase, used in the
 * stacked (mobile / reduced-motion) layout. Decorative, aria-hidden.
 *   1 = scattered · 2 = connected · 3 = product
 */
export function PhaseGlyph({ phase }: { phase: 1 | 2 | 3 }) {
  return (
    <svg
      viewBox="0 0 160 120"
      className="h-full w-full"
      aria-hidden
      role="presentation"
    >
      {phase === 1 && (
        <g fill="var(--surface-2)" stroke="var(--border)" strokeWidth={1.5}>
          <circle cx={30} cy={34} r={7} />
          <circle cx={118} cy={28} r={7} />
          <circle cx={66} cy={70} r={7} />
          <circle cx={132} cy={84} r={7} />
          <circle cx={44} cy={96} r={7} />
          <circle cx={96} cy={52} r={7} />
        </g>
      )}

      {phase === 2 && (
        <g>
          <g stroke="var(--accent)" strokeWidth={1.5} opacity={0.7}>
            <line x1={30} y1={40} x2={80} y2={60} />
            <line x1={80} y1={60} x2={130} y2={36} />
            <line x1={80} y1={60} x2={120} y2={88} />
            <line x1={80} y1={60} x2={40} y2={92} />
          </g>
          <g fill="var(--surface-2)" stroke="var(--border)" strokeWidth={1.5}>
            <circle cx={30} cy={40} r={7} />
            <circle cx={130} cy={36} r={7} />
            <circle cx={120} cy={88} r={7} />
            <circle cx={40} cy={92} r={7} />
            <circle cx={80} cy={60} r={9} fill="var(--accent)" stroke="var(--accent)" />
          </g>
        </g>
      )}

      {phase === 3 && (
        <g>
          <rect
            x={28}
            y={22}
            width={104}
            height={76}
            rx={8}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth={1.5}
            opacity={0.95}
          />
          <circle cx={40} cy={34} r={2.5} fill="var(--accent)" />
          <circle cx={49} cy={34} r={2.5} fill="var(--border)" />
          <line x1={28} y1={44} x2={132} y2={44} stroke="var(--border)" strokeWidth={1} />
          <rect x={40} y={56} width={52} height={6} rx={3} fill="var(--accent)" opacity={0.85} />
          <rect x={40} y={68} width={80} height={5} rx={2.5} fill="var(--surface-2)" />
          <rect x={40} y={79} width={66} height={5} rx={2.5} fill="var(--surface-2)" />
        </g>
      )}
    </svg>
  );
}

export default PhaseGlyph;