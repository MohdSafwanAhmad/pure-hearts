alter table "public"."donations" drop constraint "donations_donor_id_fkey";

alter table "public"."donations" add column "billing_address" text;

alter table "public"."donations" add column "billing_city" text;

alter table "public"."donations" add column "billing_country" text;

alter table "public"."donations" add column "billing_postal_code" text;

alter table "public"."donations" add column "billing_state" text;

alter table "public"."donations" add column "currency" text not null default 'cad'::text;

alter table "public"."donations" add column "donor_app_email" text;

alter table "public"."donations" add column "donor_name" text;

alter table "public"."donations" add column "donor_phone" text;

alter table "public"."donations" add column "donor_stripe_email" text;

alter table "public"."donations" add column "is_anonymous" boolean default false;

alter table "public"."donations" add column "payment_method" text;

alter table "public"."donations" add column "stripe_fee" numeric default '0'::numeric;

alter table "public"."donations" add column "stripe_payment_id" text;

alter table "public"."donations" alter column "donor_id" drop not null;

alter table "public"."donors" add column "stripe_account_id" text;

alter table "public"."donations" add constraint "donations_donor_id_fkey" FOREIGN KEY (donor_id) REFERENCES donors(user_id) ON DELETE SET NULL not valid;

alter table "public"."donations" validate constraint "donations_donor_id_fkey";

create or replace view "public"."project_status_view" as  SELECT p.id,
    p.organization_user_id,
    p.title,
    p.description,
    p.goal_amount,
    p.beneficiary_type_id,
    p.start_date,
    p.end_date,
    p.project_background_image,
    p.created_at,
    p.updated_at,
    p.slug,
    COALESCE(((p.end_date < CURRENT_DATE) OR (COALESCE(sum(d.amount), (0)::numeric) >= p.goal_amount)), false) AS is_completed
   FROM (projects p
     LEFT JOIN donations d ON ((d.project_id = p.id)))
  GROUP BY p.id;



