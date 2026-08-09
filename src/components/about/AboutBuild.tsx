import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactModalLink } from "@/components/contact/ContactModalLink";
import { ABOUT_AI_NATIVE, ABOUT_BUILD } from "@/content/about";

/**
 * §4 + §5 — "How we build" on the left, the AI-native aside as a card
 * on the RIGHT of it (client, 2026-08-03) rather than stacked beneath.
 *
 * The aside sits sticky on the tall left column so it stays beside the
 * claims it qualifies instead of stranding at the top. Below lg the two
 * stack, aside last.
 *
 * lg:mt-40 drops it clear of the eyebrow and H2 so it starts level with
 * the first claim rather than the top of the section (client,
 * 2026-08-04). The margin applies before it sticks, so scrolling still
 * pins it at top-28.
 *
 * The H2 is not width-capped: the left column narrowed when the aside
 * moved in beside it, and a 20ch cap on top of that broke the heading
 * into a stack of stubs. text-balance evens the lines it does take.
 *
 * The aside is the brand orange (client, 2026-08-04), so the HARD RULE
 * applies inside it: every text node on the accent is #232220
 * (--accent-foreground). Never the muted token, which fails contrast
 * on orange.
 *
 * Numerals hang outside the text column at lg, where the gutter exists.
 */
export function AboutBuild() {
  return (
    <section aria-labelledby="build-h" className="py-24 sm:py-32">
      <Container width="wide">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
          {/* ---- left: the claims ---- */}
          <div>
            <Eyebrow>{ABOUT_BUILD.eyebrow}</Eyebrow>
            <h2 id="build-h" className="text-h2 mt-5 text-balance text-foreground">
              {ABOUT_BUILD.h2}
            </h2>

            <div className="mt-12 space-y-14">
              {ABOUT_BUILD.items.map((item, n) => (
                <div
                  key={item.claim}
                  className="lg:grid lg:grid-cols-[2.5rem_minmax(0,1fr)] lg:gap-x-8"
                >
                  <span
                    aria-hidden
                    className="text-mono mb-3 block text-[1.5rem] leading-none text-muted-foreground lg:mb-0 lg:mt-1.5 lg:text-right"
                  >
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 max-w-[58ch]">
                    <h3 className="font-sans text-xl font-semibold text-foreground">
                      {item.claim}
                    </h3>
                    {item.body.map((p, i) => (
                      <p key={i} className="text-body mt-5 text-muted-foreground">
                        {p}
                      </p>
                    ))}
                    <div className="mt-4 flex flex-wrap items-center gap-x-8">
                      {item.links.map((l) =>
                        l.href === null ? (
                          <ContactModalLink key={l.label}>{l.label}</ContactModalLink>
                        ) : (
                          <Link
                            key={l.label}
                            href={l.href}
                            className="text-small inline-flex min-h-[44px] items-center text-accent transition-colors hover:text-accent-hover"
                          >
                            {l.label}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- right: the AI-native aside ---- */}
          <aside
            aria-labelledby="ai-native-h"
            className="rounded-[var(--radius-lg)] bg-accent p-7 sm:p-8 lg:sticky lg:top-28 lg:mt-40"
          >
            <p className="text-eyebrow text-accent-foreground">{ABOUT_AI_NATIVE.eyebrow}</p>
            <h2 id="ai-native-h" className="mt-4 font-serif text-[1.75rem] leading-tight text-accent-foreground">
              {ABOUT_AI_NATIVE.h2}
            </h2>
            {ABOUT_AI_NATIVE.body.map((p, i) => (
              <p key={i} className="text-small mt-4 leading-relaxed text-accent-foreground first:mt-6">
                {p}
              </p>
            ))}
          </aside>
        </div>
      </Container>
    </section>
  );
}

export default AboutBuild;
