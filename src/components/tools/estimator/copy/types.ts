import type { Answer } from "@/pricing/types";

/**
 * Question copy for the estimators. Copy lives here; every price,
 * week count and percentage lives in src/pricing. An option's `value`
 * is the config option key — that is the only contract between the
 * two, so copy can be reworded without touching pricing.
 */

export type CopyOption = {
  label: string;
  /** the pricing-config option key (or UNSURE, or a count) */
  value: Answer;
  /** "Not sure" — same shape, quieter. Never a failure state. */
  quiet?: boolean;
};

export type CopyQuestion = {
  /** must match a QuestionSpec id in the pricing config */
  id: string;
  question: string;
  /** muted inline note after the question, e.g. "(optional)" */
  suffix?: string;
  hint: string;
  options: CopyOption[];
};

export type InterstitialCopy = {
  heading: string;
  body: string;
  keepGoing: string;
  show: string;
};

export type InterruptCopy = {
  heading: string;
  /** receives the two config ranges to interpolate, when relevant */
  body: (ranges: { smaller: string; instead: string }) => string;
  smaller: string;
  keepGoing: string;
};

export type EstimatorCopy = {
  /** header h1 — rendered as an eyebrow */
  title: string;
  /** shown once, under the first question */
  privacyNote: string;
  questions: CopyQuestion[];
  /** question after which the interstitial appears */
  interstitialAfter: string;
  interstitial: InterstitialCopy;
  interrupt: InterruptCopy;
  aboveCeiling: {
    /** receives the formatted ceiling — never write the figure out */
    heading: (ceiling: string) => string;
    body: string;
    cta: string;
  };
  results: {
    ledgerLabel: string;
    sandboxLabel: string;
    /** ${saved} and ${days} interpolated */
    closingLine: (saved: string, days: number) => string;
    primaryCta: string;
    secondaryCta: string;
    comparisonLabel: string;
    /** agent only — the monthly run-cost panel */
    runCost?: {
      label: string;
      covers: string;
      totalLabel: string;
    };
    /** first column is derived from the estimate; the rest are copy */
    comparison: {
      columns: [string, string, string];
      rows: Array<{
        header: string;
        /** which estimate value fills the first column */
        derived: "range" | "timeline" | "runCost" | "literal";
        /** used when derived is "literal" */
        literal?: string;
        cells: [string, string];
      }>;
    };
  };
};
