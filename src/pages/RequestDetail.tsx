import './RequestDetail.css'
import { useEffect, useState } from 'react'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfile from '../components/CustomProfile'
import CustomRouteInfo from '../components/CustomRouteInfo'
import CustomButton from '../components/CustomButton'
import { CheckIcon, ClockIcon, WalletIcon } from '../components/CustomIcon'
import { useNavigate, useParams } from 'react-router-dom'
import CustomProfileCard from '../components/CustomProfileCard'
import CustomDiv from '../components/CustomDiv'
import { Product } from '../api/Product'
import type { ProductDetailResponseDto } from '../api/data-contracts'
import { errorMessage, formatDate, formatDateTime, formatKoreanDate, formatNumber, formatTime, paymentLabel } from '../utils/apiFormat'

function RequestDetail(){
    const navigate = useNavigate()
    const productId = Number(useParams().id)
    const [detail, setDetail] = useState<ProductDetailResponseDto | null>(null)
    const [error, setError] = useState('')

    // 물품 게시글 상세 (본인 글만 조회된다)
    useEffect(() => {
        if (!productId) return
        new Product().detail({ productDetailRequestDto: { productId } })
            .then(res => setDetail(res.data.data ?? null))
            .catch(err => setError(errorMessage(err, '게시글을 불러오지 못했어요.')))
    }, [productId])

    const handleDelete = async () => {
        if (!confirm('이 배송 의뢰를 삭제할까요?')) return
        try {
            await new Product().delete(productId)
            alert('삭제되었습니다.')
            navigate('/my/post', { replace: true })
        } catch (err) {
            alert(errorMessage(err, '삭제에 실패했어요.'))
        }
    }

    const items = detail ? [
        { icon: <ClockIcon/>, label: '물품명', value: detail.productName },
        { icon: <ClockIcon/>, label: '추가정보', value: detail.productInfo },
        { icon: <ClockIcon/>, label: '희망 수령 시간', value: formatDateTime(detail.receivingTime) },
        { icon: <WalletIcon/>, label: '결제 방식', value: paymentLabel(detail.paymentType) },
    ] : []

    return(
        <CustomDiv backgroundColor='#f3f4f6'>
            <CustomTopAppBar title="배송의뢰"/>

            <div className="request-detail__body">
                {!detail && <p className="list-message">{error || '불러오는 중이에요.'}</p>}

                {detail && <>
                    <CustomProfileCard
                        nickname={detail.userName ?? ''}
                        date={formatDate(detail.createdAt)}
                        rateing={0}
                        review={0}
                        chipElement={null}
                        profileElement={<CustomProfile width={40} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />}
                    />

                    <CustomRouteInfo
                        startAddr={detail.productDeliveryAddress ?? ''}
                        endAddr={detail.deliveryDestination ?? ''}
                        date={formatKoreanDate(detail.desiredDeliveryTime)}
                        time={formatTime(detail.desiredDeliveryTime)}
                        price={`${formatNumber(detail.deliveryFee)}원`}
                        priceLabel="배송비"
                    />

                    <section className="request-detail__card">
                        <div className="request-detail__title">물품정보</div>

                        <div className="request-detail__product-info">
                            {items.map(item => (
                                <div className="request-detail__product-item" key={item.label}>
                                    {item.icon}
                                    <div className="request-detail__product-content">
                                        <div className="request-detail__product-label">{item.label}</div>
                                        <div className="request-detail__product-value">{item.value || '-'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="request-detail__notice">
                            <CheckIcon/>
                            <p>위 허용금지 물품 기준과 포장 책임 범위를<br/>확인하였으며 동의하였습니다.</p>
                        </div>
                    </section>
                </>}
            </div>

            {detail && (
                <div className="request-detail__footer">
                    <div className="request-detail__buttons">
                        <CustomButton name="삭제하기" color="#FEF1ED" fontColor="#FD5D35" size="md" onClick={handleDelete}/>
                        <CustomButton name="수정하기" color="#FD5D35" fontColor="#FFFFFF" size="md" onClick={() => navigate(`/product/write?id=${productId}`)}/>
                    </div>
                </div>
            )}
        </CustomDiv>
    )
}

export default RequestDetail
