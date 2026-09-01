import { NextResponse } from 'next/server'
import { getResourceStats } from '@/app/lib/resourceStats'

export const dynamic = 'force-dynamic'

/** 자료실 통계(공개) — 홈 화면에서 실시간 갱신용으로 사용 */
export async function GET() {
  try {
    const stats = await getResourceStats()
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    return NextResponse.json({ error: '통계를 불러올 수 없습니다.' }, { status: 500 })
  }
}
