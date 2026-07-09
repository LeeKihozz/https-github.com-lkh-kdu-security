import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    // Never allow updating driveUrl/filePath without explicit intent
    const resource = await db.resource.update({ where: { id }, data: body })
    return NextResponse.json({ resource })
  } catch (err) {
    console.error('[admin/resources PATCH]', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // 삭제 대상 조회 (로컬 파일 정리를 위해 filePath 확보)
    const resource = await db.resource.findUnique({ where: { id } })
    if (!resource) {
      return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 자식 레코드를 먼저 삭제해야 FK(RESTRICT) 제약에 막히지 않음
    await db.$transaction([
      db.downloadLog.deleteMany({ where: { resourceId: id } }),
      db.resourcePermission.deleteMany({ where: { resourceId: id } }),
      db.resource.delete({ where: { id } }),
    ])

    // 로컬 업로드 파일이면 디스크에서도 제거 (실패해도 DB 삭제는 유지)
    if (resource.filePath) {
      try {
        const abs = path.join(process.cwd(), 'public', resource.filePath)
        await unlink(abs)
      } catch (e) {
        console.warn('[admin/resources DELETE] file unlink skipped:', e)
      }
    }

    return NextResponse.json({ message: '삭제되었습니다.' })
  } catch (err) {
    console.error('[admin/resources DELETE]', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
