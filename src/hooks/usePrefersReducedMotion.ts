"use client";
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * usePrefersReducedMotion — returns true when the user has requested
 * reduced motion. Gate ALL transform/parallax animation through this:
 * reduced motion → instant or opacity-only, never transforms.
 *
 * Defaults to `true` on the server / first paint so motion never
 * flashes before we know the preference.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setPrefersReduced(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return prefersReduced;
}

export default usePrefersReducedMotion;