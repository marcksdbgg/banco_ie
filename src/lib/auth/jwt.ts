import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const ALGORITHM = 'HS256'
const EXPIRES_IN = '7d'

export interface SessionPayload extends JWTPayload {
  sub: string
  email: string
}

export async function signToken(payload: { sub: string; email: string }): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as SessionPayload
  } catch {
    return null
  }
}
