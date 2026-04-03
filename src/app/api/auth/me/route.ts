import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { pool } from '@/lib/neon'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }

  const result = await pool.query(
    `SELECT u.id, u.email, p.nombre_completo
     FROM usuarios u
     LEFT JOIN perfiles p ON p.id = u.id
     WHERE u.id = $1 LIMIT 1`,
    [session.sub]
  )
  const row = result.rows[0]

  return NextResponse.json({
    user: row
      ? {
          id: row.id,
          email: row.email,
          user_metadata: { nombre_completo: row.nombre_completo ?? '' },
        }
      : null,
  })
}
