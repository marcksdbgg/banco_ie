// src/app/admin/lista-alumnos/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

async function getClientes() {
    const supabase = await createClient();

    // CORRECCIÓN: Se cambia el filtro .in() por .eq() para ser más preciso y robusto.
    // Esto asegura que se obtengan todos los perfiles con el rol de 'cliente'.
    const { data, error } = await supabase
        .from('perfiles')
        .select(`
            id,
            nombre_completo,
            fecha_creacion,
            tipo,
            cuentas (
                id,
                saldo_actual
            )
        `)
        .eq('rol', 'cliente') // Filtro corregido y simplificado.
        .order('nombre_completo', { ascending: true });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    // Mapeo seguro de los datos para pasarlos al componente cliente.
    // Esto previene errores si un perfil no tiene una cuenta asociada.
    return data.map(perfil => {
        const cuenta = perfil.cuentas?.[0] ?? null;
        return {
            id: perfil.id,
            nombre: perfil.nombre_completo,
            fechaCreacion: perfil.fecha_creacion,
            tipo: perfil.tipo ?? 'alumno',
            cuentaId: cuenta?.id ?? '',
            saldo: cuenta?.saldo_actual ?? 0,
        };
    });
}

export default async function ListaAlumnosPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }

    const clientes = await getClientes();
    return <AlumnosClient initialAlumnos={clientes} />;
}