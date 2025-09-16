-- Migration: add 'tipo' column to perfiles and update role/tipo constraints
-- Adds a 'tipo' column to distinguish client types (alumno, padre, personal)

ALTER TABLE IF EXISTS public.perfiles
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'alumno';

-- Ensure the rol constraint includes system roles: cliente, personal, admin
ALTER TABLE IF EXISTS public.perfiles
  DROP CONSTRAINT IF EXISTS rol_valido;
ALTER TABLE IF EXISTS public.perfiles
  ADD CONSTRAINT rol_valido CHECK (rol IN ('cliente', 'personal', 'admin'));

-- Add a constraint for tipo values used by the UI: alumno, padre, personal
ALTER TABLE IF EXISTS public.perfiles
  DROP CONSTRAINT IF EXISTS tipo_valido;
ALTER TABLE IF EXISTS public.perfiles
  ADD CONSTRAINT tipo_valido CHECK (tipo IN ('alumno', 'padre', 'personal'));

-- Backfill existing rows: if tipo is NULL or empty set to 'alumno'
UPDATE public.perfiles SET tipo = 'alumno' WHERE tipo IS NULL OR tipo = '';
