"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ProductSlide } from "@/content/products/types";

/**
 * ProductSlider — auto-advancing screenshot slider for product pages.
 *
 * Behaviour is deliberately conservative:
 *  - advances every 7s (never faster than the 6s floor)
 *  - pauses on hover AND on keyboard focus, resumes on leave/blur
 *  - prev/next + dots are real <button>s, so keyboard works for free
 *  - prefers-reduced-motion → no autoplay and no transition; it opens on
 *    the first slide and the controls still work
 *  - every frame reserves its exact aspect ratio, so nothing shifts as
 *    images decode (CLS)
 *
 * All slides stay in the DOM (a translated track), so the captions are
 * readable with JavaScript disabled.
 */
/**
 * Only a literal hex is accepted. An invalid inline border-color is
 * dropped by CSS and the border falls back to `currentColor` — which on
 * this page is near-white #eae5e1, not the neutral hairline — so one
 * typo in a content module would ship a glaring white frame that no
 * type, lint or build step can catch. Validating here means a bad value
 * degrades to exactly the documented fallback instead.
 */
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function ProductSlider({
  slides,
  label,
  brandColor,
}: {
  slides: ProductSlide[];
  label: string;
  /** the product's own colour, tinting the frame edge only */
  brandColor?: string;
}) {
  const tint = brandColor && HEX.test(brandColor.trim()) ? brandColor.trim() : null;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const baseId = useId();
  const liveRef = useRef<HTMLDivElement>(null);

  const count = slides.length;

  const autoplay = !reduceMotion && !paused && count > 1;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [autoplay, count]);

  const go = (next: number) => setIndex(((next % count) + count) % count);

  if (count === 0) return null;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Viewport — all slides live in the DOM; only the offset changes.
          The frame takes the ACTIVE slide's own ratio (client call,
          2026-08-02: the container must match the image, no letterbox
          bars), and the ratio itself animates between slides so mixed
          screenshot sizes ease rather than jump. Still reserved before
          the image loads — the ratio is declared, so no CLS. */}
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-lg)] border bg-surface",
          // falls back to the neutral hairline when a product has no
          // colour of its own yet, or supplied an unusable one
          !tint && "border-border",
          !reduceMotion &&
            "transition-[aspect-ratio] duration-700 [transition-timing-function:var(--ease-out-expo)]"
        )}
        style={{
          aspectRatio: `${slides[index].width} / ${slides[index].height}`,
          ...(tint
            ? {
                borderColor: tint,
                /* a low-alpha spread of the same colour, so the edge
                   reads as belonging to the product instead of as a
                   stray 1px line on a dark page. color-mix is the only
                   part that needs a modern engine; where it is not
                   supported the shadow is dropped and the solid 1px
                   border still carries the tint. */
                boxShadow: `0 0 0 1px color-mix(in srgb, ${tint} 35%, transparent), 0 18px 60px -24px color-mix(in srgb, ${tint} 60%, transparent)`,
              }
            : null),
        }}
      >
        <div
          ref={liveRef}
          aria-live={autoplay ? "off" : "polite"}
          className={cn(
            "flex h-full",
            !reduceMotion &&
              "transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)]"
          )}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.caption}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className="h-full w-full shrink-0"
            >
              <div className="relative h-full w-full bg-surface-raised">
                {slide.src ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={slide.width}
                    height={slide.height}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    priority={i === 0}
                    /* contain, not cover: these are UI screenshots, and
                       cropping one silently removes interface the
                       caption is pointing at. The frame already matches
                       this slide's ratio, so contain fills it edge to
                       edge; bars appear only mid-transition. */
                    className="h-full w-full object-contain"
                  />
                ) : (
                  /* TODO: real screenshot pending — reserved frame, never
                     a mocked-up UI. Set `src` on the slide to fill it. */
                  <div
                    className="hero-dotgrid absolute inset-0 flex items-center justify-center"
                    role="img"
                    aria-label={slide.alt}
                  >
                    <span className="text-eyebrow text-tertiary">
                      Screenshot to come
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption + controls */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          id={`${baseId}-caption`}
          className="text-small max-w-xl text-muted-foreground"
        >
          {slides[index].href ? (
            /* live-site slide: only the DOMAIN is the link (accent, same
               treatment as the meta rail's Visit field); the rest of the
               caption stays ordinary muted text */
            <>
              <a
                href={slides[index].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 align-baseline text-accent transition-colors hover:text-accent-hover"
              >
                {new URL(slides[index].href).hostname.replace(/^www\./, "")}
                <ArrowUpRight className="size-[1.1em]" aria-hidden />
              </a>
              {", "}
              {slides[index].caption}
            </>
          ) : (
            slides[index].caption
          )}
        </p>

        {/* Dots only — each is a real <button>, so every slide stays
            directly reachable by keyboard without prev/next arrows. */}
        <div className="flex items-center">
          <ul className="flex items-center">
            {slides.map((slide, i) => (
              <li key={slide.caption}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show screenshot ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                  className="flex h-11 w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-5 bg-accent" : "w-1.5 bg-border-strong"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductSlider;
