import { useState } from 'react'
import type { ReportBoardRequestDto } from '../api/data-contracts'

export type ReportCategory = NonNullable<ReportBoardRequestDto['categories']>[number]

export const MAX_REPORT_CATEGORIES = 3

// 신고 사유 체크박스 (최대 3개). 넘치면 알리고 선택하지 않는다
export function useReportCategories() {
    const [selected, setSelected] = useState<ReportCategory[]>([])

    const toggle = (category: ReportCategory, checked: boolean) => {
        if (!checked) {
            setSelected(prev => prev.filter(c => c !== category))
            return
        }
        if (selected.length >= MAX_REPORT_CATEGORIES) {
            alert(`신고 사유는 최대 ${MAX_REPORT_CATEGORIES}개까지 선택할 수 있어요.`)
            return
        }
        setSelected(prev => [...prev, category])
    }

    return { selected, toggle }
}
