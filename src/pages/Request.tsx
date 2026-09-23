import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProductCard from '../components/CustomProductCard'
import CustomButton from '../components/CustomButton'
import './Request.css'
import CustomDiv from '../components/CustomDiv'
import { PlusIcon } from '../components/CustomIcon'
import { Product } from '../api/Product'
import { Request as RequestApi } from '../api/Request'
import type { Product as ProductItem } from '../api/data-contracts'
import { errorMessage, formatNumber } from '../utils/apiFormat'

// 이동 경로 상세의 '의뢰하기' -> /delivery/request?deliveryId=3
// 내 물품 게시글 중 하나를 골라 그 경로에 배송을 의뢰한다
function Request(){
    const navigate = useNavigate();
    const deliveryId = Number(useSearchParams()[0].get('deliveryId')) || null
    const [products, setProducts] = useState<ProductItem[]>([])
    const [loaded, setLoaded] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        new Product().list1({ productListRequestDto: { page: 0, size: 50 } })
            .then(res => setProducts(res.data.data?.productList ?? []))
            .catch(err => alert(errorMessage(err, '물품 목록을 불러오지 못했어요.')))
            .finally(() => setLoaded(true))
    }, [])

    const handleSubmit = async () => {
        if (!deliveryId) return alert('의뢰할 이동 경로 정보가 없어요. 이동 경로 게시글에서 다시 시도해주세요.')
        if (!selectedId) return alert('의뢰할 물품을 선택해주세요.')
        setSubmitting(true)
        try {
            await new RequestApi().register({ deliveryId, productId: selectedId })
            alert('배송 의뢰를 보냈습니다.')
            navigate(`/delivery/detail/${deliveryId}`, { replace: true })
        } catch (err) {
            alert(errorMessage(err, '배송 의뢰에 실패했어요.'))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <CustomDiv>
            <CustomTopAppBar title="요청하기"/>
                <div className="request-products">
                    <div className='request-product-list'>
                        {loaded && products.length === 0 && <p className="list-message">등록한 배송 의뢰 물품이 없어요.<br/>새글을 추가해주세요.</p>}
                        {products.map(product => (
                            <CustomProductCard
                                key={product.productId}
                                number={`물품번호 ${product.productSerialNumber ?? ''}`}
                                category={product.productName ?? ''}
                                money={formatNumber(product.deliveryPrice)}
                                selected={product.productId === selectedId}
                                onClick={() => setSelectedId(product.productId ?? null)}
                            />
                        ))}

                        <div className='new-box' onClick={() => navigate('/product/write')}>
                            <PlusIcon/>
                            <div>새글추가</div>
                        </div>
                    </div>

                    <div className='request-button'>
                        <CustomButton name={submitting ? "요청 중..." : "의뢰등록"} color={selectedId ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={submitting ? undefined : handleSubmit}/>
                    </div>
                </div>
        </CustomDiv>
    )
}

export default Request
