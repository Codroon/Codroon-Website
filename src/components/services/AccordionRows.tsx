"use client";
import { useId, useLayoutEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  heading: ReactNode;
  content: ReactNode;
};

/**
 * AccordionRows — progressive-enhancement accordion.
 *
 * SSR/no-JS: every row renders EXPANDED, so all content is in the
 * server HTML and fully readable without JavaScript. After hydration
 * (before first paint, via useLayoutEffect) rows collapse to
 * first-open and behave as a normal accordion.
 *
 * A11y: native <button> headers (full keyboard), aria-expanded +
 * aria-controls, labelled regions, ≥44px touch targets. Collapse
 * animation is a CSS grid-rows transition — frozen by the global
 * reduced-motion rule.
 */
export function AccordionRows({ items }: { items: AccordionItem[] }) {
  const uid = useId();
  // SSR initial state: ALL open (no-JS never collapses).
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(items.map((i) => i.id))
  );
  const [hydrated, setHydrated] = useState(false);

  // Collapse to first-open before first client paint.
  useLayoutEffect(() => {
    setOpen(new Set(items.length ? [items[0].id] : []));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const buttonId = `${uid}-${item.id}-btn`;
        const panelId = `${uid}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-t border-border last:border-b">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-[44px] w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-sans text-lg font-semibold text-foreground sm:text-xl">
                  {item.heading}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={cn(
                    "shrink-0 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180 text-accent-dim"
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              /* A collapsed panel is zero-height via grid-rows-[0fr],
                 which hides it visually but leaves it in the
                 accessibility tree and its links in the tab order. So
                 the trigger said aria-expanded="false" while a screen
                 reader could still read the panel and a keyboard user
                 could tab into invisible links (client, 2026-08-09).

                 `inert` removes both at once. Only once hydrated:
                 before that every panel is force-expanded so the copy
                 is readable without JavaScript, and marking it inert
                 then would take the FAQ answers out of the
                 accessibility tree for exactly the users who need the
                 no-JS fallback. Crawlers are unaffected either way,
                 since inert does not remove anything from the DOM. */
              inert={hydrated && !isOpen ? true : undefined}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
              // before hydration the inline style guarantees expanded rows
              style={hydrated ? undefined : { gridTemplateRows: "1fr" }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="max-w-3xl pb-6 pr-10 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AccordionRows;
