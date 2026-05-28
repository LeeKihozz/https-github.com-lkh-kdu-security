'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  username: string
  email: string
  name: string
  status: string
  createdAt: string
  approvedAt: string | null
  _count: { permissions: number; downloadLogs: number }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '승인 대기',
  APPROVED: '승인 완료',
  BLOCKED: '차단',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  BLOCKED: 'bg-red-100 text-red-700',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  async function loadUsers() {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  async function approve(id: string) {
    if (!confirm('이 사용자를 승인하시겠습니까?')) return
    setProcessing(id)
    await fetch(`/api/admin/users/${id}/approve`, { method: 'PATCH' })
    await loadUsers()
    setProcessing(null)
  }

  async function block(id: string) {
    if (!confirm('이 사용자를 차단하시겠습니까?')) return
    setProcessing(id)
    await fetch(`/api/admin/users/${id}/block`, { method: 'PATCH' })
    await loadUsers()
    setProcessing(null)
  }

  async function deleteUser(id: string) {
    if (!confirm('이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    setProcessing(id)
    await fetch(`/api/admin/users/${id}/block`, { method: 'DELETE' })
    await loadUsers()
    setProcessing(null)
  }

  const pending = users.filter((u) => u.status === 'PENDING')
  const others = users.filter((u) => u.status !== 'PENDING')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">사용자 관리</h1>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          승인 대기 {pending.length}명
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">로딩 중...</div>
      ) : (
        <>
          {/* Pending users */}
          {pending.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <h2 className="font-bold text-yellow-800 mb-3">⏳ 승인 대기 중</h2>
              <div className="space-y-2">
                {pending.map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-yellow-100">
                    <div>
                      <span className="font-medium text-slate-900">{u.name}</span>
                      <span className="text-slate-400 text-sm ml-2">@{u.username}</span>
                      <div className="text-xs text-slate-400">{u.email} · {new Date(u.createdAt).toLocaleDateString('ko-KR')} 가입</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(u.id)}
                        disabled={processing === u.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg disabled:opacity-50"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={processing === u.id}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg disabled:opacity-50"
                      >
                        거절/삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All users table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900">전체 사용자 목록</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">이름</th>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">아이디</th>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">이메일</th>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">상태</th>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">권한/다운로드</th>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">가입일</th>
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...pending, ...others].map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">@{u.username}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[u.status]}`}>
                          {STATUS_LABELS[u.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        권한 {u._count.permissions}개 / 다운로드 {u._count.downloadLogs}회
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {u.status === 'PENDING' && (
                            <button
                              onClick={() => approve(u.id)}
                              disabled={processing === u.id}
                              className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs disabled:opacity-50"
                            >
                              승인
                            </button>
                          )}
                          {u.status !== 'BLOCKED' && (
                            <button
                              onClick={() => block(u.id)}
                              disabled={processing === u.id}
                              className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-xs disabled:opacity-50"
                            >
                              차단
                            </button>
                          )}
                          {u.status === 'BLOCKED' && (
                            <button
                              onClick={() => approve(u.id)}
                              disabled={processing === u.id}
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs disabled:opacity-50"
                            >
                              해제
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(u.id)}
                            disabled={processing === u.id}
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
        </>
      )}
    </div>
  )
}
