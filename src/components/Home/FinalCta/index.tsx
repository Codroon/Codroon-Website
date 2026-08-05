import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Button, CTA_FIT } from "@/components/ui/Button";
import { CtaButton } from "@/components/contact/CtaButton";

/**
 * FinalCta — closing conversion block: large headline left, supporting
 * text and button right. The button opens the shared contact modal
 * (no inline form, no marquee banner).
 *
 * It is a bordered card on the PAGE surface, which is why it reads as a
 * distinct block rather than merging into the footer — the footer is
 * bg-surface, so a closing band on that same surface blends into it.
 * That is exactly what happened on /about before this component was
 * reused there.
 *
 * Props default to the landing-page copy, so the homepage is unchanged.
 * /about passes its own deck copy and a secondary button; the two
 * estimator pages pass `ctaHref` because their closing CTA has to walk
 * people into the estimator rather than open the contact modal.
 */
export function FinalCta({
  heading = "Ready to ship your AI product?",
  body = "Walk us through your workflow on a free discovery call. You'll leave with a concrete plan, whether or not you build with us.",
  ctaLabel = "Get your free consultation",
  /** when set the primary NAVIGATES here; otherwise it opens the modal */
  ctaHref,
  secondary,
}: {
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondary?: { label: string; href: string };
} = {}) {
  return (
    <Section id="final-cta" containerWidth="wide">
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 sm:p-12 lg:p-16">
        {/* Two long labels side by side (as on the product pages) need more
            than half the card, so the columns go asymmetric ONLY when a
            secondary button is present. The homepage has none and keeps
            the even split. */}
        <div
          className={cn(
            "grid items-center gap-10",
            secondary
              ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12"
              : "lg:grid-cols-2 lg:gap-16"
          )}
        >
          <h2 className="text-h2 text-foreground">{heading}</h2>
          <div>
            <p className="text-body-lg text-muted-foreground">{body}</p>
            {/* Buttons are whitespace-nowrap at lg size, and these labels
                are long. Two fixes, both needed:
                  · sm:flex-wrap — a second long label (as /about passes)
                    drops to its own line instead of running past the
                    card padding.
                  · fit — below sm the label alone is wider than the card
                    interior at 375, so the button goes full width, wraps
                    its text and grows in height rather than overflowing. */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {ctaHref ? (
                <Button href={ctaHref} size="lg" className={CTA_FIT}>
                  {ctaLabel}
                  <ArrowRight className="size-[1.1em] shrink-0 max-sm:hidden" aria-hidden />
                </Button>
              ) : (
                <CtaButton size="lg" className={CTA_FIT}>
                  {ctaLabel}
                  {/* the label wraps to two lines below sm; the arrow would
                      then sit centred beside the block. It is decorative. */}
                  <ArrowRight className="size-[1.1em] shrink-0 max-sm:hidden" aria-hidden />
                </CtaButton>
              )}
              {secondary && (
                <Button href={secondary.href} variant="secondary" size="lg" className={CTA_FIT}>
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default FinalCta;
