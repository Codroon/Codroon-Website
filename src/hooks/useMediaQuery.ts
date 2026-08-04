"use client";
import { useEffect, useState } from "react";

/**
 * useMediaQuery — returns whether `query` currently matches.
 * Returns `false` until mounted (server-safe); components should treat
 * the first paint as the "small / base" case and enhance after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Convenience: true on desktop-width (>= 1024px), false until mounted. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export default useMediaQuery;