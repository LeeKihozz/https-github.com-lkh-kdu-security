import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">극동대학교</h3>
            <p className="text-sm leading-relaxed">
              해킹보안학과 / 인공지능보안학과
            </p>
            <p className="text-sm mt-2 text-slate-500">
              AI와 사이버보안을 융합한<br />실전형 보안 인재 양성
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">바로가기</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">학과소개</Link></li>
              <li><Link href="/achievements" className="hover:text-white transition-colors">학과 실적</Link></li>
              <li><Link href="/faculty" className="hover:text-white transition-colors">교수진 소개</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">자료실</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">외부 링크</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="https://www.kdu.ac.kr/ins/main.do" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  공식 학과 홈페이지
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/kdu.hackingsecurity/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@%ED%95%B4%ED%82%B9%EB%B3%B4%EC%95%88%ED%95%99%EA%B3%BC" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-600">
          <p>© 2025 극동대학교 해킹보안학과·인공지능보안학과. All rights reserved.</p>
          <p className="mt-1">충청북도 음성군 감곡면 대학길 76-32</p>
        </div>
      </div>
    </footer>
  )
}
