import { createDbFromFactory } from '@/lib/db/query-builder'
import { executeNeonQuery } from '@/lib/db/neon-query-executor'
import { getSession } from '@/lib/auth/session'
import { pool } from '@/lib/neon'

type AuthUser = {
  id: string
  email: string
  user_metadata: { nombre_completo?: string }
}

export const createClient = async () => {
  const from = createDbFromFactory(executeNeonQuery)

  return {
    auth: {
      getUser: async (): Promise<{ data: { user: AuthUser | null }; error: null }> => {
        const session = await getSession()
        if (!session) return { data: { user: null }, error: null }

        const result = await pool.query(
          `SELECT u.id, u.email, p.nombre_completo
           FROM usuarios u
           LEFT JOIN perfiles p ON p.id = u.id
           WHERE u.id = $1 LIMIT 1`,
          [session.sub]
        )
        const row = result.rows[0]
        if (!row) return { data: { user: null }, error: null }

        return {
          data: {
            user: {
              id: row.id,
              email: row.email,
              user_metadata: { nombre_completo: row.nombre_completo ?? '' },
            },
          },
          error: null,
        }
      },
    },
    from,
  }
}
