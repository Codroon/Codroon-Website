import { Container } from "@/components/ui/Container";
import { ABOUT_FOUNDERS } from "@/content/about";

/**
 * §3 How we work with founders — THE VISUAL ANCHOR.
 *
 * Full-bleed #e96a42, the one place on the page (and the only place on
 * this page at all) the brand colour appears as a surface at full
 * strength. It carries the strongest content on the page.
 *
 * HARD RULE: every piece of text directly on the orange is #232220
 * (--accent-foreground). Never white, never #eae5e1 — light on orange
 * fails contrast at 2.54:1.
 *
 * Left: the H2 and both paragraphs. Right: the two-model comparison,
 * moved out of the prose column and rendered as a DARK card sitting on
 * the orange. That card occupies the space a photo would have, and it
 * is better than a photo because it is the thing a reader needs in
 * order to decide. Text inside the card is back on the dark surface,
 * so it uses the normal foreground tokens.
 *
 * The card is --surface-card (#232220), the same surface every other
 * card on the site uses, NOT --surface-page (#1a1917): the page surface
 * read as flat black against the orange (client, 2026-08-04). It also
 * now matches the AI-native card in the section below.
 */
export function AboutFounders() {
  return (
    <section aria-labelledby="founders-h" className="bg-accent py-24 sm:py-32">
      <Container width="wide">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
          {/* ---- left: the argument ---- */}
          <div>
            <p className="text-eyebrow text-accent-foreground">{ABOUT_FOUNDERS.eyebrow}</p>
            <h2 id="founders-h" className="text-h2 mt-5 max-w-[18ch] text-accent-foreground">
              {ABOUT_FOUNDERS.h2}
            </h2>
            {ABOUT_FOUNDERS.body.map((p, i) => (
              <p key={i} className="text-body mt-6 max-w-[56ch] text-accent-foreground first:mt-8">
                {p}
              </p>
            ))}
          </div>

          {/* ---- right: the two models, as a dark card on the orange ---- */}
          <dl className="rounded-[var(--radius-lg)] bg-surface p-7 sm:p-8">
            {ABOUT_FOUNDERS.models.map((m, i) => (
              <div
                key={m.label}
                className={
                  i === 0
                    ? "pb-6"
                    : "border-t-[0.5px] border-border py-6 last:pb-0"
                }
              >
                <dt className="font-sans text-[0.95rem] font-semibold text-foreground">
                  {m.label}
                </dt>
                <dd className="text-small mt-2 leading-relaxed text-muted-foreground">
                  {m.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- below both columns, full width ---- */}
        <p className="text-body mt-14 max-w-[68ch] text-accent-foreground">
          {ABOUT_FOUNDERS.closing}
        </p>
      </Container>
    </section>
  );
}

export default AboutFounders;
