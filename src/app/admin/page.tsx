import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { formatSoles } from '@/lib/utils';
import { 
  Users, 
  UserPlus, 
  Banknote, 
  TrendingUp,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { redirect } from 'next/navigation';

async function getStats(supabase: any) {
    const { data: profiles, error: profilesError } = await supabase
        .from('perfiles')
        .select('id', { count: 'exact' })
        .eq('rol', 'cliente');

    if (profilesError) {
        console.error('Error fetching profiles count:', profilesError);
        return { totalStudents: 0, totalBalance: 0 };
    }

    const { data: totalBalanceData, error: balanceError } = await supabase
        .from('cuentas')
        .select('saldo');

    if (balanceError) {
        console.error('Error fetching total balance:', balanceError);
        return { totalStudents: profiles.length, totalBalance: 0 };
    }

    const totalBalance = totalBalanceData.reduce((sum: number, account: { saldo: number }) => sum + account.saldo, 0);
    
    return {
        totalStudents: profiles.length,
        totalBalance,
    };
}

async function getRecentStudents(supabase: any) {
    const { data, error } = await supabase
        .from('perfiles')
        .select(`
            id,
            nombre_completo,
            fecha_creacion,
            cuentas (
                saldo
            )
        `)
        .eq('rol', 'cliente')
        .order('fecha_creacion', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching recent students:', error);
        return [];
    }

    return data.map((profile: any) => ({
        id: profile.id,
        nombre: profile.nombre_completo,
        fechaCreacion: profile.fecha_creacion,
        saldo: profile.cuentas[0]?.saldo ?? 0,
    }));
}


export default async function AdminDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const { totalStudents, totalBalance } = await getStats(supabase);
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;
  const recentStudents = await getRecentStudents(supabase);

  const statsCards = [
    {
      title: 'Total de Alumnos',
      value: totalStudents.toString(),
      description: 'Estudiantes registrados',
      icon: Users,
      color: 'text-munay-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saldo Total',
      value: formatSoles(totalBalance),
      description: 'Dinero total en el banco',
      icon: DollarSign,
      color: 'text-munay-green',
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
        <Card className="border-2 hover:border-munay-blue transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-blue text-white p-2 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-blue">Registrar Nuevo Alumno</CardTitle>
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

        <Card className="border-2 hover:border-munay-green transition-colors">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-munay-green text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-munay-green">Ver Lista de Alumnos</CardTitle>
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

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-munay-blue" />
            <span>Estudiantes Recientes</span>
          </CardTitle>
          <CardDescription>
            Los últimos alumnos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student: any) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-munay-blue text-white p-2 rounded-full">
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
                    <p className="font-bold text-munay-green">
                      {formatSoles(student.saldo)}
                    </p>
                    <p className="text-xs text-gray-600">Saldo actual</p>
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
