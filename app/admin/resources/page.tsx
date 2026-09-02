'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RESOURCE_TYPE_LABELS, RESOURCE_CATEGORY_LABELS, RESOURCE_CATEGORY_ORDER } from '@/app/lib/utils'

type Resource = {
  id: string
  title: string
  resourceType: string
  category: string
  groupName: string | null
  storageType: string
  isPublished: boolean
  createdAt: string
  uploadedBy: { name: string }
  _count: { downloadLogs: number }
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [granting, setGranting] = useState(false)
  const [message, setMessage] = useState('')

  async function loadResources() {
    const res = await fetch('/api/admin/resources')
    const data = await res.json()
    setResources(data.resources ?? [])
    setLoading(false)
  }

  useEffect(() => { loadResources() }, [])

  async function togglePublish(r: Resource) {
    setProcessing(r.id)
    await fetch(`/api/admin/resources/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !r.isPublished }),
    })
    await loadResources()
    setProcessing(null)
  }

  async function updateField(id: string, patch: Record<string, unknown>) {
    setProcessing(id)
    await fetch(`/api/admin/resources/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    await loadResources()
    setProcessing(null)
  }

  async function grantAll() {
    if (!confirm('승인된 회원 전원에게 전체 자료의 열람 권한을 부여하시겠습니까?')) return
    setGranting(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/permissions/grant-all', { method: 'POST' })
      const data = await res.json()
      setMessage(res.ok ? (data.message ?? '완료되었습니다.') : (data.error ?? '실패했습니다.'))
      await loadResources()
    } catch {
      setMessage('요청 중 오류가 발생했습니다.')
    } finally {
      setGranting(false)
    }
  }

  async function deleteResource(id: string) {
    if (!confirm('이 자료를 삭제하시겠습니까?')) return
    setProcessing(id)
    await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
    await loadResources()
    setProcessing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">자료 관리</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {message && <span className="text-sm text-green-600">{message}</span>}
          <button
            onClick={grantAll}
            disabled={granting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            title="승인된 회원 전원에게 전체 자료 열람 권한을 부여합니다."
          >
            {granting ? '부여 중...' : '승인 회원 전체에게 권한 부여'}
          </button>
          <Link
            href="/admin/resources/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            + 자료 등록
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">로딩 중...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-3">📭</div>
          <p>등록된 자료가 없습니다.</p>
          <Link href="/admin/resources/new" className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg text-sm">
            첫 자료 등록하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">제목</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">분류 / 묶음</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">유형</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">상태</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">다운로드</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">등록일</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{r.title}</div>
                      <button
                        onClick={() => {
                          const next = prompt('묶음 이름 (행사·과정명). 비우면 단독 자료로 표시됩니다.', r.groupName ?? '')
                          if (next !== null) updateField(r.id, { groupName: next.trim() || null })
                        }}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        묶음 이름 변경
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.category}
                        disabled={processing === r.id}
                        onChange={(e) => updateField(r.id, { category: e.target.value })}
                        className="px-2 py-1 border border-slate-200 rounded text-xs bg-white disabled:opacity-50"
                      >
                        {RESOURCE_CATEGORY_ORDER.map((c) => (
                          <option key={c} value={c}>{RESOURCE_CATEGORY_LABELS[c]}</option>
                        ))}
                      </select>
                      <div className="text-xs text-slate-400 mt-1 max-w-[220px] truncate" title={r.groupName ?? ''}>
                        {r.groupName || '— 묶음 없음'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                        {RESOURCE_TYPE_LABELS[r.resourceType] ?? r.resourceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {r.isPublished ? '공개' : '비공개'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r._count.downloadLogs}회</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <Link
                          href={`/admin/resources/${r.id}/permissions`}
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                        >
                          권한
                        </Link>
                        <button
                          onClick={() => togglePublish(r)}
                          disabled={processing === r.id}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs disabled:opacity-50"
                        >
                          {r.isPublished ? '비공개' : '공개'}
                        </button>
                        <button
                          onClick={() => deleteResource(r.id)}
                          disabled={processing === r.id}
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
