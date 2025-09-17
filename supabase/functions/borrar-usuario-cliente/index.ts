// supabase/functions/borrar-usuario-cliente/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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

    // 1. Verificar que el que llama es un administrador
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    
    if (!user) {
      throw new Error('Authentication failed');
    }
    
    const { data: adminProfile } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (!adminProfile || !['admin', 'personal'].includes(adminProfile.rol)) {
      throw new Error('Forbidden: User does not have admin privileges.');
    }

    // 2. Obtener el userId a eliminar del cuerpo de la solicitud
    const { userId } = await req.json();
    if (!userId) {
      throw new Error('userId is required in the request body.');
    }

    // 3. Realizar la eliminación en orden para respetar las claves foráneas
    
    // Primero, obtener el ID de la cuenta asociada al perfil
    const { data: cuenta } = await supabaseAdmin
      .from('cuentas')
      .select('id')
      .eq('usuario_id', userId)
      .single();

    if (cuenta) {
      // Eliminar transacciones relacionadas a esa cuenta
      await supabaseAdmin
        .from('transacciones')
        .delete()
        .or(`cuenta_origen_id.eq.${cuenta.id},cuenta_destino_id.eq.${cuenta.id}`);
      
      // Eliminar la cuenta
      await supabaseAdmin.from('cuentas').delete().eq('usuario_id', userId);
    }
    
    // Eliminar el perfil
    await supabaseAdmin.from('perfiles').delete().eq('id', userId);
    
    // Finalmente, eliminar el usuario de Supabase Auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteUserError) {
        throw deleteUserError;
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error deleting user:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});