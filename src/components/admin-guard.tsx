'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBancoMunay } from '@/contexts/banco-munay-context';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { auth, loading } = useBancoMunay();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!auth.isLoggedIn || !auth.isAdmin)) {
      router.push('/auth/login');
    }
  }, [auth, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-munay-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!auth.isLoggedIn || !auth.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
