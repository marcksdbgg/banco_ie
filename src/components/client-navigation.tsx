"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, ShoppingCart, Coffee } from "lucide-react";

export default function ClientNavigation() {
  const router = useRouter();

  async function handleSignOut() {
    // dynamic import to avoid server-side issues
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
              <Link
                href="/dashboard"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/comedor"
                className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                <Coffee className="h-4 w-4" /> Comedor
              </Link>
              <Link
                href="/bazar"
                className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" /> Bazar
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/transferir">
              <Button variant="chiti_bank" size="sm">
                Nueva Transferencia
              </Button>
            </Link>
            <div className="relative">
              <details className="relative">
                <summary className="cursor-pointer text-sm text-gray-700">
                  Mi Cuenta
                </summary>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <Link
                    href="/perfil/configuracion"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" /> Configuración
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
