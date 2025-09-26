-- =============================================================
-- Seed Data: Organizations
-- =============================================================
-- Zakat Foundation Canada and other organizations
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES
    -- Org 1
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org1@purezakat.com',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Zakat Foundation Canada", "organization_phone": "+16135550101", "country": "Canada", "state": "Ontario", "city": "Ottawa", "address": "101 Zakat Crescent", "contact_person_name": "Ahmed Karim", "contact_person_email": "ahmed@zakatfoundation.ca", "contact_person_phone": "+16135550101", "mission_statement": "Empowering communities through Zakat.", "project_areas": ["Zakat", "Relief"], "slug": "zakat-foundation-canada", "website_url": "https://zakatfoundation.ca", "facebook_url": "https://facebook.com/zakatfoundationcanada", "twitter_url": "https://twitter.com/zakatcanada", "instagram_url": "https://instagram.com/zakatfoundationcanada", "linkedin_url": "https://linkedin.com/company/zakatfoundationcanada"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 2
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org2@halalmealsproject.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Halal Meals Project", "organization_phone": "+16475550107", "country": "Canada", "state": "Ontario", "city": "Mississauga", "address": "107 Halal Lane", "contact_person_name": "Omar Farooq", "contact_person_email": "omar@halalmealsproject.org", "contact_person_phone": "+16475550107", "mission_statement": "Delivering halal meals to those in need.", "project_areas": ["Food Distribution"], "slug": "halal-meals-project", "website_url": "https://halalmealsproject.org", "facebook_url": "https://facebook.com/halalmealsproject", "twitter_url": "https://twitter.com/halalmealsproj", "instagram_url": "https://instagram.com/halalmealsproject", "linkedin_url": "https://linkedin.com/company/halalmealsproject"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 3
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org3@masjidoutreach.ca',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Masjid Outreach", "organization_phone": "+129055550108", "country": "Canada", "state": "Ontario", "city": "Brampton", "address": "108 Outreach Road", "contact_person_name": "Aisha Khan", "contact_person_email": "aisha@masjidoutreach.ca", "contact_person_phone": "+129055550108", "mission_statement": "Connecting communities through masjid outreach.", "project_areas": ["Community Outreach"], "slug": "masjid-outreach", "website_url": "https://masjidoutreach.ca", "facebook_url": "https://facebook.com/masjidoutreach", "twitter_url": "https://twitter.com/masjidoutreach", "instagram_url": "https://instagram.com/masjidoutreach", "linkedin_url": "https://linkedin.com/company/masjidoutreach"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 4
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org4@muslimfoodbank.ca',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Muslim Food Bank", "organization_phone": "+16045550103", "country": "Canada", "state": "British Columbia", "city": "Vancouver", "address": "103 Food Bank Blvd", "contact_person_name": "Bilal Ahmed", "contact_person_email": "bilal@muslimfoodbank.ca", "contact_person_phone": "+16045550103", "mission_statement": "Fighting hunger in the Muslim community.", "project_areas": ["Food Distribution"], "slug": "muslim-food-bank", "website_url": "https://muslimfoodbank.ca", "facebook_url": "https://facebook.com/muslimfoodbank", "twitter_url": "https://twitter.com/muslimfoodbank", "instagram_url": "https://instagram.com/muslimfoodbank", "linkedin_url": "https://linkedin.com/company/muslimfoodbank"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 5
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org5@quraneducationcenter.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Quran Education Center", "organization_phone": "+14165550106", "country": "Canada", "state": "Ontario", "city": "Scarborough", "address": "106 Quran Lane", "contact_person_name": "Maryam Yusuf", "contact_person_email": "maryam@quraneducationcenter.org", "contact_person_phone": "+14165550106", "mission_statement": "Promoting Quranic education for all ages.", "project_areas": ["Education"], "slug": "quran-education-center", "website_url": "https://quraneducationcenter.org", "facebook_url": "https://facebook.com/quraneducationcenter", "twitter_url": "https://twitter.com/quranedcenter", "instagram_url": "https://instagram.com/quraneducationcenter", "linkedin_url": "https://linkedin.com/company/quraneducationcenter"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 6
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org6@sadaqahtrust.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Sadaqah Trust", "organization_phone": "+14165550105", "country": "Canada", "state": "Ontario", "city": "Markham", "address": "105 Sadaqah Street", "contact_person_name": "Imran Patel", "contact_person_email": "imran@sadaqahtrust.org", "contact_person_phone": "+14165550105", "mission_statement": "Trustworthy sadaqah distribution.", "project_areas": ["Sadaqah"], "slug": "sadaqah-trust", "website_url": "https://sadaqahtrust.org", "facebook_url": "https://facebook.com/sadaqahtrust", "twitter_url": "https://twitter.com/sadaqahtrust", "instagram_url": "https://instagram.com/sadaqahtrust", "linkedin_url": "https://linkedin.com/company/sadaqahtrust"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 7
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org7@ummahshelter.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Ummah Shelter", "organization_phone": "+14165550104", "country": "Canada", "state": "Ontario", "city": "Hamilton", "address": "104 Shelter Drive", "contact_person_name": "Yasmin Rahman", "contact_person_email": "yasmin@ummahshelter.org", "contact_person_phone": "+14165550104", "mission_statement": "Sheltering the vulnerable.", "project_areas": ["Shelter"], "slug": "ummah-shelter", "website_url": "https://ummahshelter.org", "facebook_url": "https://facebook.com/ummahshelter", "twitter_url": "https://twitter.com/ummahshelter", "instagram_url": "https://instagram.com/ummahshelter", "linkedin_url": "https://linkedin.com/company/ummahshelter"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 8
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org8@hijrahsupport.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Hijrah Support", "organization_phone": "+14165550109", "country": "Canada", "state": "Ontario", "city": "Toronto", "address": "109 Hijrah Way", "contact_person_name": "Zainab Ali", "contact_person_email": "zainab@hijrahsupport.org", "contact_person_phone": "+14165550109", "mission_statement": "Supporting refugees and migrants.", "project_areas": ["Refugee Support"], "slug": "hijrah-support", "website_url": "https://hijrahsupport.org", "facebook_url": "https://facebook.com/hijrahsupport", "twitter_url": "https://twitter.com/hijrahsupport", "instagram_url": "https://instagram.com/hijrahsupport", "linkedin_url": "https://linkedin.com/company/hijrahsupport"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    -- Org 9
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'org9@hijrahsupport110.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Hijrah Support 110", "organization_phone": "+14165550110", "country": "Canada", "state": "Ontario", "city": "Toronto", "address": "110 Hijrah Way", "contact_person_name": "Samir Hussain", "contact_person_email": "samir@hijrahsupport110.org", "contact_person_phone": "+14165550110", "mission_statement": "Empowering new arrivals.", "project_areas": ["Refugee Support"], "slug": "hijrah-support-110", "website_url": "https://hijrahsupport110.org", "facebook_url": "https://facebook.com/hijrahsupport110", "twitter_url": "https://twitter.com/hijrahsupport110", "instagram_url": "https://instagram.com/hijrahsupport110", "linkedin_url": "https://linkedin.com/company/hijrahsupport110"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    );

-- Create email identities for all users
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

-- Backfill organizations | Remove once merged with master with the trigger migration
INSERT INTO
    public.organizations (
        user_id,
        organization_name,
        organization_phone,
        country,
        state,
        city,
        address,
        contact_person_name,
        contact_person_email,
        contact_person_phone,
        mission_statement,
        project_areas,
        website_url,
        facebook_url,
        twitter_url,
        instagram_url,
        linkedin_url
    )
SELECT
    u.id,
    u.raw_user_meta_data ->> 'organization_name',
    u.raw_user_meta_data ->> 'organization_phone',
    COALESCE(u.raw_user_meta_data ->> 'country', 'Canada'),
    u.raw_user_meta_data ->> 'state',
    u.raw_user_meta_data ->> 'city',
    u.raw_user_meta_data ->> 'address',
    u.raw_user_meta_data ->> 'contact_person_name',
    u.raw_user_meta_data ->> 'contact_person_email',
    u.raw_user_meta_data ->> 'contact_person_phone',
    COALESCE(u.raw_user_meta_data ->> 'mission_statement', ''),
    COALESCE(
        u.raw_user_meta_data -> 'project_areas',
        '[]'::jsonb
    ),
    u.raw_user_meta_data ->> 'website_url',
    u.raw_user_meta_data ->> 'facebook_url',
    u.raw_user_meta_data ->> 'twitter_url',
    u.raw_user_meta_data ->> 'instagram_url',
    u.raw_user_meta_data ->> 'linkedin_url'
FROM
    auth.users u
    LEFT JOIN public.organizations o ON o.user_id = u.id
WHERE
    u.raw_user_meta_data ->> 'user_type' = 'organization'
    AND o.user_id IS NULL;

-- =============================================================
-- Seed Data: Donors
-- =============================================================
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'donor1@purezakat.com',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type":"donor","first_name":"Mounir","last_name":"Aiache","donation_preferences":["Education","Orphan Care"]}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'donor2@purezakat.com',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type":"donor","first_name":"Safwan","last_name":"Ansari","donation_preferences":["Education","Poverty Alleviation"]}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'donor3@purezakat.com',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type":"donor","first_name":"Fatima","last_name":"Rahman","donation_preferences":["Orphan Care"]}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4 (),
        'authenticated',
        'authenticated',
        'donor4@purezakat.com',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type":"donor","first_name":"Bilal","last_name":"Siddiq","donation_preferences":["Emergency Relief","Clean Water"]}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    );

-- Backfill donors | Remove once merged with master with the trigger migration
INSERT INTO
    public.donors (
        user_id,
        first_name,
        last_name,
        donation_preferences
    )
SELECT
    u.id,
    u.raw_user_meta_data ->> 'first_name',
    u.raw_user_meta_data ->> 'last_name',
    COALESCE(
        u.raw_user_meta_data -> 'donation_preferences',
        '[]'::jsonb
    )
FROM
    auth.users u
    LEFT JOIN public.donors d ON d.user_id = u.id
WHERE
    u.raw_user_meta_data ->> 'user_type' = 'donor'
    AND d.user_id IS NULL;

-- =============================================================
-- Beneficiary Types
-- =============================================================
INSERT INTO
    public.beneficiary_types (code, label)
VALUES
    ('ORPHANS', 'Orphans'),
    ('STUDENTS', 'Students'),
    ('WIDOWS', 'Widows'),
    ('CITIZENS', 'Citizens'),
    ('RESIDENTS', 'Residents') ON CONFLICT (code)
DO NOTHING;

-- =============================================================
-- Projects (10 across 4 orgs)
-- =============================================================
INSERT INTO public.projects (
  organization_user_id,
  title,
  description,
  goal_amount,
  beneficiary_type_id,
  project_background_image
)
-- Org1
SELECT u.id,
       'School Supplies Drive',
       'Raising funds for school supplies for students.',
       5000.00,
       bt.id,
       '/public-images/projects/school-supplies-drive.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org1@purezakat.com' AND bt.code = 'STUDENTS'
UNION ALL
SELECT u.id,
       'Winter Clothing Appeal',
       'Warm clothing for families in need.',
       7000.00,
       bt.id,
       '/public-images/projects/winter-clothing-appeal.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org1@purezakat.com' AND bt.code = 'CITIZENS'

-- Org2
UNION ALL
SELECT u.id,
       'Food Basket Program',
       'Monthly food baskets for families.',
       9000.00,
       bt.id,
       '/public-images/projects/food-basket-program.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org2@halalmealsproject.org' AND bt.code = 'RESIDENTS'
UNION ALL
SELECT u.id,
       'Emergency Rent Support',
       'Rent relief for struggling families.',
       12000.00,
       bt.id,
       '/public-images/projects/emergency-rent-support.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org2@halalmealsproject.org' AND bt.code = 'WIDOWS'

-- Org3
UNION ALL
SELECT u.id,
       'Shelter Starter Kits',
       'Basic furnishings for new homes.',
       6000.00,
       bt.id,
       '/public-images/projects/shelter-starter-kits.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org3@masjidoutreach.ca' AND bt.code = 'RESIDENTS'
UNION ALL
SELECT u.id,
       'Tuition Bridge Fund',
       'Grants to keep students enrolled.',
       8000.00,
       bt.id,
       '/public-images/projects/tuition-bridge-fund.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org3@masjidoutreach.ca' AND bt.code = 'STUDENTS'
UNION ALL
SELECT u.id,
       'Community Pantry',
       'Neighborhood pantry restock.',
       4000.00,
       bt.id,
       '/public-images/projects/community-pantry.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org3@masjidoutreach.ca' AND bt.code = 'CITIZENS'

-- Org4
UNION ALL
SELECT u.id,
       'Medical Aid Vouchers',
       'Pharmacy vouchers for essential meds.',
       7000.00,
       bt.id,
       '/public-images/projects/medical-aid-vouchers.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org4@muslimfoodbank.ca' AND bt.code = 'RESIDENTS'
UNION ALL
SELECT u.id,
       'Accessibility Upgrades',
       'Home modifications for accessibility.',
       15000.00,
       bt.id,
       '/public-images/projects/accessibility-upgrades.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org4@muslimfoodbank.ca' AND bt.code = 'CITIZENS'
UNION ALL
SELECT u.id,
       'Elderly Care Packages',
       'Monthly hygiene & care packages.',
       5000.00,
       bt.id,
       '/public-images/projects/elderly-care-packages.jpg'
FROM auth.users u, public.beneficiary_types bt
WHERE u.email = 'org4@muslimfoodbank.ca' AND bt.code = 'WIDOWS';


-- =============================================================
-- Donations
-- =============================================================
INSERT INTO
    public.donations (donor_id, project_id, amount, created_at)
SELECT
    d.id,
    p.id,
    100.00,
    now() - interval '10 days'
FROM
    auth.users d,
    public.projects p
WHERE
    d.email = 'donor1@purezakat.com'
    AND p.title = 'School Supplies Drive'
UNION ALL
SELECT
    d.id,
    p.id,
    75.00,
    now() - interval '5 days'
FROM
    auth.users d,
    public.projects p
WHERE
    d.email = 'donor2@purezakat.com'
    AND p.title = 'Food Basket Program'
UNION ALL
SELECT
    d.id,
    p.id,
    50.00,
    now() - interval '3 days'
FROM
    auth.users d,
    public.projects p
WHERE
    d.email = 'donor3@purezakat.com'
    AND p.title = 'Medical Aid Vouchers'
UNION ALL
SELECT
    d.id,
    p.id,
    120.00,
    now() - interval '1 day'
FROM
    auth.users d,
    public.projects p
WHERE
    d.email = 'donor4@purezakat.com'
    AND p.title = 'Elderly Care Packages';

-- =============================================================
-- Organization Logo & Verification Updates
-- =============================================================
UPDATE public.organizations
SET
    logo = 'logo_zakat-foundation-canada_101.png',
    is_verified = true
WHERE
    organization_name = 'Zakat Foundation Canada';

UPDATE public.organizations
SET
    logo = 'logo_islamic-relief-toronto_102.png',
    is_verified = true
WHERE
    organization_name = 'Islamic Relief Toronto';

UPDATE public.organizations
SET
    logo = 'logo_halal-meals-project_107.png',
    is_verified = true
WHERE
    organization_name = 'Halal Meals Project';

UPDATE public.organizations
SET
    logo = 'logo_masjid-outreach_108.webp',
    is_verified = true
WHERE
    organization_name = 'Masjid Outreach';

UPDATE public.organizations
SET
    logo = 'logo_muslim-food-bank_103.png',
    is_verified = true
WHERE
    organization_name = 'Muslim Food Bank';

UPDATE public.organizations
SET
    logo = 'logo_quran-education-center_106.png',
    is_verified = true
WHERE
    organization_name = 'Quran Education Center';

UPDATE public.organizations
SET
    logo = 'logo_sadaqah-trust_105.png',
    is_verified = true
WHERE
    organization_name = 'Sadaqah Trust';

UPDATE public.organizations
SET
    logo = 'logo_ummah-shelter_104.png',
    is_verified = true
WHERE
    organization_name = 'Ummah Shelter';

UPDATE public.organizations
SET
    logo = 'logo_hijrah-support_109.png',
    is_verified = true
WHERE
    organization_name = 'Hijrah Support';

UPDATE public.organizations
SET
    logo = 'logo_hijrah-support_110.jpg',
    is_verified = true
WHERE
    organization_name = 'Hijrah Support 110';


--------------------------------------------------------------------------------
-- PROJECT IMAGES
-- Put files at: /public/public-images/projects/<project-slug>.jpg
-- Example: /public/public-images/projects/winter-clothing-appeal.jpg
--------------------------------------------------------------------------------
update public.projects
set project_background_image = '/public-images/projects/' || slug || '.jpg'
WHERE (project_background_image IS NULL OR project_background_image = '');
--------------------------------------------------------------------------------
-- MORE VERBOSE DESCRIPTIONS FOR EXISTING PROJECTS (by slug)
--------------------------------------------------------------------------------
update public.projects
set description = 'Provide monthly food baskets (rice, flour, oil, lentils, and essentials) for families facing food insecurity. Each basket sustains a family of 4–5 for ~4 weeks and is sourced from local vendors to support the community economy.'
where slug = 'food-basket-program';

update public.projects
set description = 'Warm clothing (coats, thermal layers, socks, gloves) for families during peak winter. We prioritize children and seniors and run local distribution days in partnership with community centers.'
where slug = 'winter-clothing-appeal';

update public.projects
set description = 'Back-to-school kits with backpacks, notebooks, writing materials, and basic stationery for students from low-income households. Each kit is tailored by grade to reduce waste and increase impact.'
where slug = 'school-supplies-drive';

update public.projects
set description = 'Digital and paper vouchers redeemable at partner pharmacies for over-the-counter medicine and basic medical supplies. We focus on chronic patients and caregivers who need recurring support.'
where slug = 'medical-aid-vouchers';

update public.projects
set description = 'Monthly care packages (food staples + hygiene products) for isolated seniors. Volunteers also perform wellness checks and help with light errands during deliveries.'
where slug = 'elderly-care-packages';

--------------------------------------------------------------------------------
-- INSERT ADDITIONAL PROJECTS (clean, idempotent by (org, slug) uniqueness)
-- Uses your org slugs: `halal-meals-project`, `zakat-foundation-canada`.
-- Slugs are generated by your trigger on insert.
--------------------------------------------------------------------------------

-- Halal Meals Project: add 3 campaigns (with beneficiary_type_id + image)
insert into public.projects
  (organization_user_id, title, description, goal_amount, start_date, beneficiary_type_id, project_background_image)
select o.user_id,
       'Meals for Newcomers',
       'Fresh halal meals for recently arrived newcomer families during their first 90 days. Includes culturally familiar menus and nutrition-focused portions.',
       12000, current_date,
       bt.id,
       '/public-images/projects/meals-for-newcomers.jpg'
from public.organizations o
join public.beneficiary_types bt on bt.code = 'RESIDENTS'
where o.slug = 'halal-meals-project'
  and not exists (
    select 1 from public.projects p
    where p.organization_user_id = o.user_id and p.title = 'Meals for Newcomers'
  );

insert into public.projects
  (organization_user_id, title, description, goal_amount, start_date, beneficiary_type_id, project_background_image)
select o.user_id,
       'Ramadan Iftar Program',
       'Daily iftar packs (dates, mains, water) distributed at mosques and shelters throughout Ramadan. Each $10 sponsors one iftar.',
       15000, current_date,
       bt.id,
       '/public-images/projects/ramadan-iftar-program.jpg'
from public.organizations o
join public.beneficiary_types bt on bt.code = 'CITIZENS'
where o.slug = 'halal-meals-project'
  and not exists (
    select 1 from public.projects p
    where p.organization_user_id = o.user_id and p.title = 'Ramadan Iftar Program'
  );

insert into public.projects
  (organization_user_id, title, description, goal_amount, start_date, beneficiary_type_id, project_background_image)
select o.user_id,
       'Weekend Family Hampers',
       'Two-day food hampers for families whose children rely on school meals during weekdays. Packed by volunteers every Friday evening.',
       9000, current_date,
       bt.id,
       '/public-images/projects/weekend-family-hampers.jpg'
from public.organizations o
join public.beneficiary_types bt on bt.code = 'RESIDENTS'
where o.slug = 'halal-meals-project'
  and not exists (
    select 1 from public.projects p
    where p.organization_user_id = o.user_id and p.title = 'Weekend Family Hampers'
  );

-- Zakat Foundation Canada: add 3 campaigns (with beneficiary_type_id + image)
insert into public.projects
  (organization_user_id, title, description, goal_amount, start_date, beneficiary_type_id, project_background_image)
select o.user_id,
       'Refugee Housing Support',
       'Security deposits and first-month rent assistance for newcomer families transitioning into permanent housing. Paired with settlement worker follow-ups.',
       25000, current_date,
       bt.id,
       '/public-images/projects/refugee-housing-support.jpg'
from public.organizations o
join public.beneficiary_types bt on bt.code = 'RESIDENTS'
where o.slug = 'zakat-foundation-canada'
  and not exists (
    select 1 from public.projects p
    where p.organization_user_id = o.user_id and p.title = 'Refugee Housing Support'
  );

insert into public.projects
  (organization_user_id, title, description, goal_amount, start_date, beneficiary_type_id, project_background_image)
select o.user_id,
       'Youth Laptop Library',
       'Loaner laptops and Wi-Fi hotspots for high-school students in low-connectivity households. Devices are refurbished, encrypted, and tracked.',
       18000, current_date,
       bt.id,
       '/public-images/projects/youth-laptop-library.jpg'
from public.organizations o
join public.beneficiary_types bt on bt.code = 'STUDENTS'
where o.slug = 'zakat-foundation-canada'
  and not exists (
    select 1 from public.projects p
    where p.organization_user_id = o.user_id and p.title = 'Youth Laptop Library'
  );

insert into public.projects
  (organization_user_id, title, description, goal_amount, start_date, beneficiary_type_id, project_background_image)
select o.user_id,
       'Water Well Construction',
       'Shallow well construction in water-stressed villages with community-owned maintenance plans. Includes hygiene training and water committee setup.',
       30000, current_date,
       bt.id,
       '/public-images/projects/water-well-construction.jpg'
from public.organizations o
join public.beneficiary_types bt on bt.code = 'CITIZENS'
where o.slug = 'zakat-foundation-canada'
  and not exists (
    select 1 from public.projects p
    where p.organization_user_id = o.user_id and p.title = 'Water Well Construction'
  );

--------------------------------------------------------------------------------
-- DONATION BULK SEEDING
-- Distributes many donations across all projects and existing donors.
-- (Relies on donors already present; if none, this will insert zero rows.)
--------------------------------------------------------------------------------
with donors as (
  select user_id
  from public.donors
  limit 200
),
projects as (
  select id
  from public.projects
),
-- build a grid of (donor, 3 random projects) with tiered amounts
sampled as (
  select d.user_id as donor_id, p.id as project_id,
         -- tiered realistic amounts: 25–500
         (25 * (1 + (floor(random()*8))::int))::numeric as amount
  from donors d
  cross join lateral (
    select id from projects order by random() limit 3
  ) p
)
insert into public.donations (donor_id, project_id, amount)
select donor_id, project_id, amount
from sampled;
