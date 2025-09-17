// src/app/admin/page.tsx

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { formatSoles } from '@/lib/utils';
import { Users, UserPlus, Banknote, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { redirect } from 'next/navigation';

async function getStats() {
    const supabase = await createClient();

    const { count, error: countError } = await supabase
      .from('perfiles')
      .select('*', { count: 'exact', head: true })
      .eq('rol', 'cliente');

    if (countError) console.error("Error fetching students count:", countError);

    const { data: accounts, error: balanceError } = await supabase.from('cuentas').select('saldo_actual');
    if (balanceError) console.error("Error fetching balances:", balanceError);
    
    const totalBalance = accounts?.reduce((acc, curr) => acc + (Number(curr.saldo_actual) || 0), 0) ?? 0;
    
    return {
        totalStudents: count ?? 0,
        totalBalance: totalBalance,
    };
}

async function getRecentStudents() {
    const supabase = await createClient();

    // 1. Obtener los perfiles de clientes más recientes
    const { data: perfiles, error: perfilesError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('rol', 'cliente')
        .order('fecha_creacion', { ascending: false })
        .limit(3);

    if (perfilesError) {
        console.error("Error fetching recent students:", perfilesError);
        return [];
    }

    // 2. Obtener las cuentas de esos perfiles
    const userIds = perfiles.map(p => p.id);
    const { data: cuentas, error: cuentasError } = await supabase
        .from('cuentas')
        .select('*')
        .in('usuario_id', userIds);

    if (cuentasError) {
        console.error("Error fetching accounts for recent students:", cuentasError);
        // Devolver perfiles sin saldo si las cuentas fallan
        return perfiles.map(p => ({ id: p.id, nombre: p.nombre_completo, fechaCreacion: p.fecha_creacion, saldo: 0 }));
    }

    const cuentasMap = new Map(cuentas.map(c => [c.usuario_id, c]));

    // 3. Combinar los datos
    return perfiles.map(perfil => {
        const cuenta = cuentasMap.get(perfil.id);
        return {
            id: perfil.id,
            nombre: perfil.nombre_completo,
            fechaCreacion: perfil.fecha_creacion,
            saldo: cuenta?.saldo_actual ?? 0,
        };
    });
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { totalStudents, totalBalance } = await getStats();
  const recentStudents = await getRecentStudents();
  const averageBalance = totalStudents > 0 ? totalBalance / totalStudents : 0;

  const statsCards = [
    { title: 'Total de Alumnos', value: totalStudents.toString(), icon: Users, color: 'text-chiti_bank-blue', bgColor: 'bg-blue-50' },
    { title: 'Saldo Total', value: formatSoles(totalBalance), icon: DollarSign, color: 'text-chiti_bank-green', bgColor: 'bg-green-50' },
    { title: 'Saldo Promedio', value: formatSoles(averageBalance), icon: TrendingUp, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Supervisa las cuentas y la actividad del banco escolar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><UserPlus className="h-6 w-6 mr-3 text-chiti_bank-blue" />Registrar Alumno</CardTitle>
            <CardDescription>Añade un nuevo estudiante al sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/nuevo-alumno">Nuevo Alumno <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="h-6 w-6 mr-3 text-chiti_bank-green" />Gestionar Alumnos</CardTitle>
            <CardDescription>Consulta, edita y realiza operaciones en las cuentas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/admin/lista-alumnos">Ver Lista Completa <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Banknote className="h-5 w-5 mr-2" />Estudiantes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{student.nombre}</p>
                    <p className="text-sm text-gray-500">Registrado: {new Date(student.fechaCreacion).toLocaleDateString('es-PE', { timeZone: 'UTC' })}</p>
                  </div>
                  <p className="font-bold text-chiti_bank-green">{formatSoles(student.saldo)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No hay estudiantes registrados aún.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}