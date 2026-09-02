import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatAmount(amount: string | null | undefined): string {
  if (!amount) return '-'
  return amount
}

export const ALLOWED_EXTENSIONS = ['ppt', 'pptx', 'pdf', 'mp4', 'mov', 'zip', 'doc', 'docx', 'hwp', 'hwpx', 'mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac']
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function isAllowedFileType(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return ALLOWED_EXTENSIONS.includes(ext)
}

export const CATEGORY_LABELS: Record<string, string> = {
  RESEARCH: '연구수주',
  AWARD: '수상',
  EMPLOYMENT: '취업',
  CERTIFICATE: '자격증',
  ACTIVITY: '비교과 활동',
  COURSE: '교과목',
  PATENT: '특허',
  GRADUATE_SCHOOL: '대학원 진학',
  PAPER: '논문',
}

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  VIDEO: '영상',
  AUDIO: '음성녹음',
  PPT: 'PPT',
  PDF: 'PDF',
  ZIP: 'ZIP',
  DOCUMENT: '문서',
  LINK: '링크',
  OTHER: '기타',
}

export const STORAGE_TYPE_LABELS: Record<string, string> = {
  FILE: '서버 업로드 파일',
  GOOGLE_DRIVE_LINK: 'Google Drive 링크',
  EXTERNAL_LINK: '외부 링크',
}

export const RESOURCE_CATEGORY_LABELS: Record<string, string> = {
  WORKSHOP: '워크샵',
  EDUCATION: '교육',
  CONFERENCE: '컨퍼런스',
  SEMINAR: '세미나',
  MEETING: '회의',
  ETC: '기타',
}

// 자료실 카테고리 탭 순서
export const RESOURCE_CATEGORY_ORDER = [
  'WORKSHOP',
  'EDUCATION',
  'CONFERENCE',
  'SEMINAR',
  'MEETING',
  'ETC',
] as const

export const RESOURCE_CATEGORY_META: Record<string, { icon: string; desc: string; accent: string }> = {
  WORKSHOP: { icon: '🛠️', desc: '분야별 워크샵 발표자료와 현장 영상', accent: 'text-blue-600' },
  EDUCATION: { icon: '🎓', desc: '교육 과정·강의 영상과 실습 자료', accent: 'text-emerald-600' },
  CONFERENCE: { icon: '🏛️', desc: '컨퍼런스 발표자료와 현장 녹음', accent: 'text-indigo-600' },
  SEMINAR: { icon: '📢', desc: '사업설명회·세미나 자료와 영상', accent: 'text-amber-600' },
  MEETING: { icon: '🤝', desc: '협의체·정례회의 회의자료', accent: 'text-rose-600' },
  ETC: { icon: '📦', desc: '그 밖의 자료', accent: 'text-slate-600' },
}
