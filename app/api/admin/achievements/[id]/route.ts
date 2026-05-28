import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const achievement = await db.achievement.update({ where: { id }, data: body })
    return NextResponse.json({ achievement })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    await db.achievement.delete({ where: { id } })
    return NextResponse.json({ message: '삭제되었습니다.' })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
