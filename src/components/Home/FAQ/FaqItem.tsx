"use client";
import { cn } from "@/lib/utils";
import type { Faq } from "./data";

/**
 * FaqItem — accessible disclosure. Trigger is a <button> with
 * aria-expanded + aria-controls → the answer panel. Height animates via
 * the modern grid-template-rows 0fr→1fr transition (no max-height hack);
 * reduced motion freezes it to instant via the global CSS rule.
 */
export function FaqItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: Faq;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");
  const triggerId = `faq-trigger-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-border">
      <h3 className="m-0">
        <button
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-start gap-4 py-5 text-left"
        >
          <span
            className={cn(
              "text-mono mt-1 text-sm transition-colors",
              open ? "text-accent" : "text-muted-foreground"
            )}
          >
            {num}
          </span>
          <span
            className={cn(
              "flex-1 font-sans text-lg font-medium transition-colors",
              open ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
            )}
          >
            {item.q}
          </span>
          {/* + morphs to × on open (rotate 45°) */}
          <span
            aria-hidden
            className={cn(
              "relative mt-1 h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open ? "rotate-45 text-accent" : "rotate-0 text-muted-foreground"
            )}
          >
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-3.5 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-current" />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "max-w-prose pb-6 pl-10 pr-2 text-[0.95rem] leading-relaxed text-muted-foreground transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FaqItem;