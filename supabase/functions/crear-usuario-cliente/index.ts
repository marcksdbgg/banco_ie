/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Función para generar un número de cuenta único de 10 dígitos
function generarNumeroCuenta() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { nombre_completo, email, password, saldo_inicial } = await req.json();

    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { nombre_completo: nombre_completo }
    });
    if (authError) throw authError;
    const user = authData.user;
    if (!user) throw new Error("La creación del usuario en Auth falló.");

    // 2. Crear perfil
    const { error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .insert({ id: user.id, nombre_completo: nombre_completo, rol: 'cliente' });
    if (perfilError) throw perfilError;

    // 3. Crear cuenta bancaria
    const numero_cuenta = generarNumeroCuenta();
    const { data: cuentaData, error: cuentaError } = await supabaseAdmin
      .from('cuentas')
      .insert({ usuario_id: user.id, saldo_actual: saldo_inicial, numero_cuenta: numero_cuenta })
      .select('id')
      .single();
    if (cuentaError || !cuentaData) throw cuentaError || new Error("Fallo al crear la cuenta bancaria.");

    // 4. Registrar depósito inicial si es mayor a cero
    if (saldo_inicial > 0) {
      const { error: transaccionError } = await supabaseAdmin
        .from('transacciones')
        .insert({
          cuenta_destino_id: cuentaData.id,
          monto: saldo_inicial,
          tipo: 'deposito',
          descripcion: 'Depósito inicial de cuenta'
        });
      if (transaccionError) throw transaccionError;
    }

    return new Response(JSON.stringify({ userId: user.id, message: "Usuario y cuenta creados exitosamente." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error: any) {
    console.error("Error en Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});