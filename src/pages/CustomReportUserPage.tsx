import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomProfileCard from '../components/CustomProfileCard'
import CustomProfile from '../components/CustomProfile'
import CustomList from '../components/CustomList'
import CustomCheckbox from '../components/CustomCheckbox'
import TextArea from '../components/TextArea'
import CustomButton from '../components/CustomButton'
import './CustomReportUserPage.css'
import CustomDiv from '../components/CustomDiv'
import { Report } from '../api/Report'
import { useReportCategories, type ReportCategory } from '../hooks/useReportCategories'
import { errorMessage } from '../utils/apiFormat'

// 화면 문구 -> 서버 신고 유형 코드
const REASONS: { label: string; code: ReportCategory }[] = [
    { label: '약속한 픽업 또는 전달 시간을 지키지 않았습니다.', code: 'SCHEDULE_VIOLATION' },
    { label: '배송 과정에서 응답하지 않았습니다.', code: 'NO_RESPONSE' },
    { label: '배송비 또는 금전 거래와 관련해 부당한 요구를 했습니다.', code: 'UNFAIR_PAYMENT_DEMAND' },
    { label: '물품을 분실·파손하거나 훼손했습니다.', code: 'ITEM_DAMAGE' },
    { label: '욕설·협박 또는 부적절한 언행을 했습니다.', code: 'ABUSIVE_LANGUAGE' },
    { label: '허위 신원 또는 거래 정보를 제공했습니다.', code: 'FALSE_IDENTITY' },
    { label: '안전을 위협하거나 불안감을 주는 행동을 했습니다.', code: 'SAFETY_THREAT' },
]

// /user/report?userId=7  (신고 대상 이름·날짜는 navigate state { name, date } 로 받는다)
function CustomReportUser() {
    const navigate = useNavigate()
    const userId = Number(useSearchParams()[0].get('userId')) || null
    const target = (useLocation().state ?? {}) as { name?: string; date?: string }
    const { selected, toggle } = useReportCategories()
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!userId) return alert('신고할 회원 정보가 없어요. 게시글에서 다시 시도해주세요.')
        if (selected.length === 0) return alert('신고 사유를 선택해주세요.')
        setSubmitting(true)
        try {
            await new Report().user({ userId, categories: selected, content: content.trim() || undefined })
            alert('신고가 접수되었습니다.')
            navigate(-1)
        } catch (err) {
            alert(errorMessage(err, '신고 접수에 실패했어요.'))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <CustomDiv>
            <CustomTopAppBar variant="centered" title="유저 신고" />

            <div className="report-user__body">
                {/* 신고 대상 프로필 카드 */}
                {target.name && <CustomProfileCard
                    nickname={target.name}
                    date={target.date ?? ''}
                    rateing={0}
                    review={0}
                    chipElement={null}
                    profileElement={<CustomProfile width={40} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />}
                />}

                <div className="report-user__section">
                    <CustomList variant="list03" label="신고 사유를 선택해주세요." />
                    <p className="report-user__hint">최대 3개까지 선택가능</p>
                </div>

                <div className="report-user__checks">
                    {REASONS.map(reason => (
                        <CustomCheckbox key={reason.code} label={reason.label} size="sm"
                            checked={selected.includes(reason.code)}
                            onChange={(checked) => toggle(reason.code, checked)} />
                    ))}
                </div>

                <div className="report-user__area">
                    <p className="report-user__area-label">신고 사유</p>
                    <TextArea borderColor="gray" value={content} onChange={setContent} placeholder="신고 사유를 적어주세요." />
                </div>
            </div>

            <div className="report-user__footer">
                <CustomButton name={submitting ? "접수 중..." : "신고하기"} color={selected.length ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={submitting ? undefined : handleSubmit} />
            </div>
        </CustomDiv>
    )
}

export default CustomReportUser
