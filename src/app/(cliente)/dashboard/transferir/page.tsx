"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2, ScanLine, Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import FriendSelector from '@/components/FriendSelector';
import QrScannerDialog from '@/components/QrScannerDialog';
import type { FriendInfo } from '@/lib/hooks/useFriends';

export default function TransferPage() {
    const router = useRouter();
    const [numeroCuentaDestino, setNumeroCuentaDestino] = useState('');
    const [monto, setMonto] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedFriendName, setSelectedFriendName] = useState<string | null>(null);
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const searchParams = useSearchParams();

    // Effect to pre-fill from URL for "Easy Transfer" link
    useEffect(() => {
        const destinatarioDesdeUrl = searchParams.get('destinatario');
        if (destinatarioDesdeUrl) {
            setNumeroCuentaDestino(destinatarioDesdeUrl);
            setSelectedFriendId(null);
            setSelectedFriendName(null);
        }
    }, [searchParams]);

    const handleFriendSelect = (friend: FriendInfo) => {
        if (!friend.numero_cuenta) return;
        setNumeroCuentaDestino(friend.numero_cuenta);
        setSelectedFriendName(friend.nombre_completo);
        setSelectedFriendId(friend.id);
    };

    const handleScannerAccount = (account: string) => {
        const normalized = account.trim();
        setNumeroCuentaDestino(normalized);
        setSelectedFriendName(null);
        setSelectedFriendId(null);
    };

    const clearSelection = () => {
        setSelectedFriendId(null);
        setSelectedFriendName(null);
        setNumeroCuentaDestino('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!numeroCuentaDestino || !monto || parseFloat(monto) <= 0) {
            setError('Por favor, ingrese un número de cuenta y un monto válidos.');
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createClient();
            
            const { data, error: functionError } = await supabase.functions.invoke('iniciar-transferencia-cliente', {
                body: {
                    numero_cuenta_destino: numeroCuentaDestino,
                    monto: parseFloat(monto),
                },
            });

            if (functionError) {
                const errorMessage = functionError.context?.msg ?? functionError.message;
                throw new Error(errorMessage);
            }
            
            if (data?.error) {
                throw new Error(data.error);
            }

            setSuccess('¡Transferencia realizada con éxito!');
            setNumeroCuentaDestino('');
            setMonto('');
            setSelectedFriendName(null);
            setSelectedFriendId(null);

            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 2000);

        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8 px-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Nueva Transferencia</h1>
                    <p className="text-sm text-gray-500 sm:text-base">
                        Envía dinero a otra cuenta de ChitiBank en pasos sencillos.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    className="justify-center text-chiti_bank-blue hover:bg-chiti_bank-blue/10 sm:w-auto"
                    onClick={() => setIsScannerOpen(true)}
                >
                    <ScanLine className="mr-2 h-4 w-4" /> Escanear QR
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                <Card className="order-2 lg:order-1">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Selecciona o agrega destinatario</CardTitle>
                        <CardDescription>
                            Elige a un amigo existente o escanea su código. También puedes ingresar una cuenta manualmente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FriendSelector
                            onSelect={handleFriendSelect}
                            disabled={isSubmitting}
                            selectedFriendId={selectedFriendId}
                        />

                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-4 text-sm text-gray-600">
                            <p className="font-semibold text-gray-700">¿No encuentras a tu amigo?</p>
                            <p>Escanea su QR o ingresa el número de cuenta manualmente debajo.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full sm:w-auto"
                                onClick={() => setIsScannerOpen(true)}
                                disabled={isSubmitting}
                            >
                                <ScanLine className="mr-2 h-4 w-4" /> Abrir escáner
                            </Button>
                        </div>

                        {selectedFriendId && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={clearSelection}
                                disabled={isSubmitting}
                            >
                                Limpiar selección
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card className="order-1 lg:order-2">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Detalles de la transferencia</CardTitle>
                        <CardDescription>Confirma la cuenta destino y el monto antes de enviar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                                        <Wallet className="h-5 w-5 text-chiti_bank-blue" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Enviar a</p>
                                        {selectedFriendName ? (
                                            <div className="space-y-0.5">
                                                <p className="text-sm text-gray-600">{selectedFriendName}</p>
                                                {numeroCuentaDestino && (
                                                    <p className="text-xs text-gray-500">Cuenta • {numeroCuentaDestino}</p>
                                                )}
                                            </div>
                                        ) : numeroCuentaDestino ? (
                                            <p className="text-sm text-gray-600">Cuenta detectada • {numeroCuentaDestino}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">Selecciona un amigo o escribe el número de cuenta.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="numero-cuenta">Número de cuenta destino</Label>
                                <Input
                                    id="numero-cuenta"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Ej: 1234567890"
                                    value={numeroCuentaDestino}
                                    onChange={(e) => {
                                        setNumeroCuentaDestino(e.target.value);
                                        setSelectedFriendName(null);
                                        setSelectedFriendId(null);
                                    }}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monto">Monto a transferir (S/.)</Label>
                                <Input
                                    id="monto"
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="Ej: 50.00"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    disabled={isSubmitting}
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
                                <Alert variant="default" className="border-green-400 bg-green-100 text-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertTitle>Éxito</AlertTitle>
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Realizar transferencia'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <QrScannerDialog
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                mode="transfer"
                onAccountDetected={handleScannerAccount}
                transferSuccessMessage="Número de cuenta listo. Revisa los datos y envía."
            />
        </div>
    );
}