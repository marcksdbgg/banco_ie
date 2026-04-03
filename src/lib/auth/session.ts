import { cookies } from 'next/headers'
import { verifyToken, type SessionPayload } from './jwt'

export const COOKIE_NAME = 'auth-token'

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
