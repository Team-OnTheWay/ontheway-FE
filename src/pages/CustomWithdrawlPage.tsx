import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomReasonSelect from '../components/CustomReasonSelect'
import CustomButton from '../components/CustomButton'
import './CustomWithdrawlPage.css'
import CustomDiv from '../components/CustomDiv'
import { WarnIcon } from '../components/CustomIcon'
import TextField from '../components/TextField'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../api/User'
import { useAuthStore } from '../store/useAuthStore'
import { errorMessage } from '../utils/apiFormat'

const WITHDRAWAL_REASONS = [
    '서비스 이용 빈도가 낮아요.',
    '다른 서비스를 이용할 예정이에요.',
    '원하는 배송 경로가 부족해요.',
    '서비스가 기대와 달라요.',
    '개인정보 및 안전이 걱정돼요.',
    '기타',
]

function CustomWithdrawalPage() {
    const navigate = useNavigate()
    const setLogout = useAuthStore((state) => state.setLogout)
    const [reason, setReason] = useState<string | null>(null)
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const canSubmit = !!reason && password.length > 0

    // 탈퇴 API는 비밀번호 확인만 받는다 (사유는 서버로 보내지 않음)
    const handleWithdraw = async () => {
        if (!reason) return alert('탈퇴 사유를 선택해주세요.')
        if (!password) return alert('비밀번호를 입력해주세요.')
        if (!confirm('정말 탈퇴하시겠어요? 모든 정보가 삭제되며 복구할 수 없습니다.')) return
        setSubmitting(true)
        try {
            await new User().deleteAccount({ password })
            setLogout()
            alert('탈퇴가 완료되었습니다.')
            navigate('/login', { replace: true })
        } catch (error) {
            alert(errorMessage(error, '탈퇴에 실패했어요. 비밀번호를 확인해주세요.'))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <CustomDiv>
            <CustomTopAppBar variant="centered" title="탈퇴하기" />
            <div className='withdrawal_content'>
                <div className="withdrawal__body">
                    {/* 탈퇴 전 확인 경고 (이 페이지 전용) */}
                    <div className="withdrawal__warning">
                        <div className="withdrawal__warning-title">
                            <WarnIcon />
                            <strong>탈퇴 전 꼭 확인해주세요.</strong>
                        </div>
                        <ul className="withdrawal__warning-list">
                            <li>회원을 탈퇴하면 모든 계정 정보가 삭제되며, 복구할 수 없습니다.</li>
                            <li>작성한 이동경로, 배송 의뢰, 후기 등 모든 데이터가 삭제됩니다.</li>
                        </ul>
                    </div>
    
                    {/* 탈퇴 사유 */}
                    <div className="withdrawal__reason">
                        <p className="withdrawal__reason-label">탈퇴 사유</p>
                        <CustomReasonSelect options={WITHDRAWAL_REASONS} placeholder="탈퇴 사유를 선택해주세요." value={reason} onChange={setReason} />
                    </div>

                    {/* 비밀번호 확인 (탈퇴 API 필수) */}
                    <TextField label="비밀번호 확인" height={48} borderColor="gray" backgroundColor="white"
                        leftLocationIcon={false} placeholder="비밀번호를 입력해주세요." timer={false} rightButton="eye"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
    
                <div className="withdrawal__footer">
                    <CustomButton name={submitting ? "처리 중..." : "탈퇴하기"} color={canSubmit ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={submitting ? undefined : handleWithdraw} />
                </div>
            </div>
        </CustomDiv>
    )
}
 
export default CustomWithdrawalPage