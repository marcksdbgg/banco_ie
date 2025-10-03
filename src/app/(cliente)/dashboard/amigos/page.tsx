'use client';

import { useState, useEffect, useCallback } from 'react';
import MyQrCodeDialog from '@/components/MyQrCodeDialog';
import QrScannerDialog from '@/components/QrScannerDialog';
import { QrCode, ScanLine, UsersRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserPlus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

type Amistad = {
    id: number;
    estado: 'pendiente' | 'aceptada' | 'bloqueada';
    solicitante: { id: string; nombre_completo: string; };
    receptor: { id: string; nombre_completo: string; };
};

export default function AmigosPage() {
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [amistades, setAmistades] = useState<Amistad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();

    type QueryRow = {
        id: number;
        estado: 'pendiente' | 'aceptada' | 'bloqueada';
        solicitante: { id: string; nombre_completo: string } | Array<{ id: string; nombre_completo: string }> | null;
        receptor: { id: string; nombre_completo: string } | Array<{ id: string; nombre_completo: string }> | null;
    };

    const fetchAmistades = useCallback(async (userId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('amistades')
            .select(`
                id,
                estado,
                solicitante:usuario_solicitante_id ( id, nombre_completo ),
                receptor:usuario_receptor_id ( id, nombre_completo )
            `)
            .or(`usuario_solicitante_id.eq.${userId},usuario_receptor_id.eq.${userId}`)
            .order('fecha_solicitud', { ascending: false });

        if (error) {
            setError('Error al cargar la lista de amigos.');
            console.error(error);
        } else {
            // map arrays to single objects (Supabase can return nested arrays)
            const rows = (data as QueryRow[] || []).map(r => ({
                id: r.id,
                estado: r.estado,
                solicitante: Array.isArray(r.solicitante) ? r.solicitante[0] : (r.solicitante ?? { id: '', nombre_completo: '' }),
                receptor: Array.isArray(r.receptor) ? r.receptor[0] : (r.receptor ?? { id: '', nombre_completo: '' }),
            })) as Amistad[];
            setAmistades(rows);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                await fetchAmistades(user.id);
            }
        };
        init();
    }, [fetchAmistades, supabase]);

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const { data, error } = await supabase.functions.invoke('solicitar-amistad', {
            body: { numero_cuenta_amigo: numeroCuenta },
        });
        
        if (error || data?.error) {
            setError(data?.error || error.message);
        } else {
            setSuccess(data.message);
            setNumeroCuenta('');
            if (user) fetchAmistades(user.id);
        }
        setIsSubmitting(false);
    };
    
    const handleManageRequest = async (amistad_id: number, accion: 'aceptar' | 'rechazar' | 'eliminar') => {
        const { data, error } = await supabase.functions.invoke('gestionar-amistad', {
            body: { amistad_id, accion },
        });

        if (error || data?.error) {
            setError(data?.error || error.message);
        } else {
            setSuccess(data.message);
            if (user) fetchAmistades(user.id);
        }
    };
    
    // MODIFICATION: Improved loading state
    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!user) return <div>No autenticado.</div>

    const amigosAceptados = amistades.filter(a => a.estado === 'aceptada');
    const solicitudesRecibidas = amistades.filter(a => a.estado === 'pendiente' && a.receptor.id === user.id);
    const solicitudesEnviadas = amistades.filter(a => a.estado === 'pendiente' && a.solicitante.id === user.id);

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Mis Amigos</h1>
                    <p className="text-sm text-gray-500 sm:text-base">Administra tus contactos y comienza transferencias en segundos.</p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsQrDialogOpen(true)}>
                    <QrCode className="mr-2 h-4 w-4" /> Mostrar mi QR
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
                <Card className="order-1 lg:order-none">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg sm:text-xl">
                            <UserPlus className="mr-2 h-5 w-5" />Añade un amigo en segundos
                        </CardTitle>
                        <CardDescription>
                            Prioriza el escaneo de códigos para conectarte más rápido. También puedes compartir el tuyo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button
                                className="h-auto justify-start space-x-3 rounded-xl border-2 border-transparent px-5 py-4 text-left text-base font-semibold shadow-sm hover:border-chiti_bank-blue"
                                onClick={() => setIsScannerOpen(true)}
                            >
                                <ScanLine className="h-6 w-6" />
                                <span>Escanear código
                                    <span className="block text-xs font-normal text-white/80 sm:text-sm">Invita a tu amigo y acepta desde su tarjeta digital.</span>
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto justify-start space-x-3 rounded-xl px-5 py-4 text-left text-base font-semibold"
                                onClick={() => setIsQrDialogOpen(true)}
                            >
                                <QrCode className="h-6 w-6" />
                                <span>Compartir mi QR
                                    <span className="block text-xs font-normal text-gray-500 sm:text-sm">Enséñales tu tarjeta virtual y listo.</span>
                                </span>
                            </Button>
                        </div>

                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-5">
                            <p className="text-sm font-semibold text-gray-700">¿Necesitas ingresar el número de cuenta?</p>
                            <p className="mb-4 text-xs text-gray-500 sm:text-sm">Utiliza esta opción solo si tu amigo no tiene su código QR a la mano.</p>
                            <form onSubmit={handleAddFriend} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-grow">
                                    <Label htmlFor="numero-cuenta">Número de cuenta (10 dígitos)</Label>
                                    <Input
                                        id="numero-cuenta"
                                        value={numeroCuenta}
                                        onChange={e => setNumeroCuenta(e.target.value)}
                                        placeholder="1234567890"
                                        inputMode="numeric"
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar solicitud'}
                                </Button>
                            </form>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert variant="default" className="bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-chiti_bank-green" />
                                <AlertTitle>Éxito</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl">Lista de amigos</CardTitle>
                                    <CardDescription>Personas con las que ya puedes transferir.</CardDescription>
                                </div>
                                <span className="rounded-full bg-chiti_bank-blue/10 px-3 py-1 text-sm font-medium text-chiti_bank-blue">
                                    {amigosAceptados.length}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {amigosAceptados.length > 0 ? (
                                <ul className="divide-y border-t">
                                    {amigosAceptados.map(amigo => {
                                        const amigoInfo = amigo.solicitante.id === user.id ? amigo.receptor : amigo.solicitante;
                                        return (
                                            <li key={amigo.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <UsersRound className="hidden h-9 w-9 rounded-full bg-chiti_bank-blue/10 p-2 text-chiti_bank-blue sm:block" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{amigoInfo.nombre_completo}</p>
                                                        <p className="text-xs text-gray-500 sm:text-sm">Contacto activo</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="justify-center border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleManageRequest(amigo.id, 'eliminar')}
                                                >
                                                    Eliminar
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                                    <UsersRound className="h-10 w-10 text-gray-300" />
                                    <p className="text-sm text-gray-500">Aún no tienes amigos conectados. Escanea un código para comenzar.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {solicitudesRecibidas.length > 0 && (
                        <Card>
                            <CardHeader className="pb-0">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Solicitudes recibidas</CardTitle>
                                    <span className="text-sm font-semibold text-gray-500">{solicitudesRecibidas.length}</span>
                                </div>
                                <CardDescription>Confirma quién puede aparecer en tu lista.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {solicitudesRecibidas.map(req => (
                                    <div key={req.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{req.solicitante.nombre_completo}</p>
                                            <p className="text-xs text-gray-500 sm:text-sm">Te envió una invitación</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-chiti_bank-green text-white hover:bg-chiti_bank-green/90"
                                                onClick={() => handleManageRequest(req.id, 'aceptar')}
                                            >
                                                Aceptar
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleManageRequest(req.id, 'rechazar')}>
                                                Rechazar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {solicitudesEnviadas.length > 0 && (
                        <Card>
                            <CardHeader className="pb-0">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Solicitudes enviadas</CardTitle>
                                    <span className="text-sm font-semibold text-gray-500">{solicitudesEnviadas.length}</span>
                                </div>
                                <CardDescription>Esperando confirmación.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                {solicitudesEnviadas.map(req => (
                                    <div key={req.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                        <span className="font-medium text-gray-900">{req.receptor.nombre_completo}</span>
                                        <span className="text-xs uppercase tracking-wide text-gray-400">Pendiente</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <MyQrCodeDialog isOpen={isQrDialogOpen} onClose={() => setIsQrDialogOpen(false)} />
            <QrScannerDialog
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={() => {
                    if (user) fetchAmistades(user.id);
                }}
            />
        </div>
    );
}
