import { useState } from 'react'
import { toPage, useInfiniteList, type ListPage } from '../hooks/useInfiniteList'
import InfiniteListFooter from '../components/InfiniteListFooter'
import './UsageHistory.css'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomFilterChip from '../components/CustomFilterChip'
import CustomDeliveryCard from '../components/CustomDeliveryCard'
import CustomNavBar from '../components/CustomNavBar'
import CustomDiv from '../components/CustomDiv'
import { History } from '../api/History'
import type { HistoryList } from '../api/data-contracts'
import { errorMessage, formatDate, formatNumber, formatTime } from '../utils/apiFormat'

// 칩을 안 누르면 전체, 누르면 해당 목록만 (같은 칩을 다시 누르면 전체로)
type Tab = 'all' | 'matched' | 'requested' | 'canceled'
const CHIPS: { tab: Exclude<Tab, 'all'>; label: string }[] = [
    { tab: 'matched', label: '매칭내역' },
    { tab: 'requested', label: '의뢰내역' },
    { tab: 'canceled', label: '취소 및 중단' },
]

const PAGE_SIZE = 20

async function fetchHistory(tab: Tab, page: number): Promise<ListPage<HistoryList>> {
    const api = new History()
    const query = { historyListRequestDto: { page, size: PAGE_SIZE } }
    const pageOf = (res: { data: { data?: { historyList?: HistoryList[] } } }) => toPage(res.data.data?.historyList)
    if (tab === 'matched') return pageOf(await api.deliveryList(query))
    if (tab === 'requested') return pageOf(await api.requestList(query))
    if (tab === 'canceled') return pageOf(await api.cancelList(query))
    try {
        return pageOf(await api.list2(query))
    } catch {
        // 전체 목록 API(/history/list)가 서버 오류일 때는 세 목록의 같은 페이지를 합쳐 최신순으로 보여준다
        const pages = await Promise.all(CHIPS.map(chip => fetchHistory(chip.tab, page)))
        return {
            items: pages.flatMap(p => p.items).sort((a, b) => (b.deliveryDate ?? '').localeCompare(a.deliveryDate ?? '')),
            hasNext: pages.some(p => p.hasNext),
        }
    }
}

// 후기는 배송이 완료된 건에서만 쓸 수 있다 (취소·중단 건은 제외)
const canReview = (item: HistoryList) => item.deliveryStatus === 'COMPLETED'

function UsageHistory(){
    const [tab, setTab] = useState<Tab>('all')
    const list = useInfiniteList(page => fetchHistory(tab, page), tab)
    const { items, status, error } = list

    return(
        <CustomDiv backgroundColor='#F3F4F6' onRefresh={list.refresh} footerElement={<CustomNavBar initialActive="history"/>}>
            <CustomTopAppBar variant="title" title="이용내역"/>

            <div className="usage-history__body">
                <div className="usage-history__filters">
                    {CHIPS.map(chip => (
                        <CustomFilterChip key={chip.tab} label={chip.label} selected={tab === chip.tab}
                            onClick={() => setTab(prev => prev === chip.tab ? 'all' : chip.tab)}/>
                    ))}
                </div>

                <div className="usage-history__cards">
                    {status === 'loading' && <p className="list-message">불러오는 중이에요.</p>}
                    {status === 'error' && <p className="list-message">{errorMessage(error, '이용내역을 불러오지 못했어요.')}</p>}
                    {status === 'done' && items.length === 0 && <p className="list-message">이용내역이 없어요.</p>}
                    {status === 'done' && items.map((item, i) => (
                        <CustomDeliveryCard
                            key={`${item.boardType}-${item.deliveryId}-${i}`}
                            id={item.deliveryId ?? 0}
                            startAddr={item.startAddress ?? ''}
                            endAddr={item.endAddress ?? ''}
                            date={formatDate(item.deliveryDate)}
                            startTime={formatTime(item.deliveryDate)}
                            price={formatNumber(item.deliveryFee)}
                            review={canReview(item)}
                            // 매칭내역(DELIVERY)은 내가 올린 경로 = 내가 전달자 -> 후기 상대는 의뢰자
                            reviewAsOwner={item.boardType === 'DELIVERY'}
                        />
                    ))}
                    <InfiniteListFooter list={list} />
                </div>
            </div>
        </CustomDiv>
    )
}

export default UsageHistory
