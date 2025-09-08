/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { numero_cuenta_destino, monto } = await req.json();

    // Obtener la cuenta de origen del usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado.");
    
    const { data: cuentaOrigen, error: cuentaError } = await supabase
      .from('cuentas')
      .select('id')
      .eq('usuario_id', user.id)
      .single();
    if (cuentaError || !cuentaOrigen) throw new Error("Cuenta de origen no encontrada.");

    // Llamar a la función RPC de la base de datos
    const { error: rpcError } = await supabase.rpc('realizar_transferencia', {
      cuenta_origen_id_param: cuentaOrigen.id,
      numero_cuenta_destino_param: numero_cuenta_destino,
      monto_param: monto,
    });
    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ message: 'Transferencia iniciada con éxito.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});