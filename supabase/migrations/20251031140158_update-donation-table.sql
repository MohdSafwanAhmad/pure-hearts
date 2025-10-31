alter table "public"."donations"
drop constraint "donations_project_id_fkey";

alter table "public"."donations"
drop column "billing_address";

alter table "public"."donations"
drop column "billing_city";

alter table "public"."donations"
drop column "billing_country";

alter table "public"."donations"
drop column "billing_postal_code";

alter table "public"."donations"
drop column "billing_state";

alter table "public"."donations"
drop column "donor_app_email";

alter table "public"."donations"
drop column "donor_name";

alter table "public"."donations"
drop column "donor_phone";

alter table "public"."donations"
add column "donor_in_app_address" text;

alter table "public"."donations"
add column "donor_in_app_email" text;

alter table "public"."donations"
add column "donor_in_app_first_name" text;

alter table "public"."donations"
add column "donor_in_app_last_name" text;

alter table "public"."donations"
add column "donor_stripe_billing_address" text;

alter table "public"."donations"
add column "donor_stripe_billing_city" text;

alter table "public"."donations"
add column "donor_stripe_billing_country" text;

alter table "public"."donations"
add column "donor_stripe_billing_postal_code" text;

alter table "public"."donations"
add column "donor_stripe_billing_state" text;

alter table "public"."donations"
add column "donor_stripe_name" text;

alter table "public"."donations"
add column "donor_stripe_phone" text;

alter table "public"."donations"
add column "organization_address" text;

alter table "public"."donations"
add column "organization_city" text;

alter table "public"."donations"
add column "organization_country" text;

alter table "public"."donations"
add column "organization_name" text;

alter table "public"."donations"
add column "organization_phone" text;

alter table "public"."donations"
add column "organization_postal_code" text;

alter table "public"."donations"
add column "organization_stripe_account_id" text;

alter table "public"."donations"
add column "project_description" text;

alter table "public"."donations"
add column "project_goal_amount" numeric(12, 2);

alter table "public"."donations"
add column "project_slug" text;

alter table "public"."donations"
add column "project_title" text;

alter table "public"."donations"
add constraint "donations_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL not valid;

alter table "public"."donations" validate constraint "donations_project_id_fkey";