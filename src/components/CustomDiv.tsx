import './CustomDiv.css'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface CustomDiv {
    children: ReactNode;
    backgroundColor?: string;
    headerElement?: ReactNode;
    footerElement?: ReactNode;
    // 당겨서 새로고침 때 할 일. 없으면 페이지 전체를 새로고침한다
    onRefresh?: () => Promise<unknown> | void;
    // 입력 중인 내용이 날아가면 안 되는 작성 화면은 false
    pullToRefresh?: boolean;
}

const THRESHOLD = 64   // 이만큼 당기면 새로고침
const MAX_PULL = 96

function CustomDiv({children, backgroundColor='#ffffff', headerElement, footerElement, onRefresh, pullToRefresh = true}: CustomDiv) {
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [refreshing, setRefreshing] = useState(false)

  const onRefreshRef = useRef(onRefresh)
  useEffect(() => { onRefreshRef.current = onRefresh })

  useEffect(() => {
    const root = rootRef.current
    const indicator = indicatorRef.current
    if (!root || !indicator || !pullToRefresh || refreshing) return

    let startX = 0
    let startY: number | null = null
    let pull = 0

    const show = (distance: number, animate: boolean) => {
      // 스크롤 영역 바로 위(헤더 아래)에서 내려온다
      indicator.style.top = `${(headerRef.current?.offsetHeight ?? 0) + 8}px`
      indicator.style.transition = animate ? 'transform 0.2s, opacity 0.2s' : 'none'
      indicator.style.transform = `translate(-50%, ${distance - 48}px)`
      indicator.style.setProperty('--pull-rotate', `${distance * 4}deg`)
      indicator.style.opacity = String(Math.min(distance / THRESHOLD, 1))
      indicator.classList.toggle('pull-indicator--ready', distance >= THRESHOLD)
    }

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches.length === 1 && isAtTop(e.target as HTMLElement, root) ? e.touches[0].clientY : null
      pull = 0
    }
    const onMove = (e: TouchEvent) => {
      if (startY === null) return
      const dy = e.touches[0].clientY - startY
      const dx = e.touches[0].clientX - startX
      // 위로 올리거나 옆으로 넘기는 건 보통 스크롤/스와이프
      if (pull === 0 && (dy <= 0 || Math.abs(dx) > dy)) { startY = null; return }
      e.preventDefault()   // 당기는 동안 화면이 같이 끌려가지 않게
      pull = Math.min(Math.max(dy, 0) * 0.5, MAX_PULL)
      show(pull, false)
    }
    const onEnd = () => {
      if (startY === null) return
      startY = null
      if (pull < THRESHOLD) { show(0, true); return }
      show(THRESHOLD, true)
      setRefreshing(true)
      const handler = onRefreshRef.current
      if (!handler) { window.location.reload(); return }
      Promise.resolve(handler()).finally(() => { setRefreshing(false); show(0, true) })
    }

    root.addEventListener('touchstart', onStart, { passive: true })
    root.addEventListener('touchmove', onMove, { passive: false })
    root.addEventListener('touchend', onEnd)
    root.addEventListener('touchcancel', onEnd)
    return () => {
      root.removeEventListener('touchstart', onStart)
      root.removeEventListener('touchmove', onMove)
      root.removeEventListener('touchend', onEnd)
      root.removeEventListener('touchcancel', onEnd)
    }
  }, [pullToRefresh, refreshing])

  return (
    <div ref={rootRef} className='custom-div' style={{ '--bg-color': backgroundColor } as React.CSSProperties}>
        <div ref={headerRef}>{headerElement}</div>
        {/* 스크롤 영역 밖(.custom-div 기준)에 둔다. 스크롤 영역에 position을 주면 글쓰기 버튼 같은 absolute 요소가 내용과 함께 스크롤된다 */}
        {pullToRefresh && (
          <div ref={indicatorRef} className={`pull-indicator ${refreshing ? 'pull-indicator--spinning' : ''}`} aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 12a8 8 0 1 1-2.34-5.66" />
              <path d="M20 4v4h-4" />
            </svg>
          </div>
        )}
        <div className='custom-div-body'>
            {children}
        </div>
        <div>{footerElement}</div>
    </div>
  )
}

// 손가락이 닿은 곳부터 위로, 스크롤되는 영역이 모두 맨 위일 때만 당길 수 있다
function isAtTop(target: HTMLElement, root: HTMLElement) {
  // 입력칸, 지도는 제외
  if (target.closest('input, textarea, select, [contenteditable="true"], .route-map')) return false
  for (let el: HTMLElement | null = target; el && el !== root; el = el.parentElement) {
    if (el.scrollTop > 0) return false
  }
  return true
}

export default CustomDiv
