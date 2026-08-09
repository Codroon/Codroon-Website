import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCover } from "./PostCover";
import { postHref } from "@/content/blog";
import type { BlogPost } from "@/content/blog/types";

/**
 * PostCard — one entry in the /blog grid. Cover on TOP, metadata
 * BELOW it: date, then the title as the link, then "READ MORE →" with
 * a hairline under the text only.
 *
 * The date and title deliberately live OUTSIDE the cover: the cover
 * carries the coverHeadline and nothing else, and the title is never
 * rendered on it.
 *
 * The TITLE is the anchor (client, 2026-08-03), stretched over the
 * whole card via its ::after so every pixel navigates while there is
 * still exactly one link per card named after the post. "READ MORE" is
 * a visual affordance inside that click surface, not a second link.
 *
 * Uniform height across a row: the card is a full-height flex column,
 * the title clamps to two lines, and the read-more row is pinned with
 * mt-auto, so a one-line and a two-line title produce identical cards.
 */

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });

export function PostCard({
  post,
  /** the teaser row uses a tighter type scale */
  compact = false,
  /**
   * The landing teaser sits on the full-bleed accent band. Every piece
   * of text there must be --accent-foreground (#232220): light-on-
   * orange fails contrast, which is a hard rule in globals.css. The
   * cover itself is unaffected — it is its own dark surface.
   */
  onAccent = false,
  className,
}: {
  post: BlogPost;
  compact?: boolean;
  onAccent?: boolean;
  className?: string;
}) {
  return (
    <li className={cn("h-full", className)}>
      <article className="group relative flex h-full flex-col">
        <PostCover
          category={post.category}
          coverHeadline={post.coverHeadline}
          coverSubtitle={post.coverSubtitle}
          watermark={post.watermark}
        />

        <time
          dateTime={post.publishedAt}
          className={cn(
            "mt-6 block",
            compact ? "text-[0.8125rem]" : "text-small",
            onAccent ? "text-accent-foreground" : "text-muted-foreground"
          )}
        >
          {formatDate(post.publishedAt)}
        </time>

        {/* H2 on the listing — one H1 per page lives on the page itself */}
        <h2
          className={cn(
            "mt-2 font-sans font-semibold leading-snug",
            compact ? "text-[1.0625rem]" : "text-xl sm:text-2xl",
            onAccent ? "text-accent-foreground" : "text-foreground"
          )}
        >
          <Link
            href={postHref(post.slug)}
            className={cn(
              "line-clamp-2 transition-colors after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4",
              onAccent
                ? "hover:opacity-75 focus-visible:outline-accent-foreground"
                : "hover:text-accent focus-visible:outline-accent"
            )}
          >
            {post.title}
          </Link>
        </h2>

        {/* hairline sits under the TEXT only, not the full card width */}
        <span
          className={cn(
            "text-eyebrow mt-auto inline-flex w-fit items-center gap-2 border-b pb-1.5 pt-6 transition-colors",
            onAccent
              ? "border-accent-foreground/40 text-accent-foreground group-hover:border-accent-foreground"
              : "border-border text-muted-foreground group-hover:border-accent group-hover:text-foreground"
          )}
        >
          Read more
          <ArrowRight
            size={13}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </article>
    </li>
  );
}

export default PostCard;
