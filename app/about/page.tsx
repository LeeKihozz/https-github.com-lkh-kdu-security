import Link from 'next/link'
import { getPageContent } from '@/app/lib/siteContent'

export const metadata = {
  title: '학과소개 | 극동대학교 해킹보안학과·인공지능보안학과',
}

const GOAL_STYLES = [
  { box: 'bg-blue-50 border-blue-200', text: 'text-blue-600' },
  { box: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-600' },
  { box: 'bg-green-50 border-green-200', text: 'text-green-600' },
  { box: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
  { box: 'bg-rose-50 border-rose-200', text: 'text-rose-600' },
  { box: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-600' },
]

export default async function AboutPage() {
  const content = await getPageContent('about')

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.hero.title}</h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            {content.hero.bodyBefore}
            <span className="text-blue-400 font-semibold">{content.hero.highlight}</span>
            {content.hero.bodyAfter}
          </p>
        </div>
      </section>

      {/* 교육 목표 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{content.goalsTitle}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.goals.map((goal, i) => {
                const style = GOAL_STYLES[i % GOAL_STYLES.length]
                return (
                  <div key={i} className={`border rounded-xl p-6 ${style.box}`}>
                    <div className={`font-bold text-lg mb-2 ${style.text}`}>{goal.icon} {goal.title}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{goal.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 교육 트랙 */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">{content.tracksTitle}</h2>
          <p className="text-slate-500 text-center mb-10">{content.tracksSubtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.tracks.map((track, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{track.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{track.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진로 분야 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.careersTitle}</h2>
              <ul className="space-y-3">
                {content.careers.map((career, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1 shrink-0">✓</span>
                    <span className="text-slate-700">{career}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.certsTitle}</h2>
              <div className="grid grid-cols-2 gap-3">
                {content.certs.map((cert, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-medium">
                    {cert}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 text-sm font-semibold mb-1">{content.employmentNote.title}</p>
                <p className="text-blue-700 text-sm">{content.employmentNote.body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{content.ctaTitle}</h2>
          <p className="text-slate-400 mb-8">{content.ctaSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/achievements" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              학과 실적 보기
            </Link>
            <Link href="/faculty" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-colors">
              교수진 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
