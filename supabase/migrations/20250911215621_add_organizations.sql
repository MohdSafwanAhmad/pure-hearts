-- ORGANIZATIONS (owned by a profile)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  license_number text,
  supervising_body text,
  association_field text,
  province text,
  city text,
  address text,
  email text,
  phone text,
  website text,
  is_active boolean default true,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.organizations enable row level security;

-- Policies
drop policy if exists "organizations_read_all"    on public.organizations;
drop policy if exists "organizations_insert_owner" on public.organizations;
drop policy if exists "organizations_update_owner" on public.organizations;

create policy "organizations_read_all"
  on public.organizations
  for select
  using (true);

create policy "organizations_insert_owner"
  on public.organizations
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "organizations_update_owner"
  on public.organizations
  for update
  to authenticated
  using (owner_id = auth.uid());
