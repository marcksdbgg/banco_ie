import { createDbFromFactory } from '@/lib/db/query-builder'
import { executeClientQuery } from '@/lib/db/client-query-executor'

type AuthUser = {
  id: string
  email: string
  user_metadata: { nombre_completo?: string }
}

export function createClient() {
  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) return { error: { message: data.error ?? 'Error al iniciar sesión' } }
        return { error: null }
      },
      signOut: async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        return { error: null }
      },
      getUser: async (): Promise<{ data: { user: AuthUser | null }; error: null }> => {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        return { data: { user: data.user ?? null }, error: null }
      },
    },
    from: createDbFromFactory(executeClientQuery),
    functions: {
      invoke: async (name: string, options?: { body?: unknown }) => {
        const response = await fetch(`/api/functions/${name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
