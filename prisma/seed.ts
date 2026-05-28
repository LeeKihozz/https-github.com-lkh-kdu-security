import { PrismaClient } from '../app/generated/prisma'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbPath = path.resolve(__dirname, '../dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const passwordHash = await bcrypt.hash('dlrlgh1!', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@kdu.ac.kr',
      name: '관리자',
      passwordHash,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  })
  console.log('✅ Admin user created:', admin.username)

  // Social Links
  await prisma.socialLink.deleteMany()
  await prisma.socialLink.createMany({
    data: [
      { name: 'Instagram', url: 'https://www.instagram.com/kdu.hackingsecurity/', type: 'INSTAGRAM', icon: 'instagram', displayOrder: 1 },
      { name: '공식 학과 홈페이지', url: 'https://www.kdu.ac.kr/ins/main.do', type: 'WEBSITE', icon: 'globe', displayOrder: 2 },
      { name: 'YouTube', url: 'https://www.youtube.com/@%ED%95%B4%ED%82%B9%EB%B3%B4%EC%95%88%ED%95%99%EA%B3%BC', type: 'YOUTUBE', icon: 'youtube', displayOrder: 3 },
    ],
  })
  console.log('✅ Social links created')

  // Faculty
  await prisma.faculty.deleteMany()
  const facultyData = [
    {
      name: '이용준',
      position: '학과장 / 교수',
      major: '컴퓨터학과(정보보호)',
      email: 'yjlee@kdu.ac.kr',
      summary: '정보보호, 사이버침해대응, AI·사이버보안 융합기술 분야 전문가',
      researchAreas: '정보보호, 사이버침해대응, AI·사이버보안 융합기술, 블록체인 보안, 디지털 포렌식',
      papers: '논문 57편 (국내외 학술지 및 학술대회)',
      achievements: '연구수주 22건, 특허 4건, 우수논문상 다수',
      displayOrder: 1,
    },
    {
      name: '유도진',
      position: '교수',
      major: '정보보안',
      email: 'djyu@kdu.ac.kr',
      summary: '융합보안, 군사보안, 사이버보안, 에너지 IT 보안 분야 전문가',
      researchAreas: '융합보안, 군사보안, 사이버보안, 에너지 IT 보안',
      displayOrder: 2,
    },
    {
      name: '강용혁',
      position: '교수',
      major: '컴퓨터공학',
      email: 'yhkang@kdu.ac.kr',
      summary: '컴퓨터공학 분야 전문가',
      researchAreas: '컴퓨터공학, 시스템 보안',
      displayOrder: 3,
    },
    {
      name: '최용하',
      position: '교수',
      major: '소프트웨어공학',
      email: 'yhchoi@kdu.ac.kr',
      summary: '소프트웨어공학 분야 전문가',
      researchAreas: '소프트웨어공학, 보안 소프트웨어 개발',
      displayOrder: 4,
    },
    {
      name: '신유식',
      position: '교수',
      email: 'ysshin@kdu.ac.kr',
      summary: '정보보안 분야 전문가',
      displayOrder: 5,
    },
    {
      name: '권두순',
      position: '교수',
      major: '융합기술경영',
      email: 'dskwon@kdu.ac.kr',
      summary: '융합기술경영 분야 전문가',
      researchAreas: '융합기술경영, 보안 경영',
      displayOrder: 6,
    },
    {
      name: '안상수',
      position: '교수',
      major: '융합보안학',
      email: 'ssa@kdu.ac.kr',
      summary: '융합보안학 분야 전문가',
      researchAreas: '융합보안, 물리보안, 사이버보안 융합',
      displayOrder: 7,
    },
    {
      name: '서청정',
      position: '교수',
      major: 'Multi Cloud & Security',
      email: 'cjseo@kdu.ac.kr',
      summary: '멀티 클라우드 및 보안 분야 전문가',
      researchAreas: '클라우드 보안, 멀티 클라우드 아키텍처, 클라우드 거버넌스',
      displayOrder: 8,
    },
    {
      name: '김수미',
      position: '교수',
      major: '인공지능융합교육',
      email: 'smkim@kdu.ac.kr',
      summary: '인공지능 융합교육 분야 전문가',
      researchAreas: '인공지능 교육, AI 융합보안, 교육 데이터 분석',
      displayOrder: 9,
    },
  ]

  for (const faculty of facultyData) {
    await prisma.faculty.create({ data: faculty })
  }
  console.log('✅ Faculty created:', facultyData.length, 'members')

  // Achievements - Research
  await prisma.achievement.deleteMany()
  const researchData = [
    { category: 'RESEARCH', year: 2025, title: '충청권 정보보호 클러스터 인력양성 사업', organization: '충북과학기술혁신원', amount: '19,000,000', role: '주관', people: '이용준 교수' },
    { category: 'RESEARCH', year: 2025, title: 'GNSS RTK 정밀 측위 모듈 기반 재난안전 실시간 모니터링 시스템 과제', organization: '충북과학기술혁신원', amount: '7,500,000', role: '주관', people: '이용준 교수' },
    { category: 'RESEARCH', year: 2025, title: '청주 수증기 발생지역 민원 감소를 위한 대기 3D 전산수치해석 및 예측 AI 시스템 개발', organization: '충북녹색환경지원센터', amount: '30,000,000', role: '주관', people: '이용준 교수' },
    { category: 'RESEARCH', year: 2025, title: 'AI 기반 사이버위협 대응 통합 플랫폼 개발', organization: '중소기업기술정보진흥원', role: '위탁', description: '2024~2025' },
    { category: 'RESEARCH', year: 2025, title: '공간 위험 인텔리전스', organization: '중소기업기술정보진흥원', role: '위탁', description: '2024~2025' },
    { category: 'RESEARCH', year: 2024, title: 'K-RMF 연구개발 산출물 및 기술지원 구체화 방안', organization: '국방기술품질원', role: '공동' },
    { category: 'RESEARCH', year: 2024, title: 'ESS 상태 모니터링 통합 관리 솔루션 개발', organization: '충북에너지산학융합원', role: '주관', description: '2023~2024' },
    { category: 'RESEARCH', year: 2023, title: '블록체인 전문인력 양성사업', organization: '충북과학기술혁신원', role: '주관' },
    { category: 'RESEARCH', year: 2023, title: '중부권 정보보호 협력 및 발전방안 수립', organization: '충북과학기술혁신원', role: '주관' },
  ]

  // Awards
  const awardsData = [
    { category: 'AWARD', year: 2025, title: 'LLM 및 SLM의 윤리적 표현 특성에 관한 비교 연구', organization: '한국산학기술학회', description: '우수논문상', people: '이기호 외' },
    { category: 'AWARD', year: 2025, title: 'BPF 기반 백도어 bpfdoor의 분석과 대응 전략: eBPF를 중심으로', organization: '한국융합보안학회', description: '우수논문상' },
    { category: 'AWARD', year: 2025, title: '생성형 인공지능에 대한 각 국가별 규제 동향분석', organization: '한전KPS', description: '우수논문상' },
    { category: 'AWARD', year: 2025, title: '사이버위협 시나리오 공모전', organization: '한국중부발전', description: '우수상' },
    { category: 'AWARD', year: 2025, title: '사이버위협 시나리오 공모전', organization: '한국수자원공사', description: '우수상' },
    { category: 'AWARD', year: 2024, title: 'IoT SW보안 점검 모델 및 실증연구', organization: '한국서부발전', description: '우수논문상' },
    { category: 'AWARD', year: 2024, title: 'AI 및 머신러닝을 활용한 에너지 보안: 스마트 그리드에서의 비정상 트래픽 탐지 기술 연구', organization: '한전KPS', description: '우수논문상' },
  ]

  // Employment
  const employmentData = [
    { category: 'EMPLOYMENT', title: '한국중부발전', description: '공공기관 보안' },
    { category: 'EMPLOYMENT', title: '롯데정보통신', description: '대기업 IT보안' },
    { category: 'EMPLOYMENT', title: '중앙선거관리위원회', description: '공공기관 보안' },
    { category: 'EMPLOYMENT', title: 'SK쉴더스', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '안랩', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '윈스', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '이글루시큐리티', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: 'SK인포섹', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '샌즈랩', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '케이사인', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '코드원', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '명정보기술', description: '보안전문기업' },
    { category: 'EMPLOYMENT', title: '블루데이터시스템즈', description: '보안전문기업' },
  ]

  // Patents
  const patentsData = [
    { category: 'PATENT', title: '퍼블릿 블록체인 내에서의 해쉬함수값과 인비지블 실링 워터인증마킹으로 이루어진 포렌식 객체 하이브리드형 신뢰검증제', people: '이용준 교수' },
    { category: 'PATENT', title: '자산객체의 센싱데이터를 이용한 안전성 신뢰성 검증제어식 스마트 컨트랙트 블록체인 조각투자 형성 장치 및 방법', people: '이용준 교수' },
    { category: 'PATENT', title: '생체정보인식 기반의 전자서명 방법', people: '이용준 교수' },
    { category: 'PATENT', title: '워터마크를 이용한 바이오정보 보호방법', people: '이용준 교수' },
  ]

  // Courses
  const coursesData = [
    { category: 'COURSE', title: 'SecureProgramming1', description: '보안 프로그래밍 기초' },
    { category: 'COURSE', title: '보안소프트웨어 개발1', description: '보안 소프트웨어 개발 방법론' },
    { category: 'COURSE', title: '운영체제 보안', description: 'OS 보안 원리와 실습' },
    { category: 'COURSE', title: '네트워크 보안', description: '네트워크 프로토콜 및 보안' },
    { category: 'COURSE', title: '사이버 범죄학', description: '사이버범죄 유형과 대응' },
    { category: 'COURSE', title: '사물인터넷보안', description: 'IoT 장치 보안' },
    { category: 'COURSE', title: '해킹대응', description: '해킹 기법과 대응 전략' },
    { category: 'COURSE', title: '데이터베이스 보안', description: 'DB 보안 설계와 구현' },
    { category: 'COURSE', title: '디지털 포렌식', description: '디지털 증거 수집 및 분석' },
    { category: 'COURSE', title: '클라우드 보안', description: '클라우드 환경 보안' },
    { category: 'COURSE', title: '취약점 분석', description: '시스템 취약점 탐지 및 분석' },
    { category: 'COURSE', title: '융합보안관제', description: '통합 보안관제 운영' },
    { category: 'COURSE', title: '악성코드분석', description: '악성코드 분석 기법' },
    { category: 'COURSE', title: '해킹기법연구1', description: '고급 해킹 기법 연구' },
    { category: 'COURSE', title: '해킹방어프로젝트1', description: '해킹방어 실전 프로젝트' },
    { category: 'COURSE', title: '인공지능보안', description: 'AI를 활용한 보안 기술' },
    { category: 'COURSE', title: '암호학', description: '암호 이론과 응용' },
    { category: 'COURSE', title: '보안컨설팅', description: '보안 컨설팅 방법론' },
    { category: 'COURSE', title: '정보보안관리체계', description: 'ISMS 구축 및 운영' },
    { category: 'COURSE', title: '해킹기법', description: '해킹 기법과 실습' },
    { category: 'COURSE', title: '응용암호학', description: '암호 알고리즘 응용' },
    { category: 'COURSE', title: '해킹방어프로젝트2', description: '해킹방어 고급 프로젝트' },
  ]

  // Activities (비교과)
  const activitiesData = [
    { category: 'ACTIVITY', title: '사이버보안 세미나', description: '외부 전문가 초청 특강' },
    { category: 'ACTIVITY', title: '해킹 캠프', description: '실전 해킹 및 방어 집중 캠프' },
    { category: 'ACTIVITY', title: '정보보호 현장학습', description: '보안업체 현장방문 학습' },
    { category: 'ACTIVITY', title: 'CTF 대회 준비 교육', description: '해킹대회 참가 준비 교육' },
    { category: 'ACTIVITY', title: 'AI 보안 특강', description: 'AI 기반 보안 기술 특강' },
    { category: 'ACTIVITY', title: '디지털 포렌식 실습', description: '포렌식 도구 활용 실습' },
  ]

  // Certificates (자격증)
  const certData = [
    { category: 'CERTIFICATE', title: '정보보안기사', description: '국가공인 정보보안 전문자격' },
    { category: 'CERTIFICATE', title: '정보처리기사', description: '국가공인 IT 자격증' },
    { category: 'CERTIFICATE', title: 'CISSP', description: '국제 정보보안 전문가 자격증' },
    { category: 'CERTIFICATE', title: 'CEH', description: '공인 윤리적 해킹 전문가' },
    { category: 'CERTIFICATE', title: 'CISA', description: '공인 정보시스템 감사사' },
    { category: 'CERTIFICATE', title: '디지털포렌식전문가', description: '디지털 포렌식 전문자격' },
    { category: 'CERTIFICATE', title: 'AWS 보안 전문가', description: 'AWS 클라우드 보안 자격증' },
    { category: 'CERTIFICATE', title: 'Security+', description: 'CompTIA 보안 자격증' },
    { category: 'CERTIFICATE', title: 'OSCP', description: 'Offensive Security Certified Professional' },
    { category: 'CERTIFICATE', title: '네트워크관리사', description: '네트워크 관리 자격증' },
    { category: 'CERTIFICATE', title: '정보보안산업기사', description: '국가공인 정보보안 자격증' },
    { category: 'CERTIFICATE', title: 'Linux+', description: '리눅스 전문 자격증' },
  ]

  // Graduate school
  const gradData = [
    { category: 'GRADUATE_SCHOOL', title: '대학원 진학', description: '국내외 대학원 진학 4명' },
  ]

  // Papers (논문 대표 일부)
  const papersData = [
    { category: 'PAPER', year: 2025, title: 'LLM 및 SLM의 윤리적 표현 특성에 관한 비교 연구', organization: '한국산학기술학회', people: '이기호, 이용준 외' },
    { category: 'PAPER', year: 2025, title: 'BPF 기반 백도어 bpfdoor의 분석과 대응 전략: eBPF를 중심으로', organization: '한국융합보안학회', people: '이용준 외' },
    { category: 'PAPER', year: 2025, title: '생성형 인공지능에 대한 각 국가별 규제 동향분석', organization: '학술지', people: '이용준 외' },
    { category: 'PAPER', year: 2024, title: 'IoT SW보안 점검 모델 및 실증연구', organization: '학술지', people: '이용준 외' },
    { category: 'PAPER', year: 2024, title: 'AI 및 머신러닝을 활용한 에너지 보안: 스마트 그리드에서의 비정상 트래픽 탐지 기술 연구', organization: '학술지', people: '이용준 외' },
  ]

  const allAchievements = [
    ...researchData,
    ...awardsData,
    ...employmentData,
    ...patentsData,
    ...coursesData,
    ...activitiesData,
    ...certData,
    ...gradData,
    ...papersData,
  ]

  for (let i = 0; i < allAchievements.length; i++) {
    await prisma.achievement.create({
      data: { ...allAchievements[i] as any, displayOrder: i + 1 },
    })
  }
  console.log('✅ Achievements created:', allAchievements.length, 'items')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
