"use client";

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type FriendInfo = { id: string; nombre_completo: string; numero_cuenta?: string };

export default function useFriends() {
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchFriends = useCallback(async () => {
    setLoading(true);
    // create client inside function to avoid unstable closure deps
    const supabase = createClient();
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) {
        setFriends([]);
        return;
      }

      const { data: rows, error } = await supabase
        .from('amistades')
        .select(`
          id,
          estado,
          solicitante:usuario_solicitante_id ( id, nombre_completo, cuentas ( numero_cuenta ) ),
          receptor:usuario_receptor_id ( id, nombre_completo, cuentas ( numero_cuenta ) )
        `)
        .or(`usuario_solicitante_id.eq.${userId},usuario_receptor_id.eq.${userId}`)
        .eq('estado', 'aceptada');

      if (error) throw error;
      const rowsArr = Array.isArray(rows) ? rows : [];
      const list: FriendInfo[] = [];
      const idsMissingNumero: string[] = [];

      for (const r of rowsArr) {
        const row = r as Record<string, unknown>;
        const solicitanteRaw = row.solicitante;
        const receptorRaw = row.receptor;
        const solicitanteObj = Array.isArray(solicitanteRaw)
          ? (solicitanteRaw as unknown[])[0] as Record<string, unknown>
          : (solicitanteRaw as Record<string, unknown> | undefined);
        const receptorObj = Array.isArray(receptorRaw)
          ? (receptorRaw as unknown[])[0] as Record<string, unknown>
          : (receptorRaw as Record<string, unknown> | undefined);

        const friendObj = (solicitanteObj && String(solicitanteObj.id) === userId) ? receptorObj : solicitanteObj;
        const id = friendObj && friendObj.id ? String(friendObj.id) : '';
        const nombre = friendObj && friendObj.nombre_completo ? String(friendObj.nombre_completo) : '';

        // try to read numero_cuenta from nested 'cuentas' relation
        let numero = '';
        const cuentasRaw = friendObj?.cuentas;
        const cuentasArr = Array.isArray(cuentasRaw) ? cuentasRaw as unknown[] : undefined;
        if (cuentasArr && cuentasArr.length > 0) {
          const c0 = cuentasArr[0] as Record<string, unknown>;
          if (typeof c0?.numero_cuenta !== 'undefined') numero = String(c0.numero_cuenta);
        }

        if (!numero && id) idsMissingNumero.push(id);

        list.push({ id, nombre_completo: nombre, numero_cuenta: numero });
      }

      // If some friends lack numero_cuenta, fetch them in a single query
      if (idsMissingNumero.length > 0) {
        try {
          const { data: cuentasData, error: cuentasErr } = await supabase
            .from('cuentas')
            .select('usuario_id, numero_cuenta')
            .in('usuario_id', idsMissingNumero);

          if (!cuentasErr && Array.isArray(cuentasData)) {
            const mapByUser: Record<string, string> = {};
            for (const c of cuentasData as unknown[]) {
              const cr = c as Record<string, unknown>;
              const uid = cr.usuario_id ? String(cr.usuario_id) : '';
              const num = typeof cr.numero_cuenta !== 'undefined' ? String(cr.numero_cuenta) : '';
              if (uid) mapByUser[uid] = num;
            }

            // fill missing numeros in list
            for (const f of list) {
              if (!f.numero_cuenta && f.id && mapByUser[f.id]) {
                f.numero_cuenta = mapByUser[f.id];
              }
            }
          }
        } catch (err) {
          // Log but don't fail the whole fetch
          // eslint-disable-next-line no-console
          console.error('Error fetching cuentas for friends:', err);
        }
      }

      setFriends(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching friends:', err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFriends();
  }, [fetchFriends]);

  return { friends, loading, refresh: fetchFriends } as const;
}
