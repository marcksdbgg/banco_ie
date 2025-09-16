/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './_shared/cors.ts';

// Función para generar un número de cuenta único de 10 dígitos
function generarNumeroCuenta() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
  let { nombre_completo, email, password, saldo_inicial, rol, tipo } = body as any;

  // Seguridad: determinar si el caller es admin.
    // 1) Si se proporciona x-admin-secret y coincide con ADMIN_CREATE_SECRET, es admin.
    const providedAdminSecret = req.headers.get('x-admin-secret') || '';
    const adminSecret = Deno.env.get('ADMIN_CREATE_SECRET') || '';
    let isAdminCall = adminSecret && providedAdminSecret && providedAdminSecret === adminSecret;

    // 2) Si se proporcionó Authorization Bearer <token>, validar token consultando /auth/v1/user
    // y comprobar en la tabla `perfiles` que el rol del usuario es admin/personal.
    if (!isAdminCall) {
      const authHeader = req.headers.get('authorization') || '';
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const authUrl = (Deno.env.get('SUPABASE_URL') || '').replace(/\/$/, '') + '/auth/v1/user';
          const userResp = await fetch(authUrl, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
          if (userResp.ok) {
            const userJson = await userResp.json();
            const userId = userJson?.id;
            if (userId) {
              // verificar rol en perfiles
              const { data: perfilData, error: perfilErr } = await supabaseAdmin.from('perfiles').select('rol').eq('id', userId).maybeSingle();
              if (!perfilErr && perfilData && ['personal', 'admin'].includes(perfilData.rol)) {
                isAdminCall = true;
              }
            }
          }
        } catch (e) {
          // ignore and treat as non-admin
        }
      }
    }

    // Logging diagnóstico mínimo (enmascarar secret/token)
    try {
      const providedAdminSecretLog = providedAdminSecret ? 'present' : 'absent';
      const authHeaderLog = req.headers.get('authorization') ? 'present' : 'absent';
      console.log('[crear-usuario-cliente] adminSecret(env):', !!adminSecret, 'providedAdminSecret:', providedAdminSecretLog, 'authHeader:', authHeaderLog, 'isAdminCall(initial):', isAdminCall);
    } catch (lErr) {
      // ignore
    }

    // Si no es llamada admin, forzamos saldo a 0 y rol a 'cliente'
    if (!isAdminCall) {
      saldo_inicial = 0;
      rol = 'cliente';
      tipo = 'alumno';
    }

    // Normalizar campos
    saldo_inicial = typeof saldo_inicial === 'number' ? saldo_inicial : parseFloat(saldo_inicial || '0') || 0;
    rol = rol || 'cliente';

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

    // 2. Crear perfil (usar rol y tipo decididos)
    const perfilInsert: any = { id: user.id, nombre_completo: nombre_completo, rol: rol };
    if (tipo) perfilInsert.tipo = tipo;
    else perfilInsert.tipo = 'alumno';

    const { error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .insert(perfilInsert);
    if (perfilError) throw perfilError;

    // 3. Crear cuenta bancaria: preferir la función SQL atómica `create_account_for_user`
    let cuentaData: any = null;
    try {
      const rpcResp = await supabaseAdmin.rpc('create_account_for_user', { p_usuario_id: user.id, p_saldo: saldo_inicial });
      if (rpcResp.error) throw rpcResp.error;
      // Normalizar la forma de retorno del RPC: puede venir como array o fila directa
      if (Array.isArray(rpcResp.data)) cuentaData = rpcResp.data[0];
      else cuentaData = rpcResp.data;
      console.log('[crear-usuario-cliente] rpc create_account_for_user result:', { cuentaId: cuentaData?.id, numero_cuenta: cuentaData?.numero_cuenta, saldo: cuentaData?.saldo_actual });
    } catch (rpcErr) {
      // Si la función RPC no existe o falla, hacemos fallback a inserción con reintentos
      let cuentaError: any = null;
      const maxAttempts = 5;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const numero_cuenta = generarNumeroCuenta();
        const resp = await supabaseAdmin
          .from('cuentas')
          .insert({ usuario_id: user.id, saldo_actual: saldo_inicial, numero_cuenta: numero_cuenta })
          .select('id')
          .single();
        cuentaData = resp.data;
        cuentaError = resp.error;
        if (!cuentaError && cuentaData) break;
        if (cuentaError && attempt === maxAttempts - 1) {
          throw cuentaError;
        }
      }
    }

    // 4. Registrar depósito inicial si es mayor a cero
    let nuevoSaldo = cuentaData?.saldo_actual ?? saldo_inicial;
    if (saldo_inicial > 0) {
      try {
        const { data: transData, error: transaccionError } = await supabaseAdmin
          .from('transacciones')
          .insert({
            cuenta_destino_id: cuentaData.id,
            monto: saldo_inicial,
            tipo: 'deposito',
            descripcion: 'Depósito inicial de cuenta'
          })
          .select('id')
          .single();
        if (transaccionError) throw transaccionError;
        console.log('[crear-usuario-cliente] transaccion insertada, id:', transData?.id);
      } catch (txErr) {
        console.error('[crear-usuario-cliente] error al insertar transaccion inicial:', txErr);
        throw txErr;
      }
    }

    // Asegurar que devolvemos información útil para el caller
    const responsePayload = {
      userId: user.id,
      cuentaId: cuentaData?.id,
      numero_cuenta: cuentaData?.numero_cuenta,
      saldo_inicial: saldo_inicial,
      message: 'Usuario y cuenta creados exitosamente.'
    };
    console.log('[crear-usuario-cliente] success response:', responsePayload);
    return new Response(JSON.stringify(responsePayload), {
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