"use client";

import { useEffect, useState } from 'react';
import AlumnosClient from './page-client';
import { createClient } from '@/lib/supabase/client';

type Alumno = {
  id: string;
  nombre: string;
  fechaCreacion: string;
  cuentaId: string;
  saldo: number;
};

export default function ListaAlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function fetchAlumnos() {
      const { data, error } = await supabase
        .from('perfiles')
        .select(`
          id,
          nombre_completo,
          fecha_creacion,
          cuentas ( id, saldo_actual )
        `)
        .eq('rol', 'cliente')
        .order('nombre_completo', { ascending: true });

      if (error) {
        console.error('Error fetching students:', error);
        if (mounted) setAlumnos([]);
        return;
      }

          type PerfilConCuenta = {
            id: string;
            nombre_completo: string;
            fecha_creacion: string;
            cuentas?: { id: string; saldo_actual: number }[];
          };

          const typed = (data ?? []) as PerfilConCuenta[];
          const mapped = typed.map((perfil) => ({
            id: perfil.id,
            nombre: perfil.nombre_completo,
            fechaCreacion: perfil.fecha_creacion,
            cuentaId: perfil.cuentas?.[0]?.id ?? '',
            saldo: perfil.cuentas?.[0]?.saldo_actual ?? 0,
          }));

      if (mounted) setAlumnos(mapped);
    }

    fetchAlumnos().finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Cargando estudiantes...</div>;

  return <AlumnosClient initialAlumnos={alumnos} />;
}
