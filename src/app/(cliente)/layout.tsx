import { createClient as createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: perfil } = await supabase.from('perfiles').select('rol').eq('id', user.id).maybeSingle();
  if (!perfil || perfil.rol !== 'cliente') redirect('/auth/login');

  return <>{children}</>;
}
