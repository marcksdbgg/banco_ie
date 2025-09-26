"use client";

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

type Friend = { id: string; nombre_completo: string; numero_cuenta?: string };

type Props = {
  onSelect: (numeroCuenta: string, friendName?: string) => void;
  disabled?: boolean;
};

export default function FriendSelector({ onSelect, disabled }: Props) {
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_friends_for_user');
      // fallback: try query amistades table if RPC not present
      if (error) {
        try {
          const userRes = await supabase.auth.getUser();
          const userId = userRes.data.user?.id;
          if (!userId) { setFriends([]); setLoading(false); return; }
          const { data: rows } = await supabase
            .from('amistades')
            .select(`
              solicitante:usuario_solicitante_id ( id, nombre_completo ),
              receptor:usuario_receptor_id ( id, nombre_completo )
            `)
            .or(`usuario_solicitante_id.eq.${userId},usuario_receptor_id.eq.${userId}`)
            .eq('estado', 'aceptada');
          const rowsArr = Array.isArray(rows) ? rows : [];
          const list: Friend[] = rowsArr.map((r: unknown) => {
            const row = r as Record<string, unknown>;
            const solicitante = row.solicitante;
            const receptor = row.receptor;
            const s = Array.isArray(solicitante) ? (solicitante as unknown[])[0] : solicitante as Record<string, unknown> | undefined;
            const rc = Array.isArray(receptor) ? (receptor as unknown[])[0] : receptor as Record<string, unknown> | undefined;
            const friend = (s && (s as Record<string, unknown>).id === userId) ? rc : s;
            const id = (friend && (friend as Record<string, unknown>).id) ? String((friend as Record<string, unknown>).id) : '';
            const nombre = (friend && (friend as Record<string, unknown>).nombre_completo) ? String((friend as Record<string, unknown>).nombre_completo) : '';
            return { id, nombre_completo: nombre, numero_cuenta: '' };
          });
          if (mounted) setFriends(list);
  } catch { if (mounted) setFriends([]); }
      } else {
        // assume RPC returns rows with id, nombre_completo, numero_cuenta
        const rpcRows = Array.isArray(data) ? data as unknown[] : [];
        const list = rpcRows.map(r => {
          const row = r as Record<string, unknown>;
          return { id: String(row.id ?? ''), nombre_completo: String(row.nombre_completo ?? ''), numero_cuenta: String(row.numero_cuenta ?? '') };
        });
        if (mounted) setFriends(list);
      }
      if (mounted) setLoading(false);
    };
    fetch();
    return () => { mounted = false; };
  }, [supabase]);

  const filtered = friends.filter(f => f.nombre_completo.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-2">
      <Input placeholder="Buscar amigo por nombre" value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
      <div className="max-h-48 overflow-auto border rounded p-1 bg-white">
        {loading && <div className="text-sm text-gray-500 p-2">Cargando amigos...</div>}
        {!loading && filtered.length === 0 && <div className="text-sm text-gray-500 p-2">No hay amigos encontrados.</div>}
        {!loading && filtered.map(friend => (
          <div key={friend.id} className="flex items-center justify-between gap-2 p-2 hover:bg-gray-50 rounded">
            <div>
              <div className="font-medium">{friend.nombre_completo}</div>
              <div className="text-xs text-gray-500">{friend.numero_cuenta ? `Cuenta: ${friend.numero_cuenta}` : 'Cuenta no disponible'}</div>
            </div>
            <div>
              <Button size="sm" onClick={() => onSelect(friend.numero_cuenta ?? '', friend.nombre_completo)} disabled={disabled || !friend.numero_cuenta}>Enviar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
