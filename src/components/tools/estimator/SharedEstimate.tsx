"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { recomputeFromSnapshot, type PricingSnapshot } from "@/pricing/calculate";
import type { Answers } from "@/pricing/types";
import { ArchitectureDiagram, diagramState } from "./ArchitectureDiagram";
import { BuildPlanPanel } from "./BuildPlanPanel";
import { describeFor } from "./describe";
import { EstimatorResults } from "./EstimatorResults";
import { RunCostPanel } from "./RunCostPanel";
import { agentCopy } from "./copy/agentCopy";
import { mvpCopy, MVP_WHAT_NOT_TO_CUT } from "./copy/mvpCopy";

/**
 * A shared estimate at /e/[code]. Read-only: no question flow, no
 * editing, and nothing is ever written back.
 *
 * The sandbox stays interactive because the stored snapshot carries the
 * per-cut factors, so any combination replays client-side against the
 * numbers as they were when the estimate was made — not against
 * whatever the pricing config says today.
 */
export function SharedEstimate({
  tool,
  snapshot,
  answers,
  display,
  initialCuts,
  shortCode,
}: {
  tool: "agent" | "mvp";
  snapshot: PricingSnapshot;
  answers: Answers;
  display: { eyebrow: string; metaLine: string; panelLabel: string } | null;
  /** the cut selection the sender had applied when they shared it */
  initialCuts?: string[];
  /** carried on the quote and email leads so they attribute correctly */
  shortCode?: string | null;
}) {
  /* The sender's cuts, not an empty set. Starting empty meant a link
     sent showing $17,500–$22,500 opened at $29,500–$37,500 for the
     recipient, a 47% jump on the one artifact that gets forwarded to a
     prospect (client, 2026-08-09). The estimator's own resume-by-code
     path already restored these from the same row, so the data was
     always there and only this page discarded it. */
  const [activeCuts, setActiveCuts] = useState<string[]>(initialCuts ?? []);
  const estimate = recomputeFromSnapshot(snapshot, activeCuts);
  const copy = tool === "agent" ? agentCopy : mvpCopy;

  /* Derive the strings from the estimate on screen rather than the
     `display` object frozen at save time. The stored one was computed
     with the sender's cuts, so the moment the recipient toggles a
     checkbox it describes a different estimate: that is what put
     "2–3 weeks" in the meta line above a table reading "5–6 weeks".
     `display` stays as a fallback for rows written before the snapshot
     carried enough to redescribe. */
  const described = describeFor(tool)(answers, estimate);

  const toggle = (id: string) =>
    setActiveCuts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <EstimatorResults
        copy={copy}
        estimate={estimate}
        eyebrow={described.eyebrow || display?.eyebrow || "Your estimate"}
        metaLine={described.metaLine || estimate.timelineLabel}
        panelLabel={described.panelLabel || display?.panelLabel || "Your build"}
        shortCode={shortCode}
        panel={
          tool === "agent" ? (
            <ArchitectureDiagram
              state={diagramState(answers)}
              className="max-w-[330px] lg:max-w-[420px]"
            />
          ) : (
            <BuildPlanPanel
              answers={answers}
              markerIndex={0}
              maxWeeks={estimate.weeksHi}
              className="max-w-[420px]"
            />
          )
        }
        afterSandbox={
          tool === "mvp" ? (
            <div className="mt-10 rounded-[var(--radius-lg)] bg-accent p-6 sm:p-7">
              <p className="text-eyebrow text-accent-foreground">
                {MVP_WHAT_NOT_TO_CUT.label}
              </p>
              <p className="mt-3 max-w-[56ch] text-[0.95rem] leading-relaxed text-accent-foreground">
                {MVP_WHAT_NOT_TO_CUT.body}
              </p>
            </div>
          ) : undefined
        }
        belowFold={
          <>
            {/* The run-cost receipt belongs to the agent results screen.
                This slot used to be replaced wholesale, which is how a
                shared agent estimate lost the panel while its meta line
                still quoted a monthly figure. Rendering the shared
                component here keeps both callers honest. */}
            <RunCostPanel estimate={estimate} />
            <section className="mt-20 max-w-[600px]">
            <p className="text-[1.0625rem] leading-relaxed text-muted-foreground">
              This is someone&rsquo;s saved estimate. Run your own: six
              questions, about three minutes, no email needed to see the number.
            </p>
            <div className="mt-6">
              {/* noreferrer: the short code is in this page's URL, and a
                  Referer header would carry it wherever the visitor
                  goes next */}
              <Button
                rel="noreferrer"
                href={
                  tool === "agent"
                    ? "/tools/ai-agent-cost-calculator/estimate"
                    : "/tools/mvp-cost-calculator/estimate"
                }
              >
                Run your own estimate
              </Button>
            </div>
            </section>
          </>
        }
        onToggleCut={toggle}
      />
    </div>
  );
}

export default SharedEstimate;
