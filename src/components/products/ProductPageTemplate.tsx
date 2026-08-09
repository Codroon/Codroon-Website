import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button, CTA_FIT } from "@/components/ui/Button";
import { CtaButton } from "@/components/contact/CtaButton";
import { SummarizeBar } from "@/components/services/SummarizeBar";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { productHref, type Product } from "@/components/Home/Products/data";
import type { ProductPageContent } from "@/content/products/types";
import { ProductSlider } from "./ProductSlider";
import { ProductMetaRail } from "./ProductMetaRail";
import { DecisionTabs } from "./DecisionTabs";
import { ProductStatsBand } from "./ProductStatsBand";

/**
 * ProductPageTemplate — the reusable shell every product page shares.
 * Per-product content arrives as a typed module (content/products/*);
 * sections render only when their data exists, in fixed order:
 *
 *   hero (h1 → screenshots) → [summarize-with-AI bar] →
 *   body column (lead → the bet → three decisions → the agent loop →
 *   where it is now → what it taught us) beside the sticky spec rail →
 *   accent stats band → final CTA
 *
 * The page argues one thing: look at the decisions we made. So the
 * architecture reasoning carries the weight — the tabbed decisions
 * block is the centre of the page, not a feature list.
 *
 * "Where it is now" is prose on purpose. Metric cards would frame a
 * live product with an active roadmap as a finished engagement.
 *
 * JSON-LD here: SoftwareApplication + BreadcrumbList. (Organization is
 * emitted once, site-wide, by the root layout.)
 *
 * Semantics: exactly one H1 (hero), every section an H2, no skips.
 */
export function ProductPageTemplate({
  product,
  content,
}: {
  product: Product;
  content: ProductPageContent;
}) {
  const canonical = absoluteUrl(productHref(content.slug));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: product.name,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Windows, macOS, Linux",
            url: canonical,
            // schema description mirrors the page's actual entity copy
            description: content.hero.subhead,
            // The product's own first screenshot, only when one exists.
            // No `offers` and deliberately NO aggregateRating: there are
            // no published prices and no real reviews, and inventing
            // either to fill a rich-result slot is exactly the kind of
            // fabricated markup that gets a site penalised.
            ...(product.screenshot
              ? { image: absoluteUrl(product.screenshot) }
              : null),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            // No "Products" crumb: /products is hidden and 404s in
            // production, and a breadcrumb pointing at a 404 is worse
            // than a two-step trail. Restore it if the index returns.
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: product.name, path: productHref(content.slug) },
            ])
          ),
        }}
      />

      <article>
        {/* ---- Hero — the product on screen sits directly under the
                headline; the stat strip closes the block ---- */}
        <Section className="pt-36 sm:pt-40" spacing="compact" containerWidth="wide">
          {/* "PRODUCT · LIVE" — the status half renders in the accent
              (client, 2026-08-04). Split rather than hard-coded, so the
              copy stays the single source of truth. */}
          <div className="anim-rise-lcp">
            <Eyebrow>
              {(() => {
                const [kind, ...state] = content.hero.eyebrow.split(" · ");
                return state.length === 0 ? (
                  kind
                ) : (
                  <>
                    {kind}
                    {" · "}
                    <span className="text-accent">{state.join(" · ")}</span>
                  </>
                );
              })()}
            </Eyebrow>
          </div>
          {/* The two product H1s are the longest headings on the site
              (Decipher's is 72 characters). The new display face sets
              13% wider than the old serif, which pushed this to FIVE
              lines at 375 and filled the phone viewport. Narrowed on the
              wdth axis below sm only, which is the brief's sanctioned
              remedy: no size change, and desktop keeps the specified
              wdth 100.

              MEASURE WIDENED 896px to 1152px (client, 2026-08-09). At
              max-w-4xl the heading broke three lines up while its own
              box was 896px wide and the container was 1440, and
              text-balance then evened those three lines down to a
              widest of 640px. The result was a narrow ragged block with
              a quarter of the hero empty to its right.

              text-balance STAYS. It is not the culprit and removing it
              is worse: plain wrapping at this measure leaves a 141px
              orphan on the last line of the ReplyDude heading. Measured
              at 1440, balance at 1152 gives ReplyDude 847/965 and
              Decipher 885/1086, two full lines each. */}
          <h1 className="text-h1 anim-rise-lcp anim-delay-1 mt-6 max-w-6xl text-balance text-foreground max-sm:[font-stretch:88%]">
            {content.hero.h1}
          </h1>

          {content.slider && (
            <div className="anim-rise anim-delay-2 mt-12">
              <ProductSlider
                slides={content.slider.slides}
                label={`${product.name} product screenshots`}
                brandColor={content.brandColor}
              />
            </div>
          )}
        </Section>

        {/* ---- Summarize-with-AI bar — deep links with the canonical
                URL prefilled ---- */}
        <SummarizeBar canonicalUrl={canonical} />

        {/* ---- Body column beside the sticky spec rail ---- */}
        <Section spacing="compact" containerWidth="wide">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div className="min-w-0 space-y-20">
              {/* Lead — opens the body column. No max-width: it shares
                  the column measure with every paragraph below it, so
                  the lines break on the same edge. */}
              <section>
                {content.leadHeading && (
                  <h2 className="text-h2 max-w-2xl text-foreground">
                    {content.leadHeading}
                  </h2>
                )}
                <p
                  className={`text-body-lg text-muted-foreground${
                    content.leadHeading ? " mt-8" : ""
                  }`}
                >
                  {content.hero.subhead}
                </p>
              </section>

              {/* The bet — an argument, not challenge/solution */}
              {content.bet && (
                <section>
                  <h2 className="text-h2 max-w-2xl text-foreground">
                    {content.bet.heading}
                  </h2>
                  <div className="mt-8 space-y-6">
                    {content.bet.paragraphs.map((p, i) => (
                      <p key={i} className="text-body-lg text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Three decisions — the strongest block on the page */}
              {content.decisions && (
                <section>
                  <h2 className="text-h2 max-w-2xl text-foreground">
                    {content.decisions.heading}
                  </h2>
                  {/* mt-8 everywhere under an h2 — the page reads as one
                      rhythm only if every heading sits the same distance
                      from its body copy. */}
                  <p className="text-body-lg mt-8 max-w-3xl text-muted-foreground">
                    {content.decisions.intro}
                  </p>
                  <DecisionTabs
                    tabs={content.decisions.tabs}
                    label={product.name}
                  />
                </section>
              )}

              {content.mechanic && (
                <section>
                  <h2 className="text-h2 max-w-2xl text-foreground">
                    {content.mechanic.heading}
                  </h2>
                  <div className="mt-8 space-y-6">
                    {content.mechanic.paragraphs.map((p, i) => (
                      <p key={i} className="text-body-lg text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Prose, never metric cards — see template note */}
              {content.whereItIsNow && (
                <section>
                  <h2 className="text-h2 max-w-2xl text-foreground">
                    {content.whereItIsNow.heading}
                  </h2>
                  <div className="mt-8 space-y-6">
                    {content.whereItIsNow.paragraphs.map((p, i) => (
                      <p key={i} className="text-body-lg text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* The section that earns the page its place on an agency
                  site: the product becomes evidence for the services */}
              {content.taughtUs && (
                <section>
                  <h2 className="text-h2 max-w-2xl text-foreground">
                    {content.taughtUs.heading}
                  </h2>
                  <p className="text-body-lg mt-8 max-w-3xl text-muted-foreground">
                    {content.taughtUs.intro}
                  </p>
                  <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {content.taughtUs.items.map((item) => (
                      <li
                        key={item.heading}
                        className="flex h-full flex-col rounded-[var(--radius-md)] border border-border bg-surface p-6"
                      >
                        <h3 className="text-h3 text-foreground">
                          {item.heading}
                        </h3>
                        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                        <Link
                          href={item.link.href}
                          className="text-small mt-5 inline-flex items-center gap-1.5 text-accent transition-colors hover:text-accent-hover"
                        >
                          {item.link.label}
                          <ArrowRight className="size-[1.1em]" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="sr-only">Project details</h2>
              <ProductMetaRail fields={content.metaRail} />
            </aside>
          </div>
        </Section>

        {/* ---- Headline figures — full-bleed accent band, same
                treatment as the homepage Stats section ---- */}
        {content.hero.stats && (
          <ProductStatsBand
            stats={content.hero.stats}
            label={`${product.name} in numbers`}
          />
        )}

        {/* ---- Final CTA — the primary sends traffic away on purpose ---- */}
        {content.finalCta && (
          <Section containerWidth="wide">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 sm:p-12 lg:p-16">
              {/* Two nowrap labels ("Visit decipherengine.ai" + "Build
                  something like this") are wider than half this card, so
                  they used to run past its padding. Asymmetric columns
                  only when both buttons are present; flex-wrap so the
                  second drops to its own line where even that is not
                  enough; CTA_FIT so the label wraps inside the button
                  below sm instead of overflowing. */}
              <div
                className={cn(
                  "grid items-center gap-10",
                  content.finalCta.primary
                    ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12"
                    : "lg:grid-cols-2 lg:gap-16"
                )}
              >
                <h2 className="text-h2 text-foreground">
                  {content.finalCta.heading}
                </h2>
                <div>
                  <p className="text-body-lg text-muted-foreground">
                    {content.finalCta.body}
                  </p>
                  <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                    {content.finalCta.primary && (
                      <Button
                        href={content.finalCta.primary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="lg"
                        className={CTA_FIT}
                      >
                        {content.finalCta.primary.label}
                        <ArrowUpRight className="size-[1.1em] shrink-0 max-sm:hidden" aria-hidden />
                      </Button>
                    )}
                    <CtaButton
                      size="lg"
                      variant={content.finalCta.primary ? "secondary" : "primary"}
                      className={CTA_FIT}
                    >
                      {content.finalCta.secondary}
                      <ArrowRight className="size-[1.1em] shrink-0 max-sm:hidden" aria-hidden />
                    </CtaButton>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        )}
      </article>
    </>
  );
}

export default ProductPageTemplate;
