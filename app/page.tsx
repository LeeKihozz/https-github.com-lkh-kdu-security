import Link from 'next/link'
import { db } from './lib/db'
import { getPageContent } from './lib/siteContent'

async function getHomeData() {
  const [faculty, achievements, socialLinks] = await Promise.all([
    db.faculty.findMany({ where: { isVisible: true }, orderBy: { displayOrder: 'asc' }, take: 4 }),
    db.achievement.groupBy({ by: ['category'], where: { isVisible: true }, _count: { category: true } }),
    db.socialLink.findMany({ where: { isVisible: true }, orderBy: { displayOrder: 'asc' } }),
  ])
  return { faculty, achievements, socialLinks }
}

const KPI_MAP: Record<string, { label: string; suffix: string; color: string }> = {
  RESEARCH: { label: '연구수주', suffix: '건', color: 'text-blue-400' },
  AWARD: { label: '수상 실적', suffix: '건', color: 'text-yellow-400' },
  EMPLOYMENT: { label: '취업처', suffix: '개', color: 'text-green-400' },
  PAPER: { label: '논문 실적', suffix: '편', color: 'text-purple-400' },
  PATENT: { label: '특허', suffix: '건', color: 'text-orange-400' },
  COURSE: { label: '전공 교과목', suffix: '개', color: 'text-cyan-400' },
  ACTIVITY: { label: '비교과 활동', suffix: '건', color: 'text-pink-400' },
  CERTIFICATE: { label: '자격증 항목', suffix: '개', color: 'text-indigo-400' },
}

function SnsIcon({ type }: { type: string }) {
  if (type === 'INSTAGRAM') {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  }
  if (type === 'YOUTUBE') {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

export default async function HomePage() {
  const { faculty, achievements, socialLinks } = await getHomeData()
  const content = await getPageContent('home')

  const kpiData = achievements
    .map((a) => ({
      ...KPI_MAP[a.category],
      count: a._count.category,
      category: a.category,
    }))
    .filter((a) => a.label)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
          <p className="text-blue-400 font-semibold text-sm tracking-widest uppercase mb-4">{content.hero.eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {content.hero.titleLine1}<br />
            <span className="text-blue-400">{content.hero.deptHacking}</span> · <span className="text-indigo-400">{content.hero.deptAi}</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {content.hero.subtitle}<br />
            <span className="text-slate-400 text-base">{content.hero.subtitleSmall}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/achievements" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              학과 실적 보기
            </Link>
            <Link href="/faculty" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-colors">
              교수진 보기
            </Link>
            <Link href="/resources" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
              자료실 바로가기
            </Link>
          </div>
        </div>
      </section>

      {/* SNS Links */}
      <section className="bg-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-white font-semibold text-lg mb-8">소통 채널</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-all hover:scale-105 group min-h-[120px] justify-center"
              >
                <span className={
                  link.type === 'INSTAGRAM' ? 'text-pink-400' :
                  link.type === 'YOUTUBE' ? 'text-red-400' : 'text-blue-400'
                }>
                  <SnsIcon type={link.type} />
                </span>
                <span className="font-medium text-sm">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{content.kpiSection.title}</h2>
            <p className="text-slate-500">{content.kpiSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpiData.slice(0, 8).map((kpi, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 text-center border border-slate-200 hover:shadow-md transition-shadow">
                <div className={`text-3xl font-bold mb-1 ${kpi.color}`}>{kpi.count}{kpi.suffix}</div>
                <div className="text-slate-600 text-sm font-medium">{kpi.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/achievements" className="inline-block px-6 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
              상세 실적 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Competencies */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{content.competenciesSection.title}</h2>
            <p className="text-slate-400">{content.competenciesSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {content.competencies.map((c, i) => (
              <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-white mb-2">{c.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Preview */}
      {faculty.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">교수진</h2>
              <p className="text-slate-500">AI·사이버보안 분야 전문 교수진</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {faculty.map((f) => (
                <Link
                  key={f.id}
                  href={`/faculty/${f.id}`}
                  className="text-center p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all hover:border-blue-300 group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {f.name[0]}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{f.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{f.position}</p>
                  {f.major && <p className="text-slate-400 text-xs mt-1">{f.major}</p>}
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/faculty" className="inline-block px-6 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                전체 교수진 보기 →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Resource Info */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-4xl mb-4">{content.resourceSection.icon}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{content.resourceSection.title}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed whitespace-pre-line">
              {content.resourceSection.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/resources" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                자료실 바로가기
              </Link>
              <Link href="/register" className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-medium transition-colors">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
