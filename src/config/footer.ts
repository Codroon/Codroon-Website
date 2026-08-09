import { SERVICES, serviceHref } from "./services";
import { navItems, isDropdown } from "./nav";
import { SITE } from "./site";

/**
 * Footer config — columns: Products / Services (all 6, canonical
 * names) / Tools / Company / Contact. Legal links live in the bottom
 * bar.
 *
 * The Tools column was added 2026-08-09. Without it the two cost
 * calculators had no inbound internal link from the homepage, the
 * header, the footer or any service page: the header dropdowns were
 * unmounted until clicked, so the footer was the only crawlable
 * navigation and it did not list them. They are the site's highest
 * commercial-intent pages.
 */

export type FooterLink = { name: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

/** The nav's Tools dropdown is the single source of truth for these. */
const TOOL_LINKS: FooterLink[] = (
  navItems.find((i) => isDropdown(i) && i.label === "Tools") as
    | { items: { label: string; href: string }[] }
    | undefined
)?.items.map((t) => ({ name: t.label, href: t.href })) ?? [];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Products",
    links: [
      { name: "ReplyDude", href: "/products/replydude" },
      { name: "Decipher Engine", href: "/products/decipher-engine" },
    ],
  },
  {
    title: "Services",
    // Canonical names/slugs — single source of truth in config/services.ts.
    links: SERVICES.map((s) => ({ name: s.name, href: serviceHref(s.slug) })),
  },
  {
    title: "Tools",
    links: TOOL_LINKS,
  },
  {
    title: "Company",
    // Careers removed and the page deleted on 2026-08-04 (client) — we
    // are not hiring through the site. Do not re-add a link without one.
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
    ],
  },
];

/**
 * Contact — single source of truth is config/site.ts.
 * phone renders ONLY when non-null (TODO: real US phone number).
 * street renders ONLY when non-null (TODO: real Dallas street address).
 */
export const CONTACT = {
  email: SITE.email,
  phone: SITE.phone,
  location: `${SITE.address.locality}, ${SITE.address.region}`,
};

// TODO: real social profile URLs (currently placeholders — hidden when "#").
export const SOCIALS: { label: string; href: string; icon: "linkedin" | "x" | "github" }[] = [
  { label: "Codroon on LinkedIn", href: "#", icon: "linkedin" },
  { label: "Codroon on X", href: "#", icon: "x" },
  { label: "Codroon on GitHub", href: "#", icon: "github" },
];

export const TAGLINE = "AI-native software studio. We ship in weeks.";
