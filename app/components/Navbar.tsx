'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

type NavbarProps = {
  user?: { name: string; role: string; username: string } | null
}

const navLinks = [
  { href: '/', label: '홈' },
  { href: '/about', label: '학과소개' },
  { href: '/achievements', label: '실적' },
  { href: '/faculty', label: '교수진' },
  { href: '/resources', label: '자료실' },
]

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <span className="text-blue-400">KDU</span>
            <span className="hidden sm:inline text-sm font-medium text-slate-200">해킹보안 · AI보안학과</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-colors"
                  >
                    관리자
                  </Link>
                )}
                <span className="text-slate-400 text-sm">{user.name}님</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded text-slate-300 hover:text-white hover:bg-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-400'
                    : 'text-slate-300 hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-700 mt-2 pt-2">
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-3 py-2 text-sm text-amber-400" onClick={() => setMenuOpen(false)}>
                      관리자 페이지
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-slate-300">
                    로그아웃 ({user.name})
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-sm text-slate-300" onClick={() => setMenuOpen(false)}>
                    로그인
                  </Link>
                  <Link href="/register" className="block px-3 py-2 text-sm text-blue-400" onClick={() => setMenuOpen(false)}>
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
