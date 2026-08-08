import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PostToc, type TocItem } from "@/components/blog/PostToc";
import { SummaryTable } from "@/components/privacy/SummaryTable";
import { ProcessorTable } from "@/components/privacy/ProcessorTable";
import { HashScroll } from "@/components/ui/HashScroll";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOpenGraph,
} from "@/lib/seo";
import {
  PRIVACY_CONTACT,
  PRIVACY_EMAIL,
  PRIVACY_HEADER,
  PRIVACY_LAST_UPDATED,
  PRIVACY_META,
  PRIVACY_PROCESSORS,
  PRIVACY_SECTIONS,
  PRIVACY_SUMMARY,
  PRIVACY_WONT_DO,
} from "@/content/privacy";

/**
 * /privacy — all fourteen sections of the copy deck, verbatim.
 *
 * Layout is the blog post template's: 68/32 two-column with the SAME
 * PostToc component in the rail (not a copy of it), and its mobile
 * <details> variant under the intro, closed by default.
 *
 * Every H2 carries a readable anchor slug, so support can link to
 * /privacy#session-recording rather than "scroll down a bit". Those ids
 * are public URLs now — do not rename them.
 *
 * Typographic, like /about: no icons, no illustrations, no shield or
 * lock graphics. The two tables are real <table>s, never cards, and §8
 * is hairline rows, never a bulleted list.
 *
 * INDEXED deliberately: people should be able to find this page. No
 * noindex, canonical set, Organization schema comes from the layout.
 *
 * The generic placeholder policy that used to live here was replaced. It
 * was untracked, so a copy sits in the session scratchpad.
 */

export const metadata: Metadata = {
  title: PRIVACY_META.title,
  description: PRIVACY_META.description,
  alternates: { canonical: absoluteUrl("/privacy") },
  openGraph: pageOpenGraph("/privacy", PRIVACY_META.title, PRIVACY_META.description),
};

/** The rail, in page order. Built from the same data the page renders. */
const TOC: TocItem[] = [
  { id: "everything-we-collect", heading: PRIVACY_SUMMARY.h2 },
  ...PRIVACY_SECTIONS.slice(0, 5).map((s) => ({ id: s.id, heading: s.h2 })),
  { id: "what-we-dont-do", heading: PRIVACY_WONT_DO.h2 },
  { id: "who-processes-your-data", heading: PRIVACY_PROCESSORS.h2 },
  ...PRIVACY_SECTIONS.slice(5).map((s) => ({ id: s.id, heading: s.h2 })),
  { id: PRIVACY_CONTACT.id, heading: PRIVACY_CONTACT.h2 },
];

/** Section shell: anchored H2, then content. Generous rhythm. */
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
    // the id lives on the SECTION: the TOC links to #session-recording,
    // and scroll-mt keeps the heading clear of the fixed header
    <section id={id} aria-labelledby={`${id}-h`} className="mt-20 scroll-mt-28">
      <h2 id={`${id}-h`} className="text-h2 text-foreground">
        {h2}
      </h2>
      {children}
    </section>
  );
}

/**
 * Body prose. The email is linked wherever it appears in a paragraph:
 * the policy tells people to write to it five times, and a mailto is the
 * difference between a promise and a working one.
 */
function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-body mt-6 max-w-[68ch] text-muted-foreground first:mt-8">
          {p.includes(PRIVACY_EMAIL)
            ? p.split(PRIVACY_EMAIL).flatMap((part, j) =>
                j === 0
                  ? [part]
                  : [
                      <a
                        key={j}
                        href={`mailto:${PRIVACY_EMAIL}`}
                        className="text-accent transition-colors hover:text-accent-hover"
                      >
                        {PRIVACY_EMAIL}
                      </a>,
                      part,
                    ]
              )
            : p}
        </p>
      ))}
    </>
  );
}

export default function PrivacyPage() {
  // §3 to §7 sit between the summary table and "what we don't do";
  // §10 to §13 follow the processor table. Same order as the deck.
  const beforeWontDo = PRIVACY_SECTIONS.slice(0, 5);
  const afterProcessors = PRIVACY_SECTIONS.slice(5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Privacy Policy", path: "/privacy" },
            ])
          ),
        }}
      />

      <HashScroll />

      <div className="pb-24 pt-32 sm:pb-32 sm:pt-36">
        <Container width="wide">
          <div className="grid gap-x-16 lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)]">
            {/* ---------------- the policy ---------------- */}
            <div className="min-w-0">
              <Eyebrow>{PRIVACY_HEADER.eyebrow}</Eyebrow>
              <h1 className="text-h1 mt-5 text-foreground">{PRIVACY_HEADER.h1}</h1>

              {/* the display face, prominent, at the top: the first
                  thing a careful reader checks */}
              <p className="mt-6 font-serif text-[1.5rem] leading-tight text-foreground sm:text-[1.75rem]">
                Last updated: {PRIVACY_LAST_UPDATED}
              </p>

              <div className="mt-8 max-w-[68ch]">
                {PRIVACY_HEADER.intro.map((p, i) => (
                  <p key={i} className="text-body-lg mt-5 text-muted-foreground first:mt-0">
                    {p.includes(PRIVACY_EMAIL) ? (
                      <>
                        {p.split(PRIVACY_EMAIL)[0]}
                        <a
                          href={`mailto:${PRIVACY_EMAIL}`}
                          className="text-accent transition-colors hover:text-accent-hover"
                        >
                          {PRIVACY_EMAIL}
                        </a>
                        {p.split(PRIVACY_EMAIL)[1]}
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>

              {/* rail collapses to this under the intro, closed by default */}
              <PostToc items={TOC} variant="mobile" />

              {/* §2 — the summary table */}
              <Section id="everything-we-collect" h2={PRIVACY_SUMMARY.h2}>
                <SummaryTable />
              </Section>

              {/* §3 to §7 */}
              {beforeWontDo.map((s) => (
                <Section key={s.id} id={s.id} h2={s.h2}>
                  <Prose paragraphs={s.body} />
                </Section>
              ))}

              {/* §8 — hairline rows, the About page treatment */}
              <Section id="what-we-dont-do" h2={PRIVACY_WONT_DO.h2}>
                <dl className="mt-12 max-w-[68ch]">
                  {PRIVACY_WONT_DO.items.map((item) => (
                    <div
                      key={item.claim}
                      className="border-t-[0.5px] border-border py-7 last:border-b-[0.5px]"
                    >
                      <dt className="font-sans text-[1.0625rem] font-semibold text-foreground">
                        {item.claim}
                      </dt>
                      <dd className="text-body mt-3 text-muted-foreground">{item.body}</dd>
                    </div>
                  ))}
                </dl>
              </Section>

              {/* §9 — the processor table */}
              <Section id="who-processes-your-data" h2={PRIVACY_PROCESSORS.h2}>
                <Prose paragraphs={PRIVACY_PROCESSORS.intro} />
                <ProcessorTable />
              </Section>

              {/* §10 to §13 */}
              {afterProcessors.map((s) => (
                <Section key={s.id} id={s.id} h2={s.h2}>
                  <Prose paragraphs={s.body} />
                </Section>
              ))}

              {/* §14 */}
              <Section id={PRIVACY_CONTACT.id} h2={PRIVACY_CONTACT.h2}>
                <Prose paragraphs={PRIVACY_CONTACT.body} />
                <address className="text-body mt-8 not-italic text-muted-foreground">
                  {PRIVACY_CONTACT.entities.map((e, i) => (
                    <span key={e.name} className={i > 0 ? "mt-6 block" : "block"}>
                      <span className="block text-foreground">{e.name}</span>
                      {/* Any address lines render the moment they are set
                          in src/content/privacy.ts. The Texas one that
                          used to be pending here left with the partner
                          entity on 2026-08-09. */}
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
