import { SITE } from "@/config/site";

/**
 * Digest emails for the two cron routes.
 *
 * The high-value one is an ALERT: it only ever arrives when there is
 * something to act on. The daily one is a REPORT: it arrives every day
 * whether or not anything happened, because a report that skips quiet
 * days stops being a baseline.
 */

const esc = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c]!
  );

const shell = (title: string, inner: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e1dd;border-radius:12px;">
<tr><td style="padding:28px 28px 8px 28px;font:600 15px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a857a;">Codroon</td></tr>
<tr><td style="padding:0 28px 28px 28px;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#232220;">${inner}</td></tr>
</table></td></tr></table></body></html>`;

const label = (t: string) =>
  `<p style="margin:26px 0 8px 0;font:600 12px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8a857a;">${esc(t)}</p>`;

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/* ================================================================
   HOURLY — high value, no lead
   ================================================================ */

export type HighValueRow = {
  short_code: string;
  tool: string;
  midpoint: number;
  industry: string | null;
  updated_at: string;
};

export function highValueDigest(rows: HighValueRow[]) {
  const subject = `[Codroon] ${rows.length} high-value estimate${
    rows.length === 1 ? "" : "s"
  }, no contact details`;

  const items = rows
    .map(
      (r) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px 0;border:1px solid #e2e1dd;border-radius:10px;">
<tr><td style="padding:16px 18px;">
  <p style="margin:0 0 2px 0;font:400 22px/1.2 Georgia,'Times New Roman',serif;color:#232220;">${esc(money(r.midpoint))}</p>
  <p style="margin:0 0 10px 0;font:400 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">${esc(
    [r.tool === "agent" ? "AI agent" : "MVP", r.industry ?? "industry not given"].join(" · ")
  )}</p>
  <a href="${SITE.url}/e/${esc(r.short_code)}" rel="noreferrer" style="font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#b4501f;text-decoration:none;">Open estimate /e/${esc(r.short_code)} →</a>
</td></tr></table>`
    )
    .join("");

  const html = shell(
    subject,
    `<p style="margin:0 0 4px 0;font:400 22px/1.3 Georgia,'Times New Roman',serif;color:#232220;">Someone configured a serious project and left without a word.</p>
     <p style="margin:0 0 18px 0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">Completed estimates over ${money(
       25000
     )} with no contact details attached. Each appears here once.</p>
     ${items}`
  );

  const text = [
    `${rows.length} high-value estimate${rows.length === 1 ? "" : "s"} with no contact details.`,
    "",
    ...rows.map(
      (r) =>
        `${money(r.midpoint)}  ${r.tool === "agent" ? "AI agent" : "MVP"} · ${
          r.industry ?? "industry not given"
        }\n  ${SITE.url}/e/${r.short_code}`
    ),
    "",
    "Each estimate appears here once.",
  ].join("\n");

  return { subject, html, text };
}

/* ================================================================
   DAILY — the report
   ================================================================ */

export type DailyStats = {
  funnel: { tool: string; answered_count: number; completed: number; abandoned: number }[];
  industries: { tool: string; industry: string; estimates: number; completed: number }[];
  values: { tool: string; band: string; estimates: number }[];
  leadsLast24h: { source: string; count: number }[];
};

const table = (headers: string[], rows: string[][]) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
<tr>${headers
    .map(
      (h) =>
        `<th align="left" style="padding:6px 10px 6px 0;border-bottom:1px solid #e2e1dd;font:600 12px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#8a857a;text-transform:uppercase;letter-spacing:.08em;">${esc(h)}</th>`
    )
    .join("")}</tr>
${rows
    .map(
      (r) =>
        `<tr>${r
          .map(
            (c) =>
              `<td style="padding:7px 10px 7px 0;border-bottom:1px solid #f0efec;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#232220;">${esc(c)}</td>`
          )
          .join("")}</tr>`
    )
    .join("")}
</table>`;

export function dailyDigest(stats: DailyStats, day: Date) {
  const dayLabel = day.toLocaleDateString("en-US", {
    timeZone: "UTC",
    dateStyle: "full",
  });
  const totalCompleted = stats.funnel.reduce((s, r) => s + r.completed, 0);
  const totalAbandoned = stats.funnel.reduce((s, r) => s + r.abandoned, 0);
  const totalLeads = stats.leadsLast24h.reduce((s, r) => s + r.count, 0);
  const subject = `[Codroon] Daily estimator report — ${totalCompleted} completed, ${totalLeads} lead${
    totalLeads === 1 ? "" : "s"
  }`;

  // where abandons cluster: the answer count with the most abandons
  const worst = [...stats.funnel].sort((a, b) => b.abandoned - a.abandoned)[0];

  const html = shell(
    subject,
    `<p style="margin:0 0 2px 0;font:400 22px/1.3 Georgia,'Times New Roman',serif;color:#232220;">Estimator report</p>
     <p style="margin:0 0 6px 0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">${esc(dayLabel)}</p>
     <p style="margin:14px 0 0 0;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
       <strong>${totalCompleted}</strong> completed · <strong>${totalAbandoned}</strong> abandoned · <strong>${totalLeads}</strong> lead${
       totalLeads === 1 ? "" : "s"
     } in the last 24h
     </p>
     ${
       worst && worst.abandoned > 0
         ? `<p style="margin:10px 0 0 0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">Abandons cluster after <strong style="color:#232220;">${worst.answered_count} answer${
             worst.answered_count === 1 ? "" : "s"
           }</strong> (${worst.tool}).</p>`
         : ""
     }

     ${label("Funnel")}
     ${table(
       ["Tool", "Answers given", "Completed", "Abandoned"],
       stats.funnel.map((r) => [
         r.tool,
         String(r.answered_count),
         String(r.completed),
         String(r.abandoned),
       ])
     )}

     ${label("Industries")}
     ${table(
       ["Tool", "Industry", "Estimates", "Completed"],
       stats.industries.map((r) => [
         r.tool,
         r.industry,
         String(r.estimates),
         String(r.completed),
       ])
     )}

     ${label("Value distribution")}
     ${table(
       ["Tool", "Band", "Completed estimates"],
       stats.values.map((r) => [r.tool, r.band, String(r.estimates)])
     )}

     ${label("Leads captured (24h)")}
     ${
       stats.leadsLast24h.length
         ? table(
             ["Source", "Count"],
             stats.leadsLast24h.map((r) => [r.source, String(r.count)])
           )
         : `<p style="margin:0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">None.</p>`
     }`
  );

  const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));
  const lines = [
    `Estimator report — ${dayLabel}`,
    "",
    `${totalCompleted} completed · ${totalAbandoned} abandoned · ${totalLeads} leads (24h)`,
  ];
  if (worst && worst.abandoned > 0) {
    lines.push(
      `Abandons cluster after ${worst.answered_count} answer(s) (${worst.tool}).`
    );
  }
  lines.push("", "FUNNEL");
  for (const r of stats.funnel) {
    lines.push(
      `  ${pad(r.tool, 8)}${pad(`${r.answered_count} answers`, 14)}completed ${pad(
        String(r.completed),
        5
      )}abandoned ${r.abandoned}`
    );
  }
  lines.push("", "INDUSTRIES");
  for (const r of stats.industries) {
    lines.push(`  ${pad(r.tool, 8)}${pad(r.industry, 22)}${r.estimates} (${r.completed} completed)`);
  }
  lines.push("", "VALUE DISTRIBUTION");
  for (const r of stats.values) lines.push(`  ${pad(r.tool, 8)}${pad(r.band, 16)}${r.estimates}`);
  lines.push("", "LEADS CAPTURED (24H)");
  if (stats.leadsLast24h.length) {
    for (const r of stats.leadsLast24h) lines.push(`  ${pad(r.source, 20)}${r.count}`);
  } else {
    lines.push("  None.");
  }

  return { subject, html, text: lines.join("\n") };
}
