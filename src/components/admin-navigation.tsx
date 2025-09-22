"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, LogOut, Settings } from "lucide-react"; // Cambiado Landmark por Settings
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    const links = [
        {
            href: "/admin",
            label: "Dashboard",
            icon: Home,
        },
        {
            href: "/admin/lista-alumnos",
            label: "Clientes",
            icon: Users,
        },
        {
            href: "/admin/configuracion",
            label: "Configuración",
            icon: Settings,
        },
    ];

    return (
        <aside className="w-64 flex-shrink-0" aria-label="Sidebar">
            <div className="px-3 py-4 overflow-y-auto rounded bg-gray-800 h-full flex flex-col min-h-screen">
                <Link
                    href="/admin"
                    className="flex items-center pl-2.5 mb-5"
                >
                    <Image
                        src="/chitibank-logo.jpeg"
                        width={32}
                        height={32}
                        className="h-8 w-8 mr-3 rounded-md"
                        alt="ChitiBank Logo"
                    />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                        ChitiBank
                    </span>
                </Link>
                <nav className="space-y-2 flex-grow">
                    {links.map((link) => (
                        <Link
                            key={link.href} // CORRECCIÓN: Añadida la prop key
                            href={link.href}
                            className={`flex items-center p-2 text-sm font-medium rounded-lg transition-colors group ${
                                pathname.startsWith(link.href) && (link.href !== "/admin" || pathname === "/admin")
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="pt-4 mt-4 border-t border-gray-700">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-left text-gray-300 hover:bg-red-600 hover:text-white"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </aside>
    );
}