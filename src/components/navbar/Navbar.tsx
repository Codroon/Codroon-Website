"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/contact/ContactModalContext";
import { navItems, navCta, isDropdown } from "@/config/nav";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";

const SCROLL_THRESHOLD = 24;

export function Navbar() {
  const pathname = usePathname();
  const { open: openContactModal } = useContactModal();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // active-route check (hash/anchor links never count as "active")
  const isActive = useCallback(
    (href: string) => {
      if (!href.startsWith("/") || href.includes("#")) return false;
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname]
  );

  // performant scroll listener (rAF-throttled)
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // close everything on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // close dropdowns on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openDropdown]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1240px] items-center justify-between px-6 transition-[padding] duration-300 sm:px-8 lg:px-12",
            scrolled ? "py-3" : "py-5"
          )}
        >
          {/* Wordmark only — the hexagon mark is unreadable at nav scale */}
          <Link href="/" aria-label="Codroon — home" className="relative z-50 flex min-h-[44px] shrink-0 items-center">
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <NavDropdown
                  key={item.label}
                  item={item}
                  isOpen={openDropdown === item.label}
                  onOpen={() => setOpenDropdown(item.label)}
                  onClose={() => setOpenDropdown(null)}
                  isActive={isActive}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "group py-2 text-[0.95rem] font-medium transition-colors duration-200",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative">
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100",
                        isActive(item.href) && "scale-x-100"
                      )}
                    />
                  </span>
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA — opens the shared contact modal */}
          <div className="hidden lg:block">
            <Button onClick={() => openContactModal()}>{navCta.label}</Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((p) => !p)}
            className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-6">
              <motion.span
                className="absolute left-0 block h-px w-6 bg-foreground"
                animate={
                  mobileOpen ? { rotate: 45, top: 7 } : { rotate: 0, top: 2 }
                }
                transition={{ duration: 0.25 }}
                style={{ top: 2 }}
              />
              <motion.span
                className="absolute left-0 top-[7px] block h-px w-6 bg-foreground"
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 block h-px w-6 bg-foreground"
                animate={
                  mobileOpen ? { rotate: -45, top: 7 } : { rotate: 0, top: 12 }
                }
                transition={{ duration: 0.25 }}
                style={{ top: 12 }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div id="mobile-menu">
        <MobileMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isActive={isActive}
        />
      </div>
    </>
  );
}

export default Navbar;