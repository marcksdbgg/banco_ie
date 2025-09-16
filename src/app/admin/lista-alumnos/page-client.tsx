'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatSoles } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Search, DollarSign, Edit, Trash2, AlertTriangle, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Alumno = {
    id: string;
    nombre: string;
    fechaCreacion: string;
    cuentaId: string;
    saldo: number;
};

type AlumnosClientProps = {
    initialAlumnos: Alumno[];
};

export default function AlumnosClient({ initialAlumnos }: AlumnosClientProps) {
    const [alumnos, setAlumnos] = useState(initialAlumnos);
    useEffect(() => {
        setAlumnos(initialAlumnos);
    }, [initialAlumnos]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
    const [modal, setModal] = useState<'edit' | 'delete' | 'transaction' | null>(null);
    const [editForm, setEditForm] = useState({ nombre: '' });
    const [transactionForm, setTransactionForm] = useState({ tipo: 'deposito' as 'deposito' | 'retiro', monto: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleUpdate = async () => {
        if (!selectedAlumno || !editForm.nombre.trim()) return;
        setIsSubmitting(true);
        const supabase = createClient();
        const { error } = await supabase.from('perfiles').update({ nombre_completo: editForm.nombre.trim() }).eq('id', selectedAlumno.id);
        if (!error) {
            router.refresh();
            setModal(null);
        } else {
            setError(error.message);
        }
        setIsSubmitting(false);
    };

    const confirmDelete = async () => {
        if (!selectedAlumno) return;
        setIsSubmitting(true);
        const supabase = createClient();
        const { error } = await supabase.functions.invoke('borrar-usuario-cliente', { body: { userId: selectedAlumno.id } });
        if (!error) {
            router.refresh();
            setModal(null);
        } else {
            setError(error.message);
        }
        setIsSubmitting(false);
    };

    const confirmTransaction = async () => {
        if (!selectedAlumno || !transactionForm.monto) return;
        const monto = parseFloat(transactionForm.monto);
        if (isNaN(monto) || monto <= 0) {
            setError("Monto inválido."); return;
        }
        setIsSubmitting(true);
        const supabase = createClient();
        interface InvokeResultWithData { error?: { message: string }; data?: { nuevoSaldo?: number } }
        interface InvokeResultDirect { message?: string; nuevoSaldo?: number }
        const invokeRespRaw = await supabase.functions.invoke('gestionar-fondos', {
            body: { tipo: transactionForm.tipo, cuenta_id: selectedAlumno.cuentaId, monto },
        });
        const invokeResp = invokeRespRaw as InvokeResultWithData | InvokeResultDirect;
        const error = (invokeResp as InvokeResultWithData).error;
        const data = (invokeResp as InvokeResultWithData).data ?? (invokeResp as InvokeResultDirect);
        if (!error) {
            // If the function returns the new balance, update local state for immediate UI feedback
            function hasNuevoSaldo(obj: unknown): obj is { nuevoSaldo?: number } {
                return typeof obj === 'object' && obj !== null && 'nuevoSaldo' in obj;
            }
            const nuevoSaldo = hasNuevoSaldo(data) ? data.nuevoSaldo : undefined;
            if (nuevoSaldo !== null && nuevoSaldo !== undefined) {
                setAlumnos(prev => prev.map(a => a.id === selectedAlumno.id ? { ...a, saldo: Number(nuevoSaldo) } : a));
            } else {
                // fallback: refresh server data
                try { router.refresh(); } catch {};
            }
            setModal(null);
        } else {
            setError(error.message);
        }
        setIsSubmitting(false);
    };

    const filteredAlumnos = alumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (type: 'edit' | 'delete' | 'transaction', alumno: Alumno) => {
        setSelectedAlumno(alumno);
        if (type === 'edit') setEditForm({ nombre: alumno.nombre });
        if (type === 'transaction') setTransactionForm({ tipo: 'deposito', monto: '' });
        setError('');
        setModal(type);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Búsqueda de Alumnos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Estudiantes ({filteredAlumnos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Saldo</TableHead>
                                <TableHead>Fecha de Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlumnos.map((alumno) => (
                                <TableRow key={alumno.id}>
                                    <TableCell className="font-medium">{alumno.nombre}</TableCell>
                                    <TableCell>{formatSoles(alumno.saldo)}</TableCell>
                                    <TableCell>{new Date(alumno.fechaCreacion).toLocaleDateString('es-PE')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openModal('transaction', alumno)}><DollarSign className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={() => openModal('edit', alumno)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => openModal('delete', alumno)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Dialog open={!!modal} onOpenChange={(isOpen) => !isOpen && setModal(null)}>
                <DialogContent>
                    {modal === 'edit' && <>
                        <DialogHeader><DialogTitle>Editar Alumno</DialogTitle></DialogHeader>
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <Label htmlFor="edit-nombre">Nombre</Label>
                        <Input id="edit-nombre" value={editForm.nombre} onChange={(e) => setEditForm({ nombre: e.target.value })} />
                        <DialogFooter><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={handleUpdate} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar</Button></DialogFooter>
                    </>}
                    {modal === 'delete' && <>
                        <DialogHeader><DialogTitle className="flex items-center"><AlertTriangle className="text-red-500 mr-2" />Confirmar Eliminación</DialogTitle></DialogHeader>
                        <DialogDescription>¿Seguro que deseas eliminar a <strong>{selectedAlumno?.nombre}</strong>? Esta acción no se puede deshacer.</DialogDescription>
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <DialogFooter><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Eliminar</Button></DialogFooter>
                    </>}
                    {modal === 'transaction' && <>
                        <DialogHeader><DialogTitle>Operación para {selectedAlumno?.nombre}</DialogTitle><DialogDescription>Saldo actual: {formatSoles(selectedAlumno?.saldo ?? 0)}</DialogDescription></DialogHeader>
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <div className="flex gap-2"><Button variant={transactionForm.tipo === 'deposito' ? 'default' : 'outline'} onClick={() => setTransactionForm(prev => ({ ...prev, tipo: 'deposito' }))} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" />Depósito</Button><Button variant={transactionForm.tipo === 'retiro' ? 'default' : 'outline'} onClick={() => setTransactionForm(prev => ({ ...prev, tipo: 'retiro' }))} className="flex-1"><MinusCircle className="mr-2 h-4 w-4" />Retiro</Button></div>
                        <div><Label htmlFor="monto">Monto (S/)</Label><Input id="monto" type="number" placeholder="0.00" value={transactionForm.monto} onChange={(e) => setTransactionForm(prev => ({ ...prev, monto: e.target.value }))} /></div>
                        <DialogFooter><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={confirmTransaction} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirmar</Button></DialogFooter>
                    </>}
                </DialogContent>
            </Dialog>
        </div>
    );
}