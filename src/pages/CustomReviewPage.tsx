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

// GET /review/me/list 응답 항목 (받은 후기: 나에게 써 준 사람. 스웨거에 형태가 없어 서버 코드 기준)
interface ReviewItem {
    reviewId: number
    reviewContent: string
    rating: number
    reviewerImage: string | null
    reviewerName: string
    reviewDate: string
}

// GET /review/me/written 응답 항목 (보낸 후기: 내가 써 준 상대방)
interface WrittenReviewItem {
    reviewId: number
    reviewContent: string
    rating: number
    targetImage: string | null
    targetName: string
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
    const [tab, setTab] = useState(1)   // 처음에는 '받은후기' 탭
    const isWritten = tab === 0          // TABS = ['보낸후기', '받은후기']
    const [summary, setSummary] = useState<RatingSummary | null>(null)
    // 보낸 후기는 상대방 정보(target*)를 받은 후기와 같은 모양으로 바꿔서 카드 하나로 그린다
    const list = useInfiniteList<ReviewItem>(
        page => isWritten
            ? new Review().written({ dto: { page, size: PAGE_SIZE } })
                .then(res => toPage(((res.data.data as { reviewList?: WrittenReviewItem[] } | undefined)?.reviewList ?? [])
                    .map(({ targetName, targetImage, ...r }) => ({ ...r, reviewerName: targetName, reviewerImage: targetImage }))))
            : new Review().list({ dto: { page, size: PAGE_SIZE } })
                .then(res => toPage((res.data.data as { reviewList?: ReviewItem[] } | undefined)?.reviewList)),
        isWritten ? 'written' : 'received',   // 탭이 바뀌면 목록을 새로 불러온다
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
                <>
                    {status === 'loading' && <p className="list-message">불러오는 중이에요.</p>}
                    {status === 'error' && <p className="list-message">{error}</p>}
                    {!isWritten && status === 'done' && summary && summary.reviewCount > 0 && (
                        <p className="review-page__summary">평균 {summary.averageRating.toFixed(1)} · 후기 {summary.reviewCount}건</p>
                    )}
                    {status === 'done' && reviews.length === 0 && (
                        <p className="list-message">{isWritten ? '아직 작성한 후기가 없어요.' : '아직 받은 후기가 없어요.'}</p>
                    )}
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
                </>
            </div>
        </CustomDiv>
    )
}
 
export default CustomReviewPage
