'use client'

import { useEffect, useState, useCallback } from 'react'
import { CATEGORY_LABELS } from '@/app/lib/utils'

type Achievement = {
  id: string
  category: string
  year: number | null
  title: string
  organization: string | null
  description: string | null
  people: string | null
  amount: string | null
  role: string | null
}

const TABS = [
  { key: 'ALL', label: '전체' },
  { key: 'RESEARCH', label: '연구수주' },
  { key: 'AWARD', label: '수상' },
  { key: 'EMPLOYMENT', label: '취업' },
  { key: 'PAPER', label: '논문' },
  { key: 'PATENT', label: '특허' },
  { key: 'CERTIFICATE', label: '자격증' },
  { key: 'ACTIVITY', label: '비교과' },
  { key: 'COURSE', label: '교과목' },
  { key: 'GRADUATE_SCHOOL', label: '대학원' },
]

const KPI_ITEMS = [
  { category: 'ACTIVITY', label: '비교과 활동', value: '32건', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { category: 'COURSE', label: '전공 교과목', value: '30개', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  { category: 'AWARD', label: '수상 실적', value: '16건', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { category: 'EMPLOYMENT', label: '취업 실적', value: '38명', color: 'bg-green-50 border-green-200 text-green-700' },
  { category: 'RESEARCH', label: '연구수주', value: '22건', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { category: 'PAPER', label: '논문', value: '57편', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { category: 'PATENT', label: '특허', value: '4건', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { category: 'CERTIFICATE', label: '자격증 항목', value: '12개', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
]

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activeTab, setActiveTab] = useState('ALL')
  const [keyword, setKeyword] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchAchievements = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeTab !== 'ALL') params.set('category', activeTab)
    if (yearFilter) params.set('year', yearFilter)
    if (keyword) params.set('keyword', keyword)

    const res = await fetch(`/api/achievements?${params}`)
    const data = await res.json()
    setAchievements(data.achievements ?? [])
    setLoading(false)
  }, [activeTab, yearFilter, keyword])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  const years = Array.from({ length: 8 }, (_, i) => 2025 - i)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">학과 실적</h1>
          <p className="text-slate-400">해킹보안·인공지능보안학과의 연구·교육·취업 성과</p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {KPI_ITEMS.map((kpi) => (
            <button
              key={kpi.category}
              onClick={() => setActiveTab(kpi.category)}
              className={`rounded-xl p-5 text-center border-2 transition-all hover:shadow-md ${kpi.color} ${activeTab === kpi.category ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
            >
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="text-sm font-medium mt-1">{kpi.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Tabs + Filter */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
            >
              <option value="">전체 연도</option>
              {years.map((y) => <option key={y} value={y}>{y}년</option>)}
            </select>
            <input
              type="text"
              placeholder="키워드 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 min-w-40 px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Achievement List */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20 text-slate-400">로딩 중...</div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-20 text-slate-400">검색 결과가 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {CATEGORY_LABELS[a.category] ?? a.category}
                      </span>
                      {a.year && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                          {a.year}년
                        </span>
                      )}
                      {a.role && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                          {a.role}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 leading-snug">{a.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                      {a.organization && <span>📍 {a.organization}</span>}
                      {a.people && <span>👤 {a.people}</span>}
                      {a.description && <span>💬 {a.description}</span>}
                    </div>
                  </div>
                  {a.amount && (
                    <div className="text-right shrink-0">
                      <div className="text-blue-700 font-bold text-sm">{a.amount}원</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
