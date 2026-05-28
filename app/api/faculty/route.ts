import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db'

export async function GET() {
  try {
    const faculty = await db.faculty.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    })
    return NextResponse.json({ faculty })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
