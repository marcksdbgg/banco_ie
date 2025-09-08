import { createClient } from '@/lib/supabase/server';
import { formatSoles } from '@/lib/utils';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

async function getAlumnos() {
    const supabase = createClient();

    // Define a type for the data returned from Supabase
    type PerfilConCuenta = {
        id: string;
        nombre_completo: string;
        fecha_creacion: string;
        cuentas: {
            id: string;
            saldo: number;
        }[];
    };

    const { data, error } = await supabase
        .from('perfiles')
        .select(`
            id,
            nombre_completo,
            fecha_creacion,
            cuentas (
                id,
                saldo
            )
        `)
        .eq('rol', 'cliente')
        .order('nombre_completo', { ascending: true });

    if (error) {
        console.error('Error fetching students:', error);
        return [];
    }

    // Cast the data to our defined type
    const typedData = data as PerfilConCuenta[];

    return typedData.map(perfil => ({
        id: perfil.id,
        nombre: perfil.nombre_completo,
        fechaCreacion: perfil.fecha_creacion,
        cuentaId: perfil.cuentas[0]?.id ?? null,
        saldo: perfil.cuentas[0]?.saldo ?? 0,
    }));
}

export default async function ListaAlumnosPage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/auth/login');
    }

    const alumnos = await getAlumnos();

    return <AlumnosClient initialAlumnos={alumnos} />;
}
