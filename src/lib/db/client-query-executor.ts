import type { DbQueryState } from '@/lib/db/query-builder'

export async function executeClientQuery(state: DbQueryState) {
  const response = await fetch('/api/db/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    return {
      data: null,
      error: { message: payload?.error ?? 'Error de base de datos' },
      count: null,
    }
  }

  return {
    data: payload?.data ?? null,
    error: null,
    count: typeof payload?.count === 'number' ? payload.count : null,
  }
}
