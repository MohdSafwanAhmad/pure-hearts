create table "public"."organization_contact_info" (
    "organization_id" uuid not null,
    "contact_person_name" text not null,
    "contact_person_email" text not null,
    "contact_person_phone" text not null
);


alter table "public"."organization_contact_info" enable row level security;

create table "public"."organization_payment_info" (
    "organization_id" uuid not null,
    "stripe_account_id" text,
    "is_stripe_account_connected" boolean not null default false
);


alter table "public"."organization_payment_info" enable row level security;

alter table "public"."organizations" drop column "contact_person_email";

alter table "public"."organizations" drop column "contact_person_name";

alter table "public"."organizations" drop column "contact_person_phone";

alter table "public"."organizations" drop column "is_stripe_account_connected";

alter table "public"."organizations" drop column "stripe_account_id";

CREATE UNIQUE INDEX organization_contact_info_pkey ON public.organization_contact_info USING btree (organization_id);

CREATE UNIQUE INDEX organization_payment_info_pkey ON public.organization_payment_info USING btree (organization_id);

alter table "public"."organization_contact_info" add constraint "organization_contact_info_pkey" PRIMARY KEY using index "organization_contact_info_pkey";

alter table "public"."organization_payment_info" add constraint "organization_payment_info_pkey" PRIMARY KEY using index "organization_payment_info_pkey";

alter table "public"."organization_contact_info" add constraint "organization_contact_info_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(user_id) ON DELETE CASCADE not valid;

alter table "public"."organization_contact_info" validate constraint "organization_contact_info_organization_id_fkey";

alter table "public"."organization_payment_info" add constraint "organization_payment_info_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(user_id) ON DELETE CASCADE not valid;

alter table "public"."organization_payment_info" validate constraint "organization_payment_info_organization_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_project_area_record record;
BEGIN
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
    -- Insert public organization info
    INSERT INTO public.organizations (
      user_id,
      organization_name,
      country,
      state,
      city,
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
      NEW.raw_user_meta_data->>'country',
      NEW.raw_user_meta_data->>'state',
      NEW.raw_user_meta_data->>'city',
      COALESCE(NEW.raw_user_meta_data->>'mission_statement', ''),
      NEW.raw_user_meta_data->>'website_url',
      NEW.raw_user_meta_data->>'facebook_url',
      NEW.raw_user_meta_data->>'twitter_url',
      NEW.raw_user_meta_data->>'instagram_url',
      NEW.raw_user_meta_data->>'linkedin_url',
      NEW.raw_user_meta_data->>'slug'
    );

  insert into
  public.organization_contact_info (
    organization_id,
    contact_person_name,
    contact_person_email,
    contact_person_phone
  )
values
  (
    NEW.id,
    NEW.raw_user_meta_data ->> 'contact_person_name',
    NEW.raw_user_meta_data ->> 'contact_person_email',
    NEW.raw_user_meta_data ->> 'contact_person_phone'
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
$function$
;

grant delete on table "public"."organization_contact_info" to "anon";

grant insert on table "public"."organization_contact_info" to "anon";

grant references on table "public"."organization_contact_info" to "anon";

grant select on table "public"."organization_contact_info" to "anon";

grant trigger on table "public"."organization_contact_info" to "anon";

grant truncate on table "public"."organization_contact_info" to "anon";

grant update on table "public"."organization_contact_info" to "anon";

grant delete on table "public"."organization_contact_info" to "authenticated";

grant insert on table "public"."organization_contact_info" to "authenticated";

grant references on table "public"."organization_contact_info" to "authenticated";

grant select on table "public"."organization_contact_info" to "authenticated";

grant trigger on table "public"."organization_contact_info" to "authenticated";

grant truncate on table "public"."organization_contact_info" to "authenticated";

grant update on table "public"."organization_contact_info" to "authenticated";

grant delete on table "public"."organization_contact_info" to "service_role";

grant insert on table "public"."organization_contact_info" to "service_role";

grant references on table "public"."organization_contact_info" to "service_role";

grant select on table "public"."organization_contact_info" to "service_role";

grant trigger on table "public"."organization_contact_info" to "service_role";

grant truncate on table "public"."organization_contact_info" to "service_role";

grant update on table "public"."organization_contact_info" to "service_role";

grant delete on table "public"."organization_payment_info" to "anon";

grant insert on table "public"."organization_payment_info" to "anon";

grant references on table "public"."organization_payment_info" to "anon";

grant select on table "public"."organization_payment_info" to "anon";

grant trigger on table "public"."organization_payment_info" to "anon";

grant truncate on table "public"."organization_payment_info" to "anon";

grant update on table "public"."organization_payment_info" to "anon";

grant delete on table "public"."organization_payment_info" to "authenticated";

grant insert on table "public"."organization_payment_info" to "authenticated";

grant references on table "public"."organization_payment_info" to "authenticated";

grant select on table "public"."organization_payment_info" to "authenticated";

grant trigger on table "public"."organization_payment_info" to "authenticated";

grant truncate on table "public"."organization_payment_info" to "authenticated";

grant update on table "public"."organization_payment_info" to "authenticated";

grant delete on table "public"."organization_payment_info" to "service_role";

grant insert on table "public"."organization_payment_info" to "service_role";

grant references on table "public"."organization_payment_info" to "service_role";

grant select on table "public"."organization_payment_info" to "service_role";

grant trigger on table "public"."organization_payment_info" to "service_role";

grant truncate on table "public"."organization_payment_info" to "service_role";

grant update on table "public"."organization_payment_info" to "service_role";


