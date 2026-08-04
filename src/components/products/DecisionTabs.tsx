"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { DecisionTab } from "@/content/products/types";

/**
 * DecisionTabs — the "three decisions" block.
 *
 * Progressive enhancement, same approach as AccordionRows: the server
 * renders EVERY panel open, so the whole argument is readable with
 * JavaScript disabled and by crawlers. A layout effect collapses to the
 * first panel before the first client paint.
 *
 * Keyboard: proper tablist semantics — roving tabindex, ←/→ to move
 * between tabs, Home/End to jump to the ends, and focus follows
 * selection (the APG "automatic activation" pattern, which suits panels
 * this cheap to render).
 */
export function DecisionTabs({
  tabs,
  label,
}: {
  tabs: DecisionTab[];
  /** Product name — the tablist's accessible name is per-product. */
  label: string;
}) {
  const [active, setActive] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => setHydrated(true), []);

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  const select = (i: number) => {
    const next = ((i % tabs.length) + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        select(i + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        select(i - 1);
        break;
      case "Home":
        e.preventDefault();
        select(0);
        break;
      case "End":
        e.preventDefault();
        select(tabs.length - 1);
        break;
    }
  };

  return (
    <div className="mt-10">
      <div
        role="tablist"
        /* was hardcoded to ReplyDude, so every other product announced
           the wrong name to screen readers */
        aria-label={`Decisions that shaped ${label}`}
        className="flex flex-col gap-1 sm:flex-row sm:gap-2"
      >
        {tabs.map((tab, i) => {
          const selected = hydrated && i === active;
          return (
            <button
              key={tab.tab}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={selected}
              aria-controls={panelId(i)}
              tabIndex={selected || !hydrated ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "text-small flex min-h-[44px] flex-1 items-center rounded-[var(--radius-sm)] border px-4 py-3 text-left font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                /* Selected tab is an accent surface — text on orange is
                   always --accent-foreground (light-on-orange fails
                   contrast, per the brand sheet). */
                selected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              {tab.tab}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.tab}
          role="tabpanel"
          id={panelId(i)}
          aria-labelledby={tabId(i)}
          tabIndex={0}
          /* Pre-hydration every panel is visible — the content is the
             point, and it must survive JS being off. */
          hidden={hydrated && i !== active}
          className="mt-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-8"
        >
          <h3 className="text-h3 text-foreground">{tab.heading}</h3>
          <div className="mt-4 space-y-4">
            {tab.paragraphs.map((p, pi) => (
              <p
                key={pi}
                className="text-[0.95rem] leading-relaxed text-muted-foreground"
              >
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
            {tab.bullets.map((b) => (
              <li
                key={b}
                className="text-small flex gap-3 text-muted-foreground"
              >
                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-accent-dim" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default DecisionTabs;
