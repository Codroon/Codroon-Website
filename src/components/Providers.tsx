"use client";
import { MotionConfig } from "framer-motion";
import { ContactModalProvider } from "@/components/contact/ContactModalContext";
import { ConsentProvider } from "@/components/cookies/ConsentContext";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { HAS_ANALYTICS } from "@/config/analytics";

/**
 * Providers — app-wide client context.
 *  - MotionConfig reducedMotion="user" makes every Framer Motion
 *    animation respect the OS "reduce motion" setting automatically.
 *  - ContactModalProvider hosts the ONE shared contact modal that every
 *    conversion CTA opens (no inline forms on pages).
 *  - ConsentProvider gates analytics. It only ASKS on a first visit once
 *    a provider is actually configured: interrupting people to consent
 *    to scripts that do not exist yet would be theatre. The footer's
 *    "Cookie settings" link opens it either way, because the privacy
 *    policy points at that link.
 *  - AnalyticsScripts loads GA, Clarity and Mouseflow, and must sit
 *    INSIDE ConsentProvider because it reads that gate. The root layout
 *    wraps this around every route, which is how the three end up on
 *    every page without being pasted into any of them.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ConsentProvider askOnFirstVisit={HAS_ANALYTICS}>
        <ContactModalProvider>{children}</ContactModalProvider>
        <CookieBanner />
        <AnalyticsScripts />
      </ConsentProvider>
    </MotionConfig>
  );
}
