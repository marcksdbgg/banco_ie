'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBancochiti_bank } from '@/contexts/banco-chiti_bank-context';
import { formatSoles, Student } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  ArrowLeft,
  DollarSign,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ListaAlumnosPage() {
  const { students, exportToCSV, importFromCSV, updateStudent, deleteStudent } = useBancochiti_bank();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Pick<Student, 'id' | 'nombre' | 'saldo'>>({
    id: '',
    nombre: '',
    saldo: 0
  });

  const filteredStudents = students.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      id: student.id,
      nombre: student.nombre,
      saldo: student.saldo
    });
    setIsEditing(true);
  };

  const handleUpdateStudent = () => {
    if (editForm.nombre.trim()) {
      updateStudent(editForm.id, {
        nombre: editForm.nombre,
        saldo: Number(editForm.saldo)
      });
      setIsEditing(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleting(true);
  };

  const confirmDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      importFromCSV();
      event.target.value = ''; // Reset input
    }
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
          
          <div className="flex items-center space-x-3">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            
            <Link href="/admin/agregar-alumno">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Alumno
              </Button>
            </Link>
          </div>
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
              <p className="text-xs text-muted-foreground">
                estudiantes registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                en todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSoles(averageBalance)}</div>
              <p className="text-xs text-muted-foreground">
                por estudiante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Estudiantes</CardTitle>
            <CardDescription>
              Encuentra estudiantes por nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Lista completa de estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otro término de búsqueda' 
                    : 'Comienza agregando tu primer estudiante'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/agregar-alumno">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Primer Alumno
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.nombre}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            student.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatSoles(student.saldo)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(student.fechaCreacion).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para Editar Estudiante */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>
                Modifica la información del estudiante seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-saldo" className="text-right">
                  Saldo
                </Label>
                <Input
                  id="edit-saldo"
                  type="number"
                  step="0.01"
                  value={editForm.saldo}
                  onChange={(e) => setEditForm(prev => ({ ...prev, saldo: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStudent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para Confirmar Eliminación */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar al estudiante{' '}
                <strong>{selectedStudent?.nombre}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteStudent}>
                Eliminar Estudiante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
