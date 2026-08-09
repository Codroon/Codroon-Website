import type { Estimate } from "@/pricing/types";
import { agentCopy } from "./copy/agentCopy";

/**
 * The agent estimator's run-cost receipt.
 *
 * This used to be written inline into AgentEstimator's `belowFold`
 * prop. SharedEstimate replaces that same slot wholesale with its own
 * "run your own estimate" block, so a forwarded agent estimate lost the
 * panel entirely while its meta line still advertised a monthly figure
 * (client, 2026-08-09). Extracting it means both callers render the one
 * component and neither can drop it by owning the slot.
 *
 * Renders nothing when the estimate carries no run cost, which is every
 * MVP estimate and the simplest agent builds, so callers can mount it
 * unconditionally.
 *
 * Text on accent is ALWAYS #232220.
 */
export function RunCostPanel({
  estimate,
  className = "mt-20 max-w-[600px]",
}: {
  estimate: Estimate;
  className?: string;
}) {
  const runCost = estimate.runCost;
  const copy = agentCopy.results.runCost;
  if (!runCost || !copy) return null;

  return (
    <section className={className} aria-labelledby="est-run-h">
      <div className="rounded-[var(--radius-lg)] bg-accent p-6 sm:p-8">
        <h2 id="est-run-h" className="text-eyebrow text-accent-foreground">
          {copy.label}
        </h2>
        <p className="mt-3 max-w-[56ch] text-[0.9rem] leading-relaxed text-accent-foreground">
          {copy.covers}
        </p>
        <div className="mt-5 flex items-baseline justify-between gap-6 border-t-[0.5px] border-accent-foreground/25 pt-4">
          <span className="text-[0.95rem] font-medium text-accent-foreground">
            {copy.totalLabel}
          </span>
          <span className="text-mono whitespace-nowrap text-[0.95rem] font-medium text-accent-foreground">
            {runCost.label}
          </span>
        </div>
      </div>
    </section>
  );
}

export default RunCostPanel;
