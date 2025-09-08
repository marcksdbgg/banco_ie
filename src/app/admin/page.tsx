'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBancochiti_bank } from '@/contexts/banco-chiti_bank-context';
import { formatSoles } from '@/lib/csv-storage';
import { 
  Users, 
  UserPlus, 
  Banknote, 
  TrendingUp,
  ArrowRight,
  DollarSign,
  Download,
  Upload
} from 'lucide-react';

export default function AdminDashboard() {
  const { students, exportToCSV, importFromCSV } = useBancochiti_bank();

  // Calcular estadísticas
  const totalStudents = students.length;
  const totalBalance = students.reduce((sum, student) => sum + student.saldo, 0);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;
  const recentStudents = students.slice(-3).reverse(); // Los 3 más recientes

  const handleImportCSV = async () => {
    try {
      await importFromCSV();
      // Mostrar mensaje de éxito si es necesario
    } catch (error) {
      console.error('Error importing CSV:', error);
      // Mostrar mensaje de error si es necesario
    }
  };

  const statsCards = [
    {
      title: 'Total de Alumnos',
      value: totalStudents.toString(),
      description: 'Estudiantes registrados',
      icon: Users,
      color: 'text-chiti_bank-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saldo Total',
      value: formatSoles(totalBalance),
      description: 'Dinero total en el banco',
      icon: DollarSign,
      color: 'text-chiti_bank-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Saldo Promedio',
      value: formatSoles(averageBalance),
      description: 'Por estudiante',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Control
        </h1>
        <p className="text-gray-600">
          Gestiona el banco escolar y supervisa las cuentas de los estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-chiti_bank-blue transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-chiti_bank-blue">Registrar Nuevo Alumno</CardTitle>
                <CardDescription>
                  Añade un nuevo estudiante al sistema bancario
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="chiti_bank" asChild className="w-full">
              <Link href="/admin/nuevo-alumno">
                Nuevo Alumno
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-chiti_bank-green transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-chiti_bank-green text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-chiti_bank-green">Ver Lista de Alumnos</CardTitle>
                <CardDescription>
                  Consulta y gestiona las cuentas existentes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="chiti_bankGreen" asChild className="w-full">
              <Link href="/admin/lista-alumnos">
                Ver Lista Completa
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSV Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-chiti_bank-blue" />
            <span>Gestión de Datos</span>
          </CardTitle>
          <CardDescription>
            Exporta e importa datos de estudiantes en formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={exportToCSV} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar a CSV
            </Button>
            <Button variant="outline" onClick={handleImportCSV} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Importar desde CSV
            </Button>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Información CSV:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• El archivo CSV se guarda con formato: id,nombre,saldo,fechaCreacion</li>
              <li>• Puedes editar el archivo en Excel y volver a importarlo</li>
              <li>• Los datos se mantienen sincronizados automáticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-chiti_bank-blue" />
            <span>Estudiantes Recientes</span>
          </CardTitle>
          <CardDescription>
            Los últimos alumnos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-chiti_bank-blue text-white p-2 rounded-full">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Registrado: {new Date(student.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-chiti_bank-green">
                      {formatSoles(student.saldo)}
                    </p>
                    <p className="text-xs text-gray-600">Saldo inicial</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/lista-alumnos">
                    Ver todos los alumnos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay estudiantes registrados aún</p>
              <Button variant="chiti_bank" asChild>
                <Link href="/admin/nuevo-alumno">
                  Registrar Primer Alumno
                  <UserPlus className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
