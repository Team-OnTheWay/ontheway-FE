import './Agree.css'
import { Arrow } from '../components/CustomIcon.tsx'
import { useState } from 'react'
import CustomButton from '../components/CustomButton.tsx'
import CustomTopAppBar from '../components/CustomTopAppBar'
import { Navigate, useNavigate } from 'react-router-dom'
import CustomDiv from '../components/CustomDiv.tsx'
import { User } from '../api/User'
import { useSignupDraft } from '../store/useSignupDraft'
import { errorMessage } from '../utils/apiFormat'

// 약관 상세 (기능명세서의 약관 링크). 인덱스는 아래 약관 항목 순서와 같다
const TERMS_URL: Record<number, string> = {
    1: 'https://docs.google.com/forms/d/e/1FAIpQLScTPUZX2C7m_lGB6zgMebd40xC7Jpyu1ghRKeYD6-_97aKAqg/viewform',   // 서비스 이용약관
    2: 'https://docs.google.com/forms/d/e/1FAIpQLSd_LqJRK-5d8T7rYiozevUFt20hVwGSGvcvsf-_2R0d4Qrl6Q/viewform',   // 개인정보 수집·이용
    3: 'https://docs.google.com/forms/d/e/1FAIpQLScdgEJX8hyr2EOVaOP-L71NFo-B5rYPCZ_7BDxHf52G9F_PvQ/viewform',   // 위치기반서비스 이용약관
    4: 'https://docs.google.com/forms/d/e/1FAIpQLSffKz6Q1P4p1u_Iqm-wYjpFtHiis4ocjcDAQ1i9UqkquiurHg/viewform',   // 마케팅
    5: 'https://docs.google.com/forms/d/e/1FAIpQLSd_Tn0ic98ZMACNIpl7DTlpLlvjwcSGcvrUa4DDOYrSMCIWBg/viewform',   // 개인정보 제3자 제공
}

function Agree(){
    const navigate = useNavigate();

    // 회원가입에서 입력한 값 (회원가입 -> 약관동의 순서, 가입 요청은 여기서 보낸다)
    const { draft, clear } = useSignupDraft();
    const [agreed, setAgreed] = useState([false, false, false, false, false, false])
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)   // 가입 완료 후에는 아래 '회원가입 정보 없음' 처리를 하지 않는다

    function toggleAgree(index: number){
        setAgreed(prev => prev.map((value, i) => i === index ? !value : value))
    }

    function toggleAll(){
        setAgreed(prev => prev.map(() => !prev.every(Boolean)))
    }

    // 화살표: 약관 상세를 새 탭으로 (행을 누르면 동의가 토글되므로 전파 막기)
    function openTerms(e: React.MouseEvent, index: number){
        e.stopPropagation()
        window.open(TERMS_URL[index], '_blank', 'noopener,noreferrer')
    }

    const isMandatoryChecked = agreed[0] && agreed[1] && agreed[2] && agreed[3];

    const handleNextClick = async () => {
        if (!isMandatoryChecked || !draft || submitting) return
        setSubmitting(true)
        try {
            await new User().signUp({
                userId: draft.id,
                userName: draft.name,
                birthday: draft.birth,
                email: draft.email,
                password: draft.password,
                nickName: draft.nickname,
            })
            alert('회원가입이 완료되었습니다!')
            setDone(true)
            clear()
            navigate('/login', { replace: true })
        } catch (error) {
            alert(errorMessage(error, '회원가입에 실패했습니다. 입력한 정보를 확인해주세요.'))
        } finally {
            setSubmitting(false)
        }
    }

    // 회원가입 정보 없이 바로 들어오면 회원가입부터
    if (!draft && !done) return <Navigate to="/signup" replace />

    return(
        <>
        <CustomDiv pullToRefresh={false}>
            <CustomTopAppBar
                    title="약관동의"
                    variant="large"
                    subtitle="서비스 이용을 위해 약관에 동의해 주세요."
                    />
            <div className='agree-page-hug'>
                
                <div className={`all-agree ${agreed.every(Boolean) ? 'checked' : ''}`} onClick={toggleAll}>
                    <div className='check-icon'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 9L10.5 14.5L8 12" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p>약관 전체 동의</p>
                </div>
                <div className={`one-agree ${agreed[0] ? 'checked' : ''}`} onClick={() => toggleAgree(0)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(필수) 만 14세 이상 확인</p>
                </div>
                <div className={`one-agree ${agreed[1] ? 'checked' : ''}`} onClick={() => toggleAgree(1)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(필수) 이용약관 동의</p>
                    <button type="button" className="agree-detail-arrow" aria-label="서비스 이용약관 보기" onClick={(e) => openTerms(e, 1)}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[2] ? 'checked' : ''}`} onClick={() => toggleAgree(2)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(필수) 개인정보 수집 이용 동의</p>
                    <button type="button" className="agree-detail-arrow" aria-label="개인정보 수집 이용 상세 보기" onClick={(e) => openTerms(e, 2)}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[3] ? 'checked' : ''}`} onClick={() => toggleAgree(3)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(필수) 위치기반 서비스 이용 동의</p>
                    <button type="button" className="agree-detail-arrow" aria-label="위치기반 서비스 상세 보기" onClick={(e) => openTerms(e, 3)}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[4] ? 'checked' : ''}`} onClick={() => toggleAgree(4)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                        <p>(선택) 마케팅 알림 수신 동의</p>
                    <button type="button" className="agree-detail-arrow" aria-label="마케팅 알림 수신 상세 보기" onClick={(e) => openTerms(e, 4)}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[5] ? 'checked' : ''}`} onClick={() => toggleAgree(5)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(선택) 개인정보 제3자 제공 동의</p>
                    <button type="button" className="agree-detail-arrow" aria-label="개인정보 제3자 제공 상세 보기" onClick={(e) => openTerms(e, 5)}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                    
                </div>
                 <div className='agree-button'>
                    <CustomButton name={submitting ? "가입 중..." : "동의하고 가입 완료"} color={isMandatoryChecked ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={handleNextClick}/>
                </div>
            </div>
        </CustomDiv>
        </>
    )
}

export default Agree