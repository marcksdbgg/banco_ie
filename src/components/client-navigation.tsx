// ...existing code...
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, ShoppingCart, Coffee, Users } from "lucide-react";
import MobileBottomNav from './MobileBottomNav'; // Import our new component

// The original top navigation bar is now its own component
function DesktopNav() {
  const router = useRouter();

  async function handleSignOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold">
              ChitiBank
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900">Dashboard</Link>
              <Link href="/comedor" className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"><Coffee className="h-4 w-4" /> Comedor</Link>
              <Link href="/bazar" className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Bazar</Link>
              <Link href="/dashboard/amigos" className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"><Users className="h-4 w-4" /> Amigos</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/transferir">
              <Button variant="chiti_bank" size="sm">Nueva Transferencia</Button>
            </Link>
            <details className="relative">
              <summary className="cursor-pointer text-sm text-gray-700 list-none">Mi Cuenta</summary>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                <Link href="/perfil/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Settings className="h-4 w-4" /> Configuración</Link>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

// The main component now decides which navigation to show
export default function ClientNavigation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is Tailwind's 'md' breakpoint
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Add event listener for screen resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Conditionally render the correct navigation component
  return isMobile ? <MobileBottomNav /> : <DesktopNav />;
}
// Duplicate code removed — the functional ClientNavigation is defined above.
