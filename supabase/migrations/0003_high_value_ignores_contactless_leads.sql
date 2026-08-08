-- ---------------------------------------------------------------------
-- 0003 — v_high_value_no_lead must ignore leads with no way to reply
--
-- THE BUG
--
-- 0001 defined the view's suppression test as:
--
--     and not exists (
--       select 1 from public.leads l where l.estimate_id = e.id
--     )
--
-- Any lead row linked to the estimate silenced the alert. But two of
-- the five sources deliberately carry no contact details:
--
--   estimator_quote — "Get a fixed price quote". Records that someone
--                     opened the scheduler with an estimate in hand.
--                     No name, no email, no phone.
--   estimator_email — carries an email, so it is a real contact.
--
-- So the failure ran exactly opposite to the alert's purpose:
--
--   Someone configures a $40k build, clicks "Get a fixed price quote",
--   lands on Calendly, and leaves without booking. That writes an
--   estimator_quote row linked to the estimate with nothing in it. The
--   view sees "this estimate has a lead" and goes quiet — for the
--   precise prospect the alert was built to surface.
--
-- The estimate was serious, the intent was explicit, and the alert
-- stayed silent because a contentless row counted as contact.
--
-- THE FIX
--
-- Only a lead that gives us a way to reach someone counts as contact.
-- An estimator_quote row is still recorded and still worth having as a
-- signal; it simply no longer pretends to be a reply address.
--
-- Deliberately NOT keyed on source: the test is "can we reply to this
-- person", not "which button did they press". A future source that
-- captures an email is covered without touching this view, and one
-- that captures nothing cannot silence an alert by existing.
--
-- Safe to re-run. Replaces the view in place; no data is modified.
-- ---------------------------------------------------------------------

drop view if exists public.v_high_value_no_lead;

create view public.v_high_value_no_lead as
select
  e.short_code,
  e.tool,
  (e.computed ->> 'midpoint')::numeric as midpoint,
  e.answers ->> 'industry'             as industry,
  e.updated_at
from public.estimates e
where e.completed
  and jsonb_typeof(e.computed -> 'midpoint') = 'number'
  and (e.computed ->> 'midpoint')::numeric > 25000
  and e.updated_at > now() - interval '7 days'
  and not exists (
    select 1
    from public.leads l
    where l.estimate_id = e.id
      -- a lead only counts if we can actually reply to it
      and (
        nullif(btrim(coalesce(l.email, '')), '') is not null
        or nullif(btrim(coalesce(l.phone, '')), '') is not null
      )
  )
order by midpoint desc;

-- The view is read only by the service role (the cron route). 0001
-- granted nothing to anon or authenticated on it and that stays true:
-- recreating a view drops its grants, so anything added here would be
-- a new hole rather than a restoration.
