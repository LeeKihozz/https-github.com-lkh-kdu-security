import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'

/**
 * 승인된 회원 전원에게 자료 열람 권한을 일괄 부여한다.
 * body.resourceIds 가 없으면 전체 자료를 대상으로 한다.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()

    let resourceIds: string[] | undefined
    try {
      const body = await req.json()
      if (Array.isArray(body?.resourceIds) && body.resourceIds.length > 0) {
        resourceIds = body.resourceIds as string[]
      }
    } catch {
      // 본문 없이 호출하면 전체 대상
    }

    const [users, resources, existing] = await Promise.all([
      db.user.findMany({ where: { role: 'USER', status: 'APPROVED' }, select: { id: true } }),
      db.resource.findMany({
        where: resourceIds ? { id: { in: resourceIds } } : {},
        select: { id: true },
      }),
      db.resourcePermission.findMany({ select: { userId: true, resourceId: true } }),
    ])

    if (users.length === 0) {
      return NextResponse.json({ granted: 0, users: 0, resources: resources.length, message: '승인된 회원이 없습니다.' })
    }

    const have = new Set(existing.map((p) => p.userId + '|' + p.resourceId))
    const rows: { userId: string; resourceId: string; grantedById: string }[] = []
    for (const r of resources) {
      for (const u of users) {
        if (have.has(u.id + '|' + r.id)) continue
        rows.push({ userId: u.id, resourceId: r.id, grantedById: session.userId })
      }
    }

    if (rows.length > 0) {
      // SQLite 변수 한도를 고려해 나눠서 삽입
      for (let i = 0; i < rows.length; i += 200) {
        await db.resourcePermission.createMany({ data: rows.slice(i, i + 200) })
      }
    }

    return NextResponse.json({
      granted: rows.length,
      users: users.length,
      resources: resources.length,
      message: `${users.length}명에게 ${resources.length}건의 자료 권한을 정리했습니다. (신규 ${rows.length}건)`,
    })
  } catch (err) {
    console.error('[admin/permissions/grant-all]', err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
