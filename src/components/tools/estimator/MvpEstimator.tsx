"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { mvpConfig } from "@/pricing/mvp.config";
import { formatMoney } from "@/pricing/calculate";
import type { Answers, Estimate } from "@/pricing/types";
import { BuildPlanPanel } from "./BuildPlanPanel";
import { AboveCeiling, EstimatorResults } from "./EstimatorResults";
import { mvpCopy, MVP_WHAT_NOT_TO_CUT } from "./copy/mvpCopy";
import { BranchBlock, EstimatorHeader, QuestionBlock } from "./shared";
import { useEstimatorFlow } from "./useEstimatorFlow";

/**
 * MVP cost estimator — the whole flow. Every figure comes from
 * src/pricing; this file contains no prices, weeks or percentages.
 *
 * Accent budget while answering (exactly three): the narrowing bar
 * fill, the selected option's 1px border, and the current-week marker
 * in the build plan.
 */

const TYPE_LABELS: Record<string, string> = {
  "landing-waitlist": "landing page and waitlist",
  "single-user-tool": "internal tool",
  "saas-mvp": "SaaS MVP",
  "ai-native-mvp": "AI-native MVP",
  "marketplace-mvp": "marketplace MVP",
};

const USER_LABELS: Record<string, string> = {
  one: "one user type",
  two: "two user types",
  "three-plus": "three or more user types",
};

const BUILD_LABELS: Record<string, string> = {
  "landing-waitlist": "Your landing page build",
  "single-user-tool": "Your internal tool build",
  "saas-mvp": "Your SaaS build",
  "ai-native-mvp": "Your AI-native build",
  "marketplace-mvp": "Your marketplace build",
};

/** Display strings for the results screen and the stored snapshot. */
export function describeMvp(answers: Answers, estimate: Estimate) {
  const type = typeof answers.type === "string" ? answers.type : "";
  const users = typeof answers.users === "string" ? answers.users : "";
  return {
    eyebrow: [
      "Your estimate",
      [TYPE_LABELS[type] ?? "MVP", USER_LABELS[users]].filter(Boolean).join(", "),
    ].join(" · "),
    metaLine: [estimate.timelineLabel, "you own the code", estimate.confidenceLabel]
      .filter(Boolean)
      .join(" · "),
    panelLabel:
      answers.type !== undefined
        ? `${BUILD_LABELS[type] ?? "Your build"}${
            estimate.timelineLabel ? ` · ${estimate.timelineLabel}` : ""
          }`
        : "Your build",
  };
}

export function MvpEstimator() {
  const flow = useEstimatorFlow(mvpConfig, mvpCopy, describeMvp);
  const { answers, estimate, stage, budgetFit } = flow;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  const { eyebrow, metaLine, panelLabel: planLabel } = describeMvp(answers, estimate);

  /* ---- results ------------------------------------------------- */

  if (stage === "results") {
    if (estimate.state === "above-ceiling") {
      return (
        <div className="pb-24 pt-28 sm:pt-36">
          <Container>
            <AboveCeiling copy={mvpCopy} onBack={flow.back} />
          </Container>
        </div>
      );
    }

    // The budget answer serves rather than qualifies: it pre-selects
    // cuts so the leaner version already fits when they arrive.
    const budgetNote = budgetFit
      ? budgetFit.fits
        ? budgetFit.cuts.length
          ? `Here's a version that fits ${budgetFit.bandLabel}.`
          : undefined
        : `The leanest version of this is still around ${formatMoney(
            budgetFit.leanest
          )}. Worth a conversation about scope.`
      : undefined;

    return (
      <div className="pb-24 pt-28 sm:pt-36">
        <Container>
          <EstimatorResults
            copy={mvpCopy}
            estimate={estimate}
            eyebrow={eyebrow}
            metaLine={metaLine}
            panelLabel={planLabel}
            shortCode={flow.shortCode}
            panel={
              <BuildPlanPanel
                answers={answers}
                markerIndex={0}
                maxWeeks={estimate.weeksHi}
                className="max-w-[420px]"
              />
            }
            budgetNote={budgetNote}
            afterSandbox={
              /* prose counterweight, not another toggle. Accent panel —
                 text on accent is ALWAYS #232220 */
              <div className="mt-10 rounded-[var(--radius-lg)] bg-accent p-6 sm:p-7">
                <p className="text-eyebrow text-accent-foreground">
                  {MVP_WHAT_NOT_TO_CUT.label}
                </p>
                <p className="mt-3 max-w-[56ch] text-[0.95rem] leading-relaxed text-accent-foreground">
                  {MVP_WHAT_NOT_TO_CUT.body}
                </p>
              </div>
            }
            onToggleCut={flow.toggleCut}
            onBack={flow.back}
          />
        </Container>
      </div>
    );
  }

  /* ---- question flow ------------------------------------------- */

  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <Container>
        <EstimatorHeader
          title={mvpCopy.title}
          estimate={estimate}
        />

        {/* ---- Body: question column (55) · build plan (45) ---- */}
        <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[11fr_9fr] lg:gap-x-14">
          <div className="max-w-[600px]">
            {stage === "interrupt" ? (
              <BranchBlock
                headingRef={headingRef}
                heading={mvpCopy.interrupt.heading}
                body={mvpCopy.interrupt.body({ smaller: "", instead: "" })}
                primary={mvpCopy.interrupt.smaller}
                secondary={mvpCopy.interrupt.keepGoing}
                onPrimary={flow.takeSmaller}
                onSecondary={flow.dismissInterrupt}
                onBack={flow.back}
              />
            ) : stage === "interstitial" ? (
              <BranchBlock
                headingRef={headingRef}
                heading={mvpCopy.interstitial.heading}
                body={mvpCopy.interstitial.body}
                primary={mvpCopy.interstitial.keepGoing}
                secondary={mvpCopy.interstitial.show}
                onPrimary={flow.continueFromInterstitial}
                onSecondary={flow.skipToResults}
                onBack={flow.back}
              />
            ) : flow.currentQuestion ? (
              <div key={flow.currentQuestion.id}>
                <QuestionBlock
                  headingRef={headingRef}
                  question={flow.currentQuestion.question}
                  suffix={flow.currentQuestion.suffix}
                  options={flow.currentQuestion.options}
                  selectedValue={flow.rawAnswer(flow.currentQuestion.id)}
                  onPick={(o) => flow.answer(flow.currentQuestion!.id, o.value)}
                  hint={flow.currentQuestion.hint}
                  privacyNote={
                    flow.isFirstQuestion ? mvpCopy.privacyNote : undefined
                  }
                  showBack={!flow.isFirstQuestion}
                  onBack={flow.back}
                />
              </div>
            ) : null}
          </div>

          {/* ---- Build plan column: assembles as answers come in ---- */}
          <div className="mt-12 border-t border-border pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="text-eyebrow text-tertiary">{planLabel}</p>
            <BuildPlanPanel
              answers={answers}
              maxWeeks={estimate.weeksHi}
              className="mt-6 max-w-[420px]"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default MvpEstimator;
