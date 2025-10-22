alter table "public"."organizations" add column "is_stripe_account_connected" boolean not null default false;

alter table "public"."organizations" add column "stripe_account_id" text;


