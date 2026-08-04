import { ImageResponse } from "next/og";
import { getPost } from "@/content/blog";

/**
 * Per-post OG card, 1200×630, generated from the SAME cover fields the
 * on-page PostCover uses. No uploaded images anywhere in the blog.
 *
 * This is Satori, not a browser: no container queries, no line-clamp,
 * no CSS variables. So the layout is re-expressed in absolute pixels
 * and the brand colours are inlined literals rather than tokens. Keep
 * it visually equivalent to PostCover; it cannot share code with it.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Codroon blog post cover";

/* brand values, mirrored from globals.css — Satori cannot read tokens */
const SURFACE = "#232220";
const RAISED = "#2e2c28";
const BORDER = "#403d36";
const TEXT = "#eae5e1";
const MUTED = "#c8c5b9";
const TERTIARY = "#8a857a";
const ACCENT = "#e96a42";
const ACCENT_DIM = "#a04a2e";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", background: SURFACE }} />
      ),
      size
    );
  }

  const lines = post.coverHeadline.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3);
  const longest = Math.max(...lines.map((l) => l.length), 1);
  // same fit rule as PostCover: 88% of usable width / 0.6em per glyph,
  // expressed against 1200px instead of container units
  const fontSize = Math.min(132, Math.round((1200 * 1.46) / longest / 10) * 10);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          padding: 72,
          position: "relative",
        }}
      >
        {/* ghosted watermark, clipped by the right edge */}
        <div
          style={{
            position: "absolute",
            right: -60,
            top: 190,
            fontSize: 288,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: ACCENT_DIM,
            opacity: 0.16,
            whiteSpace: "nowrap",
          }}
        >
          {post.watermark}
        </div>

        {/* category chip */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              background: RAISED,
              color: TEXT,
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 22,
              letterSpacing: "0.12em",
            }}
          >
            {post.category}
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 34,
            fontSize,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            color: TEXT,
          }}
        >
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>

        {/* footer: subtitle left, wordmark right */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 26, color: MUTED, maxWidth: 820 }}>{post.coverSubtitle}</div>
          <div style={{ fontSize: 22, letterSpacing: "0.18em", color: TERTIARY }}>CODROON</div>
        </div>

        {/* accent rule along the bottom edge */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            background: ACCENT,
          }}
        />
      </div>
    ),
    size
  );
}
