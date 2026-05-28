import 'server-only'
import { getSession } from './session'
import { db } from './db'

export class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message)
  }
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) throw new AuthError('로그인이 필요합니다.', 401)
  if (session.role !== 'ADMIN') throw new AuthError('관리자 권한이 필요합니다.', 403)
  return session
}

export async function requireApprovedUser() {
  const session = await getSession()
  if (!session) throw new AuthError('로그인이 필요합니다.', 401)
  if (session.role === 'ADMIN') return session
  if (session.status !== 'APPROVED') {
    throw new AuthError('관리자 승인 후 이용 가능합니다.', 403)
  }
  return session
}

export async function canAccessResource(userId: string, resourceId: string): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  if (session.role === 'ADMIN') return true
  if (session.status !== 'APPROVED') return false

  const permission = await db.resourcePermission.findUnique({
    where: { userId_resourceId: { userId, resourceId } },
  })
  return !!permission
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })
  return user
}
