/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { nombre_completo, email, password, saldo_inicial } = await req.json();

    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // O false si no requieres confirmación
    });

    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error("User creation failed in Auth");

    // 2. Insertar en la tabla 'perfiles'
    const { error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .insert({
        id: user.id,
        nombre_completo: nombre_completo,
        rol: 'cliente'
      });

    if (perfilError) throw perfilError;

    // 3. Insertar en la tabla 'cuentas'
    const { error: cuentaError } = await supabaseAdmin
      .from('cuentas')
      .insert({
        id_usuario: user.id,
        saldo: saldo_inicial
      });

    if (cuentaError) throw cuentaError;

    return new Response(JSON.stringify({ userId: user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
