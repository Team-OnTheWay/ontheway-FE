import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Review } from '../api/Review'
import { Delivery } from '../api/Delivery'
import { errorMessage, formatDate } from '../utils/apiFormat'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfileCard from '../components/CustomProfileCard'
import CustomProfile from '../components/CustomProfile'
import TextArea from '../components/TextArea'
import CustomButton from '../components/CustomButton'
import './CustomReviewWritePage.css'
import CustomDiv from '../components/CustomDiv'
import { StarIcon } from '../components/CustomIcon'
 
const RATING_LABELS = ['평가를 선택해주세요', '별로예요', '그저 그래요', '괜찮아요', '만족해요', '최고예요']
 
function CustomReviewWritePage() {
    const navigate = useNavigate()
    // 이용내역의 '후기 작성하기' -> /review/write?boardId=3
    const boardId = Number(useSearchParams()[0].get('boardId')) || null
    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [partner, setPartner] = useState<{ name: string; date: string } | null>(null)

    // 상대방 정보 (이동 경로 상세에서 가져온다, 실패하면 카드를 숨긴다)
    useEffect(() => {
        if (!boardId) return
        new Delivery().detail1({ deliveryDetailRequestDto: { deliveryId: boardId } })
            .then(res => {
                const d = res.data.data
                if (d?.userName) setPartner({ name: d.userName, date: formatDate(d.deliveryDate) })
            })
            .catch(() => {})
    }, [boardId])

    const handleSubmit = async () => {
        if (!boardId) return alert('후기를 남길 배송 정보가 없어요. 이용내역에서 다시 시도해주세요.')
        if (!rating) return alert('별점을 선택해주세요.')
        if (!content.trim()) return alert('후기를 입력해주세요.')
        setSubmitting(true)
        try {
            await new Review().create({ boardId, rating, content: content.trim() })
            alert('후기가 등록되었습니다.')
            navigate('/history', { replace: true })
        } catch (err) {
            alert(errorMessage(err, '후기 등록에 실패했어요.'))
        } finally {
            setSubmitting(false)
        }
    }
 
    return (
        <CustomDiv>
            <CustomTopAppBar variant="centered" title="배송 후기 작성" />
 
            <div className="review-write__body">
                {partner && <CustomProfileCard
                    nickname={partner.name}
                    date={partner.date}
                    rateing={0}
                    review={0}
                    chipElement={null}
                    profileElement={<CustomProfile width={40} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />}
                />}
 
                {/* 별점 + 라벨 (피그마대로 직접 구현, 클릭해서 선택) */}
                <div className="review-write__rating">
                    <div className="review-write__stars">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <button
                                key={i}
                                type="button"
                                className="review-write__star"
                                onClick={() => setRating(i)}
                                aria-label={`${i}점`}
                            >
                                <StarIcon filled={i <= rating} />
                            </button>
                        ))}
                    </div>
                    <p className="review-write__rating-label">{RATING_LABELS[rating]}</p>
                </div>
 
                {/* 후기 입력 */}
                <div className="review-write__area">
                    <p className="review-write__area-label">후기를 남겨주세요</p>
                    <TextArea borderColor="gray" value={content} onChange={setContent} placeholder="배송은 어떠셨나요? 후기를 남겨주세요." />
                </div>
            </div>
 
            <div className="review-write__footer">
                <CustomButton name={submitting ? "등록 중..." : "등록하기"} color="#fd5d35" fontColor="#ffffff" size="lg" onClick={submitting ? undefined : handleSubmit} />
            </div>
        </CustomDiv>
    )
}
 
export default CustomReviewWritePage