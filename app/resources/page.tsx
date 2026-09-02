'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  RESOURCE_TYPE_LABELS,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_CATEGORY_ORDER,
  RESOURCE_CATEGORY_META,
} from '@/app/lib/utils'

type Resource = {
  id: string
  title: string
  description: string | null
  resourceType: string
  category: string
  groupName: string | null
  storageType: string
  originalFileName: string | null
  createdAt: string
  hasPermission: boolean
  uploadedBy: { name: string }
}

type Folder = {
  name: string
  category: string
  items: Resource[]
  latest: number
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

function CategoryTag({ category }: { category: string }) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">
      <span>{RESOURCE_CATEGORY_META[category]?.icon ?? '📦'}</span>
      {RESOURCE_CATEGORY_LABELS[category] ?? category}
    </span>
  )
}

function ResourcesInner() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [openFolder, setOpenFolder] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  // 홈의 분류 카드에서 넘어온 ?category= 값을 초기 선택으로 사용한다
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') ?? 'ALL')

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login?redirect=/resources')
          return null
        }
        if (res.status === 403) {
          setError('관리자 승인 후 이용 가능합니다. 가입 승인을 기다려주세요.')
          setLoading(false)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setResources(data.resources ?? [])
          setLoading(false)
        }
      })
      .catch(() => {
        setError('자료를 불러올 수 없습니다.')
        setLoading(false)
      })
  }, [router])

  const matchesSearch = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return (r: Resource) =>
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description ?? '').toLowerCase().includes(q) ||
      (r.groupName ?? '').toLowerCase().includes(q)
  }, [searchQuery])

  const searched = useMemo(() => resources.filter(matchesSearch), [resources, matchesSearch])

  // 분류 탭 (자료가 있는 분류만)
  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    resources.forEach((r) => { counts[r.category] = (counts[r.category] ?? 0) + 1 })
    return RESOURCE_CATEGORY_ORDER.filter((c) => counts[c] > 0).map((c) => ({ key: c as string, count: counts[c] }))
  }, [resources])

  // 전체 탭: 제목 중심 목록
  const allList = useMemo(
    () => [...searched].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [searched],
  )

  // 분류 탭: 폴더(묶음) 단위 목록
  const folders = useMemo(() => {
    const inCat = searched.filter((r) => r.category === activeCategory)
    const map = new Map<string, Folder>()
    for (const r of inCat) {
      const name = r.groupName?.trim() || r.title
      if (!map.has(name)) map.set(name, { name, category: r.category, items: [], latest: 0 })
      const f = map.get(name)!
      f.items.push(r)
      f.latest = Math.max(f.latest, +new Date(r.createdAt))
    }
    return Array.from(map.values()).sort((a, b) => b.latest - a.latest)
  }, [searched, activeCategory])

  async function handleOpen(resource: Resource) {
    if (!resource.hasPermission) return
    setDownloading(resource.id)
    try {
      const res = await fetch(`/api/resources/${resource.id}/download`)
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? '열기에 실패했습니다.')
        return
      }
      if (resource.storageType === 'GOOGLE_DRIVE_LINK' || resource.storageType === 'EXTERNAL_LINK') {
        const data = await res.json()
        if (data.driveUrl) window.open(data.driveUrl, '_blank')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = resource.originalFileName ?? resource.title
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('처리 중 오류가 발생했습니다.')
    } finally {
      setDownloading(null)
    }
  }

  function selectCategory(c: string) {
    setActiveCategory(c)
    setOpenFolder(null)
  }

  const openLabel = (r: Resource) =>
    r.storageType === 'GOOGLE_DRIVE_LINK' || r.storageType === 'EXTERNAL_LINK' ? '열기' : '다운로드'

  /** 한 자료를 직사각형 한 줄로 */
  function ResourceRow({ r, showCategory }: { r: Resource; showCategory?: boolean }) {
    const enabled = r.hasPermission
    return (
      <div
        onClick={() => enabled && handleOpen(r)}
        className={`flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 last:border-b-0 transition-colors ${
          enabled ? 'hover:bg-blue-50/60 cursor-pointer' : 'opacity-60'
        }`}
      >
        {showCategory && <CategoryTag category={r.category} />}
        <span className="shrink-0 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
          {RESOURCE_TYPE_LABELS[r.resourceType] ?? r.resourceType}
        </span>
        <span className="flex-1 min-w-0 truncate text-slate-800 font-medium">
          <HighlightText text={r.title} query={searchQuery} />
        </span>
        <span className="shrink-0 hidden sm:block text-xs text-slate-400">
          {new Date(r.createdAt).toLocaleDateString('ko-KR')}
        </span>
        <span className="shrink-0 text-xs font-medium text-blue-600 w-16 text-right">
          {!enabled ? <span className="text-slate-400">🔒 제한</span>
            : downloading === r.id ? '여는 중…' : openLabel(r) + ' →'}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">자료실</h1>
          <p className="text-slate-400 mb-7 text-sm">교육 · 워크샵 · 컨퍼런스 · 세미나 자료 아카이브</p>

          {!loading && !error && (
            <div className="max-w-xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="자료 제목, 행사명, 강의명으로 검색..."
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" aria-label="검색 초기화">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 분류 메뉴 */}
      {!loading && !error && resources.length > 0 && (
        <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
          <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
            <button
              onClick={() => selectCategory('ALL')}
              className={`shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              전체 <span className="text-xs text-slate-400 ml-1">{resources.length}</span>
            </button>
            {categories.map(({ key, count }) => (
              <button
                key={key}
                onClick={() => selectCategory(key)}
                className={`shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeCategory === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="mr-1">{RESOURCE_CATEGORY_META[key]?.icon}</span>
                {RESOURCE_CATEGORY_LABELS[key] ?? key}
                <span className="text-xs text-slate-400 ml-1">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="max-w-5xl mx-auto px-4 py-8">
        {loading && <div className="text-center py-20 text-slate-400">로딩 중...</div>}

        {error && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">접근 제한</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <a href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">로그인</a>
              <a href="/register" className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300">회원가입</a>
            </div>
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p>등록된 자료가 없습니다.</p>
          </div>
        )}

        {/* 전체: 제목 중심 목록 */}
        {!loading && !error && resources.length > 0 && activeCategory === 'ALL' && (
          <>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-bold text-slate-900">전체 자료</h2>
              <span className="text-sm text-slate-500">{allList.length}건</span>
            </div>
            {allList.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-slate-600">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {allList.map((r) => <ResourceRow key={r.id} r={r} showCategory />)}
              </div>
            )}
          </>
        )}

        {/* 분류 선택: 폴더 단위 목록 */}
        {!loading && !error && resources.length > 0 && activeCategory !== 'ALL' && (
          <>
            <div className="mb-5 flex items-start gap-3">
              <span className="text-2xl">{RESOURCE_CATEGORY_META[activeCategory]?.icon ?? '📦'}</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{RESOURCE_CATEGORY_LABELS[activeCategory] ?? activeCategory}</h2>
                <p className="text-sm text-slate-500">
                  {RESOURCE_CATEGORY_META[activeCategory]?.desc} · 폴더 {folders.length}개
                </p>
              </div>
            </div>

            {folders.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-slate-600">해당하는 자료가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {folders.map((f) => {
                  const open = openFolder === f.name
                  return (
                    <div key={f.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setOpenFolder(open ? null : f.name)}
                        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xl shrink-0">{open ? '📂' : '📁'}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-semibold text-slate-900 truncate">
                            <HighlightText text={f.name} query={searchQuery} />
                          </span>
                          <span className="block text-xs text-slate-400 mt-0.5">
                            자료 {f.items.length}건 · 최근 등록 {new Date(f.latest).toLocaleDateString('ko-KR')}
                          </span>
                        </span>
                        <span className="shrink-0 text-slate-400 text-sm">{open ? '▲ 접기' : '▼ 열기'}</span>
                      </button>
                      {open && (
                        <div className="border-t border-slate-100 bg-slate-50/50">
                          {f.items.map((r) => (
                            <div key={r.id}>
                              <ResourceRow r={r} />
                              {r.description && (
                                <p className="px-4 pb-3 -mt-2 text-xs text-slate-500 line-clamp-2">{r.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-20 text-center text-slate-400">로딩 중...</div>}>
      <ResourcesInner />
    </Suspense>
  )
}
