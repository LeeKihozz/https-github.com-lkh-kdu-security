import Link from 'next/link'
import { db } from './lib/db'
import { getPageContent } from './lib/siteContent'
import { getResourceStats } from './lib/resourceStats'
import ResourceStatsBoard from './components/ResourceStatsBoard'

// 자료실 내용이 항상 실시간으로 반영되도록 정적 캐시를 사용하지 않는다.
export const dynamic = 'force-dynamic'

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
  const [content, stats, socialLinks] = await Promise.all([
    getPageContent('home'),
    getResourceStats(),
    db.socialLink.findMany({ where: { isVisible: true }, orderBy: { displayOrder: 'asc' } }),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
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
            <Link href="/resources" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              자료실 바로가기
            </Link>
            <Link href="/register" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-colors">
              회원가입
            </Link>
          </div>

          {/* 히어로 요약 수치 */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl py-5">
              <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-slate-400 text-xs mt-1">전체 자료</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl py-5">
              <div className="text-3xl font-bold text-emerald-400">{stats.byType.length}</div>
              <div className="text-slate-400 text-xs mt-1">자료 유형</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl py-5">
              <div className="text-3xl font-bold text-indigo-400">{stats.recentCount}</div>
              <div className="text-slate-400 text-xs mt-1">최근 30일 등록</div>
            </div>
          </div>
        </div>
      </section>

      {/* 자료실 통계 (실시간) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <ResourceStatsBoard
            initial={stats}
            title={content.statsSection.title}
            subtitle={content.statsSection.subtitle}
          />
        </div>
      </section>

      {/* 자료실 안내 */}
      <section className="py-16 bg-white">
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

      {/* SNS Links */}
      {socialLinks.length > 0 && (
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
                  className="flex flex-col items-center gap-3 p-6 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-all hover:scale-105 min-h-[120px] justify-center"
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
      )}
    </div>
  )
}
