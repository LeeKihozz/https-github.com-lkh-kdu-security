'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { RESOURCE_TYPE_LABELS } from '@/app/lib/utils'

type Resource = {
  id: string
  title: string
  description: string | null
  resourceType: string
  storageType: string
  originalFileName: string | null
  thumbnailUrl: string | null
  createdAt: string
  hasPermission: boolean
  uploadedBy: { name: string }
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState('ALL')
  const router = useRouter()

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

  const resourceTypes = useMemo(() => {
    const types = Array.from(new Set(resources.map((r) => r.resourceType)))
    return ['ALL', ...types]
  }, [resources])

  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return resources.filter((r) => {
      const matchesType = activeType === 'ALL' || r.resourceType === activeType
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        (r.originalFileName ?? '').toLowerCase().includes(q)
      return matchesType && matchesSearch
    })
  }, [resources, searchQuery, activeType])

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

  const typeColors: Record<string, string> = {
    VIDEO: 'bg-red-100 text-red-700',
    PPT: 'bg-orange-100 text-orange-700',
    PDF: 'bg-blue-100 text-blue-700',
    ZIP: 'bg-yellow-100 text-yellow-700',
    DOCUMENT: 'bg-green-100 text-green-700',
    LINK: 'bg-purple-100 text-purple-700',
    OTHER: 'bg-slate-100 text-slate-700',
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
    setActiveType('ALL')
  }

  function handleClearSearch() {
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">자료실</h1>
          <p className="text-slate-400 mb-8">학과 교육자료, 연구자료, 강의 영상</p>

          {!loading && !error && (
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="자료 제목, 설명으로 검색..."
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
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

      <section className="max-w-7xl mx-auto px-4 py-8">
        {loading && <div className="text-center py-20 text-slate-400">로딩 중...</div>}

        {error && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">접근 제한</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <a href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                로그인
              </a>
              <a href="/register" className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">
                회원가입
              </a>
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
            {/* 유형 필터 탭 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {resourceTypes.map((type) => {
                const count = type === 'ALL'
                  ? resources.length
                  : resources.filter((r) => r.resourceType === type).length
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {type === 'ALL' ? '전체' : (RESOURCE_TYPE_LABELS[type] ?? type)}
                    <span className={`ml-1.5 text-xs ${activeType === type ? 'text-blue-100' : 'text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 검색 결과 요약 */}
            {(searchQuery || activeType !== 'ALL') && (
              <p className="text-sm text-slate-500 mb-4">
                {searchQuery
                  ? <><span className="font-medium text-slate-700">&quot;{searchQuery}&quot;</span> 검색 결과 </>
                  : null}
                총 <span className="font-semibold text-blue-600">{filteredResources.length}</span>건
              </p>
            )}

            {/* 결과 없음 */}
            {filteredResources.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-slate-600">검색 결과가 없습니다.</p>
                <p className="text-sm mt-1">다른 키워드로 검색해보세요.</p>
              </div>
            )}

            {/* 자료 카드 그리드 */}
            {filteredResources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeColors[resource.resourceType] ?? 'bg-slate-100 text-slate-700'}`}>
                        {RESOURCE_TYPE_LABELS[resource.resourceType] ?? resource.resourceType}
                      </span>
                      {!resource.hasPermission && (
                        <span className="text-xs text-slate-400">🔒 권한 필요</span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">
                      <HighlightText text={resource.title} query={searchQuery} />
                    </h3>
                    {resource.description && (
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                        <HighlightText text={resource.description} query={searchQuery} />
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
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
                              ? '링크 열기'
                              : '다운로드'
                          )}
                        </button>
                      ) : (
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-400 text-sm rounded-lg cursor-not-allowed" title="관리자 승인 후 열람 가능합니다.">
                          접근 불가
                        </span>
                      )}
                    </div>

                    {!resource.hasPermission && (
                      <p className="text-xs text-slate-400 mt-2 text-right">관리자 승인 후 열람 가능합니다.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
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
