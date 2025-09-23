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

    const { amistad_id, accion } = await req.json(); // accion: 'aceptar', 'rechazar', 'eliminar'
    if (!amistad_id || !accion) throw new Error("Parámetros 'amistad_id' y 'accion' son requeridos.");

    // Fetch the friendship record
    const { data: amistad, error: fetchError } = await supabase
      .from('amistades')
      .select('*')
      .eq('id', amistad_id)
      .single();

    if (fetchError || !amistad) throw new Error("Solicitud de amistad no encontrada.");

    let responseMessage = '';

    if (accion === 'aceptar') {
      if (amistad.usuario_receptor_id !== user.id) throw new Error("No autorizado para aceptar esta solicitud.");
      const { error } = await supabase.from('amistades').update({ estado: 'aceptada', fecha_actualizacion: new Date().toISOString() }).eq('id', amistad_id);
      if (error) throw error;
      responseMessage = 'Amistad aceptada.';
    } else if (accion === 'rechazar' || accion === 'eliminar') {
      // Authorize: either the requester or receiver can delete/reject
      if (amistad.usuario_receptor_id !== user.id && amistad.usuario_solicitante_id !== user.id) throw new Error("No autorizado para esta acción.");
      const { error } = await supabase.from('amistades').delete().eq('id', amistad_id);
      if (error) throw error;
      responseMessage = accion === 'rechazar' ? 'Solicitud rechazada.' : 'Amigo eliminado.';
    } else {
      throw new Error("Acción no válida.");
    }

    return new Response(JSON.stringify({ message: responseMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});