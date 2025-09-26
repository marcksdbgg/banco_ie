"use client";

import { useMemo, useState } from 'react';
import useFriends from '@/lib/hooks/useFriends';
import { Button } from './ui/button';

type Props = { onSelect: (numeroCuenta: string, nombre?: string) => void; disabled?: boolean };

export default function FriendSelector({ onSelect, disabled }: Props) {
  const { friends, loading, refresh } = useFriends();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => friends.filter(f => f.nombre_completo.toLowerCase().includes(query.toLowerCase())), [friends, query]);

  return (
    <div className="space-y-2">
      <input
        className="input"
        placeholder="Buscar amigo por nombre"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="bg-white border rounded-md p-2">
        {loading && <div>Cargando amigos...</div>}
        {!loading && filtered.length === 0 && <div className="text-sm text-muted-foreground">No hay amigos</div>}

        {filtered.map(f => (
          <div key={f.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
            <div>
              <div className="font-semibold">{f.nombre_completo}</div>
              <div className="text-sm text-muted-foreground">{f.numero_cuenta ?? 'Cuenta no disponible'}</div>
            </div>
            <div>
              <Button size="sm" disabled={disabled || !f.numero_cuenta} onClick={() => onSelect(f.numero_cuenta ?? '', f.nombre_completo)}>Enviar</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => void refresh()}>Actualizar</Button>
      </div>
    </div>
  );
}

