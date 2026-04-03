import { NextResponse } from 'next/server'
import { pool } from '@/lib/neon'
import { signToken } from '@/lib/auth/jwt'
import { COOKIE_NAME } from '@/lib/auth/session'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos.' }, { status: 400 })
  }

  const result = await pool.query(
    `SELECT id, email, password_hash FROM usuarios WHERE email = $1 LIMIT 1`,
    [email]
  )
  const user = result.rows[0]

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 })
  }

  const token = await signToken({ sub: user.id, email: user.email })
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
