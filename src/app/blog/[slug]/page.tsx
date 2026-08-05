import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SummarizeBar } from "@/components/services/SummarizeBar";
import { FaqSection } from "@/components/services/FaqSection";
import { PostCover } from "@/components/blog/PostCover";
import { PostBody } from "@/components/blog/PostBody";
import { PostToc } from "@/components/blog/PostToc";

import {
  KeyTakeaways,
  PostCtaBlock,
  PrevNextPosts,
  RecentPosts,
  RelatedReading,
} from "@/components/blog/PostBlocks";
import {
  getAllPosts,
  getAdjacentPosts,
  getPost,
  ogDescriptionFor,
  ogTitleFor,
  postHref,
  readingMinutes,
  tocFor,
} from "@/content/blog";
import { getAuthor } from "@/content/blog/authors";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  jsonLdString,
  organizationJsonLd,
} from "@/lib/seo";

/**
 * /blog/[slug] — the post template.
 *
 * Two columns from lg: article ~68%, sticky rail ~32%. Below lg the
 * rail is gone entirely and the TOC becomes a closed <details> block
 * under the H1.
 *
 * STRUCTURAL GUARANTEES (the old template violated both):
 *  - every H2 is emitted by its own section, before that section's
 *    content, so a heading can never trail the text it introduces
 *  - nothing is injected into the article body. The byline sits in the
 *    header above the H1 and appears exactly once.
 *
 * Fully server-rendered. The only client component in the tree is the
 * TOC, and only for highlighting; its links work without JavaScript.
 */

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const path = postHref(slug);
  const ogTitle = ogTitleFor(post);
  const ogDescription = ogDescriptionFor(post);
  const image = `${path}/opengraph-image`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "article",
      url: absoluteUrl(path),
      siteName: "Codroon",
      title: ogTitle,
      description: ogDescription,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverSubtitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const path = postHref(slug);
  const canonical = absoluteUrl(path);
  const author = getAuthor(post.author);
  const { prev, next } = getAdjacentPosts(slug);
  const recent = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3);
  const toc = tocFor(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            articleJsonLd({
              headline: post.title,
              description: post.metaDescription,
              path,
              publishedAt: post.publishedAt,
              updatedAt: post.updatedAt,
              imagePath: `${path}/opengraph-image`,
              author: { name: author?.name ?? "Codroon" },
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
              { name: post.title, path },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }}
      />

      {/* pb: the article column and the sticky rail both end exactly at
          this wrapper's bottom edge, which sat flush against the footer,
          so the rail's last cover butted into it (client, 2026-08-04). */}
      <div className="pb-24 pt-32 sm:pb-32 sm:pt-36">
        <Container width="wide">
          <div className="grid gap-x-16 lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)]">
            {/* ---------------- article ---------------- */}
            <article className="min-w-0">
              {/* Cover spans the full article column so it sits flush
                  with the H1 and body measure beneath it (client,
                  2026-08-03 — it was capped at landing-card width). */}
              <PostCover
                category={post.category}
                coverHeadline={post.coverHeadline}
                coverSubtitle={post.coverSubtitle}
                watermark={post.watermark}
              />

              <header className="mt-8">
                {/* the byline lives HERE and nowhere else, never in the body */}
                <p className="text-small flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden>·</span>
                  <span>{readingMinutes(post)} min read</span>
                  {author && (
                    <>
                      <span aria-hidden>·</span>
                      <span>By {author.name}</span>
                    </>
                  )}
                </p>

                <h1 className="text-h1 mt-4 max-w-3xl text-foreground">{post.title}</h1>
              </header>

              {/* mobile TOC + summarize: both high on the page, because
                  the rail they normally live in is hidden below lg */}
              <PostToc items={toc} variant="mobile" />
              <div className="mt-6 lg:hidden">
                <SummarizeBar canonicalUrl={canonical} variant="rail" />
              </div>

              <KeyTakeaways items={post.keyTakeaways} />

              {/* No width cap (client, 2026-08-04). The intro used to be
                  max-w-2xl — 672px against the article column's 870px at
                  1440 — so its lines broke ~200px early and it was the
                  one block in the article that did not share the measure
                  of the Key Takeaways box above it or the body below.
                  It stays at text-body-lg: the size is the standfirst
                  treatment, the width was the bug. */}
              {post.intro.length > 0 && (
                <div>
                  {post.intro.map((p, i) => (
                    <p key={i} className="text-body-lg mt-5 text-muted-foreground first:mt-0">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-14">
                <PostBody sections={post.sections} />
              </div>

              {post.faq.items.length > 0 && (
                <section className="mt-20 border-t border-border pt-12">
                  <FaqSection heading={post.faq.heading} items={post.faq.items} />
                </section>
              )}

              {/* No top rule when the FAQ is there: the accordion's own
                  closing rule already separates them, and two rules 80px
                  apart read as an empty sixth question. */}
              <PostCtaBlock
                heading={post.finalCta.heading}
                body={post.finalCta.body}
                primary={post.finalCta.primary}
                secondary={post.finalCta.secondary}
                divider={post.faq.items.length === 0}
              />

              <RelatedReading links={post.relatedLinks} />
              <PrevNextPosts prev={prev} next={next} />
            </article>

            {/* ---------------- sticky rail ----------------
                Summary, then Summarize with AI, then Recent posts.
                The summarize links sit above the fold on purpose: a
                visitor handing the post to an assistant is the point,
                so it goes where it gets clicked. */}
            <aside className="mt-16 hidden lg:mt-0 lg:block">
              <div className="sticky top-28 space-y-10">
                <PostToc items={toc} />
                <SummarizeBar canonicalUrl={canonical} variant="rail" />
                <RecentPosts posts={recent} />
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
