"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PostToc — "Summary": the table of contents built from the post's H2s
 * (never H3s), with the section currently in view highlighted.
 *
 * Progressive enhancement, deliberately: the list itself is plain
 * anchors that work with JavaScript disabled, and the only thing the
 * client adds is which one is highlighted. Nothing about navigating the
 * post depends on this component hydrating.
 *
 * `variant="mobile"` renders it as a <details> block that sits under
 * the H1 and starts closed, for viewports where the rail is gone.
 */

export type TocItem = { id: string; heading: string };

function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        // topmost visible section wins, so scrolling up highlights the
        // section you are entering rather than the one you are leaving
        const first = ids.find((id) => seen.get(id));
        if (first) setActive(first);
      },
      // a band across the upper-middle of the viewport: a heading counts
      // as "current" once it is near the top, not when it first appears
      { rootMargin: "-96px 0px -55% 0px", threshold: 0 }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function TocList({
  items,
  active,
  onNavigate,
}: {
  items: TocItem[];
  active: string | null;
  onNavigate?: () => void;
}) {
  return (
    <ol className="space-y-1">
      {items.map((item, i) => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex min-h-[44px] items-start gap-3 border-l-2 py-2 pl-4 text-[0.9rem] leading-snug transition-colors",
                isActive
                  ? "border-accent text-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              <span aria-hidden className="text-mono mt-px text-xs text-accent-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">{item.heading}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function PostToc({
  items,
  variant = "rail",
}: {
  items: TocItem[];
  variant?: "rail" | "mobile";
}) {
  const active = useActiveSection(items.map((i) => i.id));
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  if (variant === "mobile") {
    return (
      // <details> so it is operable, and open-able, without JS
      <details
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
        className="mt-8 rounded-[var(--radius-md)] border border-border bg-surface lg:hidden"
      >
        <summary className="text-eyebrow flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 py-3 text-tertiary [&::-webkit-details-marker]:hidden">
          Summary
          <ChevronDown
            size={16}
            aria-hidden
            className={cn("transition-transform", open && "rotate-180")}
          />
        </summary>
        <div className="px-4 pb-4">
          <TocList items={items} active={active} onNavigate={() => setOpen(false)} />
        </div>
      </details>
    );
  }

  return (
    <nav aria-labelledby="post-toc-h">
      <h2 id="post-toc-h" className="text-eyebrow text-tertiary">
        Summary
      </h2>
      <div className="mt-4">
        <TocList items={items} active={active} />
      </div>
    </nav>
  );
}

export default PostToc;
