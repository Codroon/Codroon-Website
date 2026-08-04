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

  /* ---- write the lead -------------------------------------------- */
  const supabase = getSupabase();
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

  /* ---- look up the estimate for the emails ----------------------- */
  let summary = null;
  if (shortCode && supabase) {
    try {
      const { data } = await supabase.rpc("get_estimate", {
        p_short_code: shortCode,
      });
      const row = data?.[0] as EstimateRow | undefined;
      if (row) summary = summariseEstimate(row);
    } catch (err) {
      console.error("[lead] estimate lookup failed", err);
    }
  }

  /* ---- email: best effort, never blocking ------------------------ */
  const receivedAt = new Date();

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
      if (input.source === "estimator_email" && summary) {
        await sendEmail({
          to: email,
          replyTo: EMAIL.replyTo,
          ...(await renderEstimateEmail(summary)),
        });
      } else if (input.source === "modal_email") {
        // no estimate needed: this acknowledges the message itself
        await sendEmail({
          to: email,
          replyTo: EMAIL.replyTo,
          ...(await renderAckEmailEmail(input.name)),
        });
      } else if (input.source === "modal_call" && input.phone) {
        await sendEmail({
          to: email,
          replyTo: EMAIL.replyTo,
          ...(await renderAckCallEmail(input.phone)),
        });
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

  return NextResponse.json({ ok: true, stored: written });
}
