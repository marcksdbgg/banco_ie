import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientNavigation from "@/components/client-navigation";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();
  if (!perfil || perfil.rol !== "cliente") redirect("/auth/login");

  return (
    <>
      <ClientNavigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </>
  );
}
