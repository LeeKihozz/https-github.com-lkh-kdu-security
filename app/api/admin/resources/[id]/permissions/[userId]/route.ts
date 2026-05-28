import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    await requireAdmin()
    const { id: resourceId, userId } = await params
    await db.resourcePermission.deleteMany({ where: { resourceId, userId } })
    return NextResponse.json({ message: '권한이 회수되었습니다.' })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
