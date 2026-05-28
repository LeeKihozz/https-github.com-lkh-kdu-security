import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'
import { z } from 'zod'

const schema = z.object({ userId: z.string() })

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    const { id: resourceId } = await params
    const body = await req.json()
    const { userId } = schema.parse(body)

    await db.resourcePermission.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      update: {},
      create: { userId, resourceId, grantedById: session.userId },
    })

    return NextResponse.json({ message: '권한이 부여되었습니다.' })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: resourceId } = await params

    const permissions = await db.resourcePermission.findMany({
      where: { resourceId },
      include: { user: { select: { id: true, name: true, username: true, email: true } } },
    })

    const allUsers = await db.user.findMany({
      where: { role: 'USER', status: 'APPROVED' },
      select: { id: true, name: true, username: true, email: true },
    })

    return NextResponse.json({ permissions, allUsers })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
