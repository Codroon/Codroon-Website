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
          {/* Numerals are informative, so they need 4.5:1. --accent-dim
                    could not reach it on either surface without becoming the
                    accent itself, so it is decoration-only now. */}
          <span className="text-muted-foreground">{number}</span>
          <span aria-hidden className="h-px w-6 bg-border" />
        </>
      )}
      {children}
    </span>
  );
}

export default Eyebrow;