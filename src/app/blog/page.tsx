import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts, postHref } from "@/content/blog";
import { getAuthor } from "@/content/blog/authors";
import {
  absoluteUrl,
  blogJsonLd,
  breadcrumbJsonLd,
  jsonLdString,
  organizationJsonLd,
  pageOpenGraph,
} from "@/lib/seo";

/**
 * /blog — the listing. Fully server-rendered: the post list comes from
 * the content registry at build time, never from a client fetch.
 *
 * No pagination and no load-more: seven posts render in full. Revisit
 * past roughly twelve.
 */

const TITLE = "Blog: Notes from the Studio | Codroon";
const DESCRIPTION =
  "Notes from the Codroon studio on AI agents, MVPs, deployment, automation, and what building software in 2026 actually costs. Written by the people who ship it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: pageOpenGraph("/blog", TITLE, DESCRIPTION),
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            blogJsonLd({
              name: "Notes from the studio",
              description: DESCRIPTION,
              path: "/blog",
              // authorName was never passed, so every one of the seven
              // blogPost entries here was authorless while the Article
              // node on each post named one. Same posts, two different
              // answers to "who wrote this" (client, 2026-08-09).
              posts: posts.map((p) => ({
                title: p.title,
                description: p.metaDescription,
                path: postHref(p.slug),
                publishedAt: p.publishedAt,
                updatedAt: p.updatedAt,
                authorName: getAuthor(p.author)?.name ?? "Codroon",
              })),
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }}
      />

      <Section className="pt-36 sm:pt-40" spacing="compact" containerWidth="wide">
        <div className="anim-rise-lcp">
          <Eyebrow>Insights</Eyebrow>
        </div>
        <h1 className="text-h1 anim-rise-lcp anim-delay-1 mt-5 max-w-2xl text-foreground">
          Notes from the studio
        </h1>
      </Section>

      <Section spacing="compact" containerWidth="wide" className="pt-0">
        {posts.length === 0 ? (
          <p className="text-body-lg max-w-xl text-muted-foreground">
            First posts are on the way. Nothing is published yet.
          </p>
        ) : (
          /* 2-up from lg. Tablet stays single column with wider margins
             rather than crowding two covers into 768px. */
          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:gap-y-20">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
