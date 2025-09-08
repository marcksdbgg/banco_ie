import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default async function ConfiguracionPage() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/login");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Panel de Configuración
                    </CardTitle>
                    <CardDescription>
                        Esta sección está en construcción. Aquí podrás gestionar la configuración general del banco escolar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Próximamente...</p>
                </CardContent>
            </Card>
        </div>
    );
}