'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewResourcePage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    resourceType: 'PDF',
    storageType: 'FILE',
    driveUrl: '',
    isPublished: true,
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    let res: Response

    if (form.storageType === 'FILE' && file) {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('resourceType', form.resourceType)
      fd.append('storageType', 'FILE')
      fd.append('file', file)
      fd.append('isPublished', String(form.isPublished))
      res = await fetch('/api/admin/resources', { method: 'POST', body: fd })
    } else {
      res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? '등록에 실패했습니다.')
      return
    }

    router.push('/admin/resources')
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/resources" className="text-slate-400 hover:text-slate-700 text-sm">← 목록으로</Link>
        <h1 className="text-2xl font-bold text-slate-900">자료 등록</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">자료 유형</label>
            <select name="storageType" value={form.storageType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="FILE">파일 업로드</option>
              <option value="GOOGLE_DRIVE_LINK">Google Drive 링크</option>
              <option value="EXTERNAL_LINK">외부 링크</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">제목 <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자료 제목"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="자료에 대한 간단한 설명"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
            <select name="resourceType" value={form.resourceType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="PDF">PDF</option>
              <option value="PPT">PPT</option>
              <option value="VIDEO">영상</option>
              <option value="ZIP">ZIP</option>
              <option value="DOCUMENT">문서</option>
              <option value="LINK">링크</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          {form.storageType === 'FILE' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">파일 업로드</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                accept=".ppt,.pptx,.pdf,.mp4,.mov,.zip,.doc,.docx,.hwp,.hwpx"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">허용 형식: ppt, pptx, pdf, mp4, mov, zip, doc, docx, hwp, hwpx (최대 50MB)</p>
            </div>
          )}

          {(form.storageType === 'GOOGLE_DRIVE_LINK' || form.storageType === 'EXTERNAL_LINK') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">링크 URL <span className="text-red-500">*</span></label>
              <input
                type="url"
                name="driveUrl"
                value={form.driveUrl}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-slate-400 mt-1">권한이 있는 사용자에게만 링크가 노출됩니다.</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isPublished" className="text-sm text-slate-700">바로 공개</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {loading ? '등록 중...' : '등록'}
            </button>
            <Link href="/admin/resources" className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium text-sm transition-colors">
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
