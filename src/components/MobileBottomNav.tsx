"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ArrowRightLeft, Users, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Inicio' },
    { href: '/dashboard/transferir', icon: ArrowRightLeft, label: 'Transferir' },
    { href: '/dashboard/amigos', icon: Users, label: 'Amigos' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-1 w-full h-full text-sm transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
        {/* Menu/More Dropdown */}
        <details className="relative flex flex-col items-center justify-center w-full h-full group">
          <summary className="flex flex-col items-center justify-center gap-1 w-full h-full text-sm text-gray-500 cursor-pointer list-none">
            <Menu className="h-6 w-6" />
            <span className="text-xs">Más</span>
          </summary>
          <div className="absolute bottom-full mb-2 w-48 bg-white border rounded-md shadow-lg z-20 hidden group-open:block">
            <Link href="/bazar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bazar</Link>
            <Link href="/comedor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Comedor</Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        </details>
      </div>
    </nav>
  );
}
