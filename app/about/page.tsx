import Link from 'next/link'

export const metadata = {
  title: '학과소개 | 극동대학교 해킹보안학과·인공지능보안학과',
}

const TRACKS = [
  { icon: '🔐', name: '해킹보안', desc: '시스템 취약점 분석, 침투 테스트, 버그바운티, 보안 솔루션 개발' },
  { icon: '🤖', name: 'AI·인공지능보안', desc: 'AI 기반 위협 탐지, 머신러닝 보안, 딥러닝 이상탐지, LLM 보안' },
  { icon: '🔍', name: '디지털 포렌식', desc: '디지털 증거 수집·분석, 사이버 범죄 수사, 로그 분석' },
  { icon: '☁️', name: '클라우드·IoT 보안', desc: '클라우드 아키텍처 보안, IoT 디바이스 보안, 컨테이너 보안' },
  { icon: '🛡️', name: '융합·산업보안', desc: '물리·사이버 융합보안, 군사보안, 에너지 IT 보안, 스마트팩토리' },
  { icon: '🚨', name: '보안관제·침해대응', desc: 'SOC 운영, SIEM, 침해사고 분석·대응, 사이버위협 인텔리전스' },
]

const CAREERS = [
  '정보보호 전문기업 (안랩, SK쉴더스, 이글루시큐리티, 윈스 등)',
  '공공기관 보안팀 (국정원, 경찰청 사이버수사대, 선관위 등)',
  '대기업 IT보안팀 (삼성, LG, 롯데, SK 등)',
  '공기업·발전사 보안팀 (한국중부발전, 한수원, 한전 등)',
  '국방·군 사이버사령부',
  '금융보안원, 금융기관 보안팀',
  '보안관제·컨설팅 전문기업',
  '정보보안 석·박사 대학원 진학',
]

const CERTS = [
  '정보보안기사', '정보처리기사', 'CISSP', 'CEH',
  'CISA', '디지털포렌식전문가', 'AWS 보안 전문가', 'OSCP',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">학과 소개</h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            극동대학교 해킹보안학과·인공지능보안학과는 AI와 사이버보안을 융합하여<br />
            <span className="text-blue-400 font-semibold">실전형 정보보호 전문 인재</span>를 양성하는 학과입니다.
          </p>
        </div>
      </section>

      {/* 교육 목표 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">교육 목표</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-blue-600 font-bold text-lg mb-2">🎯 실전 역량</div>
                <p className="text-slate-700 text-sm leading-relaxed">실습 중심 교육으로 현장에서 즉시 활용 가능한 보안 실무 능력 배양</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <div className="text-indigo-600 font-bold text-lg mb-2">🔬 연구 역량</div>
                <p className="text-slate-700 text-sm leading-relaxed">AI·사이버보안 융합 연구를 통한 첨단 정보보호 기술 개발 능력 함양</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-green-600 font-bold text-lg mb-2">🌐 글로벌 역량</div>
                <p className="text-slate-700 text-sm leading-relaxed">국제 자격증 취득 및 글로벌 보안 트렌드를 선도하는 전문가 양성</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 교육 트랙 */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">핵심 교육 분야</h2>
          <p className="text-slate-500 text-center mb-10">해킹보안·인공지능보안·디지털포렌식·클라우드보안·AI보안·융합보안 분야 중심 교육과 연구</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRACKS.map((track, i) => (
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">주요 진로 분야</h2>
              <ul className="space-y-3">
                {CAREERS.map((career, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1 shrink-0">✓</span>
                    <span className="text-slate-700">{career}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">취득 가능 자격증</h2>
              <div className="grid grid-cols-2 gap-3">
                {CERTS.map((cert, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-medium">
                    {cert}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 text-sm font-semibold mb-1">🏆 취업 실적 38명+</p>
                <p className="text-blue-700 text-sm">한국중부발전, 롯데정보통신, SK쉴더스, 안랩, 선관위 등 보안 분야 주요 기업 취업</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-slate-400 mb-8">학과 실적, 교수진 정보, 자료실을 확인해보세요.</p>
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
