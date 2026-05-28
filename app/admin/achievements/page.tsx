'use client'

import { useEffect, useState } from 'react'
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
  isVisible: boolean
}

const CATEGORIES = Object.entries(CATEGORY_LABELS)

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [form, setForm] = useState({
    category: 'RESEARCH',
    year: new Date().getFullYear(),
    title: '',
    organization: '',
    description: '',
    people: '',
    amount: '',
    role: '',
  })

  async function loadAchievements() {
    const res = await fetch('/api/achievements')
    const data = await res.json()
    setAchievements(data.achievements ?? [])
    setLoading(false)
  }

  useEffect(() => { loadAchievements() }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setProcessing('new')
    const res = await fetch('/api/admin/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, year: form.year ? parseInt(String(form.year)) : null }),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ category: 'RESEARCH', year: new Date().getFullYear(), title: '', organization: '', description: '', people: '', amount: '', role: '' })
      await loadAchievements()
    }
    setProcessing(null)
  }

  async function toggleVisible(a: Achievement) {
    setProcessing(a.id)
    await fetch(`/api/admin/achievements/${a.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !a.isVisible }),
    })
    await loadAchievements()
    setProcessing(null)
  }

  async function deleteAchievement(id: string) {
    if (!confirm('이 실적을 삭제하시겠습니까?')) return
    setProcessing(id)
    await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' })
    await loadAchievements()
    setProcessing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">실적 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
        >
          {showForm ? '취소' : '+ 실적 추가'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">새 실적 추가</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">구분</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                {CATEGORIES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">연도</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" min={2000} max={2030} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">제목 *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="실적명" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">기관/단체</label>
              <input type="text" name="organization" value={form.organization} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="발주기관, 수상기관 등" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">역할/수상명</label>
              <input type="text" name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="주관, 위탁, 우수상 등" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">참여자</label>
              <input type="text" name="people" value={form.people} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="이용준 교수 외" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">금액/비고</label>
              <input type="text" name="amount" value={form.amount} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="19,000,000 또는 비고" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">설명</label>
              <input type="text" name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="추가 설명" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={processing === 'new'} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {processing === 'new' ? '추가 중...' : '추가'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">로딩 중...</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">구분</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">연도</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">제목</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">기관</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">상태</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {achievements.map((a) => (
                  <tr key={a.id} className={`hover:bg-slate-50 ${!a.isVisible ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {CATEGORY_LABELS[a.category] ?? a.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{a.year ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1 max-w-xs">{a.title}</div>
                      {a.people && <div className="text-xs text-slate-400">{a.people}</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{a.organization ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${a.isVisible ? 'text-green-600' : 'text-slate-400'}`}>
                        {a.isVisible ? '공개' : '숨김'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleVisible(a)}
                          disabled={processing === a.id}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs disabled:opacity-50"
                        >
                          {a.isVisible ? '숨기기' : '표시'}
                        </button>
                        <button
                          onClick={() => deleteAchievement(a.id)}
                          disabled={processing === a.id}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
