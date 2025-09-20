create table "public"."beneficiary_types" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "label" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."beneficiary_types" enable row level security;

create table "public"."donations" (
    "id" uuid not null default gen_random_uuid(),
    "donor_id" uuid not null,
    "project_id" uuid not null,
    "amount" numeric(12,2) not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."donations" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "organization_user_id" uuid not null,
    "title" text not null,
    "description" text,
    "goal_amount" numeric(12,2),
    "beneficiary_type_id" uuid,
    "start_date" date,
    "end_date" date,
    "project_background_image" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX beneficiary_types_code_key ON public.beneficiary_types USING btree (code);

CREATE UNIQUE INDEX beneficiary_types_pkey ON public.beneficiary_types USING btree (id);

CREATE UNIQUE INDEX donations_pkey ON public.donations USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

alter table "public"."beneficiary_types" add constraint "beneficiary_types_pkey" PRIMARY KEY using index "beneficiary_types_pkey";

alter table "public"."donations" add constraint "donations_pkey" PRIMARY KEY using index "donations_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."beneficiary_types" add constraint "beneficiary_types_code_key" UNIQUE using index "beneficiary_types_code_key";

alter table "public"."donations" add constraint "donations_amount_check" CHECK ((amount > (0)::numeric)) not valid;

alter table "public"."donations" validate constraint "donations_amount_check";

alter table "public"."donations" add constraint "donations_donor_id_fkey" FOREIGN KEY (donor_id) REFERENCES donors(user_id) ON DELETE CASCADE not valid;

alter table "public"."donations" validate constraint "donations_donor_id_fkey";

alter table "public"."donations" add constraint "donations_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT not valid;

alter table "public"."donations" validate constraint "donations_project_id_fkey";

alter table "public"."projects" add constraint "projects_beneficiary_type_id_fkey" FOREIGN KEY (beneficiary_type_id) REFERENCES beneficiary_types(id) ON DELETE SET NULL not valid;

alter table "public"."projects" validate constraint "projects_beneficiary_type_id_fkey";

alter table "public"."projects" add constraint "projects_goal_amount_check" CHECK ((goal_amount > (0)::numeric)) not valid;

alter table "public"."projects" validate constraint "projects_goal_amount_check";

alter table "public"."projects" add constraint "projects_organization_user_id_fkey" FOREIGN KEY (organization_user_id) REFERENCES organizations(user_id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_organization_user_id_fkey";

grant delete on table "public"."beneficiary_types" to "anon";

grant insert on table "public"."beneficiary_types" to "anon";

grant references on table "public"."beneficiary_types" to "anon";

grant select on table "public"."beneficiary_types" to "anon";

grant trigger on table "public"."beneficiary_types" to "anon";

grant truncate on table "public"."beneficiary_types" to "anon";

grant update on table "public"."beneficiary_types" to "anon";

grant delete on table "public"."beneficiary_types" to "authenticated";

grant insert on table "public"."beneficiary_types" to "authenticated";

grant references on table "public"."beneficiary_types" to "authenticated";

grant select on table "public"."beneficiary_types" to "authenticated";

grant trigger on table "public"."beneficiary_types" to "authenticated";

grant truncate on table "public"."beneficiary_types" to "authenticated";

grant update on table "public"."beneficiary_types" to "authenticated";

grant delete on table "public"."beneficiary_types" to "service_role";

grant insert on table "public"."beneficiary_types" to "service_role";

grant references on table "public"."beneficiary_types" to "service_role";

grant select on table "public"."beneficiary_types" to "service_role";

grant trigger on table "public"."beneficiary_types" to "service_role";

grant truncate on table "public"."beneficiary_types" to "service_role";

grant update on table "public"."beneficiary_types" to "service_role";

grant delete on table "public"."donations" to "anon";

grant insert on table "public"."donations" to "anon";

grant references on table "public"."donations" to "anon";

grant select on table "public"."donations" to "anon";

grant trigger on table "public"."donations" to "anon";

grant truncate on table "public"."donations" to "anon";

grant update on table "public"."donations" to "anon";

grant delete on table "public"."donations" to "authenticated";

grant insert on table "public"."donations" to "authenticated";

grant references on table "public"."donations" to "authenticated";

grant select on table "public"."donations" to "authenticated";

grant trigger on table "public"."donations" to "authenticated";

grant truncate on table "public"."donations" to "authenticated";

grant update on table "public"."donations" to "authenticated";

grant delete on table "public"."donations" to "service_role";

grant insert on table "public"."donations" to "service_role";

grant references on table "public"."donations" to "service_role";

grant select on table "public"."donations" to "service_role";

grant trigger on table "public"."donations" to "service_role";

grant truncate on table "public"."donations" to "service_role";

grant update on table "public"."donations" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

create policy "beneficiary_types_read_all"
on "public"."beneficiary_types"
as permissive
for select
to public
using (true);


create policy "donations_insert_self"
on "public"."donations"
as permissive
for insert
to authenticated
with check ((donor_id = auth.uid()));


create policy "donations_read_by_org_owner"
on "public"."donations"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (projects p
     JOIN organizations o ON ((o.user_id = p.organization_user_id)))
  WHERE ((p.id = donations.project_id) AND (o.user_id = auth.uid())))));


create policy "donations_read_self"
on "public"."donations"
as permissive
for select
to authenticated
using ((donor_id = auth.uid()));


create policy "projects_insert_by_org_owner"
on "public"."projects"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM organizations o
  WHERE ((o.user_id = projects.organization_user_id) AND (o.user_id = auth.uid())))));


create policy "projects_read_all"
on "public"."projects"
as permissive
for select
to public
using (true);


create policy "projects_update_by_org_owner"
on "public"."projects"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM organizations o
  WHERE ((o.user_id = projects.organization_user_id) AND (o.user_id = auth.uid())))));



