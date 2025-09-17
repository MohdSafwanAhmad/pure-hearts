-- =============================================================
-- Seed Data for Organizations
-- =============================================================
INSERT INTO
    auth.users (id, email, raw_user_meta_data)
VALUES
    (
        '00000000-0000-0000-0000-000000000101',
        'org1@purezakat.org',
        '{"user_type": "organization", "organization_name": "Zakat Foundation Canada", "organization_phone": "613-555-0101", "country": "Canada", "state": "Ontario", "city": "Ottawa", "address": "101 Zakat Crescent", "contact_person_name": "Ahmed Karim", "contact_person_email": "ahmed@zakatfoundation.ca", "contact_person_phone": "613-555-0101", "mission_statement": "Empowering communities through Zakat.", "project_areas": ["Zakat", "Relief"], "slug": "zakat-foundation-canada", "website_url": "https://zakatfoundation.ca", "facebook_url": "https://facebook.com/zakatfoundationcanada", "twitter_url": "https://twitter.com/zakatcanada", "instagram_url": "https://instagram.com/zakatfoundationcanada", "linkedin_url": "https://linkedin.com/company/zakatfoundationcanada"}'
    ),
    (
        '00000000-0000-0000-0000-000000000102',
        'org2@purezakat.org',
        '{"user_type": "organization", "organization_name": "Islamic Relief Toronto", "organization_phone": "416-555-0102", "country": "Canada", "state": "Ontario", "city": "Toronto", "address": "202 Relief Ave", "contact_person_name": "Fatima Noor", "contact_person_email": "fatima@islamicrelief.ca", "contact_person_phone": "416-555-0102", "mission_statement": "Serving humanity for Allah.", "project_areas": ["Orphans", "Water"], "slug": "islamic-relief-toronto", "website_url": "https://islamicrelief.ca/toronto", "facebook_url": "https://facebook.com/islamicrelieftoronto", "twitter_url": "https://twitter.com/irtoronto"}'
    ),
    (
        '00000000-0000-0000-0000-000000000103',
        'org3@purezakat.org',
        '{"user_type": "organization", "organization_name": "Muslim Food Bank", "organization_phone": "604-555-0103", "country": "Canada", "state": "British Columbia", "city": "Vancouver", "address": "303 Food St", "contact_person_name": "Bilal Siddiq", "contact_person_email": "bilal@muslimfoodbank.ca", "contact_person_phone": "604-555-0103", "mission_statement": "Feeding the hungry, fulfilling Zakat.", "project_areas": ["Food", "Zakat"], "slug": "muslim-food-bank", "website_url": "https://muslimfoodbank.com", "instagram_url": "https://instagram.com/muslimfoodbank"}'
    ),
    (
        '00000000-0000-0000-0000-000000000104',
        'org4@purezakat.org',
        '{"user_type": "organization", "organization_name": "Ummah Shelter", "organization_phone": "780-555-0104", "country": "Canada", "state": "Alberta", "city": "Edmonton", "address": "404 Shelter Lane", "contact_person_name": "Layla Hassan", "contact_person_email": "layla@ummah-shelter.ca", "contact_person_phone": "780-555-0104", "mission_statement": "Providing shelter for the Ummah.", "project_areas": ["Shelter", "Refugees"], "slug": "ummah-shelter", "website_url": "https://ummah-shelter.ca", "facebook_url": "https://facebook.com/ummah.shelter"}'
    ),
    (
        '00000000-0000-0000-0000-000000000105',
        'org5@purezakat.org',
        '{"user_type": "organization", "organization_name": "Sadaqah Trust", "organization_phone": "204-555-0105", "country": "Canada", "state": "Manitoba", "city": "Winnipeg", "address": "505 Sadaqah Blvd", "contact_person_name": "Yusuf Ali", "contact_person_email": "yusuf@sadaqahtrust.ca", "contact_person_phone": "204-555-0105", "mission_statement": "Spreading kindness through Sadaqah.", "project_areas": ["Sadaqah", "Community"], "slug": "sadaqah-trust", "website_url": "https://sadaqahtrust.ca", "twitter_url": "https://twitter.com/sadaqahtrust"}'
    ),
    (
        '00000000-0000-0000-0000-000000000106',
        'org6@purezakat.org',
        '{"user_type": "organization", "organization_name": "Quran Education Center", "organization_phone": "902-555-0106", "country": "Canada", "state": "Nova Scotia", "city": "Halifax", "address": "606 Quran Rd", "contact_person_name": "Maryam Rahman", "contact_person_email": "maryam@qurancenter.ca", "contact_person_phone": "902-555-0106", "mission_statement": "Teaching the Quran to all.", "project_areas": ["Education", "Quran"], "slug": "quran-education-center", "website_url": "https://qurancenter.ca", "instagram_url": "https://instagram.com/qurancenter"}'
    ),
    (
        '00000000-0000-0000-0000-000000000107',
        'org7@purezakat.org',
        '{"user_type": "organization", "organization_name": "Halal Meals Project", "organization_phone": "306-555-0107", "country": "Canada", "state": "Saskatchewan", "city": "Regina", "address": "707 Halal St", "contact_person_name": "Imran Farooq", "contact_person_email": "imran@halalmeals.ca", "contact_person_phone": "306-555-0107", "mission_statement": "Delivering halal meals to those in need.", "project_areas": ["Food", "Halal"], "slug": "halal-meals-project", "website_url": "https://halalmeals.ca"}'
    ),
    (
        '00000000-0000-0000-0000-000000000108',
        'org8@purezakat.org',
        '{"user_type": "organization", "organization_name": "Masjid Outreach", "organization_phone": "709-555-0108", "country": "Canada", "state": "Newfoundland", "city": "St. John''s", "address": "808 Masjid Ave", "contact_person_name": "Zainab Omar", "contact_person_email": "zainab@masjidoutreach.ca", "contact_person_phone": "709-555-0108","mission_statement": "Connecting communities through the Masjid.", "project_areas": ["Outreach", "Masjid"], "slug": "masjid-outreach", "facebook_url": "https://facebook.com/masjidoutreach", "instagram_url": "https://instagram.com/masjidoutreach"}'
    ),
    (
        '00000000-0000-0000-0000-000000000109',
        'org9@purezakat.org',
        '{"user_type": "organization", "organization_name": "Hijrah Support", "organization_phone": "902-555-0109", "country": "Canada", "state": "Prince Edward Island", "city": "Charlottetown", "address": "909 Hijrah Rd", "contact_person_name": "Salman Idris", "contact_person_email": "salman@hijrahsupport.ca", "contact_person_phone": "902-555-0109", "mission_statement": "Supporting new Muslims in Hijrah.", "project_areas": ["Support", "Hijrah"], "slug": "hijrah-support", "website_url": "https://hijrahsupport.ca", "linkedin_url": "https://linkedin.com/company/hijrahsupport"}'
    );

-- End of INSERT statement
-- Update organization logo and verification status
UPDATE public.organizations
SET
    logo = 'logo_zakat-foundation-canada_101.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000101';

UPDATE public.organizations
SET
    logo = 'logo_islamic-relief-toronto_102.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000102';

UPDATE public.organizations
SET
    logo = 'logo_muslim-food-bank_103.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000103';

UPDATE public.organizations
SET
    logo = 'logo_ummah-shelter_104.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000104';

UPDATE public.organizations
SET
    logo = 'logo_sadaqah-trust_105.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000105';

UPDATE public.organizations
SET
    logo = 'logo_quran-education-center_106.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000106';

UPDATE public.organizations
SET
    logo = 'logo_halal-meals-project_107.png',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000107';

UPDATE public.organizations
SET
    logo = 'logo_masjid-outreach_108.webp',
    is_verified = true
WHERE
    user_id = '00000000-0000-0000-0000-000000000108';

UPDATE public.organizations
SET
    logo = 'logo_hijrah-support_109.png',
    is_verified = false
WHERE
    user_id = '00000000-0000-0000-0000-000000000109';

UPDATE public.organizations
SET
    logo = 'logo_youth-zakat-initiative_110.jpg',
    is_verified = false
WHERE
    user_id = '00000000-0000-0000-0000-000000000110';