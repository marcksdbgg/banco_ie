-- Migration: Create base schema for Neon (replaces Supabase auth.users + base tables)
-- Run this FIRST in a fresh Neon database.

-- 1. usuarios: replaces Supabase auth.users
CREATE TABLE IF NOT EXISTS public.usuarios (
    id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    email         TEXT        UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);

-- 2. perfiles: user profile data
CREATE TABLE IF NOT EXISTS public.perfiles (
    id               UUID  PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nombre_completo  TEXT  NOT NULL,
    rol              TEXT  NOT NULL DEFAULT 'cliente',
    tipo             TEXT  NOT NULL DEFAULT 'alumno',
    CONSTRAINT rol_valido  CHECK (rol  IN ('cliente', 'admin')),
    CONSTRAINT tipo_valido CHECK (tipo IN ('alumno', 'padre', 'personal'))
);

-- 3. cuentas: bank accounts
CREATE TABLE IF NOT EXISTS public.cuentas (
    id             UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id     UUID           NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    numero_cuenta  TEXT           UNIQUE NOT NULL,
    saldo_actual   NUMERIC(15, 2) NOT NULL DEFAULT 0,
    fecha_apertura TIMESTAMPTZ    DEFAULT timezone('utc', now())
);

-- 4. transacciones: transaction history
CREATE TABLE IF NOT EXISTS public.transacciones (
    id                UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
    cuenta_origen_id  UUID           REFERENCES public.cuentas(id),
    cuenta_destino_id UUID           REFERENCES public.cuentas(id),
    monto             NUMERIC(15, 2) NOT NULL,
    tipo              TEXT           NOT NULL,
    descripcion       TEXT,
    fecha             TIMESTAMPTZ    DEFAULT timezone('utc', now())
);

-- 5. Sequence and helper for numero_cuenta
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'numero_cuenta_seq') THEN
    CREATE SEQUENCE public.numero_cuenta_seq START 1000000000;
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.generate_numero_cuenta()
RETURNS text LANGUAGE sql AS $$
  SELECT lpad(nextval('public.numero_cuenta_seq')::text, 10, '0');
$$;

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

-- 6. realizar_transferencia: atomic transfer between accounts
CREATE OR REPLACE FUNCTION public.realizar_transferencia(
  p_cuenta_origen_id   uuid,
  p_numero_cuenta_dest text,
  p_monto              numeric
)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_cuenta_dest_id uuid;
  v_saldo_origen   numeric;
BEGIN
  IF p_monto <= 0 THEN
    RAISE EXCEPTION 'El monto debe ser mayor a cero.';
  END IF;

  SELECT id INTO v_cuenta_dest_id
  FROM public.cuentas
  WHERE numero_cuenta = p_numero_cuenta_dest
  LIMIT 1;

  IF v_cuenta_dest_id IS NULL THEN
    RAISE EXCEPTION 'Cuenta destino no encontrada.';
  END IF;

  IF v_cuenta_dest_id = p_cuenta_origen_id THEN
    RAISE EXCEPTION 'No puedes transferir a tu propia cuenta.';
  END IF;

  SELECT saldo_actual INTO v_saldo_origen
  FROM public.cuentas
  WHERE id = p_cuenta_origen_id
  FOR UPDATE;

  IF v_saldo_origen < p_monto THEN
    RAISE EXCEPTION 'Saldo insuficiente.';
  END IF;

  UPDATE public.cuentas SET saldo_actual = saldo_actual - p_monto WHERE id = p_cuenta_origen_id;
  UPDATE public.cuentas SET saldo_actual = saldo_actual + p_monto WHERE id = v_cuenta_dest_id;

  INSERT INTO public.transacciones (cuenta_origen_id, cuenta_destino_id, monto, tipo, descripcion)
  VALUES (p_cuenta_origen_id, v_cuenta_dest_id, p_monto, 'transferencia', 'Transferencia entre cuentas');
END;
$$;
