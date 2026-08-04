import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  /** show the leading section number, e.g. "01" */
  number?: string;
  className?: string;
};

/**
 * Eyebrow / Kicker — mono, uppercase, tracked label that sits above
 * headings. The "engineering studio" signal. Optionally pairs a
 * monospace section number with a short label.
 */
export function Eyebrow({ children, number, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center gap-2.5 text-muted-foreground",
        className
      )}
    >
      {number && (
        <>
          {/* numerals are not actions — accent-dim, never accent */}
          <span className="text-accent-dim">{number}</span>
          <span aria-hidden className="h-px w-6 bg-border" />
        </>
      )}
      {children}
    </span>
  );
}

export default Eyebrow;