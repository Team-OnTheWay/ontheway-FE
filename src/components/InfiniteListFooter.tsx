import { useCallback, useEffect, useRef } from 'react'
import type { InfiniteList } from '../hooks/useInfiniteList'
import { errorMessage } from '../utils/apiFormat'
import './InfiniteListFooter.css'

// 목록 맨 아래에 두면, 여기가 화면에 보일 때 다음 페이지를 불러온다
function InfiniteListFooter({ list }: { list: InfiniteList }) {
    const loadMore = useRef(list.loadMore)
    useEffect(() => { loadMore.current = list.loadMore })

    // 스크롤 영역(가장 가까운 overflow 조상)을 기준으로 300px 앞에서 미리 불러온다
    const observe = useCallback((el: HTMLDivElement | null) => {
        if (!el) return
        const io = new IntersectionObserver(
            entries => { if (entries[0].isIntersecting) loadMore.current() },
            { root: scrollParent(el), rootMargin: '300px 0px' },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    if (list.status !== 'done') return null
    if (list.moreError) {
        return (
            <button className="infinite-footer infinite-footer--retry" onClick={list.loadMore}>
                {errorMessage(list.moreError, '더 불러오지 못했어요.')} 다시 시도
            </button>
        )
    }
    if (list.loadingMore) return <p className="infinite-footer">불러오는 중이에요.</p>
    // 페이지마다 새로 붙여서, 불러온 뒤에도 여전히 보이면 한 번 더 불러오게 한다
    if (list.hasNext) return <div key={list.page} ref={observe} className="infinite-footer__sentinel" />
    return null
}

// overflow만 auto이고 실제로는 늘어나기만 하는 영역을 고르면 목록 끝이 늘 보이는 것으로 판단해
// 모든 페이지를 한꺼번에 불러온다. 그래서 내용이 넘쳐서 실제로 스크롤되는 영역을 고른다
// (아직 넘치지 않으면 화면 기준: 목록 끝이 보이므로 다음 페이지를 불러오는 게 맞다)
function scrollParent(el: HTMLElement): HTMLElement | null {
    for (let p = el.parentElement; p; p = p.parentElement) {
        const { overflowY } = getComputedStyle(p)
        if ((overflowY === 'auto' || overflowY === 'scroll') && p.scrollHeight > p.clientHeight) return p
    }
    return null
}

export default InfiniteListFooter
