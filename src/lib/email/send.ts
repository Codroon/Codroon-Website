import "server-only";
import { EMAIL } from "@/config/email";

/**
 * Resend, over its REST API — the same shape the existing contact
 * handler already uses, so there is no extra runtime dependency.
 *
 * Sending is ALWAYS best-effort from the caller's point of view. A lead
 * row is the thing we cannot afford to lose; an email that failed to go
 * out is recoverable from the row. Callers must not surface a delivery
 * failure to the visitor.
 *
 * ⚠️ codroon.com must be verified in Resend with SPF and DKIM before
 * anything sends. See README.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendResult =
  | { ok: true; delivered: boolean; id?: string }
  | { ok: false; error: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  // From has a default in config/email.ts; the KEY is the thing that
  // decides whether anything can send at all.
  const from = EMAIL.from;

  // Unconfigured is not a failure: local development and preview
  // deployments run without keys, and the lead still lands.
  if (!apiKey) {
    console.warn("[email] not configured — would have sent:", {
      to: msg.to,
      subject: msg.subject,
    });
    return { ok: true, delivered: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        // Transactional mail without a text part gets filtered.
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend rejected the send", res.status, body);
      return { ok: false, error: `resend ${res.status}` };
    }

    const json = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, delivered: true, id: json?.id };
  } catch (err) {
    console.error("[email] send threw", err);
    return { ok: false, error: String(err) };
  }
}
