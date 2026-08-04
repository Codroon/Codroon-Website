import { cn } from "@/lib/utils";
import type { Answers } from "@/pricing/types";

/**
 * BuildPlanPanel — a week-by-week build plan that assembles as answers
 * come in (the MVP estimator's right panel; deliberately NOT a system
 * diagram). Vertical timeline: hairline rail, week nodes, mono week
 * labels, sans titles.
 *
 * Rows are derived from the answers, and the week numbers run
 * sequentially across whatever is visible — the authoritative timeline
 * is the header label, which comes from the estimate.
 *
 * The ONLY accent element is the current-week marker: one filled node
 * on the row that appeared last. Rows mount with the global anim-rise
 * entrance, which the reduced-motion rule freezes to instant.
 */

type PlanRow = { title: string; sub?: string };

/** Week 1's sub-label depends on what the founder already has. */
const DESIGN_SUBLABEL: Record<string, string> = {
  designs: "Custom design",
  spec: "Design system",
  neither: "Design system",
};

export function buildPlanRows(answers: Answers): PlanRow[] {
  if (answers.type === undefined) return [];

  const rows: PlanRow[] = [];
  const have = typeof answers.have === "string" ? answers.have : undefined;

  rows.push({
    title: "Design and foundation",
    sub: have ? DESIGN_SUBLABEL[have] ?? "Design system" : undefined,
  });

  if (answers.type === "landing-waitlist") {
    rows.push({ title: "Page, capture and analytics" });
    return rows;
  }

  rows.push({ title: "Core product (first user type)" });

  if (answers.users === "two") rows.push({ title: "Second user type" });
  if (answers.users === "three-plus") rows.push({ title: "Additional user types" });

  if (answers.money === "subscriptions") {
    rows.push({ title: "Subscriptions and billing" });
  }
  if (answers.money === "between-users") {
    rows.push({ title: "Payments between users" });
  }

  const integrations = Number(answers.integrations);
  const ai = typeof answers.ai === "string" ? answers.ai : undefined;
  if (integrations > 0 && ai && ai !== "none") {
    rows.push({ title: "Integrations and AI" });
  } else if (integrations > 0) {
    rows.push({ title: "Integrations" });
  } else if (ai && ai !== "none") {
    rows.push({ title: ai === "is-the-product" ? "The model itself" : "AI feature" });
  }

  return rows;
}

export function BuildPlanPanel({
  answers,
  /** pin the marker (results screen shows the plan complete) */
  markerIndex,
  /**
   * The estimate's upper timeline bound. Cuts can compress a build
   * below the number of phases, and a plan that counts to week 5 beside
   * a "1–2 weeks" headline contradicts it — so week numbers are clamped
   * and later phases share a week.
   */
  maxWeeks,
  className,
}: {
  answers: Answers;
  markerIndex?: number;
  maxWeeks?: number;
  className?: string;
}) {
  const rows = buildPlanRows(answers);
  const marker = markerIndex ?? rows.length - 1;
  const weekFor = (i: number) =>
    maxWeeks ? Math.min(i + 1, Math.max(1, Math.ceil(maxWeeks))) : i + 1;

  // ghost state — nothing answered yet: a faint week-1 skeleton marks
  // where the plan will assemble (mirrors the agent diagram's ghost)
  if (rows.length === 0) {
    return (
      <div className={className} aria-hidden="true">
        <div className="flex gap-4 opacity-40">
          <div className="flex flex-col items-center pt-1.5">
            <span className="size-2 rounded-full border border-border-strong" />
            <span className="mt-1 h-10 w-px bg-border" />
          </div>
          <p className="text-mono text-[0.7rem] uppercase tracking-[0.14em] text-tertiary">
            Week 1
          </p>
        </div>
      </div>
    );
  }

  return (
    <ol className={className} aria-label="Build plan, week by week">
      {rows.map((row, i) => {
        const isMarked = i === marker;
        return (
          <li key={`${row.title}-${i}`} className="anim-rise flex gap-4">
            {/* rail: node + hairline connector */}
            <div className="flex flex-col items-center pt-1.5" aria-hidden="true">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  isMarked ? "bg-accent" : "border border-border-strong bg-transparent"
                )}
              />
              {i < rows.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            {/* row content */}
            <div className={cn("pb-7", i === rows.length - 1 && "pb-0")}>
              <p className="text-mono text-[0.7rem] uppercase tracking-[0.14em] text-tertiary">
                Week {weekFor(i)}
                {isMarked && <span className="sr-only"> (current week)</span>}
              </p>
              <p className="mt-1 text-[0.95rem] leading-snug text-foreground">
                {row.title}
              </p>
              {row.sub && (
                <p className="mt-0.5 text-[0.85rem] text-muted-foreground">{row.sub}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default BuildPlanPanel;
