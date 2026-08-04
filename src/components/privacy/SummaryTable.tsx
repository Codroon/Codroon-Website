import { PRIVACY_SUMMARY } from "@/content/privacy";

/**
 * §2 — the summary table. A real semantic <table>: th scope="col" on the
 * headers, th scope="row" on the first cell of every row, so a screen
 * reader announces "Estimator answers, How long, 24 months" rather than
 * reading a grid of orphaned strings. Never divs, never cards.
 *
 * It carries visual weight on purpose: it sits above all the prose and
 * should read as the answer, with everything below it as the detail.
 *
 * Mobile: the table keeps a min-width and the WRAPPER scrolls, so no
 * cell is ever truncated and no column is ever dropped. The wrapper is
 * focusable with a name, which is what makes a scrollable region
 * keyboard-reachable, and a fade on the right edge is the visible
 * affordance that there is more to the right. The fade is a gradient of
 * the page surface, not an icon or a graphic.
 */
export function SummaryTable() {
  return (
    <div className="relative mt-10">
      <div
        role="region"
        aria-labelledby="everything-we-collect-h"
        tabIndex={0}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {/* 43.5rem is chosen, not arbitrary: the content column is 704px
            at the 768 breakpoint, so anything wider makes a tablet scroll
            32px for one clipped column. It fits there and scrolls only
            where it genuinely cannot fit. */}
        <table className="w-full min-w-[43.5rem] border-collapse text-left">
          <caption className="sr-only">
            Every category of data Codroon collects, why it exists, how long it
            is kept, and which providers can see it.
          </caption>
          <thead>
            <tr>
              {PRIVACY_SUMMARY.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`text-eyebrow border-b border-border pb-4 align-bottom text-tertiary ${
                    i === 0 ? "pr-6" : "px-6"
                  } ${i === PRIVACY_SUMMARY.columns.length - 1 ? "pr-0" : ""}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRIVACY_SUMMARY.rows.map((r) => (
              <tr key={r.what} className="border-b-[0.5px] border-border">
                <th
                  scope="row"
                  className="w-[22%] py-6 pr-6 align-top font-sans text-[1.0625rem] font-semibold leading-snug text-foreground"
                >
                  {r.what}
                </th>
                <td className="text-body w-[30%] px-6 py-6 align-top text-muted-foreground">
                  {r.why}
                </td>
                <td className="text-body w-[24%] px-6 py-6 align-top text-muted-foreground">
                  {r.howLong}
                </td>
                <td className="text-body w-[24%] py-6 pl-6 align-top text-muted-foreground">
                  {r.who}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* scroll affordance: only where the table cannot fit (below lg) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent sm:hidden"
      />
    </div>
  );
}

export default SummaryTable;
