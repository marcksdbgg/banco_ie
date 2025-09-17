// src/app/admin/lista-alumnos/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AlumnosClient from './page-client';

type ClienteConCuenta = {
    id: string;
    nombre_completo: string;
    fecha_creacion: string;
    tipo: string | null;
    cuentas: {
        id: string;
        saldo_actual: number;
    }[];
};

async function getClientes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('perfiles')
        .select(`id, nombre_completo, fecha_creacion, tipo, cuentas(id, saldo_actual)`)
        .in('rol', ['cliente', 'personal']) // Incluimos 'personal' si también se gestionan aquí
        .order('nombre_completo', { ascending: true });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

        // defensively handle null/undefined data
        const typedData = (data ?? []) as ClienteConCuenta[];

        try {
            return typedData.map(perfil => {
        const cuentasArr = perfil.cuentas ?? [];
        const cuentaVal = cuentasArr.find(c => c && c.id) ?? null;
        return {
            id: perfil.id,
            nombre: perfil.nombre_completo,
            fechaCreacion: perfil.fecha_creacion,
            tipo: perfil.tipo ?? 'alumno',
            cuentaId: cuentaVal?.id ?? '',
            saldo: Number(cuentaVal?.saldo_actual) || 0,
        };
            });
        } catch (mapError) {
            console.error('Error mapping clients data:', mapError, { rawData: data });
            return [];
        }
}

export default async function ListaAlumnosPage() {
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) redirect('/auth/login');

            const clientes = await getClientes();
            return <AlumnosClient initialAlumnos={clientes} />;
        } catch (pageError) {
            // Log full error on server for debugging (will appear in logs)
            console.error('ListaAlumnosPage render error:', pageError);
            // Rethrow so Next can render error page, but we logged details.
            throw pageError;
        }
}