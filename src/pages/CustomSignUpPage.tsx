import { useState } from 'react'
import CustomTopAppBar from '../components/CustomTopAppBar'
import TextField from '../components/TextField'
import DateInput from '../components/DateInput'
import CustomButton from '../components/CustomButton'
import './CustomSignUpPage.css'

function CustomSignupPage() {
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [nickname, setNickname] = useState('')

    return (
        <div className="signup">
            <CustomTopAppBar variant="large" title="회원가입" />

            <div className="signup__body">
                {/* 아이디 + 중복확인 */}
                <div className="signup__row">
                    <TextField label="아이디" height={56} borderColor="lightGray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="아이디를 입력해주세요." timer={false} rightButton="none" />
                    <div className="signup__side-btn">중복확인</div>
                </div>

                {/* 이름 */}
                <TextField label="이름" height={56} borderColor="lightGray" backgroundColor="white"
                leftLocationIcon={false} placeholder="이름을 입력해주세요." timer={false} rightButton="none" />

                {/* 생년월일 */}
                <DateInput label="생년월일" borderColor="lightGray" />

                {/* 이메일 + 인증받기 */}
                <div className="signup__row">
                    <TextField label="이메일" height={56} borderColor="lightGray" backgroundColor="white"
                    leftLocationIcon={false} placeholder="이메일을 입력해주세요." timer={false} rightButton="none" />
                    <div className="signup__side-btn">인증받기</div>
                </div>

                {/* 이메일 인증 */}
                <TextField label="이메일 인증" height={56} borderColor="lightGray" backgroundColor="white"
                leftLocationIcon={false} placeholder="인증번호를 입력해주세요." timer={true}
                rightButton="label" rightButtonLabel="재전송" />

                {/* 비밀번호 */}
                <TextField label="비밀번호" height={56} borderColor="lightGray" backgroundColor="white"
                leftLocationIcon={false} placeholder="비밀번호를 입력해주세요." timer={false} rightButton="eye"
                helperText={password.length >= 8 && password.length <= 15 ? undefined : "8~15자리 이내"}
                value={password} onChange={setPassword} />

                {/* 비밀번호 확인 */}
                <TextField label="비밀번호 확인" height={56} borderColor="lightGray" backgroundColor="white"
                leftLocationIcon={false} placeholder="비밀번호를 다시 입력해주세요." timer={false} rightButton="eye"
                helperText={passwordCheck !== '' && password === passwordCheck ? undefined : "비밀번호 일치"}
                value={passwordCheck} onChange={setPasswordCheck} />

                {/* 닉네임 */}
                <TextField label="닉네임" height={56} borderColor="lightGray" backgroundColor="white"
                leftLocationIcon={false} placeholder="닉네임을 입력해주세요." timer={false} rightButton="none"
                helperText={nickname.length >= 1 && nickname.length <= 7 ? undefined : "7자리 이내"}
                value={nickname} onChange={setNickname} />
            </div>

            <div className="signup__footer">
                <CustomButton name="다음으로" color="#fd5d35" fontColor="#ffffff" size="lg" />
            </div>
        </div>
    )
}

export default CustomSignupPage