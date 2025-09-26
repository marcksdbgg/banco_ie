import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatSoles } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
const DashboardQuickActions = dynamic(() => import('@/components/DashboardQuickActions'));
import Link from "next/link";
import { Banknote, Clock, DollarSign, Send } from "lucide-react";
import Image from "next/image";
import TransactionLine from "@/components/transaction/TransactionLine";

type Cuenta = {
  id: string;
  saldo_actual: number;
  numero_cuenta: string;
  usuario_id?: string;
  [key: string]: unknown;
};

type Transaccion = {
  id: string;
  tipo: string;
  fecha: string;
  monto: number;
  descripcion?: string;
  cuenta_destino_id?: string;
  cuenta_origen_id?: string;
  [key: string]: unknown;
};

async function getDashboardData(
  userId: string,
): Promise<{ cuenta: Cuenta | null; transacciones: Transaccion[] }> {
  // CORRECCIÓN: Se debe usar await para el cliente de servidor
  const supabase = await createClient();

  const { data: cuenta, error: cuentaError } = await supabase
    .from("cuentas")
    .select("*")
    .eq("usuario_id", userId)
    .single();

  if (cuentaError || !cuenta) {
    console.error("Error fetching account data:", cuentaError);
    return { cuenta: null, transacciones: [] };
  }

  const { data: transacciones, error: transaccionesError } = await supabase
    .from("transacciones")
    .select("*")
    .or(`cuenta_origen_id.eq.${cuenta.id},cuenta_destino_id.eq.${cuenta.id}`)
    .order("fecha", { ascending: false })
    .limit(10);

  if (transaccionesError) {
    console.error("Error fetching transactions:", transaccionesError);
  }

  return {
    cuenta: cuenta as Cuenta | null,
    transacciones: (transacciones || []) as Transaccion[],
  };
}

export default async function DashboardPage() {
  // CORRECCIÓN: Se debe usar await para el cliente de servidor
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { cuenta, transacciones } = await getDashboardData(user.id);

  if (!cuenta) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold">
          No se encontró una cuenta asociada.
        </h2>
        <p>Por favor, contacte a un administrador.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Hola, {user.user_metadata.nombre_completo || "Estudiante"}
          </h1>
          <p className="text-gray-600">Bienvenido a tu portal financiero.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link
              href="/dashboard/transferir"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Nueva Transferencia
            </Link>
          </Button>
          <div className="hidden md:flex items-center">
            <DashboardQuickActions />
            <Button variant="outline" className="ml-2">
              <Banknote className="h-4 w-4 mr-2" /> Ver Historial
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-90">Saldo Actual</p>
                  <p className="text-4xl font-extrabold mt-2">
                    {formatSoles(cuenta.saldo_actual)}
                  </p>
                  <p className="text-sm opacity-80 mt-1">
                    Número de cuenta:{" "}
                    <span className="font-medium">{cuenta.numero_cuenta}</span>
                  </p>
                </div>
                <div className="text-right">
                  <DollarSign className="h-12 w-12 opacity-90" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-auto">
                {transacciones.length > 0 ? (
                  <div className="divide-y">
                    {transacciones.map((t: Transaccion) => (
                      <TransactionLine key={t.id} t={t} cuentaId={cuenta.id} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-4 opacity-80">
                      <Image
                        src="/empty-transactions.svg"
                        alt="No transactions"
                        width={96}
                        height={96}
                      />
                    </div>
                    <p className="text-gray-500">
                      No hay transacciones recientes.
                    </p>
                    <p className="text-sm text-gray-400">
                      Realiza una transferencia para ver actividad aquí.
                    </p>
                    <div className="mt-4">
                      <Button asChild>
                        <Link href="/dashboard/transferir">
                          Realizar mi primera transferencia
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard/transferir"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Nueva Transferencia
                </Link>
                <Link href="/dashboard/amigos" className="text-sm text-blue-600 hover:underline">Amigos</Link>
                <Link href="/dashboard/amigos" className="text-sm text-gray-600 hover:underline">Mi Código QR</Link>
                <a className="text-sm text-gray-600">Solicitar Ayuda</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Saldo disponible</p>
                  <p className="font-medium">
                    {formatSoles(cuenta.saldo_actual)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Última actividad</p>
                  <p className="text-sm text-gray-500">
                    {transacciones[0]
                      ? new Date(transacciones[0].fecha).toLocaleDateString(
                          "es-PE",
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
