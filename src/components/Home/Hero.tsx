import { ArrowRight, ArrowUpRight, Boxes, FileCode2, Presentation, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CtaButton } from "@/components/contact/CtaButton";
import { HeroBackground } from "./HeroBackground";
import { HeroVisual } from "./HeroVisual";

/**
 * Hero — two-column split: copy left, abstract product visual right.
 * Server-rendered; entrance animation is CSS-only (anim-rise), so the
 * content is complete and readable without JavaScript. The primary CTA
 * opens the shared contact modal.
 */

const TAGS = [
  { icon: Boxes, label: "4 products live" },
  { icon: Timer, label: "2–6 week MVPs" },
  { icon: FileCode2, label: "You own the code" },
  { icon: Presentation, label: "Weekly demos" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-40">
      <HeroBackground />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          {/* Copy — left */}
          <div>
            <div className="anim-rise-lcp">
              <Eyebrow>AI-Native Software Studio</Eyebrow>
            </div>

            <h1 className="text-h1 anim-rise-lcp anim-delay-1 mt-6 text-foreground">
              Ship your AI product in weeks, not months.
            </h1>

            <p className="text-body-lg anim-rise-lcp anim-delay-2 mt-6 max-w-xl text-muted-foreground">
              Book a free discovery call and walk us through your workflow.
              You&apos;ll leave with a plan and a fast path to your MVP,
              automation, or AI agent.
            </p>

            <div className="anim-rise anim-delay-3 mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CtaButton size="lg">
                Book a free discovery call
                <ArrowRight className="size-[1.1em]" aria-hidden />
              </CtaButton>
              <Button href="#products" variant="secondary" size="lg">
                See our work
                <ArrowUpRight className="size-[1.1em]" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Visual — right (self-contained, swappable) */}
          <div className="anim-rise anim-delay-2 hidden lg:block">
            <HeroVisual />
          </div>
        </div>

        {/* Tag strip — 4 across */}
        <ul className="anim-rise anim-delay-4 mt-24 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-8 sm:mt-32 lg:grid-cols-4">
          {TAGS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-accent-dim">
                <Icon size={17} aria-hidden />
              </span>
              <span className="text-[0.95rem] font-medium text-muted-foreground">{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Hero;
