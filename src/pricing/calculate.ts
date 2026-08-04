import {
  CEILING,
  RETRIEVAL_RUN_COST_MULTIPLIER,
  ROUND_LEDGER,
  ROUND_RANGE,
  RUN_COST_DISPLAY_CAP,
  SPREAD_FLOOR,
  SPREAD_INITIAL,
  SPREAD_STEP,
  UNSURE_PENALTY,
  WEEKS_AS_DAYS_BELOW,
  WEEKS_MAX,
  WEEKS_MIN,
  WEEKS_MIN_BAND,
  WORKING_DAYS_PER_WEEK,
} from "./constants";
import { AGENT_RUN_COST, type AgentType } from "./agent.config";
import { MVP_BUDGET_BANDS } from "./mvp.config";
import {
  UNSURE,
  type Answers,
  type BaseRow,
  type CutOffer,
  type CutSpec,
  type Estimate,
  type LedgerLine,
  type QuestionSpec,
  type RunCost,
  type ToolConfig,
} from "./types";

/**
 * The shared calculation module. Both estimators run this exact code
 * over their own config — no pricing logic lives anywhere else.
 *
 * The signature mechanic is that the range NARROWS. It never
 * accumulates upward like a shopping cart: each answer moves the
 * midpoint and tightens the band around it.
 *
 * The fold walks config.questions in CANONICAL order, not the order
 * answers arrived, so a pasted URL reproduces the same estimate and
 * the same ledger every time.
 */

/* ------------------------------------------------------------------
   small helpers
   ------------------------------------------------------------------ */

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export const formatMoney = (n: number) => `$${n.toLocaleString("en-US")}`;
export const formatRange = (lo: number, hi: number) =>
  `${formatMoney(lo)}–${formatMoney(hi)}`;

/**
 * The post-type spread, derived from the type's own published band.
 * Answering only the type reproduces that band exactly:
 *   mid × (1 ± (hi−lo)/(hi+lo))  ≡  lo … hi
 */
export const typeSpread = (base: BaseRow) =>
  (base.hi - base.lo) / (base.hi + base.lo);

/** Timelines under a week read in working days ("3–5 days"). */
export function formatTimeline(weeksLo: number, weeksHi: number): string {
  if (weeksHi <= WEEKS_AS_DAYS_BELOW) {
    const lo = Math.max(1, Math.round(weeksLo * WORKING_DAYS_PER_WEEK));
    const hi = Math.max(lo + 1, Math.round(weeksHi * WORKING_DAYS_PER_WEEK));
    return `${lo}–${hi} days`;
  }
  return `${weeksLo}–${weeksHi} weeks`;
}

/** Resolve an answer, following the "Not sure" fallback. */
function resolve(
  q: QuestionSpec,
  answers: Answers
): { value: string | number | undefined; answered: boolean; unsure: boolean } {
  if (q.skipWhen?.(answers)) {
    return { value: undefined, answered: false, unsure: false };
  }
  const raw = answers[q.id];
  if (raw === undefined || raw === "") {
    return { value: undefined, answered: false, unsure: false };
  }
  if (raw === UNSURE) {
    return { value: q.unsureFallback, answered: true, unsure: true };
  }
  return { value: raw, answered: true, unsure: false };
}

/**
 * The answers as the engine actually prices them: skipped questions
 * dropped, and "Not sure" replaced by the option it falls back to.
 *
 * Everything that reasons about answers — offered cuts, budget fitting,
 * interrupt conditions — must use this rather than the raw params.
 * A visitor who picks "two user types" then switches to a waitlist page
 * leaves a stale answer behind, and one who answers "Not sure" is being
 * charged for the fallback, so the cut that removes it has to be on
 * offer.
 */
export function resolvedAnswers(config: ToolConfig, answers: Answers): Answers {
  const out: Answers = {};
  for (const q of config.questions) {
    if (q.skipWhen?.(answers)) continue;
    const raw = answers[q.id];
    if (raw === undefined || raw === "") continue;
    out[q.id] = raw === UNSURE ? q.unsureFallback : raw;
  }
  return out;
}

/** The effective multiplier for one answered question. */
function multiplierFor(
  config: ToolConfig,
  q: QuestionSpec,
  answers: Answers,
  neutralized: Set<string>
): { multiply: number; weeks: number; label: string } | null {
  const a = resolve(q, answers);
  if (!a.answered) return null;

  if (q.role === "count") {
    const units = Math.min(Number(a.value) || 0, q.max ?? Infinity);
    if (units <= 0) return null;
    return {
      multiply: Math.pow(q.perUnitMultiply ?? 1, units),
      weeks: 0,
      label: `${q.label ?? q.id} (${units} system${units > 1 ? "s" : ""})`,
    };
  }

  const key = `${q.id}.${a.value}`;
  const mod = config.modifiers[key];
  if (!mod) return null;
  return {
    multiply: neutralized.has(key) ? 1 : mod.multiply,
    weeks: mod.weeks ?? 0,
    label: mod.label ?? q.id,
  };
}

/* ------------------------------------------------------------------
   the narrowing algorithm
   ------------------------------------------------------------------ */

function computeSpread(config: ToolConfig, answers: Answers) {
  const typeQ = config.questions.find((q) => q.id === config.typeQuestionId)!;
  const type = resolve(typeQ, answers);

  // Skipped questions are neither outstanding nor narrowing.
  const narrowing = config.questions.filter(
    (q) => q.narrows && !q.skipWhen?.(answers)
  );
  const remaining = narrowing.filter((q) => !resolve(q, answers).answered).length;

  // Before the type question there is no midpoint to narrow around.
  if (!type.answered || typeof type.value !== "string") {
    return { spread: SPREAD_INITIAL, remaining, typeKnown: false };
  }

  const base = config.base[type.value];
  if (!base) return { spread: SPREAD_INITIAL, remaining, typeKnown: false };

  // The type answer collapses the band to that type's published width;
  // every later answer tightens it further.
  let spread = typeSpread(base);
  if (type.unsure) spread += UNSURE_PENALTY;

  for (const q of narrowing) {
    if (q.id === config.typeQuestionId) continue;
    const a = resolve(q, answers);
    if (!a.answered) continue;
    // Uncertainty widens the band instead of narrowing it.
    spread = a.unsure
      ? spread + UNSURE_PENALTY
      : Math.max(SPREAD_FLOOR, spread - SPREAD_STEP);
  }

  return { spread, remaining, typeKnown: true };
}

/* ------------------------------------------------------------------
   midpoint + ledger

   Each line is midpointBefore × (multiplier − 1), applied in canonical
   order. Multipliers below 1.00 emit no line — they are absorbed into
   the core line, because a ledger with negative rows reads as a
   discount, which is the wrong frame. Lines always sum to the total.
   ------------------------------------------------------------------ */

type Priced = {
  total: number;
  lines: LedgerLine[];
  weeksLo: number;
  weeksHi: number;
  base: BaseRow;
};

function priceAnswers(config: ToolConfig, answers: Answers): Priced | null {
  const typeQ = config.questions.find((q) => q.id === config.typeQuestionId)!;
  const type = resolve(typeQ, answers);
  if (!type.answered || typeof type.value !== "string") return null;

  const base = config.base[type.value];
  if (!base) return null;

  const neutralized = new Set(config.neutralizedModifiers?.(answers) ?? []);

  let running = (base.lo + base.hi) / 2;
  let weeksLo = base.weeksLo;
  let weeksHi = base.weeksHi;
  const lines: LedgerLine[] = [];

  for (const q of config.questions) {
    if (q.id === config.typeQuestionId || q.role === "context") continue;
    const m = multiplierFor(config, q, answers, neutralized);
    if (!m) continue;

    if (m.weeks) {
      weeksLo += m.weeks;
      weeksHi += m.weeks;
    }
    if (m.multiply > 1) {
      lines.push({ id: q.id, label: m.label, amount: running * (m.multiply - 1) });
    }
    running *= m.multiply;
  }

  return { total: running, lines, weeksLo, weeksHi, base };
}

/* ------------------------------------------------------------------
   cuts

   A cut that `reverses` a question divides that modifier back out, so
   it can never save more than the thing it removes. Reversal never
   increases a price — undoing a discount is clamped to no effect.
   ------------------------------------------------------------------ */

function cutFactor(
  config: ToolConfig,
  answers: Answers,
  cut: CutSpec
): { factor: number; reverses?: string } {
  let factor = 1;

  if (cut.reverses) {
    const q = config.questions.find((x) => x.id === cut.reverses);
    if (q) {
      const neutralized = new Set(config.neutralizedModifiers?.(answers) ?? []);
      const m = multiplierFor(config, q, answers, neutralized);
      // clamped at 1 — reversing a discount must not raise the price
      if (m) factor *= Math.min(1, 1 / m.multiply);
    }
  }
  if (cut.extraBase) factor *= 1 + cut.extraBase;

  return { factor, reverses: cut.reverses };
}

function clampWeeks(lo: number, hi: number) {
  let h = Math.max(WEEKS_MIN, Math.min(hi, WEEKS_MAX));
  let l = Math.max(WEEKS_MIN, Math.min(lo, h));
  // Whole weeks above the day threshold — every published timeline is
  // a whole-week band, and "4.5–5.5 weeks" reads nothing like them.
  if (h > WEEKS_AS_DAYS_BELOW) {
    l = Math.round(l);
    h = Math.min(WEEKS_MAX, Math.round(h));
  }
  // Capping can collapse the band; the brief forbids a single figure.
  if (l >= h) l = Math.max(WEEKS_MIN, h - WEEKS_MIN_BAND);
  return { weeksLo: l, weeksHi: h };
}

/* ------------------------------------------------------------------
   run cost (agent only)
   ------------------------------------------------------------------ */

export function computeRunCost(
  answers: Answers,
  activeCuts: string[]
): RunCost | undefined {
  const type = answers.type === UNSURE ? "knowledge-agent" : answers.type;
  if (typeof type !== "string" || !(type in AGENT_RUN_COST)) return undefined;

  const rawVolume = answers.volume;
  if (rawVolume === undefined) return undefined;
  const volume = rawVolume === UNSURE ? "mid" : rawVolume;
  if (volume !== "low" && volume !== "mid" && volume !== "high") return undefined;

  const anchors = AGENT_RUN_COST[type as AgentType][volume];
  const retrieval =
    answers.docs !== undefined &&
    answers.docs !== "none" &&
    !activeCuts.includes("skip-retrieval");
  const factor = retrieval ? RETRIEVAL_RUN_COST_MULTIPLIER : 1;

  const lo = roundTo(anchors[0] * factor, 10);
  const hi = roundTo(anchors[1] * factor, 10);
  const aboveCap = hi > RUN_COST_DISPLAY_CAP;

  return {
    lo,
    hi,
    aboveCap,
    label: aboveCap
      ? `${formatMoney(RUN_COST_DISPLAY_CAP)}+/mo — worth discussing`
      : `${formatMoney(lo)}–${formatMoney(hi)}/mo`,
  };
}

/* ------------------------------------------------------------------
   the estimate
   ------------------------------------------------------------------ */

export function estimate(
  config: ToolConfig,
  answers: Answers,
  activeCuts: string[] = []
): Estimate {
  const { spread, remaining, typeKnown } = computeSpread(config, answers);
  const confidenceLabel = `±${Math.round(spread * 100)}%`;

  const priced = typeKnown ? priceAnswers(config, answers) : null;

  // Nothing to narrow around yet — show the tool's full span.
  if (!priced) {
    return {
      state: "range",
      lo: config.floor,
      hi: CEILING,
      midpoint: 0,
      saved: 0,
      daysOff: 0,
      spread,
      confidenceLabel,
      remaining,
      weeksLo: 0,
      weeksHi: 0,
      timelineLabel: "",
      ledger: [],
      cuts: [],
    };
  }

  // Above the ceiling we show no number at all. Clamping silently to
  // $50,000 would be a lie, and a screenshot of a wrong number is
  // worse than no number — these route to a conversation.
  if (priced.total > CEILING) {
    return {
      state: "above-ceiling",
      lo: 0,
      hi: 0,
      midpoint: roundTo(priced.total, ROUND_LEDGER),
      saved: 0,
      daysOff: 0,
      spread,
      confidenceLabel,
      remaining,
      weeksLo: 0,
      weeksHi: 0,
      timelineLabel: "",
      ledger: [],
      cuts: [],
      runCost:
        config.tool === "agent" ? computeRunCost(answers, activeCuts) : undefined,
    };
  }

  // Only offer cuts that make sense for this configuration.
  const eff = resolvedAnswers(config, answers);
  const applicable = config.cuts.filter((c) => c.appliesWhen(eff));

  // Cuts compound multiplicatively, so a set of savings measured
  // against the uncut total would not add up to the reduction the
  // visitor actually sees. Each figure is instead the MARGINAL effect
  // of toggling that one checkbox from the current state — accurate at
  // the moment of the decision, which is when it is read.
  let factor = 1;
  const struck = new Set<string>();
  let daysOff = 0;
  for (const c of applicable) {
    if (!activeCuts.includes(c.id)) continue;
    const f = cutFactor(config, answers, c);
    factor *= f.factor;
    if (f.reverses) struck.add(f.reverses);
    daysOff += c.days;
  }

  const current = priced.total * factor;
  const offers: CutOffer[] = applicable.map((c) => {
    const f = cutFactor(config, answers, c).factor;
    const active = activeCuts.includes(c.id);
    // active: what it is saving right now. inactive: what ticking adds.
    const saves = active ? current * (1 / f - 1) : current * (1 - f);
    return {
      id: c.id,
      label: c.label,
      days: c.days,
      active,
      saves: Math.round(saves),
    };
  });

  const midpoint = Math.max(config.floor, roundTo(current, ROUND_LEDGER));

  // Rebuild the ledger: reversed lines strike out, everything else is
  // reconciled so the visible lines still sum to the total.
  const visible = priced.lines
    .filter((l) => !struck.has(l.id))
    .map((l) => ({ ...l, amount: roundTo(l.amount, ROUND_LEDGER) }));
  const strikes = priced.lines
    .filter((l) => struck.has(l.id))
    .map((l) => ({ ...l, amount: roundTo(l.amount, ROUND_LEDGER), struck: true }));

  let visibleTotal = visible.reduce((s, l) => s + l.amount, 0);
  let coreAmount = midpoint - visibleTotal;
  if (coreAmount < 0) {
    // Deep cut stacks can outrun the core; scale the lines instead of
    // ever showing a negative core.
    const scale = visibleTotal ? midpoint / visibleTotal : 0;
    visible.forEach((l) => (l.amount = roundTo(l.amount * scale, ROUND_LEDGER)));
    visibleTotal = visible.reduce((s, l) => s + l.amount, 0);
    coreAmount = midpoint - visibleTotal;
  }

  const ledger: LedgerLine[] = [
    { id: "base", label: priced.base.label, amount: coreAmount },
    ...visible,
    ...strikes,
  ];

  const weeks = clampWeeks(
    priced.weeksLo - daysOff / WORKING_DAYS_PER_WEEK,
    priced.weeksHi - daysOff / WORKING_DAYS_PER_WEEK
  );

  const lo = Math.max(config.floor, roundTo(midpoint * (1 - spread), ROUND_RANGE));
  // Coarse rounding can collapse a small range to one figure, which
  // would read as a fixed price rather than an estimate.
  const hi = Math.max(
    lo + ROUND_RANGE,
    Math.min(CEILING, roundTo(midpoint * (1 + spread), ROUND_RANGE))
  );

  return {
    state: "range",
    lo,
    hi,
    midpoint,
    // The authoritative "you've taken X off" figure. Per-cut savings
    // are marginal and cannot sum to this, because cuts compound.
    saved: Math.max(0, roundTo(priced.total, ROUND_LEDGER) - midpoint),
    daysOff,
    spread,
    confidenceLabel,
    remaining,
    ...weeks,
    timelineLabel: formatTimeline(weeks.weeksLo, weeks.weeksHi),
    ledger,
    cuts: offers,
    runCost:
      config.tool === "agent" ? computeRunCost(answers, activeCuts) : undefined,
  };
}

/* ------------------------------------------------------------------
   snapshots

   A stored estimate has to stay readable — and its sandbox has to stay
   interactive — after the pricing config moves underneath it. So we
   store the primitives needed to replay any combination of cuts rather
   than a rendered result: the uncut total, the per-cut factors, and
   the pre-cut ledger. Nothing here is a function, so it survives JSON.
   ------------------------------------------------------------------ */

export type PricingSnapshot = {
  version: 1;
  tool: ToolConfig["tool"];
  floor: number;
  spread: number;
  confidenceLabel: string;
  /** the midpoint before any cut, unrounded */
  uncutTotal: number;
  weeksLo: number;
  weeksHi: number;
  baseLabel: string;
  /** pre-cut ledger lines, excluding the core */
  lines: { id: string; label: string; amount: number }[];
  cuts: {
    id: string;
    label: string;
    days: number;
    factor: number;
    /** ledger line this cut strikes */
    reverses?: string;
  }[];
  /** run cost with and without retrieval, so the cut can flip it */
  runCost: { on: [number, number]; off: [number, number] } | null;
};

export function buildSnapshot(
  config: ToolConfig,
  answers: Answers
): PricingSnapshot | null {
  const priced = priceAnswers(config, answers);
  if (!priced) return null;

  const { spread } = computeSpread(config, answers);
  const eff = resolvedAnswers(config, answers);

  const on = computeRunCost(answers, []);
  const off = computeRunCost(answers, ["skip-retrieval"]);

  return {
    version: 1,
    tool: config.tool,
    floor: config.floor,
    spread,
    confidenceLabel: `±${Math.round(spread * 100)}%`,
    uncutTotal: priced.total,
    weeksLo: priced.weeksLo,
    weeksHi: priced.weeksHi,
    baseLabel: priced.base.label,
    lines: priced.lines.map((l) => ({
      id: l.id,
      label: l.label,
      amount: roundTo(l.amount, ROUND_LEDGER),
    })),
    cuts: config.cuts
      .filter((c) => c.appliesWhen(eff))
      .map((c) => ({
        id: c.id,
        label: c.label,
        days: c.days,
        factor: cutFactor(config, answers, c).factor,
        reverses: c.reverses,
      })),
    runCost: on && off ? { on: [on.lo, on.hi], off: [off.lo, off.hi] } : null,
  };
}

/** Replay a stored snapshot for any set of cuts. Mirrors estimate(). */
export function recomputeFromSnapshot(
  snap: PricingSnapshot,
  activeCuts: string[] = []
): Estimate {
  let factor = 1;
  const struck = new Set<string>();
  let daysOff = 0;
  for (const c of snap.cuts) {
    if (!activeCuts.includes(c.id)) continue;
    factor *= c.factor;
    if (c.reverses) struck.add(c.reverses);
    daysOff += c.days;
  }

  const current = snap.uncutTotal * factor;
  const midpoint = Math.max(snap.floor, roundTo(current, ROUND_LEDGER));

  const cuts: CutOffer[] = snap.cuts.map((c) => {
    const active = activeCuts.includes(c.id);
    return {
      id: c.id,
      label: c.label,
      days: c.days,
      active,
      saves: Math.round(
        active ? current * (1 / c.factor - 1) : current * (1 - c.factor)
      ),
    };
  });

  const visible = snap.lines
    .filter((l) => !struck.has(l.id))
    .map((l) => ({ ...l }));
  const strikes = snap.lines
    .filter((l) => struck.has(l.id))
    .map((l) => ({ ...l, struck: true }));

  let visibleTotal = visible.reduce((s, l) => s + l.amount, 0);
  let coreAmount = midpoint - visibleTotal;
  if (coreAmount < 0) {
    const scale = visibleTotal ? midpoint / visibleTotal : 0;
    visible.forEach((l) => (l.amount = roundTo(l.amount * scale, ROUND_LEDGER)));
    visibleTotal = visible.reduce((s, l) => s + l.amount, 0);
    coreAmount = midpoint - visibleTotal;
  }

  const weeks = clampWeeks(
    snap.weeksLo - daysOff / WORKING_DAYS_PER_WEEK,
    snap.weeksHi - daysOff / WORKING_DAYS_PER_WEEK
  );

  const lo = Math.max(snap.floor, roundTo(midpoint * (1 - snap.spread), ROUND_RANGE));
  const hi = Math.max(
    lo + ROUND_RANGE,
    Math.min(CEILING, roundTo(midpoint * (1 + snap.spread), ROUND_RANGE))
  );

  let runCost: RunCost | undefined;
  if (snap.runCost) {
    const [rlo, rhi] = activeCuts.includes("skip-retrieval")
      ? snap.runCost.off
      : snap.runCost.on;
    const aboveCap = rhi > RUN_COST_DISPLAY_CAP;
    runCost = {
      lo: rlo,
      hi: rhi,
      aboveCap,
      label: aboveCap
        ? `${formatMoney(RUN_COST_DISPLAY_CAP)}+/mo — worth discussing`
        : `${formatMoney(rlo)}–${formatMoney(rhi)}/mo`,
    };
  }

  return {
    state: snap.uncutTotal > CEILING ? "above-ceiling" : "range",
    lo,
    hi,
    midpoint,
    saved: Math.max(0, roundTo(snap.uncutTotal, ROUND_LEDGER) - midpoint),
    daysOff,
    spread: snap.spread,
    confidenceLabel: snap.confidenceLabel,
    remaining: 0,
    ...weeks,
    timelineLabel: formatTimeline(weeks.weeksLo, weeks.weeksHi),
    ledger: [
      { id: "base", label: snap.baseLabel, amount: coreAmount },
      ...visible,
      ...strikes,
    ],
    cuts,
    runCost,
  };
}

/* ------------------------------------------------------------------
   MVP budget fitting — serves, never qualifies
   ------------------------------------------------------------------ */

export type BudgetFit = {
  cuts: string[];
  fits: boolean;
  /** the leanest achievable midpoint when it doesn't fit */
  leanest: number;
  bandLabel: string;
};

export function fitToBudget(
  config: ToolConfig,
  answers: Answers
): BudgetFit | undefined {
  const raw = answers.budget;
  if (typeof raw !== "string" || raw === UNSURE) return undefined;
  const band = MVP_BUDGET_BANDS[raw];
  if (!band) return undefined;

  const applied: string[] = [];
  let current = estimate(config, answers, applied);
  if (current.state === "range" && current.hi <= band.cap) {
    return { cuts: [], fits: true, leanest: current.midpoint, bandLabel: band.label };
  }

  // Toggle cuts in config order until the top of the range fits.
  const eff = resolvedAnswers(config, answers);
  for (const cut of config.cuts) {
    if (!cut.appliesWhen(eff)) continue;
    applied.push(cut.id);
    current = estimate(config, answers, applied);
    if (current.state === "range" && current.hi <= band.cap) {
      return {
        cuts: applied,
        fits: true,
        leanest: current.midpoint,
        bandLabel: band.label,
      };
    }
  }

  return {
    cuts: applied,
    fits: false,
    leanest: current.midpoint,
    bandLabel: band.label,
  };
}

/* ------------------------------------------------------------------
   interrupts — fire at most once per session (caller tracks `seen`)
   ------------------------------------------------------------------ */

export function shouldInterrupt(
  config: ToolConfig,
  answers: Answers,
  lastAnsweredQuestionId: string,
  seen: boolean
): boolean {
  if (seen) return false;
  if (config.interrupt.firesAfter !== lastAnsweredQuestionId) return false;
  // Resolved, not raw: a stale answer to a skipped question must not
  // fire an interrupt about something this build does not have.
  return config.interrupt.when(resolvedAnswers(config, answers));
}

/* ------------------------------------------------------------------
   URL state — answers live in search params, never browser storage
   ------------------------------------------------------------------ */

export function encodeAnswers(answers: Answers): URLSearchParams {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(answers)) {
    if (v !== undefined && v !== "") params.set(k, String(v));
  }
  return params;
}

export function decodeAnswers(
  config: ToolConfig,
  params: URLSearchParams
): Answers {
  const answers: Answers = {};
  for (const q of config.questions) {
    const v = params.get(q.id);
    if (v === null) continue;
    answers[q.id] = q.role === "count" && v !== UNSURE ? Number(v) : v;
  }
  return answers;
}
