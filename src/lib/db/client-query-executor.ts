import type { DbQueryState } from '@/lib/db/query-builder'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function executeClientQuery(state: DbQueryState) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  const response = await fetch('/api/db/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
