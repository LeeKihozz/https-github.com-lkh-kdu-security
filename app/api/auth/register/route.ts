import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/app/lib/db'

const schema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  name: z.string().min(2).max(30),
  password: z.string().min(6).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: '입력값이 올바르지 않습니다.', details: result.error.flatten() }, { status: 400 })
    }

    const { username, email, name, password } = result.data

    const existing = await db.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })
    if (existing) {
      return NextResponse.json({ error: '이미 사용 중인 아이디 또는 이메일입니다.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await db.user.create({
      data: { username, email, name, passwordHash, role: 'USER', status: 'PENDING' },
    })

    return NextResponse.json({ message: '회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
