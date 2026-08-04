-- =====================================================================
-- Codroon cost estimators — persistence
--
-- Two tables, one for anonymous estimates and one for every lead
-- capture point on the site. Four lead tables would mean four places a
-- lead can hide.
--
-- THREAT MODEL: the anon key ships to the browser. Everything below
-- assumes an attacker holds it and is calling PostgREST directly.
-- Anon may INSERT an estimate and INSERT a modal lead. It may not read
-- or enumerate anything. Reads and updates go through SECURITY DEFINER
-- functions that take a short code, so possessing a code is the only
-- way to reach a row.
-- =====================================================================

-- gen_random_uuid() is core Postgres since 13, so no pgcrypto needed.

-- ---------------------------------------------------------------------
-- tables
-- ---------------------------------------------------------------------

create table if not exists public.estimates (
  id          uuid primary key default gen_random_uuid(),
  short_code  text unique not null,
  tool        text not null,
  answers     jsonb not null default '{}'::jsonb,
  -- the computed snapshot: range, weeks, ledger, cuts, run cost, and
  -- the cut factors needed to recompute the sandbox. Stored so a
  -- historical estimate stays readable after the pricing config moves.
  computed    jsonb,
  completed   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint estimates_tool_check check (tool in ('agent', 'mvp')),
  -- Lowercase alphanumeric minus 0/o/1/l/i, so a code survives being
  -- read down a phone. 31 symbols ^ 6 = 887,503,681 combinations.
  -- Six, not four: the code is a bearer capability — holding it grants
  -- read and write on that estimate — so the space has to be too large
  -- to sweep, not merely unique.
  constraint estimates_short_code_format
    check (short_code ~ '^[a-hjkmnp-z2-9]{6}$')
);

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  -- null for leads that arrive through the contact modal
  estimate_id uuid references public.estimates(id) on delete set null,
  source      text not null,
  name        text,
  email       text,
  phone       text,
  message     text,
  created_at  timestamptz not null default now(),

  constraint leads_source_check check (
    source in (
      'modal_call', 'modal_email', 'modal_meeting',
      'estimator_email', 'estimator_quote'
    )
  )
);

-- ---------------------------------------------------------------------
-- indexes
-- (estimates.short_code is already indexed by its unique constraint)
-- ---------------------------------------------------------------------

create index if not exists estimates_created_at_idx
  on public.estimates (created_at desc);
create index if not exists estimates_completed_updated_at_idx
  on public.estimates (completed, updated_at desc);
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);
create index if not exists leads_estimate_id_idx
  on public.leads (estimate_id);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists estimates_set_updated_at on public.estimates;
create trigger estimates_set_updated_at
  before update on public.estimates
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- row level security
--
-- NOTE: no FORCE. Forcing RLS would also apply it to the table owner,
-- which is what the SECURITY DEFINER functions below run as, and would
-- lock the application out of its own rows. service_role carries
-- BYPASSRLS, which is why it must never reach a client component.
-- ---------------------------------------------------------------------

alter table public.estimates enable row level security;
alter table public.leads      enable row level security;

-- Supabase grants broadly on new tables in `public` by default. Both a
-- grant AND a policy must allow an action, so start from nothing.
revoke all on public.estimates from anon, authenticated;
revoke all on public.leads      from anon, authenticated;

grant insert on public.estimates to anon, authenticated;
grant insert on public.leads      to anon, authenticated;

-- BYPASSRLS skips policies, not table grants. Granted explicitly so the
-- migration stands on its own rather than relying on a project's
-- ambient defaults.
grant all on public.estimates to service_role;
grant all on public.leads      to service_role;

-- estimates: INSERT only. No SELECT, UPDATE or DELETE policy exists,
-- so all three are denied — a missing policy is a denial under RLS.
drop policy if exists estimates_insert_anon on public.estimates;
create policy estimates_insert_anon
  on public.estimates
  for insert
  to anon, authenticated
  with check (
    tool in ('agent', 'mvp')
    and short_code ~ '^[a-hjkmnp-z2-9]{6}$'
  );

-- leads: INSERT only, and only the modal sources, which never carry an
-- estimate. Estimator leads go through create_lead(), which resolves
-- the estimate from its short code so a caller cannot attach a lead to
-- a row it does not hold the code for.
drop policy if exists leads_insert_anon on public.leads;
create policy leads_insert_anon
  on public.leads
  for insert
  to anon, authenticated
  with check (
    estimate_id is null
    and source in ('modal_call', 'modal_email', 'modal_meeting')
  );

-- ---------------------------------------------------------------------
-- capability functions
--
-- The short code is a bearer capability: holding it grants read and
-- write on exactly one row, and nothing else. These are the only way
-- anon reaches an existing estimate, which is what makes enumeration
-- impossible — there is no query that returns more than one row.
-- ---------------------------------------------------------------------

create or replace function public.get_estimate(p_short_code text)
returns table (
  short_code text,
  tool       text,
  answers    jsonb,
  computed   jsonb,
  completed  boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select e.short_code, e.tool, e.answers, e.computed,
         e.completed, e.created_at, e.updated_at
  from public.estimates e
  where e.short_code = lower(p_short_code)
  limit 1;
$$;

create or replace function public.update_estimate(
  p_short_code text,
  p_answers    jsonb   default null,
  p_computed   jsonb   default null,
  p_completed  boolean default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.estimates e
     set answers   = coalesce(p_answers, e.answers),
         computed  = coalesce(p_computed, e.computed),
         -- completion is one-way: a late in-flight write must not
         -- un-complete an estimate that already reached results
         completed = e.completed or coalesce(p_completed, false)
   where e.short_code = lower(p_short_code);
end;
$$;

create or replace function public.create_lead(
  p_source     text,
  p_short_code text default null,
  p_name       text default null,
  p_email      text default null,
  p_phone      text default null,
  p_message    text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_estimate_id uuid;
begin
  if p_source not in (
    'modal_call', 'modal_email', 'modal_meeting',
    'estimator_email', 'estimator_quote'
  ) then
    raise exception 'unknown lead source: %', p_source;
  end if;

  if p_short_code is not null then
    select e.id into v_estimate_id
    from public.estimates e
    where e.short_code = lower(p_short_code);
  end if;

  insert into public.leads (estimate_id, source, name, email, phone, message)
  values (v_estimate_id, p_source, p_name, p_email, p_phone, p_message);
end;
$$;

-- Functions are executable by PUBLIC unless revoked.
revoke all on function public.get_estimate(text) from public;
revoke all on function public.update_estimate(text, jsonb, jsonb, boolean) from public;
revoke all on function public.create_lead(text, text, text, text, text, text) from public;
revoke all on function public.set_updated_at() from public;

grant execute on function public.get_estimate(text) to anon, authenticated;
grant execute on function public.update_estimate(text, jsonb, jsonb, boolean) to anon, authenticated;
grant execute on function public.create_lead(text, text, text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- retention
--
-- Estimates are anonymous telemetry and expire after 24 months. An
-- estimate that someone attached contact details to is a business
-- record and is kept — leads.estimate_id references it, and the whole
-- point of v_high_value_no_lead is being able to look back at what a
-- lead had configured.
--
-- ⚠️ REQUIRES pg_cron: enable it in the Supabase dashboard under
-- Database → Extensions before the schedule below will take. The
-- migration applies cleanly either way; without pg_cron it just prints
-- a notice and no job is registered. purge_expired_estimates() can
-- always be run by hand.
-- ---------------------------------------------------------------------

create or replace function public.purge_expired_estimates()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_deleted integer;
begin
  delete from public.estimates e
  where e.created_at < now() - interval '24 months'
    and not exists (
      select 1 from public.leads l where l.estimate_id = e.id
    );
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_expired_estimates() from public;
grant execute on function public.purge_expired_estimates() to service_role;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    if exists (select 1 from cron.job where jobname = 'purge_expired_estimates') then
      perform cron.unschedule('purge_expired_estimates');
    end if;
    -- 03:00 UTC on the 1st of each month
    perform cron.schedule(
      'purge_expired_estimates',
      '0 3 1 * *',
      $job$ select public.purge_expired_estimates(); $job$
    );
    raise notice 'retention job scheduled (monthly)';
  else
    raise notice
      'pg_cron is not installed — retention job NOT scheduled. Enable it in Supabase (Database -> Extensions) and re-run this migration.';
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- analytics views — read in the Supabase dashboard as service_role
--
-- These are NOT security_invoker, so they run as their owner and see
-- through RLS. That is the point, and it is exactly why anon and
-- authenticated must be revoked from every one of them: a view is not
-- protected by the policies on the tables underneath it.
-- ---------------------------------------------------------------------

-- Where people stop. Rows with completed = false are the useful ones.
create or replace view public.v_estimate_funnel as
select
  s.tool,
  s.answered_count,
  count(*) filter (where s.completed)     as completed,
  count(*) filter (where not s.completed) as abandoned,
  count(*)                                as total
from (
  select
    e.tool,
    e.completed,
    (select count(*) from jsonb_object_keys(e.answers)) as answered_count
  from public.estimates e
) s
group by s.tool, s.answered_count
order by s.tool, s.answered_count;

create or replace view public.v_industry_breakdown as
select
  e.tool,
  coalesce(e.answers ->> 'industry', '(not answered)') as industry,
  count(*)                            as estimates,
  count(*) filter (where e.completed) as completed
from public.estimates e
group by e.tool, coalesce(e.answers ->> 'industry', '(not answered)')
order by e.tool, estimates desc;

create or replace view public.v_value_distribution as
select
  e.tool,
  case
    when jsonb_typeof(e.computed -> 'midpoint') <> 'number' then '(no midpoint)'
    when (e.computed ->> 'midpoint')::numeric <  5000 then 'under $5k'
    when (e.computed ->> 'midpoint')::numeric < 10000 then '$5k–$10k'
    when (e.computed ->> 'midpoint')::numeric < 20000 then '$10k–$20k'
    when (e.computed ->> 'midpoint')::numeric < 30000 then '$20k–$30k'
    when (e.computed ->> 'midpoint')::numeric < 40000 then '$30k–$40k'
    when (e.computed ->> 'midpoint')::numeric < 50000 then '$40k–$50k'
    else 'above ceiling'
  end as band,
  count(*) as estimates
from public.estimates e
where e.completed
group by e.tool, band
order by e.tool, band;

-- The commercially useful one: configured a serious project, left
-- without a word.
--
-- drop-and-create rather than `create or replace`: a later migration
-- adds a column to this view, and `create or replace view` cannot drop
-- one — so re-running the migration set in order would fail.
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
    select 1 from public.leads l where l.estimate_id = e.id
  )
order by midpoint desc;

revoke all on public.v_estimate_funnel     from anon, authenticated;
revoke all on public.v_industry_breakdown  from anon, authenticated;
revoke all on public.v_value_distribution  from anon, authenticated;
revoke all on public.v_high_value_no_lead  from anon, authenticated;

grant select on public.v_estimate_funnel    to service_role;
grant select on public.v_industry_breakdown to service_role;
grant select on public.v_value_distribution to service_role;
grant select on public.v_high_value_no_lead to service_role;
