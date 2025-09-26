alter table public.donations enable row level security;

-- DEMO: allow public read of donations so we can aggregate totals on the site (to change later with RPC)
drop policy if exists "donations_read_public_demo" on public.donations;
create policy "donations_read_public_demo"
on public.donations
for select
to anon, authenticated
using (true);

