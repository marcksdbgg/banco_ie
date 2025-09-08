
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      req.headers.get('X-Supabase-Url') ?? '',
      req.headers.get('X-Supabase-Anon-Key') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        });
    }


    const {
        cuenta_origen_id,
        cuenta_destino_id,
        monto,
        tipo_operacion
    } = await req.json();

    const { data, error } = await supabaseClient.rpc('realizar_movimiento', {
        p_cuenta_origen_id: cuenta_origen_id,
        p_cuenta_destino_id: cuenta_destino_id,
        p_monto: monto,
        p_tipo_operacion: tipo_operacion,
        p_usuario_autenticado_id: user.id
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
