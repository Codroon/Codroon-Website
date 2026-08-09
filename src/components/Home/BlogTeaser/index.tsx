import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { getRecentPosts } from "@/content/blog";

/**
 * BlogTeaser — "Latest from the studio": the three most recent posts in
 * a 3-up row, using the same card anatomy as /blog in its compact type
 * scale, then a link through to the full listing.
 *
 * Reads the real post registry, and renders NOTHING when it is empty.
 * The previous version carried its own hard-coded array, which is how
 * three fabricated posts ended up live on the homepage; there is now no
 * local data for anyone to fill in.
 *
 * Sits after Testimonials and before the Final CTA.
 */
export function BlogTeaser() {
  const posts = getRecentPosts(3);
  if (posts.length === 0) return null;

  return (
    // full-bleed accent band, matching Testimonials above it. ALL text
    // directly on this surface is --accent-foreground (#232220).
    <section id="blog" aria-labelledby="home-blog-h" className="bg-accent py-24 sm:py-32">
      <Container width="wide">
        <p className="text-eyebrow text-accent-foreground">Insights</p>
        <h2 id="home-blog-h" className="text-h2 mt-5 max-w-2xl text-accent-foreground">
          Latest from the studio.
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} compact onAccent />
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/blog"
            className="text-eyebrow group inline-flex min-h-[44px] items-center gap-2 border-b border-accent-foreground/40 pb-1 text-accent-foreground transition-colors hover:border-accent-foreground"
          >
            Read all insights
            <ArrowRight
              size={13}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default BlogTeaser;
