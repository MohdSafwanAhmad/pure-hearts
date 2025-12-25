/**
 * @file add_projects_search_vector.sql
 * @description
 * Adds Full-Text Search support to the projects table using
 * a stored tsvector column and a GIN index.
 *
 * Searchable fields:
 * - title
 * - description
 */

-- 1️. Add the search_vector column
ALTER TABLE public.projects
ADD COLUMN search_vector tsvector;

-- 2️. Populate search_vector for existing rows
UPDATE public.projects
SET search_vector =
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' || coalesce(description, '')
  );

-- 3️. Create a function to keep search_vector updated
CREATE OR REPLACE FUNCTION public.projects_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector(
      'english',
      coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4️. Create trigger to auto-update search_vector on insert/update
CREATE TRIGGER projects_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description
ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.projects_search_vector_update();

-- 5️. Create GIN index for fast full-text search
CREATE INDEX projects_search_vector_gin
ON public.projects
USING GIN (search_vector);
