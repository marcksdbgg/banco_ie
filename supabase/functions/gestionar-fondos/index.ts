/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // TODO: Implementar verificación de que quien llama es un admin

    const { tipo, cuenta_id, monto } = await req.json();
    if (monto <= 0) throw new Error("El monto debe ser positivo.");

    const { data: cuenta, error: cuentaError } = await supabaseAdmin
      .from('cuentas')
      .select('saldo_actual')
      .eq('id', cuenta_id)
      .single();
    if (cuentaError) throw new Error("Cuenta no encontrada.");

    let nuevoSaldo;
    if (tipo === 'deposito') {
      nuevoSaldo = cuenta.saldo_actual + monto;
    } else if (tipo === 'retiro') {
      if (cuenta.saldo_actual < monto) throw new Error("Saldo insuficiente.");
      nuevoSaldo = cuenta.saldo_actual - monto;
    } else {
      throw new Error("Tipo de operación no válido.");
    }

    // Actualizar saldo
    const { error: updateError } = await supabaseAdmin
      .from('cuentas')
      .update({ saldo_actual: nuevoSaldo })
      .eq('id', cuenta_id);
    if (updateError) throw updateError;
    
    // Registrar transacción
    const { error: transaccionError } = await supabaseAdmin
      .from('transacciones')
      .insert({
        cuenta_destino_id: tipo === 'deposito' ? cuenta_id : null,
        cuenta_origen_id: tipo === 'retiro' ? cuenta_id : null,
        monto: monto,
        tipo: tipo,
        descripcion: `Operación de admin: ${tipo}`
      });
    if (transaccionError) throw transaccionError;

    return new Response(JSON.stringify({ message: "Operación exitosa", nuevoSaldo }), {
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