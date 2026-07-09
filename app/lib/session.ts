import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export type SessionPayload = {
  userId: string
  role: string
  status: string
  expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET ?? 'fallback-secret-key-for-dev'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, role: string, status: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, role, status, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    // HTTPS가 아닌 맨 IP(HTTP)로 서비스하면 secure 쿠키를 브라우저가 저장하지 않아
    // 로그인 직후 다시 로그인 화면으로 튕긴다. HTTPS 적용 후 COOKIE_SECURE=true 로 켤 것.
    secure: process.env.COOKIE_SECURE === 'true',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  if (!sessionCookie) return null

  const payload = await decrypt(sessionCookie.value)
  if (!payload) return null

  const now = new Date()
  if (new Date(payload.expiresAt) < now) {
    await deleteSession()
    return null
  }

  return payload
}
