import { SITE } from "@/config/site";
import { formatRange, recomputeFromSnapshot, type PricingSnapshot } from "@/pricing/calculate";
import { CEILING } from "@/pricing/constants";
import { formatMoney } from "@/pricing/calculate";
import { UNSURE, type Answers } from "@/pricing/types";
import { agentCopy } from "@/components/tools/estimator/copy/agentCopy";
import { mvpCopy } from "@/components/tools/estimator/copy/mvpCopy";
import type { EstimateRow } from "@/lib/supabase/types";

/**
 * Turns a stored estimate into something a person can read on a phone.
 *
 * Answers come back as the question and the option label the visitor
 * actually clicked — "What should the agent do? → Run a multi-step
 * process across your systems", not "type=workflow-agent". Deciding
 * whether a lead is worth an hour should not require decoding keys.
 *
 * The figures are replayed from the stored snapshot, so a notification
 * says exactly what the visitor saw even if the pricing config has
 * moved since.
 */

export type EstimateSummary = {
  toolLabel: string;
  /** "agent" | "mvp" — the estimate email drops the run-cost clause for MVPs */
  tool: "agent" | "mvp";
  range: string;
  timeline: string;
  runCost: string | null;
  industry: string | null;
  midpoint: number | null;
  aboveCeiling: boolean;
  answers: { question: string; answer: string }[];
  cuts: string[];
  shareUrl: string;
  /**
   * The visible ledger the results screen showed, for the estimate
   * email's breakdown box. Struck lines are excluded: a cut the visitor
   * toggled removed that work, so billing for it in the email would
   * contradict the page they just left.
   */
  ledger: { label: string; figure: string }[];
  /** one line describing what they configured, built from their answers */
  configured: string | null;
};

type StoredComputed = {
  snapshot?: PricingSnapshot;
  cuts?: string[];
  midpoint?: number;
};

const copyFor = (tool: "agent" | "mvp") => (tool === "agent" ? agentCopy : mvpCopy);

/** The label the visitor clicked, for a stored answer value. */
function optionLabel(
  tool: "agent" | "mvp",
  questionId: string,
  value: unknown
): string | null {
  if (value === undefined || value === null || value === "") return null;
  const question = copyFor(tool).questions.find((q) => q.id === questionId);
  if (!question) return null;
  if (value === UNSURE) {
    return question.options.find((o) => o.quiet)?.label ?? "Not sure";
  }
  const match = question.options.find((o) => String(o.value) === String(value));
  return match?.label ?? String(value);
}

export function summariseEstimate(
  row: Pick<EstimateRow, "tool" | "answers" | "computed" | "short_code">
): EstimateSummary | null {
  const computed = (row.computed ?? {}) as StoredComputed;
  if (!computed.snapshot) return null;

  const activeCuts = computed.cuts ?? [];
  const est = recomputeFromSnapshot(computed.snapshot, activeCuts);
  const copy = copyFor(row.tool);
  const answers = (row.answers ?? {}) as Answers;
  const aboveCeiling = est.state === "above-ceiling";

  // "What should the agent do?" / "What are you building?" is the second
  // question in both tools and is the one that describes the build. The
  // industry qualifies it. Both are optional: an estimate can be sent
  // with either unanswered.
  const shape = optionLabel(row.tool, "type", answers.type);
  const industryLabel = optionLabel(row.tool, "industry", answers.industry);

  return {
    toolLabel: copy.title,
    tool: row.tool,
    ledger: est.ledger
      .filter((l) => !l.struck)
      .map((l) => ({ label: l.label, figure: formatMoney(l.amount) })),
    configured:
      shape && industryLabel
        ? `${shape}, for ${industryLabel.toLowerCase()}.`
        : (shape ?? (industryLabel ? `A build for ${industryLabel.toLowerCase()}.` : null)),
    range: aboveCeiling
      ? `Above ${formatMoney(CEILING)}, needs a conversation`
      : formatRange(est.lo, est.hi),
    timeline: est.timelineLabel || "—",
    runCost: est.runCost?.label ?? null,
    industry: optionLabel(row.tool, "industry", answers.industry),
    midpoint: aboveCeiling ? null : est.midpoint,
    aboveCeiling,
    // canonical question order, so two notifications read alike
    answers: copy.questions
      .map((q) => ({
        question: q.question,
        answer: optionLabel(row.tool, q.id, answers[q.id]),
      }))
      .filter((a): a is { question: string; answer: string } => a.answer !== null),
    cuts: activeCuts
      .map((id) => computed.snapshot?.cuts.find((c) => c.id === id)?.label ?? id)
      .filter(Boolean),
    shareUrl: `${SITE.url}/e/${row.short_code}`,
  };
}
