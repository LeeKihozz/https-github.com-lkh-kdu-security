import { NextResponse } from 'next/server'
import { deleteSession } from '@/app/lib/session'

export async function POST() {
  await deleteSession()
  return NextResponse.json({ message: '로그아웃되었습니다.' })
}
