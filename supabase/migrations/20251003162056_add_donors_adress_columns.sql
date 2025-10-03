alter table "public"."donors" add column "address" text;

alter table "public"."donors" add column "city" text;

alter table "public"."donors" add column "country" text;

alter table "public"."donors" add column "phone" text;

alter table "public"."donors" add column "profile_photo" text;

alter table "public"."donors" add column "state" text;

alter table "public"."donors" add column "updated_at" timestamp with time zone default now();

alter table "public"."donors" alter column "first_name" drop not null;

alter table "public"."donors" alter column "last_name" drop not null;


