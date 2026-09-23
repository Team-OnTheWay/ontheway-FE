import './FindId.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../components/TextField.tsx'
import CustomButton from '../components/CustomButton.tsx'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomDiv from '../components/CustomDiv.tsx'
import { Email } from '../api/Email'
import { User } from '../api/User'
import { errorMessage } from '../utils/apiFormat'

function FindId(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [isSent, setIsSent] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [timerKey, setTimerKey] = useState(0)

    // 1) 인증번호 보내기
    const sendCode = async () => {
        if (!email.trim()) return alert('이메일을 입력해주세요.')
        try {
            await new Email().sendCode({ email, purpose: 'FIND_ID' })
            setIsSent(true)
            setIsVerified(false)
            setTimerKey(key => key + 1)
            alert('인증번호가 전송되었습니다. 이메일을 확인해주세요.')
        } catch (error) {
            alert(errorMessage(error, '인증번호 전송에 실패했어요.'))
        }
    }

    // 2) 인증번호 확인
    const verifyCode = async () => {
        if (!code.trim() || isVerified) return
        try {
            await new Email().verifyCode({ email, authCode: code, purpose: 'FIND_ID' })
            setIsVerified(true)
            alert('이메일 인증이 완료되었습니다.')
        } catch (error) {
            alert(errorMessage(error, '인증번호가 일치하지 않거나 만료되었습니다.'))
        }
    }

    // 3) 아이디 찾기 (인증을 마친 이메일로만 가능)
    const findId = async () => {
        if (!isVerified) return alert('이메일 인증을 먼저 완료해주세요.')
        try {
            const res = await new User().findId({ email, validCode: code })
            const accountId = (res.data.data as { accountId?: string } | undefined)?.accountId
            alert(accountId ? `가입하신 아이디는 ${accountId} 입니다.` : res.data.message ?? '아이디를 찾았습니다.')
            navigate('/login')
        } catch (error) {
            alert(errorMessage(error, '아이디를 찾지 못했어요.'))
        }
    }

    return(
        <>
        <CustomDiv>
            <CustomTopAppBar
                variant="large"
                title="아이디 찾기"
                subtitle="가입하신 아이디를 확인하실 수 있습니다."
                />
                
            <div className='find-id-page-hug'>
                <div className="email-input email-send-row">
                    <div className="email-send-field">
                        <div className='w-70'>
                            <TextField label="이메일" height={56} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none"
                                value={email} disabled={isVerified}
                                onChange={(e) => { setEmail(e.target.value); setIsSent(false); setIsVerified(false) }} />
                        </div>
                        <div className='w-20'>
                            <CustomButton name={isSent ? '재전송' : '인증받기'} color="#F2F2F2" fontColor="#000000" size="xsm" onClick={sendCode}/>
                        </div>
                    </div>
                </div>
                {isSent && (
                    <div className="email-input">
                        <TextField label="이메일 인증" height={56} borderColor="gray" backgroundColor="white" leftLocationIcon={false}
                            placeholder="인증번호를 입력해주세요." timer={!isVerified} resetKey={timerKey}
                            rightButton="label" rightButtonLabel={isVerified ? '확인완료' : '인증'}
                            rightButtonColor={isVerified ? '#9CA3AF' : '#FD5D35'} rightButtonDisabled={isVerified}
                            value={code} disabled={isVerified}
                            onRightButtonClick={verifyCode}
                            onChange={(e) => setCode(e.target.value)} />
                    </div>
                )}
                <div className="find-id-button">
                    <CustomButton name="아이디 찾기" color={isVerified ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={findId}/>
                </div>
            </div>
        </CustomDiv>
        </>
    )
}

export default FindId
