-- DONATIONS (private to donor; org owner can view)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  created_at timestamptz default now()
);

alter table public.donations enable row level security;

-- Policies
drop policy if exists "donations_insert_self"       on public.donations;
drop policy if exists "donations_read_self"         on public.donations;
drop policy if exists "donations_read_by_org_owner" on public.donations;

create policy "donations_insert_self"
  on public.donations
  for insert
  to authenticated
  with check (donor_id = auth.uid());

create policy "donations_read_self"
  on public.donations
  for select
  to authenticated
  using (donor_id = auth.uid());

create policy "donations_read_by_org_owner"
  on public.donations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.organizations o on o.id = p.organization_id
      where p.id = donations.project_id
        and o.owner_id = auth.uid()
    )
  );
