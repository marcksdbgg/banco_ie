'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserPlus, Loader2, AlertCircle, CheckCircle, X, Check } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

type Amistad = {
    id: number;
    estado: 'pendiente' | 'aceptada';
    solicitante: { id: string; nombre_completo: string; };
    receptor: { id: string; nombre_completo: string; };
};

export default function AmigosPage() {
    const [user, setUser] = useState<User | null>(null);
    const [amistades, setAmistades] = useState<Amistad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();

    const fetchAmistades = async (userId: string) => {
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
            // Fix: map arrays to single objects
            const amistades = (data as any[] || []).map(a => ({
                id: a.id,
                estado: a.estado,
                solicitante: Array.isArray(a.solicitante) ? a.solicitante[0] : a.solicitante,
                receptor: Array.isArray(a.receptor) ? a.receptor[0] : a.receptor,
            }));
            setAmistades(amistades);
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                fetchAmistades(user.id);
            }
        };
        init();
    }, []);

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
    
    if (loading) return <div>Cargando...</div>;
    if (!user) return <div>No autenticado.</div>

    const amigosAceptados = amistades.filter(a => a.estado === 'aceptada');
    const solicitudesRecibidas = amistades.filter(a => a.estado === 'pendiente' && a.receptor.id === user.id);
    const solicitudesEnviadas = amistades.filter(a => a.estado === 'pendiente' && a.solicitante.id === user.id);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Mis Amigos</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><UserPlus className="mr-2" />Añadir Amigo</CardTitle>
                    <CardDescription>Ingresa el número de cuenta de 10 dígitos de tu amigo para enviarle una solicitud.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddFriend} className="flex items-end gap-4">
                        <div className="flex-grow">
                            <Label htmlFor="numero-cuenta">Número de Cuenta</Label>
                            <Input id="numero-cuenta" value={numeroCuenta} onChange={e => setNumeroCuenta(e.target.value)} placeholder="1234567890" required />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enviar Solicitud'}
                        </Button>
                    </form>
                    {error && <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                    {success && <Alert variant="default" className="mt-4 bg-green-50 border-green-200"><CheckCircle className="h-4 w-4" /><AlertTitle>Éxito</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>}
                </CardContent>
            </Card>

            {solicitudesRecibidas.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Solicitudes de Amistad Recibidas</CardTitle></CardHeader>
                    <CardContent>
                        {solicitudesRecibidas.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-2 border-b">
                                <span>{req.solicitante.nombre_completo}</span>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="outline" className="text-green-600" onClick={() => handleManageRequest(req.id, 'aceptar')}><Check /></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleManageRequest(req.id, 'rechazar')}><X /></Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>Lista de Amigos ({amigosAceptados.length})</CardTitle></CardHeader>
                <CardContent>
                    {amigosAceptados.length > 0 ? (
                        amigosAceptados.map(amigo => {
                            const amigoInfo = amigo.solicitante.id === user.id ? amigo.receptor : amigo.solicitante;
                            return (
                                <div key={amigo.id} className="flex items-center justify-between p-2 border-b">
                                    <span>{amigoInfo.nombre_completo}</span>
                                    <Button size="sm" variant="destructive" onClick={() => handleManageRequest(amigo.id, 'eliminar')}>Eliminar</Button>
                                </div>
                            );
                        })
                    ) : <p className="text-gray-500">Aún no tienes amigos. ¡Añade uno!</p>}
                </CardContent>
            </Card>

            {solicitudesEnviadas.length > 0 && (
                 <Card>
                    <CardHeader><CardTitle>Solicitudes Enviadas Pendientes</CardTitle></CardHeader>
                    <CardContent>
                        {solicitudesEnviadas.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-2 border-b">
                                <span>{req.receptor.nombre_completo}</span>
                                <span className="text-sm text-gray-500">Pendiente</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
