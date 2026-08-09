"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/contact/ContactModalContext";
import { OutlineButton } from "./shared";

/**
 * The two results-screen CTAs.
 *
 * "Get a fixed price quote" does NOT open the three-option contact
 * menu — someone who has just configured an estimate has already told
 * us what they want; asking them to pick a contact method again is a
 * step backwards. It opens the shared modal DIRECTLY on the Calendly
 * view (client, 2026-08-02 — was a new tab before), carrying the
 * estimate code as the a1 prefill, and records the signal in the
 * background: a failed write must never cost a booking.
 *
 * "Email me this estimate" is a small inline modal, not a page change.
 */

/**
 * Best-effort lead record: never throws, never blocks the caller's UI
 * decision. The quote CTA fires and forgets; the email dialog awaits
 * it only to pace its "Sending…" state.
 */
type LeadResult = { ok?: boolean; visitorEmail?: string } | null;

function postLead(body: Record<string, unknown>): Promise<LeadResult> {
  try {
    return fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // keepalive: opening the scheduler must not cancel the record
      keepalive: true,
    }).then(
      (r) => r.json().catch(() => null),
      () => null
    );
  } catch {
    return Promise.resolve(null);
  }
}

export function ResultsCtas({
  primaryLabel,
  secondaryLabel,
  shortCode,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  shortCode?: string | null;
}) {
  const { open: openContactModal } = useContactModal();
  const [emailOpen, setEmailOpen] = useState(false);

  function requestQuote() {
    // shortCode is omitted when absent — the API's zod schema takes
    // optional-undefined, and an explicit null was 400ing the record
    // whenever persistence hadn't assigned a code yet
    void postLead({ source: "estimator_quote", ...(shortCode ? { shortCode } : {}) });
    // a1 prefills Calendly's first custom question — add one named
    // "Estimate code" on the event type for this to land anywhere useful
    openContactModal("meeting", {
      calendlyParams: shortCode ? { a1: shortCode } : undefined,
      // the estimator_quote row above already records this visit, and
      // it carries the short code; a bare modal_meeting alongside it is
      // an empty duplicate
      intentAlreadyRecorded: true,
    });
  }

  return (
    <>
      {/* Below sm this is a flex COLUMN, which stretches its children.
          "Email me this estimate" is a bare <button> so it stretched to
          full width, while the primary sits inside MagneticButton's
          inline-block wrapper and kept its intrinsic width — so the two
          disagreed on a phone (client, 2026-08-04). Both are full width
          there now, matching the closing CTAs everywhere else on the
          site, and both revert to intrinsic width from sm up. */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={requestQuote} className="max-sm:w-full">
          {primaryLabel}
        </Button>
        <OutlineButton
          size="sm"
          onClick={() => setEmailOpen(true)}
          className="max-sm:w-full"
        >
          {secondaryLabel}
        </OutlineButton>
      </div>
      {emailOpen && (
        <EmailEstimateDialog
          shortCode={shortCode}
          onClose={() => setEmailOpen(false)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------
   Email me this estimate — one field, one button, inline success
   ------------------------------------------------------------------ */

function EmailEstimateDialog({
  shortCode,
  onClose,
}: {
  shortCode?: string | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<
    "idle" | "sending" | "sent" | "logged" | "invalid"
  >("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("invalid");
      return;
    }
    setState("sending");
    // same null-vs-undefined trap as the quote CTA: omit when absent
    const res = await postLead({
      source: "estimator_email",
      ...(shortCode ? { shortCode } : {}),
      email,
      company,
    });
    // A delivery failure stays invisible: the row is what matters and
    // chasing the provider is our job, not theirs. But "unavailable"
    // means no estimate email could be built at all, and telling
    // someone we sent one then is simply untrue.
    setState(res?.visitorEmail === "unavailable" ? "logged" : "sent");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-estimate-h"
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-border-strong bg-surface p-6 sm:p-7"
      >
        {state === "sent" || state === "logged" ? (
          <>
            <h2
              id="email-estimate-h"
              className="text-[1.0625rem] font-medium text-foreground"
            >
              {state === "sent" ? "On its way." : "We have your address."}
            </h2>
            <p className="text-small mt-2 text-muted-foreground">
              {state === "sent" ? (
                <>We&rsquo;ve sent a link to this estimate to {email}.</>
              ) : (
                <>
                  We couldn&rsquo;t attach this estimate to an email, so
                  we&rsquo;ve passed {email} to the team and someone will send
                  it to you directly.
                </>
              )}
            </p>
            <div className="mt-6">
              <OutlineButton size="sm" onClick={onClose}>
                Close
              </OutlineButton>
            </div>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2
              id="email-estimate-h"
              className="text-[1.0625rem] font-medium text-foreground"
            >
              Email me this estimate
            </h2>
            {/* honeypot — off-screen, not display:none, so bots fill it */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="absolute left-[-9999px] h-px w-px opacity-0"
            />
            <label htmlFor="estimate-email" className="sr-only">
              Email address
            </label>
            <input
              ref={inputRef}
              id="estimate-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "invalid") setState("idle");
              }}
              placeholder="you@company.com"
              aria-invalid={state === "invalid"}
              aria-describedby="estimate-email-note"
              className="mt-4 min-h-[48px] w-full rounded-[var(--radius-sm)] border border-border bg-surface-raised px-4 text-[0.95rem] text-foreground placeholder:text-tertiary"
            />
            {state === "invalid" && (
              <p className="text-small mt-2 text-error">
                That doesn&rsquo;t look like an email address.
              </p>
            )}
            <p id="estimate-email-note" className="text-small mt-3 text-tertiary">
              We&rsquo;ll send you a link to this estimate. Nothing else.
            </p>
            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send it"}
              </Button>
              <OutlineButton size="sm" onClick={onClose}>
                Cancel
              </OutlineButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResultsCtas;
