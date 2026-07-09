import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
