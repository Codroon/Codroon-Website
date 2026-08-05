import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FinalCta } from "@/components/Home/FinalCta";
import { EstimatorPreviewCard } from "./EstimatorPreviewCard";
import { SemanticComparisonTable } from "@/components/services/SemanticComparisonTable";
import { FaqSection } from "@/components/services/FaqSection";
import {
  breadcrumbJsonLd,
  definedTermSetJsonLd,
  jsonLdString,
  webApplicationJsonLd,
} from "@/lib/seo";
import type { ToolLandingContent } from "@/content/tools/types";

/**
 * ToolLandingTemplate — the shared shell for tool landing pages
 * (agent + MVP cost estimators). Per-page content arrives as a typed
 * module; sections render only when their data exists. Signature
 * sections are data: `runCost` (agent) and `cutList` (MVP) occupy the
 * same slot and must never share content.
 *
 * Every "Start estimate" CTA routes to `${path}/estimate`.
 */
export function ToolLandingTemplate({
  path,
  content,
}: {
  path: string;
  content: ToolLandingContent;
}) {
  const estimatePath = `${path}/estimate`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            webApplicationJsonLd({
              name: content.hero.h1,
              description: content.meta.description,
              path,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: content.hero.h1, path },
            ])
          ),
        }}
      />

      <article>
        {/* ---- Hero — copy left, example result card right ---- */}
        <Section className="pt-36 sm:pt-40" spacing="compact" containerWidth="wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="anim-rise">
                <Eyebrow>{content.hero.eyebrow}</Eyebrow>
              </div>
              <h1 className="text-h1 anim-rise anim-delay-1 mt-6 text-foreground">
                {content.hero.h1}
              </h1>
              <p className="text-body-lg anim-rise anim-delay-2 mt-6 max-w-xl text-muted-foreground">
                {content.hero.subhead}
              </p>
              <div className="anim-rise anim-delay-3 mt-9">
                <Button href={estimatePath} size="lg">
                  {content.hero.cta}
                  <ArrowRight className="size-[1.1em]" aria-hidden />
                </Button>
                <p className="text-small mt-3 text-muted-foreground">
                  {content.hero.microcopy}
                </p>
              </div>
            </div>

            <div className="anim-rise anim-delay-2 hidden lg:block">
              <EstimatorPreviewCard preview={content.hero.preview} />
            </div>
          </div>
        </Section>

        {/* ---- Quick answer — snippet / AI Overview target; plain
                prose in the server HTML ---- */}
        <Section spacing="compact">
          {/* accent surface — ALL text on it is #232220 */}
          <div className="rounded-[var(--radius-lg)] bg-accent p-6 sm:p-8">
            <p className="text-body-lg text-accent-foreground">{content.quickAnswer}</p>
          </div>
        </Section>

        {/* ---- How it works — three steps ---- */}
        {content.howItWorks && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.howItWorks.heading}
            </h2>
            <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {content.howItWorks.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8"
                >
                  {/* numerals are not actions — accent-dim */}
                  <span aria-hidden className="text-mono text-3xl text-accent-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* ---- What drives the cost — ranked factors ---- */}
        {content.costDrivers && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.costDrivers.heading}
            </h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.costDrivers.intro}
            </p>
            <ol className="mt-10">
              {content.costDrivers.items.map((item, i) => (
                <li
                  key={item.title}
                  className="grid gap-4 border-t border-border py-7 last:border-b sm:grid-cols-12 sm:gap-8"
                >
                  <span aria-hidden className="text-mono text-3xl text-accent-dim sm:col-span-1">
                    {i + 1}
                  </span>
                  <div className="sm:col-span-11">
                    <h3 className="font-sans text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* ---- Typical cost table — semantic, visible corner header ---- */}
        {content.costTable && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">{content.costTable.heading}</h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.costTable.intro}
            </p>
            <SemanticComparisonTable
              className="mt-10"
              caption={content.costTable.heading}
              cornerHeader={content.costTable.cornerHeader}
              columns={content.costTable.columns}
              rows={content.costTable.rows}
              highlightColumn={-1}
            />
            <p className="text-body mt-8 max-w-3xl text-muted-foreground">
              {content.costTable.closing}
            </p>
          </Section>
        )}

        {/* ---- Signature section (agent): run cost + worked example ---- */}
        {content.runCost && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">{content.runCost.heading}</h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.runCost.intro}
            </p>
            <dl className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {content.runCost.components.map((c) => (
                <div key={c.title} className="border-t border-border py-7">
                  <dt className="font-sans text-lg font-semibold text-foreground">{c.title}</dt>
                  <dd className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {c.body}
                  </dd>
                </div>
              ))}
            </dl>
            {/* worked example — accent surface, ALL text #232220 */}
            <div className="mt-10 rounded-[var(--radius-lg)] bg-accent p-8 sm:p-10">
              <p className="text-eyebrow text-accent-foreground">Worked example</p>
              <p className="text-body-lg mt-4 text-accent-foreground">
                {content.runCost.workedExample}
              </p>
            </div>
          </Section>
        )}

        {/* ---- Signature section (MVP): the cut list ---- */}
        {content.cutList && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">{content.cutList.heading}</h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.cutList.intro}
            </p>
            <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {content.cutList.items.map((item) => (
                <li
                  key={item.title}
                  className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8"
                >
                  <h3 className="font-sans text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-small mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent px-3.5 py-1.5 text-accent-foreground">
                      saves {item.saves}
                    </span>
                    {item.timeSaved && (
                      <span className="rounded-full bg-accent px-3.5 py-1.5 text-accent-foreground">
                        {item.timeSaved}
                      </span>
                    )}
                  </p>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
            {/* counterweight — visually distinct, NOT a seventh cut */}
            <div className="mt-10 rounded-[var(--radius-lg)] border-2 border-accent bg-surface p-8 sm:p-10">
              <h3 className="font-sans text-xl font-semibold text-foreground">
                {content.cutList.whatNotToCut.heading}
              </h3>
              <p className="text-body-lg mt-4 text-muted-foreground">
                {content.cutList.whatNotToCut.body}
              </p>
            </div>
          </Section>
        )}

        {/* ---- When you don't need one — unqualified, no hedge ---- */}
        {content.whenNot && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">{content.whenNot.heading}</h2>
            <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">
              {content.whenNot.intro}
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {content.whenNot.items.map((item) => (
                <li
                  key={item.title}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8"
                >
                  <h3 className="font-sans text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ---- Options comparison — semantic table, no badge ---- */}
        {content.optionsTable && (
          <Section spacing="compact">
            <h2 className="text-h2 max-w-2xl text-foreground">
              {content.optionsTable.heading}
            </h2>
            <SemanticComparisonTable
              className="mt-10"
              caption={content.optionsTable.heading}
              columns={content.optionsTable.columns}
              rows={content.optionsTable.rows}
              highlightColumn={content.optionsTable.highlightColumn ?? 0}
            />
            <p className="text-body mt-8 max-w-3xl text-muted-foreground">
              {content.optionsTable.closing}
            </p>
          </Section>
        )}

        {/* ---- Glossary — term/definition + DefinedTermSet JSON-LD ---- */}
        {content.glossary && (
          <Section spacing="compact">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: jsonLdString(
                  definedTermSetJsonLd({
                    name: content.glossary.heading,
                    path,
                    terms: content.glossary.terms,
                  })
                ),
              }}
            />
            <h2 className="text-h2 max-w-2xl text-foreground">{content.glossary.heading}</h2>
            <dl className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {content.glossary.terms.map((t) => (
                <div key={t.term} className="border-t border-border py-7">
                  <dt className="font-sans text-lg font-semibold text-foreground">{t.term}</dt>
                  <dd className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {t.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {/* ---- FAQ + FAQPage JSON-LD ---- */}
        {content.faq && (
          <Section spacing="compact">
            <FaqSection heading={content.faq.heading} items={content.faq.items} />
          </Section>
        )}

        {/* ---- Related links (chrome) ---- */}
        {content.related && content.related.length > 0 && (
          <Section spacing="compact">
            <nav aria-label="Related pages" className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-eyebrow text-muted-foreground">Related</span>
              {content.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="text-small inline-flex min-h-[44px] items-center rounded-full border border-border px-4 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  {r.label}
                </Link>
              ))}
            </nav>
          </Section>
        )}

        {/* ---- Final CTA → the estimator ----
             The shared FinalCta card, the same closing block the landing
             page, /about, the service pages and the product pages all
             use (client, 2026-08-04). It replaces a bespoke centred
             full-bleed band that was the only closing CTA on the site
             with its own layout. `ctaHref` sends the button into the
             estimator instead of opening the contact modal. */}
        {content.finalCta && (
          <FinalCta
            heading={content.finalCta.heading}
            body={content.finalCta.body}
            ctaLabel={content.finalCta.cta}
            ctaHref={estimatePath}
          />
        )}
      </article>
    </>
  );
}

export default ToolLandingTemplate;
