import Link from 'next/link'
import { db } from '@/app/lib/db'

export const metadata = {
  title: '교수진 | 극동대학교 해킹보안학과·인공지능보안학과',
}

export default async function FacultyPage() {
  const faculty = await db.faculty.findMany({
    where: { isVisible: true },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">교수진 소개</h1>
          <p className="text-slate-400">AI·사이버보안 분야 전문 교수진</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((f) => (
            <Link
              key={f.id}
              href={`/faculty/${f.id}`}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group hover:border-blue-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {f.photoUrl ? (
                  <img src={f.photoUrl} alt={f.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {f.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{f.name}</h3>
                  <p className="text-slate-500 text-sm">{f.position}</p>
                  {f.major && <p className="text-slate-400 text-xs mt-0.5">{f.major}</p>}
                </div>
              </div>

              {f.researchAreas && (
                <div className="mb-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">연구분야</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{f.researchAreas}</p>
                </div>
              )}

              {f.email && (
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span>✉️</span> {f.email}
                </p>
              )}

              <div className="mt-4 text-xs text-blue-500 font-medium group-hover:underline">
                상세 보기 →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
