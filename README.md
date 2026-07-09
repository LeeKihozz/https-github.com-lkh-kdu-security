# 극동대학교 해킹보안학과·인공지능보안학과 홈페이지

AI와 사이버보안을 융합한 실전형 보안 인재 양성 - 극동대학교 해킹보안학과·인공지능보안학과 공식 홈페이지

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **DB**: Prisma + SQLite (better-sqlite3 adapter)
- **Auth**: jose JWT + httpOnly Cookie
- **Password**: bcryptjs
- **Validation**: zod
- **File Upload**: 로컬 `/public/uploads`

---

## 설치 방법

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일의 SESSION_SECRET을 안전한 값으로 변경하세요

# 3. DB 마이그레이션
npx prisma migrate dev

# 4. Prisma 클라이언트 생성
npx prisma generate

# 5. 초기 데이터 시드
npm run seed
```

---

## 실행 방법

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

개발 서버: http://localhost:3000

---

## DB 마이그레이션

```bash
# 새 마이그레이션 생성 및 적용
npx prisma migrate dev --name 마이그레이션명

# Prisma 클라이언트 재생성
npx prisma generate

# Prisma Studio (DB GUI)
npm run db:studio
```

---

## Seed 실행

```bash
npm run seed
```

seed 실행 시 다음 데이터가 자동 생성됩니다:
- 관리자 계정 (username: admin, password: dlrlgh1!)
- Instagram, 공식 홈페이지, YouTube 소셜 링크
- 교수진 9명
- 실적 데이터 (연구수주, 수상, 취업, 특허, 교과목, 비교과, 자격증)

---

## 초기 관리자 계정

- 아이디: admin
- 비밀번호: dlrlgh1!

⚠️ 중요: 운영 배포 전 반드시 관리자 비밀번호를 변경하세요!
관리자 페이지 또는 DB에서 bcrypt 해시로 직접 업데이트하세요.

---

## Google Drive 링크 자료 등록 방법

1. 관리자 로그인 -> /admin/resources/new
2. 자료 유형: Google Drive 링크 선택
3. 링크 URL: Google Drive 공유 링크 입력
4. 등록 후 /admin/resources/[id]/permissions에서 접근 권한 부여

Google Drive 링크는 권한이 있는 사용자에게만 노출됩니다.
서버는 Drive 파일을 다운로드하지 않고, 링크만 전달합니다.

---

## 사용자 가입 승인 절차

1. 사용자가 /register에서 회원가입 신청
2. 가입 후 상태는 PENDING (자료실 접근 불가)
3. 관리자 /admin/users에서 승인
4. 승인 후 상태가 APPROVED로 변경 -> 자료실 접근 가능

---

## 자료별 권한 부여 절차

1. 관리자 /admin/resources에서 자료 선택
2. 권한 버튼 클릭 -> /admin/resources/[id]/permissions
3. 권한을 부여할 사용자 선택 -> 권한 부여 버튼
4. 해당 사용자는 자료실에서 해당 자료 다운로드 가능

APPROVED 상태 사용자만 권한 부여 가능
권한이 없는 사용자에게는 driveUrl, filePath 절대 반환하지 않음

---

## PostgreSQL 배포 전환

1. .env의 DATABASE_URL을 PostgreSQL 연결 문자열로 변경
2. prisma/schema.prisma의 provider를 postgresql로 변경
3. app/lib/db.ts의 어댑터를 PostgreSQL 어댑터로 교체
4. npm run db:migrate

---

## 페이지 구조

공개 페이지:
- / : 메인 홈페이지
- /about : 학과 소개
- /achievements : 실적 대시보드
- /faculty : 교수진 목록
- /faculty/[id] : 교수 상세
- /resources : 자료실 (로그인+승인 필요)
- /login : 로그인
- /register : 회원가입

관리자 페이지 (ADMIN 권한 필요):
- /admin : 관리자 대시보드
- /admin/users : 사용자 관리
- /admin/resources : 자료 관리
- /admin/resources/new : 자료 등록
- /admin/resources/[id]/permissions : 권한 관리
- /admin/achievements : 실적 관리
- /admin/faculty : 교수진 관리

---

## 보안 사항

- 모든 비밀번호는 bcryptjs로 해싱하여 저장
- 세션은 jose JWT + httpOnly Cookie로 관리
- 관리자 API는 서버에서 권한 재검증
- 자료 다운로드 API는 권한 검증 후 파일/링크 제공
- driveUrl, filePath는 권한 없는 사용자에게 절대 반환하지 않음
- 업로드 파일 확장자 제한: ppt, pptx, pdf, mp4, mov, zip, doc, docx, hwp, hwpx
- 최대 파일 크기: 50MB
