import './Agree.css'
import { Arrow } from '../components/CustomIcon.tsx'
import { useState } from 'react'
import CustomButton from '../components/CustomButton.tsx'
import CustomTopAppBar from '../components/CustomTopAppBar'
import { useNavigate } from 'react-router-dom'
import CustomDiv from '../components/CustomDiv.tsx'

function Agree(){
    const navigate = useNavigate();

    const [agreed, setAgreed] = useState([false, false, false, false, false, false])
    const [opened, setOpened] = useState([false, false, false, false, false, false])

    function toggleAgree(index: number){
        setAgreed(prev => prev.map((value, i) => i === index ? !value : value))
    }

    function toggleAll(){
        setAgreed(prev => prev.map(() => !prev.every(Boolean)))
    }

    function toggleOpen(index: number){
        setOpened(prev => prev.map((value, i) => i === index ? !value : value))
    }

    const isMandatoryChecked = agreed[0] && agreed[1] && agreed[2] && agreed[3];

    const handleNextClick = () => {
        if (isMandatoryChecked) {
            navigate('/signup');
        }
    }

    return(
        <>
        <CustomDiv>
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
                    <button type="button" className={`agree-detail-arrow ${opened[1] ? 'open' : ''}`} aria-label="이용약관 상세 보기" aria-expanded={opened[1]} onClick={(e) => { e.stopPropagation(); toggleOpen(1) }}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[2] ? 'checked' : ''}`} onClick={() => toggleAgree(2)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(필수) 개인정보 수집 이용 동의</p>
                    <button type="button" className={`agree-detail-arrow ${opened[2] ? 'open' : ''}`} aria-label="개인정보 수집 이용 상세 보기" aria-expanded={opened[2]} onClick={(e) => { e.stopPropagation(); toggleOpen(2) }}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[3] ? 'checked' : ''}`} onClick={() => toggleAgree(3)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(필수) 위치기반 서비스 이용 동의</p>
                    <button type="button" className={`agree-detail-arrow ${opened[3] ? 'open' : ''}`} aria-label="위치기반 서비스 상세 보기" aria-expanded={opened[3]} onClick={(e) => { e.stopPropagation(); toggleOpen(3) }}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[4] ? 'checked' : ''}`} onClick={() => toggleAgree(4)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                        <p>(선택) 마케팅 알림 수신 동의</p>
                    <button type="button" className={`agree-detail-arrow ${opened[4] ? 'open' : ''}`} aria-label="마케팅 알림 수신 상세 보기" aria-expanded={opened[4]} onClick={(e) => { e.stopPropagation(); toggleOpen(4) }}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                </div>
                <div className={`one-agree ${agreed[5] ? 'checked' : ''}`} onClick={() => toggleAgree(5)}>
                    <div className='arrow-check'><Arrow width={36} height={36} strokeWidth={2}/></div>
                    <p>(선택) 개인정보 제3자 제공 동의</p>
                    <button type="button" className={`agree-detail-arrow ${opened[5] ? 'open' : ''}`} aria-label="개인정보 제3자 제공 상세 보기" aria-expanded={opened[5]} onClick={(e) => { e.stopPropagation(); toggleOpen(5) }}>
                        <Arrow width={36} height={36} strokeWidth={2}/>
                    </button>
                    
                </div>
                 <div className='agree-button'>
                    <CustomButton name="동의하고 가입 완료" color={isMandatoryChecked ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={handleNextClick}/>
                </div>
            </div>
        </CustomDiv>
        </>
    )
}

export default Agree