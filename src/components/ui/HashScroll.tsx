"use client";
import { useEffect } from "react";

/**
 * Re-runs the browser's anchor scroll once the fonts have settled.
 *
 * Support links like /privacy#session-recording or /terms#who-owns-what
 * are the reason the anchors exist, and on a COLD load they were landing
 * ~90px too far down, with the heading hidden under the fixed header.
 * The cause is height, not offset: the display face swaps in after the
 * browser has already scrolled, and every heading above the target
 * changes height, so the target moves out from under the scroll
 * position. Measured: the document lost 419px between first paint and
 * the swap.
 *
 * scrollIntoView honours scroll-margin-top, so the 28-unit scroll-mt on
 * each section still does the header clearance. Runs once, on mount,
 * only when the URL actually carries a hash.
 *
 * Shared by the two long anchored legal pages.
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let cancelled = false;
    const settle = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    fonts.then(() => requestAnimationFrame(settle));

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export default HashScroll;
