'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (error || !profile || profile.rol !== 'cliente') {
        router.replace('/auth/login'); 
      } else {
        setIsAuthorized(true);
      }
    };

    checkSession();
  }, [router]);

  if (!isAuthorized) {
    // You can show a loading spinner here while checking the session
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Verificando acceso...</p>
        </div>
    );
  }

  return <>{children}</>;
}
