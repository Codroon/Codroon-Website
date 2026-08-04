-- =====================================================================
-- Codroon — high-value alert tracking
--
-- The hourly digest must not re-send the same estimate every hour, so
-- what has been alerted on needs to be durable. A timestamp on the
-- estimate is enough: nothing else needs to know about it, and it
-- survives a cron retry or a redeploy, which a time-window filter
-- alone would not.
--
-- Anon gains nothing here: it still has no SELECT and no UPDATE on
-- estimates, so this column is only ever written by service_role from
-- the cron route.
-- =====================================================================

alter table public.estimates
  add column if not exists high_value_notified_at timestamptz;

-- Partial index: the alert query only ever asks for the un-notified.
create index if not exists estimates_high_value_pending_idx
  on public.estimates (updated_at desc)
  where completed and high_value_notified_at is null;

-- Expose it on the alert view. Dropped and recreated rather than
-- replaced, so this migration can be re-applied after 0001 without
-- tripping "cannot drop columns from view".
drop view if exists public.v_high_value_no_lead;
create view public.v_high_value_no_lead as
select
  e.short_code,
  e.tool,
  (e.computed ->> 'midpoint')::numeric as midpoint,
  e.answers ->> 'industry'             as industry,
  e.updated_at,
  e.high_value_notified_at
from public.estimates e
where e.completed
  and jsonb_typeof(e.computed -> 'midpoint') = 'number'
  and (e.computed ->> 'midpoint')::numeric > 25000
  and e.updated_at > now() - interval '7 days'
  and not exists (
    select 1 from public.leads l where l.estimate_id = e.id
  )
order by midpoint desc;

revoke all on public.v_high_value_no_lead from anon, authenticated;
grant select on public.v_high_value_no_lead to service_role;

-- Marks a batch as alerted. Called by the cron route only; service_role
-- already bypasses RLS, so this exists for clarity and to keep the
-- route from writing raw SQL.
create or replace function public.mark_high_value_notified(p_short_codes text[])
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_marked integer;
begin
  update public.estimates
     set high_value_notified_at = now()
   where short_code = any (p_short_codes)
     and high_value_notified_at is null;
  get diagnostics v_marked = row_count;
  return v_marked;
end;
$$;

revoke all on function public.mark_high_value_notified(text[]) from public;
grant execute on function public.mark_high_value_notified(text[]) to service_role;
