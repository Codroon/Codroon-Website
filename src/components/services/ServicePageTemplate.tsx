import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CTA_FIT } from "@/components/ui/Button";
import { CtaButton } from "@/components/contact/CtaButton";
import { getHeroVisual } from "./heroVisuals";
import { AccordionRows } from "./AccordionRows";
import { SemanticComparisonTable } from "./SemanticComparisonTable";
import { FaqSection } from "./FaqSection";
import { SummarizeBar } from "./SummarizeBar";
import { absoluteUrl } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdString,
  serviceJsonLd,
} from "@/lib/seo";
import { serviceHref, type Service } from "@/config/services";
import type { ServicePageContent } from "@/content/services/types";

/**
 * ServicePageTemplate — the reusable shell every service page shares.
 * Per-page content arrives as a typed module (content/services/*);
 * sections render only when their data exists, in fixed order:
 *
 *   hero → [summarize-with-AI bar] → what-is → comparison table →
 *   sub-services → process → tech → industries → pricing → FAQ →
 *   final CTA
 *
 * JSON-LD here: Service + BreadcrumbList. (Organization is emitted
 * once, site-wide, by the root layout. FAQPage ships with the FAQ
 * section so it always matches the visible text.)
 *
 * Semantics: exactly one H1 (hero), every section an H2, no skips.
 */
/**
 * Which calculator answers "what does this cost" for each service.
 *
 * The MVP calculator covers product builds priced by scope and user
 * types; the agent calculator covers anything priced by what the agent
 * touches and what it costs to run. Every one of the six services maps
 * to one of them, so no service page is left without the link.
 */
const CALCULATOR_FOR: Record<
  string,
  { href: string; label: string; trailing: string }
> = {
  "mvp-development": {
    href: "/tools/mvp-cost-calculator",
    label: "Price your MVP in about three minutes",
    trailing: "with the cost calculator, no email needed to see the number.",
  },
  "saas-development": {
    href: "/tools/mvp-cost-calculator",
    label: "Price your SaaS build in about three minutes",
    trailing: "with the cost calculator, no email needed to see the number.",
  },
  "custom-software-development": {
    href: "/tools/mvp-cost-calculator",
    label: "Price your build in about three minutes",
    trailing: "with the cost calculator, no email needed to see the number.",
  },
  "ai-agent-development": {
    href: "/tools/ai-agent-cost-calculator",
    label: "Price your agent in about three minutes",
    trailing:
      "with the cost calculator, including what it costs to run each month.",
  },
  "generative-ai-development": {
    href: "/tools/ai-agent-cost-calculator",
    label: "Price your build in about three minutes",
    trailing:
      "with the AI cost calculator, including what it costs to run each month.",
  },
  "ai-integration": {
    href: "/tools/ai-agent-cost-calculator",
    label: "Price your integration in about three minutes",
    trailing:
      "with the AI cost calculator, including what it costs to run each month.",
  },
};

export function ServicePageTemplate({
  service,
  content,
}: {
  service: Service;
  content: ServicePageContent;
}) {
  const HeroVisual = getHeroVisual(content.slug);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString({
            ...serviceJsonLd(service),
            // schema description mirrors the page's actual entity copy
            description: content.hero.subhead,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            // Two levels, not three. Level 2 used to be "/#services",
            // a fragment on the homepage, so crumbs 1 and 2 resolved to
            // the SAME document and the trail claimed a hierarchy that
            // does not exist: there is no /services index page in the
            // rebuild (client, 2026-08-09). Add the middle crumb back
            // if a real index is ever built.
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: service.name, path: serviceHref(service.slug) },
            ])
          ),
        }}
      />

      <article>
        {/* ---- Hero — copy left, animated agent-flow diagram right ---- */}
        <Section className="pt-36 sm:pt-40" spacing="compact" containerWidth="wide">
          {/* The visible breadcrumb was removed on 2026-08-04 (client):
              it duplicated the nav and pushed the hero down. The
              BreadcrumbList JSON-LD above STAYS — that is what produces
              the path under the result in search, and it is invisible. */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="anim-rise-lcp">
                <Eyebrow>{content.hero.eyebrow}</Eyebrow>
              </div>
              <h1 className="text-h1 anim-rise-lcp anim-delay-1 mt-6 text-foreground">
                {content.hero.h1}
              </h1>
              <p className="text-body-lg anim-rise-lcp anim-delay-2 mt-6 max-w-xl text-muted-foreground">
                {content.hero.subhead}
              </p>
              <div className="anim-rise anim-delay-3 mt-9">
                <CtaButton size="lg">
                  {content.hero.cta}
                  <ArrowRight className="size-[1.1em]" aria-hidden />
                </CtaButton>
              </div>
            </div>

            <div className="anim-rise anim-delay-2 hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </Section>

        {/* ---- Summarize-with-AI bar — deep links with the canonical
                URL prefilled ---- */}
        <SummarizeBar canonicalUrl={absoluteUrl(serviceHref(service.slug))} />

        {/* ---- What is … — plain prose; first sentence stays a clean,
                extractable snippet answer ---- */}
        {content.whatIs && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.whatIs.heading}
            </h2>
            {/* full container measure — lines break where the
                comparison table ends */}
            <div className="mt-8 space-y-6">
              {content.whatIs.paragraphs.map((p, i) => (
                <p key={i} className="text-body-lg text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </Section>
        )}
        {/* ---- Comparison table — real semantic <table>; the first
                data column (ours) is highlighted. Mobile scrolls
                horizontally, cells never truncate. ---- */}
        {content.comparison && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.comparison.heading}
            </h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.comparison.intro}
            </p>

            <SemanticComparisonTable
              className="mt-10"
              caption={content.comparison.heading}
              columns={content.comparison.columns}
              rows={content.comparison.rows}
              highlightColumn={content.comparison.highlightColumn ?? 0}
            />

            <p className="text-body mt-8 max-w-3xl text-muted-foreground">
              {content.comparison.closing}
            </p>
          </Section>
        )}
        {/* ---- Sub-services — 2×2, uniform card height ---- */}
        {content.subServices && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.subServices.heading}
            </h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.subServices.intro}
            </p>

            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {content.subServices.cards.map((card, i) => (
                <li
                  key={card.title}
                  className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-sans text-xl font-semibold leading-snug text-foreground">
                      {card.title}
                    </h3>
                    {/* numerals are not actions — accent-dim */}
                    <span aria-hidden className="text-mono text-2xl text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {/* ---- Category hub — internal links distributing authority
                to the specific service pages ---- */}
        {content.categoryHub && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.categoryHub.heading}
            </h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.categoryHub.body}
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.categoryHub.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex h-full flex-col rounded-[var(--radius-md)] border border-border bg-surface p-5 transition-colors hover:border-border-strong"
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-sans font-semibold text-foreground">{l.label}</span>
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="shrink-0 text-accent-dim transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="mt-2 text-[0.9rem] text-muted-foreground">
                      {l.descriptor}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-body mt-8 max-w-3xl text-muted-foreground">
              {content.categoryHub.closing}
            </p>
          </Section>
        )}

        {/* ---- Process — 4 steps, all content expanded and server-
                rendered: numeral · title · duration · body ·
                deliverables ---- */}
        {content.process && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">{content.process.heading}</h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.process.intro}
            </p>

            <ol className="mt-10">
              {content.process.steps.map((step) => (
                <li
                  key={step.n}
                  className="grid gap-4 border-t border-border py-8 last:border-b sm:grid-cols-12 sm:gap-8"
                >
                  {/* numerals are not actions — accent-dim */}
                  <span aria-hidden className="text-mono text-3xl text-muted-foreground sm:col-span-1">
                    {step.n}
                  </span>
                  <div className="sm:col-span-11">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <h3 className="font-sans text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <span className="text-eyebrow rounded-full bg-accent px-3.5 py-1.5 text-accent-foreground">
                        {step.duration}
                      </span>
                    </div>
                    <p className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {step.deliverables.map((d) => (
                        <li
                          key={d}
                          className="text-small rounded-full bg-accent px-3.5 py-1.5 text-accent-foreground"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}
        {/* ---- Tech & frameworks — six term/definition groups ---- */}
        {content.tech && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">{content.tech.heading}</h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.tech.intro}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {content.tech.groups.map((group) => (
                <div key={group.title} className="border-t border-border py-7">
                  <dt className="font-sans text-lg font-semibold text-foreground">
                    {group.title}
                  </dt>
                  <dd className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {group.body}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        )}
        {/* ---- Industries — accordion rows (SSR-expanded; rows link
                out once their pages exist via `href`) ---- */}
        {content.industries && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.industries.heading}
            </h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.industries.intro}
            </p>

            <div className="mt-10">
              <AccordionRows
                items={content.industries.rows.map((row) => ({
                  id: row.title,
                  heading: row.title,
                  // TODO: when row.href exists, append a link to the
                  // industry page inside this content block.
                  content: row.body,
                }))}
              />
            </div>
          </Section>
        )}
        {/* ---- Pricing — full-weight panel, not a buried paragraph.
                First paragraph (the numbers) leads bright and large. ---- */}
        {content.pricing && (
          <Section spacing="compact">
            {/* accent surface — ALL text on it is #232220 */}
            <div className="rounded-[var(--radius-lg)] bg-accent p-8 sm:p-12 lg:p-16">
              <h2 className="text-h2 max-w-2xl text-accent-foreground">
                {content.pricing.heading}
              </h2>
              <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16">
                {content.pricing.paragraphs.map((p, i) => (
                  <p key={i} className="text-body-lg text-accent-foreground">
                    {p}
                  </p>
                ))}
              </div>
              {/* The one in-body link from a service page to its
                  calculator. Every service page has a "what this costs"
                  section and none of them linked to the tool that
                  answers exactly that question, which left both
                  calculators with no inbound internal links at all
                  (client, 2026-08-09). It sits here rather than in a
                  nav because this is the moment the reader is asking
                  the question.

                  Underlined, not a button: the section's own CTA is the
                  conversion path and a second filled control would
                  compete with it. Text on accent is ALWAYS #232220. */}
              {CALCULATOR_FOR[content.slug] && (
                <p className="mt-8 text-body-lg text-accent-foreground">
                  <Link
                    href={CALCULATOR_FOR[content.slug].href}
                    className="font-medium underline decoration-accent-foreground/40 underline-offset-4 transition-colors hover:decoration-accent-foreground"
                  >
                    {CALCULATOR_FOR[content.slug].label}
                  </Link>{" "}
                  {CALCULATOR_FOR[content.slug].trailing}
                </p>
              )}
            </div>
          </Section>
        )}
        {/* ---- FAQ — quick-answers prose above the accordion; the
                FAQPage JSON-LD is generated from the SAME data objects
                the accordion renders, so it can never drift. ---- */}
        {content.faq && (
          <Section spacing="compact">
            <FaqSection
              heading={content.faq.heading}
              quickAnswers={content.faq.quickAnswers}
              items={content.faq.items}
            />
          </Section>
        )}
        {/* ---- Final CTA — opens the shared contact modal ---- */}
        {content.finalCta && (
          <Section spacing="compact">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 sm:p-12 lg:p-16">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <h2 className="text-h2 text-foreground">{content.finalCta.heading}</h2>
                <div>
                  <p className="text-body-lg text-muted-foreground">
                    {content.finalCta.body}
                  </p>
                  {/* CTA_FIT: the button is whitespace-nowrap, and these
                      labels are longer than the card interior at 375. It
                      was setting a min-content floor on the grid column,
                      which pushed the column to 308px inside a 261px
                      card and spilled the H2 and the button 48px past the
                      padding. Same fix as the landing and product CTAs.
                      PRE-EXISTING, unrelated to the font swap: measured
                      identical with the old serif. */}
                  <div className="mt-7">
                    <CtaButton size="lg" className={CTA_FIT}>
                      {content.finalCta.cta}
                      <ArrowRight
                        className="size-[1.1em] shrink-0 max-sm:hidden"
                        aria-hidden
                      />
                    </CtaButton>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* NOTE: no "Other services" block by client decision — sideways
            links to the other five services live in the site footer on
            every page, so internal linking stays intact. */}
      </article>
    </>
  );
}

export default ServicePageTemplate;
