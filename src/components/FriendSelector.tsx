"use client";

import { useMemo, useState } from 'react';
import useFriends, { type FriendInfo } from '@/lib/hooks/useFriends';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, UserRound } from 'lucide-react';

type Props = {
  onSelect: (friend: FriendInfo) => void;
  disabled?: boolean;
  selectedFriendId?: string | null;
};

export default function FriendSelector({ onSelect, disabled, selectedFriendId }: Props) {
  const { friends, loading, refresh } = useFriends();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => friends.filter(f => f.nombre_completo.toLowerCase().includes(query.toLowerCase())),
    [friends, query],
  );

  const handleSelect = (friend: FriendInfo) => {
    if (disabled) return;
    onSelect(friend);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Buscar amigo por nombre"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="outline"
          size="sm"
          className="sm:w-auto"
          onClick={() => void refresh()}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualizar'}
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando amigos...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No encontramos amigos con ese nombre.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <ul className="divide-y">
            {filtered.map(friend => {
              const isSelected = selectedFriendId === friend.id;
              const disabledFriend = !friend.numero_cuenta;
              return (
                <li key={friend.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition ${
                      disabledFriend
                        ? 'cursor-not-allowed opacity-60'
                        : 'hover:bg-chiti_bank-blue/5'
                    } ${isSelected ? 'bg-chiti_bank-blue/5 ring-2 ring-chiti_bank-blue' : ''}`}
                    onClick={() => !disabledFriend && handleSelect(friend)}
                    disabled={disabled || disabledFriend}
                  >
                    <div className="flex items-center gap-3">
                      <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-chiti_bank-blue/10 p-2 text-chiti_bank-blue sm:flex">
                        <UserRound className="h-full w-full" />
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{friend.nombre_completo}</p>
                        <p className="text-xs text-gray-500 sm:text-sm">
                          {friend.numero_cuenta ? `Cuenta • ${friend.numero_cuenta}` : 'Cuenta no disponible'}
                        </p>
                      </div>
                    </div>
                    {isSelected && <span className="text-sm font-semibold text-chiti_bank-blue">Seleccionado</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

