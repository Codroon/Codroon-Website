import type { ComparisonRow } from "@/content/services/types";

/**
 * SemanticComparisonTable — the one comparison-table implementation,
 * shared by the service pages and the tool landing pages. Real
 * semantic <table>: <th scope="col"> headers, <th scope="row"> first
 * column, sr-only caption, horizontally scrollable wrapper, cells
 * never truncated. Featured-snippet eligibility depends on this
 * markup — do not swap it for divs or a grid.
 */
export function SemanticComparisonTable({
  caption,
  columns,
  rows,
  highlightColumn = 0,
  /** visible first-column header; sr-only "Comparison point" when absent */
  cornerHeader,
  className,
}: {
  caption: string;
  columns: string[];
  rows: ComparisonRow[];
  highlightColumn?: number;
  cornerHeader?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-[var(--radius-lg)] border border-border ${className ?? ""}`}
    >
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border-strong">
            <th
              scope="col"
              className={
                cornerHeader
                  ? "px-5 py-4 font-sans text-[0.95rem] font-semibold text-foreground"
                  : "px-5 py-4"
              }
            >
              {cornerHeader ?? <span className="sr-only">Comparison point</span>}
            </th>
            {columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={
                  i === highlightColumn
                    ? "bg-surface px-5 py-4 font-sans text-[0.95rem] font-semibold text-accent"
                    : "px-5 py-4 font-sans text-[0.95rem] font-semibold text-foreground"
                }
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-b-0">
              <th
                scope="row"
                className="px-5 py-4 font-sans text-[0.95rem] font-medium text-foreground"
              >
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={
                    i === highlightColumn
                      ? "bg-surface px-5 py-4 text-[0.95rem] text-foreground"
                      : "px-5 py-4 text-[0.95rem] text-muted-foreground"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SemanticComparisonTable;
