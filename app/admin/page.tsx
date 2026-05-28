import Link from 'next/link'
import { db } from '@/app/lib/db'

export default async function AdminDashboard() {
  const [pendingUsers, resources, achievements, faculty] = await Promise.all([
    db.user.count({ where: { status: 'PENDING' } }),
    db.resource.count(),
    db.achievement.count(),
    db.faculty.count(),
  ])

  const recentDownloads = await db.downloadLog.findMany({
    take: 5,
    orderBy: { downloadedAt: 'desc' },
    include: {
      user: { select: { name: true } },
      resource: { select: { title: true } },
    },
  })

  const stats = [
    { label: '승인 대기 사용자', value: pendingUsers, href: '/admin/users', alert: pendingUsers > 0, color: 'text-red-600' },
    { label: '등록된 자료', value: resources, href: '/admin/resources', color: 'text-blue-600' },
    { label: '실적 데이터', value: achievements, href: '/admin/achievements', color: 'text-green-600' },
    { label: '교수진', value: faculty, href: '/admin/faculty', color: 'text-purple-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">관리자 대시보드</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${s.alert ? 'border-red-300' : 'border-slate-200'}`}
          >
            <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-slate-600 text-sm">{s.label}</div>
            {s.alert && <div className="text-red-500 text-xs mt-1">⚠ 승인 필요</div>}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">빠른 작업</h2>
          <div className="space-y-2">
            <Link href="/admin/users" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-700">사용자 승인/관리</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link href="/admin/resources/new" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-700">자료 등록</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link href="/admin/achievements" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-700">실적 추가</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link href="/admin/faculty" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-sm font-medium text-slate-700">교수진 관리</span>
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">최근 다운로드</h2>
          {recentDownloads.length === 0 ? (
            <p className="text-slate-400 text-sm">다운로드 기록이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentDownloads.map((log) => (
                <div key={log.id} className="text-sm">
                  <span className="font-medium text-slate-700">{log.user.name}</span>
                  <span className="text-slate-400"> 님이 </span>
                  <span className="text-blue-600">{log.resource.title}</span>
                  <span className="text-slate-400"> 다운로드</span>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {new Date(log.downloadedAt).toLocaleString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
