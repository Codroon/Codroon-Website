"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/contact/ContactModalContext";
import { navItems, navCta, isDropdown } from "@/config/nav";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
};

/**
 * MobileMenu — immersive full-screen overlay. Dropdowns become
 * height-animated accordions. Locks body scroll, traps focus, closes
 * on Escape / link tap / route change (route change handled by parent).
 */
export function MobileMenu({ isOpen, onClose, isActive }: Props) {
  const reduced = usePrefersReducedMotion();
  const { open: openContactModal } = useContactModal();
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // focus trap + Escape
  useEffect(() => {
    if (!isOpen) return;
    const root = panelRef.current;
    if (!root) return;

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const stagger = (i: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, ease: easeOutExpo, delay: 0.06 * i },
        };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: easeOutExpo }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background px-6 pb-10 pt-24 lg:hidden"
        >
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item, i) => {
              if (!isDropdown(item)) {
                const active = isActive(item.href);
                return (
                  <motion.div key={item.label} {...stagger(i)}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // serif is reserved for hero H1 / section H2s — nav is sans
                        "block py-4 font-sans text-3xl font-medium transition-colors",
                        active ? "text-accent" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              }

              const open = expanded === item.label;
              return (
                <motion.div
                  key={item.label}
                  {...stagger(i)}
                  className="border-b border-border/60"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setExpanded(open ? null : item.label)}
                    className="flex w-full items-center justify-between py-4 font-sans text-3xl font-medium text-foreground"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "transition-transform duration-300",
                        open && "rotate-180 text-accent"
                      )}
                      aria-hidden
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={
                          reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }
                        }
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: easeOutExpo }}
                        className="overflow-hidden"
                      >
                        {/* One hairline down the left is the whole
                            hierarchy signal, the same language as the
                            rules on /about and the legal pages.

                            It replaces a per-item dot (client,
                            2026-08-04): the dots sat at ~10px while the
                            labels started at ~34px, aligning with
                            neither each other nor the parent row, and
                            each dot needed a hard-coded translate-y
                            nudge to fake baseline alignment. Now every
                            child label starts on ONE column and the
                            vertical fudge is gone. */}
                        <div className="mb-3 flex flex-col border-l border-border pl-5">
                          {item.items.map((leaf) => {
                            const active = isActive(leaf.href);
                            return (
                              <Link
                                key={leaf.href}
                                href={leaf.href}
                                onClick={onClose}
                                aria-current={active ? "page" : undefined}
                                // min-h keeps every row a real tap target
                                // even when it is a single short label
                                className="flex min-h-[44px] flex-col justify-center py-2"
                              >
                                <span
                                  className={cn(
                                    "text-lg transition-colors",
                                    active ? "text-accent" : "text-foreground"
                                  )}
                                >
                                  {leaf.label}
                                </span>
                                {leaf.descriptor && (
                                  <span className="text-small text-muted-foreground">
                                    {leaf.descriptor}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          {/* CTA pinned near the bottom — opens the shared contact modal */}
          <motion.div {...stagger(navItems.length)} className="mt-8">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                onClose();
                openContactModal();
              }}
            >
              {navCta.label}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;