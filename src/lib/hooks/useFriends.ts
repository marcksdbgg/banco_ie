"use client";

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type FriendInfo = { id: string; nombre_completo: string; numero_cuenta?: string };

export default function useFriends() {
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) { setFriends([]); setLoading(false); return; }

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

      for (const r of rowsArr) {
        const row = r as Record<string, unknown>;
        // normalize nested relations which Supabase may return as arrays
        const solicitanteRaw = row.solicitante;
        const receptorRaw = row.receptor;
        const solicitanteObj = Array.isArray(solicitanteRaw) ? (solicitanteRaw as unknown[])[0] as Record<string, unknown> : (solicitanteRaw as Record<string, unknown> | undefined);
        const receptorObj = Array.isArray(receptorRaw) ? (receptorRaw as unknown[])[0] as Record<string, unknown> : (receptorRaw as Record<string, unknown> | undefined);

        // Determine which side is the friend (the other user)
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

        // If numero not present, fallback to querying cuentas table directly by usuario_id
        if (!numero && id) {
          try {
            const { data: cdata, error: cerr } = await supabase.from('cuentas').select('numero_cuenta').eq('usuario_id', id).single();
                if (!cerr && cdata && typeof (cdata as Record<string, unknown>).numero_cuenta !== 'undefined') {
                  numero = String(((cdata as Record<string, unknown>).numero_cuenta));
                }
          } catch {
            // ignore
          }
        }

        list.push({ id, nombre_completo: nombre, numero_cuenta: numero });
      }

      setFriends(list);
    } catch {
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchFriends();
  }, [fetchFriends]);

  return { friends, loading, refresh: fetchFriends } as const;
}
