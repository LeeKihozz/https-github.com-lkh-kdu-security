'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ResourceStats } from '@/app/lib/resourceStats'
import {
  RESOURCE_TYPE_LABELS,
  STORAGE_TYPE_LABELS,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_CATEGORY_META,
} from '@/app/lib/utils'

const TYPE_STYLES: Record<string, { bar: string; dot: string; icon: string }> = {
  VIDEO: { bar: 'bg-rose-500', dot: 'bg-rose-500', icon: '🎬' },
  AUDIO: { bar: 'bg-purple-500', dot: 'bg-purple-500', icon: '🎧' },
  PPT: { bar: 'bg-orange-500', dot: 'bg-orange-500', icon: '📊' },
  PDF: { bar: 'bg-blue-500', dot: 'bg-blue-500', icon: '📕' },
  ZIP: { bar: 'bg-amber-500', dot: 'bg-amber-500', icon: '🗜️' },
  DOCUMENT: { bar: 'bg-emerald-500', dot: 'bg-emerald-500', icon: '📄' },
  LINK: { bar: 'bg-cyan-500', dot: 'bg-cyan-500', icon: '🔗' },
  OTHER: { bar: 'bg-slate-400', dot: 'bg-slate-400', icon: '📦' },
}

function styleFor(type: string) {
  return TYPE_STYLES[type] ?? TYPE_STYLES.OTHER
}

function formatDateTime(iso: string | null) {
  if (!iso) return '등록된 자료 없음'
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

type Props = {
  initial: ResourceStats
  title?: string
  subtitle?: string
}

export default function ResourceStatsBoard({ initial, title, subtitle }: Props) {
  const [stats, setStats] = useState<ResourceStats>(initial)
  const [refreshing, setRefreshing] = useState(false)
  const inflight = useRef(false)

  const refresh = useCallback(async () => {
    if (inflight.current) return
    inflight.current = true
    setRefreshing(true)
    try {
      const res = await fetch('/api/resources/stats', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as ResourceStats
        if (typeof data.total === 'number') setStats(data)
      }
    } catch {
      /* 네트워크 오류는 조용히 무시하고 이전 수치를 유지 */
    } finally {
      inflight.current = false
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(refresh, 30_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', refresh)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  const maxType = Math.max(1, ...stats.byType.map((t) => t.count))
  const maxMonth = Math.max(1, ...stats.monthly.map((m) => m.count))

  const summary = [
    { label: '전체 자료', value: stats.total, unit: '건', color: 'text-blue-600', icon: '📚' },
    { label: '최근 30일 등록', value: stats.recentCount, unit: '건', color: 'text-emerald-600', icon: '🆕' },
    { label: '자료 분류', value: stats.byCategory.length, unit: '종', color: 'text-indigo-600', icon: '🗂️' },
    { label: '누적 다운로드', value: stats.downloads, unit: '회', color: 'text-amber-600', icon: '⬇️' },
  ]

  return (
    <div className="space-y-8">
      {/* 헤더 + 갱신 상태 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title ?? '자료실 현황'}</h2>
          {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
          <p className="text-slate-400 text-sm mt-1">
            최근 등록: {formatDateTime(stats.latestAt)} · 등록자 {stats.contributors}명
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className={`w-2 h-2 rounded-full ${refreshing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          <span>실시간 · {formatClock(stats.generatedAt)} 기준</span>
          <button
            onClick={refresh}
            className="ml-1 px-2 py-1 rounded border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold mb-1 ${s.color}`}>
              {s.value.toLocaleString('ko-KR')}
              <span className="text-base font-medium text-slate-400 ml-1">{s.unit}</span>
            </div>
            <div className="text-slate-600 text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 카테고리별 바로가기 */}
      {stats.byCategory.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="font-bold text-slate-900">분류별 자료</h3>
            <span className="text-xs text-slate-400">클릭하면 해당 분류의 자료실로 이동합니다</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.byCategory.map((c) => {
              const meta = RESOURCE_CATEGORY_META[c.category]
              return (
                <Link
                  key={c.category}
                  href={`/resources?category=${c.category}`}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl mb-2">{meta?.icon ?? '📦'}</div>
                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {RESOURCE_CATEGORY_LABELS[c.category] ?? c.category}
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    자료 <span className="font-semibold text-slate-700">{c.count}</span>건
                    <span className="text-slate-300 mx-1">·</span>
                    {c.groups}개 묶음
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {stats.total === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500">아직 등록된 자료가 없습니다.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 유형별 분포 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-1">자료 유형별 구성</h3>
            <p className="text-xs text-slate-400 mb-5">전체 {stats.total}건 기준</p>
            <div className="space-y-3">
              {stats.byType.map((t) => {
                const st = styleFor(t.type)
                const pct = Math.round((t.count / stats.total) * 100)
                return (
                  <div key={t.type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">
                        <span className="mr-1.5">{st.icon}</span>
                        {RESOURCE_TYPE_LABELS[t.type] ?? t.type}
                      </span>
                      <span className="text-slate-500 tabular-nums">
                        {t.count}건 <span className="text-slate-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${st.bar} transition-all duration-500`}
                        style={{ width: `${Math.max(4, (t.count / maxType) * 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 월별 등록 추이 + 보관 방식 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-1">최근 6개월 등록 추이</h3>
              <p className="text-xs text-slate-400 mb-5">월별 신규 등록 건수</p>
              <div className="flex items-end justify-between gap-2 h-36">
                {stats.monthly.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                    <span className="text-xs font-semibold text-slate-600 tabular-nums">{m.count}</span>
                    <div
                      className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-all duration-500 min-h-[3px]"
                      style={{ height: `${(m.count / maxMonth) * 100}%` }}
                      title={`${m.label} ${m.count}건`}
                    />
                    <span className="text-xs text-slate-400">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">보관 방식</h3>
              <div className="flex flex-wrap gap-2">
                {stats.byStorage.map((s) => (
                  <span
                    key={s.type}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm"
                  >
                    {STORAGE_TYPE_LABELS[s.type] ?? s.type}
                    <span className="font-semibold text-slate-900 tabular-nums">{s.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-2">
        <Link
          href="/resources"
          className="inline-block px-7 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
        >
          자료실에서 전체 자료 보기 →
        </Link>
        <p className="text-xs text-slate-400 mt-3">
          자료 열람·다운로드는 로그인 및 관리자 승인 후 이용할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
