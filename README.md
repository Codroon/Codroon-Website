# codroon.com

The marketing site for Codroon, an AI-native software studio in Dallas.
Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind v4.
Dark, typographic design system; display face is Bricolage Grotesque
Variable, body is Geist.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in Supabase; email keys optional
npm run dev                  # http://localhost:3000
```

`npm run build` for a production build. Everything renders without env
keys: the estimators, blog, and all pages work; only database writes and
email sends degrade to logged no-ops.

## What's here

- Landing, `/about`, six service pages under `/services/[slug]`, product
  pages under `/products/[slug]`, `/blog` with seven posts, `/privacy`,
  `/terms`.
- **Cost estimators** at `/tools/ai-agent-cost-calculator` and
  `/tools/mvp-cost-calculator` — answers save to Supabase anonymously,
  shareable at `/e/[shortCode]` (noindex; the short code is a bearer
  capability).
- **Lead flow**: every form posts to `/api/lead` — one route, all five
  sources. It writes the row first, then best-effort emails (visitor
  acknowledgement + notification to sales@). A failed send never blocks
  the lead write or surfaces an error to the visitor.
- **Email templates** in `src/emails/` (React Email). Preview them at
  `/dev/emails` (dev only, 404s in production) and export static copies
  with `npm run emails:export`. The manual send checklist lives in
  `email-previews/CHECKLIST.md` once exported.
- **Design system reference** at `/styleguide` (dev only, 404s in
  production).

## Environment

Documented inline in [`.env.example`](.env.example). Summary:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side Supabase; RLS is the security boundary |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Bypasses RLS — never import into a client component |
| `RESEND_API_KEY` | Sending. Unset = leads still land, sends are logged |
| `FROM_EMAIL` | Verified sender on the sending subdomain (`send.codroon.com`) |
| `REPLY_TO_EMAIL` | The mailbox a human reads; Reply-To on every send |
| `NOTIFICATION_EMAIL` | Where lead notifications go |
| `NEXT_PUBLIC_CALENDLY_URL` | Booking link |
| `CRON_SECRET` | Auth for `/api/cron/*` — both routes reject requests without it |

## Database

Supabase. Migrations live in [`supabase/migrations/`](supabase/migrations/)
— apply them in order in the SQL editor or via the CLI. Row-level
security is the entire client-side security model: the anon key can
insert an estimate, insert a lead, and read/update one estimate by short
code, nothing else. Verify against a live project with
`node scripts/verify-rls-live.mjs`.

## Email deliverability (Resend)

Nothing sends until **send.codroon.com is verified in Resend with both
SPF and DKIM**. In Resend, add the domain and publish the DNS records it
gives you.

> **If an SPF record already exists for the domain, merge Resend's
> `include:` into the existing record — do not add a second one.** A
> domain may publish exactly one SPF record; two makes the check fail
> outright, and mail that was previously delivering will start failing
> too. Correct:
>
> ```
> v=spf1 include:_spf.google.com include:amazonses.com ~all
> ```
>
> Wrong (two records, both now invalid):
>
> ```
> v=spf1 include:_spf.google.com ~all
> v=spf1 include:amazonses.com ~all
> ```

Until the domain is verified, `/api/lead` still writes every lead row
and returns success — it logs what it would have sent. A lead is never
lost because email is misconfigured.

## Deploying

Vercel. Worth knowing:

1. **Cron schedules** ship in [`vercel.json`](vercel.json) —
   `/api/cron/high-value` at 04:00 UTC, `/api/cron/daily` at 09:00 UTC.
   Both routes require the `CRON_SECRET` Authorization header, which
   Vercel sends automatically once the env var is set.

   The high-value alert is meant to run **hourly**; it is daily only
   because the Hobby plan triggers each job once a day, and the build
   fails outright if a schedule asks for more. Restore `0 * * * *` on
   Pro. Hobby also treats the hour as approximate — a job set for 04:00
   fires somewhere inside that hour.
2. **Redirects** ship in [`next.config.mjs`](next.config.mjs): the old
   site's URLs (`/blogs/*`, `/case-studies`, `/who-we-are`,
   `/contact-us`, `/industries`, `/process`, `/solutions`, and friends)
   all 301 to their replacements. Do not delete them — they carry the
   old deployment's ranking signals.

## Brand assets

Logo masters live in [`/brand`](brand/) at the repo root — deliberately
outside `public/`, so they are version-controlled but not publicly
served. Derived, runtime assets live in `public/images/` (the inline
`Wordmark` component is extracted from the SVG master; re-extract rather
than hand-editing paths).

## QA

`scripts/check-*.mjs` are Playwright suites run against a local dev
server (`node scripts/check-about.mjs` etc.). They assert rendered
output — copy fidelity, contrast, semantics, redirects, email rules —
and every substantial page has one.
