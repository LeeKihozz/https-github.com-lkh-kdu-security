'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type User = { id: string; name: string; username: string; email: string }
type Permission = { id: string; user: User }

export default function PermissionsPage() {
  const { id: resourceId } = useParams<{ id: string }>()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [grantingAll, setGrantingAll] = useState(false)

  async function loadData() {
    const res = await fetch(`/api/admin/resources/${resourceId}/permissions`)
    const data = await res.json()
    setPermissions(data.permissions ?? [])
    setAllUsers(data.allUsers ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [resourceId])

  const permittedIds = new Set(permissions.map((p) => p.user.id))
  const unpermittedUsers = allUsers.filter((u) => !permittedIds.has(u.id))

  async function grant(userId: string) {
    setProcessing(userId)
    await fetch(`/api/admin/resources/${resourceId}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    await loadData()
    setProcessing(null)
  }

  async function revoke(userId: string) {
    if (!confirm('이 사용자의 접근 권한을 회수하시겠습니까?')) return
    setProcessing(userId)
    await fetch(`/api/admin/resources/${resourceId}/permissions/${userId}`, { method: 'DELETE' })
    await loadData()
    setProcessing(null)
  }

  async function grantAll() {
    if (!confirm(`${unpermittedUsers.length}명 모두에게 권한을 부여하시겠습니까?`)) return
    setGrantingAll(true)
    for (const u of unpermittedUsers) {
      await fetch(`/api/admin/resources/${resourceId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: u.id }),
      })
    }
    await loadData()
    setGrantingAll(false)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/resources" className="text-slate-400 hover:text-slate-700 text-sm">← 자료 목록</Link>
        <h1 className="text-2xl font-bold text-slate-900">자료 접근 권한 관리</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">로딩 중...</div>
      ) : (
        <div className="space-y-6">
          {/* Currently permitted */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">접근 권한 있는 사용자 ({permissions.length}명)</h2>
            </div>

            {permissions.length === 0 ? (
              <p className="text-slate-400 text-sm">권한이 부여된 사용자가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {permissions.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div>
                      <span className="font-medium text-slate-900">{p.user.name}</span>
                      <span className="text-slate-400 text-sm ml-2">@{p.user.username}</span>
                      <div className="text-xs text-slate-400">{p.user.email}</div>
                    </div>
                    <button
                      onClick={() => revoke(p.user.id)}
                      disabled={processing === p.user.id}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg disabled:opacity-50"
                    >
                      권한 회수
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grant new permissions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">권한 미부여 사용자 ({unpermittedUsers.length}명)</h2>
              {unpermittedUsers.length > 0 && (
                <button
                  onClick={grantAll}
                  disabled={grantingAll}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg disabled:opacity-50"
                >
                  {grantingAll ? '처리 중...' : '전체 권한 부여'}
                </button>
              )}
            </div>

            {unpermittedUsers.length === 0 ? (
              <p className="text-slate-400 text-sm">모든 사용자에게 권한이 부여되었습니다.</p>
            ) : (
              <div className="space-y-2">
                {unpermittedUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-medium text-slate-900">{u.name}</span>
                      <span className="text-slate-400 text-sm ml-2">@{u.username}</span>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                    <button
                      onClick={() => grant(u.id)}
                      disabled={processing === u.id}
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg disabled:opacity-50"
                    >
                      권한 부여
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
