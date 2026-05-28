import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { getCurrentUser } from './lib/auth'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: '극동대학교 해킹보안학과 · 인공지능보안학과',
  description: 'AI와 사이버보안을 융합한 실전형 보안 인재 양성 - 극동대학교 해킹보안학과 · 인공지능보안학과',
  keywords: ['해킹보안', '인공지능보안', '극동대학교', '정보보호', '사이버보안'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser().catch(() => null)

  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans">
        <Navbar
          user={
            user
              ? { name: user.name, role: user.role, username: user.username }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
