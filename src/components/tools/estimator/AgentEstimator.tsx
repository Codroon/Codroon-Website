"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { agentConfig, AGENT_INTERRUPT_COMPARISON } from "@/pricing/agent.config";
import { formatRange } from "@/pricing/calculate";
import { ArchitectureDiagram, diagramState } from "./ArchitectureDiagram";
import { describeAgent } from "./describe";
import { AboveCeiling, EstimatorResults } from "./EstimatorResults";
import { RunCostPanel } from "./RunCostPanel";
import { agentCopy } from "./copy/agentCopy";
import { BranchBlock, EstimatorHeader, QuestionBlock } from "./shared";
import { useEstimatorFlow } from "./useEstimatorFlow";

/**
 * AI agent cost estimator — the whole flow. Every figure comes from
 * src/pricing; this file contains no prices, weeks or percentages.
 *
 * Accent budget while answering (exactly three): the narrowing bar
 * fill, the selected option's 1px border, and the agent node's stroke.
 */

export function AgentEstimator() {
  const flow = useEstimatorFlow(agentConfig, agentCopy, describeAgent);
  const { answers, estimate, stage } = flow;

  // Move focus to the current heading on stage change (not on mount),
  // so keyboard and screen-reader users land on the new question.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  const { eyebrow, metaLine, panelLabel } = describeAgent(answers, estimate);

  /* ---- results ------------------------------------------------- */

  if (stage === "results") {
    if (estimate.state === "above-ceiling") {
      return (
        <div className="pb-24 pt-28 sm:pt-36">
          <Container>
            <AboveCeiling copy={agentCopy} onBack={flow.back} />
          </Container>
        </div>
      );
    }

    return (
      <div className="pb-24 pt-28 sm:pt-36">
        <Container>
          <EstimatorResults
            copy={agentCopy}
            estimate={estimate}
            eyebrow={eyebrow}
            metaLine={metaLine}
            panelLabel={panelLabel}
            shortCode={flow.shortCode}
            panel={
              <ArchitectureDiagram
                state={diagramState(answers)}
                className="max-w-[330px] lg:max-w-[420px]"
              />
            }
            belowFold={<RunCostPanel estimate={estimate} />}
            onToggleCut={flow.toggleCut}
            onBack={flow.back}
          />
        </Container>
      </div>
    );
  }

  /* ---- question flow ------------------------------------------- */

  const interruptRanges = {
    smaller: formatRange(
      agentConfig.base[AGENT_INTERRUPT_COMPARISON.smaller].lo,
      agentConfig.base[AGENT_INTERRUPT_COMPARISON.smaller].hi
    ),
    instead: formatRange(
      agentConfig.base[AGENT_INTERRUPT_COMPARISON.instead].lo,
      agentConfig.base[AGENT_INTERRUPT_COMPARISON.instead].hi
    ),
  };

  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <Container>
        <EstimatorHeader
          title={agentCopy.title}
          estimate={estimate}
        />

        {/* ---- Body: question column (55) · diagram column (45) ---- */}
        <div className="mt-10 sm:mt-14 lg:grid lg:grid-cols-[11fr_9fr] lg:gap-x-14">
          <div className="max-w-[600px]">
            {stage === "interrupt" ? (
              <BranchBlock
                headingRef={headingRef}
                heading={agentCopy.interrupt.heading}
                body={agentCopy.interrupt.body(interruptRanges)}
                primary={agentCopy.interrupt.smaller}
                secondary={agentCopy.interrupt.keepGoing}
                onPrimary={flow.takeSmaller}
                onSecondary={flow.dismissInterrupt}
                onBack={flow.back}
              />
            ) : stage === "interstitial" ? (
              <BranchBlock
                headingRef={headingRef}
                heading={agentCopy.interstitial.heading}
                body={agentCopy.interstitial.body}
                primary={agentCopy.interstitial.keepGoing}
                secondary={agentCopy.interstitial.show}
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
                    flow.isFirstQuestion ? agentCopy.privacyNote : undefined
                  }
                  showBack={!flow.isFirstQuestion}
                  onBack={flow.back}
                />
              </div>
            ) : null}
          </div>

          {/* ---- Diagram column: assembles as answers come in ---- */}
          <div className="mt-12 border-t border-border pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="text-eyebrow text-tertiary">{panelLabel}</p>
            <ArchitectureDiagram
              state={diagramState(answers)}
              className="mt-6 max-w-[330px] lg:max-w-[420px]"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AgentEstimator;
