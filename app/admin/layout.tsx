import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/app/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin nav */}
      <div className="bg-amber-600 text-white px-4 py-2 text-sm flex items-center gap-4 flex-wrap">
        <span className="font-bold">관리자 모드</span>
        <span className="text-amber-200">|</span>
        <Link href="/admin" className="hover:text-amber-200 transition-colors">대시보드</Link>
        <Link href="/admin/users" className="hover:text-amber-200 transition-colors">사용자 관리</Link>
        <Link href="/admin/resources" className="hover:text-amber-200 transition-colors">자료 관리</Link>
        <Link href="/admin/achievements" className="hover:text-amber-200 transition-colors">실적 관리</Link>
        <Link href="/admin/faculty" className="hover:text-amber-200 transition-colors">교수진 관리</Link>
        <span className="ml-auto">
          <Link href="/" className="text-amber-200 hover:text-white text-xs">← 사이트로 돌아가기</Link>
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
