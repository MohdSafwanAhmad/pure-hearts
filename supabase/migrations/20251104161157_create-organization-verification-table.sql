create table "public"."organization_verification_requests" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" uuid not null,
    "document_path" text not null,
    "document_name" text not null,
    "status" text not null default 'pending'::text,
    "admin_notes" text,
    "submitted_at" timestamp with time zone default now(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by_first_name" text,
    "reviewed_by_last_name" text,
    "reviewed_by_phone" text
);


alter table "public"."organization_verification_requests" enable row level security;

CREATE UNIQUE INDEX verification_requests_pkey ON public.organization_verification_requests USING btree (id);

alter table "public"."organization_verification_requests" add constraint "verification_requests_pkey" PRIMARY KEY using index "verification_requests_pkey";

alter table "public"."organization_verification_requests" add constraint "organization_verification_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'cancelled'::text]))) not valid;

alter table "public"."organization_verification_requests" validate constraint "organization_verification_requests_status_check";

alter table "public"."organization_verification_requests" add constraint "verification_requests_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(user_id) ON DELETE CASCADE not valid;

alter table "public"."organization_verification_requests" validate constraint "verification_requests_organization_id_fkey";

grant delete on table "public"."organization_verification_requests" to "anon";

grant insert on table "public"."organization_verification_requests" to "anon";

grant references on table "public"."organization_verification_requests" to "anon";

grant select on table "public"."organization_verification_requests" to "anon";

grant trigger on table "public"."organization_verification_requests" to "anon";

grant truncate on table "public"."organization_verification_requests" to "anon";

grant update on table "public"."organization_verification_requests" to "anon";

grant delete on table "public"."organization_verification_requests" to "authenticated";

grant insert on table "public"."organization_verification_requests" to "authenticated";

grant references on table "public"."organization_verification_requests" to "authenticated";

grant select on table "public"."organization_verification_requests" to "authenticated";

grant trigger on table "public"."organization_verification_requests" to "authenticated";

grant truncate on table "public"."organization_verification_requests" to "authenticated";

grant update on table "public"."organization_verification_requests" to "authenticated";

grant delete on table "public"."organization_verification_requests" to "service_role";

grant insert on table "public"."organization_verification_requests" to "service_role";

grant references on table "public"."organization_verification_requests" to "service_role";

grant select on table "public"."organization_verification_requests" to "service_role";

grant trigger on table "public"."organization_verification_requests" to "service_role";

grant truncate on table "public"."organization_verification_requests" to "service_role";

grant update on table "public"."organization_verification_requests" to "service_role";


