import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const year = searchParams.get('year')
    const keyword = searchParams.get('keyword')

    const where: Record<string, unknown> = { isVisible: true }
    if (category) where.category = category
    if (year) where.year = parseInt(year)
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { organization: { contains: keyword } },
        { description: { contains: keyword } },
      ]
    }

    const achievements = await db.achievement.findMany({
      where,
      orderBy: [{ year: 'desc' }, { displayOrder: 'asc' }],
    })

    const counts = await db.achievement.groupBy({
      by: ['category'],
      where: { isVisible: true },
      _count: { category: true },
    })

    return NextResponse.json({ achievements, counts })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
