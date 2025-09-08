"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TransferPage() {
    const router = useRouter();
    const supabase = createClient();
    const [numeroCuentaDestino, setNumeroCuentaDestino] = useState('');
    const [monto, setMonto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!numeroCuentaDestino || !monto || parseFloat(monto) <= 0) {
            setError('Por favor, ingrese un número de cuenta y un monto válidos.');
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado.');

            // La cuenta de origen se debe obtener por el `usuario_id` que corresponde al `user.id` del usuario autenticado.
            const { data: cuentaOrigen, error: cuentaOrigenError } = await supabase
                .from('cuentas')
                .select('id')
                .eq('usuario_id', user.id)
                .single();

            if (cuentaOrigenError || !cuentaOrigen) {
                console.error('Error fetching origin account:', cuentaOrigenError);
                throw new Error('No se pudo encontrar tu cuenta de origen. Asegúrate de tener una cuenta asignada.');
            }

            const { data, error: functionError } = await supabase.functions.invoke('realizar-transaccion', {
                body: {
                    tipo: 'transferencia',
                    monto: parseFloat(monto),
                    cuentaOrigenId: cuentaOrigen.id,
                    numeroCuentaDestino: numeroCuentaDestino,
                },
            });

            if (functionError) {
                // The error from the Edge Function is often in the 'message' property of the response
                const errorMessage = functionError.context?.msg ?? functionError.message;
                throw new Error(errorMessage);
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setSuccess('¡Transferencia realizada con éxito!');
            setNumeroCuentaDestino('');
            setMonto('');

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Transferencia</CardTitle>
                    <CardDescription>Envía dinero a otra cuenta de Chitibank.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="numero-cuenta">Número de Cuenta de Destino</Label>
                            <Input
                                id="numero-cuenta"
                                type="text"
                                placeholder="Ej: 1234567890"
                                value={numeroCuentaDestino}
                                onChange={(e) => setNumeroCuentaDestino(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="monto">Monto a Transferir (S/.)</Label>
                            <Input
                                id="monto"
                                type="number"
                                placeholder="Ej: 50.00"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                disabled={loading}
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert variant="default" className="bg-green-100 border-green-400 text-green-700">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Éxito</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                'Realizar Transferencia'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
