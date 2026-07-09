import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import fs from 'fs'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const { id } = await params
    const isAdmin = session.role === 'ADMIN'

    const resource = await db.resource.findUnique({
      where: { id, isPublished: true },
      include: {
        permissions: { where: { userId: session.userId } },
      },
    })

    if (!resource) return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 })

    const hasPermission = isAdmin || resource.permissions.length > 0
    if (!hasPermission) {
      return NextResponse.json({ error: '관리자 승인 후 열람 가능합니다.' }, { status: 403 })
    }

    // Log download
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined
    await db.downloadLog.create({
      data: {
        userId: session.userId,
        resourceId: id,
        ipAddress: ip,
      },
    }).catch(() => {})

    // Return drive URL for Google Drive links (never expose to unauthorized users)
    if (resource.storageType === 'GOOGLE_DRIVE_LINK' || resource.storageType === 'EXTERNAL_LINK') {
      return NextResponse.json({ driveUrl: resource.driveUrl })
    }

    // File download
    if (resource.storageType === 'FILE' && resource.filePath) {
      const filePath = path.join(process.cwd(), 'public', resource.filePath)
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 })
      }

      const fileBuffer = fs.readFileSync(filePath)
      const filename = resource.originalFileName ?? path.basename(filePath)

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          'Content-Type': 'application/octet-stream',
        },
      })
    }

    return NextResponse.json({ error: '다운로드할 수 없는 자료입니다.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
