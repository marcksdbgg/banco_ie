import { NextResponse } from 'next/server'
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Diagnostic logging (mask sensitive parts)
    try {
      const incomingAuth = req.headers.get('authorization');
      const hasAuth = !!incomingAuth;
      let masked = '';
      if (hasAuth) {
        const token = incomingAuth?.split(' ')[1] || '';
        masked = token ? `${token.slice(0, 6)}...${token.slice(-6)}` : '';
      }
      console.log('[admin/crear-usuario] incoming Authorization present:', hasAuth, 'masked:', masked, 'server-user-present:', !!user);
    } catch (logErr) {
      // ignore logging errors
    }

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

    // Prepare headers to call Edge Function. Forward Authorization if present.
    const edgeUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '') + '/functions/v1/crear-usuario-cliente';
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const incomingAuth = req.headers.get('authorization');
    if (incomingAuth) {
      forwardHeaders['Authorization'] = incomingAuth;
    }
    if (adminSecret) {
      forwardHeaders['x-admin-secret'] = adminSecret;
    }

    const resp = await fetch(edgeUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(body)
    });
    const json = await resp.json();
    return NextResponse.json(json, { status: resp.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
