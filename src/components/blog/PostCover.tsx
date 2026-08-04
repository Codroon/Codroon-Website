import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * PostCover — the generated typographic cover card every blog post
 * gets. No photography, no uploads: category chip, a 2–3 line display
 * headline, a one-line subtitle, a giant ghosted watermark clipped by
 * the card, the wordmark, and a 2px accent rule along the bottom.
 *
 * The COVER HEADLINE IS NOT THE POST TITLE. The headline is short and
 * punchy and lives only on the card; the title is longer,
 * keyword-loaded, and rendered below the card by the listing. Never
 * pass the title in here.
 *
 * Sizing is deterministic and server-rendered: the card is a CSS
 * container and the headline font-size is computed from its longest
 * line in cqi units, so a line can never soft-wrap onto a fourth line
 * or clip mid-word, at any card width, with no JavaScript.
 *
 * Accessibility: the card is role="img" with a label built from the
 * chip, headline and subtitle (role=img makes the children
 * presentational, so nothing is read twice).
 *
 * One deliberate token deviation from the build spec: the subtitle
 * uses text-muted-foreground, not text-tertiary — the token sheet's
 * own note says tertiary only passes 4.5:1 on --surface-page, and
 * this card sits on --surface-card. The decorative wordmark stays
 * tertiary because it is not content.
 */

/**
 * Geist semibold averages ~0.60em per glyph at this tracking; 88cqi of
 * usable width after padding → size = 88 / (0.60 × longest) cqi. Set
 * as a custom property so the CAP can vary by container width while
 * the width-fitting term stays the same.
 *
 * The cap has to drop on narrow cards. The chip and subtitle carry px
 * FLOORS so they stay readable, and a floor is a fixed cost against a
 * height that shrinks proportionally — so on a 343px card a 3-line
 * headline plus a 2-line subtitle overflowed a 16:10 box and the
 * subtitle was clipped. Measured, not guessed: 8.5cqi is what fits the
 * worst case ("Antigravity / vs Cursor. / Honestly." with a wrapping
 * subtitle) at 375.
 */
const headlineFit = (lines: string[]) => {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return `${(146 / longest).toFixed(2)}cqi`;
};

export function PostCover({
  category,
  coverHeadline,
  coverSubtitle,
  watermark,
  className,
}: {
  /** the chip, top-left */
  category: string;
  /** 2–3 short lines, newline-separated, rendered verbatim — NOT the title */
  coverHeadline: string;
  /** one line, bottom-left */
  coverSubtitle: string;
  /** ghosted word behind the headline; defaults to the category's first word */
  watermark?: string;
  className?: string;
}) {
  // never a fourth line, even if frontmatter supplies one
  const lines = coverHeadline.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3);
  const ghost = (watermark ?? category.split(/\s+/)[0]).toUpperCase();

  return (
    // The @container MUST be an outer wrapper, not the card itself:
    // cqi units inside the element that declares the container resolve
    // against an ANCESTOR container (viewport fallback), never itself.
    // With them on one element the padding computed off the viewport,
    // overflowed the card, and killed the footer's mt-auto.
    <div className={cn("@container", className)}>
      <div
        role="img"
        aria-label={`${category}. ${lines.join(" ")}. ${coverSubtitle}`}
        className="relative flex aspect-[16/10] w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-[6cqi]"
      >
        {/* ghosted watermark — clipped by the card on purpose */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-[5cqi] top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-sans font-black uppercase leading-none tracking-[-0.03em] text-accent-dim opacity-[0.16]"
          style={{ fontSize: "24cqi" }}
        >
          {ghost}
        </span>

        {/* category chip — clamped so it never shrinks unreadable on a
            mobile-width card nor balloons on a wide one */}
        <span
          className="text-eyebrow relative z-10 self-start rounded-full bg-surface-raised px-[2.6cqi] py-[1.1cqi] text-foreground"
          style={{ fontSize: "clamp(0.64rem, 2.1cqi, 0.78rem)" }}
        >
          {category}
        </span>

        {/* headline — sits directly under the chip, top-anchored */}
        <p
          className="relative z-10 mt-[3.4cqi] whitespace-pre-line font-sans font-semibold leading-[1.06] tracking-[-0.02em] text-foreground text-[min(8.5cqi,var(--hl))] @[26rem]:text-[min(11.5cqi,var(--hl))]"
          style={{ "--hl": headlineFit(lines) } as React.CSSProperties}
        >
          {lines.join("\n")}
        </p>

        {/* bottom row: subtitle left, brand mark right. mt-auto pins it
            to the floor, so the gap between headline and subtitle grows
            with the card rather than the headline drifting down. */}
        <div className="relative z-10 mt-auto flex items-end justify-between gap-[4cqi]">
          {/* two lines is the budgeted maximum; a longer subtitle
              ellipsises rather than pushing the rule off the card */}
          <p
            className="line-clamp-2 text-muted-foreground"
            style={{ fontSize: "clamp(0.72rem, 2.4cqi, 0.95rem)" }}
          >
            {coverSubtitle}
          </p>
          {/* decorative: without this the mark keeps its own role="img"
              and accessible name, nesting a second image inside a card
              that is already one */}
          <Wordmark
            decorative
            className="h-[clamp(8px,2.2cqi,13px)] w-auto shrink-0 text-tertiary"
          />
        </div>

        {/* hairline rule along the bottom edge */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-accent" />
      </div>
    </div>
  );
}

export default PostCover;
