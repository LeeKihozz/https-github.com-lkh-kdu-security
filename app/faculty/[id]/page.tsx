import Link from 'next/link'
import { db } from '@/app/lib/db'
import { notFound } from 'next/navigation'

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const faculty = await db.faculty.findUnique({ where: { id, isVisible: true } })
  if (!faculty) notFound()

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/faculty" className="text-slate-400 hover:text-white text-sm mb-4 inline-block">
            ← 교수진 목록
          </Link>
          <div className="flex items-center gap-6">
            {faculty.photoUrl ? (
              <img src={faculty.photoUrl} alt={faculty.name} className="w-24 h-24 rounded-full object-cover border-2 border-white/20" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                {faculty.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{faculty.name}</h1>
              <p className="text-slate-300 mt-1">{faculty.position}</p>
              {faculty.major && <p className="text-slate-400 text-sm mt-1">{faculty.major}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {faculty.email && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">이메일</p>
              <p className="text-slate-800 text-sm">{faculty.email}</p>
            </div>
          )}
          {faculty.phone && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">연락처</p>
              <p className="text-slate-800 text-sm">{faculty.phone}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {faculty.summary && (
            <Card title="소개">
              <p className="text-slate-700 leading-relaxed">{faculty.summary}</p>
            </Card>
          )}
          {faculty.education && (
            <Card title="학력">
              <Multiline text={faculty.education} />
            </Card>
          )}
          {faculty.career && (
            <Card title="주요 경력">
              <Multiline text={faculty.career} />
            </Card>
          )}
          {faculty.researchAreas && (
            <Card title="연구 분야">
              <Multiline text={faculty.researchAreas} />
            </Card>
          )}
          {faculty.papers && (
            <Card title="주요 논문">
              <Multiline text={faculty.papers} />
            </Card>
          )}
          {faculty.achievements && (
            <Card title="대표 실적">
              <Multiline text={faculty.achievements} />
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-bold text-slate-900 text-lg mb-4 pb-3 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  )
}

function Multiline({ text }: { text: string }) {
  return (
    <ul className="space-y-2">
      {text.split('\n').filter(Boolean).map((line, i) => (
        <li key={i} className="text-slate-700 text-sm leading-relaxed flex gap-2">
          <span className="text-blue-400 shrink-0">•</span>
          <span>{line.replace(/^[-•]\s*/, '')}</span>
        </li>
      ))}
    </ul>
  )
}
