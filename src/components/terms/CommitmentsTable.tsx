import { TERMS_COMMITMENTS } from "@/content/terms";

/**
 * §2 — the commitments table, and the idea of this page.
 *
 * Almost every terms document lists one side: what the client owes and
 * what the company is not liable for. This one runs both ways in a
 * single table, which is why the two columns are peers: th scope="col"
 * on BOTH headers and no row headers, because neither side is
 * subordinate to the other.
 *
 * A real <table>, never cards. On mobile the wrapper scrolls rather than
 * any cell being truncated, with a fade as the affordance, matching the
 * privacy page's tables.
 */
export function CommitmentsTable() {
  return (
    <div className="relative mt-10">
      <div
        role="region"
        aria-labelledby="commitments-h"
        tabIndex={0}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">
            What Codroon commits to on an engagement, beside what Codroon needs
            from the client.
          </caption>
          <thead>
            <tr>
              {TERMS_COMMITMENTS.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`text-eyebrow w-1/2 border-b border-border pb-4 align-bottom text-tertiary ${
                    i === 0 ? "pr-8" : "pl-8"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TERMS_COMMITMENTS.rows.map((r) => (
              <tr key={r.us} className="border-b-[0.5px] border-border">
                <td className="w-1/2 py-6 pr-8 align-top font-sans text-[1.0625rem] leading-snug text-foreground">
                  {r.us}
                </td>
                <td className="text-body w-1/2 py-6 pl-8 align-top text-muted-foreground">
                  {r.you}
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

export default CommitmentsTable;
