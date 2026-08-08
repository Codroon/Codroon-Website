import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HashScroll } from "@/components/ui/HashScroll";
import { PostToc, type TocItem } from "@/components/blog/PostToc";
import { CommitmentsTable } from "@/components/terms/CommitmentsTable";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOpenGraph,
} from "@/lib/seo";
import {
  TERMS_COMMITMENTS,
  TERMS_CONTACT,
  TERMS_EMAIL,
  TERMS_GOVERNING_LAW,
  TERMS_HEADER,
  TERMS_LAST_UPDATED,
  TERMS_META,
  TERMS_SECTIONS,
} from "@/content/terms";

/**
 * /terms — the copy deck verbatim, in the privacy page's layout: 68/32
 * with the blog's PostToc in the rail (the same component, not a copy),
 * its mobile <details> variant under the intro, readable anchor slugs,
 * last-updated prominent in the display serif, typographic throughout.
 *
 * The difference is §2. The privacy page's idea was one summary table;
 * this page's is a table that runs BOTH ways, commitments beside
 * requirements, which is the thing a prospective client should read
 * before signing anything.
 *
 * ⚠️ §19 Governing law does not render. The deck has no clause for it,
 * only a placeholder, and it is the one decision the deck says not to
 * guess. It appears the moment TERMS_GOVERNING_LAW.body is set.
 *
 * INDEXED: canonical set, no noindex. Organization schema comes from the
 * layout. The generic placeholder terms that used to live here were
 * replaced; they were untracked, so a copy sits in the session
 * scratchpad.
 */

export const metadata: Metadata = {
  title: TERMS_META.title,
  description: TERMS_META.description,
  alternates: { canonical: absoluteUrl("/terms") },
  openGraph: pageOpenGraph("/terms", TERMS_META.title, TERMS_META.description),
};

/** The rail, in page order, built from the same data the page renders. */
const TOC: TocItem[] = [
  { id: "commitments", heading: TERMS_COMMITMENTS.h2 },
  ...TERMS_SECTIONS.map((s) => ({ id: s.id, heading: s.h2 })),
  ...(TERMS_GOVERNING_LAW.body
    ? [{ id: TERMS_GOVERNING_LAW.id, heading: TERMS_GOVERNING_LAW.h2 }]
    : []),
  { id: TERMS_CONTACT.id, heading: TERMS_CONTACT.h2 },
];

/** Section shell: anchored H2, then content. */
function Section({
  id,
  h2,
  children,
}: {
  id: string;
  h2: string;
  children: React.ReactNode;
}) {
  return (
    // the id lives on the SECTION: the TOC links to #who-owns-what, and
    // scroll-mt keeps the heading clear of the fixed header
    <section id={id} aria-labelledby={`${id}-h`} className="mt-20 scroll-mt-28">
      <h2 id={`${id}-h`} className="text-h2 text-foreground">
        {h2}
      </h2>
      {children}
    </section>
  );
}

/** Body prose, with the contact address linked wherever it appears. */
function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-body mt-6 max-w-[68ch] text-muted-foreground first:mt-8">
          {p.includes(TERMS_EMAIL) ? (
            <>
              {p.split(TERMS_EMAIL)[0]}
              <a
                href={`mailto:${TERMS_EMAIL}`}
                className="text-accent transition-colors hover:text-accent-hover"
              >
                {TERMS_EMAIL}
              </a>
              {p.split(TERMS_EMAIL)[1]}
            </>
          ) : (
            p
          )}
        </p>
      ))}
    </>
  );
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Terms of Service", path: "/terms" },
            ])
          ),
        }}
      />

      <HashScroll />

      <div className="pb-24 pt-32 sm:pb-32 sm:pt-36">
        <Container width="wide">
          <div className="grid gap-x-16 lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)]">
            {/* ---------------- the terms ---------------- */}
            <div className="min-w-0">
              <Eyebrow>{TERMS_HEADER.eyebrow}</Eyebrow>
              <h1 className="text-h1 mt-5 text-foreground">{TERMS_HEADER.h1}</h1>

              {/* display face, prominent, at the top */}
              <p className="mt-6 font-serif text-[1.5rem] leading-tight text-foreground sm:text-[1.75rem]">
                Last updated: {TERMS_LAST_UPDATED}
              </p>

              <div className="mt-8 max-w-[68ch]">
                {TERMS_HEADER.intro.map((p, i) => (
                  <p key={i} className="text-body-lg mt-5 text-muted-foreground first:mt-0">
                    {p}
                  </p>
                ))}
              </div>

              {/* rail collapses to this under the intro, closed by default */}
              <PostToc items={TOC} variant="mobile" />

              {/* §2 — the table that runs both ways */}
              <Section id="commitments" h2={TERMS_COMMITMENTS.h2}>
                <Prose paragraphs={TERMS_COMMITMENTS.intro} />
                <CommitmentsTable />
              </Section>

              {/* §3 to §18 and §20 */}
              {TERMS_SECTIONS.map((s) => (
                <Section key={s.id} id={s.id} h2={s.h2}>
                  <Prose paragraphs={s.body} />
                </Section>
              ))}

              {/* §19 — renders only once the jurisdiction is decided */}
              {TERMS_GOVERNING_LAW.body && (
                <Section id={TERMS_GOVERNING_LAW.id} h2={TERMS_GOVERNING_LAW.h2}>
                  <Prose paragraphs={TERMS_GOVERNING_LAW.body} />
                </Section>
              )}

              {/* §21 */}
              <Section id={TERMS_CONTACT.id} h2={TERMS_CONTACT.h2}>
                <Prose paragraphs={TERMS_CONTACT.body} />
                <address className="text-body mt-8 not-italic text-muted-foreground">
                  {TERMS_CONTACT.entities.map((e, i) => (
                    <span key={e.name} className={i > 0 ? "mt-6 block" : "block"}>
                      <span className="block text-foreground">{e.name}</span>
                      {/* Any address lines render the moment they are set
                          in src/content/terms.ts. The Texas one that used
                          to be pending here left with the partner entity
                          on 2026-08-09. */}
                      {e.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </span>
                  ))}
                </address>
              </Section>
            </div>

            {/* ---------------- sticky rail ---------------- */}
            <aside className="mt-16 hidden lg:mt-0 lg:block">
              <div className="sticky top-28">
                <PostToc items={TOC} />
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
