import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutNumbers } from "@/components/about/AboutNumbers";
import { AboutFounders } from "@/components/about/AboutFounders";
import { AboutConnect } from "@/components/about/AboutConnect";
import { AboutOffices } from "@/components/about/AboutOffices";
import { AboutBuild } from "@/components/about/AboutBuild";
import FinalCta from "@/components/Home/FinalCta";
import { ABOUT_CTA, ABOUT_META } from "@/content/about";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOpenGraph } from "@/lib/seo";

/**
 * /about — rebuilt for rhythm (client, 2026-08-03). The page previously
 * ran every section at the same width, alignment and surface, so it read
 * as a document rather than a page.
 *
 * RHYTHM RULE, enforced by scripts/check-about.mjs: no two adjacent
 * sections may share BOTH the same surface and the same width.
 * Something changes at every boundary.
 *
 * Still no photos and no stock imagery. The exceptions are deliberate
 * and load-bearing: the hero logomark (decorative, aria-hidden) and the
 * two landmark line drawings in Where we are, which are wayfinding
 * rather than decoration.
 *
 * Sections the deck deliberately omits, each considered and rejected:
 * founding story, timeline, values list, team grid, equity percentages,
 * hero mission statement. Do not add them back.
 *
 * SCHEMA: Organization + ProfessionalService (a LocalBusiness subtype,
 * carrying the Dallas address) are emitted site-wide from the root
 * layout, so this page already carries them. Repeating them here would
 * put two identical nodes on one page, so it only adds BreadcrumbList.
 */

export const metadata: Metadata = {
  title: ABOUT_META.title,
  description: ABOUT_META.description,
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: pageOpenGraph("/about", ABOUT_META.ogTitle, ABOUT_META.ogDescription),
  twitter: {
    card: "summary_large_image",
    title: ABOUT_META.ogTitle,
    description: ABOUT_META.ogDescription,
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ])
          ),
        }}
      />

      {/* ---------------- 1. HERO ---------------- */}
      <AboutHero />

      {/* ---------------- 2. THE NUMBERS ---------------- */}
      <AboutNumbers />

      {/* ---------------- 3. HOW WE WORK — the orange anchor ---------------- */}
      <AboutFounders />

      {/* ------------- 4 + 5. HOW WE BUILD / AI-NATIVE ------------- */}
      <AboutBuild />

      {/* ---------------- 6. WHAT WE WON'T DO ----------------
          REMOVED on the client's instruction (2026-08-04). The section
          and its copy are gone rather than hidden. Build (page surface)
          now runs straight into How to connect (orange), so the rhythm
          rule still holds at that boundary. */}

      {/* ---------------- 7. TESTIMONIALS ----------------
          Deliberately absent. The landing-page component still holds
          four fabricated quotes attributed to invented people, and the
          brief is explicit: leave it out rather than show placeholders.
          Drop <Testimonials /> in here once real quotes exist. */}

      {/* ---------------- 8. HOW TO CONNECT ---------------- */}
      <AboutConnect />

      {/* ---------------- 9. WHERE WE ARE ---------------- */}
      <AboutOffices />

      {/* ---------------- 10. CTA ----------------
          The landing page's FinalCta, with this page's deck copy. It is
          a bordered card on the PAGE surface; the previous version was
          a band on bg-surface, which is also the footer's surface, so
          the two merged into one block. */}
      <FinalCta
        heading={ABOUT_CTA.h2}
        body={ABOUT_CTA.body}
        ctaLabel={ABOUT_CTA.primary.label}
        secondary={
          ABOUT_CTA.secondary.href
            ? { label: ABOUT_CTA.secondary.label, href: ABOUT_CTA.secondary.href }
            : undefined
        }
      />
    </>
  );
}
