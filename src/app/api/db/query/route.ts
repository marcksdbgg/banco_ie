import { NextResponse } from 'next/server'
import { executeNeonQuery } from '@/lib/db/neon-query-executor'
import { pool } from '@/lib/neon'
import { getSession } from '@/lib/auth/session'
import type { DbQueryState } from '@/lib/db/query-builder'

async function getAuthUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.sub ?? null
}

async function isAdmin(userId: string) {
  const result = await pool.query(`SELECT rol FROM perfiles WHERE id = $1 LIMIT 1`, [userId])
  return result.rows[0]?.rol === 'admin'
}

function getEqValue(state: DbQueryState, column: string) {
  const filter = state.filters.find((f) => f.type === 'eq' && f.column === column)
  return filter && filter.type === 'eq' ? String(filter.value) : null
}

function getInValues(state: DbQueryState, column: string) {
  const filter = state.filters.find((f) => f.type === 'in' && f.column === column)
  return filter && filter.type === 'in' ? filter.values.map((v) => String(v)) : null
}

function canNonAdminRun(state: DbQueryState, userId: string) {
  if (state.table === 'perfiles' && state.op === 'select') {
    return state.columns === 'rol' && getEqValue(state, 'id') === userId
  }

  if (state.table === 'amistades' && state.op === 'select') {
    const orFilter = state.filters.find((f) => f.type === 'or')
    if (!orFilter || orFilter.type !== 'or') return false
    const containsUser = orFilter.raw.includes(`usuario_solicitante_id.eq.${userId}`) && orFilter.raw.includes(`usuario_receptor_id.eq.${userId}`)
    return containsUser
  }

  if (state.table === 'cuentas' && state.op === 'select') {
    const usuarioIdEq = getEqValue(state, 'usuario_id')
    if (usuarioIdEq === userId) return true
    return false
  }

  return false
}

async function canNonAdminRunWithFriendScope(state: DbQueryState, userId: string) {
  if (!(state.table === 'cuentas' && state.op === 'select')) return canNonAdminRun(state, userId)
  const inValues = getInValues(state, 'usuario_id')
  if (!inValues || inValues.length === 0) return canNonAdminRun(state, userId)

  const { rows } = await pool.query(
    `SELECT CASE
       WHEN usuario_solicitante_id = $1 THEN usuario_receptor_id
       ELSE usuario_solicitante_id
     END AS friend_id
     FROM amistades
     WHERE estado = 'aceptada'
       AND (usuario_solicitante_id = $1 OR usuario_receptor_id = $1)`,
    [userId]
  )

  const friendSet = new Set(rows.map((r) => String(r.friend_id)))
  return inValues.every((id) => friendSet.has(id))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const state = body?.state as DbQueryState | undefined
    if (!state?.table || !state?.op) {
      return NextResponse.json({ error: 'Invalid query state' }, { status: 400 })
    }

    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await isAdmin(userId)
    if (!admin) {
      const allowed = await canNonAdminRunWithFriendScope(state, userId)
      if (!allowed) {
        return NextResponse.json({ error: 'Forbidden query' }, { status: 403 })
      }
    }

    const result = await executeNeonQuery(state)
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: result.data,
      count: typeof result.count === 'number' ? result.count : null,
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
