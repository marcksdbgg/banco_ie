import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatSoles } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Banknote, Clock, DollarSign, Send } from 'lucide-react';

async function getDashboardData(userId: string) {
    const supabase = createClient();

    const { data: cuenta, error: cuentaError } = await supabase
        .from('cuentas')
        .select('*')
        .eq('id_usuario', userId)
        .single();

    if (cuentaError || !cuenta) {
        console.error('Error fetching account data:', cuentaError);
        return { cuenta: null, transacciones: [] };
    }

    const { data: transacciones, error: transaccionesError } = await supabase
        .from('transacciones')
        .select('*')
        .or(`cuenta_origen_id.eq.${cuenta.id},cuenta_destino_id.eq.${cuenta.id}`)
        .order('fecha', { ascending: false })
        .limit(10);

    if (transaccionesError) {
        console.error('Error fetching transactions:', transaccionesError);
    }

    return {
        cuenta,
        transacciones: transacciones || [],
    };
}

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/auth/login');
    }

    const { cuenta, transacciones } = await getDashboardData(user.id);

    if (!cuenta) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">No se encontró una cuenta asociada.</h2>
                <p>Por favor, contacte a un administrador.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Hola, {user.user_metadata.nombre_completo || 'Estudiante'}
                </h1>
                <p className="text-gray-600">
                    Bienvenido a tu portal financiero.
                </p>
            </div>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Saldo Actual</span>
                        <DollarSign className="h-6 w-6" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{formatSoles(cuenta.saldo)}</p>
                    <p className="text-sm opacity-80">Número de cuenta: {cuenta.numero_cuenta}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Send className="h-5 w-5 mr-2 text-blue-500" />
                            Realizar una Transferencia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Envía dinero a otros compañeros de forma rápida y segura.</p>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/transferir">
                                Nueva Transferencia <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Banknote className="h-5 w-5 mr-2 text-green-500" />
                            Ver todos mis movimientos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Consulta el historial completo de tus transacciones.</p>
                        <Button variant="outline" className="w-full">
                            Ver Historial Completo <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        Actividad Reciente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transacciones.length > 0 ? transacciones.map(t => (
                            <div key={t.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold capitalize">{t.tipo}</p>
                                    <p className="text-sm text-gray-500">{new Date(t.fecha).toLocaleString('es-PE')}</p>
                                </div>
                                <p className={`font-bold ${t.monto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatSoles(t.monto)}
                                </p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-4">No hay transacciones recientes.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
