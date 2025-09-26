create policy "Users can update their own organization"
on "public"."organizations"
as permissive
for update
to public
using ((user_id = auth.uid()));



