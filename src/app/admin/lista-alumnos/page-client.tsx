'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatSoles } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  AlertTriangle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isTransaction, setIsTransaction] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
    const [editForm, setEditForm] = useState({ nombre: '' });
    const [transactionForm, setTransactionForm] = useState({ tipo: 'deposito' as 'deposito' | 'retiro', monto: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const filteredAlumnos = alumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStudents = alumnos.length;
    const totalBalance = alumnos.reduce((sum, alumno) => sum + alumno.saldo, 0);
    const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

    const handleEdit = (alumno: Alumno) => {
        setSelectedAlumno(alumno);
        setEditForm({ nombre: alumno.nombre });
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        if (!selectedAlumno || !editForm.nombre.trim()) return;
        setIsSubmitting(true);
        const { error } = await supabase
            .from('perfiles')
            .update({ nombre_completo: editForm.nombre.trim() })
            .eq('id', selectedAlumno.id);
        
        if (!error) {
            setAlumnos(alumnos.map(a => a.id === selectedAlumno.id ? { ...a, nombre: editForm.nombre.trim() } : a));
            setIsEditing(false);
            setSelectedAlumno(null);
        } else {
            console.error("Error updating name:", error);
        }
        setIsSubmitting(false);
    };

    const handleDelete = (alumno: Alumno) => {
        setSelectedAlumno(alumno);
        setIsDeleting(true);
    };

    const confirmDelete = async () => {
        if (!selectedAlumno) return;
        setIsSubmitting(true);
        const { error } = await supabase.auth.admin.deleteUser(selectedAlumno.id);

        if (!error) {
            setAlumnos(alumnos.filter(a => a.id !== selectedAlumno.id));
            setIsDeleting(false);
            setSelectedAlumno(null);
        } else {
            console.error("Error deleting user:", error);
        }
        setIsSubmitting(false);
    };

    const handleTransaction = (alumno: Alumno) => {
        setSelectedAlumno(alumno);
        setTransactionForm({ tipo: 'deposito', monto: '' });
        setIsTransaction(true);
    };

    const confirmTransaction = async () => {
        if (!selectedAlumno || !transactionForm.monto) return;
        
        const monto = parseFloat(transactionForm.monto);
        if (isNaN(monto) || monto <= 0) {
            alert("Por favor, ingrese un monto válido.");
            return;
        }

        if (transactionForm.tipo === 'retiro' && monto > selectedAlumno.saldo) {
            alert("Fondos insuficientes para el retiro.");
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.functions.invoke('realizar-transaccion', {
            body: {
                tipo_operacion: transactionForm.tipo,
                cuenta_origen_id: selectedAlumno.cuentaId,
                monto: monto,
            },
        });

        if (!error) {
            // Actualizar el saldo localmente para reflejar el cambio instantáneamente
            setAlumnos(alumnos.map(a => {
                if (a.id === selectedAlumno.id) {
                    const nuevoSaldo = transactionForm.tipo === 'deposito' ? a.saldo + monto : a.saldo - monto;
                    return { ...a, saldo: nuevoSaldo };
                }
                return a;
            }));
            setIsTransaction(false);
            setSelectedAlumno(null);
        } else {
            console.error("Error en la transacción:", error);
            alert(`Error en la transacción: ${error.message}`);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver al Panel
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lista de Alumnos</h1>
                            <p className="text-gray-600">Gestiona la información de todos los estudiantes</p>
                        </div>
                    </div>
                    <Link href="/admin/nuevo-alumno">
                        <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Agregar Alumno
                        </Button>
                    </Link>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStudents}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Búsqueda y Tabla */}
                <Card>
                    <CardHeader>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
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
                                            <TableCell>
                                                <span className={`font-semibold ${alumno.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatSoles(alumno.saldo)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(alumno.fechaCreacion).toLocaleDateString('es-PE')}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleTransaction(alumno)}>
                                                        <DollarSign className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(alumno)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDelete(alumno)} className="text-red-600 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredAlumnos.length === 0 && (
                            <div className="text-center py-8">
                                <p>No se encontraron alumnos.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog para Editar */}
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Alumno</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Label htmlFor="edit-nombre">Nombre</Label>
                            <Input id="edit-nombre" value={editForm.nombre} onChange={(e) => setEditForm({ nombre: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            <Button onClick={handleUpdate} disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para Eliminar */}
                <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center"><AlertTriangle className="h-5 w-5 text-red-500 mr-2" />Confirmar Eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar a <strong>{selectedAlumno?.nombre}</strong>? Esta acción es irreversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancelar</Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>{isSubmitting ? 'Eliminando...' : 'Eliminar Alumno'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para Transacción */}
                <Dialog open={isTransaction} onOpenChange={setIsTransaction}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Realizar Transacción para {selectedAlumno?.nombre}</DialogTitle>
                            <DialogDescription>Saldo actual: {formatSoles(selectedAlumno?.saldo ?? 0)}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex gap-2">
                                <Button 
                                    variant={transactionForm.tipo === 'deposito' ? 'default' : 'outline'} 
                                    onClick={() => setTransactionForm(prev => ({...prev, tipo: 'deposito'}))}
                                    className="flex-1"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" /> Depósito
                                </Button>
                                <Button 
                                    variant={transactionForm.tipo === 'retiro' ? 'default' : 'outline'} 
                                    onClick={() => setTransactionForm(prev => ({...prev, tipo: 'retiro'}))}
                                    className="flex-1"
                                >
                                    <MinusCircle className="h-4 w-4 mr-2" /> Retiro
                                </Button>
                            </div>
                            <div>
                                <Label htmlFor="monto">Monto (S/)</Label>
                                <Input 
                                    id="monto" 
                                    type="number" 
                                    placeholder="0.00"
                                    value={transactionForm.monto}
                                    onChange={(e) => setTransactionForm(prev => ({...prev, monto: e.target.value}))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTransaction(false)}>Cancelar</Button>
                            <Button onClick={confirmTransaction} disabled={isSubmitting}>{isSubmitting ? 'Procesando...' : 'Confirmar Transacción'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
