create table
  "public"."organization_project_areas" (
    "organization_id" uuid not null,
    "project_area_id" integer not null
  );

alter table "public"."organization_project_areas" enable row level security;

create table
  "public"."project_areas" (
    "id" integer generated always as identity not null,
    "label" text not null
  );

alter table "public"."project_areas" enable row level security;

alter table "public"."organizations"
drop column "project_areas";

CREATE UNIQUE INDEX cuisine_types_pkey ON public.project_areas USING btree (id);

CREATE UNIQUE INDEX organization_project_areas_pkey ON public.organization_project_areas USING btree (organization_id, project_area_id);

alter table "public"."organization_project_areas"
add constraint "organization_project_areas_pkey" PRIMARY KEY using index "organization_project_areas_pkey";

alter table "public"."project_areas"
add constraint "cuisine_types_pkey" PRIMARY KEY using index "cuisine_types_pkey";

alter table "public"."organization_project_areas"
add constraint "fk_organization" FOREIGN KEY (organization_id) REFERENCES organizations (user_id) ON DELETE CASCADE not valid;

alter table "public"."organization_project_areas" validate constraint "fk_organization";

alter table "public"."organization_project_areas"
add constraint "fk_project_area" FOREIGN KEY (project_area_id) REFERENCES project_areas (id) ON DELETE CASCADE not valid;

alter table "public"."organization_project_areas" validate constraint "fk_project_area";

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $function$
DECLARE
  v_project_area_record record;
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
      website_url,
      facebook_url,
      twitter_url,
      instagram_url,
      linkedin_url,
      slug
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
      NEW.raw_user_meta_data->>'website_url',
      NEW.raw_user_meta_data->>'facebook_url',
      NEW.raw_user_meta_data->>'twitter_url',
      NEW.raw_user_meta_data->>'instagram_url',
      NEW.raw_user_meta_data->>'linkedin_url',
      NEW.raw_user_meta_data->>'slug'
    );

    -- Insert organization_project_areas if project_areas array is present
    IF NEW.raw_user_meta_data ? 'project_areas' THEN
      FOR v_project_area_record IN
        SELECT jsonb_array_elements((NEW.raw_user_meta_data->>'project_areas')::jsonb)::int as area_id
      LOOP
        INSERT INTO public.organization_project_areas (organization_id, project_area_id)
        VALUES (NEW.id, v_project_area_record.area_id);
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

grant delete on table "public"."organization_project_areas" to "anon";

grant insert on table "public"."organization_project_areas" to "anon";

grant references on table "public"."organization_project_areas" to "anon";

grant
select
  on table "public"."organization_project_areas" to "anon";

grant trigger on table "public"."organization_project_areas" to "anon";

grant
truncate on table "public"."organization_project_areas" to "anon";

grant
update on table "public"."organization_project_areas" to "anon";

grant delete on table "public"."organization_project_areas" to "authenticated";

grant insert on table "public"."organization_project_areas" to "authenticated";

grant references on table "public"."organization_project_areas" to "authenticated";

grant
select
  on table "public"."organization_project_areas" to "authenticated";

grant trigger on table "public"."organization_project_areas" to "authenticated";

grant
truncate on table "public"."organization_project_areas" to "authenticated";

grant
update on table "public"."organization_project_areas" to "authenticated";

grant delete on table "public"."organization_project_areas" to "service_role";

grant insert on table "public"."organization_project_areas" to "service_role";

grant references on table "public"."organization_project_areas" to "service_role";

grant
select
  on table "public"."organization_project_areas" to "service_role";

grant trigger on table "public"."organization_project_areas" to "service_role";

grant
truncate on table "public"."organization_project_areas" to "service_role";

grant
update on table "public"."organization_project_areas" to "service_role";

grant delete on table "public"."project_areas" to "anon";

grant insert on table "public"."project_areas" to "anon";

grant references on table "public"."project_areas" to "anon";

grant
select
  on table "public"."project_areas" to "anon";

grant trigger on table "public"."project_areas" to "anon";

grant
truncate on table "public"."project_areas" to "anon";

grant
update on table "public"."project_areas" to "anon";

grant delete on table "public"."project_areas" to "authenticated";

grant insert on table "public"."project_areas" to "authenticated";

grant references on table "public"."project_areas" to "authenticated";

grant
select
  on table "public"."project_areas" to "authenticated";

grant trigger on table "public"."project_areas" to "authenticated";

grant
truncate on table "public"."project_areas" to "authenticated";

grant
update on table "public"."project_areas" to "authenticated";

grant delete on table "public"."project_areas" to "service_role";

grant insert on table "public"."project_areas" to "service_role";

grant references on table "public"."project_areas" to "service_role";

grant
select
  on table "public"."project_areas" to "service_role";

grant trigger on table "public"."project_areas" to "service_role";

grant
truncate on table "public"."project_areas" to "service_role";

grant
update on table "public"."project_areas" to "service_role";