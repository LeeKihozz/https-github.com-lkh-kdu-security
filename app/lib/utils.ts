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
