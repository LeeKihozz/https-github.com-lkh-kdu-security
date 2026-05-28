import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const users = await db.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        status: true,
        approvedAt: true,
        createdAt: true,
        _count: { select: { permissions: true, downloadLogs: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ users })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
