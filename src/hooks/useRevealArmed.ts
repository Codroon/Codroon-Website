"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * False during server rendering and the hydration pass, true from just
 * before the first client paint onwards.
 *
 * WHY THIS EXISTS. framer-motion serialises its `initial` variant into
 * an inline style during SSR, so `initial="hidden"` shipped
 * `style="opacity:0;transform:translateY(24px)"` in the HTML. Anything
 * that stops the client bundle running then leaves those blocks
 * permanently invisible: a blocked chunk, a script error, a flaky
 * network, or JavaScript simply off. On the homepage that was the six
 * service cards, the Why Codroon steps, the How it works steps and the
 * testimonial; in the footer it was 12 of 14 links, on every page,
 * including the site's main internal-linking hub (client, 2026-08-09).
 *
 * The copy was always in the HTML, so crawlers could read it. The
 * failure mode was a human seeing blank space with no way to recover.
 *
 * Callers render plain markup while this is false and the motion
 * version once it is true. Swapping the element remounts it, which is
 * what makes framer re-read `initial` and actually run the reveal;
 * simply flipping the prop would not, because `initial` is read once at
 * mount, and the animation would be silently lost site-wide.
 *
 * useLayoutEffect runs before paint, so the swap is not visible. It
 * falls back to useEffect on the server purely to avoid React's
 * "useLayoutEffect does nothing on the server" warning.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useRevealArmed(): boolean {
  const [armed, setArmed] = useState(false);
  useIsomorphicLayoutEffect(() => setArmed(true), []);
  return armed;
}

export default useRevealArmed;
