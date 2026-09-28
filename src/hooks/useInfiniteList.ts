import { useCallback, useEffect, useRef, useState } from 'react'

export interface ListPage<T> {
    items: T[]
    hasNext: boolean
}

// 서버가 hasNext를 안 주는 목록은 꽉 찬 페이지가 왔으면 다음이 있다고 본다
export const toPage = <T>(items: T[] | undefined, size: number, hasNext?: boolean): ListPage<T> => ({
    items: items ?? [],
    hasNext: hasNext ?? (items?.length ?? 0) >= size,
})

interface ListState<T> {
    key: string
    items: T[]
    page: number
    hasNext: boolean
    error?: unknown       // 첫 페이지 실패
    moreError?: unknown   // 다음 페이지 실패 (이미 받은 목록은 그대로 둔다)
}

// page(0부터)를 받아 한 페이지씩 불러오는 무한 스크롤 목록
// key가 바뀌면 처음부터 다시 불러온다 (useAsync와 같은 방식)
export function useInfiniteList<T>(fetchPage: (page: number) => Promise<ListPage<T>>, key: string) {
    const [state, setState] = useState<ListState<T> | null>(null)
    const [loadingMore, setLoadingMore] = useState(false)

    // 스크롤/새로고침 때는 가장 최근 렌더의 fetchPage와 key를 쓴다
    const latest = useRef({ fetchPage, key })
    useEffect(() => { latest.current = { fetchPage, key } })
    const busy = useRef(false)

    useEffect(() => {
        let cancelled = false
        fetchPage(0)
            .then(p => { if (!cancelled) setState({ key, items: p.items, page: 0, hasNext: p.hasNext }) })
            .catch(error => { if (!cancelled) setState({ key, items: [], page: 0, hasNext: false, error }) })
        return () => { cancelled = true }
        // fetchPage는 key로 바뀜을 판단한다
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    const current = state?.key === key ? state : null

    const loadMore = useCallback(() => {
        if (!current || !current.hasNext || busy.current) return
        const k = current.key
        const next = current.page + 1
        busy.current = true
        setLoadingMore(true)
        setState(s => s && { ...s, moreError: undefined })
        latest.current.fetchPage(next)
            .then(p => setState(s => s && s.key === k && s.page === next - 1
                ? { ...s, items: [...s.items, ...p.items], page: next, hasNext: p.hasNext }
                : s))
            .catch(moreError => setState(s => s && s.key === k ? { ...s, moreError } : s))
            .finally(() => { busy.current = false; setLoadingMore(false) })
    }, [current])

    // 당겨서 새로고침: 새 첫 페이지가 올 때까지 지금 목록을 그대로 보여준다
    const refresh = useCallback(async () => {
        const k = latest.current.key
        try {
            const p = await latest.current.fetchPage(0)
            if (latest.current.key === k) setState({ key: k, items: p.items, page: 0, hasNext: p.hasNext })
        } catch (error) {
            if (latest.current.key === k) setState({ key: k, items: [], page: 0, hasNext: false, error })
        }
    }, [])

    return {
        items: current?.items ?? [],
        status: !current ? 'loading' as const : current.error ? 'error' as const : 'done' as const,
        error: current?.error,
        page: current?.page ?? 0,
        hasNext: current?.hasNext ?? false,
        loadingMore,
        moreError: current?.moreError,
        loadMore,
        refresh,
    }
}

export type InfiniteList = Pick<ReturnType<typeof useInfiniteList>,
    'status' | 'page' | 'hasNext' | 'loadingMore' | 'moreError' | 'loadMore'>
