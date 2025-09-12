-- ========================================
-- Seed users (local only; Supabase Auth handles this in cloud)
-- ========================================
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', 'alice@example.com', crypt('password', gen_salt('bf')), now(), jsonb_build_object('full_name','Alice Example'), now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'bob@example.com',   crypt('password', gen_salt('bf')), now(), jsonb_build_object('full_name','Bob Example'),   now(), now())
on conflict (id) do nothing;

-- ========================================
-- Profiles
-- ========================================
insert into public.profiles (id, full_name, phone, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', 'Alice Example', '123-456-7890', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'Bob Example',   '987-654-3210', now(), now())
on conflict (id) do nothing;

-- ========================================
-- Organizations
-- ========================================
-- Org 1: Alice’s org
insert into public.organizations (id, name, license_number, supervising_body, association_field, province, city, address, email, phone, website, is_active, owner_id, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Helping Hands Org', 'LIC12345', 'Gov Dept', 'Education', 'Ontario', 'Toronto', '123 Charity St', 'contact@helpinghands.org', '111-222-3333', 'https://helpinghands.org', true, '00000000-0000-0000-0000-000000000001', now(), now())
on conflict (id) do nothing;

-- Org 2: Bob’s org
insert into public.organizations (id, name, license_number, supervising_body, association_field, province, city, address, email, phone, website, is_active, owner_id, created_at, updated_at)
values
  ('22222222-2222-2222-2222-222222222222', 'Global Relief Org', 'LIC67890', 'Charity Board', 'Health', 'Quebec', 'Montreal', '456 Aid Ave', 'info@globalrelief.org', '444-555-6666', 'https://globalrelief.org', true, '00000000-0000-0000-0000-000000000002', now(), now())
on conflict (id) do nothing;

-- ========================================
-- Projects (4 total: 2 per org)
-- ========================================
-- Alice’s org projects
insert into public.projects (id, organization_id, title, description, goal_amount, created_at, updated_at)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'School Supplies Drive', 'Raising funds for school supplies for underprivileged kids.', 5000.00, now(), now()),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', 'Winter Clothing Appeal', 'Collecting donations to provide warm clothing for families in need.', 3000.00, now(), now())
on conflict (id) do nothing;

-- Bob’s org projects
insert into public.projects (id, organization_id, title, description, goal_amount, created_at, updated_at)
values
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222222', 'Medical Aid Kits', 'Funding essential medical kits for rural clinics.', 7000.00, now(), now()),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '22222222-2222-2222-2222-222222222222', 'Clean Water Wells', 'Drilling wells to provide clean water in remote villages.', 10000.00, now(), now())
on conflict (id) do nothing;

-- ========================================
-- Donations
-- ========================================
-- Bob donates to Alice’s project
insert into public.donations (id, donor_id, project_id, amount, created_at)
values
  ('ddddddd1-dddd-dddd-dddd-ddddddddddd1', '00000000-0000-0000-0000-000000000002', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 100.00, now())
on conflict (id) do nothing;

-- Alice donates to Bob’s project
insert into public.donations (id, donor_id, project_id, amount, created_at)
values
  ('ddddddd2-dddd-dddd-dddd-ddddddddddd2', '00000000-0000-0000-0000-000000000001', 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 250.00, now())
on conflict (id) do nothing;
