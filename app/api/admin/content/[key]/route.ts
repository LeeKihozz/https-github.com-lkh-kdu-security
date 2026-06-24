import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'
import { getPageContent, PAGE_DEFAULTS, type PageKey } from '@/app/lib/siteContent'

function isValidKey(key: string): key is PageKey {
  return key in PAGE_DEFAULTS
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    await requireAdmin()
    const { key } = await params
    if (!isValidKey(key)) {
      return NextResponse.json({ error: '알 수 없는 페이지' }, { status: 404 })
    }
    const content = await getPageContent(key)
    return NextResponse.json({ content })
  } catch (err) {
    const status = err instanceof Error && err.constructor.name === 'AuthError' ? 403 : 500
    return NextResponse.json({ error: '서버 오류' }, { status })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    await requireAdmin()
    const { key } = await params
    if (!isValidKey(key)) {
      return NextResponse.json({ error: '알 수 없는 페이지' }, { status: 404 })
    }
    const body = await req.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: '잘못된 형식' }, { status: 400 })
    }
    const value = JSON.stringify(body)
    await db.siteContent.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
    return NextResponse.json({ message: '저장되었습니다.' })
  } catch (err) {
    const status = err instanceof Error && err.constructor.name === 'AuthError' ? 403 : 500
    return NextResponse.json({ error: '서버 오류' }, { status })
  }
}
