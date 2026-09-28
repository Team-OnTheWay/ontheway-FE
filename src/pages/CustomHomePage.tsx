import { useRef, useState } from 'react'
import CustomLogo from '../components/CustomLogo'
import CustomFilterBar from '../components/CustomFilterBar'
import CustomDeliveryCard from '../components/CustomDeliveryCard'
import CustomFab from '../components/CustomFab'
import CustomNavBar from '../components/CustomNavBar'
import './CustomHomePage.css'
import CustomDiv from '../components/CustomDiv'
import { useNavigate } from 'react-router-dom'
import { Delivery } from '../api/Delivery'
import { toPage, useInfiniteList } from '../hooks/useInfiniteList'
import InfiniteListFooter from '../components/InfiniteListFooter'
import { EMPTY_FILTERS, filterQuery, type FilterValues } from '../utils/filter'
import { errorMessage, formatDate, formatNumber, formatTime } from '../utils/apiFormat'

const PAGE_SIZE = 20

function CustomHomePage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS)
    const bodyRef = useRef<HTMLDivElement>(null)
    // 필터가 바뀔 때마다 이동 경로 게시글 목록을 처음부터 다시 불러온다
    const list = useInfiniteList(
        page => new Delivery()
            .list3({ deliveryListRequestDto: { ...filterQuery(filters), page, size: PAGE_SIZE } })
            .then(res => toPage(res.data.data?.deliveryList, PAGE_SIZE)),
        JSON.stringify(filters),
    )
    const { items, status, error } = list

    // 로고를 누르면 맨 위로 올리고 새로고침
    const handleLogoClick = () => {
        // 목록 영역과 그걸 감싼 CustomDiv 본문 중 스크롤되는 쪽을 올린다
        for (let el: HTMLElement | null = bodyRef.current; el && !el.classList.contains('custom-div'); el = el.parentElement) {
            el.scrollTo({ top: 0, behavior: 'smooth' })
        }
        list.refresh()
    }

    return (
        <CustomDiv backgroundColor={'#f3f4f6'} onRefresh={list.refresh} headerElement={<div className="home-page__header">
                <button className="home-page__logo-button" onClick={handleLogoClick} aria-label="새로고침">
                    <CustomLogo className="home-page__logo" />
                </button>
            </div>} footerElement={<CustomNavBar />}>
            <CustomFilterBar className="home-page__filters" onChange={setFilters} />
            <div className="home-page__body" ref={bodyRef}>
                <div className="home-page__cards">
                    {status === 'loading' && <p className="list-message">불러오는 중이에요.</p>}
                    {status === 'error' && <p className="list-message">{errorMessage(error, '게시글을 불러오지 못했어요.')}</p>}
                    {status === 'done' && items.length === 0 && <p className="list-message">등록된 이동 경로가 없어요.</p>}
                    {status === 'done' && items.map(item => (
                        <CustomDeliveryCard
                            key={item.deliveryId}
                            id={item.deliveryId ?? 0}
                            count={item.requestCount ?? 0}
                            startAddr={item.startAddress ?? ''}
                            endAddr={item.endAddress ?? ''}
                            date={formatDate(item.deliveryDate)}
                            startTime={formatTime(item.deliveryDate)}
                            price={formatNumber(item.hopePrice)}
                        />
                    ))}
                    <InfiniteListFooter list={list} />
                </div>
            </div>

            <div className="home-page__fab">
                <CustomFab onClick={() => navigate('/delivery/write')}/>
            </div>
        </CustomDiv>
    )
}

export default CustomHomePage
