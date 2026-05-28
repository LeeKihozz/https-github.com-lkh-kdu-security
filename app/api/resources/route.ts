import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const isAdmin = session.role === 'ADMIN'
    const isApproved = session.status === 'APPROVED'

    if (!isAdmin && !isApproved) {
      return NextResponse.json({ error: '관리자 승인 후 이용 가능합니다.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const resourceType = searchParams.get('type') ?? ''

    const resources = await db.resource.findMany({
      where: {
        isPublished: true,
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }),
        ...(resourceType && resourceType !== 'ALL' && { resourceType: resourceType as never }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        resourceType: true,
        storageType: true,
        thumbnailUrl: true,
        originalFileName: true,
        isPublished: true,
        createdAt: true,
        uploadedBy: { select: { name: true } },
        permissions: isAdmin ? undefined : {
          where: { userId: session.userId },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = resources.map((r) => ({
      ...r,
      hasPermission: isAdmin || (r.permissions && r.permissions.length > 0),
    }))

    return NextResponse.json({ resources: result })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
