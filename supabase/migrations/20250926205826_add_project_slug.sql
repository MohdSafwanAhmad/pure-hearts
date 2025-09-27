-- 0) column (must exist before trigger)
alter table public.projects
  add column if not exists slug text;

-- 1) helper: simple slugify (lowercase first, then replace)
create or replace function public.slugify(txt text)
returns text
language sql
immutable
as $$
  select trim(
    both '-' from
    regexp_replace(lower(coalesce($1,'')), '[^a-z0-9]+', '-', 'g')
  );
$$;

-- 2) INSERT-only trigger function: fill slug and keep it unique per org
create or replace function public.projects_fill_slug()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
begin
  -- Only generate on INSERT (keep slug stable on updates)
  if tg_op <> 'INSERT' then
    return new;
  end if;

  -- base slug from provided slug or title
  base := slugify(coalesce(new.slug, new.title));
  candidate := base;

  -- ensure uniqueness within the organization
  if exists (
    select 1
    from public.projects p
    where p.organization_user_id = new.organization_user_id
      and p.slug = candidate
  ) then
    candidate := base || '-' || substr(md5(gen_random_uuid()::text), 1, 6);
  end if;

  new.slug := candidate;
  return new;
end
$$;

-- 3) trigger (INSERT only, stable slugs)
drop trigger if exists trg_projects_fill_slug on public.projects;
create trigger trg_projects_fill_slug
before insert on public.projects
for each row
execute function public.projects_fill_slug();

-- 4) Optional one-time backfill for existing rows (if any)
--    (Runs now; future updates won't change slugs automatically.)
update public.projects
set slug = null
where slug is null or slug = '';

-- 5) constraints (unique per org + NOT NULL)
drop index if exists projects_org_slug_unique;
create unique index projects_org_slug_unique
  on public.projects (organization_user_id, slug);

alter table public.projects
  alter column slug set not null;
