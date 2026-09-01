import { db } from './db'

export type ResourceStats = {
  total: number
  recentCount: number
  downloads: number
  contributors: number
  latestAt: string | null
  byType: { type: string; count: number }[]
  byStorage: { type: string; count: number }[]
  monthly: { label: string; count: number }[]
  generatedAt: string
}

/**
 * 자료실 공개 집계.
 * 개별 자료의 제목/파일 정보는 포함하지 않고, 실시간 수치만 반환한다.
 */
export async function getResourceStats(): Promise<ResourceStats> {
  const where = { isPublished: true } as const

  const now = new Date()
  const since30 = new Date(now)
  since30.setDate(since30.getDate() - 30)
  const monthStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [total, byType, byStorage, latest, downloads, contributors, recentCount, monthRows] =
    await Promise.all([
      db.resource.count({ where }),
      db.resource.groupBy({ by: ['resourceType'], where, _count: { resourceType: true } }),
      db.resource.groupBy({ by: ['storageType'], where, _count: { storageType: true } }),
      db.resource.findFirst({ where, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      db.downloadLog.count(),
      db.resource.findMany({ where, select: { uploadedById: true }, distinct: ['uploadedById'] }),
      db.resource.count({ where: { ...where, createdAt: { gte: since30 } } }),
      db.resource.findMany({
        where: { ...where, createdAt: { gte: monthStart } },
        select: { createdAt: true },
      }),
    ])

  // 최근 6개월 월별 등록 추이
  const months: { key: string; label: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${d.getMonth() + 1}월`,
      count: 0,
    })
  }
  for (const row of monthRows) {
    const d = new Date(row.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const bucket = months.find((m) => m.key === key)
    if (bucket) bucket.count += 1
  }

  return {
    total,
    recentCount,
    downloads,
    contributors: contributors.length,
    latestAt: latest?.createdAt ? new Date(latest.createdAt).toISOString() : null,
    byType: byType
      .map((t) => ({ type: t.resourceType as string, count: t._count.resourceType }))
      .sort((a, b) => b.count - a.count),
    byStorage: byStorage
      .map((s) => ({ type: s.storageType as string, count: s._count.storageType }))
      .sort((a, b) => b.count - a.count),
    monthly: months.map(({ label, count }) => ({ label, count })),
    generatedAt: new Date().toISOString(),
  }
}
