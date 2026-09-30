import { useEffect, useState } from 'react'
import { toPage, useInfiniteList } from '../hooks/useInfiniteList'
import InfiniteListFooter from '../components/InfiniteListFooter'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomTab from '../components/CustomTab'
import CustomReviewCard from '../components/CustomReviewCard'
import CustomProfile from '../components/CustomProfile'
import './CustomReviewPage.css'
import CustomDiv from '../components/CustomDiv'
import { Review } from '../api/Review'
import { User } from '../api/User'
import { useMyInfo } from '../hooks/useMyInfo'
import { errorMessage, formatDate } from '../utils/apiFormat'

// GET /review/me/list 응답 항목 (스웨거에 형태가 없어 서버 코드 기준)
interface ReviewItem {
    reviewId: number
    reviewContent: string
    rating: number
    reviewerImage: string | null
    reviewerName: string
    reviewDate: string
}

// GET /user/ratings 응답
interface RatingSummary {
    averageRating: number
    reviewCount: number
}

const TABS = ['보낸후기', '받은후기']
const PAGE_SIZE = 20
const fetchSummary = () => new User().ratings().then(res => (res.data.data as RatingSummary) ?? null)
 
function CustomReviewPage() {
    const { info } = useMyInfo()
    const [tab, setTab] = useState(1)   // 조회 API가 있는 '받은후기'부터 보여준다
    const [summary, setSummary] = useState<RatingSummary | null>(null)
    const list = useInfiniteList(
        page => new Review().list({ dto: { page, size: PAGE_SIZE } })
            .then(res => toPage((res.data.data as { reviewList?: ReviewItem[] } | undefined)?.reviewList)),
        'received',
    )
    const { items: reviews, status } = list
    const error = errorMessage(list.error, '후기를 불러오지 못했어요.')

    useEffect(() => {
        fetchSummary().then(setSummary).catch(() => setSummary(null))
    }, [])

    const refresh = () => Promise.all([list.refresh(), fetchSummary().then(setSummary).catch(() => {})])

    return (
        <CustomDiv backgroundColor={'#f3f4f6'} onRefresh={refresh}>
            <CustomTopAppBar variant="centered" title={info ? `${info.nickName}님의 후기` : '후기'} />
 
            <div className="review-page__tab">
                <CustomTab tabs={TABS} activeIndex={tab} onChange={setTab} />
            </div>
 
            <div className="review-page__list">
                {tab === 0 && <p className="list-message">보낸 후기 조회는 아직 지원되지 않아요.</p>}

                {tab === 1 && <>
                    {status === 'loading' && <p className="list-message">불러오는 중이에요.</p>}
                    {status === 'error' && <p className="list-message">{error}</p>}
                    {status === 'done' && summary && summary.reviewCount > 0 && (
                        <p className="review-page__summary">평균 {summary.averageRating.toFixed(1)} · 후기 {summary.reviewCount}건</p>
                    )}
                    {status === 'done' && reviews.length === 0 && <p className="list-message">아직 받은 후기가 없어요.</p>}
                    {status === 'done' && reviews.map(r => (
                        <CustomReviewCard
                            key={r.reviewId}
                            profileElement={r.reviewerImage
                                ? <img className="review-page__avatar" src={r.reviewerImage} alt="" />
                                : <CustomProfile width={40} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />}
                            nickname={r.reviewerName}
                            date={formatDate(r.reviewDate)}
                            rating={Number(r.rating)}
                            content={r.reviewContent}
                        />
                    ))}
                    <InfiniteListFooter list={list} />
                </>}
            </div>
        </CustomDiv>
    )
}
 
export default CustomReviewPage
