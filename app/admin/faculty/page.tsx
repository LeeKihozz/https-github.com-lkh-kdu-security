'use client'

import { useEffect, useState } from 'react'

type Faculty = {
  id: string
  name: string
  position: string
  major: string | null
  email: string | null
  isVisible: boolean
  displayOrder: number
}

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    position: '교수',
    major: '',
    email: '',
    phone: '',
    summary: '',
    researchAreas: '',
    education: '',
    career: '',
    papers: '',
    achievements: '',
    displayOrder: 10,
  })

  async function loadFaculty() {
    const res = await fetch('/api/faculty')
    const data = await res.json()
    setFaculty(data.faculty ?? [])
    setLoading(false)
  }

  useEffect(() => { loadFaculty() }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setProcessing('new')
    const res = await fetch('/api/admin/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, displayOrder: parseInt(String(form.displayOrder)) }),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ name: '', position: '교수', major: '', email: '', phone: '', summary: '', researchAreas: '', education: '', career: '', papers: '', achievements: '', displayOrder: 10 })
      await loadFaculty()
    }
    setProcessing(null)
  }

  async function deleteF(id: string) {
    if (!confirm('이 교수 정보를 삭제하시겠습니까?')) return
    setProcessing(id)
    await fetch(`/api/admin/faculty/${id}`, { method: 'DELETE' })
    await loadFaculty()
    setProcessing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">교수진 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
        >
          {showForm ? '취소' : '+ 교수 추가'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">새 교수 추가</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">이름 *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">직책 *</label>
              <input type="text" name="position" value={form.position} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">전공</label>
              <input type="text" name="major" value={form.major} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">이메일</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">연락처</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">표시 순서</label>
              <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">소개</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">연구분야 (줄바꿈으로 구분)</label>
              <textarea name="researchAreas" value={form.researchAreas} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">주요 경력 (줄바꿈으로 구분)</label>
              <textarea name="career" value={form.career} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                  {f.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{f.name}</div>
                  <div className="text-slate-500 text-sm">{f.position}</div>
                  {f.major && <div className="text-slate-400 text-xs">{f.major}</div>}
                </div>
              </div>
              {f.email && <div className="text-xs text-slate-400 mb-3">✉️ {f.email}</div>}
              <div className="flex gap-2">
                <a href={`/faculty/${f.id}`} target="_blank" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs">
                  보기
                </a>
                <button
                  onClick={() => deleteF(f.id)}
                  disabled={processing === f.id}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
