import { db } from './db'

// ---------- Types ----------
export type IconCard = { icon: string; label: string; desc: string }
export type Track = { icon: string; name: string; desc: string }
export type Goal = { icon: string; title: string; desc: string }

export type HomeContent = {
  hero: {
    eyebrow: string
    titleLine1: string
    deptHacking: string
    deptAi: string
    subtitle: string
    subtitleSmall: string
  }
  kpiSection: { title: string; subtitle: string }
  competenciesSection: { title: string; subtitle: string }
  competencies: IconCard[]
  resourceSection: { icon: string; title: string; body: string }
}

export type AboutContent = {
  hero: { title: string; bodyBefore: string; highlight: string; bodyAfter: string }
  goalsTitle: string
  goals: Goal[]
  tracksTitle: string
  tracksSubtitle: string
  tracks: Track[]
  careersTitle: string
  careers: string[]
  certsTitle: string
  certs: string[]
  employmentNote: { title: string; body: string }
  ctaTitle: string
  ctaSubtitle: string
}

// ---------- Defaults ----------
export const defaultHomeContent: HomeContent = {
  hero: {
    eyebrow: 'Keukdong University',
    titleLine1: '극동대학교',
    deptHacking: '해킹보안학과',
    deptAi: '인공지능보안학과',
    subtitle: 'AI와 사이버보안을 융합한 실전형 보안 인재 양성',
    subtitleSmall: '실습 중심 교육 · 연구수주 · 학술성과 · 취업성과',
  },
  kpiSection: {
    title: '학과 주요 실적',
    subtitle: '해킹보안·인공지능보안 분야 교육·연구·취업 성과',
  },
  competenciesSection: {
    title: '학과 핵심 역량',
    subtitle: '해킹보안·AI보안·디지털포렌식·클라우드보안·융합보안·보안관제',
  },
  competencies: [
    { icon: '🔐', label: '해킹보안', desc: '침투 테스트, 취약점 분석, 해킹 대응' },
    { icon: '🤖', label: 'AI 보안', desc: '머신러닝 기반 위협 탐지, AI 보안 기술' },
    { icon: '🔍', label: '디지털 포렌식', desc: '디지털 증거 수집, 사이버 범죄 수사' },
    { icon: '☁️', label: '클라우드 보안', desc: '클라우드 아키텍처 보안, 멀티클라우드' },
    { icon: '🛡️', label: '융합보안', desc: '물리·사이버 융합보안, 산업보안' },
    { icon: '🚨', label: '보안관제', desc: '침해대응, SIEM, 통합 보안관제' },
  ],
  resourceSection: {
    icon: '📁',
    title: '자료실',
    body: '학과 교육 자료, 연구 자료, 강의 영상 등을 자료실에서 확인하세요. 회원가입 후 관리자 승인이 완료되면 자료에 접근하실 수 있습니다.',
  },
}

export const defaultAboutContent: AboutContent = {
  hero: {
    title: '학과 소개',
    bodyBefore: '극동대학교 해킹보안학과·인공지능보안학과는 AI와 사이버보안을 융합하여 ',
    highlight: '실전형 정보보호 전문 인재',
    bodyAfter: '를 양성하는 학과입니다.',
  },
  goalsTitle: '교육 목표',
  goals: [
    { icon: '🎯', title: '실전 역량', desc: '실습 중심 교육으로 현장에서 즉시 활용 가능한 보안 실무 능력 배양' },
    { icon: '🔬', title: '연구 역량', desc: 'AI·사이버보안 융합 연구를 통한 첨단 정보보호 기술 개발 능력 함양' },
    { icon: '🌐', title: '글로벌 역량', desc: '국제 자격증 취득 및 글로벌 보안 트렌드를 선도하는 전문가 양성' },
  ],
  tracksTitle: '핵심 교육 분야',
  tracksSubtitle: '해킹보안·인공지능보안·디지털포렌식·클라우드보안·AI보안·융합보안 분야 중심 교육과 연구',
  tracks: [
    { icon: '🔐', name: '해킹보안', desc: '시스템 취약점 분석, 침투 테스트, 버그바운티, 보안 솔루션 개발' },
    { icon: '🤖', name: 'AI·인공지능보안', desc: 'AI 기반 위협 탐지, 머신러닝 보안, 딥러닝 이상탐지, LLM 보안' },
    { icon: '🔍', name: '디지털 포렌식', desc: '디지털 증거 수집·분석, 사이버 범죄 수사, 로그 분석' },
    { icon: '☁️', name: '클라우드·IoT 보안', desc: '클라우드 아키텍처 보안, IoT 디바이스 보안, 컨테이너 보안' },
    { icon: '🛡️', name: '융합·산업보안', desc: '물리·사이버 융합보안, 군사보안, 에너지 IT 보안, 스마트팩토리' },
    { icon: '🚨', name: '보안관제·침해대응', desc: 'SOC 운영, SIEM, 침해사고 분석·대응, 사이버위협 인텔리전스' },
  ],
  careersTitle: '주요 진로 분야',
  careers: [
    '정보보호 전문기업 (안랩, SK쉴더스, 이글루시큐리티, 윈스 등)',
    '공공기관 보안팀 (국정원, 경찰청 사이버수사대, 선관위 등)',
    '대기업 IT보안팀 (삼성, LG, 롯데, SK 등)',
    '공기업·발전사 보안팀 (한국중부발전, 한수원, 한전 등)',
    '국방·군 사이버사령부',
    '금융보안원, 금융기관 보안팀',
    '보안관제·컨설팅 전문기업',
    '정보보안 석·박사 대학원 진학',
  ],
  certsTitle: '취득 가능 자격증',
  certs: ['정보보안기사', '정보처리기사', 'CISSP', 'CEH', 'CISA', '디지털포렌식전문가', 'AWS 보안 전문가', 'OSCP'],
  employmentNote: {
    title: '🏆 취업 실적 38명+',
    body: '한국중부발전, 롯데정보통신, SK쉴더스, 안랩, 선관위 등 보안 분야 주요 기업 취업',
  },
  ctaTitle: '지금 바로 시작하세요',
  ctaSubtitle: '학과 실적, 교수진 정보, 자료실을 확인해보세요.',
}

export const PAGE_DEFAULTS = {
  home: defaultHomeContent,
  about: defaultAboutContent,
} as const

export type PageKey = keyof typeof PAGE_DEFAULTS

// ---------- Helpers ----------
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

// Deep-merge stored content over defaults so newly added default fields survive.
function deepMerge<T>(base: T, override: unknown): T {
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base }
    for (const k of Object.keys(base)) {
      if (k in override) out[k] = deepMerge((base as Record<string, unknown>)[k], override[k])
    }
    return out as T
  }
  return (override === undefined ? base : (override as T))
}

export async function getPageContent<K extends PageKey>(key: K): Promise<(typeof PAGE_DEFAULTS)[K]> {
  const base = PAGE_DEFAULTS[key]
  try {
    const row = await db.siteContent.findUnique({ where: { key } })
    if (!row) return base
    const parsed = JSON.parse(row.value)
    return deepMerge(base, parsed)
  } catch {
    return base
  }
}
