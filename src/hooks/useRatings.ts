import { useEffect, useState } from 'react'
import { User } from '../api/User'

// GET /user/ratings(내 후기), GET /user/ratings/{userNo}(상대 후기) 응답
export interface RatingSummary {
    averageRating: number
    reviewCount: number
}

// 프로필 카드의 평균 별점·후기 수.
// target: 'me' = 로그인한 나, 숫자 = 그 회원번호(userId), null = 아직 모름(호출하지 않음)
export function useRatings(target: 'me' | number | null) {
    const [result, setResult] = useState<{ target: 'me' | number; summary: RatingSummary | null } | null>(null)

    useEffect(() => {
        if (target === null) return
        let cancelled = false
        const api = new User()
        ;(target === 'me' ? api.ratings() : api.otherRatings(target))
            .then(res => { if (!cancelled) setResult({ target, summary: (res.data.data as RatingSummary) ?? null }) })
            .catch(() => { /* 실패하면 카드에 0으로 둔다 */ })
        return () => { cancelled = true }
    }, [target])

    // 대상이 바뀌면 이전 사람의 점수를 보여주지 않는다
    const summary = result && result.target === target ? result.summary : null
    return {
        rating: summary ? Number(Number(summary.averageRating).toFixed(1)) : 0,
        count: summary?.reviewCount ?? 0,
    }
}
