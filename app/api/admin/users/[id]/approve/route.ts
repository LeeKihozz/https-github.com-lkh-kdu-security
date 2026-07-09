import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    const { id } = await params
    const user = await db.user.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedById: session.userId },
    })
    return NextResponse.json({ user: { id: user.id, status: user.status } })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
