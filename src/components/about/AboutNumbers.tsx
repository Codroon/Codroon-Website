import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ABOUT_NUMBERS } from "@/content/about";

/**
 * §2 Numbers — full-bleed band on surface-card, so it reads as a band
 * rather than as more page content. Four across in ONE row with
 * vertical hairline dividers between them.
 *
 * Still not cards: the contrast comes from the band behind all four,
 * not from a box around each one.
 *
 * ⚠️ TODO (client): confirm "10 on the team". If ten counts contractors
 * and the two joint-venture teams, the deck's honest alternative is
 * "10 across the studio and the products we co-founded". It is the one
 * figure a prospect can test in a single question.
 */
export function AboutNumbers() {
  return (
    <section aria-label="Codroon in numbers" className="border-b border-border bg-surface py-16 sm:py-20">
      <Container width="wide">
        <dl className="grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:gap-y-0">
          {ABOUT_NUMBERS.map((n, i) => (
            <div
              key={n.label}
              className={cn(
                "sm:pr-8",
                // Vertical hairlines BETWEEN columns only, never a box.
                // The rule differs per breakpoint: at 4-up every item
                // but the first gets one; at 2-up only the right-hand
                // cell does, or the second row picks up a stray rule on
                // its left edge.
                i % 2 === 1 && "border-l-[0.5px] border-border pl-6",
                i > 0 && "sm:border-l-[0.5px] sm:border-border sm:pl-8",
                i === 2 && "border-l-0 pl-0"
              )}
            >
              <dd className="font-serif text-[clamp(2.5rem,4vw,3.25rem)] leading-none tracking-[-0.015em] text-foreground">
                {n.value}
              </dd>
              <dt className="mt-3 font-sans text-[0.95rem] font-medium text-foreground">
                {n.label}
              </dt>
              <dd className="mt-2 max-w-[26ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                {n.description}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export default AboutNumbers;
