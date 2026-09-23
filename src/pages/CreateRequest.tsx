import DaumPostcode, { type Address } from 'react-daum-postcode'
import './CreateRequest.css'
import './postcode.css'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomButton from '../components/CustomButton'
import TextField from '../components/TextField'
import TextArea from '../components/TextArea'
import TimeInput from '../components/TimeInput'
import { Circle, MapPin, PathXButton } from '../components/CustomIcon'
import { Info2 } from '../components/Info'
import CustomCheckbox from '../components/CustomCheckbox'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Product } from '../api/Product'
import { errorMessage, formatDate, formatTime, parseDateInput, parsePrice, toLocalDateTime } from '../utils/apiFormat'
import { geocode } from '../utils/geocode'
import CustomDiv from '../components/CustomDiv'

function RequestXButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            type="button"
            className='create-request-x'
            onClick={(e) => {
                e.stopPropagation()   // 바깥 주소 칸의 onClick(검색창 열기)으로 전달되지 않게
                onClick?.()
            }}
        >
            <PathXButton/>
        </button>
    )
}

function CreateRequest() {
    const [payment, setPayment] = useState<'pre' | 'post'>('pre')

    // ?id=12 로 들어오면 수정 모드 (기존 값을 불러와 채운다)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editId = Number(searchParams.get('id')) || null

    const [productName, setProductName] = useState('')
    const [productInfo, setProductInfo] = useState('')
    const [receivingDate, setReceivingDate] = useState('')
    const [receivingStart, setReceivingStart] = useState('08:00')
    const [receivingEnd, setReceivingEnd] = useState('09:00')
    const [arrivalDate, setArrivalDate] = useState('')
    const [arrivalStart, setArrivalStart] = useState('09:00')
    const [arrivalEnd, setArrivalEnd] = useState('10:00')
    const [fee, setFee] = useState('')
    const [agreed, setAgreed] = useState(false)   // QA: 고지사항 동의는 기본 해제
    const [submitting, setSubmitting] = useState(false)

    // 주소는 사용자가 검색해서 채우므로 상태로 관리
    const [pickupAddr, setPickupAddr] = useState('')
    const [pickupDetail, setPickupDetail] = useState('')
    const [destAddr, setDestAddr] = useState('')
    const [destDetail, setDestDetail] = useState('')

    // 지금 검색 중인 칸: 'pickup' | 'dest' | null(닫힘)
    const [searchTarget, setSearchTarget] = useState<'pickup' | 'dest' | null>(null)

    // 수정 모드: 기존 물품 게시글 불러오기
    useEffect(() => {
        if (!editId) return
        new Product().detail({ productDetailRequestDto: { productId: editId } })
            .then(res => {
                const d = res.data.data
                if (!d) return
                setPickupAddr(d.productDeliveryAddress ?? '')
                setDestAddr(d.deliveryDestination ?? '')
                setProductName(d.productName ?? '')
                setProductInfo(d.productInfo ?? '')
                setFee(d.deliveryFee !== undefined ? String(d.deliveryFee) : '')
                setPayment(d.paymentType === 'POSTPAID' ? 'post' : 'pre')
                setReceivingDate(formatDate(d.receivingTime))
                if (d.receivingTime) setReceivingStart(formatTime(d.receivingTime))
                setArrivalDate(formatDate(d.desiredDeliveryTime))
                if (d.desiredDeliveryTime) setArrivalEnd(formatTime(d.desiredDeliveryTime))
            })
            .catch(err => alert(errorMessage(err, '게시글을 불러오지 못했어요.')))
    }, [editId])

    const fullAddress = (addr: string, detail: string) => detail.trim() ? `${addr} ${detail.trim()}` : addr

    const handleSubmit = async () => {
        const receiving = parseDateInput(receivingDate)
        const arrival = parseDateInput(arrivalDate)
        const deliveryFee = parsePrice(fee)
        if (!pickupAddr || !destAddr) return alert('물건수령지와 배송목적지를 선택해주세요.')
        if (!productName.trim()) return alert('물품명을 입력해주세요.')
        if (!receiving) return alert('수령일을 2026.09.21 또는 9월21일 형식으로 입력해주세요.')
        if (!arrival) return alert('가는날을 2026.09.22 또는 9월22일 형식으로 입력해주세요.')
        if (deliveryFee === undefined) return alert('배송비를 입력해주세요.')
        if (!agreed) return alert('고지사항을 확인하고 동의해주세요.')

        setSubmitting(true)
        try {
            // 물품 게시글은 수령지·목적지 좌표가 필수라 주소로 좌표를 찾는다
            const [pickup, dest] = await Promise.all([geocode(pickupAddr), geocode(destAddr)])
            if (!pickup || !dest) {
                alert('주소의 위치를 찾지 못했어요. 주소를 다시 선택해주세요.')
                return
            }
            const body = {
                productName: productName.trim(),
                productInfo,
                productDeliveryAddress: fullAddress(pickupAddr, pickupDetail),
                productDeliveryLatitude: pickup.lat,
                productDeliveryLongitude: pickup.lng,
                endAddress: fullAddress(destAddr, destDetail),
                endLatitude: dest.lat,
                endLongitude: dest.lng,
                deliveryFee,
                // API는 시각 하나만 받으므로 수령시간은 시작 시각, 배송도착시간은 끝 시각을 보낸다
                receivingTime: toLocalDateTime(receiving, receivingStart),
                desiredDeliveryTime: toLocalDateTime(arrival, arrivalEnd),
                paymentType: payment === 'pre' ? 'PREPAID' as const : 'POSTPAID' as const,
            }
            if (editId) {
                await new Product().update({ productId: editId, ...body })
                alert('배송 의뢰가 수정되었습니다.')
            } else {
                await new Product().create1(body)
                alert('배송 의뢰가 등록되었습니다.')
            }
            // 작성완료 후에는 내 게시글의 배송의뢰 탭으로
            navigate('/my/post?tab=1', { replace: true })
        } catch (error) {
            alert(errorMessage(error, editId ? '배송 의뢰 수정에 실패했어요.' : '배송 의뢰 등록에 실패했어요.'))
        } finally {
            setSubmitting(false)
        }
    }

    // 주소 선택 시 → 검색 중이던 칸에 넣고 창 닫기
    const handleComplete = (data: Address) => {
        if (searchTarget === 'pickup') setPickupAddr(data.address)
        if (searchTarget === 'dest') setDestAddr(data.address)
        setSearchTarget(null)
    }

    return (
        <CustomDiv>
        
            <CustomTopAppBar title="배송의뢰"/>

            <div className="create-request-content">
                <section className="request-section">
                    <div className="request-section-title">경로정보</div>

                    <div className="request-route">
                        <div className="request-route-item">
                            <div className="request-route-icon start-icon">
                                <Circle width={16} height={16} stroke="#4576F7"/>
                                <div className="request-line"></div>
                            </div>

                            <div className="request-route-content">
                                <div className="request-label">물건수령지</div>

                                {/* 칸을 누르면 주소 검색이 열림, X는 비우기 */}
                                <div className="request-address" onClick={() => setSearchTarget('pickup')}>
                                    <span className={pickupAddr ? '' : 'placeholder'}>{pickupAddr || '물건수령지를 검색해주세요'}</span>
                                    <RequestXButton onClick={() => setPickupAddr('')}/>
                                </div>

                                {/* 상세 주소는 직접 입력 */}
                                <div className="request-address">
                                    <input value={pickupDetail} onChange={(e) => setPickupDetail(e.target.value)} placeholder="상세 주소 (예: 건물 앞)"/>
                                    <RequestXButton onClick={() => setPickupDetail('')}/>
                                </div>
                            </div>
                        </div>

                        <div className="request-route-item">
                            <div className="request-route-icon">
                                <MapPin width={16} height={16} stroke="#FD5D35"/>
                            </div>

                            <div className="request-route-content">
                                <div className="request-label">배송목적지</div>

                                <div className="request-address" onClick={() => setSearchTarget('dest')}>
                                    <span className={destAddr ? '' : 'placeholder'}>{destAddr || '배송목적지를 검색해주세요'}</span>
                                    <RequestXButton onClick={() => setDestAddr('')}/>
                                </div>

                                <div className="request-address">
                                    <input value={destDetail} onChange={(e) => setDestDetail(e.target.value)} placeholder="상세 주소 (예: 건물 앞)"/>
                                    <RequestXButton onClick={() => setDestDetail('')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="request-section">
                    <div className="request-section-title">물품정보</div>
                    <TextField label="물품명" height={48} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="노트북 파우치" timer={false} rightButton="none"
                        value={productName} onChange={(e) => setProductName(e.target.value)}/>

                    <div className="request-textarea">
                        <div className="request-label">추가정보</div>
                        <TextArea borderColor="gray" value={productInfo} onChange={setProductInfo} placeholder="물품에 대해 알려주세요."/>
                    </div>
                </section>

                <section className="request-section">
                    <TextField label="수령일" height={48} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="9월21일" timer={false} rightButton="none"
                        value={receivingDate} onChange={(e) => setReceivingDate(e.target.value)}/>

                    <div className="request-time">
                        <div className="request-label">수령시간</div>
                        <TimeInput borderColor="gray" backgroundColor="white" start={receivingStart} end={receivingEnd}
                            onChange={(start, end) => { setReceivingStart(start); setReceivingEnd(end) }}/>
                    </div>
                </section>

                <section className="request-section">
                    <div className="request-section-title">배송정보</div>
                    <TextField label="가는날" height={48} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="9월22일" timer={false} rightButton="none"
                        value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)}/>

                    <div className="request-time">
                        <div className="request-label">배송도착시간</div>
                        <TimeInput borderColor="gray" backgroundColor="white" start={arrivalStart} end={arrivalEnd}
                            onChange={(start, end) => { setArrivalStart(start); setArrivalEnd(end) }}/>
                    </div>

                    <TextField label="배송비" height={48} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="15,000원" timer={false} rightButton="none"
                        value={fee} onChange={(e) => setFee(e.target.value)}/>
                </section>

                <section className="request-section payment-section">
                    <div className="request-section-title">결제방식</div>
                    <div className="request-label">결제 시점</div>

                    <div className="payment-buttons">
                        <button className={`payment-button ${payment === 'pre' ? 'active' : ''}`} onClick={() => setPayment('pre')}>선결제</button>
                        <button className={`payment-button ${payment === 'post' ? 'active' : ''}`} onClick={() => setPayment('post')}>후불결제</button>
                    </div>
                </section>

                <Info2 content={
                    <>
                        <div className="info-line"><span>ㆍ</span><p>금지물품 : 위험물, 마약류, 현금, 귀중품, 의약품</p></div>
                        <div className="info-line"><span>ㆍ</span><p>포장책임 : 물품 포장 및 파손 방지 책임은 의뢰인에게 있습니다.</p></div>
                    </>
                }/>

                <CustomCheckbox label="위 고지사항을 확인하고 동의합니다." size="sm" checked={agreed} onChange={setAgreed}/>

                <div className="create-request-button">
                    <CustomButton name={submitting ? '저장 중...' : editId ? '수정하기' : '작성완료'} color="#FD5D35" fontColor="#FFFFFF" size="lg" onClick={submitting ? undefined : handleSubmit}/>
                </div>
            </div>

            {/* 주소 검색 오버레이 — searchTarget이 있을 때만 */}
            {searchTarget && (
                <div className="postcode-overlay" onClick={() => setSearchTarget(null)}>
                    <div className="postcode-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="postcode-header">
                            <span>{searchTarget === 'pickup' ? '물건수령지' : '배송목적지'} 검색</span>
                            <RequestXButton onClick={() => setSearchTarget(null)}/>
                        </div>
                        <DaumPostcode onComplete={handleComplete} style={{ flex: 1 }}/>
                    </div>
                </div>
            )}
        </CustomDiv>
    )
}

export default CreateRequest