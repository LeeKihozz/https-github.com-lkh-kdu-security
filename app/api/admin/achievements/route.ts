import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'
import { z } from 'zod'

const schema = z.object({
  category: z.enum(['RESEARCH', 'AWARD', 'EMPLOYMENT', 'CERTIFICATE', 'ACTIVITY', 'COURSE', 'PATENT', 'GRADUATE_SCHOOL', 'PAPER']),
  year: z.number().optional().nullable(),
  title: z.string().min(1),
  organization: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  people: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  displayOrder: z.number().optional(),
  isVisible: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = schema.parse(body)
    const achievement = await db.achievement.create({ data })
    return NextResponse.json({ achievement }, { status: 201 })
  } catch (e: unknown) {
    if (e instanceof Error && e.constructor.name === 'AuthError') {
      return NextResponse.json({ error: e.message }, { status: 403 })
    }
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
