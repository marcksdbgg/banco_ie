// src/app/admin/lista-alumnos/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

async function getClientes() {
    const supabase = await createClient();

    // 1. Obtener todos los perfiles de clientes
    const { data: perfiles, error: perfilesError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('rol', 'cliente');

    if (perfilesError) {
        console.error('Error fetching profiles:', perfilesError);
        return [];
    }
    
    // 2. Obtener todas las cuentas
    const { data: cuentas, error: cuentasError } = await supabase
        .from('cuentas')
        .select('*');

    if (cuentasError) {
        console.error('Error fetching accounts:', cuentasError);
        return [];
    }

    // 3. Crear un mapa para un acceso rápido a las cuentas por usuario_id
    const cuentasMap = new Map(cuentas.map(c => [c.usuario_id, c]));

    // 4. Combinar los datos de perfiles y cuentas
    const clientesConSaldo = perfiles.map(perfil => {
        const cuenta = cuentasMap.get(perfil.id);
        return {
            id: perfil.id,
            nombre: perfil.nombre_completo,
            fechaCreacion: perfil.fecha_creacion,
            tipo: perfil.tipo ?? 'alumno',
            cuentaId: cuenta?.id ?? '',
            saldo: cuenta?.saldo_actual ?? 0,
        };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente

    return clientesConSaldo;
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