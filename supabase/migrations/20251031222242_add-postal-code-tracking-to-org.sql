alter table "public"."donations"
add column "organization_postal_code" text;

alter table "public"."organizations"
add column "postal_code" text not null;

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $function$
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
      organization_phone,
      country,
      state,
      city,
      address,
      postal_code,
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
      NEW.raw_user_meta_data->>'postal_code',
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
$function$;