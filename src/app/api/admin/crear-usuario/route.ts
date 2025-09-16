import { NextResponse } from 'next/server'
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    // Validar que el caller está autenticado y tiene rol admin/personal
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: perfil } = await supabase.from('perfiles').select('rol').eq('id', user.id).maybeSingle();
    if (!perfil || !['personal', 'admin'].includes(perfil.rol)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    type CreateUserBody = {
      nombre_completo: string;
      email: string;
      password: string;
      saldo_inicial?: number;
      rol?: string;
      tipo?: string;
    };

    const body = (await req.json()) as CreateUserBody;
    const adminSecret = process.env.ADMIN_CREATE_SECRET || '';

    // Call Edge Function with service secret header
    const edgeUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '') + '/functions/v1/crear-usuario-cliente';
    const resp = await fetch(edgeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret
      },
      body: JSON.stringify(body)
    });
    const json = await resp.json();
    return NextResponse.json(json, { status: resp.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
