drop view if exists "public"."project_status_view";

alter table "public"."donations" drop column "organization_postal_code";

alter table "public"."donations" drop column "project_slug";

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



