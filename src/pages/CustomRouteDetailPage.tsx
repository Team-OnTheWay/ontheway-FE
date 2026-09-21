import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfile from '../components/CustomProfile'
import CustomRouteInfo from '../components/CustomRouteInfo'
import CustomProgressStep, { type Step } from '../components/CustomProgressStep'
import CustomList from '../components/CustomList'
import CustomAccordion from '../components/CustomAccordion'
import EmptyState from '../components/EmptyState'
import TextArea from '../components/TextArea'
import CustomButton from '../components/CustomButton'
import { Truck, Box, CreditCard, Megaphone, ChevronDown, CircleCheck } from '../components/CustomIcon'
import './CustomRouteDetailPage.css'
 
 
 
// 진행 단계 7개 전부 — 완료/현재/취소/대기 네 가지 모양이 모두 보이도록 섞어둠
const ALL_STEPS: Step[] = [
    { title: "매칭완료",           description: "매칭이 완료되었어요.",       status: "done",     meta: "2026.09.17 19:00" },
    { title: "픽업완료",           description: "물품을 전달받았어요.",       status: "done",     meta: "2026.09.21 18:30" },
    { title: "배송 대기 중",       description: "배송을 준비하고 있어요.",    status: "current" },
    { title: "배송중단",           description: "배송이 완료되지 못했어요.",  status: "canceled" },
    { title: "배송 중",            description: "아직 진행 전이에요.",        status: "pending" },
    { title: "배송 완료 확인 요청", description: "아직 진행 전이에요.",        status: "pending" },
    { title: "배송완료",           description: "아직 진행 전이에요.",        status: "pending" },
]
 
type RequestItem = {
    id: number
    clientName: string
    date: string
    price: string
    item: { name: string; handover: string; desc: string }
    route: { pickup: string; dest: string; date: string }
    payment: { timing: string }
}
 
// 의뢰는 개수가 정해져 있지 않고 들어오는 대로 배열로 받습니다
const REQUESTS: RequestItem[] = [
    { id: 1, clientName: "퇴근러", date: "2026.08.17", price: "15,000",
      item: { name: "노트북 파우치", handover: "2026.09.21 18:30", desc: "13인치 노트북파우치입니다." },
      route: { pickup: "인천 연수구 송도과학로 32", dest: "서울 영등포구 국제금융로 10", date: "2026.09.22 09:00 - 10:00" },
      payment: { timing: "선결제" } },
    { id: 2, clientName: "오렌지", date: "2026.09.19", price: "10,000",
      item: { name: "서류 봉투", handover: "2026.09.21 19:00", desc: "A4 서류 한 묶음입니다." },
      route: { pickup: "인천 연수구 송도과학로 32", dest: "서울 영등포구 국제금융로 10", date: "2026.09.22 09:00 - 10:00" },
      payment: { timing: "선결제" } },
    { id: 3, clientName: "동네한바퀴", date: "2026.09.22", price: "5,000",
      item: { name: "소형 택배", handover: "2026.09.21 20:00", desc: "가벼운 소형 상자입니다." },
      route: { pickup: "인천 연수구 송도과학로 32", dest: "서울 영등포구 국제금융로 10", date: "2026.09.22 09:00 - 10:00" },
      payment: { timing: "선결제" } },
]
 
const extraInfo = "자차 이용합니다! 퇴근하면서 이동하는 경로라 시간 맞으면 바로 전달 가능해요. 작은 물품은 여러 개도 가능합니다."
 
/* =========================================================
   하단 블록 (페이지 내부 전용)
   ========================================================= */
 
// 의뢰카드 펼침 내용 — Accordion의 children
function RequestBody({ r }: { r: RequestItem }) {
    return (
        <div className="request-body">
            <div className="request-body__section">
                <p className="request-body__heading"><Box width={18} height={20} strokeWidth={2} stroke="#FD5D35" />물품정보</p>
                <div className="request-body__row"><span>물품명</span><span>{r.item.name}</span></div>
                <div className="request-body__row"><span>물품 전달</span><span>{r.item.handover}</span></div>
                <div className="request-body__row"><span>상세 설명</span><span>{r.item.desc}</span></div>
            </div>
            <div className="request-body__section">
                <p className="request-body__heading"><Truck width={20} height={20} stroke="#FD5D35" />경로정보</p>
                <div className="request-body__row"><span>물건수령지</span><span>{r.route.pickup}</span></div>
                <div className="request-body__row"><span>배송목적지</span><span>{r.route.dest}</span></div>
                <div className="request-body__row"><span>배송 날짜</span><span>{r.route.date}</span></div>
            </div>
            <div className="request-body__section">
                <p className="request-body__heading"><CreditCard width={20} height={20} />결제정보</p>
                <div className="request-body__row"><span>결제시점</span><span>{r.payment.timing}</span></div>
            </div>
            <p className="request-body__agree"><CircleCheck width={16} height={16} fill="#FEF1ED" check="#FD5D35" />위 허용금지 물품 기준과 포장 책임 범위를 확인하였으며 동의하였습니다.</p>
        </div>
    )
}
 
// 지도 / 등록된 사진 자리 — 백엔드 데이터가 들어올 위치만 잡아둠
function Placeholder({ label }: { label: string }) {
    return <div className="route-detail__placeholder">{label}</div>
}
 
/* =========================================================
   페이지 — 나올 수 있는 조각을 전부 한 번씩 보여줍니다
   ========================================================= */
function CustomRouteDetailPage() {
    return (
        <div className="route-detail">
            <CustomTopAppBar variant="meta" title="하루님의 가는길" meta="신고" />
 
            <div className="route-detail__body">
                {/* ===== 공통 상단 ===== */}
                <div className="route-detail__profile">
                    <CustomProfile width={16} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />
                    <div className="route-detail__profile-text">
                        <p className="route-detail__profile-name">하루</p>
                        <p className="route-detail__profile-date">2026.09.17</p>
                    </div>
                    <ChevronDown width={24} height={24} />
                </div>
 
                <CustomRouteInfo
                    startAddr="인천 연수구 송도과학로 32" startDetail="송도테크노파크IT센터 앞"
                    endAddr="서울 영등포구 국제금융로 10" endDetail="서울국제금융센터 앞"
                    date="9월22일(화)" time="08:00 - 10:00" price="20,000원"
                />
 
                <div className="route-detail__extra">
                    <CustomList variant="list03" label="추가정보" />
                    <p className="route-detail__extra-text">{extraInfo}</p>
                </div>
 
                {/* 진행 단계 7개 전부 */}
                <CustomProgressStep steps={ALL_STEPS} />
 
                {/* 취소/중단 알림 박스 */}
                <div className="route-detail__notice">
                    <Megaphone width={24} height={24} />
                    <div>
                        <p className="route-detail__notice-time">2026.09.22 09:00</p>
                        <p className="route-detail__notice-msg">개인 사정으로 예정 시간에 배송이 어려워 중단했습니다.</p>
                    </div>
                </div>
 
                {/* 배송 의뢰요청 — 의뢰 개수만큼 (첫 카드 펼침) */}
                <div className="route-detail__requests">
                    <CustomList variant="list03" label="배송 의뢰요청" />
                    {REQUESTS.map((r, i) => (
                        <CustomAccordion key={r.id} width={361} clientName={r.clientName} itemName={r.date} price={r.price} defaultOpen={i === 0}>
                            <RequestBody r={r} />
                        </CustomAccordion>
                    ))}
                </div>
 
                {/* 지도 자리 */}
                <Placeholder label="지도" />
 
                {/* 배송중단사유 입력 */}
                <div className="route-detail__stop-reason">
                    <p className="route-detail__stop-label">배송중단사유</p>
                    <TextArea borderColor="lightGray" textcount={0} />
                </div>
 
                {/* 사진 미등록 (문구는 역할별: 게시자 / 피게시자) */}
                <EmptyState type="photo" description="지금, 새로운 사진을 등록해보세요." />
                <EmptyState type="photo" description="전달자가 사진을 등록하면 확인할 수 있어요." />
 
                {/* 등록된 사진 자리 + 확인요청 안내 문구 */}
                <Placeholder label="사진" />
                <p className="route-detail__confirm-note">의뢰자 미수락시, 요청 이후 72시간 이후 자동 수락됩니다.</p>
            </div>
 
            {/* ===== 하단 버튼: 1개짜리 / 2개짜리 ===== */}
            <div className="route-detail__footer">
                <div className="route-detail__footer-row">
                    <div className="route-detail__footer-slot">
                        <CustomButton name="의뢰하기" color="#fd5d35" fontColor="#ffffff" size="lg" />
                    </div>
                </div>
                <div className="route-detail__footer-row route-detail__footer-row--double">
                    <div className="route-detail__footer-slot">
                        <CustomButton name="거절하기" color="#FEF1ED" fontColor="#fd5d35" size="lg" />
                    </div>
                    <div className="route-detail__footer-slot">
                        <CustomButton name="수락하기" color="#fd5d35" fontColor="#ffffff" size="lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default CustomRouteDetailPage