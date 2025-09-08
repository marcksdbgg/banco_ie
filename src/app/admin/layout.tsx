export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import AdminGuard from '@/components/admin-guard';
import { AdminNavigation } from '@/components/admin-navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavigation />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
