import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const faculty = await db.faculty.findMany({ orderBy: { displayOrder: 'asc' } })
    return NextResponse.json({ faculty })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const faculty = await db.faculty.create({ data: body })
    return NextResponse.json({ faculty }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
