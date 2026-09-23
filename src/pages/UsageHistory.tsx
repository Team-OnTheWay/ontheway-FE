import { useState } from 'react'
import { useAsync } from '../hooks/useAsync'
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

const PAGE = { historyListRequestDto: { page: 0, size: 50 } }

async function fetchHistory(tab: Tab): Promise<HistoryList[]> {
    const api = new History()
    if (tab === 'matched') return (await api.deliveryList(PAGE)).data.data?.historyList ?? []
    if (tab === 'requested') return (await api.requestList(PAGE)).data.data?.historyList ?? []
    if (tab === 'canceled') return (await api.cancelList(PAGE)).data.data?.historyList ?? []
    try {
        return (await api.list2(PAGE)).data.data?.historyList ?? []
    } catch {
        // 전체 목록 API(/history/list)가 서버 오류일 때는 세 목록을 합쳐 최신순으로 보여준다
        const lists = await Promise.all(CHIPS.map(chip => fetchHistory(chip.tab)))
        return lists.flat().sort((a, b) => (b.deliveryDate ?? '').localeCompare(a.deliveryDate ?? ''))
    }
}

// 후기는 배송이 끝난 건(완료, 취소·중단)에서만 쓸 수 있다
const canReview = (item: HistoryList) =>
    item.deliveryStatus === 'COMPLETED' || item.boardType === 'FAILED_AND_CANCELLED'

function UsageHistory(){
    const [tab, setTab] = useState<Tab>('all')
    const { loading, data, error } = useAsync(() => fetchHistory(tab), tab)
    const items = data ?? []
    const status = loading ? 'loading' : error ? 'error' : 'done'

    return(
        <CustomDiv backgroundColor='#F3F4F6' footerElement={<CustomNavBar initialActive="history"/>}>
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
                        />
                    ))}
                </div>
            </div>
        </CustomDiv>
    )
}

export default UsageHistory
