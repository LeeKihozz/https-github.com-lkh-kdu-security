import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/app/lib/db'
import { createSession } from '@/app/lib/session'

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const { username, password } = result.data

    const user = await db.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    if (user.status === 'BLOCKED') {
      return NextResponse.json({ error: '차단된 계정입니다. 관리자에게 문의하세요.' }, { status: 403 })
    }

    await createSession(user.id, user.role, user.status)

    return NextResponse.json({
      user: { id: user.id, name: user.name, role: user.role, status: user.status },
    })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
