// 백엔드 API 값 <-> 화면 표시 값 변환 모음
import axios from 'axios'

export type DeliveryStatus =
    | 'MATCHING_WAITING' | 'PICKING_UP' | 'DELIVERY_WAITING' | 'DELIVERING'
    | 'COMPLETION_REQUESTED' | 'COMPLETED' | 'FAILED' | 'CANCELED' | 'REJECTED'

// 서버가 내려준 에러 메시지 (없으면 기본 문구)
export function errorMessage(error: unknown, fallback = '요청에 실패했어요. 잠시 후 다시 시도해주세요.') {
    if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message
        if (message) return message
    }
    return fallback
}

const pad = (n: number) => String(n).padStart(2, '0')

// "2026-09-22T08:00:00" -> Date (시간대 표기가 없으면 로컬 시각으로 본다)
function toDate(value?: string | null) {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

// 2026.09.22
export function formatDate(value?: string | null) {
    const d = toDate(value)
    return d ? `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}` : ''
}

// 08:00
export function formatTime(value?: string | null) {
    const d = toDate(value)
    return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : ''
}

// 9월22일(화)
export function formatKoreanDate(value?: string | null) {
    const d = toDate(value)
    if (!d) return ''
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getMonth() + 1}월${d.getDate()}일(${days[d.getDay()]})`
}

// 2026.09.22 08:00
export function formatDateTime(value?: string | null) {
    const date = formatDate(value)
    return date ? `${date} ${formatTime(value)}` : ''
}

// 20000 -> "20,000"
export function formatNumber(value?: number | null) {
    return (value ?? 0).toLocaleString('ko-KR')
}

// "20,000원" / "20000" -> 20000 (숫자가 없으면 undefined)
export function parsePrice(text: string) {
    const digits = text.replace(/[^0-9]/g, '')
    return digits ? Number(digits) : undefined
}

// 사용자가 입력한 날짜 -> "YYYY-MM-DD"
// 2026-09-22 / 2026.09.22 / 20260922 / 9월22일 / 9/22 (연도가 없으면 올해, 이미 지났으면 내년)
export function parseDateInput(text: string): string | null {
    const value = text.trim()
    let y: number, m: number, d: number
    let match = value.match(/^(\d{4})[-./\s]?(\d{1,2})[-./\s]?(\d{1,2})/)
    if (match) {
        [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])]
    } else {
        match = value.match(/^(\d{1,2})\s*(?:월|[./-])\s*(\d{1,2})/)
        if (!match) return null
        const today = new Date()
        ;[m, d] = [Number(match[1]), Number(match[2])]
        y = today.getFullYear()
        const candidate = new Date(y, m - 1, d)
        if (candidate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) y += 1
    }
    const date = new Date(y, m - 1, d)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
    return `${y}-${pad(m)}-${pad(d)}`
}

// "2026-09-22" + "08:00" -> "2026-09-22T08:00:00" (서버 LocalDateTime 형식)
export function toLocalDateTime(date: string, time: string) {
    return `${date}T${time}:00`
}

// 배송 상태 -> 화면 문구
export const STATUS_LABEL: Record<DeliveryStatus, string> = {
    MATCHING_WAITING: '매칭대기중',
    PICKING_UP: '픽업중',
    DELIVERY_WAITING: '배송 대기 중',
    DELIVERING: '배송 중',
    COMPLETION_REQUESTED: '배송 완료 확인 요청',
    COMPLETED: '배송완료',
    FAILED: '배송중단',
    CANCELED: '배송취소',
    REJECTED: '거절됨',
}

// 결제 방식
export function paymentLabel(type?: string | null) {
    if (type === 'PREPAID') return '선결제'
    if (type === 'POSTPAID') return '후불결제'
    return type ?? ''
}
