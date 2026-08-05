import { NextResponse } from "next/server";
import { cronAuthorised, getSupabaseAdmin } from "@/lib/supabase/admin";
import { highValueDigest, type HighValueRow } from "@/lib/email/digests";
import { sendEmail } from "@/lib/email/send";

/**
 * Alert: completed estimates over $25,000 with no contact details
 * attached.
 *
 * SCHEDULE — the intended cadence is HOURLY, and the query is written
 * for it: it is a "since I last looked" sweep with no time window, so
 * it stays correct at any interval. It runs DAILY at 04:00 UTC (09:00
 * PKT) only because Vercel's Hobby plan triggers each cron job once a
 * day. Restore `0 * * * *` in vercel.json when the account moves to
 * Pro. Nothing else needs to change. (Comments cannot live in
 * vercel.json — it is strict JSON and Vercel rejects unknown keys —
 * so the note is here, next to the code it governs.)
 *
 * Until then a lead can sit unseen for up to 24 hours, so the daily
 * digest at 09:00 UTC is the real safety net for anything this misses.
 *
 * This is an ALERT, not a report. Two rules follow from that:
 *   - nothing to say means nothing sent. A recurring "nothing to
 *     report" is how a useful alert becomes something you filter to a
 *     folder.
 *   - each estimate appears exactly once. The row is stamped after a
 *     successful send, so a retry or a redeploy cannot double-alert,
 *     and an estimate that sits there for days is not re-announced.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!cronAuthorised(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[cron/high-value] service role not configured");
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("v_high_value_no_lead")
    .select("short_code, tool, midpoint, industry, updated_at")
    .is("high_value_notified_at", null)
    .order("midpoint", { ascending: false });

  if (error) {
    console.error("[cron/high-value] query failed", error);
    return NextResponse.json({ ok: false, error: "query failed" }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as HighValueRow[];
  if (rows.length === 0) {
    return NextResponse.json({ ok: true, found: 0, sent: false });
  }

  const to = process.env.NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("[cron/high-value] NOTIFICATION_EMAIL unset — not sending");
    return NextResponse.json({ ok: true, found: rows.length, sent: false });
  }

  const digest = highValueDigest(rows);
  const result = await sendEmail({ to, replyTo: to, ...digest });

  // Only stamp after the send actually worked. If it failed, these
  // estimates stay pending and the next run picks them up again —
  // an alert delivered late beats one silently dropped.
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, found: rows.length, sent: false, error: result.error },
      { status: 502 }
    );
  }

  const { error: markError } = await supabase.rpc("mark_high_value_notified", {
    p_short_codes: rows.map((r) => r.short_code),
  } as never);
  if (markError) {
    // Sent but not stamped: the next run would repeat it. Loud, because
    // a duplicate alert is confusing and this is the only cause.
    console.error("[cron/high-value] sent but failed to mark", markError);
  }

  return NextResponse.json({
    ok: true,
    found: rows.length,
    sent: result.delivered,
    marked: !markError,
  });
}
