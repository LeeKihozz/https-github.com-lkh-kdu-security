'use client'

import { useEffect, useState } from 'react'
import type { HomeContent } from '@/app/lib/siteContent'

const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm'

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  )
}

function Area({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={inputCls} />
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

export default function AdminContentPage() {
  const [home, setHome] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/content/home')
      .then((r) => r.json())
      .then((h) => {
        setHome(h.content)
        setLoading(false)
      })
  }, [])

  async function save() {
    if (!home) return
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin/content/home', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(home),
    })
    setMessage(res.ok ? '✓ 저장되었습니다.' : '저장에 실패했습니다.')
    setSaving(false)
  }

  if (loading) return <div className="text-center py-20 text-slate-400">로딩 중...</div>
  if (!home) return <div className="text-center py-20 text-slate-400">콘텐츠를 불러올 수 없습니다.</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">메인 페이지 편집</h1>
          <p className="text-sm text-slate-500 mt-1">
            자료실 통계 수치는 자료 등록 내용에 따라 자동으로 갱신되며, 여기서는 문구만 수정합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-sm text-green-600">{message}</span>}
          <button onClick={save} disabled={saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <Card title="히어로 (상단 배너)">
        <Field label="상단 영문 문구" value={home.hero.eyebrow} onChange={(v) => setHome({ ...home, hero: { ...home.hero, eyebrow: v } })} />
        <Field label="제목 (학교명)" value={home.hero.titleLine1} onChange={(v) => setHome({ ...home, hero: { ...home.hero, titleLine1: v } })} />
        <Field label="학과명 1 (파랑)" value={home.hero.deptHacking} onChange={(v) => setHome({ ...home, hero: { ...home.hero, deptHacking: v } })} />
        <Field label="학과명 2 (남색)" value={home.hero.deptAi} onChange={(v) => setHome({ ...home, hero: { ...home.hero, deptAi: v } })} />
        <Field label="소개 문구" value={home.hero.subtitle} onChange={(v) => setHome({ ...home, hero: { ...home.hero, subtitle: v } })} />
        <Field label="소개 문구 (작은 글씨)" value={home.hero.subtitleSmall} onChange={(v) => setHome({ ...home, hero: { ...home.hero, subtitleSmall: v } })} />
      </Card>

      <Card title="자료실 통계 섹션">
        <Field label="제목" value={home.statsSection.title} onChange={(v) => setHome({ ...home, statsSection: { ...home.statsSection, title: v } })} />
        <Field label="부제목" value={home.statsSection.subtitle} onChange={(v) => setHome({ ...home, statsSection: { ...home.statsSection, subtitle: v } })} />
      </Card>

      <Card title="자료실 안내 섹션">
        <Field label="아이콘(이모지)" value={home.resourceSection.icon} onChange={(v) => setHome({ ...home, resourceSection: { ...home.resourceSection, icon: v } })} />
        <Field label="제목" value={home.resourceSection.title} onChange={(v) => setHome({ ...home, resourceSection: { ...home.resourceSection, title: v } })} />
        <div className="md:col-span-2">
          <Area label="본문" value={home.resourceSection.body} onChange={(v) => setHome({ ...home, resourceSection: { ...home.resourceSection, body: v } })} />
        </div>
      </Card>
    </div>
  )
}
