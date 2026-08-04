import type { ToolPreviewCard } from "@/content/tools/types";

/**
 * EstimatorPreviewCard — static, illustrative mockup of an estimator
 * result, floating in the tool-landing hero. Clearly labelled as an
 * example so the figures never read as a real quote. Server-rendered
 * HTML (crisp text, no JS). The optional leanerRow (MVP estimator's
 * signature output) gets its own emphasized band at the foot.
 */
export function EstimatorPreviewCard({ preview }: { preview: ToolPreviewCard }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] rounded-[var(--radius-lg)] border border-border-strong bg-surface p-6 shadow-lg shadow-black/40 sm:p-8">
      {/* example badge */}
      <span className="text-eyebrow absolute right-5 top-5 rounded-full border border-border px-3 py-1 text-muted-foreground">
        {preview.exampleLabel}
      </span>

      <p className="text-eyebrow text-muted-foreground">{preview.title}</p>
      <p className="text-mono mt-3 text-3xl text-foreground sm:text-4xl">{preview.range}</p>

      <ul className="mt-6 space-y-3 border-t border-border pt-5">
        {preview.lines.map((line) => (
          <li key={line.label} className="flex items-baseline justify-between gap-6">
            <span className="text-[0.9rem] text-muted-foreground">{line.label}</span>
            <span className="text-mono text-[0.9rem] text-foreground">{line.value}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-border pt-5">
        {preview.footerRows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6">
            <dt className="text-eyebrow text-muted-foreground">{row.label}</dt>
            <dd className="text-mono text-[0.95rem] text-accent">{row.value}</dd>
          </div>
        ))}
      </dl>

      {preview.leanerRow && (
        /* accent surface — text on it is #232220 */
        <div className="mt-6 flex items-baseline justify-between gap-6 rounded-[var(--radius-sm)] bg-accent px-4 py-3">
          <span className="text-eyebrow text-accent-foreground">
            {preview.leanerRow.label}
          </span>
          <span className="text-mono whitespace-nowrap text-[0.95rem] text-accent-foreground">
            {preview.leanerRow.value}
          </span>
        </div>
      )}
    </div>
  );
}

export default EstimatorPreviewCard;
