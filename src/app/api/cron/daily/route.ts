import { NextResponse } from "next/server";
import { cronAuthorised, getSupabaseAdmin } from "@/lib/supabase/admin";
import { dailyDigest, type DailyStats } from "@/lib/email/digests";
import { sendEmail } from "@/lib/email/send";

/**
 * Daily report, 09:00. Completions and abandons by tool, where the
 * abandons cluster, industries, value distribution, and leads captured.
 *
 * This one sends every day, quiet or not — it is a report, and a
 * baseline you only see on busy days is not a baseline.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!cronAuthorised(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[cron/daily] service role not configured");
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [funnel, industries, values, leads] = await Promise.all([
    supabase.from("v_estimate_funnel").select("*"),
    supabase.from("v_industry_breakdown").select("*"),
    supabase.from("v_value_distribution").select("*"),
    supabase.from("leads").select("source").gte("created_at", since),
  ]);

  const firstError = [funnel, industries, values, leads].find((r) => r.error)?.error;
  if (firstError) {
    console.error("[cron/daily] query failed", firstError);
    return NextResponse.json({ ok: false, error: "query failed" }, { status: 500 });
  }

  // counted here rather than in a view, because "last 24 hours" is a
  // property of when the report runs, not of the data
  const bySource = new Map<string, number>();
  for (const row of (leads.data ?? []) as { source: string }[]) {
    bySource.set(row.source, (bySource.get(row.source) ?? 0) + 1);
  }

  const stats: DailyStats = {
    funnel: (funnel.data ?? []) as DailyStats["funnel"],
    industries: (industries.data ?? []) as DailyStats["industries"],
    values: (values.data ?? []) as DailyStats["values"],
    leadsLast24h: [...bySource.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count),
  };

  const to = process.env.NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("[cron/daily] NOTIFICATION_EMAIL unset — not sending");
    return NextResponse.json({ ok: true, sent: false });
  }

  const digest = dailyDigest(stats, new Date());
  const result = await sendEmail({ to, replyTo: to, ...digest });

  return NextResponse.json({
    ok: result.ok,
    sent: result.ok ? result.delivered : false,
  });
}
