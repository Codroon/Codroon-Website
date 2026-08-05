import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ABOUT_HERO } from "@/content/about";

/**
 * §1 Hero — full-bleed dark band, the arrival moment the page lacked.
 *
 * The H1 runs considerably larger than any other type on the site
 * (up to 96px against the shared text-h1's 60px ceiling) because this
 * is the one place the display face is the whole design. It keeps its
 * own -0.02em tracking, the brief's hero value, rather than the
 * -0.01em card default. The old `font-normal` came off with the font
 * swap: 400 is below the weight floor for the display face on these
 * dark surfaces, and it only ever meant "the single weight the old
 * serif shipped".
 *
 * Behind it, the hexagon logomark at very low opacity, bleeding off the
 * right edge — the same treatment as the giant CODROON wordmark in the
 * footer (pointer-events-none, select-none, ~3 to 5% opacity).
 * Decorative, so aria-hidden and never announced.
 */
export function AboutHero() {
  return (
    <section
      aria-labelledby="about-h1"
      className="relative flex min-h-[58vh] items-center overflow-hidden border-b border-border py-24 sm:min-h-[62vh]"
    >
      {/* logomark, bleeding off the right edge */}
      <img
        src="/images/codroon-mark.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-1/2 w-[62vw] max-w-[820px] -translate-y-1/2 select-none opacity-[0.055] sm:-right-[6%] sm:w-[46vw]"
      />

      <Container width="wide" className="relative">
        <div className="max-w-[15ch] sm:max-w-none">
          <Eyebrow>{ABOUT_HERO.eyebrow}</Eyebrow>
        </div>
        {/* Only the CEILING moved, 6rem to 4.5rem: 96px was too big at
            1440 (client, 2026-08-04), but 375 and 768 were never the
            complaint. Keeping the 2.75rem floor and the 7vw step means
            phone and tablet render exactly as before and only screens
            above ~1030px change. It still runs larger than the shared
            text-h1's 60px ceiling, because this is the one place the
            display face is the whole design; it just no longer shouts.

            The nowrap span is the fix for "co-found" splitting across
            lines: browsers treat an existing hyphen as a break
            opportunity, so the line could end on "co-" with "found" on
            the next. Rendered from the same copy string rather than
            retyped, so the deck stays the single source. */}
        <h1
          id="about-h1"
          className="mt-7 max-w-[16ch] font-serif text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          {ABOUT_HERO.h1.split(/(co-found)/).map((part, i) =>
            part === "co-found" ? (
              <span key={i} className="whitespace-nowrap">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </h1>
        <p className="text-body-lg mt-8 max-w-[52ch] text-muted-foreground">
          {ABOUT_HERO.subhead}
        </p>
      </Container>
    </section>
  );
}

export default AboutHero;
