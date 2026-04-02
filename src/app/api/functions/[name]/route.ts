import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { pool } from '@/lib/neon'

type AuthUser = { id: string; user_metadata?: { nombre_completo?: string } }

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token)
  return user ? ({ id: user.id, user_metadata: user.user_metadata as AuthUser['user_metadata'] } as AuthUser) : null
}

async function isAdmin(userId: string) {
  const result = await pool.query(`SELECT rol FROM perfiles WHERE id = $1 LIMIT 1`, [userId])
  return result.rows[0]?.rol === 'admin'
}

async function crearUsuarioCliente(req: Request) {
  const body = await req.json()
  const { nombre_completo, email, password } = body
  let { saldo_inicial, rol, tipo } = body
  saldo_inicial = Number(saldo_inicial) || 0

  const user = await getAuthUser(req)
  const isAdminCall = user ? await isAdmin(user.id) : false
  const validTipos = ['alumno', 'padre', 'personal']

  if (!isAdminCall) {
    rol = 'cliente'
    tipo = 'alumno'
    saldo_inicial = 0
  } else {
    rol = rol === 'admin' ? 'admin' : 'cliente'
    if (!validTipos.includes(tipo)) tipo = 'alumno'
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre_completo },
  })
  if (authError || !authData.user) throw new Error(authError?.message ?? 'No se pudo crear usuario')

  try {
    await pool.query(
      `INSERT INTO perfiles (id, nombre_completo, rol, tipo) VALUES ($1, $2, $3, $4)`,
      [authData.user.id, nombre_completo, rol, tipo]
    )

    const accountResult = await pool.query(`SELECT * FROM create_account_for_user($1::uuid, $2::numeric)`, [
      authData.user.id,
      saldo_inicial,
    ])
    const cuenta = accountResult.rows[0]

    if (saldo_inicial > 0 && cuenta?.id) {
      await pool.query(
        `INSERT INTO transacciones (cuenta_destino_id, monto, tipo, descripcion)
         VALUES ($1, $2, 'deposito', 'Depósito inicial de cuenta')`,
        [cuenta.id, saldo_inicial]
      )
    }

    return NextResponse.json(
      { message: 'Usuario y cuenta creados exitosamente.', userId: authData.user.id, cuentaId: cuenta?.id ?? null },
      { status: 201 }
    )
  } catch (error) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    throw error
  }
}

async function gestionarFondos(req: Request) {
  const user = await getAuthUser(req)
  if (!user || !(await isAdmin(user.id))) throw new Error('No autorizado')

  const { tipo, cuenta_id, monto } = await req.json()
  const amount = Number(monto)
  if (amount <= 0) throw new Error('El monto debe ser positivo.')
  if (!['deposito', 'retiro'].includes(tipo)) throw new Error('Tipo de operación no válido.')

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const cuentaRes = await client.query(`SELECT saldo_actual FROM cuentas WHERE id = $1 FOR UPDATE`, [cuenta_id])
    if (!cuentaRes.rows[0]) throw new Error('Cuenta no encontrada.')
    const current = Number(cuentaRes.rows[0].saldo_actual)
    const nuevoSaldo = tipo === 'deposito' ? current + amount : current - amount
    if (nuevoSaldo < 0) throw new Error('Saldo insuficiente.')

    await client.query(`UPDATE cuentas SET saldo_actual = $1 WHERE id = $2`, [nuevoSaldo, cuenta_id])
    await client.query(
      `INSERT INTO transacciones (cuenta_destino_id, cuenta_origen_id, monto, tipo, descripcion)
       VALUES ($1, $2, $3, $4, $5)`,
      [tipo === 'deposito' ? cuenta_id : null, tipo === 'retiro' ? cuenta_id : null, amount, tipo, `Operación de admin: ${tipo}`]
    )
    await client.query('COMMIT')
    return NextResponse.json({ message: 'Operación exitosa', nuevoSaldo })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function iniciarTransferenciaCliente(req: Request) {
  const user = await getAuthUser(req)
  if (!user) throw new Error('Usuario no autenticado.')

  const { numero_cuenta_destino, monto } = await req.json()
  const amount = Number(monto)
  if (!(amount > 0)) throw new Error('Monto inválido.')

  const cuentaRes = await pool.query(`SELECT id FROM cuentas WHERE usuario_id = $1 LIMIT 1`, [user.id])
  const cuentaOrigenId = cuentaRes.rows[0]?.id
  if (!cuentaOrigenId) throw new Error('Cuenta de origen no encontrada.')

  await pool.query(`SELECT realizar_transferencia($1::uuid, $2::text, $3::numeric)`, [
    cuentaOrigenId,
    numero_cuenta_destino,
    amount,
  ])

  return NextResponse.json({ message: 'Transferencia iniciada con éxito.' })
}

async function solicitarAmistad(req: Request) {
  const user = await getAuthUser(req)
  if (!user) throw new Error('Autenticación requerida.')

  const { numero_cuenta_amigo } = await req.json()
  if (!numero_cuenta_amigo) throw new Error('El número de cuenta es requerido.')

  const cuentaRes = await pool.query(
    `SELECT c.usuario_id, p.nombre_completo
     FROM cuentas c
     JOIN perfiles p ON p.id = c.usuario_id
     WHERE c.numero_cuenta = $1
     LIMIT 1`,
    [numero_cuenta_amigo]
  )
  const cuentaDestino = cuentaRes.rows[0]
  if (!cuentaDestino) throw new Error('El número de cuenta no fue encontrado.')
  if (cuentaDestino.usuario_id === user.id) throw new Error('No puedes agregarte a ti mismo.')

  try {
    await pool.query(
      `INSERT INTO amistades (usuario_solicitante_id, usuario_receptor_id, estado)
       VALUES ($1, $2, 'pendiente')`,
      [user.id, cuentaDestino.usuario_id]
    )
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code === '23505') throw new Error('Ya existe una solicitud de amistad con este usuario.')
    throw error
  }

  await pool.query(
    `INSERT INTO notificaciones (usuario_id, tipo, mensaje, enlace)
     VALUES ($1, 'solicitud_amistad', $2, '/dashboard/amigos')`,
    [cuentaDestino.usuario_id, `Has recibido una solicitud de amistad de ${user.user_metadata?.nombre_completo ?? 'un usuario'}.`]
  )

  return NextResponse.json({ message: `Solicitud enviada a ${cuentaDestino.nombre_completo}.` }, { status: 201 })
}

async function gestionarAmistad(req: Request) {
  const user = await getAuthUser(req)
  if (!user) throw new Error('Autenticación requerida.')

  const { amistad_id, accion } = await req.json()
  if (!amistad_id || !accion) throw new Error("Parámetros 'amistad_id' y 'accion' son requeridos.")

  const amistadRes = await pool.query(`SELECT * FROM amistades WHERE id = $1 LIMIT 1`, [amistad_id])
  const amistad = amistadRes.rows[0]
  if (!amistad) throw new Error('Solicitud de amistad no encontrada.')

  if (accion === 'aceptar') {
    if (amistad.usuario_receptor_id !== user.id) throw new Error('No autorizado para aceptar esta solicitud.')
    await pool.query(`UPDATE amistades SET estado = 'aceptada', fecha_actualizacion = NOW() WHERE id = $1`, [amistad_id])
    return NextResponse.json({ message: 'Amistad aceptada.' })
  }

  if (accion === 'rechazar' || accion === 'eliminar') {
    if (amistad.usuario_receptor_id !== user.id && amistad.usuario_solicitante_id !== user.id) {
      throw new Error('No autorizado para esta acción.')
    }
    await pool.query(`DELETE FROM amistades WHERE id = $1`, [amistad_id])
    return NextResponse.json({ message: accion === 'rechazar' ? 'Solicitud rechazada.' : 'Amigo eliminado.' })
  }

  throw new Error('Acción no válida.')
}

async function borrarUsuarioCliente(req: Request) {
  const user = await getAuthUser(req)
  if (!user || !(await isAdmin(user.id))) throw new Error('No autorizado: el usuario no tiene privilegios de administrador.')

  const { userId } = await req.json()
  if (!userId) throw new Error('userId es requerido en el cuerpo de la solicitud.')

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const cuentaRes = await client.query(`SELECT id FROM cuentas WHERE usuario_id = $1 LIMIT 1`, [userId])
    const cuentaId = cuentaRes.rows[0]?.id

    if (cuentaId) {
      await client.query(`DELETE FROM transacciones WHERE cuenta_origen_id = $1 OR cuenta_destino_id = $1`, [cuentaId])
      await client.query(`DELETE FROM cuentas WHERE usuario_id = $1`, [userId])
    }
    await client.query(`DELETE FROM perfiles WHERE id = $1`, [userId])
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)

  return NextResponse.json({ message: 'Usuario eliminado exitosamente' })
}

export async function POST(req: Request, context: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await context.params

    if (name === 'crear-usuario-cliente') return await crearUsuarioCliente(req)
    if (name === 'gestionar-fondos') return await gestionarFondos(req)
    if (name === 'iniciar-transferencia-cliente') return await iniciarTransferenciaCliente(req)
    if (name === 'solicitar-amistad') return await solicitarAmistad(req)
    if (name === 'gestionar-amistad') return await gestionarAmistad(req)
    if (name === 'borrar-usuario-cliente') return await borrarUsuarioCliente(req)

    return NextResponse.json({ error: 'Function not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
