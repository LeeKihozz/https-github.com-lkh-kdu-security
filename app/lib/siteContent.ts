import { db } from './db'

// ---------- Types ----------
export type HomeContent = {
  hero: {
    eyebrow: string
    titleLine1: string
    deptHacking: string
    deptAi: string
    subtitle: string
    subtitleSmall: string
  }
  statsSection: { title: string; subtitle: string }
  resourceSection: { icon: string; title: string; body: string }
}

// ---------- Defaults ----------
export const defaultHomeContent: HomeContent = {
  hero: {
    eyebrow: 'Keukdong University',
    titleLine1: '극동대학교',
    deptHacking: '해킹보안학과',
    deptAi: '인공지능보안학과',
    subtitle: '학과 교육·연구 자료를 한곳에서',
    subtitleSmall: '강의자료 · 실습자료 · 연구자료 · 강의영상 아카이브',
  },
  statsSection: {
    title: '자료실 현황',
    subtitle: '현재 자료실에 등록된 자료 구성을 실시간으로 보여줍니다.',
  },
  resourceSection: {
    icon: '📁',
    title: '자료실 이용 안내',
    body: '학과 교육 자료, 연구 자료, 강의 영상 등을 자료실에서 확인하세요. 회원가입 후 관리자 승인이 완료되면 자료에 접근하실 수 있습니다.',
  },
}

export const PAGE_DEFAULTS = {
  home: defaultHomeContent,
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
