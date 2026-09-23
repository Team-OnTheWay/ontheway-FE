import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfile from '../components/CustomProfile'
import CustomRouteInfo from '../components/CustomRouteInfo'
import CustomProgressStep, { type Step } from '../components/CustomProgressStep'
import CustomList from '../components/CustomList'
import CustomAccordion from '../components/CustomAccordion'
import TextArea from '../components/TextArea'
import CustomButton from '../components/CustomButton'
import EmptyState from '../components/EmptyState'
import { CardIcon, CheckSmallIcon, MegaphoneIcon, PackageIcon, Truck } from '../components/CustomIcon'
import './CustomRouteDetailPage.css'
import CustomDiv from '../components/CustomDiv';
import CustomProfileCard from '../components/CustomProfileCard';
import RouteMap from "../components/RouteMap";
import { Delivery } from '../api/Delivery'
import { Request as RequestApi } from '../api/Request'
import { Order } from '../api/Order'
import { History } from '../api/History'
import type { DeliveryDetailResponseDto, ProcessRequestDto } from '../api/data-contracts'
import {
    errorMessage, formatDate, formatDateTime, formatKoreanDate, formatNumber, formatTime, paymentLabel,
    STATUS_LABEL, type DeliveryStatus,
} from '../utils/apiFormat'

// GET /request/list/{deliveryId} 응답 항목 (스웨거에 형태가 없어 서버 코드 기준)
interface RequestItem {
    requestId: number
    requesterName: string
    requesterNickname: string
    requesterImage: string | null
    productDeliveryAddress: string
    deliveryDestination: string
    itemName: string
    itemInfo: string
    deliveryFee: number
    receivingTime: string
    desiredDeliveryTime: string
    paymentType: string
    createdAt: string
}

// 이 글에서의 내 역할. 게시자(전달자) / 매칭된 의뢰자 / 그 외
type Role = 'owner' | 'requester' | 'viewer'

/* =========================================================
   진행 단계
   ========================================================= */

const FLOW: DeliveryStatus[] = ['MATCHING_WAITING', 'PICKING_UP', 'DELIVERY_WAITING', 'DELIVERING', 'COMPLETION_REQUESTED', 'COMPLETED']

// [완료 제목, 완료 설명], [진행 중 제목, 진행 중 설명] (피그마 문구)
const STEP_TEXT: Record<string, { done: [string, string]; current: [string, string] }> = {
    MATCHING_WAITING:     { done: ['매칭완료', '매칭이 완료되었어요.'],              current: ['매칭대기중', '의뢰 요청을 확인하고 있어요.'] },
    PICKING_UP:           { done: ['픽업완료', '물품을 전달받았어요.'],              current: ['픽업중', '물품을 전달받을 예정이에요.'] },
    DELIVERY_WAITING:     { done: ['배송 대기 중', '배송을 시작했어요.'],            current: ['배송 대기 중', '배송을 준비하고 있어요.'] },
    DELIVERING:           { done: ['배송 중', '물품 전달을 마쳤어요.'],              current: ['배송 중', '목적지로 이동 중이에요.'] },
    COMPLETION_REQUESTED: { done: ['배송 완료 확인 요청', '배송 완료 확인을 받았어요.'], current: ['배송 완료 확인 요청', '배송 완료 확인을 기다리고 있어요.'] },
    COMPLETED:            { done: ['배송완료', '배송이 완료되었어요.'],              current: ['배송완료', '배송이 완료되었어요.'] },
}

// 서버는 매칭 전(주문 없음)에도 currentDeliveryStatus 를 DELIVERY_WAITING 으로 준다.
// 주문이 없으면(상태 이력·의뢰자 정보 없음) 매칭대기중으로 본다
function effectiveStatus(detail: DeliveryDetailResponseDto): DeliveryStatus {
    const hasOrder = (detail.deliveryStatusHistory?.length ?? 0) > 0 || !!detail.requesterInfo
    if (!hasOrder) return 'MATCHING_WAITING'
    return (detail.currentDeliveryStatus ?? 'MATCHING_WAITING') as DeliveryStatus
}

// 취소·중단이 어느 단계에서 일어났는지
//  - 취소는 픽업중에만 가능
//  - 중단은 배송 대기 중·배송 중에만 가능 (배송 완료 확인 요청 이후에는 중단이 없다).
//    서버가 중단 시점을 주지 않아서, 배송 예정 시각(이때 서버가 배송 중으로 바꾼다)이 지났으면 배송 중으로 본다
function stoppedStage(detail: DeliveryDetailResponseDto, status: DeliveryStatus): DeliveryStatus | null {
    if (status === 'CANCELED') return 'PICKING_UP'
    if (status !== 'FAILED') return null
    const start = detail.deliveryDate ? new Date(detail.deliveryDate).getTime() : NaN
    return !Number.isNaN(start) && Date.now() >= start ? 'DELIVERING' : 'DELIVERY_WAITING'
}

// 현재 상태로 진행 단계 목록을 만든다. 중단·취소는 멈춘 단계 자리에 끼워 넣고 뒤 단계는 '진행 전'으로 둔다
function buildSteps(detail: DeliveryDetailResponseDto): Step[] {
    const status = effectiveStatus(detail)
    const matchedAt = formatDateTime(detail.deliveryStatusHistory?.[0]?.deliveryDate)   // 이력 날짜 = 매칭 시각
    const done = (s: DeliveryStatus): Step => ({
        title: STEP_TEXT[s].done[0], description: STEP_TEXT[s].done[1], status: 'done',
        meta: s === 'MATCHING_WAITING' ? matchedAt : undefined,
    })
    const pending = (s: DeliveryStatus): Step => ({ title: STEP_TEXT[s].current[0], description: '아직 진행 전이에요.', status: 'pending' })

    const stage = stoppedStage(detail, status)
    if (stage) {
        const at = FLOW.indexOf(stage)
        const stop: Step = status === 'CANCELED'
            ? { title: '배송취소', description: '배송이 취소되었어요.', status: 'canceled' }
            : { title: '배송중단', description: '배송이 완료되지 못했어요.', status: 'canceled' }
        // 취소: 매칭완료 -> 배송취소 -> 픽업중(진행 전)…
        // 중단: … -> 멈춘 단계(회색 트럭) -> 배송중단 -> 다음 단계(진행 전)…
        const halted: Step[] = status === 'CANCELED' ? [] : [{
            title: STEP_TEXT[stage].current[0], description: STEP_TEXT[stage].current[1], status: 'halted',
        }]
        const nextFrom = status === 'CANCELED' ? at : at + 1
        return [
            ...FLOW.slice(0, at).map(done),
            ...halted,
            stop,
            ...FLOW.slice(nextFrom).map(pending),
        ]
    }

    const reached = FLOW.indexOf(status)
    return FLOW.map((s, i) => {
        if (i < reached || status === 'COMPLETED') return done(s)
        if (i === reached) return { title: STEP_TEXT[s].current[0], description: STEP_TEXT[s].current[1], status: 'current' }
        return pending(s)
    })
}

/* =========================================================
   의뢰 카드 내용
   ========================================================= */

function RequestBody({ r }: { r: RequestItem }) {
    return (
        <div className="request-body">
            <div className="request-body__section">
                <p className="request-body__heading"><PackageIcon />물품정보</p>
                <div className="request-body__row"><span>물품명</span><span>{r.itemName}</span></div>
                <div className="request-body__row"><span>물품 전달</span><span>{formatDateTime(r.receivingTime)}</span></div>
                <div className="request-body__row"><span>상세 설명</span><span>{r.itemInfo}</span></div>
            </div>
            <div className="request-body__section">
                <p className="request-body__heading"><Truck width={20} height={20} stroke="#FD5D35" />경로정보</p>
                <div className="request-body__row"><span>물건수령지</span><span>{r.productDeliveryAddress}</span></div>
                <div className="request-body__row"><span>배송목적지</span><span>{r.deliveryDestination}</span></div>
                <div className="request-body__row"><span>배송 날짜</span><span>{formatDateTime(r.desiredDeliveryTime)}</span></div>
            </div>
            <div className="request-body__section">
                <p className="request-body__heading"><CardIcon />결제정보</p>
                <div className="request-body__row"><span>결제시점</span><span>{paymentLabel(r.paymentType)}</span></div>
            </div>
            <p className="request-body__agree"><CheckSmallIcon />위 허용금지 물품 기준과 포장 책임 범위를 확인하였으며 동의하였습니다.</p>
        </div>
    )
}

// 매칭된 의뢰(상세 응답의 requesterInfo)를 카드 모양으로
function matchedRequest(detail: DeliveryDetailResponseDto): RequestItem | null {
    const info = detail.requesterInfo
    if (!info?.userName) return null
    return {
        requestId: 0, requesterName: info.userName, requesterNickname: '', requesterImage: info.userImage ?? null,
        productDeliveryAddress: info.productDeliveryAddress ?? '', deliveryDestination: info.deliveryDestination ?? '',
        itemName: info.productInfo ?? '', itemInfo: info.productInfo ?? '', deliveryFee: info.deliveryFee ?? 0,
        receivingTime: info.receivingTime ?? '', desiredDeliveryTime: info.desiredDeliveryTime ?? '',
        paymentType: info.paymentType ?? '', createdAt: detail.deliveryStatusHistory?.[0]?.deliveryDate ?? '',
    }
}

/* =========================================================
   페이지
   ========================================================= */

const PROOF_INPUT_ID = 'route-detail-proof-image'

// 상세 + 내 역할을 한 번에 불러온다
async function fetchRoute(deliveryId: number) {
    const detailPromise = new Delivery().detail1({ deliveryDetailRequestDto: { deliveryId } })
        .then(res => ({ detail: res.data.data ?? null, error: '' }))
        .catch(err => ({ detail: null, error: errorMessage(err, '게시글을 불러오지 못했어요.') }))

    // 역할 판단: 의뢰 요청 목록은 게시자만 볼 수 있다(아니면 403).
    // 게시자가 아니면 내 이용내역(의뢰·취소/중단)에 이 글이 있을 때 매칭된 의뢰자로 본다
    let role: Role
    let requests: RequestItem[] = []
    try {
        const res = await new RequestApi().deliveryRequestList(deliveryId)
        requests = (res.data.data as { requestDeliveryList?: RequestItem[] } | undefined)?.requestDeliveryList ?? []
        role = 'owner'
    } catch {
        const page = { historyListRequestDto: { page: 0, size: 50 } }
        const lists = await Promise.allSettled([new History().requestList(page), new History().cancelList(page)])
        const mine = lists.some(r => r.status === 'fulfilled' && (r.value.data.data?.historyList ?? []).some(h => h.deliveryId === deliveryId))
        role = mine ? 'requester' : 'viewer'
    }
    return { ...(await detailPromise), role, requests }
}

function CustomRouteDetailPage() {
    const navigate = useNavigate();
    const deliveryId = Number(useParams().id)

    const [detail, setDetail] = useState<DeliveryDetailResponseDto | null>(null)
    const [error, setError] = useState('')
    const [role, setRole] = useState<Role>('viewer')
    const [requests, setRequests] = useState<RequestItem[]>([])
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null)
    const [stopReason, setStopReason] = useState('')
    const [proof, setProof] = useState<File | null>(null)
    const [busy, setBusy] = useState(false)

    // 처리 후 version 을 올려 다시 불러온다
    const [version, setVersion] = useState(0)
    const load = () => setVersion(v => v + 1)

    useEffect(() => {
        if (!deliveryId) return
        let cancelled = false
        fetchRoute(deliveryId).then(result => {
            if (cancelled) return
            setDetail(result.detail)
            setError(result.error)
            setRole(result.role)
            setRequests(result.requests)
            setSelectedRequestId(prev => prev ?? result.requests[0]?.requestId ?? null)
        })
        return () => { cancelled = true }
    }, [deliveryId, version])

    // 고른 증빙 사진 미리보기
    const proofPreview = useMemo(() => proof ? URL.createObjectURL(proof) : null, [proof])
    useEffect(() => () => { if (proofPreview) URL.revokeObjectURL(proofPreview) }, [proofPreview])

    // 배송 진행 처리 (수락 / 픽업 완료 / 취소 / 중단 / 완료 요청 / 완료 확인)
    const process = async (dto: Omit<ProcessRequestDto, 'deliveryId'>, image?: File, done = '처리되었습니다.') => {
        setBusy(true)
        try {
            await new Order().process({ processRequestDto: { deliveryId, ...dto }, image })
            alert(done)
            setProof(null)
            load()
        } catch (err) {
            alert(errorMessage(err, '처리에 실패했어요.'))
        } finally {
            setBusy(false)
        }
    }

    const accept = () => {
        const target = requests.find(r => r.requestId === selectedRequestId)
        if (!target) return alert('수락할 의뢰를 선택해주세요.')
        if (confirm(`${target.requesterNickname || target.requesterName}님의 의뢰를 수락할까요?`)) {
            process({ requestId: target.requestId }, undefined, '의뢰를 수락했습니다.')
        }
    }

    // 의뢰 거절 API가 아직 없다
    const reject = () => alert('의뢰 거절은 아직 지원되지 않아요. 수락하지 않은 의뢰는 다른 의뢰를 수락하면 자동으로 거절됩니다.')

    const cancel = () => {
        const reason = prompt('배송 취소 사유를 입력해주세요.')?.trim()
        if (reason) process({ cancelReason: reason }, undefined, '배송이 취소되었습니다.')
    }

    const stop = () => {
        if (!stopReason.trim()) return alert('배송중단사유를 입력해주세요.')
        if (confirm('배송을 중단할까요?')) process({ failReason: stopReason.trim() }, undefined, '배송이 중단되었습니다.')
    }

    const pickProof = () => document.getElementById(PROOF_INPUT_ID)?.click()

    const requestCompletion = () => {
        if (!proof) {
            alert('배송 완료 사진을 먼저 등록해주세요.')
            pickProof()
            return
        }
        process({}, proof, '배송 완료 확인을 요청했습니다.')
    }

    if (!detail) {
        return (
            <CustomDiv backgroundColor='#f3f4f6'>
                <CustomTopAppBar variant="centered" title="가는길" />
                <p className="list-message">{error || '불러오는 중이에요.'}</p>
            </CustomDiv>
        )
    }

    const status = effectiveStatus(detail)
    const matched = status !== 'MATCHING_WAITING'
    const isOwner = role === 'owner'
    const isParticipant = role !== 'viewer'
    const stopped = status === 'FAILED' || status === 'CANCELED'
    const stopReasonText = status === 'FAILED' ? detail.deliveryFail?.failReason : detail.deliveryCancel?.cancelReason
    const photo = detail.deliverySuccessCheck?.deliverySuccessCheckImage
    const matchedCard = matched ? matchedRequest(detail) : null
    // 픽업중 ~ 배송중: 사진 자리, 확인요청 ~ 완료: 등록된 사진
    const photoPhase = status === 'PICKING_UP' || status === 'DELIVERY_WAITING' || status === 'DELIVERING'
    const photoDone = status === 'COMPLETION_REQUESTED' || status === 'COMPLETED'

    // 상태·역할별 하단 버튼 (피그마)
    const buttons: { name: string; primary?: boolean; onClick: () => void }[] = []
    if (status === 'MATCHING_WAITING') {
        if (isOwner) {
            buttons.push({ name: '거절하기', onClick: reject })
            buttons.push({ name: '수락하기', primary: true, onClick: accept })
        } else {
            buttons.push({ name: '의뢰하기', primary: true, onClick: () => navigate(`/delivery/request?deliveryId=${deliveryId}`) })
        }
    } else if (status === 'PICKING_UP') {
        if (isOwner) {
            buttons.push({ name: '취소', onClick: cancel })
            buttons.push({ name: '픽업완료', primary: true, onClick: () => process({}, undefined, '픽업이 완료되었습니다.') })
        } else if (role === 'requester') {
            buttons.push({ name: '배송취소', primary: true, onClick: cancel })
        }
    } else if (status === 'DELIVERY_WAITING' && isOwner) {
        buttons.push({ name: '배송중단', primary: true, onClick: stop })
    } else if (status === 'DELIVERING' && isOwner) {
        buttons.push({ name: '배송중단', onClick: stop })
        buttons.push({ name: '확인요청', primary: true, onClick: requestCompletion })
    } else if (status === 'COMPLETION_REQUESTED' && role === 'requester') {
        buttons.push({ name: '배송완료확인', primary: true, onClick: () => process({}, undefined, '배송이 완료되었습니다.') })
    }

    return (
        <CustomDiv backgroundColor='#f3f4f6' footerElement={buttons.length > 0 && (
            <div className="route-detail__footer">
                <div className="route-detail__footer-row">
                    {buttons.map(b => (
                        <div className="route-detail__footer-slot" key={b.name}>
                            <CustomButton name={busy ? '처리 중...' : b.name} color={b.primary ? '#fd5d35' : '#FEF1ED'} fontColor={b.primary ? '#ffffff' : '#fd5d35'} size="lg" onClick={busy ? undefined : b.onClick} />
                        </div>
                    ))}
                </div>
            </div>
        )}>
            {isOwner
                ? <CustomTopAppBar variant="centered" title={`${detail.userName ?? ''}님의 가는길`} />
                : <CustomTopAppBar variant="meta" title={`${detail.userName ?? ''}님의 가는길`} meta="신고"
                    onClick={() => navigate(`/board/report?boardId=${deliveryId}&boardType=DELIVERY`)} />}

            <div className="route-detail__body">
                <CustomProfileCard
                    nickname={detail.userName ?? ''}
                    date={formatDate(detail.createdAt)}
                    rateing={0}
                    review={0}
                    chipElement={null}
                    profileElement={detail.userImage
                        ? <img className="route-detail__avatar" src={detail.userImage} alt="" />
                        : <CustomProfile width={40} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />}
                    onClick={() => navigate('/user/report', { state: { name: detail.userName, date: formatDate(detail.createdAt) } })}
                />

                <CustomRouteInfo
                    startAddr={detail.startAddress ?? ''}
                    endAddr={detail.endAddress ?? ''}
                    date={formatKoreanDate(detail.deliveryDate)}
                    time={`${formatTime(detail.deliveryDate)} - ${formatTime(detail.estimatedDeliveryTime)}`}
                    price={`${formatNumber(detail.hopePrice)}원`}
                />

                {detail.addInfo && (
                    <div className="route-detail__extra">
                        <CustomList variant="list03" label="추가정보" />
                        <p className="route-detail__extra-text">{detail.addInfo}</p>
                    </div>
                )}

                <CustomProgressStep steps={buildSteps(detail)} />

                {/* 취소/중단 사유 */}
                {stopped && (
                    <div className="route-detail__notice">
                        <MegaphoneIcon />
                        <div>
                            <p className="route-detail__notice-time">{STATUS_LABEL[status]}</p>
                            <p className="route-detail__notice-msg">{stopReasonText || '사유가 등록되지 않았어요.'}</p>
                        </div>
                    </div>
                )}

                {/* 매칭 전: 게시자에게 들어온 의뢰 요청 (카드를 눌러 하나 선택, +는 펼치기) */}
                {!matched && isOwner && (
                    <div className="route-detail__requests">
                        <CustomList variant="list03" label="배송 의뢰요청" />
                        {requests.length === 0 && <p className="list-message">아직 들어온 의뢰 요청이 없어요.</p>}
                        {requests.map((r, i) => (
                            <CustomAccordion key={r.requestId} clientName={r.requesterNickname || r.requesterName}
                                itemName={formatDate(r.createdAt)} price={formatNumber(r.deliveryFee)} defaultOpen={i === 0}
                                selected={r.requestId === selectedRequestId}
                                onSelect={() => setSelectedRequestId(r.requestId)}>
                                <RequestBody r={r} />
                            </CustomAccordion>
                        ))}
                    </div>
                )}

                {/* 매칭 후: 매칭된 의뢰 (게시자·의뢰자에게만) */}
                {matchedCard && isParticipant && (
                    <div className="route-detail__requests">
                        <CustomList variant="list03" label="배송 의뢰요청" />
                        <CustomAccordion clientName={matchedCard.requesterName} itemName={formatDate(matchedCard.createdAt)}
                            price={formatNumber(matchedCard.deliveryFee)} defaultOpen>
                            <RequestBody r={matchedCard} />
                        </CustomAccordion>
                    </div>
                )}

                {/* 배송 중: 지도 */}
                {status === 'DELIVERING' && isParticipant && detail.startAddress && detail.endAddress && (
                    <RouteMap startAddr={detail.startAddress} endAddr={detail.endAddress} />
                )}

                {/* 게시자: 배송중단사유 (배송 대기 중·배송 중) */}
                {isOwner && (status === 'DELIVERY_WAITING' || status === 'DELIVERING') && (
                    <div className="route-detail__stop-reason">
                        <p className="route-detail__stop-label">배송중단사유</p>
                        <TextArea borderColor="gray" value={stopReason} onChange={setStopReason} placeholder="배송중단사유를 적어주세요." />
                    </div>
                )}

                {/* 사진: 픽업중~배송중에는 등록 전 안내(게시자는 배송 중에 눌러서 등록), 확인요청부터는 등록된 사진 */}
                {isParticipant && photoPhase && (
                    proofPreview
                        ? <button type="button" className="route-detail__photo-button" onClick={pickProof}>
                            <img className="route-detail__photo" src={proofPreview} alt="등록할 배송 완료 사진" />
                          </button>
                        : isOwner
                            ? <div className={status === 'DELIVERING' ? 'route-detail__photo-pick' : undefined}
                                onClick={status === 'DELIVERING' ? pickProof : undefined}>
                                <EmptyState type="photo" description="지금, 새로운 사진을 등록해보세요." />
                              </div>
                            : <EmptyState type="photo" description="전달자가 사진을 등록하면 확인할 수 있어요." />
                )}
                {isParticipant && photoDone && (
                    photo
                        ? <img className="route-detail__photo" src={photo} alt="배송 완료 사진" />
                        : <div className="route-detail__placeholder">등록된 사진을 불러오지 못했어요.</div>
                )}
                {status === 'COMPLETION_REQUESTED' && role === 'requester' && (
                    <p className="route-detail__confirm-note">의뢰자 미수락시, 요청 이후 72시간 이후 자동 수락됩니다.</p>
                )}

                {/* 배송 완료 사진 선택창 (사진 자리나 확인요청 버튼으로 연다) */}
                <input id={PROOF_INPUT_ID} type="file" accept="image/jpeg,image/png,image/webp" hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ''
                        if (file) setProof(file)
                    }} />
            </div>
        </CustomDiv>
    )
}

export default CustomRouteDetailPage
