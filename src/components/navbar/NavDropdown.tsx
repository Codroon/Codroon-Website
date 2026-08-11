"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavDropdown as NavDropdownType } from "@/config/nav";

type Props = {
  item: NavDropdownType;
  isOpen: boolean;
  onOpen: () => void;
  onClose: (returnFocus?: boolean) => void;
  isActive: (href: string) => boolean;
};

/**
 * NavDropdown — desktop dropdown. Opens on hover, focus and click;
 * renders a panel of label + descriptor rows. Arrow keys move between
 * items, Escape closes and returns focus to the trigger.
 *
 * This component only ever OPENS on hover. Closing on hover is owned by
 * Navbar, at the level of the whole <nav>, because the pointer has to
 * cross ground that belongs to no single dropdown on its way from a
 * trigger to an option. See the note on the nav element there.
 */
export function NavDropdown({ item, isOpen, onOpen, onClose, isActive }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  // On touch, a single tap fires mouseenter (opens) THEN click — without
  // this guard the click would immediately toggle the panel closed again.
  const openedAtRef = useRef(0);
  const panelId = `nav-panel-${item.label.toLowerCase()}`;

  // onOpen also cancels any pending close scheduled by the nav
  const openNow = () => {
    openedAtRef.current = Date.now();
    onOpen();
  };

  // when opened via keyboard, focus the first item
  const focusItem = (i: number) => {
    const els = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!els.length) return;
    const idx = (i + els.length) % els.length;
    els[idx]?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen) handleClose(true);
      else {
        onOpen();
        requestAnimationFrame(() => focusItem(0));
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onOpen();
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "Escape") {
      handleClose(true);
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(index - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClose(true);
    } else if (e.key === "Tab") {
      // leaving the panel closes it
      handleClose(false);
    }
  };

  // Close at once — Escape, Tab, click, choosing an item. Never waits
  // on the hover grace period. Returns focus to the trigger on Escape.
  const handleClose = (returnFocus = false) => {
    onClose(returnFocus);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, item.items.length);
  }, [item.items.length]);

  const anyActive = item.items.some((i) => isActive(i.href));

  // No onMouseLeave here. Leaving THIS group is not the same as leaving
  // the menu: the run from a trigger to an option crosses the nav's own
  // background, and treating that as an exit is what made the options
  // unreachable. Navbar closes on leaving the whole nav.
  return (
    <div className="relative" onMouseEnter={openNow}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          if (!isOpen) return openNow();
          // ignore the synthetic click that follows a tap-triggered
          // mouseenter-open in the same gesture (tap-to-open on touch)
          if (Date.now() - openedAtRef.current > 400) handleClose();
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "group inline-flex min-h-[44px] items-center gap-1 py-2 text-[0.95rem] font-medium transition-colors duration-200",
          anyActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="relative">
          {item.label}
          <span
            className={cn(
              "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100",
              isOpen && "scale-x-100"
            )}
          />
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {/* ALWAYS RENDERED, never unmounted.

          This panel used to be wrapped in {isOpen && ...}, so the six
          service links, both product links and both calculator links
          existed only after a click. In the server HTML and in the
          hydrated DOM before interaction the entire <header> held three
          anchors, which made the footer the site's only crawlable
          navigation. The footer had no Tools column, so the two cost
          calculators, the highest commercial-intent pages on the site,
          had zero internal links from the homepage, the header, the
          footer or any service page (client, 2026-08-09).

          Hidden with CSS rather than unmounted: visibility:hidden keeps
          the anchors in the document for crawlers while taking them out
          of the tab order, and aria-hidden takes them out of the
          accessibility tree, so a closed menu is not announced. The
          fade is a CSS transition now; framer cannot animate an element
          it does not mount, and a mounted-but-hidden panel is the whole
          point. */}
      {/* HOVER BRIDGE.

          The 12px between the trigger and the panel used to be `mt-3`
          on the panel itself. The panel is absolutely positioned, so it
          adds nothing to this group's box, which meant the group's
          hover area stopped at the bottom of the button and that 12px
          belonged to nobody: the element under the pointer there was
          the header's own container. Crossing it fired mouseleave and
          the panel shut before you reached a single option.

          It only ever worked if the pointer jumped the strip inside one
          mousemove, which is why it felt random — a fast flick got
          through, aiming at an option did not (client, 2026-08-11).

          So the gap now lives INSIDE the hover area as padding on this
          wrapper. It looks identical; it is simply no longer dead.

          The wrapper carries the visibility switch, not the card. The
          panel stays mounted at all times for crawlers, and a wrapper
          that stayed visible would sit over a 320px-wide patch of the
          page swallowing clicks. visibility:hidden is not hit-tested
          and is inherited, so one class covers the card too. */}
      <div
        className={cn(
          "absolute left-0 top-full z-50 pt-3",
          isOpen ? "visible" : "invisible"
        )}
      >
        <div
          id={panelId}
          role="menu"
          aria-label={item.label}
          aria-hidden={!isOpen}
          className={cn(
            "w-[20rem] origin-top-left rounded-[var(--radius-lg)] border border-border bg-surface/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl",
            "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-1 scale-[0.98] opacity-0"
          )}
        >
          {item.items.map((leaf, i) => {
            const active = isActive(leaf.href);
            return (
              <Link
                key={leaf.href}
                href={leaf.href}
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                aria-current={active ? "page" : undefined}
                onKeyDown={(e) => onItemKeyDown(e, i)}
                onClick={() => handleClose(false)}
                className={cn(
                  "group/item flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors duration-150",
                  active ? "bg-surface-2" : "hover:bg-surface-2"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-150",
                    active
                      ? "bg-accent"
                      : "bg-border group-hover/item:bg-accent"
                  )}
                />
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-medium text-foreground">
                    {leaf.label}
                  </span>
                  {leaf.descriptor && (
                    <span className="text-small block text-muted-foreground">
                      {leaf.descriptor}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NavDropdown;