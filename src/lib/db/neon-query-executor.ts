import { pool } from '@/lib/neon'
import type { DbQueryState } from '@/lib/db/query-builder'

const aliasJoinColumns = [
  'solicitante:usuario_solicitante_id ( id, nombre_completo )',
  'receptor:usuario_receptor_id ( id, nombre_completo )',
  'solicitante:usuario_solicitante_id ( id, nombre_completo, cuentas ( numero_cuenta ) )',
  'receptor:usuario_receptor_id ( id, nombre_completo, cuentas ( numero_cuenta ) )',
]

function buildWhere(state: DbQueryState, paramOffset = 1) {
  const clauses: string[] = []
  const values: unknown[] = []
  let i = paramOffset

  for (const f of state.filters) {
    if (f.type === 'eq') {
      clauses.push(`${f.column} = $${i++}`)
      values.push(f.value)
      continue
    }
    if (f.type === 'in') {
      clauses.push(`${f.column} = ANY($${i++})`)
      values.push(f.values)
      continue
    }
    if (f.type === 'or') {
      const parts = f.raw
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
      const orClauses: string[] = []
      for (const part of parts) {
        const [left, right] = part.split('.eq.')
        if (!left || typeof right === 'undefined') continue
        orClauses.push(`${left} = $${i++}`)
        values.push(right)
      }
      if (orClauses.length > 0) clauses.push(`(${orClauses.join(' OR ')})`)
    }
  }

  const whereSql = clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : ''
  return { whereSql, values }
}

function toSelectColumns(raw?: string) {
  if (!raw || raw === '*') return '*'
  if (raw.includes('perfiles ( nombre_completo )')) {
    return 'numero_cuenta, perfiles(nombre_completo)'
  }
  if (aliasJoinColumns.some((s) => raw.includes(s))) {
    return '*'
  }
  return raw
}

function buildPerfilJson(alias: 'ps' | 'pr', includeCuentaNested: boolean) {
  const cuentasSql = includeCuentaNested
    ? `, 'cuentas', COALESCE((SELECT json_agg(json_build_object('numero_cuenta', c.numero_cuenta)) FROM cuentas c WHERE c.usuario_id = ${alias}.id), '[]'::json)`
    : ''

  return `json_build_object('id', ${alias}.id, 'nombre_completo', ${alias}.nombre_completo${cuentasSql})`
}

async function runJoinSelect(state: DbQueryState) {
  const userIdEq = state.filters.find((f) => f.type === 'eq' && f.column === 'usuario_id')
  const numeroCuentaEq = state.filters.find((f) => f.type === 'eq' && f.column === 'numero_cuenta')
  const includesCuentaNested = state.columns?.includes('cuentas ( numero_cuenta )')

  if (state.table === 'amistades' && state.columns?.includes('solicitante:') && state.columns?.includes('receptor:')) {
    const orFilter = state.filters.find((f) => f.type === 'or')
    const order = state.orderBy ? ` ORDER BY ${state.orderBy.column} ${state.orderBy.ascending ? 'ASC' : 'DESC'}` : ''
    const limit = state.limit ? ` LIMIT ${state.limit}` : ''
    if (!orFilter || orFilter.type !== 'or') return null

    const parts = orFilter.raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    const params: unknown[] = []
    const orSql: string[] = []
    let p = 1
    for (const part of parts) {
      const [left, right] = part.split('.eq.')
      if (!left || typeof right === 'undefined') continue
      orSql.push(`a.${left} = $${p++}`)
      params.push(right)
    }
    const estadoEq = state.filters.find((f) => f.type === 'eq' && f.column === 'estado')
    let estadoSql = ''
    if (estadoEq && estadoEq.type === 'eq') {
      estadoSql = ` AND a.estado = $${p++}`
      params.push(estadoEq.value)
    }

    const query = `
      SELECT
        a.id,
        a.estado,
        a.usuario_solicitante_id,
        a.usuario_receptor_id,
        a.fecha_solicitud,
        a.fecha_actualizacion,
        ${buildPerfilJson('ps', includesCuentaNested)} AS solicitante,
        ${buildPerfilJson('pr', includesCuentaNested)} AS receptor
      FROM amistades a
      JOIN perfiles ps ON ps.id = a.usuario_solicitante_id
      JOIN perfiles pr ON pr.id = a.usuario_receptor_id
      WHERE (${orSql.join(' OR ')})${estadoSql}
      ${order}
      ${limit}
    `
    const { rows } = await pool.query(query, params)
    return { data: rows, error: null as null }
  }

  if (state.table === 'cuentas' && state.columns?.includes('perfiles ( nombre_completo )') && userIdEq?.type === 'eq') {
    const { rows } = await pool.query(
      `SELECT c.numero_cuenta,
              json_build_object('nombre_completo', p.nombre_completo) AS perfiles
       FROM cuentas c
       JOIN perfiles p ON p.id = c.usuario_id
       WHERE c.usuario_id = $1
       LIMIT 1`,
      [userIdEq.value]
    )
    return { data: rows[0] ?? null, error: null as null }
  }

  if (state.table === 'cuentas' && state.columns?.includes('usuario_id, perfiles ( nombre_completo )') && numeroCuentaEq?.type === 'eq') {
    const { rows } = await pool.query(
      `SELECT c.usuario_id,
              json_build_object('nombre_completo', p.nombre_completo) AS perfiles
       FROM cuentas c
       JOIN perfiles p ON p.id = c.usuario_id
       WHERE c.numero_cuenta = $1
       LIMIT 1`,
      [numeroCuentaEq.value]
    )
    return { data: rows[0] ?? null, error: null as null }
  }

  return null
}

export async function executeNeonQuery(state: DbQueryState) {
  try {
    const joinResult = await runJoinSelect(state)
    if (joinResult) {
      if (state.single === 'single' && !joinResult.data) return { data: null, error: { message: 'No rows found' } }
      return { data: joinResult.data, error: null }
    }

    if (state.op === 'select') {
      const columns = toSelectColumns(state.columns)
      if (state.countExactHead) {
        const where = buildWhere(state)
        const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${state.table}${where.whereSql}`, where.values)
        return { data: null, count: result.rows[0]?.count ?? 0, error: null }
      }

      const where = buildWhere(state)
      const orderSql = state.orderBy ? ` ORDER BY ${state.orderBy.column} ${state.orderBy.ascending ? 'ASC' : 'DESC'}` : ''
      const limitSql = state.limit ? ` LIMIT ${state.limit}` : ''
      const query = `SELECT ${columns} FROM ${state.table}${where.whereSql}${orderSql}${limitSql}`
      const result = await pool.query(query, where.values)

      if (state.single === 'single') {
        if (result.rows.length === 0) return { data: null, error: { message: 'No rows found' } }
        return { data: result.rows[0], error: null }
      }
      if (state.single === 'maybeSingle') {
        return { data: result.rows[0] ?? null, error: null }
      }
      return { data: result.rows, error: null }
    }

    if (state.op === 'update') {
      const values = state.values as Record<string, unknown>
      const columns = Object.keys(values)
      if (columns.length === 0) return { data: null, error: { message: 'Missing update values' } }

      const setValues = columns.map((k, i) => `${k} = $${i + 1}`).join(', ')
      const setParams = columns.map((k) => values[k])
      const where = buildWhere(state, columns.length + 1)
      const query = `UPDATE ${state.table} SET ${setValues}${where.whereSql} RETURNING *`
      const result = await pool.query(query, [...setParams, ...where.values])
      if (state.single === 'single') return { data: result.rows[0] ?? null, error: null }
      if (state.single === 'maybeSingle') return { data: result.rows[0] ?? null, error: null }
      return { data: result.rows, error: null }
    }

    if (state.op === 'insert') {
      const records = Array.isArray(state.values) ? state.values : [state.values as Record<string, unknown>]
      if (!records[0]) return { data: null, error: { message: 'Missing insert values' } }
      const columns = Object.keys(records[0])
      const valuesSql: string[] = []
      const params: unknown[] = []
      let p = 1
      for (const record of records) {
        const placeholders = columns.map(() => `$${p++}`)
        valuesSql.push(`(${placeholders.join(', ')})`)
        for (const col of columns) params.push(record[col])
      }
      const query = `INSERT INTO ${state.table} (${columns.join(', ')}) VALUES ${valuesSql.join(', ')} RETURNING *`
      const result = await pool.query(query, params)
      if (state.single === 'single') return { data: result.rows[0] ?? null, error: null }
      if (state.single === 'maybeSingle') return { data: result.rows[0] ?? null, error: null }
      return { data: result.rows, error: null }
    }

    if (state.op === 'delete') {
      const where = buildWhere(state)
      const query = `DELETE FROM ${state.table}${where.whereSql} RETURNING *`
      const result = await pool.query(query, where.values)
      if (state.single === 'single') return { data: result.rows[0] ?? null, error: null }
      if (state.single === 'maybeSingle') return { data: result.rows[0] ?? null, error: null }
      return { data: result.rows, error: null }
    }

    return { data: null, error: { message: 'Unsupported operation' } }
  } catch (error) {
    return { data: null, error: { message: (error as Error).message } }
  }
}
