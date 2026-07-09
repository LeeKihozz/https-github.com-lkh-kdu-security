'use client'

import { useEffect, useState } from 'react'
import type { HomeContent, AboutContent } from '@/app/lib/siteContent'

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

function ObjectListEditor({ title, items, fields, blank, onChange }: {
  title: string
  items: Record<string, string>[]
  fields: { key: string; label: string }[]
  blank: Record<string, string>
  onChange: (items: Record<string, string>[]) => void
}) {
  const update = (i: number, key: string, val: string) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it))
    onChange(next)
  }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i: number, dir: number) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <button type="button" onClick={() => onChange([...items, { ...blank }])}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">+ 항목 추가</button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs disabled:opacity-40">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs disabled:opacity-40">↓</button>
                <button type="button" onClick={() => remove(i)}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs">삭제</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fields.map((f) => (
                <Field key={f.key} label={f.label} value={item[f.key] ?? ''} onChange={(v) => update(i, f.key, v)} />
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">항목이 없습니다. &quot;항목 추가&quot;를 눌러 추가하세요.</p>}
      </div>
    </div>
  )
}

function StringListEditor({ title, items, placeholder, onChange }: {
  title: string; items: string[]; placeholder?: string; onChange: (items: string[]) => void
}) {
  const update = (i: number, val: string) => onChange(items.map((it, idx) => (idx === i ? val : it)))
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i: number, dir: number) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <button type="button" onClick={() => onChange([...items, ''])}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">+ 항목 추가</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={item} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} className={inputCls} />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-2 py-2 bg-slate-200 hover:bg-slate-300 rounded text-xs disabled:opacity-40">↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="px-2 py-2 bg-slate-200 hover:bg-slate-300 rounded text-xs disabled:opacity-40">↓</button>
            <button type="button" onClick={() => remove(i)} className="px-2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs shrink-0">삭제</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">항목이 없습니다.</p>}
      </div>
    </div>
  )
}

export default function AdminContentPage() {
  const [tab, setTab] = useState<'home' | 'about'>('home')
  const [home, setHome] = useState<HomeContent | null>(null)
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/content/home').then((r) => r.json()),
      fetch('/api/admin/content/about').then((r) => r.json()),
    ]).then(([h, a]) => {
      setHome(h.content)
      setAbout(a.content)
      setLoading(false)
    })
  }, [])

  async function save() {
    setSaving(true)
    setMessage('')
    const data = tab === 'home' ? home : about
    const res = await fetch(`/api/admin/content/${tab}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setMessage(res.ok ? '✓ 저장되었습니다.' : '저장에 실패했습니다.')
    setSaving(false)
  }

  if (loading) return <div className="text-center py-20 text-slate-400">로딩 중...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">페이지 편집</h1>
        <div className="flex items-center gap-3">
          {message && <span className="text-sm text-green-600">{message}</span>}
          <button onClick={save} disabled={saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['home', 'about'] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setMessage('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>
            {t === 'home' ? '메인 페이지' : '학과소개'}
          </button>
        ))}
      </div>

      {tab === 'home' && home && (
        <div>
          <Card title="히어로 (상단 배너)">
            <Field label="상단 영문 문구" value={home.hero.eyebrow} onChange={(v) => setHome({ ...home, hero: { ...home.hero, eyebrow: v } })} />
            <Field label="제목 (학교명)" value={home.hero.titleLine1} onChange={(v) => setHome({ ...home, hero: { ...home.hero, titleLine1: v } })} />
            <Field label="학과명 1 (파랑)" value={home.hero.deptHacking} onChange={(v) => setHome({ ...home, hero: { ...home.hero, deptHacking: v } })} />
            <Field label="학과명 2 (남색)" value={home.hero.deptAi} onChange={(v) => setHome({ ...home, hero: { ...home.hero, deptAi: v } })} />
            <Field label="소개 문구" value={home.hero.subtitle} onChange={(v) => setHome({ ...home, hero: { ...home.hero, subtitle: v } })} />
            <Field label="소개 문구 (작은 글씨)" value={home.hero.subtitleSmall} onChange={(v) => setHome({ ...home, hero: { ...home.hero, subtitleSmall: v } })} />
          </Card>

          <Card title="실적 섹션 제목">
            <Field label="제목" value={home.kpiSection.title} onChange={(v) => setHome({ ...home, kpiSection: { ...home.kpiSection, title: v } })} />
            <Field label="부제목" value={home.kpiSection.subtitle} onChange={(v) => setHome({ ...home, kpiSection: { ...home.kpiSection, subtitle: v } })} />
          </Card>

          <Card title="핵심 역량 섹션 제목">
            <Field label="제목" value={home.competenciesSection.title} onChange={(v) => setHome({ ...home, competenciesSection: { ...home.competenciesSection, title: v } })} />
            <Field label="부제목" value={home.competenciesSection.subtitle} onChange={(v) => setHome({ ...home, competenciesSection: { ...home.competenciesSection, subtitle: v } })} />
          </Card>

          <ObjectListEditor
            title="핵심 역량 카드"
            items={home.competencies}
            fields={[{ key: 'icon', label: '아이콘(이모지)' }, { key: 'label', label: '제목' }, { key: 'desc', label: '설명' }]}
            blank={{ icon: '🔐', label: '', desc: '' }}
            onChange={(items) => setHome({ ...home, competencies: items as HomeContent['competencies'] })}
          />

          <Card title="자료실 안내 섹션">
            <Field label="아이콘(이모지)" value={home.resourceSection.icon} onChange={(v) => setHome({ ...home, resourceSection: { ...home.resourceSection, icon: v } })} />
            <Field label="제목" value={home.resourceSection.title} onChange={(v) => setHome({ ...home, resourceSection: { ...home.resourceSection, title: v } })} />
            <div className="md:col-span-2">
              <Area label="본문" value={home.resourceSection.body} onChange={(v) => setHome({ ...home, resourceSection: { ...home.resourceSection, body: v } })} />
            </div>
          </Card>
        </div>
      )}

      {tab === 'about' && about && (
        <div>
          <Card title="히어로 (상단 배너)">
            <div className="md:col-span-2"><Field label="제목" value={about.hero.title} onChange={(v) => setAbout({ ...about, hero: { ...about.hero, title: v } })} /></div>
            <Field label="본문 앞부분" value={about.hero.bodyBefore} onChange={(v) => setAbout({ ...about, hero: { ...about.hero, bodyBefore: v } })} />
            <Field label="강조 문구 (파랑)" value={about.hero.highlight} onChange={(v) => setAbout({ ...about, hero: { ...about.hero, highlight: v } })} />
            <Field label="본문 뒷부분" value={about.hero.bodyAfter} onChange={(v) => setAbout({ ...about, hero: { ...about.hero, bodyAfter: v } })} />
          </Card>

          <Card title="교육 목표 제목">
            <Field label="제목" value={about.goalsTitle} onChange={(v) => setAbout({ ...about, goalsTitle: v })} />
          </Card>
          <ObjectListEditor
            title="교육 목표 카드"
            items={about.goals}
            fields={[{ key: 'icon', label: '아이콘(이모지)' }, { key: 'title', label: '제목' }, { key: 'desc', label: '설명' }]}
            blank={{ icon: '🎯', title: '', desc: '' }}
            onChange={(items) => setAbout({ ...about, goals: items as AboutContent['goals'] })}
          />

          <Card title="핵심 교육 분야 제목">
            <Field label="제목" value={about.tracksTitle} onChange={(v) => setAbout({ ...about, tracksTitle: v })} />
            <Field label="부제목" value={about.tracksSubtitle} onChange={(v) => setAbout({ ...about, tracksSubtitle: v })} />
          </Card>
          <ObjectListEditor
            title="교육 분야(트랙) 카드"
            items={about.tracks}
            fields={[{ key: 'icon', label: '아이콘(이모지)' }, { key: 'name', label: '제목' }, { key: 'desc', label: '설명' }]}
            blank={{ icon: '🔐', name: '', desc: '' }}
            onChange={(items) => setAbout({ ...about, tracks: items as AboutContent['tracks'] })}
          />

          <Card title="진로 / 자격증 제목">
            <Field label="진로 섹션 제목" value={about.careersTitle} onChange={(v) => setAbout({ ...about, careersTitle: v })} />
            <Field label="자격증 섹션 제목" value={about.certsTitle} onChange={(v) => setAbout({ ...about, certsTitle: v })} />
          </Card>
          <StringListEditor title="주요 진로 분야" items={about.careers} placeholder="진로 분야" onChange={(items) => setAbout({ ...about, careers: items })} />
          <StringListEditor title="취득 가능 자격증" items={about.certs} placeholder="자격증명" onChange={(items) => setAbout({ ...about, certs: items })} />

          <Card title="취업 실적 강조 박스">
            <Field label="제목" value={about.employmentNote.title} onChange={(v) => setAbout({ ...about, employmentNote: { ...about.employmentNote, title: v } })} />
            <Field label="본문" value={about.employmentNote.body} onChange={(v) => setAbout({ ...about, employmentNote: { ...about.employmentNote, body: v } })} />
          </Card>

          <Card title="하단 CTA">
            <Field label="제목" value={about.ctaTitle} onChange={(v) => setAbout({ ...about, ctaTitle: v })} />
            <Field label="부제목" value={about.ctaSubtitle} onChange={(v) => setAbout({ ...about, ctaSubtitle: v })} />
          </Card>
        </div>
      )}
    </div>
  )
}
