import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

/**
 * The site's 404.
 *
 * Adding this file fixes two separate failures at once, which is why it
 * is worth more than it looks (client, 2026-08-09).
 *
 * 1. ILLEGIBLE. Without a root not-found, an unmatched URL got Next's
 *    built-in page, which injects an unlayered `body{color:#000;
 *    background:#fff}`. Unlayered rules beat everything in
 *    @layer utilities, so it overrode the `bg-background` utility on
 *    <body> while the Header and Footer still rendered in their
 *    light-on-dark colours. The nav measured 1.73:1 against white.
 *
 * 2. EMPTY. When notFound() is thrown from inside a page component,
 *    Next bails to an error shell whose body is a hidden empty div and
 *    some scripts. With JavaScript off the visitor got a blank white
 *    page. /products, /styleguide and /dev/emails all did this. A root
 *    not-found boundary means the framework has somewhere to render
 *    instead of bailing, so both symptoms go away together.
 *
 * Rendering inside the normal layout is the whole point: the surface,
 * header and footer come from the site, so the colours are the site's.
 */

export const metadata: Metadata = {
  title: "Page not found | Codroon",
  robots: { index: false, follow: true },
};

const ELSEWHERE = [
  { href: "/services/mvp-development", label: "MVP development" },
  { href: "/services/ai-agent-development", label: "AI agent development" },
  { href: "/tools/mvp-cost-calculator", label: "MVP cost calculator" },
  { href: "/tools/ai-agent-cost-calculator", label: "AI agent cost calculator" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function NotFound() {
  return (
    <Section className="pt-36 sm:pt-40">
      <Eyebrow>404</Eyebrow>
      <h1 className="text-h1 mt-5 max-w-3xl text-foreground">
        That page isn&rsquo;t here.
      </h1>
      <p className="text-body-lg mt-6 max-w-xl text-muted-foreground">
        The link may be out of date, or mistyped. Everything the old site had
        still resolves, so if you followed a link from somewhere else it is
        worth checking the address.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button href="/">Back to the homepage</Button>
        <Button href="/tools/mvp-cost-calculator" variant="secondary">
          Price a build
        </Button>
      </div>

      {/* Real links, not decoration: this is the one page where the
          visitor has already failed to find what they wanted. */}
      <nav aria-label="Popular pages" className="mt-16 border-t border-border pt-8">
        <p className="text-eyebrow text-tertiary">Or try one of these</p>
        <ul className="mt-5 flex flex-col gap-x-10 gap-y-3 sm:flex-row sm:flex-wrap">
          {ELSEWHERE.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-body inline-flex min-h-[44px] items-center text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
