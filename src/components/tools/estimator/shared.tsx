"use client";

import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";
import { CEILING, SPREAD_INITIAL } from "@/pricing/constants";
import { formatMoney, formatRange } from "@/pricing/calculate";
import type { Estimate } from "@/pricing/types";
import type { CopyOption } from "./copy/types";

/**
 * Shared estimator primitives — the settled shell both cost estimators
 * render through. Visual rules live here so the two tools cannot drift:
 *   - the narrowing bar is the progress indicator (no step counters)
 *   - the display face is reserved for the estimate range
 *   - mono for eyebrows/labels/figures, sans for everything else
 *   - option hover lifts the surface; selection is a 1px accent border
 *   - interstitial/interrupt buttons are neutral (light fill + outline)
 *
 * No prices here: every figure arrives already computed on `estimate`.
 */

/**
 * The bar fill closes in from both ends as certainty rises.
 *
 * It tracks the SPREAD, not the range's position on a money axis:
 * mapping absolute lo/hi onto a fixed floor…ceiling track made the
 * fill grow whenever the midpoint climbed, even as the band tightened
 * — the opposite of the mechanic. Spread only widens on "Not sure",
 * where a wider bar is exactly the right signal.
 *
 * The two insets differ on purpose; the fill is deliberately asymmetric.
 */
function barInsets(estimate: Estimate) {
  // Above the ceiling the spread is still known — the bar keeps its
  // narrowness. Snapping back to full width there would signal "we
  // know nothing" beside a headline that says the opposite.
  const closed = 1 - Math.min(1, estimate.spread / SPREAD_INITIAL);
  const maxInset = 46; // keep a sliver of fill at maximum narrowing
  return {
    left: Math.max(0, closed * maxInset * 1.1),
    right: Math.max(0, closed * maxInset * 0.9),
  };
}

function confidenceLine(estimate: Estimate): string {
  if (estimate.state === "above-ceiling") return "needs a conversation";
  if (estimate.remaining === 0) return `${estimate.confidenceLabel} · build range set`;
  const n = estimate.remaining;
  return `${estimate.confidenceLabel} · ${n} answer${n === 1 ? "" : "s"} ${
    n === 1 ? "narrows" : "narrow"
  } this`;
}

/** Estimate header: eyebrow h1 · display range · mono confidence · bar. */
export function EstimatorHeader({
  title,
  estimate,
}: {
  title: string;
  estimate: Estimate;
}) {
  const insets = barInsets(estimate);
  const range =
    estimate.state === "above-ceiling"
      ? `Above ${formatMoney(CEILING)}`
      : formatRange(estimate.lo, estimate.hi);

  return (
    <header>
      {/* page h1 — visually an eyebrow; questions are h2 */}
      <h1 className="text-eyebrow text-tertiary">{title}</h1>
      <div
        className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1"
        aria-live="polite"
      >
        <p className="font-serif text-[2rem] leading-none tabular-nums text-foreground sm:text-[2.75rem]">
          {range}
        </p>
        <p className="text-mono text-[0.78rem] text-tertiary">
          {confidenceLine(estimate)}
        </p>
      </div>
      {/* the narrowing bar — accent fill closes in from both ends */}
      <div
        className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-surface-raised sm:mt-6"
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 rounded-full bg-accent transition-[left,right] duration-[480ms] ease-out"
          style={{ left: `${insets.left}%`, right: `${insets.right}%` }}
        />
      </div>
    </header>
  );
}

/** One question: h2, stacked full-width options, one muted hint line. */
export function QuestionBlock({
  headingRef,
  question,
  suffix,
  options,
  selectedValue,
  onPick,
  hint,
  privacyNote,
  showBack,
  onBack,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  question: string;
  suffix?: string;
  options: CopyOption[];
  /** the raw search-param value, so "Not sure" highlights correctly */
  selectedValue: string | undefined;
  onPick: (option: CopyOption) => void;
  hint: string;
  /** shown on the first question only */
  privacyNote?: string;
  showBack: boolean;
  onBack: () => void;
}) {
  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[1.0625rem] font-medium leading-snug text-foreground outline-none"
      >
        {question}
        {suffix && (
          <span className="ml-2 font-normal text-tertiary">{suffix}</span>
        )}
      </h2>
      <div className="mt-5 flex flex-col gap-2.5">
        {options.map((option) => {
          const selected =
            selectedValue !== undefined && selectedValue === String(option.value);
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onPick(option)}
              aria-pressed={selected}
              className={cn(
                "min-h-[48px] w-full rounded-[var(--radius-sm)] border bg-surface px-5 py-3 text-left text-[0.95rem] leading-snug transition-colors duration-150",
                selected ? "border-accent" : "border-border hover:bg-surface-raised",
                option.quiet ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="text-small mt-5 text-tertiary">{hint}</p>
      {privacyNote && (
        <p className="text-small mt-3 max-w-[52ch] text-tertiary">{privacyNote}</p>
      )}
      {showBack && <BackButton onClick={onBack} className="mt-6" />}
    </div>
  );
}

/** Quiet mono back control. Pass the margin via className (cn does
    not dedupe utilities, so the base carries none). */
export function BackButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // min-w plus negative margin: a 44px target without the label
        // visually indenting away from the column edge
        "text-mono -mx-3 inline-flex min-h-[44px] min-w-[44px] items-center px-3 text-[0.78rem] uppercase tracking-[0.1em] text-tertiary transition-colors duration-150 hover:text-foreground",
        className
      )}
    >
      Back
    </button>
  );
}

/** Neutral light-fill button — the stronger of the two neutral CTAs. */
export function LightButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-[0.95rem] font-medium text-background transition-colors duration-150 hover:bg-muted-foreground"
    >
      {children}
    </button>
  );
}

/** Neutral hairline-outline button. `sm` pairs with Button md (44px);
    `md` pairs with LightButton in interstitials; `lg` matches Button lg. */
export function OutlineButton({
  children,
  onClick,
  size = "md",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border-strong font-medium text-foreground transition-colors duration-150 hover:bg-surface-raised",
        size === "lg"
          ? "h-13 px-8 text-body-lg"
          : size === "sm"
          ? "h-11 px-6 text-[0.95rem]"
          : "h-12 px-7 text-[0.95rem]",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Mono section label (h2) for the results receipts. */
export function SectionLabel({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className="text-eyebrow text-tertiary">
      {children}
    </h2>
  );
}

/**
 * A branch point in the flow — the interrupt and the interstitial share
 * this shape. Both sets of buttons are neutral: the accent budget is
 * already spent on the bar and the selected option.
 */
export function BranchBlock({
  headingRef,
  heading,
  body,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  onBack,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  heading: string;
  body: string;
  primary: string;
  secondary: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[1.0625rem] font-medium leading-snug text-foreground outline-none"
      >
        {heading}
      </h2>
      <p className="mt-2 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
        {body}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LightButton onClick={onPrimary}>{primary}</LightButton>
        <OutlineButton onClick={onSecondary}>{secondary}</OutlineButton>
      </div>
      <BackButton onClick={onBack} className="mt-8" />
    </div>
  );
}
