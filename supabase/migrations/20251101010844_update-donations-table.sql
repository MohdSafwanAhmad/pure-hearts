alter table "public"."donations"
add column "donor_in_app_city" text;

alter table "public"."donations"
add column "donor_in_app_country" text;

alter table "public"."donations"
add column "donor_in_app_phone" text;

alter table "public"."donations"
add column "donor_in_app_postal_code" text;

alter table "public"."donations"
add column "donor_in_app_state" text;

alter table "public"."donations"
add column "organization_state" text;

alter table "public"."donations"
alter column "stripe_fee"
set data type numeric(12, 2) using "stripe_fee"::numeric(12, 2);