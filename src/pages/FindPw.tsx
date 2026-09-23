import './FindPw.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../components/TextField.tsx'
import CustomButton from '../components/CustomButton.tsx'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomDiv from '../components/CustomDiv.tsx'
import { User } from '../api/User'
import { errorMessage } from '../utils/apiFormat'

function FindPw(){
    const navigate = useNavigate()
    const [accountId, setAccountId] = useState('')
    const [email, setEmail] = useState('')
    const canSubmit = accountId.trim().length > 0 && email.trim().length > 0

    // 아이디·이메일이 맞으면 서버가 임시 비밀번호를 이메일로 보낸다
    const findPassword = async () => {
        if (!canSubmit) return alert('아이디와 이메일을 입력해주세요.')
        try {
            const res = await new User().findPassword({ accountId, email })
            const message = (res.data.data as { message?: string } | undefined)?.message
            alert(message ?? '임시 비밀번호가 이메일로 발송되었습니다.')
            navigate('/login')
        } catch (error) {
            alert(errorMessage(error, '일치하는 회원 정보를 찾지 못했어요.'))
        }
    }

    return(
        <>
        <CustomDiv>
            <CustomTopAppBar
                title="비밀번호 찾기"
                variant="large"
                subtitle="가입하신 비밀번호를 확인하실 수 있습니다."
                />
            <div className='find-pw-page-hug'>
                <div className='find-pw-input-section'>
                    <div className="email-input">
                        <TextField label="아이디" height={56} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="아이디를 입력해주세요." timer={false} rightButton="none"
                            value={accountId} onChange={(e) => setAccountId(e.target.value)} />
                    </div>
                    <div className="email-input">
                        <TextField label="이메일" height={56} borderColor="gray" backgroundColor="white" leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className="find-pw-button">
                    <CustomButton name="비밀번호 찾기" color={canSubmit ? "#fd5d35" : "#BABABA"} fontColor="#ffffff" size="lg" onClick={findPassword}/>
                </div>
            </div>

            </CustomDiv>
            </>
    )
}

export default FindPw
