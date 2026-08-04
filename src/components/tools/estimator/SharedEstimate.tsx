"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { recomputeFromSnapshot, type PricingSnapshot } from "@/pricing/calculate";
import type { Answers } from "@/pricing/types";
import { ArchitectureDiagram, diagramState } from "./ArchitectureDiagram";
import { BuildPlanPanel } from "./BuildPlanPanel";
import { EstimatorResults } from "./EstimatorResults";
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
}: {
  tool: "agent" | "mvp";
  snapshot: PricingSnapshot;
  answers: Answers;
  display: { eyebrow: string; metaLine: string; panelLabel: string } | null;
}) {
  const [activeCuts, setActiveCuts] = useState<string[]>([]);
  const estimate = recomputeFromSnapshot(snapshot, activeCuts);
  const copy = tool === "agent" ? agentCopy : mvpCopy;

  const toggle = (id: string) =>
    setActiveCuts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <EstimatorResults
        copy={copy}
        estimate={estimate}
        eyebrow={display?.eyebrow ?? "Your estimate"}
        metaLine={display?.metaLine ?? estimate.timelineLabel}
        panelLabel={display?.panelLabel ?? "Your build"}
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
        }
        onToggleCut={toggle}
      />
    </div>
  );
}

export default SharedEstimate;
