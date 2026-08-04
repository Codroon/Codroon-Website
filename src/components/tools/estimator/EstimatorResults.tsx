"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CtaButton } from "@/components/contact/CtaButton";
import { CEILING } from "@/pricing/constants";
import { formatMoney, formatRange } from "@/pricing/calculate";
import type { Estimate } from "@/pricing/types";
import type { EstimatorCopy } from "./copy/types";
import { ResultsCtas } from "./ResultsCtas";
import { BackButton, SectionLabel } from "./shared";

/**
 * The results screen both estimators render. Every figure arrives on
 * `estimate` — this component computes nothing.
 *
 * Accent budget (exactly two): the primary CTA fill and the 16px
 * checkbox accents. The estimate number is the display face + text-primary; size
 * does the work.
 *
 * The ledger reads like a receipt — hairlines, no cards. A cut greys
 * and strikes its row rather than deleting it, so the visitor can see
 * what they gave up.
 */

/** Cut figures: "−$1,500 · −2d". Derived, never configured. */
const cutFigure = (saves: number, days: number) =>
  `−${formatMoney(saves)} · −${days}d`;

export function AboveCeiling({
  copy,
  onBack,
}: {
  copy: EstimatorCopy;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="max-w-[600px]">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-[2rem] leading-tight text-foreground outline-none sm:text-[2.5rem]"
      >
        {copy.aboveCeiling.heading(formatMoney(CEILING))}
      </h1>
      <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
        {copy.aboveCeiling.body}
      </p>
      <div className="mt-8">
        <CtaButton>{copy.aboveCeiling.cta}</CtaButton>
      </div>
      <BackButton onClick={onBack} className="mt-12" />
    </div>
  );
}

export function EstimatorResults({
  copy,
  estimate,
  eyebrow,
  metaLine,
  panelLabel,
  panel,
  afterSandbox,
  belowFold,
  budgetNote,
  shortCode,
  onToggleCut,
  onBack,
}: {
  copy: EstimatorCopy;
  estimate: Estimate;
  eyebrow: string;
  metaLine: string;
  panelLabel: string;
  panel: ReactNode;
  /** carried on the quote/email leads so we know which estimate */
  shortCode?: string | null;
  /** MVP's "what not to cut"; agent has none */
  afterSandbox?: ReactNode;
  /** agent's run-cost receipt */
  belowFold?: ReactNode;
  budgetNote?: string;
  onToggleCut: (id: string) => void;
  onBack?: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  // The cumulative figures come off the estimate, not from summing the
  // per-cut savings: cuts compound, so those are marginal by design.
  const anyCut = estimate.cuts.some((c) => c.active);

  return (
    <div>
      <div className="lg:grid lg:grid-cols-[11fr_9fr] lg:gap-x-14">
        {/* ---- left column: number, CTAs, ledger, sandbox ---- */}
        <div className="max-w-[600px]">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-eyebrow text-tertiary outline-none"
          >
            {eyebrow}
          </h1>
          <p className="mt-4 font-serif text-[2.25rem] leading-none tabular-nums text-foreground sm:text-[2.75rem]">
            {formatRange(estimate.lo, estimate.hi)}
          </p>
          <p className="mt-3 text-[0.8125rem] text-muted-foreground">{metaLine}</p>

          {/* CTAs above the fold, before the ledger. The quote CTA goes
              straight to scheduling; it does not open the three-option
              contact modal. */}
          <ResultsCtas
            primaryLabel={copy.results.primaryCta}
            secondaryLabel={copy.results.secondaryCta}
            shortCode={shortCode}
          />

          {/* Copy-link control removed (client, 2026-08-02) — sharing
              happens through "Email me this estimate"; /e/[code] links
              still resolve for anyone who has one. */}

          {/* ---- the ledger: a receipt, not cards ---- */}
          <section className="mt-14" aria-labelledby="est-ledger-h">
            <SectionLabel id="est-ledger-h">{copy.results.ledgerLabel}</SectionLabel>
            <ul className="mt-4">
              {estimate.ledger.map((row) => (
                <li
                  key={row.id}
                  className="flex items-baseline justify-between gap-6 border-b-[0.5px] border-border py-3.5 first:border-t-[0.5px]"
                >
                  <span
                    className={cn(
                      "text-[0.95rem] transition-colors duration-150",
                      row.struck
                        ? "text-tertiary line-through"
                        : "text-muted-foreground"
                    )}
                  >
                    {row.label}
                    {row.struck && (
                      <span className="sr-only"> — removed by your cut</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-mono whitespace-nowrap text-[0.95rem] transition-colors duration-150",
                      row.struck ? "text-tertiary line-through" : "text-foreground"
                    )}
                  >
                    {formatMoney(row.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---- the sandbox: only cuts that apply to this build ---- */}
          {estimate.cuts.length > 0 && (
            <section className="mt-12" aria-labelledby="est-sandbox-h">
              <SectionLabel id="est-sandbox-h">
                {copy.results.sandboxLabel}
              </SectionLabel>
              {budgetNote && (
                <p className="text-small mt-3 max-w-[52ch] text-muted-foreground">
                  {budgetNote}
                </p>
              )}
              <div className="mt-4">
                {estimate.cuts.map((cut) => (
                  <label
                    key={cut.id}
                    className="flex min-h-[48px] cursor-pointer items-center gap-4 border-b-[0.5px] border-border py-2 first:border-t-[0.5px]"
                  >
                    <input
                      type="checkbox"
                      checked={cut.active}
                      onChange={() => onToggleCut(cut.id)}
                      className="size-4 shrink-0 accent-accent"
                    />
                    <span className="flex-1 text-[0.95rem] text-foreground">
                      {cut.label}
                    </span>
                    <span className="text-mono whitespace-nowrap text-[0.85rem] text-muted-foreground">
                      {cutFigure(cut.saves, cut.days)}
                    </span>
                  </label>
                ))}
              </div>
              {/* Always mounted, and always non-empty: a region that is
                  emptied announces nothing, so un-ticking the last cut
                  would silently put the price back up. */}
              <div aria-live="polite">
                <p className="sr-only">
                  {`Estimate now ${formatRange(estimate.lo, estimate.hi)}, ${
                    estimate.timelineLabel
                  }.`}
                </p>
                {anyCut && (
                  <p className="text-small mt-5 max-w-[52ch] text-tertiary">
                    {copy.results.closingLine(
                      formatMoney(estimate.saved),
                      estimate.daysOff
                    )}
                  </p>
                )}
              </div>
              {afterSandbox}
            </section>
          )}
        </div>

        {/* ---- right column: the panel. The download control was
                removed (client, 2026-08-02) along with its planned
                export path. ---- */}
        <div className="mt-12 border-t border-border pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="text-eyebrow text-tertiary">{panelLabel}</p>
          <div className="mt-6">{panel}</div>
        </div>
      </div>

      {belowFold}

      {/* ---- below the fold: comparison table ---- */}
      <section className="mt-20" aria-labelledby="est-cmp-h">
        <SectionLabel id="est-cmp-h">{copy.results.comparisonLabel}</SectionLabel>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] max-w-[820px] border-collapse text-left">
            <caption className="sr-only">
              Your estimate compared against the alternatives. The right-hand
              columns are typical figures, not quotes.
            </caption>
            <thead>
              <tr className="border-b-[0.5px] border-border-strong">
                <th scope="col" className="py-3 pr-6">
                  <span className="sr-only">Dimension</span>
                </th>
                {copy.results.comparison.columns.map((col, i) => (
                  <th
                    key={col}
                    scope="col"
                    className={cn(
                      "text-eyebrow py-3 pr-6 font-normal",
                      i === 0 ? "text-accent" : "text-tertiary"
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.results.comparison.rows.map((row) => {
                // first column is derived from this estimate
                const derived =
                  row.derived === "range"
                    ? formatRange(estimate.lo, estimate.hi)
                    : row.derived === "timeline"
                    ? estimate.timelineLabel
                    : row.derived === "runCost"
                    ? estimate.runCost?.label ?? "—"
                    : row.literal ?? "";
                return (
                  <tr key={row.header} className="border-b-[0.5px] border-border">
                    <th
                      scope="row"
                      className="py-3.5 pr-6 text-[0.9rem] font-normal text-muted-foreground"
                    >
                      {row.header}
                    </th>
                    <td className="text-mono py-3.5 pr-6 text-[0.9rem] text-accent">
                      {derived}
                    </td>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className="text-mono py-3.5 pr-6 text-[0.9rem] text-muted-foreground"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {onBack && <BackButton onClick={onBack} className="mt-14" />}
    </div>
  );
}

export default EstimatorResults;
