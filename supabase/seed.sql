-- Zakat Foundation Canada
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
        'org1@purezakat.com',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Zakat Foundation Canada", "organization_phone": "613-555-0101", "country": "Canada", "state": "Ontario", "city": "Ottawa", "address": "101 Zakat Crescent", "contact_person_name": "Ahmed Karim", "contact_person_email": "ahmed@zakatfoundation.ca", "contact_person_phone": "613-555-0101", "mission_statement": "Empowering communities through Zakat.", "project_areas": ["Zakat", "Relief"], "slug": "zakat-foundation-canada", "website_url": "https://zakatfoundation.ca", "facebook_url": "https://facebook.com/zakatfoundationcanada", "twitter_url": "https://twitter.com/zakatcanada", "instagram_url": "https://instagram.com/zakatfoundationcanada", "linkedin_url": "https://linkedin.com/company/zakatfoundationcanada"}',
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
        'org2@halalmealsproject.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Halal Meals Project", "organization_phone": "647-555-0107", "country": "Canada", "state": "Ontario", "city": "Mississauga", "address": "107 Halal Lane", "contact_person_name": "Omar Farooq", "contact_person_email": "omar@halalmealsproject.org", "contact_person_phone": "647-555-0107", "mission_statement": "Delivering halal meals to those in need.", "project_areas": ["Food Distribution"], "slug": "halal-meals-project", "website_url": "https://halalmealsproject.org", "facebook_url": "https://facebook.com/halalmealsproject", "twitter_url": "https://twitter.com/halalmealsproj", "instagram_url": "https://instagram.com/halalmealsproject", "linkedin_url": "https://linkedin.com/company/halalmealsproject"}',
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
        'org3@masjidoutreach.ca',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Masjid Outreach", "organization_phone": "905-555-0108", "country": "Canada", "state": "Ontario", "city": "Brampton", "address": "108 Outreach Road", "contact_person_name": "Aisha Khan", "contact_person_email": "aisha@masjidoutreach.ca", "contact_person_phone": "905-555-0108", "mission_statement": "Connecting communities through masjid outreach.", "project_areas": ["Community Outreach"], "slug": "masjid-outreach", "website_url": "https://masjidoutreach.ca", "facebook_url": "https://facebook.com/masjidoutreach", "twitter_url": "https://twitter.com/masjidoutreach", "instagram_url": "https://instagram.com/masjidoutreach", "linkedin_url": "https://linkedin.com/company/masjidoutreach"}',
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
        'org4@muslimfoodbank.ca',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Muslim Food Bank", "organization_phone": "604-555-0103", "country": "Canada", "state": "British Columbia", "city": "Vancouver", "address": "103 Food Bank Blvd", "contact_person_name": "Bilal Ahmed", "contact_person_email": "bilal@muslimfoodbank.ca", "contact_person_phone": "604-555-0103", "mission_statement": "Fighting hunger in the Muslim community.", "project_areas": ["Food Distribution"], "slug": "muslim-food-bank", "website_url": "https://muslimfoodbank.ca", "facebook_url": "https://facebook.com/muslimfoodbank", "twitter_url": "https://twitter.com/muslimfoodbank", "instagram_url": "https://instagram.com/muslimfoodbank", "linkedin_url": "https://linkedin.com/company/muslimfoodbank"}',
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
        'org5@quraneducationcenter.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Quran Education Center", "organization_phone": "416-555-0106", "country": "Canada", "state": "Ontario", "city": "Scarborough", "address": "106 Quran Lane", "contact_person_name": "Maryam Yusuf", "contact_person_email": "maryam@quraneducationcenter.org", "contact_person_phone": "416-555-0106", "mission_statement": "Promoting Quranic education for all ages.", "project_areas": ["Education"], "slug": "quran-education-center", "website_url": "https://quraneducationcenter.org", "facebook_url": "https://facebook.com/quraneducationcenter", "twitter_url": "https://twitter.com/quranedcenter", "instagram_url": "https://instagram.com/quraneducationcenter", "linkedin_url": "https://linkedin.com/company/quraneducationcenter"}',
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
        'org6@sadaqahtrust.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Sadaqah Trust", "organization_phone": "416-555-0105", "country": "Canada", "state": "Ontario", "city": "Markham", "address": "105 Sadaqah Street", "contact_person_name": "Imran Patel", "contact_person_email": "imran@sadaqahtrust.org", "contact_person_phone": "416-555-0105", "mission_statement": "Trustworthy sadaqah distribution.", "project_areas": ["Sadaqah"], "slug": "sadaqah-trust", "website_url": "https://sadaqahtrust.org", "facebook_url": "https://facebook.com/sadaqahtrust", "twitter_url": "https://twitter.com/sadaqahtrust", "instagram_url": "https://instagram.com/sadaqahtrust", "linkedin_url": "https://linkedin.com/company/sadaqahtrust"}',
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
        'org7@ummahshelter.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Ummah Shelter", "organization_phone": "416-555-0104", "country": "Canada", "state": "Ontario", "city": "Hamilton", "address": "104 Shelter Drive", "contact_person_name": "Yasmin Rahman", "contact_person_email": "yasmin@ummahshelter.org", "contact_person_phone": "416-555-0104", "mission_statement": "Sheltering the ummah with compassion.", "project_areas": ["Shelter"], "slug": "ummah-shelter", "website_url": "https://ummahshelter.org", "facebook_url": "https://facebook.com/ummahshelter", "twitter_url": "https://twitter.com/ummahshelter", "instagram_url": "https://instagram.com/ummahshelter", "linkedin_url": "https://linkedin.com/company/ummahshelter"}',
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
        'org8@hijrahsupport.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Hijrah Support", "organization_phone": "416-555-0109", "country": "Canada", "state": "Ontario", "city": "Toronto", "address": "109 Hijrah Way", "contact_person_name": "Zainab Ali", "contact_person_email": "zainab@hijrahsupport.org", "contact_person_phone": "416-555-0109", "mission_statement": "Supporting refugees and migrants.", "project_areas": ["Refugee Support"], "slug": "hijrah-support", "website_url": "https://hijrahsupport.org", "facebook_url": "https://facebook.com/hijrahsupport", "twitter_url": "https://twitter.com/hijrahsupport", "instagram_url": "https://instagram.com/hijrahsupport", "linkedin_url": "https://linkedin.com/company/hijrahsupport"}',
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
        'org9@hijrahsupport110.org',
        '',
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"user_type": "organization", "organization_name": "Hijrah Support 110", "organization_phone": "416-555-0110", "country": "Canada", "state": "Ontario", "city": "Toronto", "address": "110 Hijrah Way", "contact_person_name": "Samir Hussain", "contact_person_email": "samir@hijrahsupport110.org", "contact_person_phone": "416-555-0110", "mission_statement": "Empowering new arrivals.", "project_areas": ["Refugee Support"], "slug": "hijrah-support-110", "website_url": "https://hijrahsupport110.org", "facebook_url": "https://facebook.com/hijrahsupport110", "twitter_url": "https://twitter.com/hijrahsupport110", "instagram_url": "https://instagram.com/hijrahsupport110", "linkedin_url": "https://linkedin.com/company/hijrahsupport110"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        -- New column
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
            -- New column
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

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