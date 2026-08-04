import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CtaButton } from "@/components/contact/CtaButton";
import { PostCover } from "./PostCover";
import { postHref } from "@/content/blog";
import type { BlogPost, Takeaway, PostCta, RelatedLink } from "@/content/blog/types";

/**
 * The standalone blocks a post page composes around its body: key
 * takeaways, the closing CTA, related reading, prev/next, and the
 * compact recent-post cards used in the right rail.
 *
 * All server components except CtaButton, which has to be a client
 * component to open the shared contact modal.
 */

/* ------------------------------------------------------------------
   KEY TAKEAWAYS — the most important block on the page
   ------------------------------------------------------------------ */

/**
 * Sits above the body, before the first H2, fully in the server HTML.
 * Never an accordion, never truncated, never client-rendered: this is
 * the block that gets lifted into AI Overviews and featured snippets,
 * and anything hidden behind interaction cannot be.
 *
 * Distinguished by a left accent hairline on a raised surface rather
 * than a rounded card, per the design direction.
 */
export function KeyTakeaways({ items }: { items: Takeaway[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="key-takeaways-h" className="my-12 border-l-2 border-accent bg-surface py-7 pl-7 pr-6">
      <h2 id="key-takeaways-h" className="text-eyebrow text-tertiary">
        Key takeaways
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((t) => (
          <li key={t.lead} className="flex gap-3">
            <span aria-hidden className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent-dim" />
            <p className="text-body min-w-0 text-muted-foreground">
              <strong className="font-semibold text-foreground">{t.lead}</strong>{" "}
              {t.rest}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------
   CLOSING CTA
   ------------------------------------------------------------------ */

/** `href: null` opens the shared contact modal instead of navigating. */
function CtaAction({
  cta,
  variant,
}: {
  cta: PostCta;
  variant: "primary" | "secondary";
}) {
  if (!cta.label) return null;
  if (cta.href === null) {
    return (
      <CtaButton variant={variant} size="md">
        {cta.label}
      </CtaButton>
    );
  }
  return (
    <Button href={cta.href} variant={variant} size="md">
      {cta.label}
    </Button>
  );
}

export function PostCtaBlock({
  heading,
  body,
  primary,
  secondary,
  divider = true,
}: {
  heading: string;
  body: string[];
  primary: PostCta;
  secondary: PostCta;
  /**
   * Draw the top rule. FALSE when an FAQ precedes this block: the
   * accordion already closes itself with a bottom rule, so a second rule
   * 80px below it rendered as an empty extra row under the last question
   * (client, 2026-08-04). One separator, not two.
   */
  divider?: boolean;
}) {
  return (
    <section
      aria-labelledby="post-cta-h"
      className={cn("mt-20 pt-12", divider && "border-t border-border")}
    >
      <h2 id="post-cta-h" className="font-sans text-2xl font-semibold text-foreground sm:text-[1.75rem]">
        {heading}
      </h2>
      {body.map((p, i) => (
        <p key={i} className="text-body mt-5 max-w-2xl text-muted-foreground">
          {p}
        </p>
      ))}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <CtaAction cta={primary} variant="primary" />
        <CtaAction cta={secondary} variant="secondary" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   RELATED READING — into services, tools and products
   ------------------------------------------------------------------ */

export function RelatedReading({ links }: { links: RelatedLink[] }) {
  if (links.length === 0) return null;
  return (
    <section aria-labelledby="related-reading-h" className="mt-16">
      <h2 id="related-reading-h" className="text-eyebrow text-tertiary">
        Related reading
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex h-full min-h-[44px] items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3.5 transition-colors hover:border-border-strong"
            >
              <span className="text-small min-w-0 text-foreground">{l.label}</span>
              <ArrowRight
                size={14}
                aria-hidden
                className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------
   PREV / NEXT
   ------------------------------------------------------------------ */

/**
 * Direction only, no post titles (client, 2026-08-03). The titles are
 * still supplied as the links' accessible names, so "Previous" and
 * "Next" are not the only thing a screen reader hears.
 */
export function PrevNextPosts({ prev, next }: { prev?: BlogPost; next?: BlogPost }) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="More posts"
      className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8"
    >
      {prev ? (
        <Link
          href={postHref(prev.slug)}
          aria-label={`Previous post: ${prev.title}`}
          className="text-eyebrow inline-flex min-h-[44px] items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={13} aria-hidden />
          Previous
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={postHref(next.slug)}
          aria-label={`Next post: ${next.title}`}
          className="text-eyebrow inline-flex min-h-[44px] items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          Next
          <ArrowRight size={13} aria-hidden />
        </Link>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------
   RECENT POSTS — right rail
   ------------------------------------------------------------------ */

/**
 * Covers only, no title beneath (client, 2026-08-03) — the cover
 * already carries the category and headline, and the repeated title
 * read as clutter in a narrow column.
 *
 * The whole cover is the link, so it needs an accessible name of its
 * own: without the aria-label the link would be announced from the
 * cover's image label, which omits the post title entirely.
 */
export function RecentPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="recent-posts-h">
      <h2 id="recent-posts-h" className="text-eyebrow text-tertiary">
        Recent posts
      </h2>
      <ul className="mt-4 space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={postHref(p.slug)}
              aria-label={p.title}
              className="block rounded-[var(--radius-lg)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <PostCover
                category={p.category}
                coverHeadline={p.coverHeadline}
                coverSubtitle={p.coverSubtitle}
                watermark={p.watermark}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
