# Lead capture — test procedure

Fires one lead of each of the five sources and confirms the row lands
and both emails send.

## Prerequisites

1. **Supabase migrations applied** — `supabase/migrations/0001_*.sql`
   then `0002_*.sql`, in that order.
2. **RLS gate passed** — `node --env-file=.env.local scripts/verify-rls-live.mjs`
   must be green before any of this goes near production.
3. **Resend domain verified** — codroon.com with SPF *and* DKIM. See the
   README, particularly the note about merging into an existing SPF
   record rather than adding a second one.
4. **`.env.local` filled in** from `.env.example`. All of:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `FROM_EMAIL`,
   `NOTIFICATION_EMAIL`, `NEXT_PUBLIC_CALENDLY_URL`, `CRON_SECRET`.
5. **A Calendly custom question** on the 30-minute event type, so the
   short code passed as `a1` lands somewhere you can read it. Without
   it the parameter is simply ignored — bookings still work.

## Automated: all five sources

```bash
# against local
node --env-file=.env.local scripts/test-leads-e2e.mjs

# against production
node --env-file=.env.local scripts/test-leads-e2e.mjs https://codroon.com
```

Set `TEST_VISITOR_EMAIL` to an inbox you can read; it defaults to a
placeholder that will bounce.

The script seeds a completed estimate, fires `modal_call`,
`modal_email`, `modal_meeting`, `estimator_email` and `estimator_quote`,
then verifies with the service role that:

- all five rows exist
- the two `estimator_*` rows are linked to the estimate (`estimate_id`
  populated) — proving `create_lead()` resolved the short code
  server-side
- the three `modal_*` rows have `estimate_id` null
- **anon still cannot read the leads table**

It prints the cleanup SQL and the share URL at the end.

### What should arrive

| Inbox | Count | Contents |
|---|---|---|
| `NOTIFICATION_EMAIL` (sales@) | **5** | one per source; the two estimator ones carry the full range, timeline, run cost, industry, every answer and any cuts |
| `TEST_VISITOR_EMAIL` | **2** | `modal_email` and `estimator_email` only |

No other source sends a visitor email. `estimator_quote` deliberately
collects no address — it is a bare signal.

## Automated: guards, no credentials needed

```bash
node scripts/test-lead-route.mjs        # validation, honeypot, 5/min rate limit
node scripts/test-conversion-wiring.mjs # both CTAs + the modal, in a browser
node scripts/verify-rls.mjs             # policies, against a real Postgres
```

`test-lead-route.mjs` deliberately runs with Supabase and Resend
**unconfigured**, because that is the case that must still return
success rather than an error.

## Manual: the two things a script cannot check

**Deliverability.** Send one `modal_email` lead to a Gmail address and
one to an Outlook address. Both should land in the inbox, not spam.
In Gmail use *Show original* and confirm `SPF: PASS` and `DKIM: PASS`.
If either fails, the DNS is wrong — fix it before launch, because a
domain that starts in spam is slow to recover.

**Calendly.** Click *Get a fixed price quote* on a real estimate.
Calendly should open in a new tab with `?a1=<code>` and that code should
appear on the booking. Then complete a booking and check the estimate
link in the notification email opens the same estimate.

## Cron routes

They refuse everything without the secret, including when `CRON_SECRET`
is unset — they fail closed, not open.

```bash
curl -i https://codroon.com/api/cron/daily                       # 401
curl -i -H "Authorization: Bearer $CRON_SECRET" \
     https://codroon.com/api/cron/daily                          # 200, sends
curl -i -H "Authorization: Bearer $CRON_SECRET" \
     https://codroon.com/api/cron/high-value                     # 200
```

`/api/cron/high-value` returns `{"found":0,"sent":false}` and sends
nothing when there is nothing to report — that is intended. To exercise
it, seed a completed estimate with a midpoint over $25,000 and no lead,
then call it twice: the first run alerts, the second returns
`found: 0`, because `mark_high_value_notified()` stamped the row.

Vercel schedules both from `vercel.json` (hourly, and 09:00 UTC) and
supplies the `Authorization` header automatically once `CRON_SECRET` is
set as an environment variable.

## Cleanup

```sql
delete from leads     where created_at > now() - interval '1 hour';
delete from estimates where short_code  = '<code printed by the script>';
```
