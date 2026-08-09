import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { getSupabase } from "@/lib/supabase/client";
import { isShortCode } from "@/lib/supabase/estimates";
import type { EstimateRow, LeadSource } from "@/lib/supabase/types";
import { summariseEstimate } from "@/lib/email/estimateSummary";
import { estimatorNotification, modalNotification } from "@/emails/notifications";
import {
  renderAckCallEmail,
  renderAckEmailEmail,
  renderEstimateEmail,
} from "@/emails/render";
import { sendEmail } from "@/lib/email/send";
import { EMAIL } from "@/config/email";
import { SITE } from "@/config/site";

/**
 * The one route every lead comes through — all five sources, one pass:
 * write the row, send the visitor's email if there is one, send the
 * notification. No webhook, no round trip, nothing to fall between two
 * systems.
 *
 * ORDERING IS THE WHOLE POINT. The row is written first and its result
 * decides the response. Email is attempted afterwards and can fail
 * freely: a lead lost because SMTP hiccuped is the worst outcome
 * available, so a delivery failure is logged and the visitor is still
 * told it worked.
 */

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

const SOURCES = [
  "modal_call",
  "modal_email",
  "modal_meeting",
  "estimator_email",
  "estimator_quote",
] as const;

const schema = z.object({
  source: z.enum(SOURCES),
  shortCode: z.string().trim().toLowerCase().optional(),
  name: z.string().trim().max(200).optional(),
  email: z.email().max(320).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().max(5000).optional(),
  callConsent: z.boolean().optional(),
  smsConsent: z.boolean().optional(),
  /** honeypot — a real person never sees this field */
  company: z.string().optional(),
});

const ESTIMATOR_SOURCES: LeadSource[] = ["estimator_email", "estimator_quote"];

/** Never surface why we said no; just say no. */
const ok = () => NextResponse.json({ ok: true });

export async function POST(req: Request) {
  /* ---- rate limit ------------------------------------------------ */
  const limited = rateLimit(
    `lead:${clientIp(req)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS
  );
  if (!limited.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  /* ---- reject cross-origin and non-JSON, BEFORE parsing ----------
     Two gaps, both closed here (client, 2026-08-09).

     ORIGIN. The route did no origin check, so any page anywhere could
     post to it. It is not a CSRF hole in the classic sense, since
     nothing here reads a session cookie, but it is an open write
     endpoint for anyone who wants to fill the table with noise.
     A MISSING Origin is allowed on purpose: same-origin form posts,
     server-to-server calls and the smoke tests send none. What is
     refused is an Origin that is present and foreign, which is exactly
     the browser-driven cross-site case.

     CONTENT-TYPE. req.json() parses a text/plain body happily, and
     text/plain is one of the three types a cross-origin form can send
     without a preflight. Requiring application/json forces any
     cross-origin caller through a CORS preflight, which we never
     answer, so the request dies in the browser before it arrives. */
  const origin = req.headers.get("origin");
  if (origin) {
    const allowed = new Set(
      [SITE.url, process.env.NEXT_PUBLIC_SITE_URL, `https://${process.env.VERCEL_URL ?? ""}`]
        .filter(Boolean)
        .map((u) => {
          try {
            return new URL(u as string).origin;
          } catch {
            return "";
          }
        })
        .filter(Boolean)
    );
    // the request's own host is always legitimate: it covers preview
    // deployments and localhost without hard-coding either
    const host = req.headers.get("host");
    if (host) {
      allowed.add(`https://${host}`);
      allowed.add(`http://${host}`);
    }
    if (!allowed.has(origin)) {
      console.warn("[lead] cross-origin post refused", { origin });
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 403 });
    }
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 415 }
    );
  }

  /* ---- parse + validate ------------------------------------------ */
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check your details." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Honeypot: 200 and discard, so the bot believes it worked.
  if (input.company && input.company.trim() !== "") return ok();

  const email = input.email && input.email !== "" ? input.email : null;
  const shortCode =
    input.shortCode && isShortCode(input.shortCode) ? input.shortCode : null;

  const supabase = getSupabase();

  /* ---- resolve the estimate FIRST --------------------------------
     This lookup used to sit after the write, purely to build the
     emails. It runs first now because the empty-row guard below has
     to know whether the code resolves to a real estimate — a
     syntactically valid short code that matches nothing would still
     produce a lead linked to nothing. Same single round trip, just
     earlier. */
  let summary = null;
  let estimateExists = false;
  if (shortCode && supabase) {
    try {
      const { data } = await supabase.rpc("get_estimate", {
        p_short_code: shortCode,
      });
      const row = data?.[0] as EstimateRow | undefined;
      if (row) {
        estimateExists = true;
        summary = summariseEstimate(row);
      }
    } catch (err) {
      console.error("[lead] estimate lookup failed", err);
    }
  }

  /* ---- reject empty rows -----------------------------------------
     A row with no contact details AND no estimate behind it is not a
     lead — there is nothing in it to act on and nobody to act on it
     with. These accumulated from QA runs hitting the real CTA against
     a live database (client, 2026-08-06).

     modal_meeting is the ONE exemption, and it is deliberate: it has
     no form to submit and never carries an estimate, so it is empty
     by construction. It records that someone opened the scheduler and
     may have abandoned it, which is the only trace that flow leaves.
     Drop the exemption and that signal disappears entirely.

     A rejected write must never be visible to the visitor: every
     caller is fire-and-forget, and the quote CTA opens Calendly
     without waiting on this response. */
  const hasContact = Boolean(
    input.name?.trim() || email || input.phone?.trim() || input.message?.trim()
  );
  if (!hasContact && !estimateExists && input.source !== "modal_meeting") {
    console.warn("[lead] empty write rejected", {
      source: input.source,
      shortCode,
      reason: shortCode ? "short code resolved to no estimate" : "no short code",
    });
    return NextResponse.json(
      { ok: false, error: "Nothing to record." },
      { status: 400 }
    );
  }

  /* ---- write the lead -------------------------------------------- */
  let written = false;

  if (supabase) {
    try {
      if (ESTIMATOR_SOURCES.includes(input.source)) {
        // create_lead resolves the estimate from its short code
        // server-side. An estimate_id from the client is never trusted,
        // and is not accepted by this route at all.
        const { error } = await supabase.rpc("create_lead", {
          p_source: input.source,
          p_short_code: shortCode,
          p_name: input.name ?? null,
          p_email: email,
          p_phone: input.phone ?? null,
          p_message: input.message ?? null,
        });
        written = !error;
        if (error) console.error("[lead] create_lead failed", error);
      } else {
        const { error } = await supabase.from("leads").insert({
          source: input.source as "modal_call" | "modal_email" | "modal_meeting",
          name: input.name ?? null,
          email,
          phone: input.phone ?? null,
          message: input.message ?? null,
        });
        written = !error;
        if (error) console.error("[lead] insert failed", error);
      }
    } catch (err) {
      console.error("[lead] write threw", err);
    }
  } else {
    console.warn("[lead] persistence not configured — lead not stored:", {
      source: input.source,
      shortCode,
    });
  }

  /* ---- email: best effort, never blocking ------------------------ */
  const receivedAt = new Date();

  /**
   * What actually happened to the visitor's own email, so the client can
   * stop claiming a delivery that was never possible.
   *
   *   "sent"        we handed it to the provider
   *   "unavailable" we could not even BUILD it. Only estimator_email can
   *                 land here: its template needs a resolved estimate,
   *                 and without a short code there is nothing to render.
   *                 A shared estimate page posted no short code, so the
   *                 dialog said "On its way" for an email that never
   *                 existed (client, 2026-08-09).
   *   "failed"      built and attempted, provider refused.
   *   "none"        this source sends the visitor nothing by design.
   *
   * "failed" is deliberately NOT surfaced as a user-facing problem: a
   * delivery hiccup is ours to chase and the row is already written.
   * "unavailable" is different in kind, because no retry on our side
   * will ever produce that email.
   */
  let visitorEmail: "sent" | "unavailable" | "failed" | "none" = "none";

  try {
    /* -- to the visitor, only when they asked to hear from us --------
       estimator_email  → template 1, the estimate
       modal_email      → template 2, "we got your message"
       modal_call       → template 3, but ONLY with an email to send to
       modal_meeting    → nothing. Calendly already confirms it, and two
                          confirmations for one booking reads as a system
                          that does not know what it has done.
       estimator_quote  → nothing. The visitor is mid-booking. */
    if (email) {
      if (input.source === "estimator_email") {
        if (summary) {
          const r = await sendEmail({
            to: email,
            replyTo: EMAIL.replyTo,
            ...(await renderEstimateEmail(summary)),
          });
          visitorEmail = r.ok ? "sent" : "failed";
        } else {
          // No resolvable estimate, so renderEstimateEmail has nothing
          // to render. Say so instead of falling through silently.
          visitorEmail = "unavailable";
          console.warn("[lead] estimator_email with no resolvable estimate", {
            shortCode,
            hasShortCode: Boolean(shortCode),
          });
        }
      } else if (input.source === "modal_email") {
        // no estimate needed: this acknowledges the message itself
        const r = await sendEmail({
          to: email,
          replyTo: EMAIL.replyTo,
          ...(await renderAckEmailEmail(input.name)),
        });
        visitorEmail = r.ok ? "sent" : "failed";
      } else if (input.source === "modal_call" && input.phone) {
        const r = await sendEmail({
          to: email,
          replyTo: EMAIL.replyTo,
          ...(await renderAckCallEmail(input.phone)),
        });
        visitorEmail = r.ok ? "sent" : "failed";
      }
    }

    /* -- to sales@, every lead -------------------------------------- */
    const notification =
      ESTIMATOR_SOURCES.includes(input.source) && summary
        ? estimatorNotification({
            source: input.source as "estimator_email" | "estimator_quote",
            receivedAt,
            email,
            summary,
          })
        : modalNotification({
            source: input.source as "modal_call" | "modal_email" | "modal_meeting",
            receivedAt,
            name: input.name,
            email,
            phone: input.phone,
            message: input.message,
            callConsent:
              input.source === "modal_call" ? Boolean(input.callConsent) : undefined,
            smsConsent:
              input.source === "modal_call" ? Boolean(input.smsConsent) : undefined,
            estimateUrl: summary?.shareUrl ?? null,
          });

    await sendEmail({
      to: EMAIL.notify,
      // sales@, not the lead's address: replying to the sending
      // subdomain reaches nobody
      replyTo: EMAIL.replyTo,
      ...notification,
    });
  } catch (err) {
    // Deliberately swallowed. The row is what we cannot lose.
    console.error("[lead] email step failed (lead still recorded)", err);
  }

  // `visitorEmail` lets the caller tell "we sent it" from "we could
  // never have sent it". The row is written either way, so this stays a
  // 200: the lead is captured and nothing about it needs retrying.
  return NextResponse.json({ ok: true, stored: written, visitorEmail });
}
