/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Autenticación requerida.");

    const { numero_cuenta_amigo } = await req.json();
    if (!numero_cuenta_amigo) throw new Error("El número de cuenta es requerido.");

    // Find the recipient's profile by account number
    const { data: cuentaDestino, error: cuentaError } = await supabase
      .from('cuentas')
      .select('usuario_id, perfiles ( nombre_completo )')
      .eq('numero_cuenta', numero_cuenta_amigo)
      .single();

    if (cuentaError || !cuentaDestino) throw new Error("El número de cuenta no fue encontrado.");
    const receptorId = cuentaDestino.usuario_id;
    const receptorNombre = cuentaDestino.perfiles.nombre_completo;

    // Insert friendship request
    const { error: insertError } = await supabase
      .from('amistades')
      .insert({
        usuario_solicitante_id: user.id,
        usuario_receptor_id: receptorId,
        estado: 'pendiente'
      });

    if (insertError) {
        // Handle unique constraint violation gracefully
        if (insertError.code === '23505') {
            throw new Error("Ya existe una solicitud de amistad con este usuario.");
        }
        throw insertError;
    }
    
    // Create a notification for the recipient
    await supabase.from('notificaciones').insert({
        usuario_id: receptorId,
        tipo: 'solicitud_amistad',
        mensaje: `Has recibido una solicitud de amistad de ${user.user_metadata.nombre_completo}.`,
        enlace: '/dashboard/amigos'
    });

    return new Response(JSON.stringify({ message: `Solicitud enviada a ${receptorNombre}.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});