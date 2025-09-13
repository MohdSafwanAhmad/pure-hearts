alter table "public"."organizations" add column "slug" text not null;

CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);

alter table "public"."organizations" add constraint "organizations_slug_key" UNIQUE using index "organizations_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
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
      COALESCE(NEW.raw_user_meta_data->'project_areas', '[]'::jsonb),
      NEW.raw_user_meta_data->>'website_url',
      NEW.raw_user_meta_data->>'facebook_url',
      NEW.raw_user_meta_data->>'twitter_url',
      NEW.raw_user_meta_data->>'instagram_url',
      NEW.raw_user_meta_data->>'linkedin_url',
      NEW.raw_user_meta_data->>'slug'
    );
  END IF;
  
  RETURN NEW;
END;$function$
;


