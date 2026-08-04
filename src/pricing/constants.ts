/**
 * Shared pricing constants — BOTH estimators read from here.
 *
 * Every number that shapes an estimate lives in this file or in the
 * two tool configs beside it. Components must never contain a price,
 * a week count, or a percentage. These get retuned monthly.
 */

/** Above this midpoint we show no number at all — see calculate.ts. */
export const CEILING = 50_000;

export const FLOOR_AGENT = 2_000;
export const FLOOR_MVP = 3_000;

/** Hard cap on the displayed timeline, both tools. */
export const WEEKS_MAX = 6;

/* ---- the narrowing algorithm ----
   The post-type spread is no longer a constant: it is derived per type
   from that type's own published band, which makes a type-only answer
   reproduce the published cost table exactly. See typeSpread(). */
export const SPREAD_INITIAL = 0.86;
export const SPREAD_STEP = 0.04;
export const SPREAD_FLOOR = 0.12;
/** "Not sure" widens the band instead of narrowing it. */
export const UNSURE_PENALTY = 0.2;

/* ---- presentation granularity ----
   Not in the brief, added so no component has to round anything. */

/** Displayed build ranges round to this. */
export const ROUND_RANGE = 500;
/** Ledger lines round finer — 500 distorts small bases badly. */
export const ROUND_LEDGER = 100;
/** Monthly run-cost figures round to this. */
export const ROUND_RUN_COST = 10;

/** Timelines below this many weeks render in working days instead. */
export const WEEKS_AS_DAYS_BELOW = 1;
export const WORKING_DAYS_PER_WEEK = 5;
/** A build can never be quoted shorter than this (the smallest base
    in either config is the 0.25-week simple automation). */
export const WEEKS_MIN = 0.25;
/**
 * When modifiers push both ends past WEEKS_MAX the range would
 * collapse to "6–6 weeks". The brief says never show a single figure,
 * so we keep this much band and cap the top.
 */
export const WEEKS_MIN_BAND = 1;

/* ---- run cost (agent only) ---- */
/** Retrieval adds ~40% to monthly run cost. */
export const RETRIEVAL_RUN_COST_MULTIPLIER = 1.4;
/** Above this we stop showing a figure and invite a conversation. */
export const RUN_COST_DISPLAY_CAP = 2_500;
