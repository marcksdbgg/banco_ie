import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

type AlumnoConCuenta = {
    id: string;
    nombre_completo: string;
    fecha_creacion: string;
    tipo?: string;
    cuentas: {
        id: string;
        saldo_actual: number;
    }[];
};

async function getAlumnos() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('perfiles')
        // include `tipo` so the UI can show what kind of cliente it is
        .select(`id, nombre_completo, fecha_creacion, tipo, cuentas(id, saldo_actual)`) 
        .eq('rol', 'cliente')
        .order('nombre_completo', { ascending: true });

    if (error) {
        console.error('Error fetching students:', error);
        return [];
    }

    const typedData = data as AlumnoConCuenta[];
    
    return typedData.map(perfil => {
        const cuentasArr = perfil.cuentas ?? [];
        // pick first cuenta with a non-null id
        const cuentaVal = cuentasArr.find(c => c && c.id) ?? null;
        return {
            id: perfil.id,
            nombre: perfil.nombre_completo,
            fechaCreacion: perfil.fecha_creacion,
            cuentaId: cuentaVal?.id ?? '',
            // ensure numeric conversion (supabase may return numeric as string)
            saldo: Number(cuentaVal?.saldo_actual) || 0,
            tipo: perfil.tipo ?? 'alumno',
        };
    });
}

export default async function ListaAlumnosPage() {
    // CORRECCIÓN: Se debe usar await para el cliente de servidor
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const alumnos = await getAlumnos();
    return <AlumnosClient initialAlumnos={alumnos} />;
}