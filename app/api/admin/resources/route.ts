import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { requireAdmin } from '@/app/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isAllowedFileType, MAX_FILE_SIZE } from '@/app/lib/utils'

export async function GET() {
  try {
    await requireAdmin()
    const resources = await db.resource.findMany({
      include: {
        uploadedBy: { select: { name: true } },
        permissions: { include: { user: { select: { id: true, name: true, username: true } } } },
        _count: { select: { downloadLogs: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ resources })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const contentType = req.headers.get('content-type') ?? ''

    let data: Record<string, unknown>

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const title = formData.get('title') as string
      const description = formData.get('description') as string | null
      const resourceType = formData.get('resourceType') as string
      const driveUrl = formData.get('driveUrl') as string | null
      const storageType = formData.get('storageType') as string

      data = { title, description, resourceType, storageType, uploadedById: session.userId }

      if (file && file.size > 0) {
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: '파일 크기는 50MB를 초과할 수 없습니다.' }, { status: 400 })
        }
        if (!isAllowedFileType(file.name)) {
          return NextResponse.json({ error: '허용되지 않는 파일 형식입니다.' }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
        const filePath = path.join(uploadDir, filename)
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        data.filePath = `/uploads/${filename}`
        data.originalFileName = file.name
      }

      if (driveUrl) data.driveUrl = driveUrl
    } else {
      const body = await req.json()
      data = { ...body, uploadedById: session.userId }
    }

    const resource = await db.resource.create({ data: data as Parameters<typeof db.resource.create>[0]['data'] })
    return NextResponse.json({ resource }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
