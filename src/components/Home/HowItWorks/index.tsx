"use client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { HowItWorksDesktop } from "./HowItWorksDesktop";
import { HowItWorksStacked } from "./HowItWorksStacked";

/**
 * HowItWorks — chooses the right experience:
 *  - desktop + motion OK → pinned, scroll-linked cinematic stage
 *  - mobile OR reduced-motion → stacked, readable cards
 *
 * First paint (SSR + pre-mount) renders the stacked layout, so the
 * narrative copy is always present for SEO / screen readers; desktop
 * users upgrade to the pinned stage after mount.
 */
export function HowItWorks() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  if (isDesktop && !reduced) {
    return <HowItWorksDesktop />;
  }
  return <HowItWorksStacked reduced={reduced} />;
}

export default HowItWorks;
