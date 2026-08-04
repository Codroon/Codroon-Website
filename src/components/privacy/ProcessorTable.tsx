import { PRIVACY_PROCESSORS } from "@/content/privacy";

/**
 * §9 — the processor table. Same semantics as the summary table:
 * th scope="col" on the headers, th scope="row" on the provider name,
 * a real <table>, and the wrapper scrolls rather than any cell being
 * truncated or any column being dropped.
 */
export function ProcessorTable() {
  return (
    <div className="relative mt-10">
      <div
        role="region"
        aria-labelledby="who-processes-your-data-h"
        tabIndex={0}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">
            Every provider that processes data on Codroon&apos;s behalf, what it
            handles, and where it operates.
          </caption>
          <thead>
            <tr>
              {PRIVACY_PROCESSORS.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`text-eyebrow border-b border-border pb-4 align-bottom text-tertiary ${
                    i === 0 ? "pr-6" : "pl-6"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRIVACY_PROCESSORS.rows.map((r) => (
              <tr key={r.provider} className="border-b-[0.5px] border-border">
                <th
                  scope="row"
                  className="w-[28%] py-5 pr-6 align-top font-sans text-[1.0625rem] font-semibold leading-snug text-foreground"
                >
                  {r.provider}
                </th>
                <td className="text-body w-[46%] py-5 pl-6 align-top text-muted-foreground">
                  {r.handles}
                </td>
                <td className="text-body w-[26%] py-5 pl-6 align-top text-muted-foreground">
                  {r.where}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent sm:hidden"
      />
    </div>
  );
}

export default ProcessorTable;
