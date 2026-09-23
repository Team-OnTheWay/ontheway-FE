import { useEffect, useState } from 'react'

// key가 바뀔 때마다 fetcher를 다시 실행한다.
// 결과를 요청한 key와 함께 저장해 두고, 지금 key와 다르면 '불러오는 중'으로 본다
// (effect 안에서 로딩 상태를 직접 바꾸지 않기 위함)
export function useAsync<T>(fetcher: () => Promise<T>, key: string) {
    const [result, setResult] = useState<{ key: string; data?: T; error?: unknown } | null>(null)

    useEffect(() => {
        let cancelled = false
        fetcher()
            .then(data => { if (!cancelled) setResult({ key, data }) })
            .catch(error => { if (!cancelled) setResult({ key, error }) })
        return () => { cancelled = true }
        // fetcher는 key로 바뀜을 판단한다
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    const current = result?.key === key ? result : null
    return {
        loading: !current,
        data: current?.data,
        error: current?.error,
    }
}
