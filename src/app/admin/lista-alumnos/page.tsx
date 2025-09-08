import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

// Tipamos la data que esperamos
type AlumnoConCuenta = {
    id: string;
    nombre_completo: string;
    fecha_creacion: string;
    cuentas: {
        id: string;
        saldo_actual: number;
    }[];
};

async function getAlumnos() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('perfiles')
        .select(`id, nombre_completo, fecha_creacion, cuentas(id, saldo_actual)`)
        .eq('rol', 'cliente')
        .order('nombre_completo', { ascending: true });

    if (error) {
        console.error('Error fetching students:', error);
        return [];
    }

    const typedData = data as AlumnoConCuenta[];
    
    return typedData.map(perfil => ({
        id: perfil.id,
        nombre: perfil.nombre_completo,
        fechaCreacion: perfil.fecha_creacion,
        cuentaId: perfil.cuentas[0]?.id ?? '', // Asumimos una cuenta por perfil
        saldo: perfil.cuentas[0]?.saldo_actual ?? 0,
    }));
}

export default async function ListaAlumnosPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const alumnos = await getAlumnos();
    return <AlumnosClient initialAlumnos={alumnos} />;
}