"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useConsent } from "@/components/cookies/ConsentContext";
import { ANALYTICS } from "@/config/analytics";

/**
 * Google Analytics, Microsoft Clarity and Mouseflow — on every page,
 * and on none of them until the visitor has accepted.
 *
 * Mounted inside ConsentProvider in Providers, which the root layout
 * wraps around everything, so this renders on every route the site has.
 * That is the vendors' "put it on every page" satisfied; in an App
 * Router build the root layout IS every page, and pasting three
 * snippets into each file by hand would only create three ways to
 * forget one.
 *
 * WHAT IT DOES NOT DO is put them in <head> the way the vendors'
 * install pages say to. Raw tags in <head> run for everybody on first
 * paint, before any banner is answered. §7 of our own privacy policy
 * says these are "off until you accept them", and §10 promises the
 * footer's cookie settings link can turn them back off. Both sentences
 * have to stay true, so consent is the gate and this component simply
 * renders nothing until it opens.
 *
 * Each snippet below is the vendor's own, changed in exactly two ways:
 * it is wrapped in next/script so it survives client-side navigation,
 * and Mouseflow's protocol-relative "//cdn…" is pinned to https.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    /** Clarity's queue-then-function global */
    clarity?: (...args: unknown[]) => void;
    /** Mouseflow's API object, present once its script has run */
    mouseflow?: { stop?: () => void; stopSession?: () => void };
    _mfq?: unknown[];
  }
}

/**
 * First-party cookies these three set on our own domain. Cleared when
 * consent is withdrawn, so "off until you accept" is true of what is
 * stored as well as of what is running.
 *
 *   _ga, _ga_<id>, _gid, _gat   Google Analytics
 *   _clck, _clsk, CLID          Microsoft Clarity
 *   mf_*                        Mouseflow
 */
const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid", "_gat", "_clck", "_clsk", "CLID", "mf_"];

function clearAnalyticsCookies() {
  const host = window.location.hostname;
  // a cookie only clears from the exact domain+path it was set on, and
  // we cannot read which that was, so try the plausible ones
  const parts = host.split(".");
  const registrable = parts.length > 2 ? parts.slice(-2).join(".") : host;
  const domains = ["", host, `.${host}`, registrable, `.${registrable}`];

  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0];
    if (!ANALYTICS_COOKIE_PREFIXES.some((p) => name.startsWith(p))) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
    }
  }
}

export function AnalyticsScripts() {
  const { analytics } = useConsent();
  /**
   * Whether anything actually loaded in THIS page view. Rejecting from
   * the banner on a first visit must not trigger the teardown below —
   * nothing ran, so there is nothing to tear down and no reason to
   * reload the page under someone who has only just arrived.
   */
  const loaded = useRef(false);

  useEffect(() => {
    if (analytics) {
      loaded.current = true;
      return;
    }
    if (!loaded.current) return;

    /* Consent withdrawn from the footer's cookie settings after having
       been given. Unmounting the <Script> tags below does not unrun
       them, so use each vendor's documented off switch, clear what they
       stored, and reload. The reload is the part that actually
       guarantees it: after it, consent reads "rejected" and none of the
       three mount at all. */
    loaded.current = false;

    if (ANALYTICS.ga) {
      // Google's documented per-property opt-out flag
      (window as unknown as Record<string, boolean>)[`ga-disable-${ANALYTICS.ga}`] = true;
    }
    try {
      window.clarity?.("consent", false);
      window.clarity?.("stop");
    } catch {
      /* the script may not have finished loading; the reload covers it */
    }
    try {
      // stopSession, not stop: stop is a pause and can resume
      window.mouseflow?.stopSession?.();
    } catch {
      /* same */
    }
    clearAnalyticsCookies();
    window.location.reload();
  }, [analytics]);

  if (!analytics) return null;

  return (
    <>
      {ANALYTICS.ga && (
        <>
          <Script
            id="ga-js"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.ga}`}
          />
          {/* Order-independent: gtag.js drains whatever is already in
              dataLayer when it loads, so this may run either side of it. */}
          <Script id="ga-config" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ANALYTICS.ga}');`}
          </Script>
        </>
      )}

      {ANALYTICS.clarity && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${ANALYTICS.clarity}");`}
        </Script>
      )}

      {ANALYTICS.mouseflow && (
        <Script id="mouseflow" strategy="afterInteractive">
          {`window._mfq = window._mfq || [];
(function() {
var mf = document.createElement("script");
mf.type = "text/javascript"; mf.defer = true;
mf.src = "https://cdn.mouseflow.com/projects/${ANALYTICS.mouseflow}.js";
document.getElementsByTagName("head")[0].appendChild(mf);
})();`}
        </Script>
      )}
    </>
  );
}

export default AnalyticsScripts;
