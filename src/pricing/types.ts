/**
 * Shared pricing types. Both tool configs implement ToolConfig, and
 * calculate.ts works against that interface alone — so the two
 * estimators run identical logic over different tables.
 *
 * Every modifier is MULTIPLICATIVE. Absolute-dollar modifiers were
 * sized for a $20,000 build and went negative when applied to a
 * $3,500 base; a multiplier scales with whatever it is applied to.
 */

/** The literal "I don't know" answer. Widens the band, never blocks. */
export const UNSURE = "unsure" as const;
export type Unsure = typeof UNSURE;

export type Answer = string | number | Unsure | undefined;
export type Answers = Record<string, Answer>;

export type BaseRow = {
  /** ledger label for this type's core line */
  label: string;
  lo: number;
  hi: number;
  weeksLo: number;
  weeksHi: number;
};

export type Modifier = {
  /** ×1.00 means "no effect"; below 1.00 emits no ledger line */
  multiply: number;
  /** signed week delta applied to both ends */
  weeks?: number;
  /** ledger line label — only used when multiply > 1 */
  label?: string;
};

export type QuestionSpec = {
  id: string;
  /**
   * type    — selects the base row (exactly one per tool)
   * modifier— option key indexes into `modifiers`
   * count   — numeric answer, compounding `perUnitMultiply` up to `max`
   * context — changes no price (industry, budget, volume)
   */
  role: "type" | "modifier" | "count" | "context";
  /** the option applied when the visitor answers "Not sure" */
  unsureFallback?: string | number;
  /** count questions only */
  perUnitMultiply?: number;
  max?: number;
  label?: string;
  /** does answering this narrow the spread? context questions don't */
  narrows: boolean;
  /**
   * Questions that make no sense for the chosen type are skipped
   * outright — a waitlist page has no user types, and answering that
   * question produces nonsense. Skipped questions are never counted as
   * outstanding, and any stale answer to one is ignored.
   */
  skipWhen?: (answers: Answers) => boolean;
};

export type CutSpec = {
  id: string;
  label: string;
  /**
   * Question whose modifier this cut undoes. Reversal divides the
   * modifier back out, so a cut can never save more than the thing it
   * removes. Reversal never *increases* a price: undoing a discount
   * (a modifier below 1.00) is clamped to no effect.
   */
  reverses?: string;
  /** additional proportional saving, e.g. -0.12 for −12% */
  extraBase?: number;
  /** working days removed from both ends of the timeline */
  days: number;
  /**
   * Only offered when this returns true — never show "remove the
   * approval layer" to someone who chose approval.never.
   */
  appliesWhen: (answers: Answers) => boolean;
  /** agent only: this cut also removes retrieval from run cost */
  removesRetrieval?: boolean;
};

export type ToolConfig = {
  tool: "agent" | "mvp";
  floor: number;
  /** id of the question that selects the base row */
  typeQuestionId: string;
  /** canonical order — the fold walks this, not click order */
  questions: QuestionSpec[];
  base: Record<string, BaseRow>;
  /** "<questionId>.<optionKey>" → modifier */
  modifiers: Record<string, Modifier>;
  cuts: CutSpec[];
  interrupt: InterruptSpec;
  /**
   * Modifier keys forced to ×1.00 for a given set of answers, where
   * the base type already prices the same thing in.
   */
  neutralizedModifiers?: (answers: Answers) => string[];
};

export type InterruptSpec = {
  id: string;
  /** question id after which the condition is evaluated */
  firesAfter: string;
  when: (answers: Answers) => boolean;
  /** answers merged in when the visitor takes the smaller option */
  smallerConfiguration: Answers;
  /** cuts pre-applied on arrival at results */
  smallerCuts: string[];
};

/* ---- results ---- */

export type LedgerLine = {
  id: string;
  label: string;
  amount: number;
  /** a cut reversed the modifier behind this line */
  struck?: boolean;
};

/**
 * A cut as the results screen renders it. Deliberately NOT CutSpec —
 * that carries predicate functions, which cannot survive being stored
 * as JSON and replayed on a share page.
 */
export type CutOffer = {
  id: string;
  label: string;
  /** working days this cut removes */
  days: number;
  active: boolean;
  /** derived, not configured: what toggling this is worth right now */
  saves: number;
};

export type RunCost = {
  lo: number;
  hi: number;
  /** true when hi exceeds the display cap */
  aboveCap: boolean;
  label: string;
};

export type Estimate = {
  /** "above-ceiling" replaces the whole results screen */
  state: "range" | "above-ceiling";
  lo: number;
  hi: number;
  midpoint: number;
  /** cumulative reduction from the uncut build — the authoritative
      figure; per-cut savings are marginal and do not sum to it */
  saved: number;
  /** working days removed by the active cuts */
  daysOff: number;
  spread: number;
  /** "±86%" */
  confidenceLabel: string;
  /** pricing questions still unanswered */
  remaining: number;
  weeksLo: number;
  weeksHi: number;
  /** "4–5 weeks" or "3–5 days" */
  timelineLabel: string;
  ledger: LedgerLine[];
  cuts: CutOffer[];
  runCost?: RunCost;
};
