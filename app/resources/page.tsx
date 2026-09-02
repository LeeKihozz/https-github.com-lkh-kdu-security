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
  thumbnailUrl: string | null
  createdAt: string
  hasPermission: boolean
  uploadedBy: { name: string }
}

const typeColors: Record<string, string> = {
  VIDEO: 'bg-rose-100 text-rose-700',
  AUDIO: 'bg-purple-100 text-purple-700',
  PPT: 'bg-orange-100 text-orange-700',
  PDF: 'bg-blue-100 text-blue-700',
  ZIP: 'bg-amber-100 text-amber-700',
  DOCUMENT: 'bg-emerald-100 text-emerald-700',
  LINK: 'bg-cyan-100 text-cyan-700',
  OTHER: 'bg-slate-100 text-slate-700',
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

function ResourcesInner() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState('ALL')
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

  // 카테고리 탭 (자료가 있는 카테고리만)
  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    resources.forEach((r) => { counts[r.category] = (counts[r.category] ?? 0) + 1 })
    return RESOURCE_CATEGORY_ORDER.filter((c) => counts[c] > 0).map((c) => ({ key: c, count: counts[c] }))
  }, [resources])

  // 선택된 카테고리 안에서만 유형 필터를 제공
  const inCategory = useMemo(
    () => resources.filter((r) => activeCategory === 'ALL' || r.category === activeCategory),
    [resources, activeCategory],
  )

  const resourceTypes = useMemo(() => {
    const counts: Record<string, number> = {}
    inCategory.forEach((r) => { counts[r.resourceType] = (counts[r.resourceType] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [inCategory])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return inCategory.filter((r) => {
      const matchesType = activeType === 'ALL' || r.resourceType === activeType
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        (r.groupName ?? '').toLowerCase().includes(q) ||
        (r.originalFileName ?? '').toLowerCase().includes(q)
      return matchesType && matchesSearch
    })
  }, [inCategory, searchQuery, activeType])

  // 묶음(그룹) 단위로 정리 — 같은 행사·과정의 자료를 한 카드 묶음으로 보여준다
  const groups = useMemo(() => {
    const map = new Map<string, { name: string; category: string; items: Resource[] }>()
    for (const r of filtered) {
      const key = (r.groupName?.trim() || r.title) + '||' + r.category
      if (!map.has(key)) {
        map.set(key, { name: r.groupName?.trim() || r.title, category: r.category, items: [] })
      }
      map.get(key)!.items.push(r)
    }
    return Array.from(map.values()).sort((a, b) => {
      if (b.items.length !== a.items.length) return b.items.length - a.items.length
      return a.name.localeCompare(b.name, 'ko')
    })
  }, [filtered])

  async function handleDownload(resource: Resource) {
    if (!resource.hasPermission) return
    setDownloading(resource.id)
    try {
      const res = await fetch(`/api/resources/${resource.id}/download`)
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? '다운로드에 실패했습니다.')
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
      alert('다운로드 중 오류가 발생했습니다.')
    } finally {
      setDownloading(null)
    }
  }

  function selectCategory(c: string) {
    setActiveCategory(c)
    setActiveType('ALL')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">자료실</h1>
          <p className="text-slate-400 mb-8">워크샵 · 교육 · 컨퍼런스 · 세미나 · 회의 자료 아카이브</p>

          {!loading && !error && (
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="자료 제목, 설명, 행사명으로 검색..."
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    aria-label="검색 초기화"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 카테고리 메뉴 */}
      {!loading && !error && resources.length > 0 && (
        <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-1">
              <button
                onClick={() => selectCategory('ALL')}
                className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeCategory === 'ALL'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                전체 <span className="text-xs text-slate-400 ml-1">{resources.length}</span>
              </button>
              {categories.map(({ key, count }) => (
                <button
                  key={key}
                  onClick={() => selectCategory(key)}
                  className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeCategory === key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="mr-1">{RESOURCE_CATEGORY_META[key]?.icon}</span>
                  {RESOURCE_CATEGORY_LABELS[key] ?? key}
                  <span className="text-xs text-slate-400 ml-1">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        {loading && <div className="text-center py-20 text-slate-400">로딩 중...</div>}

        {error && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">접근 제한</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <a href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">로그인</a>
              <a href="/register" className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">회원가입</a>
            </div>
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p>등록된 자료가 없습니다.</p>
          </div>
        )}

        {!loading && !error && resources.length > 0 && (
          <>
            {/* 카테고리 설명 */}
            {activeCategory !== 'ALL' && RESOURCE_CATEGORY_META[activeCategory] && (
              <div className="mb-6 flex items-start gap-3">
                <span className="text-2xl">{RESOURCE_CATEGORY_META[activeCategory].icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{RESOURCE_CATEGORY_LABELS[activeCategory]}</h2>
                  <p className="text-sm text-slate-500">{RESOURCE_CATEGORY_META[activeCategory].desc}</p>
                </div>
              </div>
            )}

            {/* 유형 필터 */}
            {resourceTypes.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveType('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  전체 유형 <span className="opacity-60 ml-1">{inCategory.length}</span>
                </button>
                {resourceTypes.map(([type, count]) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeType === type ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {RESOURCE_TYPE_LABELS[type] ?? type} <span className="opacity-60 ml-1">{count}</span>
                  </button>
                ))}
              </div>
            )}

            {(searchQuery || activeType !== 'ALL') && (
              <p className="text-sm text-slate-500 mb-4">
                {searchQuery ? <><span className="font-medium text-slate-700">&quot;{searchQuery}&quot;</span> 검색 결과 </> : null}
                총 <span className="font-semibold text-blue-600">{filtered.length}</span>건
              </p>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-slate-600">해당하는 자료가 없습니다.</p>
                <p className="text-sm mt-1">다른 카테고리나 키워드로 찾아보세요.</p>
              </div>
            )}

            {/* 묶음별 목록 */}
            <div className="space-y-8">
              {groups.map((g) => (
                <div key={g.name + g.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{RESOURCE_CATEGORY_META[g.category]?.icon}</span>
                    <h3 className="font-bold text-slate-900">
                      <HighlightText text={g.name} query={searchQuery} />
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                      {RESOURCE_CATEGORY_LABELS[g.category] ?? g.category}
                    </span>
                    <span className="text-xs text-slate-400">자료 {g.items.length}건</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {g.items.map((resource) => (
                      <div key={resource.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeColors[resource.resourceType] ?? 'bg-slate-100 text-slate-700'}`}>
                            {RESOURCE_TYPE_LABELS[resource.resourceType] ?? resource.resourceType}
                          </span>
                          {!resource.hasPermission && <span className="text-xs text-slate-400">🔒 권한 필요</span>}
                        </div>

                        <h4 className="font-bold text-slate-900 mb-1 line-clamp-2">
                          <HighlightText text={resource.title} query={searchQuery} />
                        </h4>
                        {resource.description && (
                          <p className="text-slate-500 text-sm mb-3 line-clamp-3">
                            <HighlightText text={resource.description} query={searchQuery} />
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4">
                          <span className="text-xs text-slate-400">
                            {new Date(resource.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                          {resource.hasPermission ? (
                            <button
                              onClick={() => handleDownload(resource)}
                              disabled={downloading === resource.id}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                              {downloading === resource.id ? '처리 중...' : (
                                resource.storageType === 'GOOGLE_DRIVE_LINK' || resource.storageType === 'EXTERNAL_LINK'
                                  ? '자료 열기'
                                  : '다운로드'
                              )}
                            </button>
                          ) : (
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-400 text-sm rounded-lg cursor-not-allowed" title="관리자 승인 후 열람 가능합니다.">
                              접근 불가
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
