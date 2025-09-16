-- Migration: create sequence and create_account_for_user function
-- Creates a sequence for numero_cuenta and a helper RPC to create accounts atomically

-- 1) create sequence if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'numero_cuenta_seq') THEN
    CREATE SEQUENCE public.numero_cuenta_seq START 1000000000;
  END IF;
END$$;

-- 2) ensure sequence start is beyond any existing numero_cuenta values (if any)
DO $$
DECLARE
  max_num bigint;
BEGIN
  BEGIN
    SELECT MAX(CASE WHEN trim(numero_cuenta) ~ '^\d+$' THEN numero_cuenta::bigint ELSE NULL END) INTO max_num FROM public.cuentas;
  EXCEPTION WHEN undefined_table THEN
    max_num := NULL;
  END;
  IF max_num IS NOT NULL THEN
    PERFORM setval('public.numero_cuenta_seq', GREATEST(nextval('public.numero_cuenta_seq'), max_num + 1), false);
  END IF;
END$$;

-- 3) helper to generate numero_cuenta as zero-padded 10 digits
CREATE OR REPLACE FUNCTION public.generate_numero_cuenta()
RETURNS text LANGUAGE sql AS $$
  SELECT lpad(nextval('public.numero_cuenta_seq')::text, 10, '0');
$$;

-- 4) atomic creation function for cuentas
CREATE OR REPLACE FUNCTION public.create_account_for_user(p_usuario_id uuid, p_saldo numeric)
RETURNS public.cuentas AS $$
DECLARE
  v_num text;
  v_row public.cuentas%ROWTYPE;
BEGIN
  v_num := lpad(nextval('public.numero_cuenta_seq')::text, 10, '0');
  INSERT INTO public.cuentas (usuario_id, numero_cuenta, saldo_actual)
  VALUES (p_usuario_id, v_num, coalesce(p_saldo, 0))
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$ LANGUAGE plpgsql;

-- Note: Run this migration in your Supabase (psql) or include in your migration tooling.
