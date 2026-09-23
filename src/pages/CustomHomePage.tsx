import { useState } from 'react'
import CustomLogo from '../components/CustomLogo'
import CustomFilterBar from '../components/CustomFilterBar'
import CustomDeliveryCard from '../components/CustomDeliveryCard'
import CustomFab from '../components/CustomFab'
import CustomNavBar from '../components/CustomNavBar'
import './CustomHomePage.css'
import CustomDiv from '../components/CustomDiv'
import { useNavigate } from 'react-router-dom'
import { Delivery } from '../api/Delivery'
import { useAsync } from '../hooks/useAsync'
import { EMPTY_FILTERS, filterQuery, type FilterValues } from '../utils/filter'
import { errorMessage, formatDate, formatNumber, formatTime } from '../utils/apiFormat'

const PAGE_SIZE = 50

function CustomHomePage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS)
    // 필터가 바뀔 때마다 이동 경로 게시글 목록을 다시 불러온다
    const { loading, data, error } = useAsync(
        () => new Delivery()
            .list3({ deliveryListRequestDto: { ...filterQuery(filters), page: 0, size: PAGE_SIZE } })
            .then(res => res.data.data?.deliveryList ?? []),
        JSON.stringify(filters),
    )
    const items = data ?? []
    const status = loading ? 'loading' : error ? 'error' : 'done'

    return (
        <CustomDiv backgroundColor={'#f3f4f6'} headerElement={<div className="home-page__header">
                <CustomLogo className="home-page__logo" />
            </div>} footerElement={<CustomNavBar />}>
            <CustomFilterBar className="home-page__filters" onChange={setFilters} />
            <div className="home-page__body">
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
                </div>
            </div>

            <div className="home-page__fab">
                <CustomFab onClick={() => navigate('/delivery/write')}/>
            </div>
        </CustomDiv>
    )
}

export default CustomHomePage
