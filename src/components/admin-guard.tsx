'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile, error } = await client
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (error || !profile || profile.rol !== 'admin') {
        router.replace('/auth/login');
      } else {
        setIsAuthorized(true);
      }
    };

    checkSession();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verificando acceso de administrador...</p>
      </div>
    );
  }

  return <>{children}</>;
}
