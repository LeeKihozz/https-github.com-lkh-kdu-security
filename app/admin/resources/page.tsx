'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RESOURCE_TYPE_LABELS } from '@/app/lib/utils'

type Resource = {
  id: string
  title: string
  resourceType: string
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
        <Link
          href="/admin/resources/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          + 자료 등록
        </Link>
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
                      <div className="text-xs text-slate-400">{r.uploadedBy.name}</div>
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
