-- Adds soft delete column to projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS deleted_at timestamptz NULL;

-- Optional but highly recommended for query performance
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at
  ON public.projects (deleted_at);

-- Update RLS policies (if any) so that "deleted" projects are hidden
-- Example: assuming you have RLS enabled on projects table
-- You can modify the select policy to exclude deleted rows:
--
-- ALTER POLICY "Allow public read for verified orgs"
-- ON public.projects
-- USING (deleted_at IS NULL);
