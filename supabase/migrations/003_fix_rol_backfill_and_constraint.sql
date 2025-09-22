-- Migration 003: Backfill incorrect rol values and add strict rol constraint
-- Purpose: fix existing rows where rol was incorrectly set to 'personal' and enforce rol constraint ('cliente','admin')

BEGIN;

-- 1) Backfill: Convert incorrect 'personal' role values to 'cliente'.
--    We assume rows with rol='personal' are actually clients whose tipo='personal'.
UPDATE public.perfiles
SET rol = 'cliente'
WHERE rol = 'personal';

-- 2) Ensure there are no other unexpected rol values (sanity check)
--    If there are rows still not in ('cliente','admin'), this migration will fail and rollback.
--    This prevents adding the constraint when data would violate it.
DO $$
DECLARE
    bad_count INT;
BEGIN
    SELECT COUNT(*) INTO bad_count FROM public.perfiles WHERE rol NOT IN ('cliente','admin');
    IF bad_count > 0 THEN
        RAISE EXCEPTION 'Found % rows with invalid rol values; aborting migration to avoid constraint violation', bad_count;
    END IF;
END$$;

-- 3) Apply the strict constraint for rol
ALTER TABLE IF EXISTS public.perfiles
  DROP CONSTRAINT IF EXISTS rol_valido;

ALTER TABLE IF EXISTS public.perfiles
  ADD CONSTRAINT rol_valido CHECK (rol IN ('cliente', 'admin'));

COMMIT;
