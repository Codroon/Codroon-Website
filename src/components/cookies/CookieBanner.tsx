"use client";
import Link from "next/link";
import { useConsent } from "./ConsentContext";
import { Button } from "@/components/ui/Button";

/**
 * The consent banner the policy promises in §7 and §10.
 *
 * Reject is exactly as easy to click as accept: same size, same
 * position, side by side, no dark pattern where one is a faint link.
 * There is no close button, because dismissing without choosing would
 * leave consent ambiguous — the gate stays off until someone picks.
 *
 * Reopened any time from "Cookie settings" in the footer, which is the
 * link §7 and §10 both point at.
 *
 * ⚠️ The two sentences below are the ONLY copy on this page's work that
 * is not from the deck: a banner is UI chrome and the deck has no words
 * for it. Kept plain and specific, in the register of the policy.
 */
export function CookieBanner() {
  const { isOpen, accept, reject } = useConsent();
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-h"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="max-w-[62ch]">
          <h2 id="cookie-banner-h" className="text-eyebrow text-tertiary">
            Cookies
          </h2>
          <p className="text-small mt-3 leading-relaxed text-muted-foreground">
            Analytics cookies help us see which pages work. They stay off until
            you accept, and you can change your mind at any time using the
            cookie settings link in the footer.{" "}
            <Link
              href="/privacy#cookies"
              className="text-accent transition-colors hover:text-accent-hover"
            >
              Read the policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button onClick={accept} size="md" className="max-sm:w-full">
            Accept
          </Button>
          <Button
            onClick={reject}
            variant="secondary"
            size="md"
            className="max-sm:w-full"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
