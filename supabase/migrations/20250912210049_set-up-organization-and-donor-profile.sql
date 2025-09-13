create table "public"."donors" (
    "user_id" uuid not null,
    "first_name" text not null,
    "last_name" text not null,
    "donation_preferences" jsonb default '[]'::jsonb,
    "profile_completed" boolean default false
);


alter table "public"."donors" enable row level security;

create table "public"."organizations" (
    "user_id" uuid not null,
    "organization_name" text not null,
    "organization_phone" text not null,
    "country" text not null default 'Canada'::text,
    "state" text not null,
    "city" text not null,
    "address" text not null,
    "contact_person_name" text not null,
    "contact_person_email" text not null,
    "contact_person_phone" text not null,
    "mission_statement" text not null,
    "project_areas" jsonb default '[]'::jsonb,
    "website_url" text,
    "facebook_url" text,
    "twitter_url" text,
    "instagram_url" text,
    "linkedin_url" text,
    "is_verified" boolean default false
);


alter table "public"."organizations" enable row level security;

CREATE UNIQUE INDEX donors_pkey ON public.donors USING btree (user_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (user_id);

alter table "public"."donors" add constraint "donors_pkey" PRIMARY KEY using index "donors_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."donors" add constraint "donors_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."donors" validate constraint "donors_user_id_fkey";

alter table "public"."organizations" add constraint "organizations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."organizations" validate constraint "organizations_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check user_type from metadata and create appropriate record
  IF NEW.raw_user_meta_data->>'user_type' = 'donor' THEN
    INSERT INTO public.donors (
      user_id,
      first_name,
      last_name,
      donation_preferences
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      COALESCE(NEW.raw_user_meta_data->'donation_preferences', '[]'::jsonb)
    );
    
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'organization' THEN
    INSERT INTO public.organizations (
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
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'organization_name',
      NEW.raw_user_meta_data->>'organization_phone',
      NEW.raw_user_meta_data->>'country',
      NEW.raw_user_meta_data->>'state',
      NEW.raw_user_meta_data->>'city',
      NEW.raw_user_meta_data->>'address',
      NEW.raw_user_meta_data->>'contact_person_name',
      NEW.raw_user_meta_data->>'contact_person_email',
      NEW.raw_user_meta_data->>'contact_person_phone',
      COALESCE(NEW.raw_user_meta_data->>'mission_statement', ''),
      COALESCE(NEW.raw_user_meta_data->'project_areas', '[]'::jsonb),
      NEW.raw_user_meta_data->>'website_url',
      NEW.raw_user_meta_data->>'facebook_url',
      NEW.raw_user_meta_data->>'twitter_url',
      NEW.raw_user_meta_data->>'instagram_url',
      NEW.raw_user_meta_data->>'linkedin_url'
    );
  END IF;
  
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."donors" to "anon";

grant insert on table "public"."donors" to "anon";

grant references on table "public"."donors" to "anon";

grant select on table "public"."donors" to "anon";

grant trigger on table "public"."donors" to "anon";

grant truncate on table "public"."donors" to "anon";

grant update on table "public"."donors" to "anon";

grant delete on table "public"."donors" to "authenticated";

grant insert on table "public"."donors" to "authenticated";

grant references on table "public"."donors" to "authenticated";

grant select on table "public"."donors" to "authenticated";

grant trigger on table "public"."donors" to "authenticated";

grant truncate on table "public"."donors" to "authenticated";

grant update on table "public"."donors" to "authenticated";

grant delete on table "public"."donors" to "service_role";

grant insert on table "public"."donors" to "service_role";

grant references on table "public"."donors" to "service_role";

grant select on table "public"."donors" to "service_role";

grant trigger on table "public"."donors" to "service_role";

grant truncate on table "public"."donors" to "service_role";

grant update on table "public"."donors" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

create policy "Donors can access their own record"
on "public"."donors"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Organizations can access their own record"
on "public"."organizations"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Public can view organizations"
on "public"."organizations"
as permissive
for select
to public
using (true);



