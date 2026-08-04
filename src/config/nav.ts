import { SERVICES, serviceHref } from "./services";

/**
 * Navigation config — the single source of truth for the navbar.
 *
 *   Services ▾   6 services → /services/[slug] (canonical names)
 *   Products ▾   ReplyDude, Decipher Engine
 *   Tools ▾      AI Agent Cost Calculator, MVP Cost Calculator
 *   Blog         top-level (not nested)
 *   About
 *   [Start a project] — accent button, opens the shared contact modal
 *
 * No "Capabilities" item — process/technologies/integrations live as
 * sections inside each service page, not standalone pages.
 */

export type NavLeaf = {
  label: string;
  href: string;
  /** optional one-line descriptor shown in dropdown panels */
  descriptor?: string;
};

export type NavLink = { label: string; href: string };
export type NavDropdown = { label: string; items: NavLeaf[] };
export type NavItem = NavLink | NavDropdown;

export const isDropdown = (item: NavItem): item is NavDropdown =>
  "items" in item;

export const navItems: NavItem[] = [
  {
    label: "Services",
    // Canonical names/slugs come from config/services.ts — do not rename here.
    items: SERVICES.map((s) => ({ label: s.name, href: serviceHref(s.slug) })),
  },
  {
    label: "Products",
    // Only the two shipped products (client, 2026-08-02) — no
    // descriptors, and future products get added when they're real.
    items: [
      { label: "ReplyDude", href: "/products/replydude" },
      { label: "Decipher Engine", href: "/products/decipher-engine" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "AI Agent Cost Calculator", href: "/tools/ai-agent-cost-calculator" },
      { label: "MVP Cost Calculator", href: "/tools/mvp-cost-calculator" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

/** The nav CTA opens the shared contact modal (no inline forms). */
export const navCta = { label: "Start a project" };
