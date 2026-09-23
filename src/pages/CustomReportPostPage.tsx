import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomList from '../components/CustomList'
import CustomCheckbox from '../components/CustomCheckbox'
import TextArea from '../components/TextArea'
import CustomButton from '../components/CustomButton'
import './CustomReportPostPage.css'
import CustomDiv from '../components/CustomDiv'
import { Report } from '../api/Report'
import { useReportCategories, type ReportCategory } from '../hooks/useReportCategories'
import { errorMessage } from '../utils/apiFormat'

// 화면 문구 -> 서버 신고 유형 코드
const REASONS: { label: string; code: ReportCategory }[] = [
    { label: '허용되지 않은 물품 또는 위험 물품을 요청합니다.', code: 'PROHIBITED_ITEM' },
    { label: '물품 정보와 사진이 물품 내용과 다릅니다.', code: 'INFO_MISMATCH' },
    { label: '같은 내용의 게시글을 반복해서 올렸습니다.', code: 'DUPLICATE_POSTING' },
    { label: '광고·홍보 또는 서비스와 무관한 내용을 게시했습니다.', code: 'ADVERTISEMENT' },
    { label: '욕설·협박 또는 부적절한 언행을 했습니다.', code: 'ABUSIVE_LANGUAGE' },
]

type BoardType = 'DELIVERY' | 'PRODUCT' | 'USER'

// /board/report?boardId=3&boardType=DELIVERY
function CustomReportPostPage() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const boardId = Number(params.get('boardId')) || null
    const boardType = (params.get('boardType') as BoardType | null) ?? 'DELIVERY'
    const { selected, toggle } = useReportCategories()
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!boardId) return alert('신고할 게시글 정보가 없어요. 게시글에서 다시 시도해주세요.')
        if (selected.length === 0) return alert('신고 사유를 선택해주세요.')
        setSubmitting(true)
        try {
            await new Report().board({ boardId, boardType, categories: selected, content: content.trim() || undefined })
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
            <CustomTopAppBar variant="centered" title="게시글 신고" />

            <div className="report__body">
                {/* 신고 사유 선택 */}
                <div className="report__section">
                    <CustomList variant="list03" label="신고 사유를 선택해주세요." />
                    <p className="report__hint">최대 3개까지 선택가능</p>
                </div>

                <div className="report__checks">
                    {REASONS.map(reason => (
                        <CustomCheckbox key={reason.code} label={reason.label} size="sm"
                            checked={selected.includes(reason.code)}
                            onChange={(checked) => toggle(reason.code, checked)} />
                    ))}
                </div>

                <div className="report__area">
                    <p className="report__area-label">신고 사유</p>
                    <TextArea borderColor="gray" value={content} onChange={setContent} placeholder="신고 사유를 적어주세요." />
                </div>
            </div>

            <div className="report__footer">
                <CustomButton name={submitting ? "접수 중..." : "신고하기"} color={selected.length ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={submitting ? undefined : handleSubmit} />
            </div>
        </CustomDiv>
    )
}

export default CustomReportPostPage
