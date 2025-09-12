-- PROJECTS (belong to organizations)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  goal_amount numeric(12,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

-- Policies
drop policy if exists "projects_read_all"              on public.projects;
drop policy if exists "projects_insert_by_org_owner"   on public.projects;
drop policy if exists "projects_update_by_org_owner"   on public.projects;

create policy "projects_read_all"
  on public.projects
  for select
  using (true);

create policy "projects_insert_by_org_owner"
  on public.projects
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.organizations o
      where o.id = projects.organization_id
        and o.owner_id = auth.uid()
    )
  );

create policy "projects_update_by_org_owner"
  on public.projects
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.organizations o
      where o.id = projects.organization_id
        and o.owner_id = auth.uid()
    )
  );
