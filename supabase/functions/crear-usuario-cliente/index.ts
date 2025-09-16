// supabase/functions/crear-usuario-cliente/index.ts

/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  // Manejo de la solicitud OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    let { nombre_completo, email, password, saldo_inicial, rol, tipo } = body;

    // --- Verificación de Permisos de Administrador ---
    // Se confía únicamente en el token JWT para determinar si la llamada es de un admin.
    let isAdminCall = false;
    const authHeader = req.headers.get('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      
      if (user) {
        const { data: perfil, error } = await supabaseAdmin
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();
        
        if (perfil && ['personal', 'admin'].includes(perfil.rol)) {
          isAdminCall = true;
        }
      }
    }
    
    console.log(`[crear-usuario-cliente] Is Admin Call: ${isAdminCall}`);

    // --- Lógica de Creación ---
    // Si no es una llamada de admin, se fuerzan los valores por defecto para un registro público.
    if (!isAdminCall) {
      saldo_inicial = 0;
      rol = 'cliente';
      tipo = 'alumno';
    }

    // Normalización de datos
    saldo_inicial = Number(saldo_inicial) || 0;
    rol = rol || 'cliente';
    tipo = tipo || 'alumno';

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirma el email en un entorno educativo cerrado.
      user_metadata: { nombre_completo },
    });
    if (authError) throw authError;
    const user = authData.user;

    // 2. Insertar el perfil del usuario
    const { error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .insert({ id: user.id, nombre_completo, rol, tipo });
    if (perfilError) {
      // Si falla la inserción del perfil, eliminar el usuario de Auth para evitar inconsistencias.
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      throw perfilError;
    }

    // 3. Crear la cuenta bancaria usando la función RPC para garantizar la atomicidad.
    const { data: cuentaData, error: rpcError } = await supabaseAdmin.rpc('create_account_for_user', {
      p_usuario_id: user.id,
      p_saldo: saldo_inicial,
    });
    if (rpcError) throw rpcError;

    const cuenta = Array.isArray(cuentaData) ? cuentaData[0] : cuentaData;
    console.log(`[crear-usuario-cliente] Account created via RPC. ID: ${cuenta.id}, Saldo: ${cuenta.saldo_actual}`);
    
    // 4. Si hay saldo inicial, registrar la transacción de depósito.
    if (saldo_inicial > 0) {
      const { error: transaccionError } = await supabaseAdmin
        .from('transacciones')
        .insert({
          cuenta_destino_id: cuenta.id,
          monto: saldo_inicial,
          tipo: 'deposito',
          descripcion: 'Depósito inicial de cuenta',
        });
      if (transaccionError) throw transaccionError; // En un escenario real, se podría manejar una compensación.
    }

    const responsePayload = {
      message: 'Usuario y cuenta creados exitosamente.',
      userId: user.id,
      cuentaId: cuenta.id,
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('[crear-usuario-cliente] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});