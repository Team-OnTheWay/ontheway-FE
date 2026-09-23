import { useState } from 'react'
import DaumPostcode, { type Address } from 'react-daum-postcode'
import './PathSetup.css'
import './postcode.css'
import CustomTopAppBar from '../components/CustomTopAppBar'
import EmptyState from '../components/EmptyState'
import RouteMap from '../components/RouteMap'
import CustomButton from '../components/CustomButton'
import { Circle, MapPin } from '../components/CustomIcon'
import TextField from '../components/TextField'
import TextArea from '../components/TextArea'
import TimeInput from '../components/TimeInput'
import CustomDiv from '../components/CustomDiv'
import { useNavigate } from 'react-router-dom'
import { Delivery } from '../api/Delivery'
import { errorMessage, parseDateInput, parsePrice, toLocalDateTime } from '../utils/apiFormat'
 
function PathXButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            type="button"
            className="x-button"
            onClick={(e) => {
                e.stopPropagation()   // 바깥 주소 칸의 onClick(검색창 열기)으로 전달되지 않게
                onClick?.()
            }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    )
}
 
function PathSetup() {
    // 주소는 사용자가 검색해서 채우므로 상태로 관리
    const [startAddr, setStartAddr] = useState('')
    const [startDetail, setStartDetail] = useState('')
    const [endAddr, setEndAddr] = useState('')
    const [endDetail, setEndDetail] = useState('')
 
    // 지금 검색 중인 칸: 'start' | 'end' | null(닫힘)
    const [searchTarget, setSearchTarget] = useState<'start' | 'end' | null>(null)

    // 배송정보
    const navigate = useNavigate()
    const [date, setDate] = useState('')
    const [price, setPrice] = useState('')
    const [startTime, setStartTime] = useState('08:00')
    const [endTime, setEndTime] = useState('10:00')
    const [addInfo, setAddInfo] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // 주소 + 상세 주소를 한 줄로 (API는 주소 칸이 하나뿐)
    const fullAddress = (addr: string, detail: string) => detail.trim() ? `${addr} ${detail.trim()}` : addr

    const handleSubmit = async () => {
        const deliveryDate = parseDateInput(date)
        const hopePrice = parsePrice(price)
        if (!startAddr || !endAddr) return alert('출발지와 도착지를 선택해주세요.')
        if (!deliveryDate) return alert('배송 가능날을 2026.09.22 또는 9월22일 형식으로 입력해주세요.')
        if (hopePrice === undefined) return alert('희망금액을 입력해주세요.')
        if (endTime <= startTime) return alert('예정시간의 끝 시간이 시작 시간보다 늦어야 해요.')

        setSubmitting(true)
        try {
            await new Delivery().create2({
                startAddress: fullAddress(startAddr, startDetail),
                endAddress: fullAddress(endAddr, endDetail),
                deliveryDate: toLocalDateTime(deliveryDate, startTime),
                estimatedDeliveryTime: toLocalDateTime(deliveryDate, endTime),
                hopePrice,
                addInfo,
            })
            alert('이동 경로가 등록되었습니다.')
            navigate('/my/post')
        } catch (error) {
            alert(errorMessage(error, '이동 경로 등록에 실패했어요.'))
        } finally {
            setSubmitting(false)
        }
    }
 
    // 주소 선택 시 → 검색 중이던 칸에 넣고 창 닫기
    const handleComplete = (data: Address) => {
        if (searchTarget === 'start') setStartAddr(data.address)
        if (searchTarget === 'end') setEndAddr(data.address)
        setSearchTarget(null)
    }
 
    return (
        <CustomDiv>
            <CustomTopAppBar title="경로등록" />
 
            <div className="recent-post">
                <div className="recent-post-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12C3 13.78 3.52784 15.5201 4.51677 17.0001C5.50571 18.4802 6.91131 19.6337 8.55585 20.3149C10.2004 20.9961 12.01 21.1743 13.7558 20.8271C15.5016 20.4798 17.1053 19.6226 18.364 18.364C19.6226 17.1053 20.4798 15.5016 20.8271 13.7558C21.1743 12.01 20.9961 10.2004 20.3149 8.55585C19.6337 6.91131 18.4802 5.50571 17.0001 4.51677C15.5201 3.52784 13.78 3 12 3C9.48395 3.00947 7.06897 3.99122 5.26 5.74L3 8" stroke="#FD5D35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 3V8H8" stroke="#FD5D35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7V12L16 14" stroke="#FD5D35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="recent-post-text">
                    <div className="recent-post-title">최근 등록한 게시물 불러오기</div>
                    <div className="recent-post-description">이전에 등록한 경로를 불러와 빠르게 작성해보세요.</div>
                </div>
            </div>
 
            <div className="path-info">
                <div className="path-info-title">경로정보</div>
 
                <div className="path-route">
                    {/* 출발지 */}
                    <div className="path-setup-item">
                        <div className="path-setup-icon start-icon">
                            <Circle width={16} height={16} stroke="#4576F7" />
                            <div className="path-line"></div>
                        </div>
                        <div className="path-setup-content">
                            <div className="path-setup-label">출발지</div>
 
                            {/* 칸을 누르면 주소 검색이 열림, X는 비우기 */}
                            <div className="path-setup-address-box" onClick={() => setSearchTarget('start')}>
                                <span className={startAddr ? '' : 'placeholder'}>{startAddr || '출발지를 검색해주세요'}</span>
                                <PathXButton onClick={() => setStartAddr('')} />
                            </div>
 
                            {/* 상세 주소는 직접 입력 */}
                            <div className="path-setup-address-box">
                                <input value={startDetail} onChange={(e) => setStartDetail(e.target.value)} placeholder="상세 주소 (예: 건물 앞)" />
                                <PathXButton onClick={() => setStartDetail('')} />
                            </div>
                        </div>
                    </div>
 
                    {/* 도착지 */}
                    <div className="path-setup-item">
                        <div className="path-setup-icon">
                            <MapPin width={16} height={16} stroke="#FD5D35" />
                        </div>
                        <div className="path-setup-content">
                            <div className="path-setup-label">도착지</div>
 
                            <div className="path-setup-address-box" onClick={() => setSearchTarget('end')}>
                                <span className={endAddr ? '' : 'placeholder'}>{endAddr || '도착지를 검색해주세요'}</span>
                                <PathXButton onClick={() => setEndAddr('')} />
                            </div>
 
                            <div className="path-setup-address-box">
                                <input value={endDetail} onChange={(e) => setEndDetail(e.target.value)} placeholder="상세 주소 (예: 건물 앞)" />
                                <PathXButton onClick={() => setEndDetail('')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
            {/* 출발지·도착지를 모두 고르면 지도, 아니면 안내 문구 */}
            <div className="registered-route">
                {startAddr && endAddr
                    ? <RouteMap startAddr={startAddr} endAddr={endAddr} />
                    : <EmptyState type="route" />}
            </div>
 
            <div className="delivery-section">
                <div className="delivery-title">배송정보</div>
 
                <TextField label="배송 가능날" height={48} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="9월22일" timer={false} rightButton="none"
                    value={date} onChange={(e) => setDate(e.target.value)} />
 
                <TextField label="희망금액" height={48} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="20,000원" timer={false} rightButton="none"
                    value={price} onChange={(e) => setPrice(e.target.value)} />
 
                <div className="delivery-time">
                    <div className="delivery-time-title">예정시간</div>
                    <TimeInput borderColor="gray" backgroundColor="white" start={startTime} end={endTime}
                        onChange={(start, end) => { setStartTime(start); setEndTime(end) }} />
                </div>
 
                <div className="delivery-extra">
                    <div className="delivery-extra-title">추가정보</div>
                    <TextArea borderColor="gray" value={addInfo} onChange={setAddInfo} placeholder="추가로 알릴 내용을 적어주세요." />
                </div>
            </div>
 
            <div className="path-setup-button">
                <CustomButton name={submitting ? "등록 중..." : "작성완료"} color="#FD5D35" fontColor="#FFFFFF" size="lg" onClick={submitting ? undefined : handleSubmit} />
            </div>
 
            {/* 주소 검색 오버레이 — searchTarget이 있을 때만 */}
            {searchTarget && (
                <div className="postcode-overlay" onClick={() => setSearchTarget(null)}>
                    <div className="postcode-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="postcode-header">
                            <span>{searchTarget === 'start' ? '출발지' : '도착지'} 검색</span>
                            <PathXButton onClick={() => setSearchTarget(null)} />
                        </div>
                        <DaumPostcode onComplete={handleComplete} style={{ flex: 1 }} />
                    </div>
                </div>
            )}
        </CustomDiv>
    )
}
 
export default PathSetup