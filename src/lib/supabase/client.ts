import { createBrowserClient } from '@supabase/ssr'
import { createDbFromFactory } from '@/lib/db/query-builder'
import { executeClientQuery } from '@/lib/db/client-query-executor'

export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return {
    ...supabase,
    from: createDbFromFactory(executeClientQuery),
    functions: {
      ...supabase.functions,
      invoke: async (name: string, options?: { body?: unknown }) => {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token

        const response = await fetch(`/api/functions/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(options?.body ?? {}),
        })

        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          return {
            data: null,
            error: {
              message: payload?.error ?? 'Error en la función',
              context: { msg: payload?.error },
            },
          }
        }

        return { data: payload, error: null }
      },
    },
  }
}
