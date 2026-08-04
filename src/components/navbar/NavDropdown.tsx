"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
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
 */
export function NavDropdown({ item, isOpen, onOpen, onClose, isActive }: Props) {
  const reduced = usePrefersReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  // On touch, a single tap fires mouseenter (opens) THEN click — without
  // this guard the click would immediately toggle the panel closed again.
  const openedAtRef = useRef(0);
  const panelId = `nav-panel-${item.label.toLowerCase()}`;

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
      if (isOpen) onClose(true);
      else {
        onOpen();
        requestAnimationFrame(() => focusItem(0));
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onOpen();
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "Escape") {
      onClose(true);
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
      onClose(true);
    } else if (e.key === "Tab") {
      // leaving the panel closes it
      onClose(false);
    }
  };

  // return focus to trigger when closing via Escape
  const handleClose = (returnFocus = false) => {
    onClose(returnFocus);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, item.items.length);
  }, [item.items.length]);

  const anyActive = item.items.some((i) => isActive(i.href));

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={() => onClose(false)}
    >
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            role="menu"
            aria-label={item.label}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: easeOutExpo }}
            className="absolute left-0 top-full z-50 mt-3 w-[20rem] origin-top-left rounded-[var(--radius-lg)] border border-border bg-surface/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
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
                  onClick={() => onClose(false)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavDropdown;